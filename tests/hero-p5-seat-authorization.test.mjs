/**
 * P5 SEAT_AUTHORIZATION branch runtime — presentation only
 * AUTHORIZATION ≠ CAPABILITY · no entitlement
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AUTHORIZATION_BRANCH_MS,
  CAPABILITIES_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  createHierarchyRuntime,
  focusChild,
  getAuthorizationBranchAmount,
  getCapabilitiesBranchAmount,
  getConnectionBranchAmount,
  openSeatShellParent,
  requestAuthorizationConfigureHandoff,
  tickAuthorizationBranch,
  tickCapabilitiesBranch,
  tickHierarchyPose,
  authorizationFaceAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

test('AUTHORIZATION_BRANCH_MS is named and positive', () => {
  assert.equal(typeof AUTHORIZATION_BRANCH_MS, 'number');
  assert.ok(AUTHORIZATION_BRANCH_MS > 0);
  assert.ok(AUTHORIZATION_BRANCH_MS <= CONNECTION_BRANCH_MS);
  assert.ok(AUTHORIZATION_BRANCH_MS <= CAPABILITIES_BRANCH_MS + 20);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getAuthorizationBranchAmount(s), 0);
});

test('focusing AUTHORIZATION starts branch and clears earlier branches', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_AUTHORIZATION);
  assert.equal(getAuthorizationBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
});

test('authorization branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickAuthorizationBranch(s, 0, false);
  assert.equal(getAuthorizationBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickAuthorizationBranch(s, 400, false);
  const mid = getAuthorizationBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickAuthorizationBranch(s, 400 + AUTHORIZATION_BRANCH_MS, false);
  assert.equal(getAuthorizationBranchAmount(s), 1);
});

test('authorization branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickAuthorizationBranch(s, 600, true);
  assert.equal(getAuthorizationBranchAmount(s), 1);
});

test('focusing away from AUTHORIZATION clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: true, nowMs: 5 });
  assert.equal(getAuthorizationBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 10 });
  tickAuthorizationBranch(s, 10, false);
  assert.equal(getAuthorizationBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only not capability', () => {
  const name = authorizationFaceAccessibleName(1);
  assert.match(name, /authorization/i);
  assert.match(name, /not capability/i);
  const intent = requestAuthorizationConfigureHandoff({ targetSection: 'authorization' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notCapability, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p5-seat-authorization');
  assert.equal(intent.targetSection, 'authorization');
});

test('capabilities and authorization branches do not both expand', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_CAPABILITIES, { snap: true, nowMs: 10 });
  tickCapabilitiesBranch(s, 10, true);
  assert.equal(getCapabilitiesBranchAmount(s), 1);
  assert.equal(getAuthorizationBranchAmount(s), 0);
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: true, nowMs: 20 });
  tickCapabilitiesBranch(s, 20, false);
  tickAuthorizationBranch(s, 20, true);
  assert.equal(getAuthorizationBranchAmount(s), 1);
  assert.equal(getCapabilitiesBranchAmount(s), 0);
  assert.equal(getConnectionBranchAmount(s), 0);
});
