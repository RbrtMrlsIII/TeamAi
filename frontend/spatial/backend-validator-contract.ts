export type BackendFactSource = 'backend' | 'fixture';

export type BackendExecutionFact = {
  source: BackendFactSource;
  taskId: string;
  taskStatus:
    | 'pending'
    | 'ready'
    | 'leased'
    | 'running'
    | 'waiting_approval'
    | 'blocked'
    | 'completed'
    | 'failed'
    | 'cancelled';
  approved: boolean;
  connection: 'ready' | 'degraded' | 'inactive';
  provider: string;
  seatId: string;
  lastEventType?: string;
};

export type BackendFactValidation =
  | { valid: true }
  | { valid: false; reasons: string[] };

/**
 * Presentation-only validator for backend-owned execution facts.
 * It never selects work, invokes providers, mutates backend state, or grants entitlement.
 */
export function validateBackendExecutionFact(
  fact: BackendExecutionFact,
): BackendFactValidation {
  const reasons: string[] = [];

  if (!fact.taskId.trim()) reasons.push('taskId is required');
  if (!fact.seatId.trim()) reasons.push('seatId is required');
  if (!fact.provider.trim()) reasons.push('provider is required');

  if (
    fact.taskStatus === 'running' &&
    fact.connection !== 'ready'
  ) {
    reasons.push('running task must report a ready connection');
  }

  if (fact.taskStatus === 'completed' && !fact.lastEventType) {
    reasons.push('completed task should expose its terminal event type');
  }

  return reasons.length === 0 ? { valid: true } : { valid: false, reasons };
}

export function executionFactLabel(fact: BackendExecutionFact): string {
  return `${fact.taskStatus} · ${fact.connection} · ${fact.seatId}`;
}
