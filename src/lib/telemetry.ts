/**
 * Agent Telemetry Module
 * 
 * Tracks LLM usage, token consumption, and computed costs for AI agents.
 * Production-ready with error handling and secure parameterized queries.
 */

export interface TelemetryParams {
  session_id: string;
  agent_id: string;
  model_used: string;
  tool_choice?: string | null;
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  input_rate: number;
  output_rate: number;
  cache_write_rate?: number;
  cache_read_rate?: number;
  role_name?: string;
}

export interface TelemetryQueryOptions {
  tenant_id?: string;
  session_id?: string;
  agent_id?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  limit?: number;
}

/**
 * Insert a telemetry record for an LLM call.
 * Uses parameterized queries for security and computes cost automatically.
 */
export async function logTelemetry(
  db: D1Database,
  params: TelemetryParams
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = `tel_${generateId()}`;
    
    const result = await db.prepare(`
      INSERT INTO agent_telemetry (
        id, tenant_id, session_id, agent_id, agent_email,
        provider, model_used, tool_choice,
        metric_type, metric_name, metric_value, unit, timestamp,
        input_tokens, output_tokens,
        cache_creation_input_tokens, cache_read_input_tokens,
        input_rate_per_mtok, output_rate_per_mtok, cache_write_rate_per_mtok, cache_read_rate_per_mtok,
        computed_cost_usd,
        role_name, created_by, metadata_json
      ) VALUES (
        ?1, ?2, ?3, ?4, ?5,
        ?6, ?7, ?8,
        ?9, ?10, ?11, ?12, ?13,
        ?14, ?15,
        ?16, ?17,
        ?18, ?19, ?20, ?21,
        ?22,
        ?23, ?24, ?25
      )
    `).bind(
      id,
      'tenant_sam_primeaux',
      params.session_id,
      params.agent_id,
      'meauxbility@gmail.com',
      'cursor',
      params.model_used,
      params.tool_choice ?? null,
      'cost',
      'llm_call',
      1,
      'call',
      Math.floor(Date.now() / 1000),
      params.input_tokens,
      params.output_tokens,
      params.cache_creation_input_tokens ?? 0,
      params.cache_read_input_tokens ?? 0,
      params.input_rate,
      params.output_rate,
      params.cache_write_rate ?? 0,
      params.cache_read_rate ?? 0,
      computeCost(params),
      params.role_name ?? null,
      'samprimeaux_chatgpt52',
      JSON.stringify({
        billing_email: 'meauxbility@gmail.com',
        operator: 'samprimeaux_chatgpt52',
        repo_base_url: 'https://github.com/InnerAnimal/inneranimalmedia-mcp'
      })
    ).run();

    if (!result.success) {
      return { success: false, error: 'Database insert failed' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Telemetry logging failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Query telemetry records with flexible filtering.
 */
export async function queryTelemetry(
  db: D1Database,
  options: TelemetryQueryOptions = {}
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const {
      tenant_id = 'tenant_sam_primeaux',
      session_id,
      agent_id,
      start_timestamp,
      end_timestamp,
      limit = 100
    } = options;

    const conditions: string[] = ['tenant_id = ?'];
    const params: any[] = [tenant_id];

    if (session_id) {
      conditions.push('session_id = ?');
      params.push(session_id);
    }

    if (agent_id) {
      conditions.push('agent_id = ?');
      params.push(agent_id);
    }

    if (start_timestamp) {
      conditions.push('timestamp >= ?');
      params.push(start_timestamp);
    }

    if (end_timestamp) {
      conditions.push('timestamp <= ?');
      params.push(end_timestamp);
    }

    params.push(limit);

    const result = await db.prepare(`
      SELECT 
        id, session_id, agent_id, model_used, tool_choice,
        metric_type, metric_name, timestamp,
        input_tokens, output_tokens,
        cache_creation_input_tokens, cache_read_input_tokens,
        computed_cost_usd, role_name, metadata_json
      FROM agent_telemetry
      WHERE ${conditions.join(' AND ')}
      ORDER BY timestamp DESC
      LIMIT ?
    `).bind(...params).all();

    return {
      success: true,
      data: result.results ?? []
    };
  } catch (error) {
    console.error('Telemetry query failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get aggregate cost statistics for a session or agent.
 */
export async function getTelemetryStats(
  db: D1Database,
  options: { session_id?: string; agent_id?: string }
): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const conditions: string[] = ['tenant_id = ?'];
    const params: any[] = ['tenant_sam_primeaux'];

    if (options.session_id) {
      conditions.push('session_id = ?');
      params.push(options.session_id);
    }

    if (options.agent_id) {
      conditions.push('agent_id = ?');
      params.push(options.agent_id);
    }

    const result = await db.prepare(`
      SELECT 
        COUNT(*) as total_calls,
        SUM(input_tokens) as total_input_tokens,
        SUM(output_tokens) as total_output_tokens,
        SUM(cache_creation_input_tokens) as total_cache_write_tokens,
        SUM(cache_read_input_tokens) as total_cache_read_tokens,
        SUM(computed_cost_usd) as total_cost_usd,
        AVG(computed_cost_usd) as avg_cost_per_call,
        MIN(timestamp) as first_call_timestamp,
        MAX(timestamp) as last_call_timestamp
      FROM agent_telemetry
      WHERE ${conditions.join(' AND ')}
    `).bind(...params).first();

    return {
      success: true,
      stats: result
    };
  } catch (error) {
    console.error('Telemetry stats query failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Compute cost in USD based on token usage and rates.
 */
function computeCost(params: TelemetryParams): number {
  const inputCost = (params.input_tokens / 1_000_000) * params.input_rate;
  const outputCost = (params.output_tokens / 1_000_000) * params.output_rate;
  const cacheWriteCost = ((params.cache_creation_input_tokens ?? 0) / 1_000_000) * (params.cache_write_rate ?? 0);
  const cacheReadCost = ((params.cache_read_input_tokens ?? 0) / 1_000_000) * (params.cache_read_rate ?? 0);
  
  return inputCost + outputCost + cacheWriteCost + cacheReadCost;
}

/**
 * Generate a random 8-character hex ID (matches SQLite randomblob behavior).
 */
function generateId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
