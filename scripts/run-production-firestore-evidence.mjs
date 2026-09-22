#!/usr/bin/env node

import { createSign } from 'node:crypto';

const ROOT = 'https://firestore.googleapis.com/v1';
const PROJECT = process.env.TEAMAI_FIREBASE_PROJECT_ID || 'team-ai-official';
const forbidden = new Set(['providerApiKey', 'apiKey', 'ciphertext', 'iv', 'privateKey', 'clientSecret', 'secret']);

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(name + ' is required');
  return value;
}

function account() {
  const raw = env('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON');
  let parsed;
  try { parsed = JSON.parse(raw); } catch { throw new Error('invalid service account JSON'); }
  if (parsed.project_id !== PROJECT || !parsed.client_email || !parsed.private_key) {
    throw new Error('Firebase service account identity/integrity check failed');
  }
  return parsed;
}

async function tokenFor(sa) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = value => Buffer.from(value).toString('base64url');
  const input = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' +
    b64(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    }));
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  signer.end();
  const assertion = input + '.' + signer.sign(sa.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  if (!response.ok) throw new Error('Firebase token exchange failed: ' + response.status);
  const body = await response.json();
  if (typeof body.access_token !== 'string') throw new Error('Firebase token exchange returned no access token');
  return body.access_token;
}

function decode(v) {
  if (!v) return undefined;
  if (typeof v.stringValue === 'string') return v.stringValue;
  if (typeof v.booleanValue === 'boolean') return v.booleanValue;
  if (typeof v.integerValue === 'string') return Number(v.integerValue);
  if (typeof v.doubleValue === 'number') return v.doubleValue;
  if (typeof v.timestampValue === 'string') return v.timestampValue;
  if ('nullValue' in v) return null;
  if (v.arrayValue) return (v.arrayValue.values || []).map(decode);
  if (v.mapValue) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, child]) => [k, decode(child)]));
  return undefined;
}

function fields(raw) {
  return Object.fromEntries(Object.entries(raw || {}).map(([k, v]) => [k, decode(v)]));
}

function valueOf(v) {
  if (v === null) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number' && Number.isInteger(v)) return { integerValue: String(v) };
  if (typeof v === 'number') return { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(valueOf) } };
  if (v && typeof v === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, child]) => [k, valueOf(child)])) } };
  throw new Error('unsupported Firestore value');
}

function encodedFields(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, valueOf(v)]));
}

function docUrl(path) {
  return ROOT + '/projects/' + encodeURIComponent(PROJECT) + '/databases/(default)/documents/' +
    path.split('/').map(encodeURIComponent).join('/');
}

async function read(path, token) {
  const response = await fetch(docUrl(path), { headers: { authorization: 'Bearer ' + token } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Firestore read failed: ' + response.status);
  return response.json();
}

async function query(parent, collectionId, where, token) {
  const response = await fetch(docUrl(parent) + ':runQuery', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId, allDescendants: collectionId === 'seats' }], where } })
  });
  if (!response.ok) throw new Error('Firestore ' + collectionId + ' query failed: ' + response.status);
  const raw = await response.text();
  if (!raw.trim()) return [];
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)); }
  return (Array.isArray(parsed) ? parsed : [parsed]).filter(x => x?.document).map(x => x.document);
}

async function write(path, data, token) {
  const response = await fetch(docUrl(path), {
    method: 'PATCH',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ fields: encodedFields(data) })
  });
  if (!response.ok) throw new Error('Diagnostic evidence write failed: ' + response.status);
}

function canonicalSeat(documents, expected) {
  return documents.filter(document => {
    const parts = (document.name?.split('/documents/')[1] || '').split('/');
    return parts.length === 10 &&
      parts[0] === 'accounts' && parts[1] === expected.uid &&
      parts[2] === 'workplaces' && parts[3] === expected.workplaceId &&
      parts[4] === 'projects' && parts[5] === expected.projectId &&
      parts[6] === 'teams' && parts[8] === 'seats' && parts[9] === expected.seatId;
  });
}

function safeConnection(document) {
  const raw = fields(document.fields);
  const names = Object.keys(raw).sort();
  const leaked = names.filter(name => forbidden.has(name));
  if (leaked.length) throw new Error('forbidden secret field reached diagnostic surface: ' + leaked.join(','));
  return {
    fieldNames: names,
    uid: String(raw.uid || ''),
    workplaceId: String(raw.workplaceId || ''),
    projectId: String(raw.projectId || ''),
    seatId: String(raw.seatId || ''),
    status: raw.status || null,
    provider: raw.provider || raw.providerCode || null,
    providerKind: raw.providerKind || null,
    capabilities: Array.isArray(raw.capabilities) ? raw.capabilities.map(String) : []
  };
}

