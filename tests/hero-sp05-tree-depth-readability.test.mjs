/**
 * SP-05 — Tree depth / readability matrix (Gate S6).
 * Spatial execution basis · presentation only · no 029-released claim.
 *
 * For each SEAT_SHELL_V1 child: node → depth → dock → target → readable helpers.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
  focusChild,
  focusLeaf,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
} from '../public/hero-hierarchy-runtime.js';
import {
  resolveTreeCamera,
  TREE_CAMERA,
  WORLD_BASELINE_DOCK_ID,
} from '../public/hero-cam2-tree-follow.js';
import {
  TREE_FACE_FOV_BOOST,
  TREE_LEAF_FOV_BOOST,
  depthReadableFovBoost,
  depthReadableFaceScale,
  facePlateScaleForChild,
} from '../public/hero-depth-readable-faces.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Cam-2 detail children — must resolve DETAIL_ANCHOR when focused. */
const DETAIL_CHILDREN = new Set([
  HIERARCHY_PART.SEAT_CAPABILITIES,
  HIERARCHY_PART.SEAT_AUTHORIZATION,
  HIERARCHY_PART.SEAT_WORKSPACE_SCOPE,
  HIERARCHY_PART.SEAT_TASK_EVIDENCE,
  HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE,
  HIERARCHY_PART.SEAT_TOOLKIT,
]);

test('SP-05 seat grammar lists seven v1 children in product order', () => {
  assert.deepEqual(SEAT_SHELL_V1_CHILDREN, [
    HIERARCHY_PART.SEAT_CONNECTION,
    HIERARCHY_PART.SEAT_BEHAVIOR,
    HIERARCHY_PART.SEAT_TOOLKIT,
    HIERARCHY_PART.SEAT_CAPABILITIES,
    HIERARCHY_PART.SEAT_AUTHORIZATION,
    HIERARCHY_PART.SEAT_WORKSPACE_SCOPE,
    HIERARCHY_PART.SEAT_TASK_EVIDENCE,
  ]);
});

test('SP-05 closed machine → depth 0 world baseline', () => {
  const state = createHierarchyRuntime();
  const cam = resolveTreeCamera(state);
  assert.equal(cam.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(depthReadableFovBoost(state, 0), 0);
  assert.equal(depthReadableFaceScale(state), 1);
});

test('SP-05 open seat shell → depth 1 SEAT_CLOSE', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  const cam = resolveTreeCamera(state);
  assert.equal(cam.cameraId, TREE_CAMERA.SEAT_SHELL);
  assert.ok(state.openParentId);
  assert.ok(depthReadableFovBoost(state, 0) > 0);
});

test('SP-05 each v1 child maps to expected dock class', () => {
  for (const childId of SEAT_SHELL_V1_CHILDREN) {
    const state = createHierarchyRuntime();
    openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
    focusChild(state, childId);
    const cam = resolveTreeCamera(state);
    if (DETAIL_CHILDREN.has(childId)) {
      assert.equal(
        cam.cameraId,
        TREE_CAMERA.SEAT_CHILD_DETAIL,
        `${childId} should use DETAIL_ANCHOR`,
      );
    } else {
      assert.equal(
        cam.cameraId,
        TREE_CAMERA.SEAT_CHILD_NEAR,
        `${childId} should use near SEAT_CLOSE`,
      );
    }
    assert.equal(cam.treeCenter, childId);
    assert.equal(cam.inputHint, 'INSPECT');
  }
});

test('SP-05 focused child gets plate scale boost; sibling stays 1', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION);
  assert.ok(facePlateScaleForChild(state, HIERARCHY_PART.SEAT_CONNECTION) > 1);
  assert.equal(facePlateScaleForChild(state, HIERARCHY_PART.SEAT_BEHAVIOR), 1);
  assert.ok(depthReadableFaceScale(state) >= 1.04);
  assert.equal(depthReadableFovBoost(state, 0), TREE_FACE_FOV_BOOST);
});

test('SP-05 health leaf → depth 3 DETAIL + leaf FOV', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusLeaf(state, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  const cam = resolveTreeCamera(state);
  assert.equal(cam.cameraId, TREE_CAMERA.SEAT_CHILD_DETAIL);
  assert.equal(depthReadableFovBoost(state, 0), TREE_LEAF_FOV_BOOST);
  assert.ok(depthReadableFaceScale(state) >= 1.08);
});

test('SP-05 close returns depth 0 baseline', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION);
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  const cam = resolveTreeCamera(state);
  assert.equal(cam.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(depthReadableFovBoost(state, 0), 0);
});

test('SP-05 matrix document exists and names all v1 children', async () => {
  const doc = await readFile(
    join(root, 'docs/TEAMAI_3D_HERO_TREE_DEPTH_READABILITY_MATRIX.md'),
    'utf8',
  );
  assert.match(doc, /SP-05/);
  assert.match(doc, /Gate S6/);
  for (const id of SEAT_SHELL_V1_CHILDREN) {
    assert.match(doc, new RegExp(id));
  }
  assert.match(doc, /SEAT_CONNECTION_HEALTH_FACE/);
  assert.match(doc, /no 029-released/);
});

test('SP-05 modules remain presentation-only', async () => {
  for (const rel of [
    'public/hero-cam2-tree-follow.js',
    'public/hero-depth-readable-faces.js',
    'public/hero-hierarchy-runtime.js',
  ]) {
    const src = await readFile(join(root, rel), 'utf8');
    assert.doesNotMatch(src, /firestore|paypal|OAuth|scheduler/i);
  }
});
