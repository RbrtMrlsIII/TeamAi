import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import { buildMachineWorldTopology } from '../frontend/spatial/machine-world-topology.js';
import {
  deriveMachineWorldFacilityStagingScale,
  deriveMachineWorldPresentationProjection,
  validateMachineWorldPresentationProjection,
} from '../frontend/spatial/machine-world-presentation-projection.js';

test('World presentation contracts runtime outer facility placement to authored radius', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const scale = deriveMachineWorldFacilityStagingScale(10);
  assert.ok(scale > 0.70 && scale < 0.75);
  const projected = deriveMachineWorldPresentationProjection({ facilities, seatCount: 10 });
  const radii = projected.facilities.map((facility) => Math.hypot(facility.outerHousing.center.x, facility.outerHousing.center.z));
  assert.ok(radii.every((radius) => Math.abs(radius - 7.15) < 0.01));
  assert.equal(validateMachineWorldPresentationProjection(projected).valid, true);
});

test('World presentation contracts facility-side lattice and workspace route spans', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const facilities = deriveMachineFacilityMachinery({
    facilityAssemblies: deriveMachineFacilityAssemblies({
      outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
    }),
  });
  const topology = buildMachineWorldTopology({
    scene,
    facilityMachinery: facilities,
    clearance: 0.16,
  });
  const projected = deriveMachineWorldPresentationProjection({
    facilities,
    topology,
    seatCount: 10,
  });

  const sourceById = new Map(topology.edges.map((edge) => [edge.semanticEdgeId, edge]));
  const projectedLattice = projected.topology.edges.find((edge) => edge.kind === 'lattice-link');
  const sourceLattice = sourceById.get(projectedLattice.semanticEdgeId);
  assert.ok(Math.hypot(projectedLattice.route[0].x, projectedLattice.route[0].z)
    < Math.hypot(sourceLattice.route[0].x, sourceLattice.route[0].z));
  assert.deepEqual(projectedLattice.route.at(-1), sourceLattice.route.at(-1));

  const projectedWorkspace = projected.topology.edges.find((edge) => edge.kind === 'workspace-contribution');
  const sourceWorkspace = sourceById.get(projectedWorkspace.semanticEdgeId);
  assert.deepEqual(projectedWorkspace.route[0], sourceWorkspace.route[0]);
  assert.ok(Math.hypot(projectedWorkspace.route.at(-1).x, projectedWorkspace.route.at(-1).z)
    < Math.hypot(sourceWorkspace.route.at(-1).x, sourceWorkspace.route.at(-1).z));
});

test('World presentation preserves semantic edge identity and route continuity', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const topology = buildMachineWorldTopology({ scene, facilities, machinery: facilities, seatCount: 10, clearance: 0.16 });
  const projected = deriveMachineWorldPresentationProjection({ facilities, topology, seatCount: 10 });
  assert.equal(projected.topology.edges.length, topology.edges.length);
  assert.deepEqual(projected.topology.edges.map((edge) => edge.semanticEdgeId), topology.edges.map((edge) => edge.semanticEdgeId));
  assert.ok(projected.topology.edges.every((edge) => edge.routeContinuous === true && edge.route.length >= 2));
});

test('World presentation moves only machine-side manifold spur endpoints and preserves all ring junctions', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const facilities = deriveMachineFacilityMachinery({
        facilityAssemblies: deriveMachineFacilityAssemblies({
          outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
        }),
      });
      const topology = buildMachineWorldTopology({ scene, facilityMachinery: facilities, clearance: 0.16 });
      const projected = deriveMachineWorldPresentationProjection({ facilities, topology, seatCount });
      const sourceSegments = new Map(topology.serviceManifold.segments.map((segment) => [segment.id, segment]));
      const close = (actual, expected, tolerance = 1e-8) =>
        Math.hypot(
          actual.x - expected.x,
          actual.y - expected.y,
          actual.z - expected.z,
        ) <= tolerance;
      const scalePoint = (point) => ({
        ...point,
        x: point.x * projected.scale,
        z: point.z * projected.scale,
      });
      const projectedSegments = projected.topology.serviceManifold.segments;
      assert.equal(projected.topology.serviceManifold.junctions.length, 4);
      assert.equal(validateMachineWorldPresentationProjection(projected).valid, true);

      for (const segment of projectedSegments) {
        const source = sourceSegments.get(segment.id);
        assert.ok(source, segment.id);
        if (segment.segmentRole === 'facility-output-spur') {
          assert.ok(close(segment.start, scalePoint(source.start)), segment.id + ': only source-machine end should scale');
          assert.ok(close(segment.end, source.end), segment.id + ': fixed ring anchor');
        } else if (segment.segmentRole === 'facility-input-spur') {
          assert.ok(close(segment.start, source.start), segment.id + ': fixed ring anchor');
          assert.ok(close(segment.end, scalePoint(source.end)), segment.id + ': only target-machine end should scale');
        } else {
          assert.ok(close(segment.start, source.start), segment.id + ': arc start remains fixed');
          assert.ok(close(segment.end, source.end), segment.id + ': arc end remains fixed');
        }
        assert.ok(close(segment.center, {
          x: (segment.start.x + segment.end.x) * 0.5,
          y: (segment.start.y + segment.end.y) * 0.5,
          z: (segment.start.z + segment.end.z) * 0.5,
        }), segment.id + ': segment center follows its transformed endpoints');
      }

      for (const junction of projected.topology.serviceManifold.junctions) {
        const touching = projectedSegments.filter((segment) =>
          close(segment.start, junction.center) || close(segment.end, junction.center));
        assert.equal(touching.length, 4, junction.id);
      }
    }
  }
});

test('World presentation source and browser copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/machine-world-presentation-projection.js', 'utf8'), readFileSync('public/machine-world-presentation-projection.js', 'utf8'));
});

test('World presentation projects authored facility adapter start/end points with the housing', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const outerHousings = scene.parts.filter((part) => part.kind === 'outer-housing');
      const assemblies = deriveMachineFacilityAssemblies({ outerHousings });
      const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
      const scale = deriveMachineWorldFacilityStagingScale(seatCount);
      const projected = deriveMachineWorldPresentationProjection({
        facilities,
        seatCount,
      });

      for (const projectedMachine of projected.facilities) {
        const authoredMachine = facilities.find((machine) => machine.branchId === projectedMachine.branchId);
        const authoredAdapters = new Map(
          authoredMachine.physicalInterfaces
            .filter((entry) => entry.role === 'facility-port-adapter')
            .map((entry) => [entry.id, entry]),
        );
        const projectedPorts = new Map(projectedMachine.ports.map((port) => [port.id, port]));

        for (const projectedAdapter of projectedMachine.physicalInterfaces.filter(
          (entry) => entry.role === 'facility-port-adapter',
        )) {
          const authoredAdapter = authoredAdapters.get(projectedAdapter.id);
          const projectedPort = projectedPorts.get(projectedAdapter.portId);
          assert.ok(authoredAdapter, projectedAdapter.id);
          assert.ok(projectedPort, projectedAdapter.id + ': source port missing');
          assert.deepEqual(projectedAdapter.adapterStart, projectedPort.point);
          assert.ok(Math.abs(projectedAdapter.adapterEnd.x - authoredAdapter.adapterEnd.x * scale) < 1e-9);
          assert.ok(Math.abs(projectedAdapter.adapterEnd.z - authoredAdapter.adapterEnd.z * scale) < 1e-9);
          assert.equal(projectedAdapter.adapterEnd.y, authoredAdapter.adapterEnd.y);
        }
      }
    }
  }
});
