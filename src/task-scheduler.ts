import type { QueryResult, SqlDatabase } from './repositories/db.js';

export type ExecutionTaskStatus = 'pending' | 'running' | 'paused' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';

export interface ExecutionTaskRecord {
  id: string;
  execution_run_id: string;
  sequence_no: number;
  title: string;
  status: ExecutionTaskStatus;
  attempt_count: number;
  priority?: number;
  available_at?: string;
  claimed_by?: string | null;
  claimed_at?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  result_json?: unknown;
}

export interface TaskDependencyRecord {
  task_id: string;
  depends_on_task_id: string;
}

export interface TaskEventRecord {
  id: string;
  execution_run_id: string;
  execution_task_id: string;
  event_type: string;
  from_status?: ExecutionTaskStatus | null;
  to_status?: ExecutionTaskStatus | null;
  payload: unknown;
  created_at: string;
}

export interface TaskQueueRepositoryPort {
  createTask(input: { executionRunId: string; sequenceNo: number; title: string; priority?: number; availableAt?: string }): Promise<ExecutionTaskRecord>;
  addDependency(taskId: string, dependsOnTaskId: string): Promise<TaskDependencyRecord>;
  listDependencies(taskId: string): Promise<TaskDependencyRecord[]>;
  claimNextEligibleTask(executionRunId: string, workerId: string, now?: string): Promise<ExecutionTaskRecord | null>;
  transitionTask(taskId: string, to: ExecutionTaskStatus, payload?: unknown, eventType?: string): Promise<ExecutionTaskRecord | null>;
  listEvents(executionTaskId: string, limit?: number): Promise<TaskEventRecord[]>;
}

export class TaskQueueRepository implements TaskQueueRepositoryPort {
  constructor(private readonly db: SqlDatabase) {}

  async createTask(input: { executionRunId: string; sequenceNo: number; title: string; priority?: number; availableAt?: string }) {
    const result = await this.db.query<ExecutionTaskRecord>(
      `INSERT INTO execution_tasks(execution_run_id,sequence_no,title,status,priority,available_at)
       VALUES($1,$2,$3,'pending',COALESCE($4,0),COALESCE($5,now()))
       RETURNING *`,
      [input.executionRunId, input.sequenceNo, input.title, input.priority ?? null, input.availableAt ?? null]
    );
    const task = result.rows[0];
    if (!task) throw new Error(`task insert returned no row for ${input.executionRunId}:${input.sequenceNo}`);
    return task;
  }

  async addDependency(taskId: string, dependsOnTaskId: string) {
    if (taskId === dependsOnTaskId) throw new Error('a task cannot depend on itself');
    const result = await this.db.query<TaskDependencyRecord>(
      `INSERT INTO execution_task_dependencies(task_id,depends_on_task_id)
       VALUES($1,$2)
       ON CONFLICT(task_id,depends_on_task_id) DO NOTHING
       RETURNING *`,
      [taskId, dependsOnTaskId]
    );
    if (result.rows[0]) return result.rows[0];
    const existing = await this.db.query<TaskDependencyRecord>(
      `SELECT task_id,depends_on_task_id FROM execution_task_dependencies WHERE task_id=$1 AND depends_on_task_id=$2`,
      [taskId, dependsOnTaskId]
    );
    const dependency = existing.rows[0];
    if (!dependency) throw new Error(`dependency insert/read returned no row for ${taskId} -> ${dependsOnTaskId}`);
    return dependency;
  }

  async listDependencies(taskId: string) {
    const result = await this.db.query<TaskDependencyRecord>(
      `SELECT task_id,depends_on_task_id FROM execution_task_dependencies WHERE task_id=$1 ORDER BY depends_on_task_id`,
      [taskId]
    );
    return result.rows;
  }

