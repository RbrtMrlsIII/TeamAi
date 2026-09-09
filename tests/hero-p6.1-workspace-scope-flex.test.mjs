/**
 * P6.1 SEAT_WORKSPACE_SCOPE visual flex — presentation-only source contracts
 * WORKSPACE ≠ durable store · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports workspace scope branch APIs', () => {
  const src = flex();
  assert.match(src, /tickWorkspaceScopeBranch/);
  assert.match(src, /getWorkspaceScopeBranchAmount/);
  assert.match(src, /workspaceScopeFaceAccessibleName/);
  assert.match(src, /requestWorkspaceScopeConfigureHandoff/);
  assert.match(src, /WORKSPACE_SCOPE_BRANCH_MS/);
});

test('hero-flex frame ticks workspace scope branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickWorkspaceScopeBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const ws = src.indexOf('tickWorkspaceScopeBranch');
  assert.ok(pose >= 0 && ws > pose);
});

test('hero-flex applies branchBoost for SEAT_WORKSPACE_SCOPE child', () => {
  const src = flex();
  assert.match(src, /isWorkspaceScope/);
  assert.match(src, /getWorkspaceScopeBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
  assert.match(src, /isAuthorization \|\| isWorkspaceScope/);
});

test('hero-flex keyboard W requests workspace scope configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]w['"]/);
  assert.match(src, /requestWorkspaceScopeConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]workspace-scope['"]/);
});

test('hero-flex labels use workspaceScopeFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /workspaceScopeFaceAccessibleName\s*\(\s*getWorkspaceScopeBranchAmount/);
});

test('TeamAiHero exposes workspace scope inspection helpers', () => {
  const src = flex();
  assert.match(src, /getWorkspaceScopeBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestWorkspaceScopeConfigure:\s*\(\)\s*=>/);
  assert.match(src, /workspaceScopeFaceAccessibleName/);
});
