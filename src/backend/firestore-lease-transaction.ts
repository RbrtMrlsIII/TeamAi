import { createSign } from 'node:crypto';
import type { AtomicTaskLeaseStore, LeaseResult } from './task-lease.js';

export type FirestoreLeaseInput = {
  uid: string;
  workplaceId: string;
  projectId: string;
  taskId: string;
  seatId: string;
  leaseId: string;
  actorId: string;
};

export type FirestoreLeaseResult =
  | { acquired: true; leaseId: string; taskId: string; seatId: string; status: 'leased' }
  | { acquired: false; leaseId: string; taskId: string; reason: 'NOT_FOUND' | 'NOT_READY' | 'CONFLICT' };

type ServiceAccount = { project_id: string; client_email: string; private_key: string };
type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { nullValue: null };
type FirestoreDocument = { fields?: Record<string, FirestoreValue>; updateTime?: string };

const ROOT = 'https://firestore.googleapis.com/v1';

function required(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function field(value: unknown): FirestoreValue {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (value === null) return { nullValue: null };
  throw new Error('Unsupported Firestore lease field');
}

function fields(values: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, field(value)]));
}

function decoded(document: FirestoreDocument): Record<string, unknown> {
  return Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => {
    if ('stringValue' in value) return [key, value.stringValue];
    if ('booleanValue' in value) return [key, value.booleanValue];
    if ('integerValue' in value) return [key, Number(value.integerValue)];
    if ('doubleValue' in value) return [key, value.doubleValue];
    if ('timestampValue' in value) return [key, value.timestampValue];
    return [key, null];
  }));
}

function serviceAccountFromEnv(): ServiceAccount {
  const raw = process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is required');
  const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) throw new Error('Firebase service account is incomplete');
  return parsed as ServiceAccount;
}

async function accessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: string) => Buffer.from(value).toString('base64url');
  const header = encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const signingInput = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const assertion = `${signingInput}.${signer.sign(account.private_key, 'base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!response.ok) throw new Error(`Firebase token exchange failed: ${response.status}`);
  const body = await response.json() as { access_token?: unknown };
  if (typeof body.access_token !== 'string') throw new Error('Firebase access token missing');
  return body.access_token;
}

/** Document resource name for commit writes (no https host). */
function resourceName(firebaseProjectId: string, documentPath: string): string {
  const encoded = documentPath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `projects/${firebaseProjectId}/databases/(default)/documents/${encoded}`;
}

export class FirestoreLeaseTransaction {
  private readonly account = serviceAccountFromEnv();

  constructor(private readonly firebaseProjectId = process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official') {
    required(firebaseProjectId, 'firebaseProjectId');
    if (this.account.project_id !== firebaseProjectId) throw new Error('Firebase project identity mismatch');
  }

  async leaseReady(input: FirestoreLeaseInput): Promise<FirestoreLeaseResult> {
    required(input.uid, 'uid');
    required(input.workplaceId, 'workplaceId');
    required(input.projectId, 'projectId');
    required(input.taskId, 'taskId');
    required(input.seatId, 'seatId');
    required(input.leaseId, 'leaseId');
    required(input.actorId, 'actorId');

    const token = await accessToken(this.account);
    const taskPath = `accounts/${input.uid}/workplaces/${input.workplaceId}/projects/${input.projectId}/tasks/${input.taskId}`;
    const documentsRoot = `${ROOT}/projects/${encodeURIComponent(this.firebaseProjectId)}/databases/(default)/documents`;
    const taskHttpUrl = `${documentsRoot}/${taskPath.split('/').map((s) => encodeURIComponent(s)).join('/')}`;
    const taskResource = resourceName(this.firebaseProjectId, taskPath);

    const transactionResponse = await fetch(`${documentsRoot}:beginTransaction`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ options: { readWrite: {} } }),
    });
    if (!transactionResponse.ok) {
      const body = await transactionResponse.text();
      throw new Error(`Firestore begin transaction failed: ${transactionResponse.status} ${body.slice(0, 200)}`);
    }
    const { transaction } = await transactionResponse.json() as { transaction?: string };
    if (!transaction) throw new Error('Firestore transaction id missing');

    const readUrl = new URL(taskHttpUrl);
    readUrl.searchParams.set('transaction', transaction);
    const taskResponse = await fetch(readUrl, { headers: { authorization: `Bearer ${token}` } });
    if (taskResponse.status === 404) return { acquired: false, leaseId: input.leaseId, taskId: input.taskId, reason: 'NOT_FOUND' };
    if (!taskResponse.ok) {
      const body = await taskResponse.text();
      throw new Error(`Firestore transactional read failed: ${taskResponse.status} ${body.slice(0, 200)}`);
    }
    const task = await taskResponse.json() as FirestoreDocument;
    const current = decoded(task);
    if (current.status !== 'ready') return { acquired: false, leaseId: input.leaseId, taskId: input.taskId, reason: 'NOT_READY' };

    const now = new Date().toISOString();
    const leasePath = `${taskPath}/leases/${input.leaseId}`;
    const leaseResource = resourceName(this.firebaseProjectId, leasePath);
    const commitResponse = await fetch(`${documentsRoot}:commit`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        transaction,
        writes: [
          {
            update: {
              name: leaseResource,
              fields: fields({
                uid: input.uid,
                taskId: input.taskId,
                seatId: input.seatId,
                leaseId: input.leaseId,
                actorId: input.actorId,
                status: 'leased',
                leasedAt: now,
              }),
            },
            currentDocument: { exists: false },
          },
          {
            update: {
              name: taskResource,
              fields: fields({
                ...current,
                status: 'leased',
                leaseId: input.leaseId,
                leasedBy: input.actorId,
                updatedAt: now,
              }),
            },
            currentDocument: { updateTime: task.updateTime },
          },
        ],
      }),
    });
    if (!commitResponse.ok) {
      if ([409, 412].includes(commitResponse.status)) {
        return { acquired: false, leaseId: input.leaseId, taskId: input.taskId, reason: 'CONFLICT' };
      }
      const body = await commitResponse.text();
      throw new Error(`Firestore lease commit failed: ${commitResponse.status} ${body.slice(0, 400)}`);
    }
    return { acquired: true, leaseId: input.leaseId, taskId: input.taskId, seatId: input.seatId, status: 'leased' };
  }
}

export class FirestoreAtomicTaskLeaseStore implements AtomicTaskLeaseStore {
  constructor(
    private readonly transaction: FirestoreLeaseTransaction,
    private readonly uid: string,
    private readonly workplaceId: string,
    private readonly projectId: string,
  ) {}

  async leaseReadyTask(input: { taskId: string; seatId: string; leaseId: string; actorId: string }): Promise<LeaseResult> {
    const result = await this.transaction.leaseReady({ ...input, uid: this.uid, workplaceId: this.workplaceId, projectId: this.projectId });
    if (result.acquired) return result;
    return {
      acquired: false,
      taskId: result.taskId,
      reason: result.reason === 'CONFLICT' ? 'ALREADY_LEASED' : result.reason,
    };
  }
}
