import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('TASK_EVIDENCE branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
  // VALIDATION CHANGE WARNING: old test asserted a controller-owned bespoke branch timer.
  // Authorized replacement: one hierarchy-owned seven-branch timing contract consumed as an aggregate.
});ort assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('TASK_EVIDENCE controller state wiring is preserved',()=>{for(const x of ['tickTaskEvidenceBranch','getTaskEvidenceBranchAmount','taskEvidenceFaceAccessibleName','requestTaskEvidenceConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('TASK_EVIDENCE branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});ort assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('TASK_EVIDENCE branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
  // VALIDATION CHANGE WARNING: old test asserted a controller-owned bespoke branch timer.
  // Authorized replacement: one hierarchy-owned seven-branch timing contract consumed as an aggregate.
});ort assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('TASK_EVIDENCE controller state wiring is preserved',()=>{for(const x of ['tickTaskEvidenceBranch','getTaskEvidenceBranchAmount','taskEvidenceFaceAccessibleName','requestTaskEvidenceConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('TASK_EVIDENCE transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickTaskEvidenceBranch'));});
test('TASK_EVIDENCE remains a presentation branch',()=>{assert.ok(runtime.includes('TASK_EVIDENCE_BRANCH_MS'));assert.ok(runtime.includes('task evidence face'));});
