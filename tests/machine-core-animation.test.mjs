import assert from 'node:assert/strict';
import test from 'node:test';
import { createMachineAnimation, deriveAnimationFrame, interpolateBranchRadius } from '../frontend/spatial/machine-core-animation.js';
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

test('animation frame annotates every module without changing identity', () => {
  const core = createBranchConnectionCore();
  const frame = deriveAnimationFrame(core, 0.5);
  assert.equal(frame.parts.length, 15);
  assert.deepEqual(frame.parts.map((part) => part.branchId), core.parts.map((part) => part.branchId));
  assert.equal(frame.parts.filter((part) => part.kind === 'hub')[0].animationAmount, undefined);
  assert.ok(frame.parts.filter((part) => part.kind !== 'hub').every((part) => part.animationAmount === 0.5));
});
