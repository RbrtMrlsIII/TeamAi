import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  derivePodDivisionArticulatedMounts,
} from '../frontend/spatial/machine-world-pod-docking-embodiment.js';

test('S8 compact articulated division mounts follow the real division-side route bend', () => {
  const segments = [
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 1,
      start: { x: 5, y: 1.5, z: 2 },
      end: { x: 5, y: 2.5, z: 2 },
      radius: 0.035,
      routeContinuous: true,
    },
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 2,
      start: { x: 5, y: 2.5, z: 2 },
      end: { x: 2, y: 2.5, z: 1 },
      radius: 0.035,
      routeContinuous: true,
    },
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 3,
      start: { x: 2, y: 2.5, z: 1 },
      end: { x: 2, y: 1.5, z: 1 },
      radius: 0.035,
      routeContinuous: true,
    },
  ];
  const divisions = [{
    semanticId: 'SEAT_CONNECTION',
    dimensions: { x: 0.84, y: 0.10, z: 0.64 },
  }];

  const mounts = derivePodDivisionArticulatedMounts(segments, divisions);
  assert.equal(mounts.length, 2);
  assert.deepEqual(
    mounts.map((mount) => mount.role),
    ['division-articulated-bridge', 'division-articulated-hinge'],
  );
  assert.ok(mounts.every((mount) => mount.semanticId === 'SEAT_CONNECTION'));
  assert.ok(mounts.every((mount) => mount.edgeKind === 'pod-division'));
  assert.ok(mounts.every((mount) => mount.routeContinuous === true));
  assert.ok(mounts.every((mount) => mount.presentationOnly === true));
  assert.ok(mounts.every((mount) => mount.mountMode === 'compact-articulated'));

  const inward = { x: -3 / Math.sqrt(10), z: -1 / Math.sqrt(10) };
  assert.ok(Math.abs(mounts[0].direction.x - inward.x) < 1e-12);
  assert.ok(Math.abs(mounts[0].direction.z - inward.z) < 1e-12);

  const hingeDot = mounts[1].direction.x * mounts[0].direction.x
    + mounts[1].direction.z * mounts[0].direction.z;
  assert.ok(Math.abs(hingeDot) < 1e-12);

  const maxReach = Math.max(
    ...mounts.map((mount) => Math.hypot(
      mount.center.x - mount.point.x,
      mount.center.z - mount.point.z,
    ) + mount.length * 0.5),
  );
  assert.ok(maxReach <= 0.55);
});

test('S8 compact articulated mounts remain absent without a matching authored division', () => {
  const segments = [{
    semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
    edgeKind: 'pod-division',
    segmentIndex: 1,
    start: { x: 0, y: 0, z: 0 },
    end: { x: 0, y: 1, z: 0 },
    routeContinuous: true,
  }, {
    semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
    edgeKind: 'pod-division',
    segmentIndex: 2,
    start: { x: 0, y: 1, z: 0 },
    end: { x: 1, y: 1, z: 0 },
    routeContinuous: true,
  }];
  assert.deepEqual(
    derivePodDivisionArticulatedMounts(segments, []).length,
    0,
  );
});

test('S8 browser and frontend docking embodiment copies remain exact', () => {
  const frontend = readFileSync(
    'frontend/spatial/machine-world-pod-docking-embodiment.js',
    'utf8',
  );
  const browser = readFileSync(
    'public/machine-world-pod-docking-embodiment.js',
    'utf8',
  );
  assert.equal(browser, frontend);
});
