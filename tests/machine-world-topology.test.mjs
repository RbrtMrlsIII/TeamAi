import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import {
  buildMachineWorldTopology,
  validateMachineWorldTopology,
  MACHINE_WORLD_TOPOLOGY_VERSION,
  getRenderableMachineWorldEdges,
  getRenderableMachineWorldEdgesForScope,
  getRenderableMachineWorldConduitSegments,
  PHYSICAL_CONDUIT_EDGE_KINDS,
} from '../frontend/spatial/machine-world-topology.js';

function buildFixture(seatCount) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
  const facilityAssemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const facilityMachinery = deriveMachineFacilityMachinery({ facilityAssemblies });
  const topology = buildMachineWorldTopology({
    scene,
    facilityAssemblies,
    facilityMachinery,
  });
  return { scene, topology };
}

test('S8 composes Core, Division, Facility, Workspace, and Adjacent Seat topology', () => {
  const { scene, topology } = buildFixture(10);
  const result = validateMachineWorldTopology(topology, {
    expectedSeatCount: scene.seatCount,
  });
  assert.equal(topology.version, MACHINE_WORLD_TOPOLOGY_VERSION);
  assert.equal(result.valid, true, result.reasons.join(', '));
  assert.equal(topology.divisionEdgeCount, 70);
  assert.equal(topology.facilityEdgeCount, 10);
  assert.equal(topology.facilityFacilityEdgeCount, 4);
  assert.equal(topology.workspaceContributionEdgeCount, 4);
  assert.equal(topology.adjacentSeatEdgeCount, 9);
});

test('S8 edge identity and corridor reservations are unique and continuous', () => {
  const { topology } = buildFixture(4);
  const ids = topology.edges.map((edge) => edge.semanticEdgeId);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(topology.edges.every((edge) => Array.isArray(edge.route) && edge.route.length >= 2));
  assert.ok(topology.edges.every((edge) => edge.routeContinuous));
  assert.ok(topology.edges.every((edge) => edge.corridorReserved || ['inner-spoke','outer-spine','lattice-link'].includes(edge.kind)));
  assert.ok(topology.edges.every((edge) =>
    !edge.corridorReserved || edge.corridor?.semanticEdgeId === edge.semanticEdgeId
  ));
});

test('S8 sparse Seat populations retain all four facility-machine links', () => {
  const { topology } = buildFixture(2);
  assert.equal(topology.facilityFacilityEdgeCount, 4);
  assert.equal(topology.workspaceContributionEdgeCount, 4);
  assert.equal(topology.facilityEdgeCount, 2);
  assert.equal(topology.adjacentSeatEdgeCount, 1);
  assert.equal(topology.divisionEdgeCount, 14);
});

test('S8 inherits the complete S0-S7 structural prefix', () => {
  const { topology } = buildFixture(10);
  assert.deepEqual(
    topology.inheritedStructuralRoots,
    ['S0','S1','S2','S3','S4','S5','S6','S7'],
  );
});


test('S8 renderable world corridors are a projection of semantic edges, never a second graph', () => {
  const { topology } = buildFixture(10);
  const renderable = getRenderableMachineWorldEdges(topology);
  assert.ok(renderable.length > 0);
  assert.equal(
    renderable.length,
    topology.edges.filter((edge) =>
      ['pod-division','pod-facility','facility-facility','workspace-contribution','adjacent-seat'].includes(edge.kind)
      && Array.isArray(edge.route)
      && edge.route.length >= 2,
    ).length,
  );
  assert.ok(renderable.every((edge) => topology.edges.some((source) =>
    source.semanticEdgeId === edge.semanticEdgeId
  )));
});

