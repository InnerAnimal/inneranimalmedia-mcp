-- Agent Telemetry Schema
-- Tracks LLM usage, costs, and performance metrics for AI agents

CREATE TABLE IF NOT EXISTS agent_telemetry (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_email TEXT NOT NULL,
  
  -- Model info
  provider TEXT NOT NULL,
  model_used TEXT NOT NULL,
  tool_choice TEXT,
  
  -- Metric details
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  unit TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  
  -- Token usage
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cache_creation_input_tokens INTEGER DEFAULT 0,
  cache_read_input_tokens INTEGER DEFAULT 0,
  
  -- Pricing rates (per million tokens)
  input_rate_per_mtok REAL DEFAULT 0,
  output_rate_per_mtok REAL DEFAULT 0,
  cache_write_rate_per_mtok REAL DEFAULT 0,
  cache_read_rate_per_mtok REAL DEFAULT 0,
  
  -- Computed cost
  computed_cost_usd REAL DEFAULT 0,
  
  -- Audit fields
  role_name TEXT,
  created_by TEXT NOT NULL,
  metadata_json TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_telemetry_tenant_session ON agent_telemetry(tenant_id, session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_agent ON agent_telemetry(agent_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON agent_telemetry(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_metric ON agent_telemetry(metric_type, metric_name);
