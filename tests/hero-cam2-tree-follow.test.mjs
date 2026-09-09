/**
 * Cam-2 — tree camera follow tests (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  focusChild,
  focusLeaf,
  closeHierarchyParent,
  HIERARCHY_PART,
  HIERARCHY_INPUT,
} from '../public/hero-hierarchy-runtime.js';
import {
  TREE_CAMERA,
  DEFAULT_WORLD_ELEVATION_DEG,
  resolveTreeCamera,
  shouldFollowTree,
} from '../public/hero-cam2-tree-follow.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });

test('default world elevation product note is 45°', () => {
  assert.equal(DEFAULT_WORLD_ELEVATION_DEG, 45);
});

test('closed hierarchy resolves to HERO_WIDE world center', () => {
  const state = createHierarchyRuntime();
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.WORLD);
  assert.equal(r.treeCenter, 'world');
  assert.equal(r.inputHint, HIERARCHY_INPUT.NAVIGATE);
  assert.equal(shouldFollowTree(state), false);
});

test('open seat shell docks camera on that tree (defaults to first child CONNECTION)', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 2, { snap: true, nowMs: 0 });
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.SEAT_CHILD_NEAR);
  assert.equal(r.treeCenter, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(shouldFollowTree(state), true);
  state.focusedChildId = null;
  assert.equal(resolveTreeCamera(state).cameraId, TREE_CAMERA.SEAT_SHELL);
});

test('focus near child keeps seat-near dock; detail child uses DETAIL_ANCHOR', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(resolveTreeCamera(state).cameraId, TREE_CAMERA.SEAT_CHILD_NEAR);
  focusChild(state, HIERARCHY_PART.SEAT_AUTHORIZATION);
  assert.equal(resolveTreeCamera(state).cameraId, TREE_CAMERA.SEAT_CHILD_DETAIL);
});

test('health leaf uses detail dock for readability', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: true, nowMs: 0 });
  focusLeaf(state, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(resolveTreeCamera(state).cameraId, TREE_CAMERA.SEAT_CHILD_DETAIL);
});

test('close returns world camera', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  assert.equal(resolveTreeCamera(state).cameraId, TREE_CAMERA.WORLD);
  assert.equal(shouldFollowTree(state), false);
});

test('setup fill prefers DETAIL_ANCHOR', () => {
  const state = createHierarchyRuntime();
  const r = resolveTreeCamera(state, { ring: 'r2', setupFill: 0.5 });
  assert.equal(r.cameraId, TREE_CAMERA.SETUP_FILL);
});

test('module and contract stay presentation-only', async () => {
  const src = await readFile(new URL('../public/hero-cam2-tree-follow.js', import.meta.url), 'utf8');
  assert.match(src, /Camera Follow Contract|tree's center|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|scheduler|OAuth/i);
  const contract = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md', import.meta.url),
    'utf8'
  );
  assert.match(contract, /Cam-2/);
  assert.match(contract, /center target/i);
});

test('hero-flex has Cam-2 module path (static wire or emergency loader)', async () => {
  const flex = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(flex, /hero-cam2-tree-follow|resolveTreeCamera/);
  assert.match(flex, /DEFAULT_WORLD_ELEVATION_DEG|HERO_WIDE|emergency loader/);
});
