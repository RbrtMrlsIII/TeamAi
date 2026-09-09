/**
 * P7 SEAT_TASK_EVIDENCE branch runtime — presentation only
 * Evidence face · no entitlement · no authority claim
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONNECTION_BRANCH_MS,
  HIERARCHY_PART,
  TASK_EVIDENCE_BRANCH_MS,
  WORKSPACE_SCOPE_BRANCH_MS,
  createHierarchyRuntime,
  focusChild,
  getConnectionBranchAmount,
  getTaskEvidenceBranchAmount,
  getWorkspaceScopeBranchAmount,
  openSeatShellParent,
  requestTaskEvidenceConfigureHandoff,
  tickHierarchyPose,
  tickTaskEvidenceBranch,
  tickWorkspaceScopeBranch,
  taskEvidenceFaceAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

test('TASK_EVIDENCE_BRANCH_MS is named and positive', () => {
  assert.equal(typeof TASK_EVIDENCE_BRANCH_MS, 'number');
  assert.ok(TASK_EVIDENCE_BRANCH_MS > 0);
  assert.ok(TASK_EVIDENCE_BRANCH_MS <= CONNECTION_BRANCH_MS);
  assert.ok(TASK_EVIDENCE_BRANCH_MS <= WORKSPACE_SCOPE_BRANCH_MS + 20);
});

test('open seat shell still focuses CONNECTION first (P1 order)', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(getTaskEvidenceBranchAmount(s), 0);
});

test('focusing TASK_EVIDENCE starts branch and clears earlier branches', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 1, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TASK_EVIDENCE, { snap: true, nowMs: 10 });
  assert.equal(s.focusedChildId, HIERARCHY_PART.SEAT_TASK_EVIDENCE);
  assert.equal(getTaskEvidenceBranchAmount(s), 1);
  assert.equal(getConnectionBranchAmount(s), 0);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
});

test('task evidence branch eases after parent is mostly open', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TASK_EVIDENCE, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 0, false);
  tickTaskEvidenceBranch(s, 0, false);
  assert.equal(getTaskEvidenceBranchAmount(s), 0);
  tickHierarchyPose(s, 400, false);
  tickTaskEvidenceBranch(s, 400, false);
  const mid = getTaskEvidenceBranchAmount(s);
  assert.ok(mid >= 0 && mid <= 1);
  tickTaskEvidenceBranch(s, 400 + TASK_EVIDENCE_BRANCH_MS, false);
  assert.equal(getTaskEvidenceBranchAmount(s), 1);
});

test('task evidence branch snaps under reduced motion', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: false, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TASK_EVIDENCE, { snap: false, nowMs: 0 });
  tickHierarchyPose(s, 600, false);
  tickTaskEvidenceBranch(s, 600, true);
  assert.equal(getTaskEvidenceBranchAmount(s), 1);
});

test('focusing away from TASK_EVIDENCE clears branch amount', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_TASK_EVIDENCE, { snap: true, nowMs: 5 });
  assert.equal(getTaskEvidenceBranchAmount(s), 1);
  focusChild(s, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 10 });
  tickTaskEvidenceBranch(s, 10, false);
  assert.equal(getTaskEvidenceBranchAmount(s), 0);
});

test('accessible name and configure handoff are presentation-only not authority', () => {
  const name = taskEvidenceFaceAccessibleName(1);
  assert.match(name, /task evidence/i);
  assert.match(name, /not authority/i);
  assert.doesNotMatch(name, /firestore|paypal|scheduler eligibility/i);
  const intent = requestTaskEvidenceConfigureHandoff({ targetSection: 'task-evidence' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthority, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p7-seat-task-evidence');
  assert.equal(intent.targetSection, 'task-evidence');
});

test('workspace scope and task evidence branches do not both expand', () => {
  const s = createHierarchyRuntime();
  openSeatShellParent(s, 0, { snap: true, nowMs: 0 });
  focusChild(s, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE, { snap: true, nowMs: 10 });
  tickWorkspaceScopeBranch(s, 10, true);
  assert.equal(getWorkspaceScopeBranchAmount(s), 1);
  assert.equal(getTaskEvidenceBranchAmount(s), 0);
  focusChild(s, HIERARCHY_PART.SEAT_TASK_EVIDENCE, { snap: true, nowMs: 20 });
  tickWorkspaceScopeBranch(s, 20, false);
  tickTaskEvidenceBranch(s, 20, true);
  assert.equal(getTaskEvidenceBranchAmount(s), 1);
  assert.equal(getWorkspaceScopeBranchAmount(s), 0);
  assert.equal(getConnectionBranchAmount(s), 0);
});
