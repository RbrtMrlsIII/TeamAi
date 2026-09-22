import assert from 'node:assert/strict';
import test from 'node:test';
import {
  electricalRouteLength,
  electricalRoutePoint,
  electricalRoutePrefix,
  normalizeElectricalRoute,
  resolveElectricalEdgeRoute,
} from '../frontend/spatial/machine-energy-flow.js';

const route = [
  { x: 0, y: 0, z: 0 },
  { x: 3, y: 0, z: 0 },
  { x: 3, y: 4, z: 0 },
];

test('electrical route sampling follows the declared polyline', () => {
  assert.deepEqual(normalizeElectricalRoute(route).length, 3);
  assert.equal(electricalRouteLength(route), 7);
  assert.deepEqual(electricalRoutePoint(route, 0), route[0]);
  assert.deepEqual(electricalRoutePoint(route, 3 / 7), { x: 3, y: 0, z: 0 });
  assert.deepEqual(electricalRoutePoint(route, 1), route[2]);
});

test('electrical route prefix never invents coordinates outside the edge', () => {
  const prefix = electricalRoutePrefix(route, 0.5);
  assert.equal(prefix.length, 3);
  assert.deepEqual(prefix.at(-1), { x: 3, y: 0.5, z: 0 });
});

test('invalid electrical route fails closed', () => {
  assert.equal(resolveElectricalEdgeRoute({ route: [{ x: 0, y: 0, z: 0 }, { x: NaN, y: 0, z: 0 }] }).length, 0);
  assert.equal(resolveElectricalEdgeRoute({}).length, 0);
});


test('electrical prefixes can be bounded by semantic activation', () => {
  assert.deepEqual(electricalRoutePrefix(route, 0), [route[0]]);
  assert.deepEqual(electricalRoutePoint(route, 1), route.at(-1));
});
