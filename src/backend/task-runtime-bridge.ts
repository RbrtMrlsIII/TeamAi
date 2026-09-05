import type { ExecutableTask, TaskExecutionResult, TaskExecutionEventStore } from './task-execution.js';
import { TaskExecutionService } from './task-execution.js';
import type { ProviderRuntime } from './provider-runtime.js';
import type { SchedulerDecision, SchedulerSeat, SchedulerTask } from './scheduler.js';
import { selectEligibleSeat } from './scheduler.js';
import type { AtomicTaskLeaseStore } from './task-lease.js';

export type RuntimeTaskStore = {
  getSchedulerTask(taskId: string): Promise<SchedulerTask | null>;
  listSchedulerSeats(projectId: string): Promise<SchedulerSeat[]>;
  getExecutableTask(taskId: string, seatId: string): Promise<ExecutableTask | null>;
};

export type RuntimeApprovalStore = {
  approveLeasedTask(input: { taskId: string; seatId: string; leaseId: string; actorId: string }): Promise<
    { approved: true } | { approved: false; reason: 'LEASE_NOT_FOUND' | 'LEASE_EXPIRED' | 'TASK_NOT_LEASED' }
  >;
};

export type TaskRuntimeBridgeResult =
  | { stage: 'scheduled'; decision: SchedulerDecision }
  | { stage: 'leased'; decision: SchedulerDecision; leaseId: string }
  | { stage: 'approved'; decision: SchedulerDecision; leaseId: string }
  | { stage: 'executed'; decision: SchedulerDecision; leaseId: string; result: TaskExecutionResult };

export class TaskRuntimeBridge {
  private readonly execution: TaskExecutionService;

  constructor(
    runtime: ProviderRuntime,
    private readonly state: RuntimeTaskStore,
    private readonly leases: AtomicTaskLeaseStore,
    private readonly approvals: RuntimeApprovalStore,
    events: TaskExecutionEventStore,
  ) {
    this.execution = new TaskExecutionService(runtime, events);
  }

  async schedule(taskId: string): Promise<{ decision: SchedulerDecision }> {
    const task = await this.state.getSchedulerTask(taskId);
    if (!task) throw new Error(`task not found: ${taskId}`);
    const seats = await this.state.listSchedulerSeats(task.projectId);
    return { decision: selectEligibleSeat(task, seats) };
  }

  async lease(taskId: string, actorId: string, leaseId: string): Promise<TaskRuntimeBridgeResult> {
    if (!actorId.trim()) throw new Error('actorId is required');
    if (!leaseId.trim()) throw new Error('leaseId is required');
    const { decision } = await this.schedule(taskId);
    if (decision.reason !== 'ELIGIBLE' || !decision.eligibleSeatId) return { stage: 'scheduled', decision };

    const lease = await this.leases.leaseReadyTask({
      taskId,
      seatId: decision.eligibleSeatId,
      leaseId,
      actorId,
    });
    if (!lease.acquired) {
      return { stage: 'scheduled', decision: { ...decision, eligibleSeatId: null, reason: 'TASK_NOT_READY' } };
    }
    return { stage: 'leased', decision, leaseId: lease.leaseId };
  }

  async approve(taskId: string, actorId: string, leaseId: string): Promise<TaskRuntimeBridgeResult> {
    const leased = await this.lease(taskId, actorId, leaseId);
    if (leased.stage !== 'leased') return leased;
    const seatId = leased.decision.eligibleSeatId;
    if (!seatId) throw new Error('approved transition requires an eligible seat');
    const approval = await this.approvals.approveLeasedTask({ taskId, seatId, leaseId, actorId });
    if (!approval.approved) throw new Error(`task approval failed: ${approval.reason}`);
    return { stage: 'approved', decision: leased.decision, leaseId };
  }

  async executeApproved(taskId: string, actorId: string, leaseId: string): Promise<TaskRuntimeBridgeResult> {
    const approved = await this.approve(taskId, actorId, leaseId);
    if (approved.stage !== 'approved') return approved;
    const seatId = approved.decision.eligibleSeatId;
    if (!seatId) throw new Error('approved execution requires an eligible seat');

    const task = await this.state.getExecutableTask(taskId, seatId);
    if (!task) throw new Error(`executable task not found: ${taskId}`);
    if (task.seatId !== seatId) throw new Error('executable task seat does not match lease');
    if (task.status !== 'waiting_approval') throw new Error(`task execution requires waiting_approval state, got ${task.status}`);

    const result = await this.execution.execute(task, actorId, `${leaseId}:execute`);
    return { stage: 'executed', decision: approved.decision, leaseId, result };
  }
}
