CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  model_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  context_window_tokens BIGINT,
  status TEXT NOT NULL DEFAULT 'active',
  capability_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, model_key)
);

CREATE TABLE model_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES models(id),
  input_usd_per_mtok NUMERIC(18,8) NOT NULL,
  output_usd_per_mtok NUMERIC(18,8) NOT NULL,
  cached_input_usd_per_mtok NUMERIC(18,8),
  effective_from TIMESTAMPTZ NOT NULL,
  effective_to TIMESTAMPTZ,
  source TEXT NOT NULL
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_code TEXT NOT NULL,
  status TEXT NOT NULL,
  billing_provider TEXT,
  external_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE entitlement_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  feature_code TEXT NOT NULL,
  effect TEXT NOT NULL,
  limit_value NUMERIC(18,4),
  expires_at TIMESTAMPTZ
);

CREATE TABLE plan_model_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code TEXT NOT NULL,
  model_id UUID NOT NULL REFERENCES models(id),
  allowed BOOLEAN NOT NULL DEFAULT false,
  max_output_tokens BIGINT,
  priority INTEGER NOT NULL DEFAULT 0,
  UNIQUE(plan_code, model_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  default_budget_credits NUMERIC(18,4) NOT NULL DEFAULT 0,
  environment TEXT NOT NULL DEFAULT 'development',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  max_turns INTEGER NOT NULL,
  max_words INTEGER,
  max_output_tokens INTEGER,
  current_turn INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES models(id),
  role_name TEXT NOT NULL,
  speaker_order INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(conversation_id, speaker_order)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES conversation_participants(id),
  author_type TEXT NOT NULL,
  author_user_id UUID REFERENCES users(id),
  model_id UUID REFERENCES models(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  turn_number INTEGER NOT NULL,
  provider_request_id TEXT,
  input_tokens BIGINT,
  output_tokens BIGINT,
  cost_usd NUMERIC(18,8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  summarizer_model_id UUID NOT NULL REFERENCES models(id),
  summary_json JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE execution_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  summary_id UUID REFERENCES conversation_summaries(id),
  title TEXT NOT NULL,
  plan_json JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE execution_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_plan_id UUID NOT NULL REFERENCES execution_plans(id) ON DELETE CASCADE,
  executor_model_id UUID NOT NULL REFERENCES models(id),
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  budget_credits NUMERIC(18,4) NOT NULL,
  reserved_credits NUMERIC(18,4) NOT NULL DEFAULT 0,
  spent_credits NUMERIC(18,4) NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE execution_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_run_id UUID NOT NULL REFERENCES execution_runs(id) ON DELETE CASCADE,
  sequence_no INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  tool_policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_json JSONB,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  UNIQUE(execution_run_id, sequence_no)
);

CREATE TABLE connected_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  provider_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  external_account_ref TEXT,
  external_project_ref TEXT,
  auth_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  environment TEXT NOT NULL DEFAULT 'development',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE connection_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_service_id UUID NOT NULL REFERENCES connected_services(id) ON DELETE CASCADE,
  capability_code TEXT NOT NULL,
  effect TEXT NOT NULL,
  UNIQUE(connected_service_id, capability_code)
);

CREATE TABLE credential_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_service_id UUID NOT NULL REFERENCES connected_services(id) ON DELETE CASCADE,
  secret_backend TEXT NOT NULL,
  secret_reference TEXT NOT NULL,
  key_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tool_invocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_run_id UUID NOT NULL REFERENCES execution_runs(id) ON DELETE CASCADE,
  execution_task_id UUID REFERENCES execution_tasks(id),
  tool_name TEXT NOT NULL,
  tool_server TEXT,
  input_json JSONB NOT NULL,
  output_json JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  approved_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE credit_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  balance_credits NUMERIC(18,4) NOT NULL DEFAULT 0,
  reserved_credits NUMERIC(18,4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES credit_wallets(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL,
  amount_credits NUMERIC(18,4) NOT NULL,
  source_type TEXT,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  conversation_id UUID REFERENCES conversations(id),
  execution_run_id UUID REFERENCES execution_runs(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  model_id UUID NOT NULL REFERENCES models(id),
  provider_request_id TEXT,
  input_tokens BIGINT,
  output_tokens BIGINT,
  cached_tokens BIGINT,
  provider_cost_usd NUMERIC(18,8),
  provider_cost_source TEXT,
  internal_cost_credits NUMERIC(18,4),
  customer_charge_credits NUMERIC(18,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  actor_type TEXT NOT NULL,
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX conversations_project_updated_idx ON conversations(project_id, updated_at);
CREATE INDEX messages_conversation_turn_idx ON messages(conversation_id, turn_number, created_at);
CREATE INDEX usage_records_user_created_idx ON usage_records(user_id, created_at);
CREATE INDEX usage_records_project_created_idx ON usage_records(project_id, created_at);
CREATE INDEX tool_invocations_run_created_idx ON tool_invocations(execution_run_id, created_at);
CREATE INDEX audit_events_project_created_idx ON audit_events(project_id, created_at);
CREATE INDEX connected_services_project_status_idx ON connected_services(project_id, status);
CREATE INDEX model_prices_effective_idx ON model_prices(model_id, effective_from);
