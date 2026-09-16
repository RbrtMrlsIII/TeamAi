import assert from 'node:assert/strict';
import test from 'node:test';
import { createMachineAnimation, deriveAnimationFrame, interpolateBranchRadius, interpolateCamera } from '../frontend/spatial/machine-core-animation.js';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';

test('machine animation opens and closes continuously', () => {
  const animation = createMachineAnimation({ duration: 1000 });
  animation.restart(0);
  animation.setTarget('expanded');
  const opening = animation.sample(500);
  assert.equal(opening.state, 'opening');
  assert.ok(opening.amount > 0 && opening.amount < 1);
  const open = animation.sample(1000);
  assert.equal(open.state, 'expanded');
  assert.equal(open.amount, 1);
  animation.setTarget('collapsed');
  animation.restart(1000);
  const closing = animation.sample(1500);
  assert.equal(closing.state, 'closing');
  assert.ok(closing.amount > 0 && closing.amount < 1);
  const closed = animation.sample(2000);
  assert.equal(closed.state, 'collapsed');
  assert.equal(closed.amount, 0);
});

test('interrupted animation reverses from its current physical amount', () => {
  const animation = createMachineAnimation({ duration: 1000 });
  animation.restart(0);
  animation.setTarget('expanded');
  const midOpen = animation.sample(400);
  assert.equal(midOpen.state, 'opening');
  assert.ok(midOpen.amount > 0 && midOpen.amount < 1);
  animation.setTarget('collapsed');
  animation.restart(400);
  const midClose = animation.sample(650);
  assert.equal(midClose.state, 'closing');
  assert.ok(midClose.amount < midOpen.amount);
  const closed = animation.sample(1400);
  assert.equal(closed.state, 'collapsed');
  assert.equal(closed.amount, 0);
});

test('radius interpolation is deterministic', () => {
  assert.equal(interpolateBranchRadius(4, 8, 0), 4);
  assert.equal(interpolateBranchRadius(4, 8, 0.5), 6);
  assert.equal(interpolateBranchRadius(4, 8, 1), 8);
});

test('semantic camera handoff interpolates movement while retaining destination identity', () => {
  const from = { cameraId: 'BRANCH_CAMERA_HUB-CORE', branchId: 'HUB-CORE', role: 'hub', fov: 38, position: { x: 10, y: 5, z: 0 }, target: { x: 0, y: 0, z: 0 } };
  const to = { cameraId: 'BRANCH_CAMERA_BRANCH-SEAT-06', branchId: 'BRANCH-SEAT-06', role: 'branch', fov: 34, position: { x: -2, y: 3, z: 8 }, target: { x: -1, y: 0.6, z: 3 } };
  const mid = interpolateCamera(from, to, 0.5);
  assert.equal(mid.cameraId, to.cameraId);
  assert.equal(mid.branchId, to.branchId);
  assert.ok(mid.position.x > to.position.x && mid.position.x < from.position.x);
  assert.ok(mid.target.z > from.target.z && mid.target.z < to.target.z);
  const end = interpolateCamera(from, to, 1);
  assert.deepEqual(end.position, to.position);
  assert.deepEqual(end.target, to.target);
  assert.equal(end.fov, to.fov);
});

test('animation frame annotates every module without changing identity', () => {
  const core = createBranchConnectionCore();
  const frame = deriveAnimationFrame(core, 0.5);
  assert.equal(frame.parts.length, 15);
  assert.deepEqual(frame.parts.map((part) => part.branchId), core.parts.map((part) => part.branchId));
  assert.equal(frame.parts.filter((part) => part.kind === 'hub')[0].animationAmount, undefined);
  assert.ok(frame.parts.filter((part) => part.kind !== 'hub').every((part) => part.animationAmount === 0.5));
});