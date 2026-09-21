import type { GenerateResult } from '../providers/types.js';
import type { ProviderTermination } from '../providers/termination.js';
import type { TurnBudgetAccounting } from './seat-turn-budget.js';
import type { ExecutableTask } from './task-execution.js';

export type TaskContinuationCheckpoint = {
  checkpointId: string;
  taskId: string;
  projectId: string;
  seatId: string;
  actorId: string;
  sourceExecutionId: string;
  sourceEventId: string;
  createdAt: string;
  status: 'awaiting_continuation';
  completionState: 'HANDOFF_REQUIRED';
  responsibilityProfile?: string;
  provider: string;
  model: string;
  termination: ProviderTermination;
  providerOutput?: string;
  usage: GenerateResult['usage'];
  remainingGenerationTokens?: number;
  usableGenerationTokens?: number;
  handoffReserveTokens?: number;
  nextAction: 'authorized-continuation-turn';
};

export type TaskContinuationCheckpointStore = {
  getCheckpoint(projectId: string, taskId: string, checkpointId: string): Promise<TaskContinuationCheckpoint | null>;
  persistCheckpoint(checkpoint: TaskContinuationCheckpoint): Promise<void>;
};

export function buildTaskContinuationCheckpoint(input: {
  task: ExecutableTask;
  actorId: string;
  idempotencyKey: string;
  result: GenerateResult;
  budget?: TurnBudgetAccounting | null;
  occurredAt?: string;
}): TaskContinuationCheckpoint {
  if (!input.task.id.trim()) throw new Error('task.id is required');
  if (!input.task.projectId.trim()) throw new Error('task.projectId is required');
  if (!input.task.seatId.trim()) throw new Error('task.seatId is required');
  if (!input.actorId.trim()) throw new Error('actorId is required');
  if (!input.idempotencyKey.trim()) throw new Error('idempotencyKey is required');
  if (!input.result.termination || input.result.termination.state !== 'incomplete') {
    throw new Error('continuation checkpoint requires incomplete provider termination');
  }

  const sourceEventId = input.idempotencyKey + ':handoff:event';
  const budget = input.budget ?? undefined;
  return Object.freeze({
    checkpointId: input.idempotencyKey + ':checkpoint',
    taskId: input.task.id,
    projectId: input.task.projectId,
    seatId: input.task.seatId,
    actorId: input.actorId,
    sourceExecutionId: input.idempotencyKey,
    sourceEventId,
    createdAt: input.occurredAt ?? new Date().toISOString(),
    status: 'awaiting_continuation',
    completionState: 'HANDOFF_REQUIRED',
    responsibilityProfile: budget?.configured.responsibilityProfile,
    provider: input.result.provider,
    model: input.result.model,
    termination: input.result.termination,
    ...(input.result.text ? { providerOutput: input.result.text } : {}),
    usage: input.result.usage,
    remainingGenerationTokens: budget?.usage.remainingGenerationTokens,
    usableGenerationTokens: budget?.usage.usableGenerationTokens,
    handoffReserveTokens: budget?.handoffReserveTokens,
    nextAction: 'authorized-continuation-turn',
  });
}

export function assertContinuationCheckpoint(checkpoint: TaskContinuationCheckpoint): void {
  const required = [
    checkpoint.checkpointId,
    checkpoint.taskId,
    checkpoint.projectId,
    checkpoint.seatId,
    checkpoint.actorId,
    checkpoint.sourceExecutionId,
    checkpoint.sourceEventId,
    checkpoint.createdAt,
    checkpoint.provider,
    checkpoint.model,
    checkpoint.nextAction,
  ];
  if (required.some((value) => !String(value).trim())) {
    throw new Error('invalid continuation checkpoint');
  }
  if (checkpoint.status !== 'awaiting_continuation') throw new Error('invalid continuation checkpoint status');
  if (checkpoint.completionState !== 'HANDOFF_REQUIRED') throw new Error('invalid continuation checkpoint completion state');
  if (checkpoint.termination.state !== 'incomplete') throw new Error('continuation checkpoint termination must be incomplete');
}
