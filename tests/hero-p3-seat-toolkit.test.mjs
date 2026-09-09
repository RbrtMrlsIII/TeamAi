/**
 * P3 SEAT_TOOLKIT branch runtime — presentation only · optional equip · no entitlement
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BEHAVIOR_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  TOOLKIT_BRANCH_MS,
  createHierarchyRuntime,
  focusChild,
  getBehaviorBranchAmount,
  getConnectionBranchAmount,
  getToolkitBranchAmount,
  openSeatShellParent,
  requestToolkitConfigureHandoff,
  tickBehaviorBranch,
  tickConnectionBranch,
  tickHierarchyPose,
  tickToolkitBranch,
  toolkitFaceAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

test('TOOLKIT_BRANCH_MS is named and positive', () => {
  assert.equal(typeof TOOLKIT_BRANCH_MS, 'number');
  assert.ok(TOOLKIT_BRANCH_MS > 0);
  assert.ok(TOOLKIT_BRANCH_MS <= CONNECTION_BRANCH_MS);
  assert.ok(TOOLKIT_BRANCH_MS <= BEHAVIOR_BRANCH_MS + 20);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getToolkitBranchAmount(s), 0);
});

test('focusing TOOLKIT starts branch and clears connection/behavior branches', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_TOOLKIT);
  assert.equal(getToolkitBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getBehaviorBranchAmount(s), 0);
});

test('toolkit branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickToolkitBranch(s, 0, false);
  assert.equal(getToolkitBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickToolkitBranch(s, 400, false);
  const mid = getToolkitBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickToolkitBranch(s, 400 + TOOLKIT_BRANCH_MS, false);
  assert.equal(getToolkitBranchAmount(s), 1);
});

test('toolkit branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickToolkitBranch(s, 600, true);
  assert.equal(getToolkitBranchAmount(s), 1);
});

test('focusing away from TOOLKIT clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: true, nowMs: 5 });
  assert.equal(getToolkitBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 10 });
  tickToolkitBranch(s, 10, false);
  assert.equal(getToolkitBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only optional', () => {
  const name = toolkitFaceAccessibleName(1);
  assert.match(name, /toolkit/i);
  assert.match(name, /optional/i);
  assert.match(name, /not entitlement/i);
  const intent = requestToolkitConfigureHandoff({ targetSection: 'toolkit' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.optional, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p3-seat-toolkit');
  assert.equal(intent.targetSection, 'toolkit');
});

test('connection behavior and toolkit branches do not all expand together', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  tickConnectionBranch(s, 0, true);
  assert.ok(getConnectionBranchAmount(s) >= 0.85);
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: true, nowMs: 20 });
  tickConnectionBranch(s, 20, false);
  tickBehaviorBranch(s, 20, true);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getBehaviorBranchAmount(s), 1);
  assert.equal(getToolkitBranchAmount(s), 0);
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: true, nowMs: 30 });
  tickBehaviorBranch(s, 30, false);
  tickToolkitBranch(s, 30, true);
  assert.equal(getToolkitBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getBehaviorBranchAmount(s), 0);
});
