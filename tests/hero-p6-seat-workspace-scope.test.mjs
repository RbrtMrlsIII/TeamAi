/**
 * P6 SEAT_WORKSPACE_SCOPE branch runtime — presentation only
 * WORKSPACE ≠ FIRESTORE · no entitlement
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AUTHORIZATION_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  WORKSPACE_SCOPE_BRANCH_MS,
  createHierarchyRuntime,
  focusChild,
  getAuthorizationBranchAmount,
  getConnectionBranchAmount,
  getWorkspaceScopeBranchAmount,
  openSeatShellParent,
  requestWorkspaceScopeConfigureHandoff,
  tickAuthorizationBranch,
  tickHierarchyPose,
  tickWorkspaceScopeBranch,
  workspaceScopeFaceAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

test('WORKSPACE_SCOPE_BRANCH_MS is named and positive', () => {
  assert.equal(typeof WORKSPACE_SCOPE_BRANCH_MS, 'number');
  assert.ok(WORKSPACE_SCOPE_BRANCH_MS > 0);
  assert.ok(WORKSPACE_SCOPE_BRANCH_MS <= CONNECTION_BRANCH_MS);
  assert.ok(WORKSPACE_SCOPE_BRANCH_MS <= AUTHORIZATION_BRANCH_MS + 20);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
});

test('focusing WORKSPACE_SCOPE starts branch and clears earlier branches', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE);
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getAuthorizationBranchAmount(s), 0);
});

test('workspace scope branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickWorkspaceScopeBranch(s, 0, false);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickWorkspaceScopeBranch(s, 400, false);
  const mid = getWorkspaceScopeBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickWorkspaceScopeBranch(s, 400 + WORKSPACE_SCOPE_BRANCH_MS, false);
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
});

test('workspace scope branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickWorkspaceScopeBranch(s, 600, true);
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
});

test('focusing away from WORKSPACE_SCOPE clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: true, nowMs: 5 });
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 10 });
  tickWorkspaceScopeBranch(s, 10, false);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only not Firestore', () => {
  const name = workspaceScopeFaceAccessibleName(1);
  assert.match(name, /workspace scope/i);
  assert.match(name, /not Firestore/i);
  const intent = requestWorkspaceScopeConfigureHandoff({ targetSection: 'workspace-scope' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notFirestore, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p6-seat-workspace-scope');
  assert.equal(intent.targetSection, 'workspace-scope');
});

test('authorization and workspace scope branches do not both expand', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_AUTHORIZATION, { snap: true, nowMs: 10 });
  tickAuthorizationBranch(s, 10, true);
  assert.equal(getAuthorizationBranchAmount(s), 1);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: true, nowMs: 20 });
  tickAuthorizationBranch(s, 20, false);
  tickWorkspaceScopeBranch(s, 20, true);
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
  assert.equal(getAuthorizationBranchAmount(s), 0);
  assert.equal(getConnectionBranchAmount(s), 0);
});
