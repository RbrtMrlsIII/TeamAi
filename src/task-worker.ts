import type { ExecutionTaskRecord, TaskQueueRepositoryPort } from './task-scheduler.js';

export interface TaskExecutionResult {
  result?: unknown;
  eventType?: string;
}

export interface TaskWorkerOptions {
  workerId: string;
  maxAttempts?: number;
  leaseTimeoutMs?: number;
}

export type TaskHandler = (task: ExecutionTaskRecord) => Promise<TaskExecutionResult>;

export interface TaskWorkerCycleResult {
  status: 'idle' | 'completed' | 'failed' | 'blocked';
  taskId?: string;
  attempt?: number;
}

export class DurableTaskWorker {
  private readonly maxAttempts: number;
  private readonly leaseTimeoutMs: number;

  constructor(
    private readonly queue: TaskQueueRepositoryPort,
    private readonly options: TaskWorkerOptions,
  ) {
    this.maxAttempts = options.maxAttempts ?? 3;
    this.leaseTimeoutMs = options.leaseTimeoutMs ?? 15 * 60_000;
    if (this.maxAttempts < 1) throw new Error('maxAttempts must be at least 1');
    if (this.leaseTimeoutMs < 1) throw new Error('leaseTimeoutMs must be positive');
  }

  async recoverStaleTasks(executionRunId: string, now = new Date().toISOString()): Promise<number> {
    return this.queue.requeueStaleTasks(executionRunId, this.leaseTimeoutMs, now);
  }

  async runOnce(executionRunId: string, handler: TaskHandler, now = new Date().toISOString()): Promise<TaskWorkerCycleResult> {
    await this.recoverStaleTasks(executionRunId, now);
    const task = await this.queue.claimNextEligibleTask(executionRunId, this.options.workerId, now);
    if (!task) return { status: 'idle' };

    if (task.attempt_count > this.maxAttempts) {
      await this.queue.transitionTask(task.id, 'failed', { reason: 'max_attempts_exceeded', maxAttempts: this.maxAttempts }, 'task_attempt_limit_exceeded');
      return { status: 'blocked', taskId: task.id, attempt: task.attempt_count };
    }

    try {
      const result = await handler(task);
      await this.queue.transitionTask(task.id, 'completed', result.result ?? {}, result.eventType ?? 'task_completed');
      return { status: 'completed', taskId: task.id, attempt: task.attempt_count };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (task.attempt_count >= this.maxAttempts) {
        await this.queue.transitionTask(task.id, 'failed', { reason: 'handler_error', message }, 'task_failed');
        return { status: 'failed', taskId: task.id, attempt: task.attempt_count };
      }
      await this.queue.transitionTask(task.id, 'pending', { reason: 'handler_retry', message, attempt: task.attempt_count }, 'task_requeued');
      return { status: 'failed', taskId: task.id, attempt: task.attempt_count };
    }
  }
}
