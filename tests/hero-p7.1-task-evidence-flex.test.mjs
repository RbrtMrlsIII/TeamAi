import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const flex = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const runtime = readFileSync(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');

test('TASK_EVIDENCE branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
});

test('TASK_EVIDENCE branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});

test('TASK_EVIDENCE handoff and accessibility remain public API', () => {
  assert.ok(runtime.includes('requestTaskEvidenceConfigureHandoff'));
  assert.ok(runtime.includes('taskEvidenceFaceAccessibleName'));
  assert.ok(flex.includes('requestSeatDivisionConfigure'));
  assert.ok(flex.includes('getTaskEvidenceBranchAmount'));
});

test('TASK_EVIDENCE retains its compatibility branch timing export', () => {
  assert.ok(runtime.includes('TASK_EVIDENCE_BRANCH_MS'));
});
