import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { buildMachineWorldTopology, getRenderableMachineWorldConduitSegments } from '../frontend/spatial/machine-world-topology.js';
import {
  getRenderableMachineWorldStructuralConduitSegments,
  validateMachineWorldStructuralConduitSegments,
} from '../frontend/spatial/machine-world-structural-conduit.js';
import {
  derivePodDivisionDockingCollars,
  derivePodDivisionDockingSockets,
} from '../frontend/spatial/machine-world-pod-docking-embodiment.js';

function buildTopology(seatCount) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
  return buildMachineWorldTopology({ scene, clearance: 0.16 });
}

test('S8 primary inner-spoke carrier stays within presentation volume budget', () => {
  const topology = buildTopology(10);
  const segments = getRenderableMachineWorldStructuralConduitSegments(topology);
  const inner = segments.filter((segment) => segment.edgeKind === 'inner-spoke');
  assert.equal(inner.length, 20);
  assert.ok(inner.every((segment) => segment.radius === 0.1));
  assert.ok(inner.every((segment) => segment.radius <= 0.12));
});

test('S8 structural conduit projection keeps the existing Core structural routes', () => {
  const topology = buildTopology(10);
  const segments = getRenderableMachineWorldStructuralConduitSegments(topology);

  assert.ok(segments.length > 0);
  assert.equal(
    new Set(segments.map((segment) => segment.semanticEdgeId)).size,
    topology.edges.filter((edge) =>
      ['inner-spoke', 'lattice-link'].includes(edge.kind)
    ).length,
  );
  assert.equal(
    topology.edges.filter((edge) => edge.kind === 'inner-spoke').length,
    10,
  );
  assert.equal(
    topology.edges.filter((edge) => edge.kind === 'lattice-link').length,
    8,
  );
  assert.equal(segments.length, 10 * 2 + 8 * 3);
  assert.ok(segments.every((segment) => segment.routeContinuous));
  assert.ok(segments.every((segment) => segment.structuralConduit === true));
  assert.ok(segments.every((segment) => segment.radius > 0 && segment.radius <= 0.12));

  const validation = validateMachineWorldStructuralConduitSegments(segments, { topology });
  assert.equal(validation.valid, true, validation.reasons.join(', '));
});

test('S8 structural conduit projection is world-only and cannot leak into focus scopes', () => {
  const topology = buildTopology(10);
  assert.equal(
    getRenderableMachineWorldStructuralConduitSegments(topology, {
      mode: 'DIVISION_FOCUS',
      branchId: 'BRANCH-SEAT-01',
    }).length,
    0,
  );
  assert.equal(
    getRenderableMachineWorldStructuralConduitSegments(topology, {
      mode: 'FACILITY_FOCUS',
      branchId: 'BRANCH-OUTER-ALPHA',
    }).length,
    0,
  );
});

test('S8 structural conduit source and browser copies remain exact', () => {
  const source = readFileSync(
    'frontend/spatial/machine-world-structural-conduit.js',
    'utf8',
  );
  const browser = readFileSync(
    'public/machine-world-structural-conduit.js',
    'utf8',
  );
  assert.equal(browser, source);
});


test('S8 pod-division endpoints carry physical docking embodiment in the same route space', () => {
  const topology = buildTopology(10);
  const conduitSegments = getRenderableMachineWorldConduitSegments(topology)
    .filter((segment) => segment.edgeKind === 'pod-division');
  const sockets = derivePodDivisionDockingSockets(conduitSegments);
  const collars = derivePodDivisionDockingCollars(conduitSegments);

  assert.equal(sockets.length, 10 * 7 * 2);
  assert.equal(collars.length, 10 * 7 * 2);
  assert.ok(sockets.every((socket) => socket.routeContinuous && socket.presentationOnly));
  assert.ok(collars.every((collar) => collar.routeContinuous && collar.presentationOnly));
  assert.ok(sockets.every((socket) => socket.radius > 0 && socket.radius <= 0.065));
  assert.ok(collars.every((collar) => collar.radius > 0 && collar.radius <= 0.09));
});

test('S8 canonical raw Hero renderer consumes structural and docking embodiment', () => {
  const renderer = readFileSync(
    'frontend/spatial/machine-world-renderer.js',
    'utf8',
  );
  const publicRenderer = readFileSync(
    'public/machine-world-renderer.js',
    'utf8',
  );

  assert.match(renderer, /machine-world-structural-conduit\.js/);
  assert.match(renderer, /getRenderableMachineWorldStructuralConduitSegments/);
  assert.match(renderer, /function segmentTubeRotationMatrix\(start, end\)/);
  assert.match(renderer, /function segmentTubeTransform\(segment, radiusScale = 1\)/);
  assert.match(renderer, /derivePodDivisionDockingSockets\(podDivisionDockingSegments\)/);
  assert.match(renderer, /derivePodDivisionDockingCollars\(podDivisionDockingSegments\)/);
  assert.match(renderer, /machineWorldDockingSocketCount/);
  assert.match(renderer, /machineWorldDockingCollarCount/);
  assert.equal(publicRenderer, renderer);
});
