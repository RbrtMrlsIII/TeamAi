import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveFocusedSeatDivisionGeometry, resolveSeatDivisionPresentation } from '../frontend/spatial/machine-seat-division-presentation.js';

const parent = {
  seatIndex: 2,
  level: 0.72,
  center: { x: 4.1, y: 0.72, z: 0.1 },
  dimensions: { x: 1.34, y: 0.62, z: 1.08 },
  seam: 0.18,
};

test('focused division presentation derives geometry from semantic child identity and parent dimensions', () => {
  for (const childId of [
    'SEAT_CONNECTION',
    'SEAT_BEHAVIOR',
    'SEAT_TOOLKIT',
    'SEAT_CAPABILITIES',
    'SEAT_AUTHORIZATION',
    'SEAT_WORKSPACE_SCOPE',
    'SEAT_TASK_EVIDENCE',
  ]) {
    const presentation = resolveSeatDivisionPresentation(childId);
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex: 3, amount: 1 });
    assert.ok(presentation);
    assert.equal(geometry.semantic, childId);
    assert.equal(presentation.payload.presentationOnly, true);
    assert.ok(presentation.payload.controls.includes('configure'));
    assert.match(geometry.id, new RegExp(':' + childId + ':GEOMETRY$'));
    assert.ok(geometry.dimensions.width > 0);
    assert.ok(geometry.dimensions.depth > 0);
  }
});

test('unknown child identity fails closed', () => {
  assert.equal(resolveSeatDivisionPresentation('NOT_A_CHILD'), null);
  assert.equal(deriveFocusedSeatDivisionGeometry({ parent, childId: 'NOT_A_CHILD', childIndex: 0, amount: 1 }), null);
});

test('child geometry moves from the parent using semantic order rather than fixed world coordinates', () => {
  const a = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_BEHAVIOR', childIndex: 0, amount: 1 });
  const b = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_BEHAVIOR', childIndex: 6, amount: 1 });
  assert.notDeepEqual(a.center, b.center);
});
