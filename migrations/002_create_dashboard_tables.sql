-- Dashboard Tables Schema
-- Pipelines, Workflows, AI Operations, and Deployments

-- ===============================================
-- PIPELINES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS pipelines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  repository TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  status TEXT NOT NULL DEFAULT 'idle', -- idle, running, success, failed
  description TEXT,
  last_run_at INTEGER,
  last_run_duration_ms INTEGER,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_pipelines_status ON pipelines(status);
CREATE INDEX IF NOT EXISTS idx_pipelines_name ON pipelines(name);
CREATE INDEX IF NOT EXISTS idx_pipelines_last_run ON pipelines(last_run_at DESC);

-- ===============================================
-- PIPELINE RUNS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id TEXT PRIMARY KEY,
  pipeline_id TEXT NOT NULL,
  run_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, success, failed, cancelled
  trigger_type TEXT NOT NULL DEFAULT 'manual', -- manual, push, schedule, api
  commit_sha TEXT,
  commit_message TEXT,
  started_at INTEGER NOT NULL DEFAULT (unixepoch()),
  completed_at INTEGER,
  duration_ms INTEGER,
  triggered_by TEXT NOT NULL,
  error_message TEXT,
  logs_url TEXT,
  FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_pipeline ON pipeline_runs(pipeline_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started ON pipeline_runs(started_at DESC);

-- ===============================================
-- AI WORKFLOWS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS ai_workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  workflow_type TEXT NOT NULL, -- agent, pipeline, automation, analysis
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, archived
  model_used TEXT,
  total_executions INTEGER DEFAULT 0,
  success_rate REAL DEFAULT 0.0,
  avg_duration_ms INTEGER DEFAULT 0,
  avg_cost_usd REAL DEFAULT 0.0,
  last_execution_at INTEGER,
  config_json TEXT, -- JSON configuration
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_ai_workflows_type ON ai_workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_ai_workflows_status ON ai_workflows(status);
CREATE INDEX IF NOT EXISTS idx_ai_workflows_last_exec ON ai_workflows(last_execution_at DESC);

-- ===============================================
-- AI WORKFLOW EXECUTIONS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS ai_workflow_executions (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  execution_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'running', -- running, success, failed, timeout
  input_data TEXT, -- JSON input
  output_data TEXT, -- JSON output
  model_used TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0.0,
  started_at INTEGER NOT NULL DEFAULT (unixepoch()),
  completed_at INTEGER,
  duration_ms INTEGER,
  triggered_by TEXT NOT NULL,
  error_message TEXT,
  FOREIGN KEY (workflow_id) REFERENCES ai_workflows(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_exec_workflow ON ai_workflow_executions(workflow_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_exec_status ON ai_workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_ai_exec_started ON ai_workflow_executions(started_at DESC);

-- ===============================================
-- WORKER DEPLOYMENTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS worker_deployments (
  id TEXT PRIMARY KEY,
  worker_name TEXT NOT NULL,
  version TEXT NOT NULL,
  deployment_type TEXT NOT NULL DEFAULT 'standard', -- standard, rollback, hotfix
  status TEXT NOT NULL DEFAULT 'deploying', -- deploying, success, failed
  environment TEXT NOT NULL DEFAULT 'production', -- production, staging, dev
  deployed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  deployed_by TEXT NOT NULL,
  build_duration_ms INTEGER,
  rollback_available INTEGER DEFAULT 1, -- boolean
  previous_version TEXT,
  metadata_json TEXT -- Additional deployment metadata
);

CREATE INDEX IF NOT EXISTS idx_deployments_worker ON worker_deployments(worker_name, deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON worker_deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_env ON worker_deployments(environment);
CREATE INDEX IF NOT EXISTS idx_deployments_deployed ON worker_deployments(deployed_at DESC);

-- ===============================================
-- SAMPLE DATA (for testing)
-- ===============================================

-- Sample Pipelines
INSERT OR IGNORE INTO pipelines (id, name, repository, branch, status, description, last_run_at, last_run_duration_ms, success_count, failure_count, created_by)
VALUES 
  ('pipe_001', 'inneranimalmedia', 'InnerAnimal/inneranimalmedia', 'main', 'success', 'Main site deployment with dashboard, API, auth', unixepoch() - 3600, 134000, 342, 8, 'samprimeaux'),
  ('pipe_002', 'inneranimalmedia-mcp', 'InnerAnimal/inneranimalmedia-mcp', 'main', 'success', 'MCP server for AI tooling and platform integrations', unixepoch() - 7200, 92000, 89, 2, 'samprimeaux'),
  ('pipe_003', 'meauxcad', 'InnerAnimal/meauxcad', 'main', 'success', 'CAD application with R2 asset management', unixepoch() - 5400, 112000, 156, 5, 'samprimeaux'),
  ('pipe_004', 'meauxsql', 'InnerAnimal/meauxsql', 'main', 'success', 'SQL editor with D1 and Hyperdrive', unixepoch() - 4800, 98000, 234, 12, 'samprimeaux'),
  ('pipe_005', 'meauxgames', 'InnerAnimal/meauxgames', 'main', 'idle', '3D games platform with WebGL rendering', unixepoch() - 86400, 145000, 67, 3, 'samprimeaux'),
  ('pipe_006', 'agent-command', 'InnerAnimal/agent-command', 'main', 'success', 'Agent command runner for AI operations', unixepoch() - 1800, 58000, 412, 18, 'samprimeaux');

-- Sample AI Workflows
INSERT OR IGNORE INTO ai_workflows (id, name, description, workflow_type, status, model_used, total_executions, success_rate, avg_duration_ms, avg_cost_usd, last_execution_at, created_by)
VALUES
  ('wf_001', 'Code Review Agent', 'Automated code review and suggestions', 'agent', 'active', 'claude-sonnet-4.5', 1247, 98.5, 12400, 0.045, unixepoch() - 1200, 'samprimeaux'),
  ('wf_002', 'Documentation Generator', 'Auto-generate API documentation from code', 'automation', 'active', 'claude-sonnet-4.5', 543, 99.2, 8700, 0.028, unixepoch() - 3600, 'samprimeaux'),
  ('wf_003', 'Cost Analysis', 'Analyze and optimize LLM costs', 'analysis', 'active', 'claude-haiku-3.5', 892, 100.0, 3200, 0.012, unixepoch() - 7200, 'samprimeaux'),
  ('wf_004', 'Deployment Validator', 'Validate deployments before production', 'pipeline', 'active', 'claude-sonnet-4.5', 2341, 97.8, 15600, 0.052, unixepoch() - 900, 'samprimeaux');

-- Sample Pipeline Runs (recent)
INSERT OR IGNORE INTO pipeline_runs (id, pipeline_id, run_number, status, trigger_type, commit_sha, commit_message, started_at, completed_at, duration_ms, triggered_by)
VALUES
  ('run_001', 'pipe_001', 342, 'success', 'push', 'a7f3d9e', 'fix: update dashboard styles', unixepoch() - 3600, unixepoch() - 3466, 134000, 'samprimeaux'),
  ('run_002', 'pipe_002', 89, 'success', 'push', 'b2e4c1a', 'feat: add telemetry system', unixepoch() - 7200, unixepoch() - 7108, 92000, 'samprimeaux'),
  ('run_003', 'pipe_006', 412, 'success', 'manual', 'c9f2a8b', 'chore: update dependencies', unixepoch() - 1800, unixepoch() - 1742, 58000, 'samprimeaux'),
  ('run_004', 'pipe_001', 341, 'failed', 'push', 'f4d8e2c', 'test: add integration tests', unixepoch() - 86400, unixepoch() - 86280, 120000, 'samprimeaux');

-- Sample AI Workflow Executions
INSERT OR IGNORE INTO ai_workflow_executions (id, workflow_id, execution_number, status, model_used, tokens_used, cost_usd, started_at, completed_at, duration_ms, triggered_by)
VALUES
  ('exec_001', 'wf_001', 1247, 'success', 'claude-sonnet-4.5', 15234, 0.047, unixepoch() - 1200, unixepoch() - 1187, 13000, 'samprimeaux'),
  ('exec_002', 'wf_004', 2341, 'success', 'claude-sonnet-4.5', 18945, 0.056, unixepoch() - 900, unixepoch() - 884, 16000, 'samprimeaux'),
  ('exec_003', 'wf_003', 892, 'success', 'claude-haiku-3.5', 8432, 0.011, unixepoch() - 7200, unixepoch() - 7197, 3000, 'samprimeaux');

-- Sample Worker Deployments
INSERT OR IGNORE INTO worker_deployments (id, worker_name, version, deployment_type, status, environment, deployed_at, deployed_by, build_duration_ms, rollback_available)
VALUES
  ('dep_001', 'inneranimalmedia', 'v2.4.1', 'standard', 'success', 'production', unixepoch() - 3600, 'samprimeaux', 45000, 1),
  ('dep_002', 'inneranimalmedia-mcp', 'v1.3.0', 'standard', 'success', 'production', unixepoch() - 7200, 'samprimeaux', 38000, 1),
  ('dep_003', 'agent-command', 'v1.8.2', 'hotfix', 'success', 'production', unixepoch() - 1800, 'samprimeaux', 32000, 1);
