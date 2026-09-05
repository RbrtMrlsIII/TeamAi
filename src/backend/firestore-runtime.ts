import { createSign } from 'node:crypto';
import type { ProjectConnection } from '../connections.js';
import type { GenerateRequest } from '../providers/types.js';
import type { ExecutableTask, TaskExecutionEventStore } from './task-execution.js';
import type { AtomicTaskLeaseStore, LeaseResult } from './task-lease.js';
import type { DurableDomainStateStore, AccountState, SeatState, ConnectionState, TaskStateRecord, DurableEventRecord } from './domain-state.js';
import type { RuntimeApprovalStore, RuntimeTaskStore } from './task-runtime-bridge.js';
import type { SchedulerSeat, SchedulerTask } from './scheduler.js';

const FIRESTORE_ROOT = 'https://firestore.googleapis.com/v1';

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { nullValue: null };

function required(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is required');
  let parsed: Partial<ServiceAccount>;
  try {
    parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  } catch {
    throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON');
  }
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error('Firebase service account is incomplete');
  }
  return parsed as ServiceAccount;
}

async function googleAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const assertion = `${signingInput}.${signer.sign(account.private_key, 'base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`Firebase token exchange failed: ${response.status}`);
  const body = await response.json() as { access_token?: unknown };
  if (typeof body.access_token !== 'string') throw new Error('Firebase token exchange returned no access token');
  return body.access_token;
}

function firestoreValue(value: unknown): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) fields[key] = firestoreValue(child);
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported Firestore value: ${typeof value}`);
}

function decodeFirestoreValue(value: FirestoreValue | undefined): unknown {
  if (!value) return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decodeFirestoreValue);
  return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, child]) => [key, decodeFirestoreValue(child)]));
}

function decodeDocument(document: FirestoreDocument): Record<string, unknown> {
  return Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeFirestoreValue(value)]));
}

export class FirestoreRuntimeClient {
  private readonly account: ServiceAccount;

  constructor(
    private readonly projectId = process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official',
    account = loadServiceAccount(),
  ) {
    this.account = account;
    required(projectId, 'projectId');
  }

  private documentUrl(path: string): string {
    const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
    return `${FIRESTORE_ROOT}/projects/${encodeURIComponent(this.projectId)}/databases/(default)/documents/${encoded}`;
  }

