import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const flex = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const runtime = readFileSync(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');

test('CAPABILITIES branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
});

test('CAPABILITIES branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});

test('CAPABILITIES handoff and accessibility remain public API', () => {
  assert.ok(runtime.includes('requestCapabilitiesConfigureHandoff'));
  assert.ok(runtime.includes('capabilitiesFaceAccessibleName'));
  assert.ok(flex.includes('requestSeatDivisionConfigure'));
  assert.ok(flex.includes('getCapabilitiesBranchAmount'));
});

test('CAPABILITIES retains its compatibility branch timing export', () => {
  assert.ok(runtime.includes('CAPABILITIES_BRANCH_MS'));
});
