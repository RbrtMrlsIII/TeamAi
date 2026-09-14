import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeatDivisionGeometry,
} from '../frontend/spatial/seat-division-geometry.js';
import {
  buildAdjacentDivisionWiring,
  adjacentDivisionWiringPoint,
} from '../frontend/spatial/seat-adjacent-division-wiring.js';

test('Seat-1 wiring is derived from stable semantic ports', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0 },
    angle: Math.PI,
    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },
  });
  const target = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0.95 },
    angle: -Math.PI / 2,
    payload: { labels: ['Behavior'], controls: ['configure'] },
  });

  const wiring = buildAdjacentDivisionWiring({ sourceGeometry: source, targetGeometry: target });

  assert.equal(wiring.semantic, 'ADJACENT_DIVISION_WIRING');
  assert.equal(wiring.from.divisionId, source.id);
  assert.equal(wiring.to.divisionId, target.id);
  assert.deepEqual(wiring.from.port, source.port);
  assert.deepEqual(wiring.to.port, target.port);

  const midpoint = adjacentDivisionWiringPoint(wiring, 0.5);
  assert.equal(typeof midpoint.x, 'number');
  assert.equal(typeof midpoint.y, 'number');
  assert.equal(typeof midpoint.z, 'number');
});
