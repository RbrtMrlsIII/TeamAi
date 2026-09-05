import { createSign } from 'node:crypto';
import { spawn } from 'node:child_process';
import { FirestoreLeaseTransaction } from '../dist/src/backend/firestore-lease-transaction.js';
import { FirestoreTaskExecutionResultStore } from '../dist/src/backend/firestore-result-store.js';

const ROOT = 'https://firestore.googleapis.com/v1';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

let cachedToken;

const projectId = requiredEnv('TEAMAI_FIREBASE_PROJECT_ID');
const uid = requiredEnv('TEAMAI_FIREBASE_TEST_UID');
const workplaceId = requiredEnv('TEAMAI_FIREBASE_TEST_WORKPLACE_ID');
const testProjectId = requiredEnv('TEAMAI_FIREBASE_TEST_PROJECT_ID');
const script = new URL(import.meta.url).pathname;

// Parent generates ids once. Worker/recover children MUST inherit them via env
// (a new process re-evaluating Date.now()/randomUUID would look at a different task).
const runId = process.env.TEAMAI_LIVE_RUN_ID?.trim() || `live-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
const taskId = process.env.TEAMAI_LIVE_TASK_ID?.trim() || `${runId}-task`;
const resultEventId = process.env.TEAMAI_LIVE_RESULT_EVENT_ID?.trim() || `${runId}-complete-event`;
const resultIdentity = { taskId, projectId: testProjectId, eventId: resultEventId };
const taskPath = `accounts/${uid}/workplaces/${workplaceId}/projects/${testProjectId}/tasks/${taskId}`;

function loadServiceAccount() {
  const raw = requiredEnv('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON');
  }
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error('Firebase service account is incomplete');
  }
  if (parsed.project_id !== projectId) {
    throw new Error(`Firebase project identity mismatch: got ${parsed.project_id}`);
  }
  return parsed;
}

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.value;
  const account = loadServiceAccount();
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
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firebase token exchange failed: ${response.status} ${body.slice(0, 300)}`);
  }
  const body = await response.json();
  if (typeof body.access_token !== 'string') throw new Error('Firebase access token missing');
  cachedToken = { value: body.access_token, expiresAt: now + 3500 };
  return body.access_token;
}

function resourceName(path) {
  const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `projects/${projectId}/databases/(default)/documents/${encoded}`;
}

async function writeTask() {
  const token = await accessToken();
  const name = resourceName(taskPath);
  const response = await fetch(
    `${ROOT}/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:commit`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        writes: [{
          update: {
            name,
            fields: {
              uid: { stringValue: uid },
              projectId: { stringValue: testProjectId },
              status: { stringValue: 'ready' },
              createdAt: { timestampValue: new Date().toISOString() },
            },
          },
          currentDocument: { exists: false },
        }],
      }),
    },
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Live test task create failed: ${response.status} path=${taskPath} body=${body.slice(0, 500)}`);
  }
}

function childEnv(extra = {}) {
  return {
    ...process.env,
    TEAMAI_LIVE_RUN_ID: runId,
    TEAMAI_LIVE_TASK_ID: taskId,
    TEAMAI_LIVE_RESULT_EVENT_ID: resultEventId,
    ...extra,
  };
}

function spawnWorker(actorId) {
  return spawn(process.execPath, [script, 'worker'], {
    env: childEnv({ TEAMAI_LIVE_ACTOR: actorId }),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function spawnRecovery(expectedText) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, 'recover'], {
      env: childEnv({ TEAMAI_LIVE_EXPECTED_RESULT: expectedText }),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (exitCode) => resolve({ exitCode, stdout, stderr }));
  });
}

function parseWorkerResult(child) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      if (exitCode !== 0) return reject(new Error(`Worker failed: ${stderr}`));
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Worker emitted invalid JSON: ${stdout}`));
      }
    });
  });
}

async function cleanup(leaseId) {
  const token = await accessToken();
  const names = [
    taskPath,
    `${taskPath}/leases/${leaseId}`,
    `${taskPath}/execution-results/${resultEventId}`,
  ];
  const response = await fetch(
    `${ROOT}/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:commit`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        writes: names.map((path) => ({ delete: resourceName(path) })),
      }),
    },
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Live test cleanup failed: ${response.status} ${body.slice(0, 300)}`);
  }
}

if (process.argv[2] === 'worker') {
  const actorId = requiredEnv('TEAMAI_LIVE_ACTOR');
  const leaseId = `${runId}-${actorId}`;
  try {
    const transaction = new FirestoreLeaseTransaction(projectId);
    const result = await transaction.leaseReady({
      uid,
      workplaceId,
      projectId: testProjectId,
      taskId,
      seatId: `seat-${actorId}`,
      leaseId,
      actorId,
    });
    process.stdout.write(JSON.stringify({ actorId, leaseId, taskId, result }));
    process.exit(0);
  } catch (error) {
    process.stderr.write(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (process.argv[2] === 'recover') {
  const expectedText = requiredEnv('TEAMAI_LIVE_EXPECTED_RESULT');
  try {
    const store = new FirestoreTaskExecutionResultStore(uid, workplaceId, projectId);
    const result = await store.getResult({ taskId, projectId: testProjectId, eventId: resultEventId });
    if (!result) throw new Error('Durable result was not retrievable after restart');
    if (result.result?.text !== expectedText) {
      throw new Error(`Recovered result mismatch: expected ${expectedText}`);
    }
    process.stdout.write(JSON.stringify({
      recovered: true,
      taskId: result.taskId,
      eventId: result.eventId,
      text: result.result.text,
    }));
    process.exit(0);
  } catch (error) {
    process.stderr.write(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

await writeTask();
const workers = await Promise.all([spawnWorker('worker-a'), spawnWorker('worker-b')]);
const parsed = await Promise.all(workers.map(parseWorkerResult));
console.log(JSON.stringify({ phase: 'worker-results', taskId, results: parsed }));

const winners = parsed.filter((item) => item.result?.acquired === true);
const losers = parsed.filter((item) => item.result?.acquired === false);
if (winners.length !== 1 || losers.length !== 1) {
  throw new Error(
    `Contention invariant failed: winners=${winners.length} losers=${losers.length} detail=${JSON.stringify(parsed)}`,
  );
}

const winner = winners[0];
const loser = losers[0];
console.log(JSON.stringify({
  phase: 'contention',
  taskId,
  winner: { actorId: winner.actorId, leaseId: winner.leaseId },
  loser: { actorId: loser.actorId, leaseId: loser.leaseId, reason: loser.result.reason },
}));

const durableStore = new FirestoreTaskExecutionResultStore(uid, workplaceId, projectId);
const durableResult = {
  taskId,
  projectId: testProjectId,
  seatId: `seat-${winner.actorId}`,
  eventId: resultEventId,
  idempotencyKey: `${runId}-complete`,
  status: 'completed',
  recordedAt: new Date().toISOString(),
  result: {
    provider: 'live-firestore-probe',
    model: 'contention-recovery-probe',
    requestId: runId,
    text: `durable-result-${runId}`,
    usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  },
};
await durableStore.persist(durableResult);

const recovery = await spawnRecovery(durableResult.result.text);
if (recovery.exitCode !== 0) {
  throw new Error(`Restart/recovery probe failed: ${recovery.stderr}`);
}
console.log(JSON.stringify({ phase: 'restart-recovery', ...JSON.parse(recovery.stdout) }));
await cleanup(winner.leaseId);
console.log(JSON.stringify({
  phase: 'complete',
  status: 'live-firestore-contention-and-recovery-pass',
  cleanup: 'done',
}));
