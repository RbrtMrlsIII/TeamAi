/**
 * P-R0 WORKSPACE_ZIPSKILLS crown branch — presentation only
 * Workspace tree only · not a seat child · optional · not entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  ZIPSKILLS_BRANCH_MS,
  RING_R0_ZIP_SCALE,
  WORKSPACE_ZIPSKILLS_V1,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  createHierarchyRuntime,
  createRingFocusState,
  focusRingItem,
  tickZipskillsBranch,
  getZipskillsBranchAmount,
  beginZipskillsBranch,
  zipskillsAccessibleName,
  requestZipskillsConfigureHandoff,
  openSeatShellParent,
  APP_UI_HANDOFF,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('ZIPSKILLS_BRANCH_MS and R0 scale are named positive numbers', () => {
  assert.equal(typeof ZIPSKILLS_BRANCH_MS, 'number');
  assert.ok(ZIPSKILLS_BRANCH_MS > 0 && ZIPSKILLS_BRANCH_MS < 2000);
  assert.equal(RING_R0_ZIP_SCALE, 0.22);
});

test('WORKSPACE_ZIPSKILLS never lives on seat children', () => {
  assert.equal(SEAT_SHELL_V1_CHILDREN.includes(HIERARCHY_PART.WORKSPACE_ZIPSKILLS), false);
  assert.ok(WORKSPACE_ZIPSKILLS_V1.every((x) => x.optional === true));
});

test('R0 focus expands branch; reduced motion snaps; seat open clears', () => {
  const state = createHierarchyRuntime();
  const rf = createRingFocusState();
  focusRingItem(rf, 'r0', 0);
  beginZipskillsBranch(state, rf, { nowMs: 0, snap: false });
  tickZipskillsBranch(state, rf, 0, false);
  const start = getZipskillsBranchAmount(state);
  tickZipskillsBranch(state, rf, ZIPSKILLS_BRANCH_MS, false);
  assert.equal(getZipskillsBranchAmount(state), 1);
  assert.ok(start < 1);
  const reduced = createHierarchyRuntime();
  beginZipskillsBranch(reduced, rf, { nowMs: 0, snap: false });
  tickZipskillsBranch(reduced, rf, 5, true);
  assert.equal(getZipskillsBranchAmount(reduced), 1);
  openSeatShellParent(state, 0, { snap: true, nowMs: 50 });
  tickZipskillsBranch(state, rf, 50, false);
  assert.equal(getZipskillsBranchAmount(state), 0);
});

test('accessible name and handoff stay optional presentation-only', () => {
  const item = WORKSPACE_ZIPSKILLS_V1[0];
  const name = zipskillsAccessibleName(item, 1);
  assert.match(name, /optional/i);
  assert.match(name, /not required/i);
  assert.match(name, /not a seat child/i);
  assert.match(name, /Press G/i);
  assert.doesNotMatch(name, /entitled|authorized|must configure/i);
  const intent = requestZipskillsConfigureHandoff({ item });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthority, true);
  assert.equal(intent.notEntitlement, true);
  assert.equal(intent.optional, true);
  assert.equal(intent.notSeatChild, true);
  assert.equal(intent.workspaceScoped, true);
  assert.equal(intent.reason, APP_UI_HANDOFF);
  assert.equal(intent.source, 'p-r0-workspace-zipskills');
});

test('hero-flex wires branch tick, camera sync, G key, Isolation preserved', () => {
  const src = read('public/hero-flex.js');
  assert.match(src, /tickZipskillsBranch\s*\(\s*hierarchyRuntime/);
  assert.match(src, /syncZipskillsCamera/);
  assert.match(src, /key===['"]g['"]/);
  assert.match(src, /requestZipskillsConfigureHandoff/);
  assert.match(src, /getZipskillsBranchAmount/);
  assert.match(src, /Isolation preserved/);
  assert.match(src, /drawWorkspaceZipskills/);
});

test('workspace-zipskills skill exists with PASS and DO NOT seat authority', () => {
  const skill = read('skills/frontend/spatial/workspace-zipskills/SKILL.md');
  assert.match(skill, /WHEN TO USE/);
  assert.match(skill, /DO NOT/);
  assert.match(skill, /PASS/);
  assert.match(skill, /not a seat child|never seat/i);
  assert.match(skill, /ZIPSKILLS_BRANCH_MS/);
});
