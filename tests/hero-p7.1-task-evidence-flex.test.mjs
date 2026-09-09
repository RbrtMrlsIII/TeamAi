/**
 * P7.1 SEAT_TASK_EVIDENCE visual flex — presentation-only source contracts
 * Evidence face · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports task evidence branch APIs', () => {
  const src = flex();
  assert.match(src, /tickTaskEvidenceBranch/);
  assert.match(src, /getTaskEvidenceBranchAmount/);
  assert.match(src, /taskEvidenceFaceAccessibleName/);
  assert.match(src, /requestTaskEvidenceConfigureHandoff/);
  assert.match(src, /TASK_EVIDENCE_BRANCH_MS/);
});

test('hero-flex frame ticks task evidence branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickTaskEvidenceBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const ev = src.indexOf('tickTaskEvidenceBranch');
  assert.ok(pose >= 0 && ev > pose);
});

test('hero-flex applies branchBoost for SEAT_TASK_EVIDENCE child', () => {
  const src = flex();
  assert.match(src, /isTaskEvidence/);
  assert.match(src, /getTaskEvidenceBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
  assert.match(src, /isWorkspaceScope \|\| isTaskEvidence/);
});

test('hero-flex keyboard E requests task evidence configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]e['"]/);
  assert.match(src, /requestTaskEvidenceConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]task-evidence['"]/);
});

test('hero-flex labels use taskEvidenceFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /taskEvidenceFaceAccessibleName\s*\(\s*getTaskEvidenceBranchAmount/);
});

test('TeamAiHero exposes task evidence inspection helpers', () => {
  const src = flex();
  assert.match(src, /getTaskEvidenceBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestTaskEvidenceConfigure:\s*\(\)\s*=>/);
  assert.match(src, /taskEvidenceFaceAccessibleName/);
});
