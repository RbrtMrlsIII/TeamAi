import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from '../frontend/spatial/seat-adjacent-division-wiring.js';
import { buildSeatDivisionGeometry } from '../frontend/spatial/seat-division-geometry.js';

test('Seat-1 adjacent wiring derives its source and target from semantic geometry ports', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 2, y: 0.8, z: -1 },
    angle: Math.PI,
    radialDistance: 2.2,
    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },
    workspaceTarget: { x: 0, y: 0.5, z: 0 },
  });
  const target = buildSeatDivisionGeometry({
    center: { x: 1.25, y: 1, z: 0.5 },
    angle: -Math.PI / 2,
    radialDistance: 1.4,
    payload: { labels: ['Behavior'], controls: ['defaults'] },
    workspaceTarget: { x: 0, y: 0.5, z: 0 },
  });

  const wiring = buildAdjacentDivisionWiring({ sourceGeometry: source, targetGeometry: target, amount: 1 });
  assert.equal(wiring.semantic, 'ADJACENT_DIVISION_WIRING');
  assert.equal(wiring.from.divisionId, source.id);
  assert.equal(wiring.to.divisionId, target.id);
  assert.deepEqual(wiring.to.port, target.port);

  const midpoint = adjacentDivisionWiringPoint(wiring, 0.5);
  assert.equal(typeof midpoint.x, 'number');
  assert.equal(typeof midpoint.y, 'number');
  assert.equal(typeof midpoint.z, 'number');
});

test('Seat-1 adjacent wiring fails closed when a semantic port is missing', () => {
  assert.throws(
    () => buildAdjacentDivisionWiring({ sourceGeometry: { id: 'connection' }, targetGeometry: { id: 'behavior' } }),
    /requires source and target semantic ports/,
  );
});
