import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeatDivisionGeometry } from '../frontend/spatial/seat-division-geometry.js';
import { buildAdjacentDivisionTransition } from '../frontend/spatial/seat-adjacent-transition.js';
import {
  semanticSubjectTarget,
  applySemanticSubjectCameraTarget,
} from '../public/hero-cam7-semantic-subject.js';

test('semantic camera target follows the transition subject center', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 0, y: 0.8, z: 0 },
    angle: 0,
    payload: { labels: ['Connection'], controls: ['configure'] },
    id: 'SEAT_CONNECTION',
  });
  const target = buildSeatDivisionGeometry({
    center: { x: 1.8, y: 0.9, z: 1.4 },
    angle: Math.PI,
    payload: { labels: ['Behavior'], controls: ['configure'] },
    id: 'SEAT_BEHAVIOR',
  });
  const transition = buildAdjacentDivisionTransition({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: source,
    targetGeometry: target,
    sourceAmount: 0,
    targetAmount: 1,
  });
  const camera = { p: [2.45, 1.9, 3.05], t: [0, 0.82, 0], f: 31 };
  const next = applySemanticSubjectCameraTarget(camera, transition.subject);
  assert.deepEqual(next.t, semanticSubjectTarget(transition.subject));
  assert.notDeepEqual(next.t, camera.t);
  assert.deepEqual(next.p, camera.p);
  assert.equal(next.f, camera.f);
});

test('changing semantic target geometry moves the camera target without changing camera configuration', () => {
  const source = buildSeatDivisionGeometry({
    center: { x: 0, y: 0.8, z: 0 },
    angle: 0,
    payload: { labels: ['Connection'], controls: ['configure'] },
    id: 'SEAT_CONNECTION',
  });
  const makeTarget = (z) => buildSeatDivisionGeometry({
    center: { x: 0, y: 0.8, z },
    angle: Math.PI,
    payload: { labels: ['Behavior'], controls: ['configure'] },
    id: 'SEAT_BEHAVIOR',
  });
  const make = (targetGeometry) => buildAdjacentDivisionTransition({
    seatIndex: 0,
    sourceDivisionId: 'SEAT_CONNECTION',
    targetDivisionId: 'SEAT_BEHAVIOR',
    sourceGeometry: source,
    targetGeometry,
    sourceAmount: 0,
    targetAmount: 1,
  });
  const camera = { p: [2.45, 1.9, 3.05], t: [0, 0.82, 0], f: 31 };
  const first = applySemanticSubjectCameraTarget(camera, make(makeTarget(0.7)).subject);
  const second = applySemanticSubjectCameraTarget(camera, make(makeTarget(1.4)).subject);
  assert.notEqual(first.t[2], second.t[2]);
  assert.deepEqual(first.p, second.p);
  assert.equal(first.f, second.f);
});

test('camera adapter preserves fallback camera when semantic subject is absent', () => {
  const camera = { p: [1, 2, 3], t: [0, 0.8, 0], f: 39 };
  assert.strictEqual(applySemanticSubjectCameraTarget(camera, null), camera);
  assert.deepEqual(semanticSubjectTarget(null, camera.t), camera.t);
});
