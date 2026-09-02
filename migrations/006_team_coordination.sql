-- Updated: 2026-09-01 22:35:10 PHASE TEAM-FOUNDATION-001 by TeamArchitect
-- Provider-federated team coordination extension. Append-only migration.

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS scheduling_mode TEXT NOT NULL DEFAULT 'task_driven',
  ADD COLUMN IF NOT EXISTS team_leader_model_id UUID REFERENCES models(id),
  ADD COLUMN IF NOT EXISTS leader_check_interval INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS next_participant_index INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_json JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE conversation_participants
  ADD COLUMN IF NOT EXISTS lifecycle_status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS skip_reason TEXT,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failure_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS conversation_coordination_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES conversation_participants(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coord_events_conversation
  ON conversation_coordination_events(conversation_id, created_at);
