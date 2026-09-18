import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore, getBranchCamera, resolveBranchCamera } from '../frontend/spatial/machine-core-layout.js';

test('branch connection core defaults to ten seats with one hub and four distinct outer housings', () => {
  const core = createBranchConnectionCore();
  assert.equal(core.seatCount, 10);
  assert.equal(core.parts.length, 15);
  assert.equal(core.parts.filter((part) => part.kind === 'hub').length, 1);
  assert.equal(core.parts.filter((part) => part.kind === 'inner-pod').length, 10);
  assert.equal(core.parts.filter((part) => part.kind === 'outer-housing').length, 4);
  assert.equal(new Set(core.parts.map((part) => part.branchId)).size, 15);
  assert.deepEqual(core.parts.filter((part) => part.kind === 'outer-housing').map((part) => part.silhouette), ['fin', 'arc', 'diamond', 'blade']);
});

test('eight-seat population remains a valid parameter without changing the renderer algorithm', () => {
  const core = createBranchConnectionCore({ seatCount: 8 });
  assert.equal(core.seatCount, 8);
  assert.equal(core.parts.filter((part) => part.kind === 'inner-pod').length, 8);
  assert.equal(core.parts.length, 13);
  assert.deepEqual(core.parts.filter((part) => part.kind === 'inner-pod').map((part) => part.seatIndex), [0,1,2,3,4,5,6,7]);
});

test('each seat module binds to the canonical TREE-HERO-SEAT shell without fabricating child geometry', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const seats = core.parts.filter((part) => part.kind === 'inner-pod');

  assert.equal(core.semanticTreeId, 'TREE-HERO-SEAT');
  assert.equal(core.semanticRegistry.length, 8);
  assert.deepEqual(
    core.semanticRegistry.map((definition) => definition.semanticId),
    [
      'SEAT_SHELL',
      'SEAT_CONNECTION',
      'SEAT_BEHAVIOR',
      'SEAT_TOOLKIT',
      'SEAT_CAPABILITIES',
      'SEAT_AUTHORIZATION',
      'SEAT_WORKSPACE_SCOPE',
      'SEAT_TASK_EVIDENCE',
    ],
  );

  assert.equal(seats.length, 10);
  assert.equal(new Set(seats.map((part) => part.semanticKey)).size, 10);
  for (const [seatIndex, part] of seats.entries()) {
    assert.equal(part.treeId, 'TREE-HERO-SEAT');
    assert.equal(part.semanticId, 'SEAT_SHELL');
    assert.equal(part.semanticStatus, 'IMPLEMENTED_PARTIAL');
    assert.equal(part.renderedInCore, true);
    assert.equal(part.semanticKey, `TREE-HERO-SEAT#${seatIndex}:SEAT_SHELL`);
    assert.deepEqual(part.childSemanticIds, [
      'SEAT_CONNECTION',
      'SEAT_BEHAVIOR',
      'SEAT_TOOLKIT',
      'SEAT_CAPABILITIES',
      'SEAT_AUTHORIZATION',
      'SEAT_WORKSPACE_SCOPE',
      'SEAT_TASK_EVIDENCE',
    ]);
  }

  assert.equal(core.hub.semanticId, null);
  assert.equal(core.hub.semanticBoundary, 'presentation-only');
  assert.ok(core.parts.filter((part) => part.kind === 'outer-housing').every((part) => part.semanticId === null && part.semanticBoundary === 'presentation-only'));
  assert.ok(core.connections.filter((connection) => connection.kind === 'inner-spoke').every((connection) => connection.semanticRelation === 'tree-membership' && connection.semanticTargetId === 'SEAT_SHELL'));
});

test('all branches and hub have independent camera profiles', () => {
  const core = createBranchConnectionCore();
  assert.equal(core.cameras.length, 15);
  assert.equal(new Set(core.cameras.map((camera) => camera.cameraId)).size, 15);
  const seats = core.parts.filter((part) => part.kind === 'inner-pod');
  assert.deepEqual(seats.map((part) => part.seatIndex), [0,1,2,3,4,5,6,7,8,9]);
  for (const part of core.parts) assert.equal(getBranchCamera(core, part.branchId).branchId, part.branchId);
});

