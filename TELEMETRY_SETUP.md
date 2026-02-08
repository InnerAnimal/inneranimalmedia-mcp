# Agent Telemetry - Quick Setup Guide

## What's Configured

Your repository is now configured with a complete **Agent Telemetry System** for tracking LLM usage, token consumption, and costs.

### D1 Database

**Database**: `inneranimalmedia-business`  
**ID**: `cf87b717-d4e2-4cf8-bab0-a81268e32d49`  
**Binding**: `DB` (in wrangler.toml)

## Files Added

```
migrations/
  └── 001_create_agent_telemetry.sql     # Database schema
  
src/lib/
  └── telemetry.ts                       # TypeScript module with helper functions

docs/
  └── TELEMETRY.md                       # Full documentation

scripts/
  └── apply-telemetry-migration.sh       # Migration helper script
```

## Quick Start

### 1. Apply the Database Schema

```bash
npm run migrate:telemetry
```

Or manually:

```bash
wrangler d1 execute inneranimalmedia-business --file=./migrations/001_create_agent_telemetry.sql
```

### 2. Use the MCP Tools

Three new MCP tools are available:

- **`telemetry_log`** - Log LLM usage and costs
- **`telemetry_query`** - Query telemetry records
- **`telemetry_stats`** - Get aggregate statistics

### 3. Example: Log a Telemetry Event

Via MCP:

```json
{
  "tool": "telemetry_log",
  "arguments": {
    "session_id": "session_20260208_123456",
    "agent_id": "cursor_cloud_agent",
    "model_used": "claude-sonnet-4.5",
    "input_tokens": 12000,
    "output_tokens": 3500,
    "input_rate": 3.0,
    "output_rate": 15.0,
    "cache_read_input_tokens": 8000,
    "cache_read_rate": 0.30
  }
}
```

This automatically computes the cost:
- Input: (12,000 / 1M) × $3.00 = $0.036
- Output: (3,500 / 1M) × $15.00 = $0.0525
- Cache Read: (8,000 / 1M) × $0.30 = $0.0024
- **Total**: $0.0909

### 4. Query Your Telemetry

```json
{
  "tool": "telemetry_query",
  "arguments": {
    "session_id": "session_20260208_123456",
    "limit": 100
  }
}
```

### 5. Get Session Stats

```json
{
  "tool": "telemetry_stats",
  "arguments": {
    "session_id": "session_20260208_123456"
  }
}
```

Returns:
- Total calls
- Total tokens (input/output/cache)
- Total cost in USD
- Average cost per call
- First/last call timestamps

## Integration in Your Code

Import and use the telemetry module:

```typescript
import { logTelemetry } from './lib/telemetry.js';

// In your Worker
const result = await logTelemetry(env.DB, {
  session_id: 'your_session_id',
  agent_id: 'your_agent_id',
  model_used: 'claude-sonnet-4.5',
  input_tokens: 10000,
  output_tokens: 2500,
  input_rate: 3.0,
  output_rate: 15.0
});

console.log('Telemetry logged:', result.id);
```

## Verify Setup

```bash
# Check if table exists
npm run db:query "SELECT name FROM sqlite_master WHERE type='table' AND name='agent_telemetry';"

# View recent telemetry
npm run db:query "SELECT * FROM agent_telemetry ORDER BY timestamp DESC LIMIT 5;"
```

## Features

✅ **Automatic cost calculation** based on token usage and rates  
✅ **Parameterized queries** for SQL injection prevention  
✅ **Indexed for performance** on common query patterns  
✅ **Cache token tracking** (creation + read)  
✅ **Flexible metadata** via JSON field  
✅ **Production-ready** with error handling  

## Pricing Reference (Claude Sonnet 4.5)

- Input: $3.00 per million tokens
- Output: $15.00 per million tokens
- Cache Write: $3.75 per million tokens
- Cache Read: $0.30 per million tokens

## Database Schema

```sql
agent_telemetry (
  id                          TEXT PRIMARY KEY
  tenant_id                   TEXT
  session_id                  TEXT
  agent_id                    TEXT
  model_used                  TEXT
  input_tokens                INTEGER
  output_tokens               INTEGER
  cache_creation_input_tokens INTEGER
  cache_read_input_tokens     INTEGER
  computed_cost_usd           REAL
  timestamp                   INTEGER
  metadata_json               TEXT
  ... and more
)
```

## Next Steps

1. **Apply the migration**: `npm run migrate:telemetry`
2. **Test logging**: Use the `telemetry_log` MCP tool
3. **Monitor costs**: Use the `telemetry_stats` MCP tool
4. **Read full docs**: See `docs/TELEMETRY.md`

## Support

For detailed documentation, see:
- **Full Guide**: `docs/TELEMETRY.md`
- **Schema**: `migrations/001_create_agent_telemetry.sql`
- **TypeScript API**: `src/lib/telemetry.ts`

---

**Status**: ✅ Configured and ready to use  
**Database**: inneranimalmedia-business (D1)  
**MCP Tools**: telemetry_log, telemetry_query, telemetry_stats