  async get(path: string, transaction?: string): Promise<FirestoreDocument | null> {
    const token = await googleAccessToken(this.account);
    const url = new URL(this.documentUrl(path));
    if (transaction) url.searchParams.set('transaction', transaction);
    const response = await fetch(url.toString(), { headers: { authorization: `Bearer ${token}` } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Firestore read failed: ${response.status}`);
    return await response.json() as FirestoreDocument;
  }

  async beginTransaction(): Promise<string> {
    const token = await googleAccessToken(this.account);
    const response = await fetch(`${FIRESTORE_ROOT}/projects/${encodeURIComponent(this.projectId)}/databases/(default)/documents:beginTransaction`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ options: { readWrite: {} } }),
    });
    if (!response.ok) throw new Error(`Firestore begin transaction failed: ${response.status}`);
    const body = await response.json() as { transaction?: string };
    if (!body.transaction) throw new Error('Firestore transaction did not return an id');
    return body.transaction;
  }

  async commit(transaction: string, writes: Array<Record<string, unknown>>): Promise<void> {
    const token = await googleAccessToken(this.account);
    const response = await fetch(`${FIRESTORE_ROOT}/projects/${encodeURIComponent(this.projectId)}/databases/(default)/documents:commit`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ transaction, writes }),
    });
    if (!response.ok) throw new Error(`Firestore commit failed: ${response.status}`);
  }

  static fields(data: Record<string, unknown>): Record<string, FirestoreValue> {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, firestoreValue(value)]));
  }

  static path(uid: string, workplaceId: string, projectId: string, suffix: string): string {
    required(uid, 'uid'); required(workplaceId, 'workplaceId'); required(projectId, 'projectId');
    return `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/${suffix}`;
  }
}

export class FirestoreAtomicTaskLeaseStore implements AtomicTaskLeaseStore {
  constructor(private readonly client: FirestoreRuntimeClient, private readonly uid: string, private readonly workplaceId: string) {}

  async leaseReadyTask(input: { taskId: string; seatId: string; leaseId: string; actorId: string }): Promise<LeaseResult> {
    required(input.taskId, 'taskId'); required(input.seatId, 'seatId'); required(input.leaseId, 'leaseId'); required(input.actorId, 'actorId');
    const transaction = await this.client.beginTransaction();
    const taskPath = FirestoreRuntimeClient.path(this.uid, this.workplaceId, await this.projectForTask(input.taskId), `tasks/${input.taskId}`);
    const taskDocument = await this.client.get(taskPath, transaction);
    if (!taskDocument) return { acquired: false, taskId: input.taskId, reason: 'NOT_FOUND' };
    const current = decodeDocument(taskDocument);
    if (current.status !== 'ready') return { acquired: false, taskId: input.taskId, reason: 'NOT_READY' };

    const leasePath = `${taskPath}/leases/${input.leaseId}`;
    const now = new Date().toISOString();
    const write = {
      update: {
        name: `${this.firestoreDocumentName(leasePath)}`,
        fields: FirestoreRuntimeClient.fields({
          uid: this.uid,
          taskId: input.taskId,
          seatId: input.seatId,
          leaseId: input.leaseId,
          actorId: input.actorId,
          status: 'leased',
          leasedAt: now,
        }),
      },
      currentDocument: { exists: false },
    };
    const taskUpdate = {
      update: {
        name: this.firestoreDocumentName(taskPath),
        fields: FirestoreRuntimeClient.fields({ ...current, status: 'leased', leaseId: input.leaseId, leasedBy: input.actorId, updatedAt: now }),
      },
      currentDocument: { updateTime: taskDocument.updateTime },
    };
    try {
      await this.client.commit(transaction, [write, taskUpdate]);
    } catch (error) {
      if (error instanceof Error && /already exists|aborted|failed_precondition|conflict/i.test(error.message)) {
        return { acquired: false, taskId: input.taskId, reason: 'ALREADY_LEASED' };
      }
      throw error;
    }
    return { acquired: true, taskId: input.taskId, seatId: input.seatId, leaseId: input.leaseId, status: 'leased' };
  }

  private async projectForTask(taskId: string): Promise<string> {
    const task = await this.client.get(`accounts/${this.uid}/workplaces/${this.workplaceId}/task-index/${taskId}`);
    const projectId = task ? decodeDocument(task).projectId : undefined;
    return required(typeof projectId === 'string' ? projectId : '', 'projectId');
  }

  private firestoreDocumentName(path: string): string {
    return `${FIRESTORE_ROOT}/projects/${encodeURIComponent(process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official')}/databases/(default)/documents/${path}`;
  }
}

export class FirestoreRuntimeTaskStore implements RuntimeTaskStore, DurableDomainStateStore {
  constructor(private readonly client: FirestoreRuntimeClient, private readonly uid: string, private readonly workplaceId: string) {}

  async getAccount(uid: string): Promise<AccountState | null> {
    const doc = await this.client.get(`accounts/${required(uid, 'uid')}`);
    return doc ? decodeDocument(doc) as unknown as AccountState : null;
  }

  async getSeat(uid: string, projectId: string, seatId: string): Promise<SeatState | null> {
    const doc = await this.client.get(`accounts/${required(uid, 'uid')}/workplaces/${this.workplaceId}/projects/${required(projectId, 'projectId')}/seats/${required(seatId, 'seatId')}`);
    return doc ? decodeDocument(doc) as unknown as SeatState : null;
  }

  async getConnection(uid: string, projectId: string, connectionId: string): Promise<ConnectionState | null> {
    const doc = await this.client.get(`accounts/${required(uid, 'uid')}/workplaces/${this.workplaceId}/projects/${required(projectId, 'projectId')}/connections/${required(connectionId, 'connectionId')}`);
    return doc ? decodeDocument(doc) as unknown as ConnectionState : null;
  }

  async getTask(uid: string, projectId: string, taskId: string): Promise<TaskStateRecord | null> {
    const doc = await this.client.get(`accounts/${required(uid, 'uid')}/workplaces/${this.workplaceId}/projects/${required(projectId, 'projectId')}/tasks/${required(taskId, 'taskId')}`);
    return doc ? decodeDocument(doc) as unknown as TaskStateRecord : null;
  }

  async appendEvent(event: DurableEventRecord): Promise<void> {
    const path = `accounts/${required(event.uid, 'uid')}/workplaces/${this.workplaceId}/projects/${required(event.projectId, 'projectId')}/events/${required(event.eventId, 'eventId')}`;
    const token = await googleAccessToken((this.client as unknown as { account: ServiceAccount }).account);
    const response = await fetch(this.clientPath(path), {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ fields: FirestoreRuntimeClient.fields(event) }),
    });
    if (!response.ok) throw new Error(`Firestore event write failed: ${response.status}`);
  }

  async getSchedulerTask(taskId: string): Promise<SchedulerTask | null> {
    const doc = await this.client.get(FirestoreRuntimeClient.path(this.uid, this.workplaceId, await this.projectFor(taskId), `tasks/${required(taskId, 'taskId')}`));
    return doc ? decodeDocument(doc) as unknown as SchedulerTask : null;
  }

  async listSchedulerSeats(projectId: string): Promise<SchedulerSeat[]> {
    const token = await googleAccessToken((this.client as unknown as { account: ServiceAccount }).account);
    const url = `${FIRESTORE_ROOT}/projects/${encodeURIComponent(process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official')}/databases/(default)/documents/${FirestoreRuntimeClient.path(this.uid, this.workplaceId, required(projectId, 'projectId'), 'seats')}`;
    const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Firestore seat list failed: ${response.status}`);
    const body = await response.json() as { documents?: FirestoreDocument[] };
    return (body.documents ?? []).map((doc) => decodeDocument(doc) as unknown as SchedulerSeat);
  }

  async getExecutableTask(taskId: string, seatId: string): Promise<ExecutableTask | null> {
    const projectId = await this.projectFor(taskId);
    const doc = await this.client.get(FirestoreRuntimeClient.path(this.uid, this.workplaceId, projectId, `tasks/${required(taskId, 'taskId')}`));
    if (!doc) return null;
    const data = decodeDocument(doc) as Record<string, unknown>;
    const connection = data.connection as ProjectConnection | undefined;
    const request = data.request as Omit<GenerateRequest, 'model'> | undefined;
    if (!connection || !request) throw new Error('executable task is missing connection or request');
    return {
      id: taskId,
      projectId,
      seatId: required(seatId, 'seatId'),
      provider: String(data.provider ?? ''),
      model: String(data.model ?? ''),
      status: String(data.status ?? 'pending') as ExecutableTask['status'],
      approved: data.approved === true,
      authorizationStatus: String(data.authorizationStatus ?? 'revoked') as ExecutableTask['authorizationStatus'],
      connection,
      request,
    };
  }

  private async projectFor(taskId: string): Promise<string> {
    const index = await this.client.get(`accounts/${this.uid}/workplaces/${this.workplaceId}/task-index/${required(taskId, 'taskId')}`);
    const projectId = index ? decodeDocument(index).projectId : undefined;
    return required(typeof projectId === 'string' ? projectId : '', 'projectId');
  }

  private clientPath(path: string): string {
    const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
    return `${FIRESTORE_ROOT}/projects/${encodeURIComponent(process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official')}/databases/(default)/documents/${encoded}`;
  }
}

export class FirestoreRuntimeExecutionEventStore implements TaskExecutionEventStore {
  constructor(private readonly client: FirestoreRuntimeClient, private readonly uid: string, private readonly workplaceId: string, private readonly projectId: string) {}

  async hasIdempotencyKey(idempotencyKey: string): Promise<boolean> {
    required(idempotencyKey, 'idempotencyKey');
    const doc = await this.client.get(`accounts/${this.uid}/workplaces/${this.workplaceId}/projects/${this.projectId}/idempotency/${encodeURIComponent(idempotencyKey)}`);
    return Boolean(doc);
  }

  async append(event: { eventId: string; idempotencyKey: string; type: string; actorId: string; occurredAt: string }): Promise<void> {
    const path = `accounts/${this.uid}/workplaces/${this.workplaceId}/projects/${this.projectId}/events/${required(event.eventId, 'eventId')}`;
    const token = await googleAccessToken((this.client as unknown as { account: ServiceAccount }).account);
    const response = await fetch(`${FIRESTORE_ROOT}/projects/${encodeURIComponent(process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official')}/databases/(default)/documents/${path}`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ fields: FirestoreRuntimeClient.fields(event) }),
    });
    if (!response.ok) throw new Error(`Firestore execution event write failed: ${response.status}`);
  }
}

export class FirestoreRuntimeApprovalStore implements RuntimeApprovalStore {
  constructor(private readonly client: FirestoreRuntimeClient, private readonly uid: string, private readonly workplaceId: string, private readonly projectId: string) {}

