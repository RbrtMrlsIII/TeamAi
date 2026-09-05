import { createSign } from 'node:crypto';
import type { ConversationTurnIdentity, ConversationTurnStore, WebAiConversationTurn } from './conversation-turn.js';

const ROOT = 'https://firestore.googleapis.com/v1';
type ServiceAccount = { project_id: string; client_email: string; private_key: string };
type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { timestampValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { nullValue: null };
type FirestoreDocument = { fields?: Record<string, FirestoreValue> };

function required(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function value(input: unknown): FirestoreValue {
  if (input === null) return { nullValue: null };
  if (typeof input === 'string') return { stringValue: input };
  if (typeof input === 'boolean') return { booleanValue: input };
  if (typeof input === 'number') return Number.isInteger(input) ? { integerValue: String(input) } : { doubleValue: input };
  if (input instanceof Date) return { timestampValue: input.toISOString() };
  if (Array.isArray(input)) return { arrayValue: { values: input.map(value) } };
  if (typeof input === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(input as Record<string, unknown>).map(([key, child]) => [key, value(child)])) } };
  throw new Error(`Unsupported Firestore conversation turn value: ${typeof input}`);
}

function fields(input: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(Object.entries(input).map(([key, item]) => [key, value(item)]));
}

function decode(input: FirestoreValue): unknown {
  if ('stringValue' in input) return input.stringValue;
  if ('booleanValue' in input) return input.booleanValue;
  if ('integerValue' in input) return Number(input.integerValue);
  if ('doubleValue' in input) return input.doubleValue;
  if ('timestampValue' in input) return input.timestampValue;
  if ('nullValue' in input) return null;
  if ('arrayValue' in input) return (input.arrayValue.values ?? []).map(decode);
  return Object.fromEntries(Object.entries(input.mapValue.fields ?? {}).map(([key, child]) => [key, decode(child)]));
}

function decodeDocument(document: FirestoreDocument): WebAiConversationTurn {
  return Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, field]) => [key, decode(field)])) as unknown as WebAiConversationTurn;
}

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is required');
  let parsed: Partial<ServiceAccount>;
  try { parsed = JSON.parse(raw) as Partial<ServiceAccount>; } catch { throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON'); }
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) throw new Error('Firebase service account is incomplete');
  return parsed as ServiceAccount;
}

export class FirestoreConversationTurnStore implements ConversationTurnStore {
  private readonly account = loadServiceAccount();
  private readonly firebaseProjectId: string;
  private readonly uid: string;
  private readonly workplaceId: string;
  private token?: { value: string; expiresAt: number };

  constructor(uid: string, workplaceId: string, firebaseProjectId = process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official') {
    this.uid = required(uid, 'uid');
    this.workplaceId = required(workplaceId, 'workplaceId');
    this.firebaseProjectId = required(firebaseProjectId, 'firebaseProjectId');
    if (this.account.project_id !== this.firebaseProjectId) throw new Error('Firebase project identity mismatch');
  }

  async appendTurn(turn: WebAiConversationTurn): Promise<void> {
    required(turn.conversationId, 'conversationId');
    required(turn.turnId, 'turnId');
    required(turn.content, 'content');
    if (!Number.isInteger(turn.sequence) || turn.sequence < 0) throw new Error('sequence must be a non-negative integer');
    const token = await this.accessToken();
    const response = await fetch(`${ROOT}/projects/${encodeURIComponent(this.firebaseProjectId)}/databases/(default)/documents:commit`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        writes: [{
          update: { name: this.documentUrl(this.turnPath(turn.conversationId, turn.turnId)), fields: fields(turn as unknown as Record<string, unknown>) },
          currentDocument: { exists: false },
        }],
      }),
    });
    if (!response.ok && ![409, 412].includes(response.status)) throw new Error(`Firestore conversation turn write failed: ${response.status}`);
  }

  async getTurn(identity: ConversationTurnIdentity): Promise<WebAiConversationTurn | null> {
    required(identity.conversationId, 'conversationId');
    required(identity.turnId, 'turnId');
    const token = await this.accessToken();
    const response = await fetch(this.documentUrl(this.turnPath(identity.conversationId, identity.turnId)), { headers: { authorization: `Bearer ${token}` } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Firestore conversation turn read failed: ${response.status}`);
    return decodeDocument(await response.json() as FirestoreDocument);
  }

  private turnPath(conversationId: string, turnId: string): string {
    return `accounts/${this.uid}/workplaces/${this.workplaceId}/conversations/${conversationId}/turns/${turnId}`;
  }

  private documentUrl(path: string): string {
    const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
    return `${ROOT}/projects/${encodeURIComponent(this.firebaseProjectId)}/databases/(default)/documents/${encoded}`;
  }

  private async accessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.token && this.token.expiresAt > now + 60) return this.token.value;
    const token = await exchangeAccessToken(this.account);
    this.token = { value: token, expiresAt: now + 3500 };
    return token;
  }
}

async function exchangeAccessToken(account: ServiceAccount): Promise<string> {
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
