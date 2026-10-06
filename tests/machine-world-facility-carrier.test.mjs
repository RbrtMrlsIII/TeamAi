import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { buildMachineWorldTopology } from '../frontend/spatial/machine-world-topology.js';
import {
  deriveMachineWorldFacilityCarrierDescriptors,
  validateMachineWorldFacilityCarrierDescriptors,
} from '../frontend/spatial/machine-world-facility-carrier.js';

function topologyFor(seatCount = 10) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
  return buildMachineWorldTopology({ scene, clearance: 0.16 });
}

test('S8 facility carrier derives staged mechanical presentation from outer-spine routes', () => {
  const topology = topologyFor(10);
  const descriptors = deriveMachineWorldFacilityCarrierDescriptors(topology);
  assert.equal(descriptors.filter((entry) => entry.shape === 'BOX').length, 12);
  assert.equal(descriptors.filter((entry) => entry.shape === 'TORUS').length, 8);
  assert.equal(new Set(descriptors.map((entry) => entry.semanticEdgeId)).size, 4);
  assert.ok(descriptors.every((entry) => entry.edgeKind === 'outer-spine'));
  assert.ok(descriptors.every((entry) => entry.routeContinuous === true));
  const validation = validateMachineWorldFacilityCarrierDescriptors(descriptors, { topology });
  assert.equal(validation.valid, true, validation.reasons.join(', '));
});

test('S8 facility carrier is world-only and cannot leak into focus scopes', () => {
  const topology = topologyFor(10);
  assert.equal(
    deriveMachineWorldFacilityCarrierDescriptors(topology, { mode: 'DIVISION_FOCUS' }).length,
    0,
  );
  assert.equal(
    deriveMachineWorldFacilityCarrierDescriptors(topology, { mode: 'FACILITY_FOCUS' }).length,
    0,
  );
});

test('S8 facility carrier source and browser copies remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-world-facility-carrier.js', 'utf8');
  const browser = readFileSync('public/machine-world-facility-carrier.js', 'utf8');
  assert.equal(browser, source);
});
