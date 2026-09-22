import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const flex = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const runtime = readFileSync(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');

test('AUTHORIZATION branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
});

test('AUTHORIZATION branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});

test('AUTHORIZATION handoff and accessibility remain public API', () => {
  assert.ok(runtime.includes('requestAuthorizationConfigureHandoff'));
  assert.ok(runtime.includes('authorizationFaceAccessibleName'));
  assert.ok(flex.includes('requestSeatDivisionConfigure'));
  assert.ok(flex.includes('getAuthorizationBranchAmount'));
});

test('AUTHORIZATION retains its compatibility branch timing export', () => {
  assert.ok(runtime.includes('AUTHORIZATION_BRANCH_MS'));
});
