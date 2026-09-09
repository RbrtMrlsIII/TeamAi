/**
 * P5.1 SEAT_AUTHORIZATION visual flex — presentation-only source contracts
 * AUTHORIZATION ≠ CAPABILITY · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports authorization branch APIs', () => {
  const src = flex();
  assert.match(src, /tickAuthorizationBranch/);
  assert.match(src, /getAuthorizationBranchAmount/);
  assert.match(src, /authorizationFaceAccessibleName/);
  assert.match(src, /requestAuthorizationConfigureHandoff/);
  assert.match(src, /AUTHORIZATION_BRANCH_MS/);
});

test('hero-flex frame ticks authorization branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickAuthorizationBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const auth = src.indexOf('tickAuthorizationBranch');
  assert.ok(pose >= 0 && auth > pose);
});

test('hero-flex applies branchBoost for SEAT_AUTHORIZATION child', () => {
  const src = flex();
  assert.match(src, /isAuthorization/);
  assert.match(src, /getAuthorizationBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
  assert.match(src, /isCapabilities \|\| isAuthorization/);
});

test('hero-flex keyboard A requests authorization configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]a['"]/);
  assert.match(src, /requestAuthorizationConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]authorization['"]/);
});

test('hero-flex labels use authorizationFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /authorizationFaceAccessibleName\s*\(\s*getAuthorizationBranchAmount/);
});

test('TeamAiHero exposes authorization inspection helpers', () => {
  const src = flex();
  assert.match(src, /getAuthorizationBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestAuthorizationConfigure:\s*\(\)\s*=>/);
  assert.match(src, /authorizationFaceAccessibleName/);
});
