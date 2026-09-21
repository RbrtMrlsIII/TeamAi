import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('AUTHORIZATION branch state is hierarchy-owned and renderer-consumed', () => {
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
test('AUTHORIZATION controller state wiring is preserved',()=>{for(const x of ['tickAuthorizationBranch','getAuthorizationBranchAmount','authorizationFaceAccessibleName','requestAuthorizationConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('AUTHORIZATION branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});ort assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('AUTHORIZATION branch state is hierarchy-owned and renderer-consumed', () => {
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
test('AUTHORIZATION controller state wiring is preserved',()=>{for(const x of ['tickAuthorizationBranch','getAuthorizationBranchAmount','authorizationFaceAccessibleName','requestAuthorizationConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('AUTHORIZATION transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickAuthorizationBranch'));});
test('AUTHORIZATION remains distinct from CAPABILITIES',()=>{assert.ok(runtime.includes('AUTHORIZATION_BRANCH_MS'));assert.ok(runtime.includes('CAPABILITIES_BRANCH_MS'));});
