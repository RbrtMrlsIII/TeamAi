import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = 'https://firestore.googleapis.com/v1';
const DEFAULT_CORRELATION_ID = '68b4ef3a-4132-46bf-8a01-43ebe97ba51e';
const DEFAULT_PROVIDER_EVENT_ID = 'WH-71666988RB043112X-1WA30416DF8293903';

function required(value, name) {
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function loadServiceAccount() {
  const raw = required(process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON, 'TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON');
  const parsed = JSON.parse(raw);
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) throw new Error('Firebase service account is incomplete');
  return parsed;
}

function decodeValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, child]) => [key, decodeValue(child)]));
  return null;
}

function decodeDocument(document) {
  return Object.fromEntries(Object.entries(document?.fields ?? {}).map(([key, value]) => [key, decodeValue(value)]));
}

function documentUrl(projectId, path) {
  const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${ROOT}/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encoded}`;
}

async function accessToken(account, fetchImpl) {
  const now = Math.floor(Date.now() / 1000);
  const encode = (input) => Buffer.from(input).toString('base64url');
  const header = encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({
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
  const response = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!response.ok) throw new Error(`Firebase token exchange failed: ${response.status}`);
  const body = await response.json();
  if (typeof body.access_token !== 'string') throw new Error('Firebase access token missing');
  return body.access_token;
}

async function getDocument(projectId, path, token, fetchImpl) {
  const response = await fetchImpl(documentUrl(projectId, path), { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed (${path}): ${response.status}`);
  return decodeDocument(await response.json());
}

async function listDocuments(projectId, collectionPath, token, fetchImpl) {
  const response = await fetchImpl(documentUrl(projectId, collectionPath), { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`Firestore list failed (${collectionPath}): ${response.status}`);
  const body = await response.json();
  return (body.documents ?? []).map((document) => ({
    id: String(document.name ?? '').split('/').pop(),
    fields: decodeDocument(document),
  }));
}

export async function verifyCommerceAggregate({
  correlationId = DEFAULT_CORRELATION_ID,
  providerEventId = DEFAULT_PROVIDER_EVENT_ID,
  firebaseProjectId = process.env.TEAMAI_FIREBASE_PROJECT_ID ?? 'team-ai-official',
  fetchImpl = fetch,
  account = loadServiceAccount(),
} = {}) {
  required(correlationId, 'correlationId');
  required(providerEventId, 'providerEventId');
  required(firebaseProjectId, 'firebaseProjectId');
  if (account.project_id !== firebaseProjectId) throw new Error('Firebase project identity mismatch');

  const token = await accessToken(account, fetchImpl);
  const index = await getDocument(firebaseProjectId, `commerceCorrelationIndex/${correlationId}`, token, fetchImpl);
  if (!index) throw new Error('commerceCorrelationIndex document was not found');
  const firebaseUid = required(index.firebaseUid, 'index.firebaseUid');

  const aggregate = await getDocument(firebaseProjectId, `accounts/${firebaseUid}/commerce/${correlationId}`, token, fetchImpl);
  if (!aggregate) throw new Error('commerce aggregate document was not found');

  const events = await listDocuments(firebaseProjectId, `accounts/${firebaseUid}/commerce/${correlationId}/events`, token, fetchImpl);
  const entitlement = await getDocument(
    firebaseProjectId,
    `accounts/${firebaseUid}/commerce/${correlationId}/entitlements/${correlationId}`,
    token,
    fetchImpl,
  );
  if (!entitlement) throw new Error('commerce entitlement document was not found');

  const matchingEvents = events.filter((event) => event.id === providerEventId || event.fields.providerEventId === providerEventId);
  const result = {
    correlationId,
    providerEventId,
    aggregateStatus: aggregate.status ?? null,
    eventCount: events.length,
    matchingEventCount: matchingEvents.length,
    eventType: matchingEvents[0]?.fields.type ?? null,
    entitlementStatus: entitlement.status ?? null,
    sourceCommerceEventId: entitlement.sourceCommerceEventId ?? null,
  };

  if (result.aggregateStatus !== 'completed') {
    throw new Error(`aggregate status is ${result.aggregateStatus}; expected completed`);
  }
  if (result.eventCount !== 1 || result.matchingEventCount !== 1) {
    throw new Error(`expected exactly one event for ${providerEventId}, found ${result.eventCount} documents / ${result.matchingEventCount} matches`);
  }
  if (result.entitlementStatus !== 'active') {
    throw new Error(`entitlement status is ${result.entitlementStatus}; expected active`);
  }
  if (result.sourceCommerceEventId !== providerEventId) {
    throw new Error(`sourceCommerceEventId is ${result.sourceCommerceEventId}; expected ${providerEventId}`);
  }

  return { ...result, status: 'commerce-aggregate-read-pass' };
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedDirectly) {
  const verified = await verifyCommerceAggregate({
    correlationId: process.env.TEAMAI_COMMERCE_CORRELATION_ID ?? DEFAULT_CORRELATION_ID,
    providerEventId: process.env.TEAMAI_COMMERCE_PROVIDER_EVENT_ID ?? DEFAULT_PROVIDER_EVENT_ID,
  });
  console.log(JSON.stringify({
    phase: 'commerce-aggregate-read',
    status: verified.status,
    correlationId: verified.correlationId,
    providerEventId: verified.providerEventId,
    aggregateStatus: verified.aggregateStatus,
    eventCount: verified.eventCount,
    eventType: verified.eventType,
    entitlementStatus: verified.entitlementStatus,
    sourceMatches: verified.sourceCommerceEventId === verified.providerEventId,
  }));
}
