import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script = fs.readFileSync('scripts/run-production-firestore-evidence.mjs', 'utf8');
const workflow = fs.readFileSync('.github/workflows/firestore-production-evidence.yml', 'utf8');
const diagnosticWorkflow = fs.readFileSync('.github/workflows/firestore-seat-shape-diagnostic.yml', 'utf8');

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

test('missing canonical Seat still writes negative run-scoped evidence', () => {
  assert.match(script, /result: classification\.result/);
  assert.match(script, /seatPresent: false/);
  assert.match(script, /process\.exit\(2\)/);
  assert.match(script, /listDocumentIds\(parent, 'teams'/);
  assert.match(script, /const runPath = parent \+ '\/runtime-diagnostics\/' \+ runId/);
  assert.doesNotMatch(script, /throw new Error\('canonical Seat document not found'\)/);
  const runPathIndex = script.indexOf("const runPath = parent + '/runtime-diagnostics/' + runId");
  const missingIndex = script.indexOf('classifyMissingSeatProbe({ teamIds, teamListError })');
  assert.ok(runPathIndex >= 0 && missingIndex > runPathIndex);
});

test('missing-Seat path classifies operator hierarchy absence and does not create Seat documents', () => {
  assert.match(script, /classifyMissingSeatProbe/);
  assert.match(script, /blockerClass: classification\.blockerClass/);
  assert.match(script, /operatorActionRequired: classification\.operatorActionRequired/);
  assert.match(script, /operator_hierarchy_absent/);
  assert.match(script, /The probe does not create Seat documents/);
  assert.doesNotMatch(script, /await write\(seatPath/);
  assert.doesNotMatch(script, /await write\(parent \+ '\/teams/);
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

test('default-branch Seat diagnostic supports an operator-authorized Team/Seat pair', () => {
  assert.match(diagnosticWorkflow, /workflow_dispatch:/);
  assert.match(diagnosticWorkflow, /team_id:/);
  assert.match(diagnosticWorkflow, /seat_id:/);
  assert.match(diagnosticWorkflow, /TEAMAI_TEAM_ID: \\$\\{\\{ inputs\\.team_id \\}\\}/);
  assert.match(diagnosticWorkflow, /TEAMAI_SEAT_ID: \\$\\{\\{ inputs\\.seat_id \\}\\}/);
  assert.doesNotMatch(diagnosticWorkflow, /TEAMAI_TEAM_ID: gate3-test-team/);
  assert.match(diagnosticWorkflow, /node scripts\/run-production-firestore-evidence\.mjs/);
  assert.doesNotMatch(diagnosticWorkflow, /diagnose-production-firestore-seat\.mjs/);
  assert.doesNotMatch(diagnosticWorkflow, /pull_request:/);
  assert.doesNotMatch(diagnosticWorkflow, /pull_request_target:/);
});
