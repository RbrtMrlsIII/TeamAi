import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HERO_WORLD_BASELINE_CAMERA_ID,
  resolveHeroCameraId,
  resolveHeroCameraTarget,
  resolveHeroCameraState,
} from '../frontend/spatial/hero-camera-authority.js';

test('explicit camera identity wins without replacing semantic target authority', () => {
  const subject = { center: { x: 3.2, y: 0.8, z: -1.4 } };
  const state = resolveHeroCameraState({
    requestedCameraId: 'SEAT_CLOSE',
    hierarchyCameraId: 'HERO_WIDE',
    subject,
    fallbackTarget: { x: 0, y: 0.78, z: 0 },
  });

  assert.equal(state.cameraId, 'SEAT_CLOSE');
  assert.deepEqual(state.target, {
    x: 3.2,
    y: 0.8,
    z: -1.4,
    source: 'semantic-subject',
  });
});

test('hierarchy camera identity is used when no explicit camera command exists', () => {
  assert.equal(
    resolveHeroCameraId({ hierarchyCameraId: 'WORKSPACE_ZIPSKILLS' }),
    'WORKSPACE_ZIPSKILLS',
  );
});

test('baseline camera identity is the last resort', () => {
  assert.equal(resolveHeroCameraId({}), HERO_WORLD_BASELINE_CAMERA_ID);
});

test('subject target changes when subject geometry changes', () => {
  const first = resolveHeroCameraTarget({
    subject: { center: { x: 0, y: 0.5, z: 0 } },
    fallbackTarget: { x: 9, y: 9, z: 9 },
  });
  const second = resolveHeroCameraTarget({
    subject: { center: { x: 0.4, y: 0.65, z: 0.9 } },
    fallbackTarget: { x: 9, y: 9, z: 9 },
  });

  assert.notDeepEqual(first, second);
  assert.equal(first.source, 'semantic-subject');
  assert.equal(second.source, 'semantic-subject');
});

test('missing semantic target does not invent coordinates', () => {
  assert.equal(resolveHeroCameraTarget({}), null);
});
