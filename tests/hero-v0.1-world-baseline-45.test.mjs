/**
 * V0.1 — World baseline ~45° via HERO_WIDE (Vision).
 * Owner: HERO_WIDE + apply-cam2-tree-follow-flex · presentation only · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DEFAULT_WORLD_ELEVATION_DEG,
  WORLD_BASELINE_DOCK_ID,
  TREE_CAMERA,
  elevationDegFromEye,
  isNearWorldBaselineElevation,
  resolveTreeCamera,
} from '../public/hero-cam2-tree-follow.js';
import { createHierarchyRuntime } from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

test('V0.1 product elevation constant is 45°', () => {
  assert.equal(DEFAULT_WORLD_ELEVATION_DEG, 45);
});

test('V0.1 world baseline dock is HERO_WIDE', () => {
  assert.equal(WORLD_BASELINE_DOCK_ID, 'HERO_WIDE');
  assert.equal(TREE_CAMERA.WORLD, WORLD_BASELINE_DOCK_ID);
});

test('V0.1 elevationDegFromEye is 45° when y equals z', () => {
  assert.ok(Math.abs(elevationDegFromEye([0, 1, 1]) - 45) < 1e-9);
  assert.ok(isNearWorldBaselineElevation([0, 9.6, 9.6]));
  // Pre-V0.1 factor 0.67 is ~33.8° — must not count as baseline
  assert.equal(isNearWorldBaselineElevation([0, 0.67, 1]), false);
});

test('V0.1 closed hierarchy resolves to HERO_WIDE world baseline', () => {
  const state = createHierarchyRuntime();
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(r.treeCenter, 'world');
});

test('V0.1 applied hero-flex HERO_WIDE uses p:[0,d,d] (~45°), not d*.67', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /HERO_WIDE:\{p:\[0,d,d\]/);
  assert.doesNotMatch(src, /HERO_WIDE:\{p:\[0,d\*\.67,d\]/);
});

test('V0.1 apply script still owns the 0.67→d,d baseline patch', async () => {
  const apply = await readFile(join(root, 'scripts/apply-cam2-tree-follow-flex.mjs'), 'utf8');
  assert.match(apply, /HERO_WIDE:\{p:\[0,d\*\.67,d\]/);
  assert.match(apply, /HERO_WIDE:\{p:\[0,d,d\]/);
});
