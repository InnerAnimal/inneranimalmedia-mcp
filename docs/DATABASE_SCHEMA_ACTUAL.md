# Database Schema - Actual Tables

## Schema Retrieved: February 8, 2026
**Database**: `inneranimalmedia-business` (cf87b717-d4e2-4cf8-bab0-a81268e32d49)

---

## Table: `ai_models`

AI model configurations, pricing, and capabilities.

| Column | Type | Nullable | Default | PK | Description |
|--------|------|----------|---------|----|----|
| `id` | TEXT | Yes | null | ✓ | Primary key |
| `provider` | TEXT | No | null | | Provider (OpenAI, Anthropic, etc.) |
| `model_key` | TEXT | No | null | | Model identifier |
| `display_name` | TEXT | No | null | | Human-readable name |
| `billing_unit` | TEXT | No | 'tokens' | | Billing unit |
| `context_default_tokens` | INTEGER | Yes | 0 | | Default context window |
| `context_max_tokens` | INTEGER | Yes | 0 | | Maximum context window |
| `supports_cache` | INTEGER | Yes | 0 | | Cache support (0/1) |
| `supports_tools` | INTEGER | Yes | 1 | | Tool calling support (0/1) |
| `supports_vision` | INTEGER | Yes | 0 | | Vision/image support (0/1) |
| `supports_web_search` | INTEGER | Yes | 0 | | Web search support (0/1) |
| `supports_fast_mode` | INTEGER | Yes | 0 | | Fast mode support (0/1) |
| `size_class` | TEXT | Yes | 'medium' | | Model size (small/medium/large) |
| `is_active` | INTEGER | Yes | 1 | | Active status (0/1) |
| `metadata_json` | TEXT | Yes | '{}' | | Additional metadata (JSON) |
| `created_at` | INTEGER | No | unixepoch() | | Created timestamp (Unix epoch) |
| `updated_at` | INTEGER | No | unixepoch() | | Updated timestamp (Unix epoch) |
| `input_rate_per_mtok` | REAL | Yes | null | | Input cost per million tokens |
| `output_rate_per_mtok` | REAL | Yes | null | | Output cost per million tokens |
| `cache_write_rate_per_mtok` | REAL | Yes | null | | Cache write cost per million tokens |
| `cache_read_rate_per_mtok` | REAL | Yes | null | | Cache read cost per million tokens |
| `web_search_per_1k_usd` | REAL | Yes | 0 | | Web search cost per 1k searches |
| `neurons_usd_per_1k` | REAL | Yes | 0 | | Neuron cost per 1k |
| `pricing_source` | TEXT | Yes | 'cursor_list' | | Pricing data source |

---

## Table: `agent_telemetry`

Comprehensive agent execution metrics, token usage, and cost tracking.

