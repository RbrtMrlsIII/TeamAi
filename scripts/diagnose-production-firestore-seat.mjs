#!/usr/bin/env node

import { createSign } from 'node:crypto';

const ROOT = 'https://firestore.googleapis.com/v1';
const FIREBASE_PROJECT_ID = process.env.TEAMAI_FIREBASE_PROJECT_ID || 'team-ai-official';

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(name + ' is required');
  return value;
}

function account() {
  const raw = requireEnv('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON');
  let parsed;
  try { parsed = JSON.parse(raw); } catch { throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON'); }
  if (parsed.project_id !== FIREBASE_PROJECT_ID) throw new Error('Firebase project identity mismatch');
  if (!parsed.client_email || !parsed.private_key) throw new Error('Firebase service account is incomplete');
  return parsed;
}

async function accessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const encode = value => Buffer.from(value).toString('base64url');
  const header = encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ iss: serviceAccount.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const signingInput = header + '.' + payload;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const assertion = signingInput + '.' + signer.sign(serviceAccount.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!response.ok) throw new Error('Firebase token exchange failed: ' + response.status);
  const body = await response.json();
  if (typeof body.access_token !== 'string') throw new Error('Firebase token exchange returned no access token');
  return body.access_token;
}

function decode(value) {
  if (!value) return undefined;
  if (typeof value.stringValue === 'string') return value.stringValue;
  if (typeof value.booleanValue === 'boolean') return value.booleanValue;
  if (typeof value.integerValue === 'string') return Number(value.integerValue);
  if (typeof value.doubleValue === 'number') return value.doubleValue;
  if (typeof value.timestampValue === 'string') return value.timestampValue;
  if ('nullValue' in value) return null;
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decode);
  if (value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([k, v]) => [k, decode(v)]));
  return undefined;
}

function fields(raw) {
  return Object.fromEntries(Object.entries(raw ?? {}).map(([k, v]) => [k, decode(v)]));
}

function encodePath(path) { return path.split('/').map(encodeURIComponent).join('/'); }

async function runQuery(path, query, token) {
  const url = ROOT + '/projects/' + encodeURIComponent(FIREBASE_PROJECT_ID) + '/databases/(default)/documents/' + encodePath(path) + ':runQuery';
  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery: query }),
  });
  if (!response.ok) throw new Error('Firestore query failed: ' + response.status);
  const text = await response.text();
  if (!text.trim()) return [];
  try {
    const parsed = JSON.parse(text);
    return (Array.isArray(parsed) ? parsed : [parsed]).filter(row => row?.document);
  } catch {
    return text.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).filter(row => row?.document);
  }
}

function shapeReport(document, expected) {
  const path = String(document.name ?? '');
  const decoded = fields(document.fields);
  const authorization = decoded.authorization && typeof decoded.authorization === 'object' ? decoded.authorization : {};
  const budget = decoded.turnBudget && typeof decoded.turnBudget === 'object' ? decoded.turnBudget : {};
  return {
    expected,
    canonicalPath: path.split('/documents/')[1] ?? path,
    identity: { uid: String(decoded.uid ?? ''), workplaceId: String(decoded.workplaceId ?? ''), projectId: String(decoded.projectId ?? ''), teamId: String(decoded.teamId ?? ''), seatId: String(decoded.seatId ?? '') },
    status: decoded.status ?? null,
    authorization: { status: authorization.status ?? null, capabilitiesPresent: Array.isArray(authorization.capabilities), allowedTaskTypesPresent: Array.isArray(authorization.allowedTaskTypes) },
    entitlement: { teamEntitlement: decoded.teamEntitlement ?? null, providerEntitlement: decoded.providerEntitlement ?? null },
    provider: { provider: decoded.provider ?? null, providerKind: decoded.providerKind ?? null, providerKeyBound: decoded.providerKeyBound ?? null },
    turnBudget: { present: Boolean(decoded.turnBudget), fields: Object.keys(budget).sort(), hasTurnBudgetTokens: Object.prototype.hasOwnProperty.call(budget, 'turnBudgetTokens'), hasOutputBudgetTokens: Object.prototype.hasOwnProperty.call(budget, 'outputBudgetTokens'), hasReasoningBudgetTokens: Object.prototype.hasOwnProperty.call(budget, 'reasoningBudgetTokens'), hasHandoffReserveTokens: Object.prototype.hasOwnProperty.call(budget, 'handoffReserveTokens') },
    safety: { plaintextProviderKeyPresent: Object.prototype.hasOwnProperty.call(decoded, 'providerApiKey') || Object.prototype.hasOwnProperty.call(decoded, 'apiKey'), secretCiphertextPresentOnSeat: Object.prototype.hasOwnProperty.call(decoded, 'ciphertext') },
  };
}

