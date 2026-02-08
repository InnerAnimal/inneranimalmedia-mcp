# Database Table Index

**Database**: `inneranimalmedia-business`  
**Total Tables**: 140+  
**Last Updated**: February 8, 2026

## Quick Links to Requested Tables
- [ai_models](#ai-and-agent-tables) ✓ Documented
- [agent_telemetry](#ai-and-agent-tables) ✓ Documented  
- [agents](#note-on-agents-table) ⚠️ Does not exist (use `agent_ai_sam`)
- [agent_ai_sam](#ai-and-agent-tables) ✓ Documented
- [agent_ai_executable_limits](#ai-and-agent-tables) ✓ Documented

---

## Table Categories

### 🤖 AI and Agent Tables
Core AI/agent functionality, telemetry, and configuration.

| Table Name | Description | Status |
|------------|-------------|--------|
| `ai_models` | AI model configurations, pricing, and capabilities | ✅ Documented |
| `agent_telemetry` | Agent execution metrics, token usage, cost tracking | ✅ Documented |
| `agent_ai_sam` | SAM agent configuration with multi-tenant governance | ✅ Documented |
| `agent_ai_executable_limits` | Resource quotas and execution limits | ✅ Documented |
| `agent_actions` | Agent action executions and results |  |
| `agent_audit_log` | Audit trail for agent operations |  |
| `agent_capabilities` | Agent capability definitions and scopes |  |
| `agent_command_conversations` | Agent conversation history |  |
| `agent_command_executions` | Command execution history |  |
| `agent_command_integrations` | Integration configurations |  |
| `agent_commands` | Agent command definitions |  |
| `agent_configs` | Agent configuration templates |  |
| `agent_resource_access` | Resource access control |  |
| `agent_roles` | Agent role definitions |  |
| `agent_role_permissions` | Role-based permissions |  |
| `agent_runs` | Agent execution runs |  |
| `agent_sessions` | Agent session management |  |
| `agent_settings` | Per-agent settings |  |

### 👥 User & Authentication
User management, profiles, and authentication.

| Table Name | Description |
|------------|-------------|
| `users` | User accounts and profiles |
| `user_activity` | User activity tracking |
| `user_activations` | User account activation status |
| `user_api_tokens` | API token management |
| `user_billing_alerts` | Billing alert configurations |
| `user_credits` | User credit balances |
| `user_feature_flags` | Feature flag configurations |
| `user_login_history` | Login attempt tracking |
| `user_notifications` | User notification queue |
| `user_preferences` | User preference settings |
| `user_profiles` | Extended user profile data |
| `user_secrets` | Encrypted user secrets |
| `user_sessions` | Active user sessions |
| `user_usage` | Usage metrics per user |
| `activation_checks` | Account activation checklist |
| `activity_log` | General activity logging |

### 🏢 Workspace & Tenant Management
Multi-tenant workspace organization.

| Table Name | Description |
|------------|-------------|
| `workspaces` | Workspace definitions |
| `workspace_audit_log` | Workspace-level audit trail |
| `workspace_domains` | Custom domain mappings |
| `workspace_limits` | Workspace resource limits |
| `workspace_members` | Workspace membership |
| `workspace_members_legacy` | Legacy membership table |
| `workspace_notes` | Workspace notes/documentation |
| `workspace_projects` | Projects within workspaces |
| `workspace_quotas` | Usage quotas |
| `workspace_secrets` | Workspace-level secrets |
| `workspace_settings` | Workspace configuration |
| `workspace_tool_access` | Tool access control |
| `workspace_usage_metrics` | Usage tracking |
| `tenants` | Tenant definitions |
| `tenant_configs` | Tenant-specific configurations |
| `tenant_settings` | Tenant settings |

### 💼 Projects & Time Tracking
Project management and time tracking.

| Table Name | Description |
|------------|-------------|
| `projects` | Project definitions |
| `project_stages` | Project stage tracking |
| `tasks` | Task management |
| `time_entries` | Time tracking entries |
| `active_timers` | Currently active timers |
| `activity_events` | Activity event logging |

### 💰 Billing & Subscriptions
Payment, billing, and subscription management.

| Table Name | Description |
|------------|-------------|
| `billing_accounts` | Billing account information |
| `billing_payments` | Payment transaction records |
| `invoices` | Invoice records |
| `invoice_line_items` | Invoice line item details |
| `subscriptions` | Subscription records |
| `subscription_items` | Subscription item details |
| `payment_methods` | Stored payment methods |
| `payment_intents` | Stripe payment intents |
| `refunds` | Refund records |
| `credits` | Credit balance management |
| `credit_usage` | Credit usage tracking |

### 📊 Analytics & Metrics
Usage tracking, metrics, and analytics.

| Table Name | Description |
|------------|-------------|
| `metrics_daily` | Daily aggregated metrics |
| `metrics_hourly` | Hourly aggregated metrics |
| `api_usage` | API usage tracking |
| `cost_tracking` | Cost tracking and attribution |
| `usage_alerts` | Usage threshold alerts |

### 🔧 Worker Management
Cloudflare Worker registry and management.

| Table Name | Description |
|------------|-------------|
| `workers` | Worker script registry |
| `worker_registry` | Worker metadata and status |
| `worker_deployments` | Deployment history |
| `worker_routes` | Worker route configurations |
| `worker_secrets` | Worker-specific secrets |
| `worker_to_do` | Worker maintenance tasks |

### 🗄️ Database Management
D1 database management and migrations.

| Table Name | Description |
|------------|-------------|
| `d1_databases` | D1 database registry |
| `d1_migrations` | D1 migration history |
| `migrations` | General migration tracking |

### 📦 R2 Storage
R2 bucket and object management.

| Table Name | Description |
|------------|-------------|
| `r2_buckets` | R2 bucket registry |
| `r2_object_inventory` | R2 object inventory (used in MCP) |
| `file_uploads` | File upload tracking |

### 🔄 Workflows & Automation
Workflow definitions and execution.

| Table Name | Description |
|------------|-------------|
| `workflows` | Workflow definitions |
| `workflow_executions` | Workflow execution history |
| `workflow_stages` | Workflow stage definitions |
| `scheduled_jobs` | Scheduled job definitions |

### 📝 Content Management
Courses, lessons, and content.

| Table Name | Description |
|------------|-------------|
| `courses` | Course definitions |
| `lessons` | Lesson content |
| `content_blocks` | Modular content blocks |

### 🎨 Themes & Branding
Theming and customization.

| Table Name | Description |
|------------|-------------|
| `themes` | Theme definitions |
| `theme_fonts` | Font configurations |

### 🔐 Security & Compliance
Security, auditing, and compliance.

| Table Name | Description |
|------------|-------------|
| `audit_log` | Global audit trail |
| `security_events` | Security event logging |
| `compliance_records` | Compliance tracking |

### 🧪 Development & Testing
Development tools and testing.

| Table Name | Description |
|------------|-------------|
| `feature_flags` | Feature flag management |
| `experiments` | A/B testing experiments |

### 📧 Communications
Email, notifications, and messaging.

| Table Name | Description |
|------------|-------------|
| `email_queue` | Outbound email queue |
| `notifications` | Notification system |
| `notification_preferences` | User notification preferences |

### 🔌 Integrations
Third-party integrations.

| Table Name | Description |
|------------|-------------|
| `integrations` | Integration configurations |
| `oauth_tokens` | OAuth token storage |

### 📋 Miscellaneous
Other supporting tables.

| Table Name | Description |
|------------|-------------|
| `_cf_KV` | Cloudflare KV internal table |
| `_import_ai_prompts` | Imported AI prompt templates |
| `human_context` | Human-provided context (used in MCP) |
| `organizations` | Organization records |
| `teams` | Team management |
| `tags` | Tag system |

---

## Note on `agents` Table

The `agents` table **does not exist** in the database. Agent configurations are stored in:
- **`agent_ai_sam`** - Primary agent configuration table
- **`agent_roles`** - Agent role definitions
- **`agent_configs`** - Agent configuration templates

---

## Detailed Documentation

For detailed schema documentation of AI and agent tables, see:
- [DATABASE_SCHEMA_ACTUAL.md](./DATABASE_SCHEMA_ACTUAL.md) - Full schema with all columns
- [database.ts](../src/types/database.ts) - TypeScript type definitions

---

## Database Statistics

- **Total Tables**: 140+
- **AI/Agent Tables**: 18
- **User-Related Tables**: 16
- **Workspace Tables**: 14
- **Billing Tables**: 12
- **Worker Management**: 6
- **R2 Storage**: 3
- **Workflows**: 3

---

## Architecture Notes

### Multi-Tenant Design
The database follows a multi-tenant architecture with:
- `tenant_id` columns in most tables
- Workspace-level isolation
- Tenant-scoped configurations

### JSON Columns
Extensive use of JSON columns for flexibility:
- Policy configurations (`*_policy_json`)
- Metadata fields (`metadata_json`)
- Lists (`*_json` arrays)

### Timestamps
Two timestamp conventions used:
- **Unix epoch** (INTEGER): Most newer tables
- **ISO datetime** (TEXT): Some legacy tables
- Automatic `created_at` and `updated_at` tracking

### Foreign Keys
Many tables have foreign key constraints for referential integrity, though some are commented out for migration flexibility.

---

## Next Steps

1. Document remaining high-priority tables
2. Create ER diagram showing relationships
3. Add indexes documentation
4. Document common query patterns
5. Create migration strategy for schema updates
