import type { GenerateResult } from '../providers/types.js';

export type DurableExecutionResult = {
  taskId: string;
  projectId: string;
  seatId: string;
  eventId: string;
  idempotencyKey: string;
  status: 'completed' | 'failed';
  recordedAt: string;
  result?: GenerateResult;
  error?: unknown;
};

export type TaskExecutionResultStore = {
  hasResult(eventId: string): Promise<boolean>;
  persist(result: DurableExecutionResult): Promise<void>;
};
