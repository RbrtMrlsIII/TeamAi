import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  resolveSelectedSeatDock,
  shouldCenterOnSelectedSeat,
  isSeatShellOpen,
} from '../public/hero-cam5-selected-tree-center.js';

test('CAM-R1: SEAT_CLOSE docks toward selected seat, not world origin', () => {
  const d0 = resolveSelectedSeatDock('SEAT_CLOSE', 0, 4, { seatRadius: 4.25 });
  const d2 = resolveSelectedSeatDock('SEAT_CLOSE', 2, 4, { seatRadius: 4.25 });
  assert.ok(d0 && d2);
  assert.notDeepEqual(d0.t, [0, 0.95, 0]);
  assert.notDeepEqual(d0.t, d2.t);
});

test('CAM-R1: closed hierarchy HERO_WIDE does not force seat dock', () => {
  assert.equal(resolveSelectedSeatDock('HERO_WIDE', 1, 4, { seatRadius: 4.25 }), null);
});

test('CAM-R1: shell open forces subject-lock even for HERO_WIDE id', () => {
  const d = resolveSelectedSeatDock('HERO_WIDE', 1, 4, { seatRadius: 4.25 }, { force: true });
  assert.ok(d);
  assert.ok(Math.hypot(d.t[0], d.t[2]) > 1);
});

test('CAM-R1: does not authorize TURN_FOLLOW or HERO_LOW_ORBIT', () => {
  assert.equal(shouldCenterOnSelectedSeat('TURN_FOLLOW'), false);
  assert.equal(shouldCenterOnSelectedSeat('HERO_LOW_ORBIT'), false);
});

test('CAM-R1: applied flex uses SEAT_CLOSE on next-seat-focus (not TEAM_ORBIT/TURN_FOLLOW)', () => {
  spawnSync('node', ['scripts/apply-cam2-tree-follow-flex.mjs'], { stdio: 'pipe', encoding: 'utf8' });
  return readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8').then((flex) => {
    assert.match(flex, /next-seat-focus'\);setCamera\('SEAT_CLOSE'\)/);
    assert.doesNotMatch(flex, /next-seat-focus'\);setCamera\('TEAM_ORBIT'\)/);
    assert.doesNotMatch(flex, /setCamera\('TURN_FOLLOW'\)/);
    assert.match(flex, /function retargetSubjectLock/);
    assert.match(flex, /function setSelectedSeat/);
  });
});

test('CAM-R1: isSeatShellOpen gates forced subject', () => {
  assert.equal(isSeatShellOpen('SEAT_SHELL:0'), true);
  assert.equal(isSeatShellOpen(null), false);
});
