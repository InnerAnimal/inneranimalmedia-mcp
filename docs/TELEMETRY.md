# Agent Telemetry System

## Overview

The Agent Telemetry system tracks LLM usage, token consumption, and costs for AI agents in the Inner Animal Media MCP ecosystem.

## Database Configuration

**D1 Database**: `inneranimalmedia-business`  
**Binding**: `DB`  
**Table**: `agent_telemetry`

## Schema

The `agent_telemetry` table tracks:

- **Session & Agent Info**: `session_id`, `agent_id`, `agent_email`
- **Model Details**: `provider`, `model_used`, `tool_choice`
- **Token Usage**: `input_tokens`, `output_tokens`, cache tokens
- **Pricing**: Per-million-token rates for input/output/cache
- **Computed Cost**: Auto-calculated in USD
- **Metadata**: `metadata_json` for flexible additional context

## Setup

### 1. Apply the Migration

```bash
# Apply the schema to your D1 database
wrangler d1 execute inneranimalmedia-business --file=./migrations/001_create_agent_telemetry.sql
```

### 2. Verify the Table

```bash
# Check the table exists
wrangler d1 execute inneranimalmedia-business --command="SELECT name FROM sqlite_master WHERE type='table' AND name='agent_telemetry';"
```

## Usage

### Via MCP Tools

The following MCP tools are available:

#### `telemetry_log`

Log a new telemetry record for an LLM call.

**Parameters**:
- `session_id` (required): Unique session identifier
- `agent_id` (required): Agent identifier
- `model_used` (required): Model name (e.g., "claude-sonnet-4.5")
- `input_tokens` (required): Number of input tokens
- `output_tokens` (required): Number of output tokens
- `input_rate` (required): Input rate per million tokens
- `output_rate` (required): Output rate per million tokens
- `tool_choice` (optional): Tool choice strategy
- `cache_creation_input_tokens` (optional): Cache write tokens
- `cache_read_input_tokens` (optional): Cache read tokens
- `cache_write_rate` (optional): Cache write rate per million tokens
- `cache_read_rate` (optional): Cache read rate per million tokens
- `role_name` (optional): Role name

**Example**:

```json
{
  "session_id": "session_20260208_123456",
  "agent_id": "cursor_cloud_agent",
  "model_used": "claude-sonnet-4.5",
  "input_tokens": 12000,
  "output_tokens": 3500,
  "input_rate": 3.0,
  "output_rate": 15.0,
  "cache_read_input_tokens": 8000,
  "cache_read_rate": 0.30,
  "tool_choice": "auto"
}
```

#### `telemetry_query`

Query telemetry records with flexible filtering.

**Parameters** (all optional):
- `session_id`: Filter by session
- `agent_id`: Filter by agent
- `start_timestamp`: Unix timestamp (inclusive)
- `end_timestamp`: Unix timestamp (inclusive)
- `limit`: Max records (default: 100, max: 500)

**Example**:

```json
{
  "session_id": "session_20260208_123456",
  "limit": 50
}
```

#### `telemetry_stats`

Get aggregate statistics for costs and token usage.

**Parameters** (all optional):
- `session_id`: Filter by session
- `agent_id`: Filter by agent

**Example**:

```json
{
  "session_id": "session_20260208_123456"
}
```

**Returns**:
- `total_calls`: Number of LLM calls
- `total_input_tokens`: Sum of all input tokens
- `total_output_tokens`: Sum of all output tokens
- `total_cost_usd`: Total cost in USD
- `avg_cost_per_call`: Average cost per call
- `first_call_timestamp`: First call time
- `last_call_timestamp`: Last call time

### Via TypeScript

```typescript
import { logTelemetry, queryTelemetry, getTelemetryStats } from './lib/telemetry';

// Log telemetry
const result = await logTelemetry(env.DB, {
  session_id: 'session_123',
  agent_id: 'agent_cursor',
  model_used: 'claude-sonnet-4.5',
  input_tokens: 10000,
  output_tokens: 2500,
  input_rate: 3.0,
  output_rate: 15.0,
  cache_read_input_tokens: 5000,
  cache_read_rate: 0.30
});

// Query telemetry
const records = await queryTelemetry(env.DB, {
  session_id: 'session_123',
  limit: 100
});

// Get stats
const stats = await getTelemetryStats(env.DB, {
  session_id: 'session_123'
});
```

## Cost Calculation

Costs are automatically computed using this formula:

```
total_cost = 
  (input_tokens / 1,000,000) × input_rate +
  (output_tokens / 1,000,000) × output_rate +
  (cache_creation_input_tokens / 1,000,000) × cache_write_rate +
  (cache_read_input_tokens / 1,000,000) × cache_read_rate
```

## Pricing Examples (Claude Sonnet 4.5)

- **Input**: $3.00 per million tokens
- **Output**: $15.00 per million tokens
- **Cache Write**: $3.75 per million tokens
- **Cache Read**: $0.30 per million tokens

## Security

- All queries use **parameterized statements** to prevent SQL injection
- No destructive operations without confirmation
- Sensitive data is not logged
- Metadata is stored as JSON for flexibility

## Monitoring

Query recent costs:

```bash
wrangler d1 execute inneranimalmedia-business --command="
  SELECT 
    session_id, 
    SUM(computed_cost_usd) as total_cost,
    SUM(input_tokens + output_tokens) as total_tokens
  FROM agent_telemetry 
  WHERE timestamp > unixepoch() - 86400
  GROUP BY session_id 
  ORDER BY total_cost DESC;
"
```

## Metadata Structure

The `metadata_json` field stores:

```json
{
  "billing_email": "meauxbility@gmail.com",
  "operator": "samprimeaux_chatgpt52",
  "repo_base_url": "https://github.com/InnerAnimal/inneranimalmedia-mcp"
}
```

You can extend this with additional context as needed.

## Indexes

The following indexes optimize common queries:

- `idx_telemetry_tenant_session`: (tenant_id, session_id)
- `idx_telemetry_agent`: (agent_id)
- `idx_telemetry_timestamp`: (timestamp DESC)
- `idx_telemetry_metric`: (metric_type, metric_name)

## Troubleshooting

### Table doesn't exist

```bash
wrangler d1 execute inneranimalmedia-business --file=./migrations/001_create_agent_telemetry.sql
```

### Check recent logs

```bash
wrangler d1 execute inneranimalmedia-business --command="
  SELECT id, session_id, model_used, computed_cost_usd, timestamp 
  FROM agent_telemetry 
  ORDER BY timestamp DESC 
  LIMIT 10;
"
```

### Verify binding

Check `wrangler.toml` includes:

```toml
[[d1_databases]]
binding = "DB"
database_name = "inneranimalmedia-business"
database_id = "cf87b717-d4e2-4cf8-bab0-a81268e32d49"
```

## Production Considerations

1. **Error Handling**: All telemetry functions return `{ success, error }` objects
2. **Performance**: Indexes optimize common query patterns
3. **Privacy**: Never log sensitive user data in metadata
4. **Retention**: Consider adding a cleanup job for old records
5. **Monitoring**: Set up alerts for cost thresholds

## Next Steps

- Add automated cleanup for records older than 90 days
- Create dashboards for cost visualization
- Add budget alerts when costs exceed thresholds
- Implement cost attribution per project/tenant
