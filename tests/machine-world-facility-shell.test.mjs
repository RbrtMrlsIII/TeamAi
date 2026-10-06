import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import {
  deriveMachineWorldFacilityShellDescriptors,
  validateMachineWorldFacilityShellDescriptors,
} from '../frontend/spatial/machine-world-facility-shell.js';

test('S7 outer facility shells derive one coherent body for each authored module', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);
  assert.equal(descriptors.length, 4);
  assert.equal(new Set(descriptors.map((entry) => entry.branchId)).size, 4);
  assert.deepEqual(descriptors.map((entry) => entry.silhouette).sort(), ['arc', 'blade', 'diamond', 'fin']);
  assert.ok(descriptors.every((entry) => entry.presentationOnly === true));
  assert.ok(validateMachineWorldFacilityShellDescriptors(descriptors).valid);
});

test('S7 outer facility shells are World-only', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  assert.equal(deriveMachineWorldFacilityShellDescriptors(facilities, { mode: 'DIVISION_FOCUS' }).length, 0);
});

test('S7 outer facility shell source and browser copies remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-world-facility-shell.js', 'utf8');
  const browser = readFileSync('public/machine-world-facility-shell.js', 'utf8');
  assert.equal(browser, source);
});

test('S7 authored facility bodies use bounded faceted outlines rather than coarse box-only shells', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);

  const signedTurn = (a, b, c) => (
    (b[0] - a[0]) * (c[1] - b[1])
    - (b[1] - a[1]) * (c[0] - b[0])
  );

  for (const entry of descriptors) {
    if (entry.layer !== 'main-shell') continue;
    assert.ok(Array.isArray(entry.outline));
    assert.ok(entry.outline.length >= 8);
    assert.ok(entry.outline.every((point) => point.length === 2 && point.every(Number.isFinite)));
    const turns = entry.outline.map((point, index) => {
      const prev = entry.outline[(index - 1 + entry.outline.length) % entry.outline.length];
      const next = entry.outline[(index + 1) % entry.outline.length];
      return signedTurn(prev, point, next);
    });
    assert.ok(turns.every((turn) => turn > 0), entry.branchId + ': outline must remain convex and ordered');
    const radii = entry.outline.map(([x, z]) => Math.hypot(x, z));
    assert.ok(Math.max(...radii) <= 1.30, entry.branchId + ': outline radial factor exceeded body bound');
  }
});


test('S7 layered facility bodies remain contained by their authored main-body envelope', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);

  for (const branchId of new Set(descriptors.map((entry) => entry.branchId))) {
    const main = descriptors.find((entry) => entry.branchId === branchId && entry.layer === 'main-shell');
    assert.ok(main);
    for (const entry of descriptors.filter((candidate) => candidate.branchId === branchId)) {
      assert.ok(
        entry.center.x - entry.dimensions.x / 2 >= main.center.x - main.dimensions.x / 2 - 1e-9,
        entry.id + ': lower X bound escaped',
      );
      assert.ok(
        entry.center.x + entry.dimensions.x / 2 <= main.center.x + main.dimensions.x / 2 + 1e-9,
        entry.id + ': upper X bound escaped',
      );
      assert.ok(
        entry.center.z - entry.dimensions.z / 2 >= main.center.z - main.dimensions.z / 2 - 1e-9,
        entry.id + ': lower Z bound escaped',
      );
      assert.ok(
        entry.center.z + entry.dimensions.z / 2 <= main.center.z + main.dimensions.z / 2 + 1e-9,
        entry.id + ': upper Z bound escaped',
      );
      assert.ok(
        entry.center.y - entry.dimensions.y / 2 >= main.center.y - main.dimensions.y / 2 - 1e-9,
        entry.id + ': lower Y bound escaped',
      );
      assert.ok(
        entry.center.y + entry.dimensions.y / 2 <= main.center.y + main.dimensions.y / 2 + 1e-9,
        entry.id + ': upper Y bound escaped',
      );
    }
  }
});
