/**
 * P4 SEAT_CAPABILITIES branch runtime — presentation only
 * CAPABILITY ≠ AUTHORIZATION · no entitlement
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CAPABILITIES_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  TOOLKIT_BRANCH_MS,
  createHierarchyRuntime,
  focusChild,
  getCapabilitiesBranchAmount,
  getConnectionBranchAmount,
  getToolkitBranchAmount,
  openSeatShellParent,
  requestCapabilitiesConfigureHandoff,
  tickCapabilitiesBranch,
  tickConnectionBranch,
  tickHierarchyPose,
  tickToolkitBranch,
  capabilitiesFaceAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

test('CAPABILITIES_BRANCH_MS is named and positive', () => {
  assert.equal(typeof CAPABILITIES_BRANCH_MS, 'number');
  assert.ok(CAPABILITIES_BRANCH_MS > 0);
  assert.ok(CAPABILITIES_BRANCH_MS <= CONNECTION_BRANCH_MS);
  assert.ok(CAPABILITIES_BRANCH_MS <= TOOLKIT_BRANCH_MS + 20);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
});

test('focusing CAPABILITIES starts branch and clears earlier branches', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CAPABILITIES);
  assert.equal(getCapabilitiesBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getToolkitBranchAmount(s), 0);
});

test('capabilities branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickCapabilitiesBranch(s, 0, false);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickCapabilitiesBranch(s, 400, false);
  const mid = getCapabilitiesBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickCapabilitiesBranch(s, 400 + CAPABILITIES_BRANCH_MS, false);
  assert.equal(getCapabilitiesBranchAmount(s), 1);
});

test('capabilities branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickCapabilitiesBranch(s, 600, true);
  assert.equal(getCapabilitiesBranchAmount(s), 1);
});

test('focusing away from CAPABILITIES clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: true, nowMs: 5 });
  assert.equal(getCapabilitiesBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 10 });
  tickCapabilitiesBranch(s, 10, false);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only not authorization', () => {
  const name = capabilitiesFaceAccessibleName(1);
  assert.match(name, /capabilities/i);
  assert.match(name, /not authorization/i);
  const intent = requestCapabilitiesConfigureHandoff({ targetSection: 'capabilities' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthorization, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p4-seat-capabilities');
  assert.equal(intent.targetSection, 'capabilities');
});

test('toolkit and capabilities branches do not both expand', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: true, nowMs: 10 });
  tickToolkitBranch(s, 10, true);
  assert.equal(getToolkitBranchAmount(s), 1);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: true, nowMs: 20 });
  tickToolkitBranch(s, 20, false);
  tickCapabilitiesBranch(s, 20, true);
  assert.equal(getCapabilitiesBranchAmount(s), 1);
  assert.equal(getToolkitBranchAmount(s), 0);
  assert.equal(getConnectionBranchAmount(s), 0);
});
