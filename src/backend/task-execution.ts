import type { ProjectConnection } from '../connections.js';
import type { GenerateRequest, GenerateResult } from '../providers/types.js';
import { ProviderRuntime, type ExecutionAuthorizationStatus, type ProviderInvocationRequest } from './provider-runtime.js';
import { assertDurableEvent, transitionTask, type TaskEvent, type TaskStatus } from './task-state.js';
import type { DurableExecutionResult, TaskExecutionResultStore } from './task-execution-result.js';
import { buildTaskContinuationCheckpoint, type TaskContinuationCheckpointStore, type TaskContinuationStateStore } from './task-continuation.js';
import {
  accountTurnBudget,
  type SeatTurnBudgetConfig,
  type TurnBudgetAccounting,
} from './seat-turn-budget.js';
import { requiresContinuation } from '../providers/termination.js';

export type ExecutableTask = {
  id: string;
  projectId: string;
  seatId: string;
  provider: string;
  model: string;
  status: TaskStatus;
  approved: boolean;
  authorizationStatus: ExecutionAuthorizationStatus;
  connection: ProjectConnection;
  request: Omit<GenerateRequest, 'model'>;
  /** Backend-owned budget configuration; never supplied as execution authority by the browser. */
  turnBudget?: SeatTurnBudgetConfig;
  /** Backend-derived estimate used only for handoff prediction. */
  estimatedCompletionNeedTokens?: number;
};

export type TaskExecutionEventStore = {
  hasIdempotencyKey(idempotencyKey: string): Promise<boolean>;
  append(event: TaskEvent): Promise<void>;
};

export type TaskExecutionResult = {
  status: 'completed' | 'failed' | 'handoff_required';
  result?: GenerateResult;
  error?: unknown;
  budget?: TurnBudgetAccounting;
  continuationCheckpointId?: string;
  duplicate: boolean;
};

export class TaskExecutionService {
  constructor(
    private readonly runtime: ProviderRuntime,
    private readonly events: TaskExecutionEventStore,
    private readonly results?: TaskExecutionResultStore,
    private readonly checkpoints?: TaskContinuationCheckpointStore,
    private readonly continuationState?: TaskContinuationStateStore,
  ) {}

