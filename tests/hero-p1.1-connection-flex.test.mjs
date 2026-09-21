import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  CONNECTION_BRANCH_MS,
} from '../public/hero-hierarchy-runtime.js';

const flex = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');

test('CONNECTION branch state is hierarchy-owned and renderer-consumed', () => {
  for (const token of ['tickSeatDivisionBranches', 'getSeatDivisionBranchAmounts']) {
    assert.ok(flex.includes(token), token);
    assert.ok(runtime.includes(token), token);
  }
  assert.ok(flex.includes('seatDivisionBranchAmounts: getSeatDivisionBranchAmounts'));
  assert.ok(flex.includes('machine-world-renderer.js'));
  // VALIDATION CHANGE WARNING: old test asserted a controller-owned bespoke branch timer.
  // Authorized replacement: one hierarchy-owned seven-branch timing contract consumed as an aggregate.
});

test('CONNECTION branch ordering remains after hierarchy pose', () => {
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
  tickConnectionBranch(state, 600 + CONNECTION_BRANCH_MS, false);
  assert.ok(getConnectionBranchAmount(state) >= 0.99);
  assert.match(connectionFaceAccessibleName(1), /Presentation only/i);
  assert.equal(requestConnectionConfigureHandoff().presentationOnly, true);
});

test('canonical renderer owns Seat-1 WebGL connection proof', () => {
  assert.ok(renderer.includes('buildMachineCoreSeat1Connection'));
  assert.ok(renderer.includes('seatConnectionDrawPath'));
  assert.ok(renderer.includes('seatConnectionProof'));
});
