-- Toolkit alignment migration
-- Maps generic toolkit concepts onto the application's existing PostgreSQL model.
-- Does not create a duplicate core `projects` table.

CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_key TEXT NOT NULL,
  phase_number INTEGER,
  target TEXT,
  status TEXT NOT NULL DEFAULT 'TODO',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, phase_key)
);

CREATE TABLE IF NOT EXISTS knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
  pattern_type TEXT NOT NULL,
  title TEXT,
  description TEXT NOT NULL,
  evidence_link TEXT,
  source_ref TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS census_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  tabs_total INTEGER,
  ui_screens_total INTEGER,
  ui_components_total INTEGER,
  models_3d_total INTEGER,
  workspaces_total INTEGER,
  agent_seats_total INTEGER,
  plugins_total INTEGER,
  status TEXT,
  report_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_tabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID,
  name TEXT NOT NULL,
  path TEXT,
  order_index INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  connection_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  capability_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO integration_catalog (code, display_name, category, connection_type)
VALUES
('firebase','Firebase','backend','oauth_or_api'),
('supabase','Supabase','backend','oauth_or_api'),
('github','GitHub','development','github_app_or_oauth'),
('paypal','PayPal','billing','oauth_or_api')
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  category = EXCLUDED.category,
  connection_type = EXCLUDED.connection_type;

CREATE INDEX IF NOT EXISTS idx_project_phases_project
  ON project_phases(project_id, phase_number);

CREATE INDEX IF NOT EXISTS idx_knowledge_entries_project
  ON knowledge_entries(project_id, created_at);

CREATE INDEX IF NOT EXISTS idx_census_snapshots_project
  ON census_snapshots(project_id, snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_workspace_tabs_project
  ON workspace_tabs(project_id, order_index);

-- Optional project metadata hooks used by toolkit adaptations.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS masterplan_version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS domain_profile TEXT;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS spatial_mode BOOLEAN NOT NULL DEFAULT TRUE;
