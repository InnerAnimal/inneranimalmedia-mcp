# Database Schema Access Guide

## Overview
This guide explains how to query the schema information for the AI and agent-related tables in the `inneranimalmedia-business` D1 database.

## Required Tables
The following tables need schema documentation:
- `ai_models` - AI model configurations
- `agent_telemetry` - Agent execution metrics and logs
- `agents` - Agent definitions and metadata
- `agent_ai_sam` - SAM agent-specific data
- `agent_ai_executable_limits` - Execution limits and quotas for agents

## Prerequisites

### 1. Set Up Cloudflare API Token

To access the remote D1 database, you need to configure a Cloudflare API token:

**Option A: Using Cursor Dashboard (Recommended for Cloud Agents)**
1. Go to Cursor Dashboard → Cloud Agents → Secrets
2. Add a new secret:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your Cloudflare API token
3. Scope: Set to this repository

**Option B: Generate Cloudflare API Token**
1. Visit: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template or create a custom token with:
   - Account → Cloudflare Workers → Edit
   - Account → D1 → Edit
4. Copy the generated token

**Option C: Set as Environment Variable (Local Development)**
```bash
export CLOUDFLARE_API_TOKEN="your-token-here"
```

## How to Query Schema

### Method 1: Using the SQL File (Recommended)
```bash
npm exec wrangler d1 execute inneranimalmedia-business --remote --file=docs/DATABASE_SCHEMA_QUERIES.sql
```

### Method 2: Individual PRAGMA Commands
```bash
# AI Models table
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "PRAGMA table_info('ai_models')"

# Agent Telemetry table
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "PRAGMA table_info('agent_telemetry')"

# Agents table
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "PRAGMA table_info('agents')"

# Agent AI SAM table
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "PRAGMA table_info('agent_ai_sam')"

# Agent AI Executable Limits table
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "PRAGMA table_info('agent_ai_executable_limits')"
```

### Method 3: Get All Tables
```bash
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

### Method 4: Export Full Schema
```bash
npm exec wrangler d1 execute inneranimalmedia-business --remote --command "SELECT sql FROM sqlite_master WHERE type='table'" --json > docs/full_schema.json
```

## Output Format

PRAGMA table_info returns columns with the following structure:
- `cid` - Column ID (position)
- `name` - Column name
- `type` - Data type (TEXT, INTEGER, REAL, BLOB)
- `notnull` - 1 if NOT NULL constraint, 0 otherwise
- `dflt_value` - Default value
- `pk` - 1 if primary key, 0 otherwise

## Database Configuration

According to `wrangler.toml`:
- **Database Name**: `inneranimalmedia-business`
- **Database ID**: `cf87b717-d4e2-4cf8-bab0-a81268e32d49`
- **Binding**: `DB`
- **Purpose**: Registry, AI tables, agent audit (per PLATFORM_ECOSYSTEM_MAP.txt)

## Troubleshooting

### Error: "CLOUDFLARE_API_TOKEN environment variable"
Solution: Follow the "Set Up Cloudflare API Token" section above.

### Error: "Unknown argument"
Solution: Ensure proper quoting of SQL commands. Use the SQL file method or wrap commands in double quotes.

### Error: "Database not found"
Solution: Verify you're using the correct database name `inneranimalmedia-business` and that your API token has D1 permissions.

## Next Steps

Once you have access to the schema information:
1. Document the schema in a new file `docs/DATABASE_SCHEMA.md`
2. Create TypeScript type definitions based on the schema
3. Add schema validation using Zod or similar
4. Create migration files for any schema changes

## References

- Cloudflare D1 Documentation: https://developers.cloudflare.com/d1/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- API Token Guide: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