  async approveLeasedTask(input: { taskId: string; seatId: string; leaseId: string; actorId: string }): Promise<{ approved: true } | { approved: false; reason: 'LEASE_NOT_FOUND' | 'LEASE_EXPIRED' | 'TASK_NOT_LEASED' }> {
    const transaction = await this.client.beginTransaction();
    const taskPath = `accounts/${required(this.uid, 'uid')}/workplaces/${this.workplaceId}/projects/${required(this.projectId, 'projectId')}/tasks/${required(input.taskId, 'taskId')}`;
    const task = await this.client.get(taskPath, transaction);
    if (!task) return { approved: false, reason: 'TASK_NOT_LEASED' };
    const current = decodeDocument(task);
    if (current.status !== 'leased' || current.leaseId !== input.leaseId || current.seatId !== input.seatId) return { approved: false, reason: 'TASK_NOT_LEASED' };
    const now = new Date().toISOString();
    await this.client.commit(transaction, [{
      update: {
        name: `${FIRESTORE_ROOT}/projects/${encodeURIComponent(process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official')}/databases/(default)/documents/${taskPath}`,
        fields: FirestoreRuntimeClient.fields({ ...current, status: 'waiting_approval', approved: true, approvedBy: input.actorId, approvedAt: now, updatedAt: now }),
      },
      currentDocument: { updateTime: task.updateTime },
    }]);
    return { approved: true };
  }
}