test('S8 scoped physical routes stay local to Seat and Facility focus modes', () => {
  const { topology } = buildFixture(10);
  const seatEdges = getRenderableMachineWorldEdgesForScope(topology, {
    mode: 'POD_FOCUS',
    branchId: 'BRANCH-SEAT-01',
  });
  const facilityEdges = getRenderableMachineWorldEdgesForScope(topology, {
    mode: 'FACILITY_FOCUS',
    branchId: 'BRANCH-OUTER-ALPHA',
  });

  assert.ok(seatEdges.length > 0);
  assert.ok(facilityEdges.length > 0);
  assert.ok(seatEdges.every((edge) =>
    (edge.kind === 'pod-division' && edge.targetBranchId === 'BRANCH-SEAT-01')
    || (edge.kind === 'pod-facility' && edge.sourceBranchId === 'BRANCH-SEAT-01')
    || (edge.kind === 'adjacent-seat' && (
      edge.sourceBranchId === 'BRANCH-SEAT-01'
      || edge.targetBranchId === 'BRANCH-SEAT-01'
    )),
  ));
  assert.ok(facilityEdges.every((edge) =>
    (edge.kind === 'pod-facility' && edge.targetBranchId === 'BRANCH-OUTER-ALPHA')
    || (edge.kind === 'facility-facility' && (
      edge.sourceBranchId === 'BRANCH-OUTER-ALPHA'
      || edge.targetBranchId === 'BRANCH-OUTER-ALPHA'
    ))
    || (edge.kind === 'workspace-contribution' && edge.targetBranchId === 'BRANCH-OUTER-ALPHA'),
  ));
  assert.ok(getRenderableMachineWorldEdgesForScope(topology, {
    mode: 'WORLD_OVERVIEW',
    branchId: 'BRANCH-SEAT-01',
  }).length > seatEdges.length);
});

test('S8 service planes are derived from interface elevation rather than a global world deck', () => {
  const { topology } = buildFixture(10);
  const external = topology.edges.filter((edge) => PHYSICAL_CONDUIT_EDGE_KINDS.includes(edge.kind));

  assert.ok(external.length > 0);
  assert.ok(external.every((edge) => {
    const endpointY = Math.max(edge.route[0].y, edge.route.at(-1).y);
    return edge.route[1].y >= endpointY + 0.34 - 1e-9;
  }));
  assert.ok(external.some((edge) => edge.route[1].y < 1.90));
});

test('S8 topology recomputes division routes and corridor bounds from current expansion geometry', () => {
  const closedScene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const openScene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const build = (scene) => {
    const facilityAssemblies = deriveMachineFacilityAssemblies({
      outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
    });
    const facilityMachinery = deriveMachineFacilityMachinery({ facilityAssemblies });
    return buildMachineWorldTopology({
      scene,
      facilityAssemblies,
      facilityMachinery,
      seatDivisionAmount: 0,
    });
  };
  const closed = build(closedScene);
  const open = build(openScene);
  const closedEdge = closed.edges.find((edge) => edge.kind === 'pod-division');
  const openEdge = open.edges.find((edge) => edge.kind === 'pod-division');
  assert.ok(closedEdge && openEdge);
  assert.equal(closedEdge.semanticEdgeId, openEdge.semanticEdgeId);
  assert.notDeepEqual(closedEdge.route, openEdge.route);
  assert.notDeepEqual(closedEdge.corridor.bounds, openEdge.corridor.bounds);
});


test('S8 core routes preserve clearance across 1-10 Seats and shell expansion states', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const facilityAssemblies = deriveMachineFacilityAssemblies({
        outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
      });
      const facilityMachinery = deriveMachineFacilityMachinery({ facilityAssemblies });
      const topology = buildMachineWorldTopology({
        scene,
        facilityAssemblies,
        facilityMachinery,
      });
      const coreEdges = topology.edges.filter((edge) =>
        ['inner-spoke', 'outer-spine', 'lattice-link'].includes(edge.kind)
      );
      assert.ok(coreEdges.length > 0);
      assert.ok(
        coreEdges.every((edge) => edge.obstacleAvoidance === true && edge.routeContinuous === true),
        `core route clearance failed at seats=${seatCount}, expansion=${expansionAmount}`,
      );
      assert.equal(
        validateMachineWorldTopology(topology, { expectedSeatCount: seatCount }).valid,
        true,
        `aggregate topology invalid at seats=${seatCount}, expansion=${expansionAmount}`,
      );
    }
  }
});


