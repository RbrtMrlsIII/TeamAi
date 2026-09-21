import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const flex = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const runtime = readFileSync(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');


test('CONNECTION branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
});

test('CONNECTION branch timing remains after hierarchy pose', () => {
  assert.ok(flex.indexOf('tickHierarchyPose') < flex.indexOf('tickSeatDivisionBranches'));
});

test('CONNECTION handoff and accessibility remain public API', () => {
  assert.ok(runtime.includes('requestConnectionConfigureHandoff'));
  assert.ok(runtime.includes('connectionFaceAccessibleName'));
  assert.ok(flex.includes('requestSeatDivisionConfigure'));
  assert.ok(flex.includes('getConnectionBranchAmount'));
});

test('CONNECTION runtime easing remains valid', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: false, nowMs: 0 });
  tickHierarchyPose(state, 600, false);
  tickConnectionBranch(state, 600, false);
  tickConnectionBranch(state, 1300, false);
  assert.ok(getConnectionBranchAmount(state) >= 0.99);
  assert.match(connectionFaceAccessibleName(1), /Presentation only/i);
  assert.equal(requestConnectionConfigureHandoff().presentationOnly, true);
});
import { createHierarchyRuntime, openSeatShellParent, tickHierarchyPose, tickConnectionBranch, getConnectionBranchAmount, connectionFaceAccessibleName, requestConnectionConfigureHandoff } from '../public/hero-hierarchy-runtime.js';