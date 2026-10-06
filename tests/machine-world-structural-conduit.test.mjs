import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { buildMachineWorldTopology } from '../frontend/spatial/machine-world-topology.js';
import {
  getRenderableMachineWorldStructuralConduitSegments,
  validateMachineWorldStructuralConduitSegments,
} from '../frontend/spatial/machine-world-structural-conduit.js';

function buildTopology(seatCount) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
  return buildMachineWorldTopology({ scene, clearance: 0.16 });
}

test('S8 primary inner-spoke carrier stays within presentation volume budget', () => {
  const topology = topologyFor(10);
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
