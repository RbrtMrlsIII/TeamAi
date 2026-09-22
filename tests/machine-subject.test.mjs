import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveMachineSubject } from '../frontend/spatial/machine-subject.js';
import { deriveMachineSubject as legacyDeriveMachineSubject } from '../frontend/spatial/machine-hero-scene.js';

const parts = [
  { id: 'part-a', center: { x: -1, y: 0.5, z: 0.2 }, dimensions: { x: 2, y: 1, z: 1.4 } },
  { id: 'part-b', center: { x: 1.25, y: 0.75, z: -0.4 }, dimensions: { x: 1.6, y: 0.8, z: 1.2 } },
];

test('neutral machine subject owner derives deterministic bounds from semantic geometry', () => {
  const subject = deriveMachineSubject(parts, 0.12);
  assert.deepEqual(subject, {
    kind: 'semantic-subject',
    sourcePartIds: ['part-a', 'part-b'],
    min: { x: -2.12, y: -0.12, z: -1.12 },
    max: { x: 2.17, y: 1.37, z: 0.9 },
    center: { x: 0.025, y: 0.625, z: -0.11 },
  });
});

test('legacy scene surface re-exports the neutral subject owner without changing behavior', () => {
  assert.deepEqual(legacyDeriveMachineSubject(parts, 0.12), deriveMachineSubject(parts, 0.12));
});

test('empty semantic subject remains fail-closed', () => {
  assert.equal(deriveMachineSubject([]), null);
  assert.equal(deriveMachineSubject(null), null);
});
