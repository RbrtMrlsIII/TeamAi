CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  conversation_id UUID REFERENCES conversations(id),
  state TEXT NOT NULL,
  summary_id UUID REFERENCES conversation_summaries(id),
  execution_plan_id UUID REFERENCES execution_plans(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES users(id),
  plugin_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT NOT NULL,
  mcp_server_url TEXT,
  required_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_plugins (
  project_id UUID NOT NULL REFERENCES projects(id),
  plugin_id UUID NOT NULL REFERENCES plugins(id),
  enabled BOOLEAN NOT NULL DEFAULT true,
  user_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(project_id, plugin_id)
);

CREATE TABLE IF NOT EXISTS plan_limits (
  plan_code TEXT PRIMARY KEY,
  max_ai_participants INTEGER NOT NULL,
  max_turns_per_discussion INTEGER NOT NULL,
  monthly_ai_credits NUMERIC(18,4) NOT NULL,
  max_project_connections INTEGER NOT NULL,
  plugins_enabled BOOLEAN NOT NULL
);

INSERT INTO plan_limits(plan_code,max_ai_participants,max_turns_per_discussion,monthly_ai_credits,max_project_connections,plugins_enabled)
VALUES
 ('free',1,10,1000,1,false),
 ('starter',2,30,8000,3,true),
 ('pro',4,75,30000,10,true),
 ('team',8,150,100000,50,true)
ON CONFLICT(plan_code) DO UPDATE SET
 max_ai_participants=EXCLUDED.max_ai_participants,
 max_turns_per_discussion=EXCLUDED.max_turns_per_discussion,
 monthly_ai_credits=EXCLUDED.monthly_ai_credits,
 max_project_connections=EXCLUDED.max_project_connections,
 plugins_enabled=EXCLUDED.plugins_enabled;
