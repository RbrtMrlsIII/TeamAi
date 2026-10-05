import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  MACHINE_WORLD_POD_DOCKING_EMBODIMENT_VERSION,
  derivePodDivisionStructuralChassis,
} from '../frontend/spatial/machine-world-pod-docking-embodiment.js';

test('S8 structural chassis version and source/public parity are preserved', () => {
  assert.equal(MACHINE_WORLD_POD_DOCKING_EMBODIMENT_VERSION, 'S8-DOCKING-V4');
  assert.equal(
    readFileSync('public/machine-world-pod-docking-embodiment.js', 'utf8'),
    readFileSync('frontend/spatial/machine-world-pod-docking-embodiment.js', 'utf8'),
  );
  assert.equal(
    readFileSync('public/machine-three-scene-adapter.js', 'utf8'),
    readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8'),
  );
  assert.equal(
    readFileSync('public/machine-structural-embodiment-preview.js', 'utf8'),
    readFileSync('frontend/spatial/machine-structural-embodiment-preview.js', 'utf8'),
  );
});

test('S8 structural chassis derives four bounded presentation pieces from one real pod-division service segment', () => {
  const segments = [
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 1,
      start: { x: 2, y: 4, z: 6 },
      end: { x: 2, y: 5, z: 6 },
      radius: 0.035,
      routeContinuous: true,
    },
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 2,
      start: { x: 2, y: 5, z: 6 },
      end: { x: 6, y: 5, z: 9 },
      radius: 0.035,
      routeContinuous: true,
    },
    {
      semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
      edgeKind: 'pod-division',
      segmentIndex: 3,
      start: { x: 6, y: 5, z: 9 },
      end: { x: 6, y: 4, z: 9 },
      radius: 0.035,
      routeContinuous: true,
    },
  ];
  const divisions = [{ semanticId: 'SEAT_CONNECTION', dimensions: { x: 0.52, y: 0.10, z: 0.38 } }];
  const chassis = derivePodDivisionStructuralChassis(segments, divisions);
  assert.equal(chassis.length, 4);
  assert.deepEqual(chassis.map((piece) => piece.segmentIndex), [2, 2, 2, 2]);
  assert.deepEqual(chassis.map((piece) => piece.role), [
    'division-chassis-rail',
    'division-chassis-rail',
    'division-chassis-crossbar',
    'division-chassis-crossbar',
  ]);
  assert.equal(chassis[0].semanticId, 'SEAT_CONNECTION');
  assert.equal(chassis[1].semanticId, 'SEAT_CONNECTION');
  assert.equal(chassis[0].direction.y, 0);
  assert.equal(chassis[1].direction.y, 0);
  assert.ok(Math.abs(Math.hypot(chassis[0].direction.x, chassis[0].direction.z) - 1) < 1e-12);
  assert.ok(Math.abs(
    chassis[0].direction.x * chassis[1].direction.x
      + chassis[0].direction.z * chassis[1].direction.z
      - 1,
  ) < 1e-12);
  assert.ok(Math.abs(
    chassis[0].direction.x * chassis[2].direction.x
      + chassis[0].direction.z * chassis[2].direction.z,
  ) < 1e-12);
  assert.notDeepEqual(chassis[0].center, chassis[1].center);
  assert.ok(chassis.every((piece) => piece.presentationOnly === true));
  assert.ok(chassis.every((piece) => piece.routeContinuous === true));
  assert.ok(chassis.every((piece) => piece.radius >= 0.03 && piece.radius <= 0.075));
  assert.ok(chassis.every((piece) => piece.length > 0));
  assert.ok(chassis[0].length < 5 * 0.5);
  assert.ok(chassis[0].length <= 2.40);
  assert.ok(chassis[2].length <= 0.23 + 1e-12);
});

test('S8 chassis stays disabled without focused division descriptors', () => {
  const segments = [{
    semanticEdgeId: 'EDGE:SEAT-DIVISION:TREE-HERO-SEAT#0:SEAT_CONNECTION=>BRANCH-SEAT-01',
    edgeKind: 'pod-division',
    segmentIndex: 2,
    start: { x: 2, y: 5, z: 6 },
    end: { x: 6, y: 5, z: 9 },
    radius: 0.035,
    routeContinuous: true,
  }];
  assert.deepEqual(derivePodDivisionStructuralChassis(segments, []), []);
});