test('S8 external semantic routes project to authored conduit segments without creating another graph', () => {
  const { topology } = buildFixture(10);
  const conduits = getRenderableMachineWorldConduitSegments(topology);
  const externalEdges = topology.edges.filter((edge) => PHYSICAL_CONDUIT_EDGE_KINDS.includes(edge.kind));
  const nonFacilityEdges = externalEdges.filter((edge) => edge.kind !== 'facility-facility');
  const facilityEdges = externalEdges.filter((edge) => edge.kind === 'facility-facility');

  assert.equal(
    conduits.length,
    nonFacilityEdges.length * 3 + topology.serviceManifold.segments.length,
  );
  assert.equal(new Set(conduits.map((entry) => entry.semanticEdgeId)).size, externalEdges.length);
  assert.ok(conduits.every((entry) => entry.routeContinuous));
  assert.ok(conduits.every((entry) => entry.radius <= entry.corridorRadius));
  assert.ok(conduits.every((entry) => entry.dimensions.x > 0 && entry.dimensions.y > 0 && entry.dimensions.z > 0));
  assert.equal(topology.serviceManifold.valid, true);
  assert.equal(topology.serviceManifoldValidation.valid, true);
  assert.ok(topology.serviceManifold.radius > topology.serviceManifold.innerBoundary);
  assert.ok(topology.serviceManifold.radius < topology.serviceManifold.outerBoundary);
  assert.equal(topology.serviceManifold.facilitySpurCount, facilityEdges.length * 2);
  assert.ok(topology.serviceManifold.arcSegmentCount >= facilityEdges.length);

  const segmentsByEdge = new Map();
  for (const segment of conduits) {
    if (!segmentsByEdge.has(segment.semanticEdgeId)) segmentsByEdge.set(segment.semanticEdgeId, []);
    segmentsByEdge.get(segment.semanticEdgeId).push(segment);
  }
  const assertPointClose = (actual, expected, tolerance = 1e-9) => {
    assert.ok(Math.abs(actual.x - expected.x) <= tolerance, 'x delta');
    assert.ok(Math.abs(actual.y - expected.y) <= tolerance, 'y delta');
    assert.ok(Math.abs(actual.z - expected.z) <= tolerance, 'z delta');
  };
  for (const edge of nonFacilityEdges) {
    const segments = segmentsByEdge.get(edge.semanticEdgeId) || [];
    assert.equal(segments.length, 3);
    assertPointClose(segments[0].start, edge.route[0]);
    assertPointClose(segments.at(-1).end, edge.route.at(-1));
  }
  for (const edge of facilityEdges) {
    const segments = segmentsByEdge.get(edge.semanticEdgeId) || [];
    assert.ok(segments.length >= 4);
    assertPointClose(segments[0].start, edge.route[0]);
    assertPointClose(segments.at(-1).end, edge.route.at(-1));
    for (let index = 1; index < segments.length; index += 1) {
      assertPointClose(segments[index - 1].end, segments[index].start);
    }
  }
});

test('S8 service manifold remains inside the measured S4/S7 radial safety band across Seats', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const { topology } = buildFixture(seatCount);
    const manifold = topology.serviceManifold;
    assert.equal(manifold.valid, true, `invalid manifold at seats=${seatCount}: ${manifold.reasons.join(', ')}`);
    assert.equal(topology.serviceManifoldValidation.valid, true);
    assert.ok(manifold.radius > manifold.innerBoundary);
    assert.ok(manifold.radius < manifold.outerBoundary);
    assert.ok(
      manifold.segments.every((segment) => segment.routeContinuous && segment.obstacleAvoidance),
      `manifold obstacle failure at seats=${seatCount}`,
    );
  }
});

test('S8 conduit projection follows current dynamic route geometry', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const facilityAssemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const facilityMachinery = deriveMachineFacilityMachinery({ facilityAssemblies });
  const closed = buildMachineWorldTopology({
    scene,
    facilityAssemblies,
    facilityMachinery,
    seatDivisionAmount: 0,
  });
  const open = buildMachineWorldTopology({
    scene,
    facilityAssemblies,
    facilityMachinery,
    seatDivisionAmount: 1,
  });
  const closedConduit = getRenderableMachineWorldConduitSegments(closed).find((entry) =>
    entry.edgeKind === 'pod-division'
  );
  const openConduit = getRenderableMachineWorldConduitSegments(open).find((entry) =>
    entry.edgeKind === 'pod-division'
  );
  assert.ok(closedConduit && openConduit);
  assert.notDeepEqual(closedConduit.start, openConduit.start);
  assert.notDeepEqual(closedConduit.end, openConduit.end);
  assert.notDeepEqual(closedConduit.dimensions, openConduit.dimensions);
});