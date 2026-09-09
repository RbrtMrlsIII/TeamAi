/**
 * P2 SEAT_BEHAVIOR branch runtime — presentation only.
 * Mirrors P1 connection branch contract for Do/Don't face.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BEHAVIOR_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  createHierarchyRuntime,
  openSeatShellParent,
  focusChild,
  tickHierarchyPose,
  tickBehaviorBranch,
  tickConnectionBranch,
  getBehaviorBranchAmount,
  getConnectionBranchAmount,
  behaviorFaceAccessibleName,
  requestBehaviorConfigureHandoff,
} from '../public/hero-hierarchy-runtime.js';

test('BEHAVIOR_BRANCH_MS is named and positive', () => {
  assert.equal(typeof BEHAVIOR_BRANCH_MS, 'number');
  assert.ok(BEHAVIOR_BRANCH_MS > 0);
  assert.ok(BEHAVIOR_BRANCH_MS <= CONNECTION_BRANCH_MS + 40);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getBehaviorBranchAmount(s), 0);
});

test('focusing BEHAVIOR starts branch and clears connection branch', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.equal(getBehaviorBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
});

test('behavior branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickBehaviorBranch(s, 0, false);
  assert.equal(getBehaviorBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickBehaviorBranch(s, 400, false);
  const mid = getBehaviorBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickBehaviorBranch(s, 400 + BEHAVIOR_BRANCH_MS, false);
  assert.equal(getBehaviorBranchAmount(s), 1);
});

test('behavior branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickBehaviorBranch(s, 600, true);
  assert.equal(getBehaviorBranchAmount(s), 1);
});

test('focusing away from BEHAVIOR clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: true, nowMs: 5 });
  assert.equal(getBehaviorBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_TOOLKIT, { snap: true, nowMs: 10 });
  tickBehaviorBranch(s, 10, false);
  assert.equal(getBehaviorBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only', () => {
  const name = behaviorFaceAccessibleName(1);
  assert.match(name, /Seat behavior face/);
  assert.match(name, /Presentation only|presentation only/i);
  assert.match(name, /Do \/ Don't|Do\/Don't/i);
  const intent = requestBehaviorConfigureHandoff({ targetSection: 'behavior' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p2-seat-behavior');
  assert.equal(intent.targetSection, 'behavior');
});

test('connection and behavior branches do not both expand', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  tickConnectionBranch(s, 0, true);
  assert.ok(getConnectionBranchAmount(s) >= 0.85);
  focusChild(s, HIERARCHY_PART.SEAT_BEHAVIOR, { snap: true, nowMs: 20 });
  tickConnectionBranch(s, 20, false);
  tickBehaviorBranch(s, 20, true);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getBehaviorBranchAmount(s), 1);
});
