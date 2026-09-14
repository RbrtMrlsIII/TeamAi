import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeatDivisionGeometry } from '../frontend/spatial/seat-division-geometry.js';
import {
  buildAdjacentDivisionWiring,
  adjacentDivisionWiringLength,
  adjacentDivisionWiringPoint,
} from '../frontend/spatial/seat-adjacent-division-wiring.js';

test('adjacent division wiring uses semantic ports from both divisions', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0 },
    angle: Math.PI,
    payload: { labels: ['Connection'], controls: ['configure'] },
  });
  const target = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0.9 },
    angle: -Math.PI / 2,
    payload: { labels: ['Behavior'], controls: ['configure'] },
  });

  const wiring = buildAdjacentDivisionWiring({ sourceGeometry: source, targetGeometry: target });

  assert.equal(wiring.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING');
  assert.equal(wiring.from.divisionId, source.id);
  assert.equal(wiring.to.divisionId, target.id);
  assert.deepEqual(wiring.corridor.reservedFor, ['source-division', 'target-division']);
  assert.equal(wiring.presentationOnly, true);
  assert.ok(adjacentDivisionWiringLength(wiring) > 0);

  const midpoint = adjacentDivisionWiringPoint(wiring, 0.5);
  assert.equal(typeof midpoint.x, 'number');
  assert.equal(typeof midpoint.y, 'number');
  assert.equal(typeof midpoint.z, 'number');
});

test('adjacent wiring endpoint follows a moved target semantic port', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0 },
    angle: Math.PI,
    payload: { labels: ['Connection'], controls: ['configure'] },
  });
  const compactTarget = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0.72 },
    angle: -Math.PI / 2,
    payload: { labels: ['Behavior'], controls: ['configure'] },
  });
  const expandedTarget = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0.98 },
    angle: -Math.PI / 2,
    payload: { labels: ['Behavior'], controls: ['configure'] },
  });

  const compactWiring = buildAdjacentDivisionWiring({ sourceGeometry: source, targetGeometry: compactTarget });
  const expandedWiring = buildAdjacentDivisionWiring({ sourceGeometry: source, targetGeometry: expandedTarget });

  assert.notDeepEqual(compactWiring.to.port, expandedWiring.to.port);
  assert.notEqual(adjacentDivisionWiringLength(compactWiring), adjacentDivisionWiringLength(expandedWiring));
});

test('adjacent division wiring fails closed without semantic ports', () => {
  assert.throws(
    () => buildAdjacentDivisionWiring({ sourceGeometry: {}, targetGeometry: {} }),
    /requires source and target semantic ports/,
  );
});
