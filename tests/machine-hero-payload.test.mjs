import assert from 'node:assert/strict';
import test from 'node:test';
import { createMachineTransitionFromPayload, deriveMachinePartFromPayload, deriveMachinePartsFromPayload } from '../frontend/spatial/machine-hero-payload.js';

test('payload density produces geometry without camera authority', () => {
  const compact = deriveMachinePartFromPayload({ id: 'a', semanticId: 'SEAT_CONNECTION', labels: ['Connection'], controls: 1, density: 1 });
  const dense = deriveMachinePartFromPayload({ id: 'b', semanticId: 'SEAT_CONNECTION', labels: ['Connection', 'Provider', 'Health'], controls: 4, density: 8 });
  assert.ok(dense.dimensions.x > compact.dimensions.x);
  assert.ok(dense.dimensions.y > compact.dimensions.y);
  assert.ok(dense.dimensions.z > compact.dimensions.z);
  assert.deepEqual(dense.port, null);
});

test('source/target payload factory returns two semantic machine parts', () => {
  const parts = deriveMachinePartsFromPayload({ source: { id: 'a', semanticId: 'SEAT_CONNECTION', labels: ['Connection'] }, target: { id: 'b', semanticId: 'SEAT_BEHAVIOR', labels: ['Behavior', 'Defaults'], controls: 2 } });
  assert.equal(parts.length, 2);
  assert.equal(parts[0].semanticId, 'SEAT_CONNECTION');
  assert.equal(parts[1].semanticId, 'SEAT_BEHAVIOR');
  assert.ok(parts[1].dimensions.x > parts[0].dimensions.x);
  assert.equal(Object.isFrozen(parts), true);
});

test('payload transition preserves semantic identities and derives wiring', () => {
  const transition = createMachineTransitionFromPayload({ seatIndex: 0, source: { id: 'a', semanticId: 'SEAT_CONNECTION', center: { x: -1, y: .5, z: 0 }, port: { x: 0, y: .5, z: 0 }, labels: ['Connection'] }, target: { id: 'b', semanticId: 'SEAT_BEHAVIOR', center: { x: 1.4, y: .5, z: .6 }, port: { x: 1, y: .5, z: .6 }, labels: ['Behavior', 'Defaults'], controls: 2 }, wiring: { id: 'payload-wire' } });
  assert.equal(transition.sourceDivisionId, 'SEAT_CONNECTION');
  assert.equal(transition.targetDivisionId, 'SEAT_BEHAVIOR');
  assert.equal(transition.wiring.id, 'payload-wire');
  assert.deepEqual(transition.wiring.sourcePort, transition.sourcePort);
  assert.deepEqual(transition.wiring.targetPort, transition.targetPort);
  assert.ok(transition.subject);
});
