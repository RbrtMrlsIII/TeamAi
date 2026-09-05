import type { ProjectConnection } from '../connections.js';
import type { GenerateRequest, GenerateResult } from '../providers/types.js';
import { ProviderRuntime, type ExecutionAuthorizationStatus, type ProviderInvocationRequest } from './provider-runtime.js';
import { assertDurableEvent, transitionTask, type TaskEvent, type TaskStatus } from './task-state.js';

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
};

export type TaskExecutionEventStore = {
  hasIdempotencyKey(idempotencyKey: string): Promise<boolean>;
  append(event: TaskEvent): Promise<void>;
};

export type TaskExecutionResult = {
  status: 'completed' | 'failed';
  result?: GenerateResult;
  error?: unknown;
  duplicate: boolean;
};

export class TaskExecutionService {
  constructor(
    private readonly runtime: ProviderRuntime,
    private readonly events: TaskExecutionEventStore,
  ) {}

  async execute(task: ExecutableTask, actorId: string, idempotencyKey: string): Promise<TaskExecutionResult> {
    if (!actorId.trim()) throw new Error('actorId is required');
    if (!idempotencyKey.trim()) throw new Error('idempotencyKey is required');
    if (!task.id.trim()) throw new Error('task.id is required');
    if (await this.events.hasIdempotencyKey(idempotencyKey)) {
      return { status: task.status === 'completed' ? 'completed' : 'failed', duplicate: true };
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
      request: task.request,
    };

    try {
      const result = await this.runtime.invoke(invocation);
      const completeKey = `${idempotencyKey}:complete`;
      const completeEvent = this.event(`${completeKey}:event`, completeKey, 'COMPLETE', actorId, new Date().toISOString());
      assertDurableEvent(completeEvent);
      await this.events.append(completeEvent);
      task.status = transitionTask(task.status, 'COMPLETE');
      return { status: 'completed', result, duplicate: false };
    } catch (error) {
      const failKey = `${idempotencyKey}:fail`;
      const failEvent = this.event(`${failKey}:event`, failKey, 'FAIL', actorId, new Date().toISOString());
      assertDurableEvent(failEvent);
      await this.events.append(failEvent);
      task.status = transitionTask(task.status, 'FAIL');
      return { status: 'failed', error, duplicate: false };
    }
  }

  private event(eventId: string, idempotencyKey: string, type: TaskEvent['type'], actorId: string, occurredAt: string): TaskEvent {
    return { eventId, idempotencyKey, type, actorId, occurredAt };
  }
}
