/**
 * Dashboard API for Pipelines, Workflows, and AI Operations
 * Connects to D1 database: inneranimalmedia-business
 */

export interface DashboardEnv {
  DB: D1Database;
}

/**
 * Get all builds (pipelines) with their latest status
 */
export async function getPipelines(db: D1Database) {
  try {
    const result = await db.prepare(`
      SELECT 
        id,
        project_id as name,
        branch,
        status,
        deployment_url,
        build_number,
        build_time_ms as last_run_duration_ms,
        commit_message,
        commit_author as created_by,
        started_at as last_run_at,
        completed_at,
        environment,
        triggered_by,
        build_log
      FROM builds
      ORDER BY started_at DESC NULLS LAST, created_at DESC
      LIMIT 50
    `).all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pipelines',
      data: []
    };
  }
}

/**
 * Get pipeline runs/deployments
 */
export async function getPipelineRuns(db: D1Database, pipelineId?: string, limit = 50) {
  try {
    const query = pipelineId
      ? db.prepare(`
          SELECT 
            id,
            pipeline_id,
            run_number,
            status,
            trigger_type,
            commit_sha,
            commit_message,
            started_at,
            completed_at,
            duration_ms,
            triggered_by,
            error_message
          FROM pipeline_runs
          WHERE pipeline_id = ?
          ORDER BY started_at DESC
          LIMIT ?
        `).bind(pipelineId, limit)
      : db.prepare(`
          SELECT 
            r.id,
            r.pipeline_id,
            p.name as pipeline_name,
            r.run_number,
            r.status,
            r.trigger_type,
            r.commit_sha,
            r.commit_message,
            r.started_at,
            r.completed_at,
            r.duration_ms,
            r.triggered_by,
            r.error_message
          FROM pipeline_runs r
          LEFT JOIN pipelines p ON r.pipeline_id = p.id
          ORDER BY r.started_at DESC
          LIMIT ?
        `).bind(limit);

    const result = await query.all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching pipeline runs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pipeline runs',
      data: []
    };
  }
}

/**
 * Get AI workflows and their execution status
 */
export async function getAIWorkflows(db: D1Database) {
  try {
    const result = await db.prepare(`
      SELECT 
        id,
        name,
        description,
        workflow_type,
        is_active as status,
        trigger_type,
        success_count,
        failure_count,
        last_run_at,
        created_at,
        steps
      FROM workflows
      ORDER BY last_run_at DESC NULLS LAST, created_at DESC
      LIMIT 50
    `).all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching AI workflows:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch AI workflows',
      data: []
    };
  }
}

/**
 * Get AI workflow executions
 */
export async function getAIWorkflowExecutions(db: D1Database, workflowId?: string, limit = 50) {
  try {
    const query = workflowId
      ? db.prepare(`
          SELECT 
            id,
            workflow_id,
            execution_number,
            status,
            input_data,
            output_data,
            model_used,
            tokens_used,
            cost_usd,
            started_at,
            completed_at,
            duration_ms,
            triggered_by,
            error_message
          FROM ai_workflow_executions
          WHERE workflow_id = ?
          ORDER BY started_at DESC
          LIMIT ?
        `).bind(workflowId, limit)
      : db.prepare(`
          SELECT 
            e.id,
            e.workflow_id,
            w.name as workflow_name,
            e.execution_number,
            e.status,
            e.model_used,
            e.tokens_used,
            e.cost_usd,
            e.started_at,
            e.completed_at,
            e.duration_ms,
            e.triggered_by,
            e.error_message
          FROM ai_workflow_executions e
          LEFT JOIN ai_workflows w ON e.workflow_id = w.id
          ORDER BY e.started_at DESC
          LIMIT ?
        `).bind(limit);

    const result = await query.all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching AI workflow executions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workflow executions',
      data: []
    };
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(db: D1Database) {
  try {
    // Get build stats
    const buildStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_builds,
        SUM(CASE WHEN status IN ('completed', 'success', 'active') THEN 1 ELSE 0 END) as successful_builds,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_builds
      FROM builds
    `).first();

    // Get worker stats
    const workerStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_workers,
        SUM(CASE WHEN deployment_status = 'active' THEN 1 ELSE 0 END) as active_workers,
        SUM(CASE WHEN deployment_status = 'failed' THEN 1 ELSE 0 END) as failed_workers,
        SUM(requests_30d) as total_requests_30d
      FROM worker_registry
      WHERE entity_status = 'active'
    `).first();

    // Get AI workflow stats
    const workflowStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_workflows,
        SUM(success_count) as total_successes,
        SUM(failure_count) as total_failures,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_workflows
      FROM workflows
    `).first();

    // Get recent telemetry for cost tracking
    const costStats = await db.prepare(`
      SELECT 
        SUM(computed_cost_usd) as total_cost_today,
        COUNT(*) as total_calls_today
      FROM agent_telemetry
      WHERE DATE(timestamp, 'unixepoch') = DATE('now')
    `).first();

    return {
      success: true,
      data: {
        builds: buildStats || {},
        workers: workerStats || {},
        workflows: workflowStats || {},
        costs: costStats || {}
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      data: {}
    };
  }
}

/**
 * Get worker registry (active workers)
 */
export async function getWorkerDeployments(db: D1Database, limit = 50) {
  try {
    const result = await db.prepare(`
      SELECT 
        id,
        worker_name,
        deployment_status as status,
        routes,
        bindings_count,
        last_deployment,
        days_since_deploy,
        deployment_status,
        git_repo,
        last_commit_message,
        priority,
        requests_30d,
        notes,
        updated_at,
        entity_status
      FROM worker_registry
      WHERE entity_status = 'active'
      ORDER BY priority DESC, updated_at DESC
      LIMIT ?
    `).bind(limit).all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching worker deployments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch deployments',
      data: []
    };
  }
}

/**
 * Get all tables in the database (for exploration)
 */
export async function getDatabaseTables(db: D1Database) {
  try {
    const result = await db.prepare(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

    return {
      success: true,
      data: result.results || []
    };
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tables',
      data: []
    };
  }
}

/**
 * Query any table by name
 */
export async function queryTable(db: D1Database, tableName: string, limit = 100) {
  try {
    // Validate table name to prevent SQL injection
    const validTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    
    const result = await db.prepare(`
      SELECT * FROM ${validTableName}
      ORDER BY 
        CASE 
          WHEN EXISTS(SELECT 1 FROM pragma_table_info('${validTableName}') WHERE name='created_at') THEN created_at
          WHEN EXISTS(SELECT 1 FROM pragma_table_info('${validTableName}') WHERE name='timestamp') THEN timestamp
          ELSE rowid
        END DESC
      LIMIT ?
    `).bind(limit).all();

    return {
      success: true,
      tableName: validTableName,
      data: result.results || []
    };
  } catch (error) {
    console.error(`Error querying table ${tableName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to query table',
      tableName,
      data: []
    };
  }
}
