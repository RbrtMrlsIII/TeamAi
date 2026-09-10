import test from 'node:test';
import assert from 'node:assert/strict';
import {
  seatAngle,
  seatWorldTarget,
  dockTowardSeat,
  resolveSelectedSeatDock,
} from '../public/hero-cam5-selected-tree-center.js';

test('seat 0 is on -Z for count 4', () => {
  const t = seatWorldTarget(0, 4, 5);
  assert.ok(Math.abs(t[0]) < 1e-9);
  assert.ok(Math.abs(t[2] + 5) < 1e-9);
});

test('dock looks at seat not world origin', () => {
  const d = dockTowardSeat(1, 4, { seatRadius: 5 });
  assert.ok(Math.abs(d.t[0] - 5) < 1e-9);
  assert.ok(Math.abs(d.t[2]) < 1e-9);
  assert.ok(Math.hypot(d.p[0], d.p[2]) > Math.hypot(d.t[0], d.t[2]));
});

test('only seat cameras get Cam-5 dock', () => {
  assert.equal(resolveSelectedSeatDock('HERO_WIDE', 0, 4, { seatRadius: 5 }), null);
  assert.ok(resolveSelectedSeatDock('SEAT_CLOSE', 0, 4, { seatRadius: 5 }));
});
