/**
 * Database Type Definitions
 * Generated from actual D1 schema: inneranimalmedia-business
 * @see docs/DATABASE_SCHEMA_ACTUAL.md
 */

// ============================================================================
// AI Models
// ============================================================================

export interface AIModel {
  id: string; // Primary key
  provider: string; // e.g., "openai", "anthropic"
  model_key: string; // Model identifier
  display_name: string; // Human-readable name
  billing_unit: string; // Default: "tokens"
  context_default_tokens: number | null;
  context_max_tokens: number | null;
  supports_cache: number; // 0 or 1 (boolean)
  supports_tools: number; // 0 or 1 (boolean)
  supports_vision: number; // 0 or 1 (boolean)
  supports_web_search: number; // 0 or 1 (boolean)
  supports_fast_mode: number; // 0 or 1 (boolean)
  size_class: string | null; // "small" | "medium" | "large"
  is_active: number; // 0 or 1 (boolean)
  metadata_json: string; // JSON string
  created_at: number; // Unix epoch
  updated_at: number; // Unix epoch
  input_rate_per_mtok: number | null; // Cost per million tokens
  output_rate_per_mtok: number | null; // Cost per million tokens
  cache_write_rate_per_mtok: number | null;
  cache_read_rate_per_mtok: number | null;
  web_search_per_1k_usd: number | null;
  neurons_usd_per_1k: number | null;
  pricing_source: string | null; // Default: "cursor_list"
}

export interface AIModelMetadata {
  [key: string]: unknown;
}

// ============================================================================
// Agent Telemetry
// ============================================================================

export interface AgentTelemetry {
  id: string; // Primary key
  tenant_id: string;
  session_id: string | null;
  config_id: string | null;
  command_id: string | null;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  unit: string | null;
  timestamp: number; // Unix epoch
  metadata_json: string; // JSON string, default: "{}"
  role_name: string | null;
  created_by: string | null;
  event_type: string | null;
  severity: string | null;
  model_used: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_estimate: number | null;
  created_at: number; // Unix epoch
  updated_at: number; // Unix epoch
  cache_creation_input_tokens: number; // Default: 0
  provider: string | null;
  agent_id: string | null;
  agent_email: string | null;
  cache_read_input_tokens: number; // Default: 0
  is_batch: number; // 0 or 1
  is_us_only: number; // 0 or 1
  is_fast_mode: number; // 0 or 1
  is_long_context: number; // 0 or 1
  tool_choice: string | null;
  tool_system_prompt_tokens: number; // Default: 0
  tool_overhead_input_tokens: number; // Default: 0
  web_search_requests: number; // Default: 0
  code_exec_seconds: number; // Default: 0
  computed_cost_usd: number; // Default: 0
  cost_breakdown_json: string; // JSON string, default: "{}"
  total_input_tokens: number; // Default: 0
  cache_hit_rate: number; // Default: 0.0
  cache_efficiency_score: number; // Default: 0.0
  cache_cost_savings_usd: number; // Default: 0.0
  cache_breakpoints_used: number; // Default: 0
  cache_ttl_seconds: number; // Default: 300
  cache_strategy: string | null;
  pricing_source: string | null; // Default: "direct_api"
  output_rate_per_mtok: number | null;
  input_rate_per_mtok: number | null;
  cache_read_rate_per_mtok: number | null;
  cache_write_rate_per_mtok: number | null;
  subscription_monthly_usd: number | null;
  neuron_cost_usd: number; // Default: 0
  neurons_used: number; // Default: 0
  neuron_rate_per_1k: number; // Default: 0.011
  model_size_class: string | null;
  workspace_id: string | null;
  service_name: string | null;
  instance_id: string | null;
  location: string | null;
  trace_id: string | null;
  span_id: string | null;
}

export interface TelemetryMetadata {
  [key: string]: unknown;
}

export interface CostBreakdown {
  input_cost?: number;
  output_cost?: number;
  cache_write_cost?: number;
  cache_read_cost?: number;
  web_search_cost?: number;
  neuron_cost?: number;
  total_cost?: number;
  [key: string]: unknown;
}

// ============================================================================
// Agent AI SAM (Main Agent Configuration)
// ============================================================================

