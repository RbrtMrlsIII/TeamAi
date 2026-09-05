import { createSign } from 'node:crypto';
import type { DurableExecutionResult, TaskExecutionResultStore } from './task-execution-result.js';

const ROOT = 'https://firestore.googleapis.com/v1';
type ServiceAccount = { project_id: string; client_email: string; private_key: string };

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { nullValue: null };

type FirestoreDocument = { name?: string };

function required(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function value(input: unknown): FirestoreValue {
  if (input === null) return { nullValue: null };
  if (typeof input === 'string') return { stringValue: input };
  if (typeof input === 'boolean') return { booleanValue: input };
  if (typeof input === 'number') return Number.isInteger(input) ? { doubleValue: input } : { doubleValue: input };
  if (input instanceof Date) return { timestampValue: input.toISOString() };
  if (Array.isArray(input)) return { arrayValue: { values: input.map(value) } };
  if (typeof input === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(input as Record<string, unknown>).map(([key, child]) => [key, value(child)])) } };
  throw new Error(`Unsupported Firestore result value: ${typeof input}`);
}

function fields(input: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(Object.entries(input).map(([key, item]) => [key, value(item)]));
}

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is required');
  let parsed: Partial<ServiceAccount>;
  try { parsed = JSON.parse(raw) as Partial<ServiceAccount>; } catch { throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON'); }
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) throw new Error('Firebase service account is incomplete');
  return parsed as ServiceAccount;
}

async function accessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const encode = (input: string) => Buffer.from(input).toString('base64url');
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

export class FirestoreTaskExecutionResultStore implements TaskExecutionResultStore {
  private readonly account = loadServiceAccount();
  private readonly firebaseProjectId: string;

  constructor(firebaseProjectId = process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official') {
    this.firebaseProjectId = required(firebaseProjectId, 'firebaseProjectId');
    if (this.account.project_id !== this.firebaseProjectId) throw new Error('Firebase project identity mismatch');
  }

  async hasResult(eventId: string): Promise<boolean> {
    required(eventId, 'eventId');
    const token = await accessToken(this.account);
    const response = await fetch(this.documentUrl(`result-index/${eventId}`), { headers: { authorization: `Bearer ${token}` } });
    return response.ok;
  }

  async persist(result: DurableExecutionResult): Promise<void> {
    required(result.taskId, 'taskId');
    required(result.projectId, 'projectId');
    required(result.seatId, 'seatId');
    required(result.eventId, 'eventId');
    required(result.idempotencyKey, 'idempotencyKey');
    const token = await accessToken(this.account);
    const taskPath = `accounts/${result.taskId.split(':')[0]}`;
    const resultDocumentPath = `accounts/${encodeURIComponent(result.idempotencyKey)}/executionResults/${encodeURIComponent(result.eventId)}`;
    const indexPath = `result-index/${encodeURIComponent(result.eventId)}`;
    const writes = [
      {
        update: { name: this.documentUrl(resultDocumentPath), fields: fields(result as unknown as Record<string, unknown>) },
        currentDocument: { exists: false },
      },
      {
        update: { name: this.documentUrl(indexPath), fields: fields({ taskId: result.taskId, projectId: result.projectId, eventId: result.eventId, resultDocumentPath, recordedAt: result.recordedAt }) },
        currentDocument: { exists: false },
      },
    ];
    const response = await fetch(`${ROOT}/projects/${encodeURIComponent(this.firebaseProjectId)}/databases/(default)/documents:commit`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ writes }),
    });
    if (!response.ok && ![409, 412].includes(response.status)) throw new Error(`Firestore execution result write failed: ${response.status}`);
    void taskPath;
  }

  private documentUrl(path: string): string {
    const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
    return `${ROOT}/projects/${encodeURIComponent(this.firebaseProjectId)}/databases/(default)/documents/${encoded}`;
  }
}
