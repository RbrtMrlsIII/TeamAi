import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const diagnostic = await readFile(
  new URL('../scripts/diagnose-production-firestore-seat.mjs', import.meta.url),
  'utf8',
);
const workflow = await readFile(
  new URL('../.github/workflows/firestore-seat-shape-diagnostic.yml', import.meta.url),
  'utf8',
);

test('production Seat diagnostic remains workflow-dispatch-only with canonical input mapping', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /seat_id:/);
  assert.match(workflow, /TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON: \$\{\{ secrets\.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON \}\}/);
  assert.match(workflow, /TEAMAI_DIAGNOSTIC_UID: \$\{\{ secrets\.TEAMAI_FIREBASE_TEST_UID \}\}/);
  assert.match(workflow, /TEAMAI_WORKPLACE_ID: \$\{\{ secrets\.TEAMAI_FIREBASE_TEST_WORKPLACE_ID \}\}/);
  assert.match(workflow, /TEAMAI_PROJECT_ID: \$\{\{ secrets\.TEAMAI_FIREBASE_TEST_PROJECT_ID \}\}/);
  assert.match(workflow, /TEAMAI_SEAT_ID: \$\{\{ inputs\.seat_id \}\}/);
  assert.match(workflow, /TEAMAI_TEAM_ID: gate3-test-team/);
  assert.match(workflow, /node scripts\/run-production-firestore-evidence\.mjs/);
  assert.doesNotMatch(workflow, /diagnose-production-firestore-seat\.mjs/);
});

test('parked collection-group diagnostic still consumes the same environment contract', () => {
  for (const name of [
    'TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON',
    'TEAMAI_DIAGNOSTIC_UID',
    'TEAMAI_WORKPLACE_ID',
    'TEAMAI_PROJECT_ID',
    'TEAMAI_SEAT_ID',
  ]) {
    assert.ok(diagnostic.includes("requireEnv('" + name + "')"));
  }
  assert.match(diagnostic, /TEAMAI_FIREBASE_PROJECT_ID/);
  assert.match(diagnostic, /team-ai-official/);
});

test('parked collection-group diagnostic remains fail-closed historical source', () => {
  assert.match(diagnostic, /p\[0\] === 'accounts'/);
  assert.match(diagnostic, /p\[2\] === 'workplaces'/);
  assert.match(diagnostic, /p\[4\] === 'projects'/);
  assert.match(diagnostic, /p\[6\] === 'teams'/);
  assert.match(diagnostic, /p\[8\] === 'seats'/);
  assert.match(diagnostic, /p\[9\] === seatId/);
  assert.match(diagnostic, /fieldPath: 'seatId'.*status.*active/s);
  assert.match(diagnostic, /canonical\.length !== 1/);
  assert.match(diagnostic, /activeCount !== 1/);
});

test('parked collection-group diagnostic remains metadata-only and does not print provider credentials', () => {
  assert.match(diagnostic, /Metadata-only diagnostic/);
  assert.match(diagnostic, /plaintextProviderKeyPresent/);
  assert.match(diagnostic, /secretCiphertextPresentOnSeat/);
  assert.doesNotMatch(diagnostic, /console\.log\(.*providerApiKey/i);
});
