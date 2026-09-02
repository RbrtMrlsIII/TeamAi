-- TEAM-FOUNDATION-029 implementation tranche: durable task/dependency graph + scheduler events.
-- This migration extends the existing execution task model; it does not replace prior migrations.

ALTER TABLE execution_tasks
  ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS claimed_by TEXT,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS execution_task_dependencies (
  task_id UUID NOT NULL REFERENCES execution_tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES execution_tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(task_id, depends_on_task_id),
  CHECK(task_id <> depends_on_task_id)
);

CREATE INDEX IF NOT EXISTS idx_execution_task_dependencies_prerequisite
  ON execution_task_dependencies(depends_on_task_id);

CREATE TABLE IF NOT EXISTS execution_task_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_run_id UUID NOT NULL REFERENCES execution_runs(id) ON DELETE CASCADE,
  execution_task_id UUID NOT NULL REFERENCES execution_tasks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_execution_task_events_task_created
  ON execution_task_events(execution_task_id, created_at);
CREATE INDEX IF NOT EXISTS idx_execution_task_events_run_created
  ON execution_task_events(execution_run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_execution_tasks_scheduler
  ON execution_tasks(execution_run_id, status, available_at, priority, sequence_no);