function safeSeat(document) {
  const raw = fields(document.fields);
  const names = Object.keys(raw).sort();
  const leaked = names.filter(name => forbidden.has(name));
  if (leaked.length) throw new Error('forbidden secret field reached diagnostic surface: ' + leaked.join(','));
  const auth = raw.authorization && typeof raw.authorization === 'object' ? raw.authorization : {};
  const budget = raw.turnBudget && typeof raw.turnBudget === 'object' ? raw.turnBudget : {};
  return {
    canonicalPath: document.name.split('/documents/')[1] || document.name,
    fieldNames: names,
    identity: {
      uid: String(raw.uid || ''),
      workplaceId: String(raw.workplaceId || ''),
      projectId: String(raw.projectId || ''),
      teamId: String(raw.teamId || ''),
      seatId: String(raw.seatId || '')
    },
    status: raw.status || null,
    authorization: {
      status: auth.status || null,
      capabilities: Array.isArray(auth.capabilities) ? auth.capabilities.map(String) : [],
      allowedTaskTypes: Array.isArray(auth.allowedTaskTypes) ? auth.allowedTaskTypes.map(String) : []
    },
    entitlement: {
      teamEntitlement: raw.teamEntitlement || null,
      providerEntitlement: raw.providerEntitlement || null
    },
    provider: {
      provider: raw.provider || null,
      providerKind: raw.providerKind || null,
      providerKeyBound: raw.providerKeyBound || null,
      providerKeyLastFourPresent: typeof raw.providerKeyLastFour === 'string' && raw.providerKeyLastFour.length > 0
    },
    budget: {
      fieldNames: Object.keys(budget).sort(),
      turnBudgetTokens: Number.isFinite(Number(budget.turnBudgetTokens)) ? Number(budget.turnBudgetTokens) : null,
      outputBudgetTokens: Number.isFinite(Number(budget.outputBudgetTokens)) ? Number(budget.outputBudgetTokens) : null,
      reasoningBudgetTokens: Number.isFinite(Number(budget.reasoningBudgetTokens)) ? Number(budget.reasoningBudgetTokens) : null,
      handoffReserveTokens: Number.isFinite(Number(budget.handoffReserveTokens)) ? Number(budget.handoffReserveTokens) : null
    }
  };
}

const sa = account();
const token = await tokenFor(sa);
const uid = env('TEAMAI_DIAGNOSTIC_UID');
const workplaceId = env('TEAMAI_WORKPLACE_ID');
const projectId = env('TEAMAI_PROJECT_ID');
const teamId = env('TEAMAI_TEAM_ID');
const seatId = env('TEAMAI_SEAT_ID');
const parent = 'accounts/' + uid + '/workplaces/' + workplaceId + '/projects/' + projectId;
const runId = 'run-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomUUID().slice(0, 12);

const seatPath = parent + '/teams/' + teamId + '/seats/' + seatId;
const seatDocument = await read(seatPath, token);
if (!seatDocument) throw new Error('canonical Seat document not found');
const canonicalPath = seatDocument.name?.split('/documents/')[1] || '';
const canonicalParts = canonicalPath.split('/');
if (
  canonicalParts.length !== 10 ||
  canonicalParts[0] !== 'accounts' ||
  canonicalParts[1] !== uid ||
  canonicalParts[2] !== 'workplaces' ||
  canonicalParts[3] !== workplaceId ||
  canonicalParts[4] !== 'projects' ||
  canonicalParts[5] !== projectId ||
  canonicalParts[6] !== 'teams' ||
  canonicalParts[7] !== teamId ||
  canonicalParts[8] !== 'seats' ||
  canonicalParts[9] !== seatId
) {
  throw new Error('canonical Seat path identity mismatch');
}
const seat = safeSeat(seatDocument);
const connectionDocs = await query(parent, 'connections', {
  compositeFilter: {
    op: 'AND',
    filters: [
      { fieldFilter: { field: { fieldPath: 'seatId' }, op: 'EQUAL', value: { stringValue: seatId } } },
      { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'active' } } }
    ]
  }
}, token);
const connections = connectionDocs.map(safeConnection).filter(item =>
  item.uid === uid && item.workplaceId === workplaceId && item.projectId === projectId && item.seatId === seatId
);

const runPath = parent + '/runtime-diagnostics/' + runId;
const evidence = {
  runId,
  createdAt: new Date().toISOString(),
  evidenceClass: 'production-firestore-seat-shape',
  source: 'firestore-rest-service-account',
  uid,
  workplaceId,
  projectId,
  teamId,
  seatId,
  seat,
  connections: {
    activeCount: connections.length,
    activeExecuteCapableCount: connections.filter(item => item.capabilities.includes('execute')).length,
    items: connections
  }
};

await write(runPath, evidence, token);

console.log(JSON.stringify({
  ok: true,
  runId,
  runPath,
  evidenceClass: evidence.evidenceClass,
  seat,
  connections: evidence.connections,
  note: 'Fresh run-scoped metadata evidence only. No provider secret payloads are written or printed.'
}, null, 2));
