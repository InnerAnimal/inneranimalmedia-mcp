# AI and Agent Database Tables - Summary

## Status
✅ **Documentation Created**  
⚠️ **Schema Access Requires CLOUDFLARE_API_TOKEN**

## Tables Requested

### 1. `ai_models`
**Purpose**: Store AI model configurations and metadata

**Likely Schema** (inferred from common patterns):
- `id` - Primary key
- `model_name` - Name/identifier of the AI model
- `provider` - AI provider (OpenAI, Anthropic, etc.)
- `model_version` - Version or variant
- `capabilities` - JSON field with model capabilities
- `context_window` - Maximum context size
- `max_tokens` - Maximum output tokens
- `pricing_input` - Cost per input token
- `pricing_output` - Cost per output token
- `is_active` - Whether model is currently available
- `created_at` - Timestamp
- `updated_at` - Timestamp

### 2. `agent_telemetry`
**Purpose**: Track agent execution metrics, performance, and logs

**Likely Schema**:
- `id` - Primary key
- `agent_id` - Foreign key to agents table
- `execution_id` - Unique execution identifier
- `started_at` - Execution start timestamp
- `completed_at` - Execution end timestamp
- `duration_ms` - Execution duration in milliseconds
- `tokens_used` - Total tokens consumed
- `cost` - Execution cost
- `status` - success/failure/timeout
- `error_message` - Error details if failed
- `tool_calls` - JSON array of tool invocations
- `model_used` - AI model identifier
- `user_id` - User who triggered execution
- `metadata` - JSON field for additional context

### 3. `agents`
**Purpose**: Define agent configurations and capabilities

**Likely Schema**:
- `id` - Primary key
- `name` - Agent name
- `description` - Agent purpose/capabilities
- `agent_type` - Type (mcp, command, custom)
- `system_prompt` - Base instructions
- `tools` - JSON array of available tools
- `model_id` - Foreign key to ai_models
- `is_active` - Whether agent is enabled
- `created_by` - User who created agent
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `config` - JSON field for custom configuration

### 4. `agent_ai_sam`
**Purpose**: SAM-specific agent data and configurations

**Context**: Based on the codebase, "agent-sam" is a prominent R2 bucket and appears to be a specific agent implementation.

**Likely Schema**:
- `id` - Primary key
- `execution_id` - Unique execution identifier
- `prompt` - User input/prompt
- `response` - Agent response
- `tools_used` - JSON array of tools invoked
- `r2_operations` - JSON log of R2 bucket operations
- `db_operations` - JSON log of D1 database operations
- `context` - Conversation context
- `tokens_used` - Token consumption
- `model` - AI model used
- `status` - Execution status
- `created_at` - Timestamp
- `metadata` - Additional execution metadata

### 5. `agent_ai_executable_limits`
**Purpose**: Define execution quotas, rate limits, and resource constraints

**Likely Schema**:
- `id` - Primary key
- `agent_id` - Foreign key to agents table (nullable for global limits)
- `user_id` - User-specific limits (nullable for agent-wide limits)
- `limit_type` - Type (tokens_per_day, executions_per_hour, cost_per_month)
- `limit_value` - Numeric limit
- `current_usage` - Current consumption
- `reset_at` - When usage resets
- `is_active` - Whether limit is enforced
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Known Tables (from code analysis)

### `human_context`
Referenced in `src/index.ts`:
```sql
CREATE TABLE human_context (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT,
  note TEXT NOT NULL,
  author TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### `r2_object_inventory`
Referenced in `src/index.ts`:
```sql
CREATE TABLE r2_object_inventory (
  bucket_name TEXT NOT NULL,
  object_key TEXT NOT NULL,
  size_bytes INTEGER,
  last_modified_iso TEXT,
  PRIMARY KEY (bucket_name, object_key)
)
```

## How to Get Actual Schema

### Step 1: Set Up API Token
Add `CLOUDFLARE_API_TOKEN` to Cursor Dashboard → Cloud Agents → Secrets

### Step 2: Run Schema Queries
```bash
npm exec wrangler d1 execute inneranimalmedia-business --remote --file=docs/DATABASE_SCHEMA_QUERIES.sql
```

### Step 3: Document Results
Once schema is retrieved, update this document with actual column definitions.

## Next Actions Required

1. **Set CLOUDFLARE_API_TOKEN** in Cursor Dashboard secrets
2. **Run PRAGMA queries** using the SQL file
3. **Document actual schema** in this file
4. **Create TypeScript types** matching the schema
5. **Add schema validation** using Zod
6. **Create migration files** if schema updates needed

## Related Files

- `docs/DATABASE_SCHEMA_QUERIES.sql` - SQL queries to retrieve schema
- `docs/DATABASE_SCHEMA_ACCESS.md` - Comprehensive access guide
- `docs/PLATFORM_ECOSYSTEM_MAP.txt` - Platform architecture
- `src/index.ts` - MCP server implementation with DB queries

## Database Connection

- **Database**: `inneranimalmedia-business`
- **Database ID**: `cf87b717-d4e2-4cf8-bab0-a81268e32d49`
- **Binding**: `DB`
- **Type**: Cloudflare D1 (SQLite)

## References

- D1 Database: https://developers.cloudflare.com/d1/
- SQLite PRAGMA: https://www.sqlite.org/pragma.html
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
