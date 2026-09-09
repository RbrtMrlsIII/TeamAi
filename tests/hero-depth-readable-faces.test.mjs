/**
 * Depth-readable faces tests (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  focusChild,
  focusLeaf,
  HIERARCHY_PART,
} from '../public/hero-hierarchy-runtime.js';
import {
  TREE_FACE_FOV_BOOST,
  TREE_LEAF_FOV_BOOST,
  depthReadableFovBoost,
  depthReadableFaceScale,
} from '../public/hero-depth-readable-faces.js';

test('named FOV boosts are positive', () => {
  assert.ok(TREE_FACE_FOV_BOOST > 0);
  assert.ok(TREE_LEAF_FOV_BOOST >= TREE_FACE_FOV_BOOST);
});

test('closed hierarchy adds no depth FOV', () => {
  const state = createHierarchyRuntime();
  assert.equal(depthReadableFovBoost(state, 4), 4);
  assert.equal(depthReadableFaceScale(state), 1);
});

test('open parent + child adds face FOV', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(depthReadableFovBoost(state, 0), TREE_FACE_FOV_BOOST);
  assert.ok(depthReadableFaceScale(state) >= 1);
});

test('leaf adds stronger FOV', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusLeaf(state, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(depthReadableFovBoost(state, 0), TREE_LEAF_FOV_BOOST);
});

test('module and contract stay presentation-only', async () => {
  const src = await readFile(new URL('../public/hero-depth-readable-faces.js', import.meta.url), 'utf8');
  assert.match(src, /Depth-readable|TREE_FACE_FOV|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth/i);
  const contract = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md', import.meta.url),
    'utf8'
  );
  assert.match(contract, /Depth readability|readable/i);
});

test('hero-flex wires depth-readable FOV after apply', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });
  const flex = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(flex, /hero-depth-readable-faces|depthReadableFovBoost/);
});
