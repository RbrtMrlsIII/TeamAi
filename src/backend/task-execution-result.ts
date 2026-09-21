import type { GenerateResult } from '../providers/types.js';
import type { ProviderTermination } from '../providers/termination.js';

export type DurableExecutionResult = {
  taskId: string;
  projectId: string;
  seatId: string;
  eventId: string;
  idempotencyKey: string;
  status: 'completed' | 'failed' | 'handoff_required';
  continuationCheckpointId?: string;
  recordedAt: string;
  result?: GenerateResult;
  error?: unknown;
  termination?: ProviderTermination;
};

export type TaskExecutionResultIdentity = Pick<DurableExecutionResult, 'taskId' | 'projectId' | 'eventId'>;

export type TaskExecutionResultStore = {
  hasResult(identity: TaskExecutionResultIdentity): Promise<boolean>;
  getResult(identity: TaskExecutionResultIdentity): Promise<DurableExecutionResult | null>;
  persist(result: DurableExecutionResult): Promise<void>;
};