test('branch camera target follows current branch geometry without changing identity', () => {
  const base = createBranchConnectionCore({ seatCount: 10, expanded: false });
  const expanded = createBranchConnectionCore({ seatCount: 10, expanded: true });
  const branchId = 'BRANCH-SEAT-06';
  const baseCamera = resolveBranchCamera(base, branchId);
  const expandedCamera = resolveBranchCamera(expanded, branchId);
  assert.equal(baseCamera.cameraId, `BRANCH_CAMERA_${branchId}`);
  assert.equal(expandedCamera.cameraId, baseCamera.cameraId);
  assert.notDeepEqual(expandedCamera.target, baseCamera.target);
});

test('every module owns a UI surface suited to its geometry and style', () => {
  const core = createBranchConnectionCore();
  for (const part of core.parts) {
    assert.ok(part.uiStyle);
    assert.ok(part.uiSurface);
    assert.ok(part.uiSurface.width > 0);
    assert.ok(part.uiSurface.depth > 0);
    assert.ok(part.uiSurface.clearance >= part.seam);
    assert.equal(part.uiSurface.anchor.y > part.level, true);
  }
  assert.equal(core.hub.uiSurface.style, 'command-core');
  assert.equal(new Set(core.parts.filter((part) => part.kind === 'outer-housing').map((part) => part.uiSurface.style)).size, 4);
});

test('inner pods are evenly spaced around the hub and have explicit gaps', () => {
  const core = createBranchConnectionCore();
  const pods = core.parts.filter((part) => part.kind === 'inner-pod');
  const radii = pods.map((part) => Math.hypot(part.center.x, part.center.z));
  assert.ok(Math.max(...radii) - Math.min(...radii) < 0.01);
  const angles = pods.map((part) => (Math.atan2(part.center.z, part.center.x) + Math.PI * 2) % (Math.PI * 2)).sort((a,b) => a-b);
  const gaps = angles.slice(1).map((angle,index) => angle-angles[index]).concat([angles[0]+Math.PI*2-angles.at(-1)]);
  assert.ok(gaps.every((gap) => Math.abs(gap - (Math.PI * 2 / 10)) < 0.02));
  assert.ok(pods.every((part) => part.seam > 0));
});

test('outer modules interleave between seat-pod angles', () => {
  const core = createBranchConnectionCore();
  const pods = core.parts.filter((part) => part.kind === 'inner-pod');
  const outer = core.parts.filter((part) => part.kind === 'outer-housing');
  const podAngles = pods.map((part) => (Math.atan2(part.center.z, part.center.x) + Math.PI * 2) % (Math.PI * 2)).sort((a,b) => a-b);
  for (const part of outer) {
    const angle = (Math.atan2(part.center.z, part.center.x) + Math.PI * 2) % (Math.PI * 2);
    const nearest = Math.min(...podAngles.map((podAngle) => Math.abs(angle - podAngle)));
    assert.ok(Math.abs(nearest - Math.PI / 10) < 0.02);
  }
});

test('outer modules sit beyond the inner ring and connect into the lattice', () => {
  const core = createBranchConnectionCore();
  const outer = core.parts.filter((part) => part.kind === 'outer-housing');
  assert.ok(outer.every((part) => Math.hypot(part.center.x, part.center.z) > 6));
  assert.equal(core.connections.filter((connection) => connection.kind === 'lattice-link').length, 8);
  assert.equal(core.connections.filter((connection) => connection.kind === 'outer-spine').length, 4);
  assert.equal(core.connections.filter((connection) => connection.kind === 'inner-spoke').length, 10);
});

test('expanded core separates the modules farther from the hub without changing identity', () => {
  const base = createBranchConnectionCore();
  const expanded = createBranchConnectionCore({ expanded: true });
  const baseById = new Map(base.parts.map((part) => [part.branchId, part]));
  for (const part of expanded.parts) {
    assert.equal(baseById.get(part.branchId).branchId, part.branchId);
    if (part.kind !== 'hub') assert.ok(Math.hypot(part.center.x, part.center.z) >= Math.hypot(baseById.get(part.branchId).center.x, baseById.get(part.branchId).center.z));
  }
});
