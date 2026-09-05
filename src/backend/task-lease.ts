import type { TaskStatus } from './task-state.js';

export type LeaseResult =
  | { acquired: true; taskId: string; seatId: string; leaseId: string; status: 'leased' }
  | { acquired: false; taskId: string; reason: 'NOT_READY' | 'ALREADY_LEASED' | 'NOT_FOUND' };

export interface AtomicTaskLeaseStore {
  /**
   * Atomically transition a ready task to leased when it is still ready.
   * Implementations must perform the read/check/write as one transaction.
   */
  leaseReadyTask(input: {
    taskId: string;
    seatId: string;
    leaseId: string;
    actorId: string;
  }): Promise<LeaseResult>;
}

export function assertLeasePrecondition(status: TaskStatus): void {
  if (status !== 'ready') throw new Error(`task lease requires ready state, got ${status}`);
}
