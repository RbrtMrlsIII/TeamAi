export type EntityId = string;

export type AccountState = {
  uid: string;
  defaultWorkplaceId?: EntityId;
  createdAt: string;
  updatedAt: string;
};

export type WorkplaceState = {
  uid: string;
  id: EntityId;
  workspaceType: string;
  rulesetVersion: string;
  status: 'active' | 'archived';
};

export type ProjectState = {
  uid: string;
  workplaceId: EntityId;
  id: EntityId;
  purpose: string;
  status: 'active' | 'paused' | 'archived';
};

export type TeamState = {
  uid: string;
  workplaceId: EntityId;
  projectId: EntityId;
  id: EntityId;
  name: string;
};

export type SeatAuthorizationState = {
  capabilities: string[];
  allowedTaskTypes: string[];
  status: 'authorized' | 'suspended' | 'revoked';
};

export type SeatState = {
  uid: string;
  workplaceId: EntityId;
  projectId: EntityId;
  teamId: EntityId;
  id: EntityId;
  provider: string;
  application: string;
  runtime?: string;
  field: string;
  skills: string[];
  authorization: SeatAuthorizationState;
  status: 'active' | 'paused' | 'revoked';
};

export type ConnectionState = {
  uid: string;
  projectId: EntityId;
  seatId: EntityId;
  id: EntityId;
  provider: string;
  capabilities: string[];
  status: 'active' | 'revoked' | 'error';
};

export type TaskRequirementState = {
  taskType: string;
  field: string;
  requiredSkills: string[];
  requiredCapabilities: string[];
};

export type TaskStateRecord = {
  uid: string;
  projectId: EntityId;
  id: EntityId;
  status: 'pending' | 'ready' | 'leased' | 'running' | 'waiting_approval' | 'blocked' | 'completed' | 'failed' | 'cancelled';
  approved: boolean;
  requirements: TaskRequirementState;
};

export type DurableEventRecord = {
  uid: string;
  projectId: EntityId;
  taskId: EntityId;
  eventId: EntityId;
  idempotencyKey: string;
  type: string;
  actorId: string;
  occurredAt: string;
};

export function assertUidOwnership(expectedUid: string, resourceUid: string): void {
  if (!expectedUid.trim()) throw new Error('expectedUid is required');
  if (!resourceUid.trim()) throw new Error('resourceUid is required');
  if (expectedUid !== resourceUid) {
    throw new Error('resource is not owned by the authenticated Firebase UID');
  }
}

export function assertStateIdentity(uid: string, id: string, name: string): void {
  assertUidOwnership(uid, uid);
  if (!id.trim()) throw new Error(`${name} id is required`);
}

export interface DurableDomainStateStore {
  getAccount(uid: string): Promise<AccountState | null>;
  getSeat(uid: string, projectId: string, seatId: string): Promise<SeatState | null>;
  getConnection(uid: string, projectId: string, connectionId: string): Promise<ConnectionState | null>;
  getTask(uid: string, projectId: string, taskId: string): Promise<TaskStateRecord | null>;
  appendEvent(event: DurableEventRecord): Promise<void>;
}
