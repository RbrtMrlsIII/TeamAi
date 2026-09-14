import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeatDivisionGeometry } from '../frontend/spatial/seat-division-geometry.js';
import {
  buildAdjacentDivisionExpansionEnvelope,
  adjacentExpansionCollidesWithCorridor,
  advanceAdjacentDivisionExpansion,
} from '../frontend/spatial/seat-adjacent-division-expansion.js';

function geometry(center, angle, labels) {
  return buildSeatDivisionGeometry({
    center,
    angle,
    payload: { labels, controls: ['configure'] },
  });
}

test('adjacent expansion derives both division envelopes from semantic geometry', () => {
  const source = geometry({ x: 1, y: 0.8, z: 0 }, Math.PI, ['Connection']);
  const target = geometry({ x: 1, y: 0.8, z: 0.9 }, -Math.PI / 2, ['Behavior']);
  const envelope = buildAdjacentDivisionExpansionEnvelope({
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 1,
    targetAmount: 1,
  });

  assert.equal(envelope.presentationOnly, true);
  assert.equal(envelope.sourceDivisionId, source.id);
  assert.equal(envelope.targetDivisionId, target.id);
  assert.equal(envelope.collisionRule, 'source-and-target-expanded-bounds-must-not-overlap-corridor');
  assert.equal(adjacentExpansionCollidesWithCorridor(envelope), false);
});

test('adjacent expansion moves source to compact while target opens', () => {
  const source = geometry({ x: 1, y: 0.8, z: 0 }, Math.PI, ['Connection']);
  const target = geometry({ x: 1, y: 0.8, z: 0.9 }, -Math.PI / 2, ['Behavior']);
  const base = buildAdjacentDivisionExpansionEnvelope({ sourceGeometry: source, targetGeometry: target });
  const halfway = advanceAdjacentDivisionExpansion(base, 120, 240);

  assert.equal(halfway.phase, 'OPENING_ADJACENT');
  assert.equal(halfway.sourceAmount, 0.5);
  assert.equal(halfway.targetAmount, 0.5);

  const done = advanceAdjacentDivisionExpansion(base, 240, 240);
  assert.equal(done.phase, 'ACTIVE');
  assert.equal(done.sourceAmount, 0);
  assert.equal(done.targetAmount, 1);
});

test('adjacent expansion fails closed without semantic ports', () => {
  assert.throws(
    () => buildAdjacentDivisionExpansionEnvelope({ sourceGeometry: {}, targetGeometry: {} }),
    /requires source and target semantic ports/,
  );
});
