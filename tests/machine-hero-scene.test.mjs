import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createMachineTransition,
  deriveMachineSubject,
  resolveMachineCamera,
} from '../frontend/spatial/machine-hero-scene.js';

const source = {
  id: 's0', semanticId: 'SEAT_CONNECTION', center: { x: -1, y: 0.5, z: 0 },
  dimensions: { x: 2, y: 1, z: 1.4 }, port: { x: 0, y: 0.5, z: 0 },
};
const target = {
  id: 's1', semanticId: 'SEAT_BEHAVIOR', center: { x: 1, y: 0.5, z: 0 },
  dimensions: { x: 1.6, y: 1, z: 1.2 }, port: { x: 1, y: 0.5, z: 0 },
};

test('canonical transition contains semantic identity, geometry, ports, expansion, wiring, subject', () => {
  const transition = createMachineTransition({
    seatIndex: 0,
    source,
    target,
    expansion: { sourceAmount: 0.25, targetAmount: 0.75 },
    wiring: { id: 'wire-1' },
  });
  assert.equal(transition.sourceDivisionId, 'SEAT_CONNECTION');
  assert.equal(transition.targetDivisionId, 'SEAT_BEHAVIOR');
  assert.deepEqual(transition.sourcePort, source.port);
  assert.deepEqual(transition.targetPort, target.port);
  assert.equal(transition.expansion.sourceAmount, 0.25);
  assert.equal(transition.expansion.targetAmount, 0.75);
  assert.equal(transition.wiring.id, 'wire-1');
  assert.ok(transition.subject);
});

test('subject is geometry-derived and moves when geometry moves', () => {
  const first = deriveMachineSubject([source, target]);
  const movedTarget = { ...target, center: { x: 2.5, y: 0.5, z: 0.75 } };
  const second = deriveMachineSubject([source, movedTarget]);
  assert.notDeepEqual(second.center, first.center);
  assert.ok(second.max.x > first.max.x);
  assert.ok(second.max.z > first.max.z);
});

test('camera configuration stays named while target follows subject', () => {
  const transition = createMachineTransition({ seatIndex: 0, source, target });
  const camera = resolveMachineCamera({ cameraId: 'SEAT_CLOSE', subject: transition.subject });
  const moved = createMachineTransition({
    seatIndex: 0,
    source,
    target: { ...target, center: { x: 3.25, y: 0.5, z: 1.5 } },
  });
  const movedCamera = resolveMachineCamera({ cameraId: camera.cameraId, subject: moved.subject });
  assert.equal(camera.cameraId, 'SEAT_CLOSE');
  assert.equal(movedCamera.cameraId, 'SEAT_CLOSE');
  assert.notDeepEqual(movedCamera.target, camera.target);
});

test('invalid transition fails closed', () => {
  assert.throws(() => createMachineTransition({ source, target: { ...target, semanticId: null } }));
});
