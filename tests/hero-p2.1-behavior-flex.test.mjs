/**
 * P2.1 SEAT_BEHAVIOR visual flex — presentation-only source contracts on hero-flex.js
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports behavior branch APIs', () => {
  const src = flex();
  assert.match(src, /tickBehaviorBranch/);
  assert.match(src, /getBehaviorBranchAmount/);
  assert.match(src, /behaviorFaceAccessibleName/);
  assert.match(src, /requestBehaviorConfigureHandoff/);
  assert.match(src, /BEHAVIOR_BRANCH_MS/);
});

test('hero-flex frame ticks behavior branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickBehaviorBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const beh = src.indexOf('tickBehaviorBranch');
  assert.ok(pose >= 0 && beh > pose);
});

test('hero-flex applies branchBoost for SEAT_BEHAVIOR child', () => {
  const src = flex();
  assert.match(src, /isBehavior/);
  assert.match(src, /SEAT_BEHAVIOR/);
  assert.match(src, /getBehaviorBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
});

test('hero-flex keyboard B requests behavior configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]b['"]/);
  assert.match(src, /requestBehaviorConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]behavior['"]/);
});

test('hero-flex labels use behaviorFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /behaviorFaceAccessibleName\s*\(\s*getBehaviorBranchAmount/);
});

test('TeamAiHero exposes behavior inspection helpers', () => {
  const src = flex();
  assert.match(src, /getBehaviorBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestBehaviorConfigure:\s*\(\)\s*=>/);
  assert.match(src, /behaviorFaceAccessibleName/);
});
