import test from 'node:test';
import assert from 'node:assert/strict';
import { EPSILON, finite, pointEqual } from '../frontend/spatial/machine-geometry-primitives.js';

test('finite rejects non-numeric and NaN values', () => {
  assert.equal(finite(1), true);
  assert.equal(finite('2'), true);
  assert.equal(finite(NaN), false);
  assert.equal(finite(undefined), false);
});

test('pointEqual is true within EPSILON and false beyond it', () => {
  const a = { x: 0, y: 0, z: 0 };
  const within = { x: EPSILON / 2, y: 0, z: 0 };
  const beyond = { x: 1, y: 0, z: 0 };
  assert.equal(pointEqual(a, within), true);
  assert.equal(pointEqual(a, beyond), false);
});

test('pointEqual is false when a coordinate is non-finite', () => {
  assert.equal(pointEqual({ x: NaN, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), false);
});