export interface AgentAISam {
  id: string; // Primary key
  tenant_id: string;
  is_global: number; // 0 or 1, default: 1
  name: string;
  role_name: string;
  description: string | null;
  status: string; // Default: "active"
  mode: string; // Default: "orchestrator"
  safety_level: string; // Default: "strict"
  tenant_scope: string; // Default: "multi_tenant"
  allowed_tenants_json: string; // JSON array, default: "[]"
  blocked_tenants_json: string; // JSON array, default: "[]"
  auth_strategy: string | null; // Default: "zero_trust_plus_oauth"
  required_roles_json: string; // JSON array, default: '["super_admin"]'
  requires_human_approval: number; // 0 or 1, default: 1
  approvals_policy_json: string; // JSON, default: "{}"
  integrations_json: string; // JSON, default: "{}"
  mcp_services_json: string; // JSON array, default: "[]"
  tool_permissions_json: string; // JSON, default: "{}"
  rate_limits_json: string; // JSON, default: "{}"
  budgets_json: string; // JSON, default: "{}"
  model_policy_json: string; // JSON, default: "{}"
  cost_policy_json: string; // JSON, default: "{}"
  pii_policy_json: string; // JSON, default: "{}"
  security_policy_json: string; // JSON, default: "{}"
  findings_policy_json: string; // JSON, default: "{}"
  notification_policy_json: string; // JSON, default: "{}"
  telemetry_enabled: number; // 0 or 1, default: 1
  telemetry_policy_json: string; // JSON, default: "{}"
  last_health_check: number | null; // Unix epoch
  last_run_at: number | null; // Unix epoch
  last_error: string | null;
  config_version: number; // Default: 1
  config_hash: string | null;
  notes: string | null;
  created_by: string; // Default: "samprimeaux_chatgpt52"
  created_at: number; // Unix epoch
  updated_at: number; // Unix epoch
  user_email: string | null;
  additional_alert_emails_json: string; // JSON array, default: "[]"
  owner_user_id: string | null;
  backup_user_email: string | null;
  alert_escalation_email: string | null;
}

// Policy type definitions
export interface ApprovalsPolicy {
  [key: string]: unknown;
}

export interface IntegrationsConfig {
  [key: string]: unknown;
}

export interface MCPService {
  name: string;
  url?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

export interface ToolPermissions {
  [toolName: string]: boolean | string[];
}

export interface RateLimits {
  requests_per_minute?: number;
  requests_per_hour?: number;
  requests_per_day?: number;
  [key: string]: unknown;
}

export interface Budgets {
  daily_usd?: number;
  monthly_usd?: number;
  [key: string]: unknown;
}

export interface ModelPolicy {
  allowed_models?: string[];
  blocked_models?: string[];
  default_model?: string;
  [key: string]: unknown;
}

export interface CostPolicy {
  max_cost_per_request?: number;
  max_daily_cost?: number;
  [key: string]: unknown;
}

export interface PIIPolicy {
  scan_enabled?: boolean;
  block_on_detection?: boolean;
  [key: string]: unknown;
}

export interface SecurityPolicy {
  require_encryption?: boolean;
  audit_all_requests?: boolean;
  [key: string]: unknown;
}

export interface FindingsPolicy {
  [key: string]: unknown;
}

export interface NotificationPolicy {
  email_enabled?: boolean;
  alert_on_error?: boolean;
  [key: string]: unknown;
}

export interface TelemetryPolicy {
  log_level?: string;
  retention_days?: number;
  [key: string]: unknown;
}

// ============================================================================
// Agent AI Executable Limits
// ============================================================================

export interface AgentAIExecutableLimits {
  id: string; // Primary key
  agent_role_id: string;
  cost_tier: string; // e.g., "free", "pro", "enterprise"
  max_ai_calls_per_day: number; // Default: 50
  max_tokens_per_request: number; // Default: 1000
  max_d1_queries_per_minute: number; // Default: 10
  max_r2_operations_per_day: number; // Default: 20
  rate_limit_per_minute: number; // Default: 5
  allowed_operations: string; // JSON array
  blocked_operations: string; // JSON array, default: "[]"
  allowed_tools: string | null; // JSON array
  notes: string | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export type OperationsList = string[];
export type ToolsList = string[];

// ============================================================================
// Helper Types
// ============================================================================

export type SQLiteBoolean = 0 | 1;

export interface DatabaseTimestamps {
  created_at: number; // Unix epoch
  updated_at: number; // Unix epoch
}

// Type guards
export function isSQLiteTrue(value: number): value is 1 {
  return value === 1;
}

export function isSQLiteFalse(value: number): value is 0 {
  return value === 0;
}

// Conversion helpers
export function sqliteBoolToJS(value: number): boolean {
  return value === 1;
}

export function jsBoolToSQLite(value: boolean): SQLiteBoolean {
  return value ? 1 : 0;
}
