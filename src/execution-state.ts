export type ExecutionStatus = 'pending' | 'validating' | 'running' | 'paused' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';

export function canStartExecution(status: ExecutionStatus, approved: boolean): boolean {
  return status === 'pending' && approved;
}

export function canTransition(from: ExecutionStatus, to: ExecutionStatus): boolean {
  const table: Record<ExecutionStatus, ExecutionStatus[]> = {
    pending: ['validating', 'cancelled'],
    validating: ['running', 'failed', 'cancelled'],
    running: ['paused', 'waiting_approval', 'completed', 'failed', 'cancelled'],
    paused: ['running', 'cancelled'],
    waiting_approval: ['running', 'failed', 'cancelled'],
    completed: [], failed: [], cancelled: []
  };
  return table[from].includes(to);
}
