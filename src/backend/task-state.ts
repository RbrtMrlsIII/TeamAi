export type TaskStatus =
  | 'pending'
  | 'ready'
  | 'leased'
  | 'running'
  | 'waiting_approval'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'handoff_required'
  | 'waiting_for_continuation';

export type TaskEventType = 'READY' | 'LEASE' | 'START' | 'WAIT_APPROVAL' | 'BLOCK' | 'COMPLETE' | 'FAIL' | 'CANCEL' | 'HANDOFF_REQUIRED' | 'CONTINUE_WAIT' | 'CONTINUE_START';

const TRANSITIONS: Record<TaskStatus, Partial<Record<TaskEventType, TaskStatus>>> = {
  pending: { READY: 'ready', CANCEL: 'cancelled' },
  ready: { LEASE: 'leased', CANCEL: 'cancelled' },
  leased: { START: 'running', CANCEL: 'cancelled', FAIL: 'failed' },
  running: { WAIT_APPROVAL: 'waiting_approval', BLOCK: 'blocked', COMPLETE: 'completed', FAIL: 'failed', CANCEL: 'cancelled', HANDOFF_REQUIRED: 'handoff_required' },
  waiting_approval: { START: 'running', CANCEL: 'cancelled', FAIL: 'failed' },
  blocked: { LEASE: 'leased', CANCEL: 'cancelled', FAIL: 'failed' },
  completed: {},
  failed: {},
  cancelled: {},
  handoff_required: { CONTINUE_WAIT: 'waiting_for_continuation', CANCEL: 'cancelled', FAIL: 'failed' },
  waiting_for_continuation: { CONTINUE_START: 'running', CANCEL: 'cancelled' },
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
