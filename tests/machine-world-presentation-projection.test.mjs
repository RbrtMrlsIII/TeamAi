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

test('World presentation source and browser copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/machine-world-presentation-projection.js', 'utf8'), readFileSync('public/machine-world-presentation-projection.js', 'utf8'));
});