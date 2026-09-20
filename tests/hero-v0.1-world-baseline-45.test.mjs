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
const flexPath = join(root, 'public/hero-flex.js');
const applyScript = join(root, 'scripts/apply-cam2-tree-follow-flex.mjs');

function runApply() {
  const r = spawnSync(process.execPath, [applyScript], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  });
  if (r.status !== 0) {
    throw new Error(`apply-cam2 failed: ${r.stderr || r.stdout || r.status}`);
  }
  return r;
}

runApply();

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

test('V0.1 canonical Hero starts at the world baseline', async () => {
  const src = await readFile(flexPath, 'utf8');
  const renderer = await readFile(join(root, 'public/machine-world-renderer.js'), 'utf8');
  assert.match(src, /createMachineWorldRenderer/);
  assert.match(src, /setCamera\('HERO_WIDE'\)/);
  assert.match(renderer, /machineWorldLayer = 'machine'/);
  assert.match(renderer, /effectiveCameraId/);
});

test('V0.1 compatibility sync preserves the canonical controller snapshot', async () => {
  const src = await readFile(flexPath, 'utf8');
  const base = await readFile(join(root, 'public/_flex_src/hero-flex.base.js'), 'utf8');
  const apply = await readFile(applyScript, 'utf8');
  assert.equal(src, base);
  assert.match(apply, /hero-flex\.base\.js/);
  assert.doesNotMatch(apply, /apply-cam2-tree-follow-flex\.engine|raw\.githubusercontent\.com/);
});