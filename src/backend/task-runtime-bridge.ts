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
  approveLeasedTask(input: { uid: string; workplaceId: string; projectId: string; taskId: string; seatId: string; leaseId: string; actorId: string }): Promise<
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
    private readonly events: TaskExecutionEventStore,
  ) {
    this.execution = new TaskExecutionService(runtime, events);
  }

  async schedule(taskId: string): Promise<{ decision: SchedulerDecision }> {
    const task = await this.state.getSchedulerTask(taskId);
    if (!task) throw new Error(`task not found: ${taskId}`);
    const seats = await this.state.listSchedulerSeats(task.projectId);
    return { decision: selectEligibleSeat(task, seats) };
  }

  private async eligibleTask(taskId: string): Promise<{ task: SchedulerTask; decision: SchedulerDecision }> {
    const task = await this.state.getSchedulerTask(taskId);
    if (!task) throw new Error(`task not found: ${taskId}`);
    const seats = await this.state.listSchedulerSeats(task.projectId);
    return { task, decision: selectEligibleSeat(task, seats) };
  }

  async lease(input: { uid: string; workplaceId: string; actorId: string; leaseId: string; taskId: string }): Promise<TaskRuntimeBridgeResult> {
    if (!input.uid.trim()) throw new Error('uid is required');
    if (!input.workplaceId.trim()) throw new Error('workplaceId is required');
    if (!input.actorId.trim()) throw new Error('actorId is required');
    if (!input.leaseId.trim()) throw new Error('leaseId is required');
    const { task, decision } = await this.eligibleTask(input.taskId);
    if (decision.reason !== 'ELIGIBLE' || !decision.eligibleSeatId) return { stage: 'scheduled', decision };

    const lease = await this.leases.leaseReadyTask({
      uid: input.uid,
      workplaceId: input.workplaceId,
      projectId: task.projectId,
      taskId: input.taskId,
      seatId: decision.eligibleSeatId,
      leaseId: input.leaseId,
      actorId: input.actorId,
    });
    if (!lease.acquired) {
      return { stage: 'scheduled', decision: { ...decision, eligibleSeatId: null, reason: 'TASK_NOT_READY' } };
    }
    return { stage: 'leased', decision, leaseId: lease.leaseId };
  }

  async approve(input: { uid: string; workplaceId: string; actorId: string; leaseId: string; taskId: string }): Promise<TaskRuntimeBridgeResult> {
    const { task, decision } = await this.eligibleTask(input.taskId);
    if (decision.reason !== 'ELIGIBLE' || !decision.eligibleSeatId) return { stage: 'scheduled', decision };
    const lease = await this.lease(input);
    if (lease.stage !== 'leased') return lease;
    const approval = await this.approvals.approveLeasedTask({
      uid: input.uid,
      workplaceId: input.workplaceId,
      projectId: task.projectId,
      taskId: input.taskId,
      seatId: decision.eligibleSeatId,
      leaseId: input.leaseId,
      actorId: input.actorId,
    });
    if (!approval.approved) throw new Error(`task approval failed: ${approval.reason}`);
    return { stage: 'approved', decision, leaseId: input.leaseId };
  }

  async executeApproved(input: { uid: string; workplaceId: string; actorId: string; leaseId: string; taskId: string }): Promise<TaskRuntimeBridgeResult> {
    const approved = await this.approve(input);
    if (approved.stage !== 'approved') return approved;
    const seatId = approved.decision.eligibleSeatId;
    if (!seatId) throw new Error('approved execution requires an eligible seat');

    const task = await this.state.getExecutableTask(input.taskId, seatId);
    if (!task) throw new Error(`executable task not found: ${input.taskId}`);
    if (task.seatId !== seatId) throw new Error('executable task seat does not match lease');
    if (task.status !== 'waiting_approval') throw new Error(`task execution requires waiting_approval state, got ${task.status}`);

    const result = await this.execution.execute(task, input.actorId, `${input.leaseId}:execute`);
    return { stage: 'executed', decision: approved.decision, leaseId: input.leaseId, result };
  }
}
