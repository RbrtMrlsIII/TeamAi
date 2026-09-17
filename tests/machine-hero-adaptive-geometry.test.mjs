import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveMachineExpansionProfile, interpolateMachineDimensions, deriveExpansionShift } from '../frontend/spatial/machine-hero-adaptive-geometry.js';

const connection = {
  semanticId: 'SEAT_CONNECTION',
  dimensions: { x: 1.8, y: 0.8, z: 1.2 },
  payload: { labels: ['Connection', 'Provider health'], controls: 2, density: 2 },
};

const heavy = {
  ...connection,
  payload: { labels: ['Connection', 'Provider health', 'OAuth', 'Runtime', 'Health test'], controls: 7, density: 9 },
};

test('expansion profile is payload-sensitive', () => {
  const a = deriveMachineExpansionProfile(connection, { clearance: 0.16 });
  const b = deriveMachineExpansionProfile(heavy, { clearance: 0.16 });
  assert.ok(b.expanded.x > a.expanded.x);
  assert.ok(b.expanded.y > a.expanded.y);
  assert.ok(b.expanded.z > a.expanded.z);
  assert.notEqual(a.contentLoad, b.contentLoad);
});

test('interpolation preserves collapsed geometry at zero and expanded geometry at one', () => {
  const profile = deriveMachineExpansionProfile(connection, { clearance: 0.2 });
  assert.deepEqual(interpolateMachineDimensions(profile, 0), profile.collapsed);
  assert.deepEqual(interpolateMachineDimensions(profile, 1), profile.expanded);
});

test('expansion shift includes actual envelope delta and configured clearance', () => {
  const profile = deriveMachineExpansionProfile(connection, { clearance: 0.2 });
  const shift = deriveExpansionShift(profile, { direction: 1, axis: 'x' });
  const expected = (profile.expanded.x - profile.collapsed.x) / 2 + 0.2;
  assert.equal(shift.x, expected);
  assert.equal(shift.z, 0);
});

test('reverse direction mirrors x shift', () => {
  const profile = deriveMachineExpansionProfile(connection, { clearance: 0.2 });
  const forward = deriveExpansionShift(profile, { direction: 1, axis: 'x' });
  const reverse = deriveExpansionShift(profile, { direction: -1, axis: 'x' });
  assert.equal(reverse.x, -forward.x);
});
