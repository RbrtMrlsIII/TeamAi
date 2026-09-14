import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAdjacentDivisionWiring,
  buildAdjacentDivisionWiringFrame,
} from '../frontend/spatial/seat-adjacent-division-wiring.js';

test('adjacent wiring frame keeps target closed during source compaction', () => {
  const wiring = buildAdjacentDivisionWiring({
    sourceGeometry: {
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION',
      port: { x: 0.5, y: 0.8, z: 0 },
    },
    targetGeometry: {
      id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR',
      port: { x: 0.5, y: 0.8, z: 0.5 },
    },
  });

  const frame = buildAdjacentDivisionWiringFrame({
    wiring,
    sourceAmount: 0.5,
    targetAmount: 0,
    phase: 'CLOSING_SOURCE',
  });

  assert.equal(frame.phase, 'CLOSING_SOURCE');
  assert.equal(frame.sourceAmount, 0.5);
  assert.equal(frame.targetAmount, 0);
  assert.equal(frame.activeTarget, false);
  assert.equal(frame.presentationOnly, true);
});

test('adjacent wiring frame follows the target after source compaction', () => {
  const wiring = buildAdjacentDivisionWiring({
    sourceGeometry: {
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION',
      port: { x: 0.5, y: 0.8, z: 0 },
    },
    targetGeometry: {
      id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR',
      port: { x: 0.5, y: 0.8, z: 0.5 },
    },
  });

  const frame = buildAdjacentDivisionWiringFrame({
    wiring,
    sourceAmount: 0,
    targetAmount: 0.5,
    phase: 'OPENING_ADJACENT',
  });

  assert.equal(frame.phase, 'OPENING_ADJACENT');
  assert.equal(frame.sourceAmount, 0);
  assert.equal(frame.targetAmount, 0.5);
  assert.equal(frame.activeTarget, true);
  assert.equal(frame.to.x, 0.5);
  assert.equal(frame.to.z, 0.5);
});

test('adjacent wiring frame fails closed without semantic endpoints', () => {
  assert.equal(
    buildAdjacentDivisionWiringFrame({ phase: 'CLOSING_SOURCE' }),
    null,
  );
});