const serviceAccount = account();
const token = await accessToken(serviceAccount);
const uid = requireEnv('TEAMAI_DIAGNOSTIC_UID');
const workplaceId = requireEnv('TEAMAI_WORKPLACE_ID');
const projectId = requireEnv('TEAMAI_PROJECT_ID');
const seatId = requireEnv('TEAMAI_SEAT_ID');
const parent = 'accounts/' + uid + '/workplaces/' + workplaceId + '/projects/' + projectId;
const rows = await runQuery(parent, {
  from: [{ collectionId: 'seats', allDescendants: true }],
  where: { fieldFilter: { field: { fieldPath: 'seatId' }, op: 'EQUAL', value: { stringValue: seatId } } },
  limit: 2,
}, token);
const canonical = rows.map(row => row.document).filter(document => document?.name).filter(document => (document.name.split('/documents/')[1] ?? '').split('/').length === 10).filter(document => {
  const p = (document.name.split('/documents/')[1] ?? '').split('/');
  return p[0] === 'accounts' && p[1] === uid && p[2] === 'workplaces' && p[3] === workplaceId && p[4] === 'projects' && p[5] === projectId && p[6] === 'teams' && p[8] === 'seats' && p[9] === seatId;
});
if (canonical.length !== 1) {
  console.error(JSON.stringify({ ok: false, error: canonical.length === 0 ? 'canonical_seat_not_found' : 'canonical_seat_ambiguous', matches: canonical.length, uid, workplaceId, projectId, seatId }, null, 2));
  process.exit(2);
}

const decodedSeat = fields(canonical[0].fields);
const seatReport = shapeReport(canonical[0], { uid, workplaceId, projectId, seatId });
const connectionRows = await runQuery(parent, {
  from: [{ collectionId: 'connections' }],
  where: {
    fieldFilter: {
      field: { fieldPath: 'seatId' },
      op: 'EQUAL',
      value: { stringValue: seatId },
    },
  },
  limit: 2,
}, token);
const connections = connectionRows.map(row => row.document).filter(document => document?.name).map(document => fields(document.fields));
const activeConnections = connections.filter(connection => String(connection.status ?? '') === 'active');
const connectionProviderNames = activeConnections.map(connection => String(connection.provider ?? connection.providerCode ?? '').trim()).filter(Boolean);
const connectionReport = {
  count: connections.length,
  activeCount: activeConnections.length,
  matchingSeatIds: activeConnections.map(connection => String(connection.seatId ?? '')),
  providers: connectionProviderNames,
  executeCapability: activeConnections.some(connection => Array.isArray(connection.capabilities) && connection.capabilities.map(String).includes('execute')),
};

const seatShapeErrors = [];
if (seatReport.status !== 'active') seatShapeErrors.push('seat_not_active');
if (seatReport.authorization.status !== 'authorized') seatShapeErrors.push('seat_not_authorized');
if (seatReport.entitlement.teamEntitlement !== 'allowed') seatShapeErrors.push('team_entitlement_not_allowed');
if (seatReport.entitlement.providerEntitlement !== 'allowed') seatShapeErrors.push('provider_entitlement_not_allowed');
if (!String(seatReport.provider.provider ?? '').trim()) seatShapeErrors.push('provider_not_configured');
if (!String(seatReport.provider.providerKind ?? '').trim()) seatShapeErrors.push('provider_kind_not_configured');
if (String(seatReport.provider.providerKeyBound).toLowerCase() !== 'true') seatShapeErrors.push('provider_key_not_bound');
const requiredBudgetFields = ['turnBudgetTokens', 'outputBudgetTokens', 'reasoningBudgetTokens', 'handoffReserveTokens'];
for (const field of requiredBudgetFields) {
  if (!seatReport.turnBudget.fields.includes(field)) seatShapeErrors.push('turn_budget_missing_' + field);
}
if (seatReport.turnBudget.present) {
  const rawBudget = decodedSeat.turnBudget && typeof decodedSeat.turnBudget === 'object' ? decodedSeat.turnBudget : {};
  const numericBudget = {};
  for (const field of requiredBudgetFields) {
    const value = Number(rawBudget[field]);
    numericBudget[field] = value;
    if (!Number.isInteger(value) || value < 0) seatShapeErrors.push('turn_budget_invalid_' + field);
  }
  if (Object.keys(numericBudget).length === requiredBudgetFields.length &&
      numericBudget.outputBudgetTokens + numericBudget.reasoningBudgetTokens + numericBudget.handoffReserveTokens > numericBudget.turnBudgetTokens) {
    seatShapeErrors.push('turn_budget_allocation_invalid');
  }
}

const connectionShapeErrors = [];
if (connectionReport.activeCount !== 1) connectionShapeErrors.push('active_seat_connection_count_not_one');
if (connectionReport.matchingSeatIds.some(value => value !== seatId)) connectionShapeErrors.push('active_connection_seat_mismatch');
const seatProvider = String(seatReport.provider.provider ?? '').trim().toLowerCase();
if (!connectionProviderNames.some(provider => provider.toLowerCase() === seatProvider)) connectionShapeErrors.push('active_connection_provider_mismatch');
if (!connectionReport.executeCapability) connectionShapeErrors.push('connection_execute_capability_missing');

const ok = seatShapeErrors.length === 0 && connectionShapeErrors.length === 0;
const report = {
  ...seatReport,
  connection: connectionReport,
  gate: {
    productionExecutionShapeReady: ok,
    seatShapeErrors,
    connectionShapeErrors,
  },
};

console.log(JSON.stringify({
  ok,
  note: 'Metadata-only diagnostic. No provider credentials or secret payloads are printed.',
  report,
}, null, 2));
if (!ok) process.exit(3);
