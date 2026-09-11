import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  resolveSelectedSeatDock,
  dockTowardSeat,
} from '../public/hero-cam5-selected-tree-center.js';

test('CAM-R2: seat index change yields distinct subject docks', () => {
  const a = dockTowardSeat(0, 4, { seatRadius: 4.25 });
  const b = dockTowardSeat(1, 4, { seatRadius: 4.25 });
  assert.notDeepEqual(a.t, b.t);
  assert.notDeepEqual(a.p, b.p);
});

test('CAM-R2: closed HERO_WIDE remains unlocked (no forced dock)', () => {
  assert.equal(resolveSelectedSeatDock('HERO_WIDE', 0, 4, { seatRadius: 4.25 }), null);
});

test('CAM-R2: applied flex exports getSubjectLockSnapshot', () => {
  spawnSync('node', ['scripts/apply-cam2-tree-follow-flex.mjs'], { stdio: 'pipe' });
  spawnSync('node', ['scripts/apply-cam-r1-subject-lock.mjs'], { stdio: 'pipe' });
  return readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8').then((flex) => {
    assert.match(flex, /function getSubjectLockSnapshot/);
    assert.match(flex, /getSubjectLockSnapshot/);
    assert.doesNotMatch(flex, /setCamera\('TURN_FOLLOW'\)/);
  });
});
