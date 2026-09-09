/**
 * Slice P1.1 — SEAT_CONNECTION visual flex wiring in hero-flex (presentation only).
 * No 029-released claim.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  HIERARCHY_PART,
  CONNECTION_BRANCH_MS,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports connection branch APIs', () => {
  for (const token of [
    'tickConnectionBranch',
    'getConnectionBranchAmount',
    'connectionFaceAccessibleName',
    'requestConnectionConfigureHandoff',
    'CONNECTION_BRANCH_MS',
  ]) {
    assert.match(flex, new RegExp(token));
  }
});

test('hero-flex frame ticks connection branch after hierarchy pose', () => {
  assert.match(
    flex,
    /tickHierarchyPose\(hierarchyRuntime,\s*now,\s*reducedMotion\);\s*tickConnectionBranch\(hierarchyRuntime,\s*now,\s*reducedMotion\)/,
  );
});

test('hero-flex applies branchBoost visual on CONNECTION plate', () => {
  assert.match(flex, /branchBoost/);
  assert.match(flex, /getConnectionBranchAmount\(hierarchyRuntime\)/);
});

test('hero-flex keyboard C requests configure handoff when CONNECTION focused', () => {
  assert.match(flex, /event\.key==='c'\|\|event\.key==='C'/);
  assert.match(flex, /requestConnectionConfigureHandoff\(\{targetSection:'connection'\}\)/);
  assert.match(flex, /focusedChildId===HIERARCHY_PART\.SEAT_CONNECTION/);
});

test('hero-flex labels use connectionFaceAccessibleName for CONNECTION focus', () => {
  assert.match(flex, /connectionFaceAccessibleName\(getConnectionBranchAmount\(hierarchyRuntime\)\)/);
});

test('TeamAiHero exposes connection branch inspection helpers', () => {
  assert.match(flex, /getConnectionBranchAmount:\(\)=>getConnectionBranchAmount\(hierarchyRuntime\)/);
  assert.match(flex, /requestConnectionConfigure:/);
  assert.match(flex, /CONNECTION_BRANCH_MS/);
});

test('runtime branch still eases under P1 contract (flex consumer)', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: false, nowMs: 0 });
  tickHierarchyPose(state, 600, false);
  tickConnectionBranch(state, 600, false);
  assert.ok(getConnectionBranchAmount(state) >= 0);
  tickConnectionBranch(state, 600 + CONNECTION_BRANCH_MS, false);
  assert.ok(getConnectionBranchAmount(state) >= 0.99);
  const name = connectionFaceAccessibleName(1);
  assert.match(name, /Presentation only/i);
  const intent = requestConnectionConfigureHandoff();
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.source, 'p1-seat-connection');
});
