/**
 * P3.1 SEAT_TOOLKIT visual flex — presentation-only source contracts on hero-flex.js
 * Optional equip · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports toolkit branch APIs', () => {
  const src = flex();
  assert.match(src, /tickToolkitBranch/);
  assert.match(src, /getToolkitBranchAmount/);
  assert.match(src, /toolkitFaceAccessibleName/);
  assert.match(src, /requestToolkitConfigureHandoff/);
  assert.match(src, /TOOLKIT_BRANCH_MS/);
});

test('hero-flex frame ticks toolkit branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickToolkitBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const tk = src.indexOf('tickToolkitBranch');
  assert.ok(pose >= 0 && tk > pose);
});

test('hero-flex applies branchBoost for SEAT_TOOLKIT child', () => {
  const src = flex();
  assert.match(src, /isToolkit/);
  assert.match(src, /getToolkitBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
  assert.match(src, /isConnection \|\| isBehavior \|\| isToolkit/);
});

test('hero-flex keyboard T requests toolkit configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]t['"]/);
  assert.match(src, /requestToolkitConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]toolkit['"]/);
});

test('hero-flex labels use toolkitFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /toolkitFaceAccessibleName\s*\(\s*getToolkitBranchAmount/);
});

test('TeamAiHero exposes toolkit inspection helpers', () => {
  const src = flex();
  assert.match(src, /getToolkitBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestToolkitConfigure:\s*\(\)\s*=>/);
  assert.match(src, /toolkitFaceAccessibleName/);
});
