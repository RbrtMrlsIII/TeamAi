/**
 * Cam-5/6 selected seat look-at — presentation only · Issue #212
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  seatAngle,
  seatWorldTarget,
  dockTowardSeat,
  resolveSelectedSeatDock,
  shouldCenterOnSelectedSeat,
  isSeatShellOpen,
} from '../public/hero-cam5-selected-tree-center.js';

test('dock looks at seat not world origin', () => {
  const d = dockTowardSeat(1, 4, { seatRadius: 5 });
  assert.ok(Math.abs(d.t[0] - 5) < 1e-9 || Math.abs(d.t[0]) > 0.1);
  assert.ok(Math.abs(d.t[0]) > 0.01 || Math.abs(d.t[2]) > 0.01, 't not at origin xz');
  assert.notEqual(d.t[0], 0);
});

test('seat 0 vs seat 2 have different look-at', () => {
  const a = dockTowardSeat(0, 4, { seatRadius: 5 });
  const b = dockTowardSeat(2, 4, { seatRadius: 5 });
  // n=4: seat0 a=-π/2 → (0,-5); seat2 a=+π/2 → (0,+5) — differ on Z
  assert.ok(Math.abs(a.t[2] - b.t[2]) > 1, 'look-at Z must differ between opposite seats');
  const c = dockTowardSeat(1, 4, { seatRadius: 5 });
  assert.ok(Math.abs(c.t[0]) > 1, 'seat 1 looks along +X');
});

test('resolveSelectedSeatDock null for HERO_WIDE without force', () => {
  assert.equal(resolveSelectedSeatDock('HERO_WIDE', 0, 4, { seatRadius: 5 }), null);
  assert.ok(resolveSelectedSeatDock('SEAT_CLOSE', 0, 4, { seatRadius: 5 }));
});

test('Cam-6 force centers HERO_WIDE while hierarchy open', () => {
  const d = resolveSelectedSeatDock('HERO_WIDE', 1, 4, { seatRadius: 5 }, { force: true });
  assert.ok(d);
  assert.ok(Math.abs(d.t[0]) > 0.01 || Math.abs(d.t[2]) > 0.01);
});

test('Cam-6 hierarchyOpen forces seat dock', () => {
  const d = resolveSelectedSeatDock('TEAM_ORBIT', 0, 4, { seatRadius: 4.25 }, { hierarchyOpen: true });
  assert.ok(d);
  assert.ok(Math.abs(d.t[0]) > 0.5 || Math.abs(d.t[2]) > 0.5);
});

test('isSeatShellOpen detects seat parent ids', () => {
  assert.equal(isSeatShellOpen(null), false);
  assert.equal(isSeatShellOpen('SEAT_SHELL:0'), true);
  assert.equal(isSeatShellOpen('SEAT_SHELL_0'), true);
});

test('shouldCenterOnSelectedSeat only named docks without force', () => {
  assert.equal(shouldCenterOnSelectedSeat('SEAT_CLOSE'), true);
  assert.equal(shouldCenterOnSelectedSeat('DETAIL_ANCHOR'), true);
  assert.equal(shouldCenterOnSelectedSeat('HERO_WIDE'), false);
});

test('seatAngle matches buildSeats formula', () => {
  assert.ok(Math.abs(seatAngle(0, 4) - (-Math.PI / 2)) < 1e-12);
  assert.ok(Math.abs(seatAngle(1, 4) - (-Math.PI / 2 + Math.PI / 2)) < 1e-12);
});
