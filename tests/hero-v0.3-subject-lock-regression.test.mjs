/**
 * V0.3 — Subject-lock regression (Vision): selected tree look-at, not world center.
 * Owner: Cam-5/6 resolveSelectedSeatDock + apply-cam2 wire · no new camera module.
 * presentation only · no 029-released claim · Issue #214
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  resolveSelectedSeatDock,
  dockTowardSeat,
  isSeatShellOpen,
} from '../public/hero-cam5-selected-tree-center.js';
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

const profile = { seatRadius: 5 };

test('V0.3 seat 0 vs seat 2 look-at differ under force (not shared world origin)', () => {
  const a = resolveSelectedSeatDock('SEAT_CLOSE', 0, 4, profile, { force: true });
  const b = resolveSelectedSeatDock('SEAT_CLOSE', 2, 4, profile, { force: true });
  assert.ok(a && b);
  assert.ok(Math.abs(a.t[0] - b.t[0]) > 0.5 || Math.abs(a.t[2] - b.t[2]) > 0.5);
  assert.ok(Math.hypot(a.t[0], a.t[2]) > 1);
  assert.ok(Math.hypot(b.t[0], b.t[2]) > 1);
});

test('V0.3 closed hierarchy: HERO_WIDE does not force seat dock', () => {
  assert.equal(resolveSelectedSeatDock('HERO_WIDE', 0, 4, profile), null);
  const state = createHierarchyRuntime();
  assert.equal(resolveTreeCamera(state).cameraId, WORLD_BASELINE_DOCK_ID);
});

test('V0.3 open shell: force look-at stays off origin even for HERO_WIDE id', () => {
  const d = resolveSelectedSeatDock('HERO_WIDE', 1, 4, profile, { force: true });
  assert.ok(d);
  assert.ok(Math.hypot(d.t[0], d.t[2]) > 1, 'forced open must not look at origin');
});

test('V0.3 isSeatShellOpen gates product subject', () => {
  assert.equal(isSeatShellOpen(null), false);
  assert.equal(isSeatShellOpen('SEAT_SHELL:2'), true);
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 2, { snap: true, nowMs: 0 });
  assert.equal(isSeatShellOpen(state.openParentId), true);
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  assert.equal(isSeatShellOpen(state.openParentId), false);
});

test('V0.3 applied flex still wires force seatDock (Cam-6 + V0.2 coexist)', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /force:\s*true/);
  assert.match(src, /seatDock/);
  assert.match(src, /resolveSelectedSeatDock/);
  assert.match(src, /WORLD_BASELINE_DOCK_ID|V0\.2 return baseline/);
});

test('V0.3 dockTowardSeat never uses world-origin look-at for ring seats', () => {
  for (let i = 0; i < 4; i++) {
    const d = dockTowardSeat(i, 4, profile);
    assert.ok(Math.hypot(d.t[0], d.t[2]) > 0.5, `seat ${i} t on ring`);
  }
});
