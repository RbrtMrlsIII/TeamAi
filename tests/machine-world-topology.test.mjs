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
