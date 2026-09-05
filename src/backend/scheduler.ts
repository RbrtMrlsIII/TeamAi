export type SchedulerTask = {
  id: string;
  projectId: string;
  priority: number;
  requirements: {
    taskType: string;
    field: string;
    requiredSkills: string[];
    requiredCapabilities: string[];
  };
  status: 'pending' | 'ready' | 'leased' | 'running' | 'waiting_approval' | 'blocked' | 'completed' | 'failed' | 'cancelled';
};

export type SchedulerSeat = {
  id: string;
  projectId: string;
  field: string;
  skills: string[];
  capabilities: string[];
  allowedTaskTypes: string[];
  status: 'active' | 'paused' | 'revoked';
  authorization: 'authorized' | 'suspended' | 'revoked';
};

export type SchedulerDecision = {
  taskId: string;
  eligibleSeatId: string | null;
  reason:
    | 'ELIGIBLE'
    | 'TASK_NOT_READY'
    | 'NO_PROJECT_MATCH'
    | 'NO_AUTHORIZED_SEAT'
    | 'NO_CAPABLE_SEAT'
    | 'NO_SKILLED_SEAT';
};

function includesAll(values: string[], required: string[]): boolean {
  const actual = new Set(values);
  return required.every((value) => actual.has(value));
}

function validateIdentity(value: string, name: string): void {
  if (!value.trim()) throw new Error(`${name} is required`);
}

/**
 * Pure eligibility calculation. It never invokes a provider, mutates durable
 * state, or chooses based on branch/recent activity. Selection is based only
 * on durable task requirements plus seat responsibility and authorization.
 */
export function selectEligibleSeat(task: SchedulerTask, seats: SchedulerSeat[]): SchedulerDecision {
  validateIdentity(task.id, 'task.id');
  validateIdentity(task.projectId, 'task.projectId');

  if (task.status !== 'ready') {
    return { taskId: task.id, eligibleSeatId: null, reason: 'TASK_NOT_READY' };
  }

  const projectSeats = seats.filter((seat) => seat.projectId === task.projectId);
  if (projectSeats.length === 0) {
    return { taskId: task.id, eligibleSeatId: null, reason: 'NO_PROJECT_MATCH' };
  }

  const authorized = projectSeats.filter(
    (seat) => seat.status === 'active'
      && seat.authorization === 'authorized'
      && seat.allowedTaskTypes.includes(task.requirements.taskType),
  );
  if (authorized.length === 0) {
    return { taskId: task.id, eligibleSeatId: null, reason: 'NO_AUTHORIZED_SEAT' };
  }

  const capable = authorized.filter((seat) =>
    seat.field === task.requirements.field
    && includesAll(seat.capabilities, task.requirements.requiredCapabilities),
  );
  if (capable.length === 0) {
    return { taskId: task.id, eligibleSeatId: null, reason: 'NO_CAPABLE_SEAT' };
  }

  const skilled = capable.filter((seat) => includesAll(seat.skills, task.requirements.requiredSkills));
  if (skilled.length === 0) {
    return { taskId: task.id, eligibleSeatId: null, reason: 'NO_SKILLED_SEAT' };
  }

  const selected = [...skilled].sort((a, b) => a.id.localeCompare(b.id))[0];
  return { taskId: task.id, eligibleSeatId: selected?.id ?? null, reason: 'ELIGIBLE' };
}
