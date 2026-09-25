import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveMachineCameraSpec,
  resolveMachineCameraMode,
  MACHINE_CAMERA_ID,
  MACHINE_CAMERA_MODE,
} from '../frontend/spatial/machine-camera.js';

const subject = (x, z, span = 1) => ({
  center: { x, y: 1, z },
  min: { x: x - span, y: 0, z: z - span },
  max: { x: x + span, y: 2, z: z + span },
});

test('S10 resolves world, pod, division, facility, expansion, and return camera modes from explicit state', () => {
  assert.equal(
    resolveMachineCameraMode({ cameraId: MACHINE_CAMERA_ID.WORLD }),
    MACHINE_CAMERA_MODE.WORLD_OVERVIEW,
  );
  assert.equal(
    resolveMachineCameraMode({ cameraId: MACHINE_CAMERA_ID.SEAT, hierarchyOpen: true }),
    MACHINE_CAMERA_MODE.POD_FOCUS,
  );
  assert.equal(
    resolveMachineCameraMode({ cameraId: MACHINE_CAMERA_ID.DETAIL, hierarchyOpen: true, focusedChildId: 'SEAT_TOOLKIT' }),
    MACHINE_CAMERA_MODE.DIVISION_FOCUS,
  );
  assert.equal(
    resolveMachineCameraMode({ facilityFocused: true }),
    MACHINE_CAMERA_MODE.FACILITY_FOCUS,
  );
  assert.equal(
    resolveMachineCameraMode({
      cameraId: MACHINE_CAMERA_ID.DETAIL,
      hierarchyOpen: true,
      focusedChildId: 'SEAT_TOOLKIT',
      expansionFollowing: true,
    }),
    MACHINE_CAMERA_MODE.EXPANSION_FOLLOW,
  );
  assert.equal(
    resolveMachineCameraMode({ returningToParent: true }),
    MACHINE_CAMERA_MODE.RETURN_TO_PARENT,
  );
  assert.equal(
    resolveMachineCameraMode({ returningToWorld: true }),
    MACHINE_CAMERA_MODE.RETURN_TO_WORLD,
  );
});

test('S10 Workspace camera resolves to the canonical S2 Core subject', () => {
  const world = subject(0, 0, 8);
  const core = subject(1.5, -2.5, 2.2);
  assert.equal(
    resolveMachineCameraMode({ cameraId: MACHINE_CAMERA_ID.WORKSPACE }),
    MACHINE_CAMERA_MODE.CORE_FOCUS,
  );
  const spec = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.WORKSPACE,
    worldSubject: world,
    coreSubject: core,
    viewport: { width: 1280, height: 800 },
  });
  assert.equal(spec.mode, MACHINE_CAMERA_MODE.CORE_FOCUS);
  assert.deepEqual(spec.target, core.center);
  assert.deepEqual(spec.subjectEnvelope, {
    min: core.min,
    max: core.max,
  });
});

test('S10 camera specifications carry the canonical structural-root inheritance', () => {
  const spec = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.WORLD,
    worldSubject: subject(0, 0, 6),
    viewport: { width: 1200, height: 800 },
  });
  assert.equal(spec.constructionSlice, 'S10');
  assert.equal(spec.constructionOwner, 'frontend/spatial/machine-camera.js');
  assert.deepEqual(spec.inheritedStructuralRoots, [
    'S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9',
  ]);
  assert.equal(spec.semanticBoundary, 'presentation-only');
});

test('S10 division focus follows the actual division subject envelope', () => {
  const spec = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.DETAIL,
    mode: MACHINE_CAMERA_MODE.DIVISION_FOCUS,
    worldSubject: subject(0, 0, 8),
    podSubject: subject(4, 4, 2),
    divisionSubject: subject(-3, 7, 0.6),
    viewport: { width: 1200, height: 800 },
  });
  assert.deepEqual(spec.target, { x: -3, y: 1, z: 7 });
  assert.deepEqual(spec.subjectEnvelope, {
    min: { x: -3.6, y: 0.4, z: 6.4 },
    max: { x: -2.4, y: 1.6, z: 7.6 },
  });
  assert.equal(spec.mode, MACHINE_CAMERA_MODE.DIVISION_FOCUS);
  assert.ok(spec.radius >= 8);
  assert.ok(spec.fov <= 44);
});

test('S10 pod focus falls back to world subject when pod subject is unavailable', () => {
  const world = subject(0, 0, 5);
  const spec = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.SEAT,
    mode: MACHINE_CAMERA_MODE.POD_FOCUS,
    worldSubject: world,
    viewport: { width: 390, height: 844 },
    reducedMotion: true,
  });
  assert.deepEqual(spec.target, world.center);
  assert.equal(spec.reducedMotion, true);
  assert.ok(spec.radius > 8);
  assert.equal(spec.fov, 48);
});

test('S10 overhead camera remains world-targeted with a deterministic elevated profile', () => {
  const world = subject(0, 0, 6);
  const spec = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.OVERHEAD,
    worldSubject: world,
    viewport: { width: 1180, height: 760 },
  });
  assert.equal(spec.cameraId, MACHINE_CAMERA_ID.OVERHEAD);
  assert.equal(spec.pitch, 0.8);
  assert.equal(spec.bearing, 0.1);
  assert.deepEqual(spec.target, world.center);
});
