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