| Column | Type | Nullable | Default | PK | Description |
|--------|------|----------|---------|----|----|
| `id` | TEXT | Yes | null | ✓ | Primary key |
| `tenant_id` | TEXT | No | null | | Tenant identifier |
| `session_id` | TEXT | Yes | null | | Session identifier |
| `config_id` | TEXT | Yes | null | | Config identifier |
| `command_id` | TEXT | Yes | null | | Command identifier |
| `metric_type` | TEXT | No | null | | Type of metric |
| `metric_name` | TEXT | No | null | | Metric name |
| `metric_value` | REAL | No | null | | Metric value |
| `unit` | TEXT | Yes | null | | Unit of measurement |
| `timestamp` | INTEGER | No | null | | Event timestamp (Unix epoch) |
| `metadata_json` | TEXT | Yes | '{}' | | Additional metadata (JSON) |
| `role_name` | TEXT | Yes | null | | Agent role name |
| `created_by` | TEXT | Yes | null | | User who created |
| `event_type` | TEXT | Yes | null | | Event type |
| `severity` | TEXT | Yes | null | | Event severity |
| `model_used` | TEXT | Yes | null | | AI model used |
| `input_tokens` | INTEGER | Yes | null | | Input tokens consumed |
| `output_tokens` | INTEGER | Yes | null | | Output tokens generated |
| `cost_estimate` | REAL | Yes | null | | Estimated cost |
| `created_at` | INTEGER | No | unixepoch() | | Created timestamp |
| `updated_at` | INTEGER | No | unixepoch() | | Updated timestamp |
| `cache_creation_input_tokens` | INTEGER | Yes | 0 | | Cache creation tokens |
| `provider` | TEXT | Yes | null | | AI provider |
| `agent_id` | TEXT | Yes | null | | Agent identifier |
| `agent_email` | TEXT | Yes | null | | Agent/user email |
| `cache_read_input_tokens` | INTEGER | Yes | 0 | | Cache read tokens |
| `is_batch` | INTEGER | Yes | 0 | | Batch processing flag |
| `is_us_only` | INTEGER | Yes | 0 | | US-only processing flag |
| `is_fast_mode` | INTEGER | Yes | 0 | | Fast mode flag |
| `is_long_context` | INTEGER | Yes | 0 | | Long context flag |
| `tool_choice` | TEXT | Yes | null | | Tool choice strategy |
| `tool_system_prompt_tokens` | INTEGER | Yes | 0 | | Tool system prompt tokens |
| `tool_overhead_input_tokens` | INTEGER | Yes | 0 | | Tool overhead tokens |
| `web_search_requests` | INTEGER | Yes | 0 | | Web search request count |
| `code_exec_seconds` | INTEGER | Yes | 0 | | Code execution time (seconds) |
| `computed_cost_usd` | REAL | Yes | 0 | | Computed cost in USD |
| `cost_breakdown_json` | TEXT | Yes | '{}' | | Detailed cost breakdown (JSON) |
| `total_input_tokens` | INTEGER | Yes | 0 | | Total input tokens |
| `cache_hit_rate` | REAL | Yes | 0.0 | | Cache hit rate (0.0-1.0) |
| `cache_efficiency_score` | REAL | Yes | 0.0 | | Cache efficiency score |
| `cache_cost_savings_usd` | REAL | Yes | 0.0 | | Cost savings from cache |
| `cache_breakpoints_used` | INTEGER | Yes | 0 | | Cache breakpoints used |
| `cache_ttl_seconds` | INTEGER | Yes | 300 | | Cache TTL in seconds |
| `cache_strategy` | TEXT | Yes | NULL | | Caching strategy |
| `pricing_source` | TEXT | Yes | 'direct_api' | | Pricing data source |
| `output_rate_per_mtok` | REAL | Yes | null | | Output rate per million tokens |
| `input_rate_per_mtok` | REAL | Yes | null | | Input rate per million tokens |
| `cache_read_rate_per_mtok` | REAL | Yes | null | | Cache read rate |
| `cache_write_rate_per_mtok` | REAL | Yes | null | | Cache write rate |
| `subscription_monthly_usd` | REAL | Yes | null | | Monthly subscription cost |
| `neuron_cost_usd` | REAL | Yes | 0 | | Neuron cost in USD |
| `neurons_used` | INTEGER | Yes | 0 | | Neurons consumed |
| `neuron_rate_per_1k` | REAL | Yes | 0.011 | | Neuron rate per 1k |
| `model_size_class` | TEXT | Yes | null | | Model size classification |
| `workspace_id` | TEXT | Yes | null | | Workspace identifier |
| `service_name` | TEXT | Yes | null | | Service name |
| `instance_id` | TEXT | Yes | null | | Instance identifier |
| `location` | TEXT | Yes | null | | Execution location |
| `trace_id` | TEXT | Yes | null | | Distributed tracing ID |
| `span_id` | TEXT | Yes | null | | Span identifier |

---

## Table: `agents`

**Status**: ❌ **Table does not exist**

This table was queried but returned no schema. The agent configurations appear to be stored in `agent_ai_sam` instead.

---

## Table: `agent_ai_sam`

Complete agent configuration with multi-tenant support, policies, and governance.

