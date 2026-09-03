export type TaskStatus =
  | 'pending'
  | 'ready'
  | 'leased'
  | 'running'
  | 'waiting_approval'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type TaskEventType = 'READY' | 'LEASE' | 'START' | 'WAIT_APPROVAL' | 'BLOCK' | 'COMPLETE' | 'FAIL' | 'CANCEL';

const TRANSITIONS: Record<TaskStatus, Partial<Record<TaskEventType, TaskStatus>>> = {
  pending: { READY: 'ready', CANCEL: 'cancelled' },
  ready: { LEASE: 'leased', CANCEL: 'cancelled' },
  leased: { START: 'running', CANCEL: 'cancelled', FAIL: 'failed' },
  running: { WAIT_APPROVAL: 'waiting_approval', BLOCK: 'blocked', COMPLETE: 'completed', FAIL: 'failed', CANCEL: 'cancelled' },
  waiting_approval: { START: 'running', CANCEL: 'cancelled', FAIL: 'failed' },
  blocked: { LEASE: 'leased', CANCEL: 'cancelled', FAIL: 'failed' },
  completed: {},
  failed: {},
  cancelled: {},
};

export type TaskEvent = {
  eventId: string;
  idempotencyKey: string;
  type: TaskEventType;
  actorId: string;
  occurredAt: string;
};

export function transitionTask(status: TaskStatus, event: TaskEventType): TaskStatus {
  const next = TRANSITIONS[status][event];
  if (!next) throw new Error(`invalid task transition ${status} -> ${event}`);
  return next;
}

export function assertDurableEvent(event: TaskEvent): void {
  for (const [field, value] of Object.entries(event)) {
    if (!String(value).trim()) throw new Error(`durable task event requires ${field}`);
  }
}
