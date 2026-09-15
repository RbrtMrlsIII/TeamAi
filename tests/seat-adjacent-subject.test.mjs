import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeatDivisionGeometry } from '../frontend/spatial/seat-division-geometry.js';
import { buildAdjacentDivisionExpansionEnvelope } from '../frontend/spatial/seat-adjacent-division-expansion.js';
import { buildAdjacentDivisionWiring } from '../frontend/spatial/seat-adjacent-division-wiring.js';
import { buildAdjacentDivisionSubject } from '../frontend/spatial/seat-adjacent-subject.js';
import { buildAdjacentDivisionTransition } from '../frontend/spatial/seat-adjacent-transition.js';

function pair(targetZ = 0.9) {
  const source = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: 0 },
    angle: Math.PI,
    payload: { labels: ['Connection'], controls: ['configure'] },
    id: 'SEAT_CONNECTION',
  });
  const target = buildSeatDivisionGeometry({
    center: { x: 1, y: 0.8, z: targetZ },
    angle: -Math.PI / 2,
    payload: { labels: ['Behavior'], controls: ['configure'] },
    id: 'SEAT_BEHAVIOR',
  });
  return { source, target };
}

test('transition exposes one canonical semantic subject', () => {
  const { source, target } = pair();
  const transition = buildAdjacentDivisionTransition({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 0,
    targetAmount: 1,
  });

  assert.equal(transition.sourcePort.x, source.port.x);
  assert.equal(transition.targetPort.z, target.port.z);
  assert.equal(transition.subject.basis, 'transition-geometry');
  assert.equal(transition.subject.wiringId, transition.wiring.id);
  assert.equal(transition.subject.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:SEAT_BEHAVIOR:SUBJECT');
});

test('subject footprint follows mutated semantic geometry', () => {
  const first = pair(0.8);
  const second = pair(1.1);
  const firstExpansion = buildAdjacentDivisionExpansionEnvelope({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: first.source,
    targetGeometry: first.target,
    sourceAmount: 0,
    targetAmount: 1,
  });
  const secondExpansion = buildAdjacentDivisionExpansionEnvelope({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: second.source,
    targetGeometry: second.target,
    sourceAmount: 0,
    targetAmount: 1,
  });
  const firstWiring = buildAdjacentDivisionWiring({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: first.source,
    targetGeometry: first.target,
    amount: 0,
  });
  const secondWiring = buildAdjacentDivisionWiring({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: second.source,
    targetGeometry: second.target,
    amount: 0,
  });

  const a = buildAdjacentDivisionSubject({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: first.source,
    targetGeometry: first.target,
    expansion: firstExpansion,
    wiring: firstWiring,
  });
  const b = buildAdjacentDivisionSubject({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: second.source,
    targetGeometry: second.target,
    expansion: secondExpansion,
    wiring: secondWiring,
  });

  assert.notEqual(a.center.z, b.center.z);
  assert.notEqual(a.bounds.maxZ, b.bounds.maxZ);
});

test('subject remains attached to the active source while target is closed', () => {
  const { source, target } = pair();
  const transition = buildAdjacentDivisionTransition({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 1,
    targetAmount: 0,
  });

  assert.deepEqual(transition.subject.sourcePort, source.port);
  assert.deepEqual(transition.subject.targetPort, target.port);
  assert.equal(transition.subject.center.x, source.center.x);
  assert.equal(transition.subject.center.z, source.center.z);
});

test('semantic subject fails closed when geometry or ports are absent', () => {
  assert.throws(
    () => buildAdjacentDivisionSubject({
      sourceDivisionId: 'SEAT_CONNECTION',
      targetDivisionId: 'SEAT_BEHAVIOR',
      sourceGeometry: {},
      targetGeometry: {},
    }),
    /requires source and target geometry/,
  );

  const valid = pair();
  delete valid.target.port;
  assert.throws(
    () => buildAdjacentDivisionSubject({
      sourceDivisionId: 'SEAT_CONNECTION',
      targetDivisionId: 'SEAT_BEHAVIOR',
      sourceGeometry: valid.source,
      targetGeometry: valid.target,
    }),
    /requires source and target semantic ports/,
  );
});