| Column | Type | Nullable | Default | PK | Description |
|--------|------|----------|---------|----|----|
| `id` | TEXT | Yes | null | ✓ | Primary key |
| `tenant_id` | TEXT | No | null | | Tenant identifier |
| `is_global` | INTEGER | No | 1 | | Global agent flag (0/1) |
| `name` | TEXT | No | null | | Agent name |
| `role_name` | TEXT | No | null | | Agent role |
| `description` | TEXT | Yes | null | | Agent description |
| `status` | TEXT | No | 'active' | | Status (active/inactive/paused) |
| `mode` | TEXT | No | 'orchestrator' | | Operating mode |
| `safety_level` | TEXT | No | 'strict' | | Safety level (strict/moderate/permissive) |
| `tenant_scope` | TEXT | No | 'multi_tenant' | | Tenant scope |
| `allowed_tenants_json` | TEXT | Yes | '[]' | | Allowed tenants (JSON array) |
| `blocked_tenants_json` | TEXT | Yes | '[]' | | Blocked tenants (JSON array) |
| `auth_strategy` | TEXT | Yes | 'zero_trust_plus_oauth' | | Authentication strategy |
| `required_roles_json` | TEXT | Yes | '["super_admin"]' | | Required roles (JSON array) |
| `requires_human_approval` | INTEGER | No | 1 | | Requires approval flag (0/1) |
| `approvals_policy_json` | TEXT | Yes | '{}' | | Approval policy (JSON) |
| `integrations_json` | TEXT | Yes | '{}' | | Integrations config (JSON) |
| `mcp_services_json` | TEXT | Yes | '[]' | | MCP services (JSON array) |
| `tool_permissions_json` | TEXT | Yes | '{}' | | Tool permissions (JSON) |
| `rate_limits_json` | TEXT | Yes | '{}' | | Rate limits (JSON) |
| `budgets_json` | TEXT | Yes | '{}' | | Budget constraints (JSON) |
| `model_policy_json` | TEXT | Yes | '{}' | | Model usage policy (JSON) |
| `cost_policy_json` | TEXT | Yes | '{}' | | Cost policy (JSON) |
| `pii_policy_json` | TEXT | Yes | '{}' | | PII handling policy (JSON) |
| `security_policy_json` | TEXT | Yes | '{}' | | Security policy (JSON) |
| `findings_policy_json` | TEXT | Yes | '{}' | | Findings policy (JSON) |
| `notification_policy_json` | TEXT | Yes | '{}' | | Notification policy (JSON) |
| `telemetry_enabled` | INTEGER | No | 1 | | Telemetry enabled flag (0/1) |
| `telemetry_policy_json` | TEXT | Yes | '{}' | | Telemetry policy (JSON) |
| `last_health_check` | INTEGER | Yes | null | | Last health check timestamp |
| `last_run_at` | INTEGER | Yes | null | | Last execution timestamp |
| `last_error` | TEXT | Yes | null | | Last error message |
| `config_version` | INTEGER | No | 1 | | Configuration version |
| `config_hash` | TEXT | Yes | null | | Configuration hash |
| `notes` | TEXT | Yes | null | | Additional notes |
| `created_by` | TEXT | No | 'samprimeaux_chatgpt52' | | Created by user |
| `created_at` | INTEGER | No | unixepoch() | | Created timestamp |
| `updated_at` | INTEGER | No | unixepoch() | | Updated timestamp |
| `user_email` | TEXT | Yes | null | | User email |
| `additional_alert_emails_json` | TEXT | Yes | '[]' | | Alert emails (JSON array) |
| `owner_user_id` | TEXT | Yes | null | | Owner user ID |
| `backup_user_email` | TEXT | Yes | null | | Backup contact email |
| `alert_escalation_email` | TEXT | Yes | null | | Escalation email |

---

## Table: `agent_ai_executable_limits`

Resource limits and quotas for agent executions.

| Column | Type | Nullable | Default | PK | Description |
|--------|------|----------|---------|----|----|
| `id` | TEXT | Yes | null | ✓ | Primary key |
| `agent_role_id` | TEXT | No | null | | Agent role identifier |
| `cost_tier` | TEXT | No | null | | Cost tier (free/pro/enterprise) |
| `max_ai_calls_per_day` | INTEGER | No | 50 | | Max AI API calls per day |
| `max_tokens_per_request` | INTEGER | No | 1000 | | Max tokens per single request |
| `max_d1_queries_per_minute` | INTEGER | No | 10 | | Max D1 queries per minute |
| `max_r2_operations_per_day` | INTEGER | No | 20 | | Max R2 operations per day |
| `rate_limit_per_minute` | INTEGER | No | 5 | | General rate limit per minute |
| `allowed_operations` | TEXT | No | null | | Allowed operations (JSON array) |
| `blocked_operations` | TEXT | No | '[]' | | Blocked operations (JSON array) |
| `allowed_tools` | TEXT | Yes | null | | Allowed tools (JSON array) |
| `notes` | TEXT | Yes | null | | Additional notes |
| `created_at` | TEXT | No | datetime('now') | | Created timestamp |
| `updated_at` | TEXT | No | datetime('now') | | Updated timestamp |

---

## Key Observations

### Multi-Tenant Architecture
- Both `agent_telemetry` and `agent_ai_sam` have `tenant_id` fields
- `agent_ai_sam` has sophisticated tenant scoping with allow/block lists

### Comprehensive Cost Tracking
- `agent_telemetry` tracks detailed cost metrics including:
  - Token usage (input, output, cache)
  - Cache efficiency and savings
  - Neuron costs
  - Web search costs
  - Detailed cost breakdowns via JSON

### Security & Governance
- `agent_ai_sam` includes multiple policy fields:
  - PII policy
  - Security policy
  - Cost policy
  - Model policy
  - Approval workflows

### Resource Management
- `agent_ai_executable_limits` provides granular control over:
  - AI API call limits
  - D1 database query limits
  - R2 storage operation limits
  - Rate limiting per minute/day

### Caching Strategy
- Both `ai_models` and `agent_telemetry` support caching
- Cache metrics track efficiency, hit rates, and cost savings
- Configurable TTL and strategies

### Integration Points
- MCP services integration via `mcp_services_json`
- Tool permissions and integrations
- Multiple authentication strategies
- Notification and alert systems

---

## Related Tables (Previously Documented)

### `human_context`
- Stores human-provided context and notes
- Used by MCP tools for contextual information

### `r2_object_inventory`
- Inventory of R2 bucket objects
- Used for efficient R2 search operations

---

## Next Steps

1. ✅ Create TypeScript type definitions
2. ✅ Add Zod schemas for validation
3. Document relationships between tables
4. Create migration files for schema updates
5. Add indexes for performance optimization
