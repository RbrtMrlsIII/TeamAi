import assert from 'node:assert/strict';
import test from 'node:test';
import {
  adjacentTransitionIdentity,
  buildAdjacentDivisionGeometry,
  buildAdjacentDivisionTransition,
  advanceAdjacentDivisionTransition,
} from '../frontend/spatial/seat-adjacent-transition.js';

test('adjacent transition identity is parameterized by Seat and branch pair', () => {
  assert.equal(
    adjacentTransitionIdentity({ seatIndex: 2, sourceDivisionId: 'SEAT_BEHAVIOR', targetDivisionId: 'SEAT_TOOLKIT' }),
    'TREE-HERO-SEAT#2:SEAT_BEHAVIOR:SEAT_TOOLKIT:ADJACENT_TRANSITION',
  );
});

test('adjacent transition composes independent semantic geometries', () => {
  const source = buildAdjacentDivisionGeometry({
    center: { x: 2, y: 0.8, z: -1 },
    angle: Math.PI,
    radialDistance: 2.2,
    payload: { labels: ['Behavior'], controls: ['defaults'] },
    workspaceTarget: { x: 0, y: 0.5, z: 0 },
    divisionId: 'TREE-HERO-SEAT#2:SEAT_BEHAVIOR:GEOMETRY',
  });
  const target = buildAdjacentDivisionGeometry({
    center: { x: 1.25, y: 1, z: 0.5 },
    angle: -Math.PI / 2,
    radialDistance: 1.4,
    payload: { labels: ['Toolkit'], controls: ['configure'] },
    workspaceTarget: { x: 0, y: 0.5, z: 0 },
    divisionId: 'TREE-HERO-SEAT#2:SEAT_TOOLKIT:GEOMETRY',
  });

  const transition = buildAdjacentDivisionTransition({
    seatIndex: 2,
    sourceDivisionId: 'SEAT_BEHAVIOR',
    targetDivisionId: 'SEAT_TOOLKIT',
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 1,
    targetAmount: 0,
  });

  assert.equal(transition.seatIndex, 2);
  assert.equal(transition.sourceDivisionId, 'SEAT_BEHAVIOR');
  assert.equal(transition.targetDivisionId, 'SEAT_TOOLKIT');
  assert.equal(transition.expansion.sourceDivisionId, 'SEAT_BEHAVIOR');
  assert.equal(transition.expansion.targetDivisionId, 'SEAT_TOOLKIT');
  assert.equal(transition.wiring.from.divisionId, source.id);
  assert.equal(transition.wiring.to.divisionId, target.id);
  assert.equal(transition.wiring.from.port.x, source.port.x);
  assert.equal(transition.wiring.to.port.z, target.port.z);
  assert.equal(transition.presentationOnly, true);
});

test('adjacent transition keeps the source-before-target sequencing contract', () => {
  const source = buildAdjacentDivisionGeometry({
    divisionId: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },
  });
  const target = buildAdjacentDivisionGeometry({
    divisionId: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
    payload: { labels: ['Behavior'], controls: ['configure'] },
  });
  const initial = buildAdjacentDivisionTransition({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 1,
    targetAmount: 0,
  });

  assert.equal(initial.wiring.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING');
  assert.equal(initial.wiring.from.divisionId, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY');
  assert.equal(initial.wiring.to.divisionId, 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY');

  const early = advanceAdjacentDivisionTransition(initial, 120);
  assert.equal(early.sourceAmount, 0.5);
  assert.equal(early.targetAmount, 0);
  assert.equal(early.phase, 'CLOSING_SOURCE');
  assert.equal(early.wiring.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING');

  const late = advanceAdjacentDivisionTransition(initial, 360);
  assert.equal(late.sourceAmount, 0);
  assert.equal(late.targetAmount, 0.5);
  assert.equal(late.phase, 'OPENING_ADJACENT');
  assert.equal(late.wiring.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING');
});

test('adjacent transition fails closed when geometry or identity is missing', () => {
  assert.throws(
    () => buildAdjacentDivisionTransition({ sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_BEHAVIOR' }),
    /requires source and target geometry/,
  );
  assert.throws(
    () => buildAdjacentDivisionGeometry({ payload: { labels: ['Connection'] } }),
    /requires a division identity/,
  );
});
