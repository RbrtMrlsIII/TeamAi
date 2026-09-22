import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script = fs.readFileSync('scripts/run-production-firestore-evidence.mjs', 'utf8');
const workflow = fs.readFileSync('.github/workflows/firestore-production-evidence.yml', 'utf8');

test('fresh evidence is uniquely run-scoped and secret-redacted', () => {
  assert.match(script, /runtime-diagnostics/);
  assert.match(script, /runId/);
  assert.match(script, /production-firestore-seat-shape/);
  assert.doesNotMatch(script, /providerApiKey\s*:/);
  assert.doesNotMatch(script, /ciphertext\s*:/);
  assert.doesNotMatch(script, /privateKey\s*:/);
});

test('fresh evidence workflow is manual and protected', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON/);
  assert.match(workflow, /TEAMAI_FIREBASE_TEST_UID/);
  assert.match(workflow, /TEAMAI_FIREBASE_TEST_WORKPLACE_ID/);
  assert.match(workflow, /TEAMAI_FIREBASE_TEST_PROJECT_ID/);
  assert.match(workflow, /TEAMAI_TEAM_ID/);
  assert.match(workflow, /TEAMAI_SEAT_ID/);
});

test('fresh evidence writes only to runtime-diagnostics', () => {
  assert.match(script, /const runPath = parent \+ '\/runtime-diagnostics\/' \+ runId/);
  assert.match(script, /await write\(runPath, evidence, token\)/);
  assert.doesNotMatch(script, /await write\(seatPath, evidence, token\)/);
});


test('fresh evidence resolves the canonical Seat by exact team-nested document path', () => {
  assert.match(script, /const seatPath = parent \+ '\/teams\/' \+ teamId \+ '\/seats\/' \+ seatId/);
  assert.match(script, /canonical Seat path identity mismatch/);
  assert.doesNotMatch(script, /query\(parent, 'seats'/);
});


test('secret detection traverses nested Firestore maps rather than only top-level keys', () => {
  assert.match(script, /findForbiddenPaths\(value/);
  assert.match(script, /findForbiddenPaths\(child, childPath\)/);
  assert.match(script, /assertNoSecretFields\(raw\)/);
});
