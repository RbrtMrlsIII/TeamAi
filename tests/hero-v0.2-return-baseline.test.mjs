/**
 * V0.2 — Return to HERO_WIDE baseline on close (Vision).
 * Owner: returnFromSeatShell / closeHierarchyParent + apply-cam2 · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  WORLD_BASELINE_DOCK_ID,
  resolveTreeCamera,
} from '../public/hero-cam2-tree-follow.js';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

test('V0.2 runtime close returns world baseline camera id', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(r.treeCenter, 'world');
});

test('V0.2 flex returnFromSeatShell resets nav and sets baseline dock', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /function returnFromSeatShell\(\)[\s\S]*navOrbitYaw = 0; navOrbitPitch = 0; navZoom = 1;/);
  assert.match(src, /navOrbitYaw = 0; navOrbitPitch = 0; navZoom = 1;/);
  assert.match(src, /setCamera\(typeof WORLD_BASELINE_DOCK_ID/);
});

test('V0.2 flex closeHierarchyParent restores baseline', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /function closeHierarchyParent\(\)\s*\{[\s\S]*return returnFromSeatShell\(\);/);
});

test('V0.2 controller delegates rendering after baseline reset', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /createMachineWorldRenderer/);
  assert.match(src, /machineLayer/);
  assert.doesNotMatch(src, /WORLD_BASELINE_DOCK_ID/);
});

test('V0.2 canonical source owns return-to-baseline directly', async () => {
  const apply = await readFile(join(root, 'scripts/apply-cam2-tree-follow-flex.mjs'), 'utf8');
  assert.match(apply, /hero-flex\.base\.js/);
  assert.doesNotMatch(apply, /V0\.2 Vision: return-to-baseline patches/);
});