  async claimNextEligibleTask(executionRunId: string, workerId: string, now = new Date().toISOString()) {
    const result = await this.db.query<ExecutionTaskRecord>(
      `WITH candidate AS (
         SELECT t.id
         FROM execution_tasks t
         WHERE t.execution_run_id=$1
           AND t.status='pending'
           AND COALESCE(t.available_at,now()) <= $3::timestamptz
           AND NOT EXISTS (
             SELECT 1
             FROM execution_task_dependencies d
             JOIN execution_tasks prerequisite ON prerequisite.id=d.depends_on_task_id
             WHERE d.task_id=t.id AND prerequisite.status <> 'completed'
           )
         ORDER BY COALESCE(t.priority,0) DESC,t.sequence_no ASC,t.created_at ASC
         FOR UPDATE SKIP LOCKED
         LIMIT 1
       ), claimed AS (
         UPDATE execution_tasks t
         SET status='running',
             attempt_count=t.attempt_count+1,
             claimed_by=$2,
             claimed_at=$3::timestamptz,
             started_at=COALESCE(t.started_at,$3::timestamptz)
         FROM candidate
         WHERE t.id=candidate.id
         RETURNING t.*
       ), journaled AS (
         INSERT INTO execution_task_events(execution_run_id,execution_task_id,event_type,from_status,to_status,payload)
         SELECT execution_run_id,id,'task_claimed','pending','running',jsonb_build_object('workerId',$2)
         FROM claimed
         RETURNING execution_task_id
       )
       SELECT * FROM claimed`,
      [executionRunId, workerId, now]
    );
    return result.rows[0] ?? null;
  }

  async transitionTask(taskId: string, to: ExecutionTaskStatus, payload: unknown = {}, eventType = 'task_transition') {
    const currentResult = await this.db.query<ExecutionTaskRecord>(`SELECT * FROM execution_tasks WHERE id=$1`, [taskId]);
    const current = currentResult.rows[0];
    if (!current) return null;
    if (!isValidTaskTransition(current.status, to)) throw new Error(`invalid task transition ${current.status} -> ${to}`);
    const finished = ['completed', 'failed', 'cancelled'].includes(to);
    const result = await this.db.query<ExecutionTaskRecord>(
      `WITH updated AS (
         UPDATE execution_tasks
         SET status=$3,
             result_json=CASE WHEN $4::boolean THEN $5::jsonb ELSE result_json END,
             finished_at=CASE WHEN $4::boolean THEN now() ELSE finished_at END
         WHERE id=$1 AND status=$2
         RETURNING *
       ), journaled AS (
         INSERT INTO execution_task_events(execution_run_id,execution_task_id,event_type,from_status,to_status,payload)
         SELECT execution_run_id,id,$6,$2,status,$5::jsonb FROM updated
         RETURNING execution_task_id
       )
       SELECT * FROM updated`,
      [taskId, current.status, to, finished, JSON.stringify(payload), eventType]
    );
    const updated = result.rows[0];
    if (!updated && current) throw new Error(`task transition lost concurrency for ${taskId}: expected ${current.status}`);
    return updated ?? null;
  }

  async listEvents(executionTaskId: string, limit = 100) {
    const result = await this.db.query<TaskEventRecord>(
      `SELECT * FROM execution_task_events WHERE execution_task_id=$1 ORDER BY created_at ASC LIMIT $2`,
      [executionTaskId, limit]
    );
    return result.rows;
  }
}

export function isValidTaskTransition(from: ExecutionTaskStatus, to: ExecutionTaskStatus): boolean {
  const transitions: Record<ExecutionTaskStatus, ExecutionTaskStatus[]> = {
    pending: ['running', 'cancelled'],
    running: ['paused', 'waiting_approval', 'completed', 'failed', 'cancelled'],
    paused: ['running', 'cancelled'],
    waiting_approval: ['running', 'failed', 'cancelled'],
    completed: [],
    failed: ['pending', 'cancelled'],
    cancelled: [],
  };
  return transitions[from].includes(to);
}

export function allDependenciesCompleted(task: { status: ExecutionTaskStatus }, dependencies: Array<{ status: ExecutionTaskStatus }>): boolean {
  return dependencies.every((dependency) => dependency.status === 'completed') && task.status === 'pending';
}
