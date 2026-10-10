import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { buildMachineWorldTopology } from '../frontend/spatial/machine-world-topology.js';
import {
  deriveMachineWorldFacilityCarrierDescriptors,
  validateMachineWorldFacilityCarrierDescriptors,
  MACHINE_WORLD_FACILITY_CARRIER_VERSION,
} from '../frontend/spatial/machine-world-facility-carrier.js';

function topologyFor(seatCount = 10, expansionAmount = 0) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount });
  return buildMachineWorldTopology({ scene, clearance: 0.16 });
}

test('S8 facility carrier derives staged mechanical presentation from outer-spine routes', () => {
  const topology = topologyFor(10);
  const descriptors = deriveMachineWorldFacilityCarrierDescriptors(topology);
  assert.equal(descriptors.filter((entry) => entry.shape === 'BOX').length, 12);
  assert.equal(descriptors.filter((entry) => entry.shape === 'TORUS').length, 8);
  assert.equal(MACHINE_WORLD_FACILITY_CARRIER_VERSION, 'S8-FACILITY-CARRIER-V2');
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
  const renderer = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const publicRenderer = readFileSync('public/machine-world-renderer.js', 'utf8');
  const manifest = readFileSync('scripts/machine-spatial-runtime-manifest.mjs', 'utf8');
  assert.equal(publicRenderer, renderer);
  assert.match(renderer, /renderMachineWorldFacilityCarrier/);
  assert.match(renderer, /machineWorldFacilityCarrierRendered/);
  assert.match(manifest, /machine-world-facility-carrier\.js/);
});


test('S8 outer-spine carrier cross-sections stay inside the governed clearance budget', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const topology = topologyFor(seatCount, expansionAmount);
      const descriptors = deriveMachineWorldFacilityCarrierDescriptors(topology);
      const validation = validateMachineWorldFacilityCarrierDescriptors(
        descriptors,
        { topology, clearance: 0.16 },
      );
      assert.equal(validation.valid, true, validation.reasons.join(', '));

      const outerSpines = topology.edges.filter((edge) =>
        edge.kind === 'outer-spine' && edge.routeContinuous === true,
      );
      assert.equal(outerSpines.length, 4);

      for (const descriptor of descriptors) {
        const sourceEdge = outerSpines.find((edge) =>
          edge.semanticEdgeId === descriptor.semanticEdgeId,
        );
        assert.ok(sourceEdge, descriptor.id);
        assert.equal(descriptor.routeContinuous, true);
        const crossSectionRadius = descriptor.shape === 'TORUS'
          ? Math.max(descriptor.dimensions.x, descriptor.dimensions.z) * 0.5
          : Math.hypot(descriptor.dimensions.y * 0.5, descriptor.dimensions.z * 0.5);
        assert.ok(
          crossSectionRadius <= 0.16 + 1e-9,
          descriptor.id + ': cross-section must respect route clearance',
        );
      }
    }
  }
});


test('structural preview consumes the canonical carrier projection and keeps source/public parity', () => {
  const sourcePreview = readFileSync(
    'frontend/spatial/machine-structural-embodiment-preview.js',
    'utf8',
  );
  const publicPreview = readFileSync(
    'public/machine-structural-embodiment-preview.js',
    'utf8',
  );
  assert.equal(publicPreview, sourcePreview);
  assert.match(sourcePreview, /deriveMachineWorldFacilityCarrierDescriptors\(/);
  assert.match(sourcePreview, /validateMachineWorldFacilityCarrierDescriptors\(/);
  assert.doesNotMatch(sourcePreview, /const facilityCarrierDescriptors\s*=\s*\[\s*\]/);
});