  async execute(task: ExecutableTask, actorId: string, idempotencyKey: string): Promise<TaskExecutionResult> {
    if (!actorId.trim()) throw new Error('actorId is required');
    if (!idempotencyKey.trim()) throw new Error('idempotencyKey is required');
    if (!task.id.trim()) throw new Error('task.id is required');
    if (await this.events.hasIdempotencyKey(idempotencyKey)) {
      const status = task.status === 'completed'
        ? 'completed'
        : task.status === 'handoff_required' || task.status === 'waiting_for_continuation'
          ? 'handoff_required'
          : 'failed';
      return { status, duplicate: true };
    }
    if (task.status !== 'waiting_approval') {
      throw new Error(`task execution requires waiting_approval state, got ${task.status}`);
    }
    if (!task.approved) throw new Error('task execution requires approval');
    if (task.authorizationStatus !== 'authorized') throw new Error(`task execution requires authorization, got ${task.authorizationStatus}`);

    const startedAt = new Date().toISOString();
    const startEvent = this.event(`${idempotencyKey}:start`, idempotencyKey, 'START', actorId, startedAt);
    assertDurableEvent(startEvent);
    await this.events.append(startEvent);
    task.status = transitionTask(task.status, 'START');

    const budgetBeforeExecution = task.turnBudget
      ? accountTurnBudget({
        config: task.turnBudget,
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        estimatedCompletionNeedTokens: task.estimatedCompletionNeedTokens,
      })
      : undefined;

    const request = budgetBeforeExecution
      ? {
        ...task.request,
        maxOutputTokens: task.request.maxOutputTokens === undefined
          ? budgetBeforeExecution.providerOutputCeilingTokens
          : Math.min(task.request.maxOutputTokens, budgetBeforeExecution.providerOutputCeilingTokens),
      }
      : task.request;

    const invocation: ProviderInvocationRequest = {
      taskId: task.id,
      projectId: task.projectId,
      seatId: task.seatId,
      provider: task.provider,
      model: task.model,
      executionStatus: 'running',
      approved: task.approved,
      authorizationStatus: task.authorizationStatus,
      connection: task.connection,
      request,
    };

    let result: GenerateResult | undefined;
    let providerError: unknown;
    try { result = await this.runtime.invoke(invocation); } catch (error) { providerError = error; }

    if (providerError !== undefined) {
      const failKey = `${idempotencyKey}:fail`;
      const failEvent = this.event(`${failKey}:event`, failKey, 'FAIL', actorId, new Date().toISOString());
      assertDurableEvent(failEvent);
      await this.persistResult({ taskId: task.id, projectId: task.projectId, seatId: task.seatId, eventId: failEvent.eventId, idempotencyKey: failKey, status: 'failed', recordedAt: failEvent.occurredAt, error: serializeError(providerError) });
      await this.events.append(failEvent);
      task.status = transitionTask(task.status, 'FAIL');
      return { status: 'failed', error: providerError, budget: budgetBeforeExecution ?? undefined, duplicate: false };
    }

    if (!result) throw new Error('ProviderRuntime returned no result');
    const budgetAfterExecution = task.turnBudget
      ? accountTurnBudget({
        config: task.turnBudget,
        usage: result.usage,
        estimatedCompletionNeedTokens: task.estimatedCompletionNeedTokens,
      })
      : null;

    if (result.termination && result.termination.state !== 'completed') {
      if (requiresContinuation(result.termination)) {
        const handoffKey = `${idempotencyKey}:handoff`;
        const handoffEvent = this.event(`${handoffKey}:event`, handoffKey, 'HANDOFF_REQUIRED', actorId, new Date().toISOString());
        assertDurableEvent(handoffEvent);
        const checkpoint = buildTaskContinuationCheckpoint({
          task,
          actorId,
          idempotencyKey,
          result,
          budget: budgetAfterExecution,
          occurredAt: handoffEvent.occurredAt,
        });
        if (this.checkpoints) await this.checkpoints.persistCheckpoint(checkpoint);
        if (this.continuationState) {
          // The initial handoff remains handoff_required. The explicit continuation request
          // is the boundary that moves the task into waiting_for_continuation.
        }
        await this.persistResult({
          taskId: task.id,
          projectId: task.projectId,
          seatId: task.seatId,
          eventId: handoffEvent.eventId,
          idempotencyKey: handoffKey,
          status: 'handoff_required',
          continuationCheckpointId: checkpoint.checkpointId,
          recordedAt: handoffEvent.occurredAt,
          result,
          termination: result.termination,
        });
        await this.events.append(handoffEvent);
        task.status = transitionTask(task.status, 'HANDOFF_REQUIRED');
        return {
          status: 'handoff_required',
          result,
          budget: budgetAfterExecution ?? undefined,
          continuationCheckpointId: checkpoint.checkpointId,
          duplicate: false,
        };
      }

      const failKey = `${idempotencyKey}:termination`;
      const failEvent = this.event(`${failKey}:event`, failKey, 'FAIL', actorId, new Date().toISOString());
      assertDurableEvent(failEvent);
      const terminationError = new Error(`provider terminated before completion: ${result.termination.reason}`);
      await this.persistResult({
        taskId: task.id,
        projectId: task.projectId,
        seatId: task.seatId,
        eventId: failEvent.eventId,
        idempotencyKey: failKey,
        status: 'failed',
        recordedAt: failEvent.occurredAt,
        result,
        termination: result.termination,
        error: { name: terminationError.name, message: terminationError.message },
      });
      await this.events.append(failEvent);
      task.status = transitionTask(task.status, 'FAIL');
      return { status: 'failed', result, error: terminationError, budget: budgetAfterExecution ?? undefined, duplicate: false };
    }

    const completeKey = `${idempotencyKey}:complete`;
    const completeEvent = this.event(`${completeKey}:event`, completeKey, 'COMPLETE', actorId, new Date().toISOString());
    assertDurableEvent(completeEvent);
    await this.persistResult({
      taskId: task.id,
      projectId: task.projectId,
      seatId: task.seatId,
      eventId: completeEvent.eventId,
      idempotencyKey: completeKey,
      status: 'completed',
      recordedAt: completeEvent.occurredAt,
      result,
      termination: result.termination,
    });
    await this.events.append(completeEvent);
    task.status = transitionTask(task.status, 'COMPLETE');
    return { status: 'completed', result, budget: budgetAfterExecution ?? undefined, duplicate: false };
  }

  private async persistResult(result: DurableExecutionResult): Promise<void> {
    if (!this.results) return;
    // The durable result document is create-only. Its uniqueness condition is
    // the write itself, so a preflight hasResult() read is unnecessary.
    // This keeps one terminal result at one durable write attempt.
    await this.results.persist(result);
  }

  private event(eventId: string, idempotencyKey: string, type: TaskEvent['type'], actorId: string, occurredAt: string): TaskEvent {
    return { eventId, idempotencyKey, type, actorId, occurredAt };
  }
}

function serializeError(error: unknown): unknown {
  if (error instanceof Error) return { name: error.name, message: error.message };
  return error;
}
