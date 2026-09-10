/**
 * V0.4 — Free orbit/zoom about subject while tree open (Vision).
 * Owner: Cam-3 shouldApplyTreeNav / poseAboutTreeCenter + flex applyNav/wheel · no new module.
 * presentation only · no 029-released claim · Issue #214
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  navAllowedOnOpenTree,
  shouldApplyTreeNav,
  poseAboutTreeCenter,
  V04_FREE_NAV_ON_OPEN_TREE,
} from '../public/hero-cam3-tree-center-zoom.js';
import { resolveSelectedSeatDock } from '../public/hero-cam5-selected-tree-center.js';
import { createHierarchyRuntime, openSeatShellParent } from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

test('V0.4 free nav on open tree is product-true', () => {
  assert.equal(navAllowedOnOpenTree(), true);
  assert.equal(V04_FREE_NAV_ON_OPEN_TREE, true);
});

test('V0.4 shouldApplyTreeNav true when parent open', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.equal(shouldApplyTreeNav(state), true);
});

test('V0.4 poseAboutTreeCenter keeps look-at under zoom and yaw', () => {
  const base = { p: [5, 2.3, 5], t: [3, 0.95, 0], f: 36 };
  const a = poseAboutTreeCenter(base, { navZoom: 1, navOrbitYaw: 0, navOrbitPitch: 0 });
  const b = poseAboutTreeCenter(base, { navZoom: 1.4, navOrbitYaw: 0.35, navOrbitPitch: 0.1 });
  assert.deepEqual(a.t, base.t);
  assert.deepEqual(b.t, base.t);
  assert.ok(Math.hypot(b.p[0] - a.p[0], b.p[2] - a.p[2]) > 0.01 || Math.abs(b.p[1] - a.p[1]) > 0.01);
});

test('V0.4 subject dock + pose still faces seat not origin', () => {
  const dock = resolveSelectedSeatDock('SEAT_CLOSE', 1, 4, { seatRadius: 5 }, { force: true });
  assert.ok(dock);
  const posed = poseAboutTreeCenter(dock, { navZoom: 1.2, navOrbitYaw: 0.2, navOrbitPitch: 0 });
  assert.deepEqual(posed.t, dock.t);
  assert.ok(Math.hypot(posed.t[0], posed.t[2]) > 1);
});

test('V0.4 flex wheel is not blocked by openParentId hard return', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  const wheelIdx = src.indexOf("canvas.addEventListener('wheel'");
  assert.ok(wheelIdx > 0);
  const snippet = src.slice(wheelIdx, wheelIdx + 450);
  assert.doesNotMatch(snippet, /if\s*\(\s*hierarchyRuntime\.openParentId\s*\)\s*return/);
  assert.match(snippet, /applyNavCamera/);
});

test('V0.4 flex applyNavCamera uses shouldApplyTreeNav + poseAboutTreeCenter', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /function applyNavCamera\(\)[\s\S]*shouldApplyTreeNav/);
  assert.match(src, /poseAboutTreeCenter\(base,\s*\{\s*navZoom,\s*navOrbitYaw,\s*navOrbitPitch\s*\}\)/);
});
