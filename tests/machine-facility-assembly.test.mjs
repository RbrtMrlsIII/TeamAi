import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MACHINE_FACILITY_ASSEMBLY_ID,
  MACHINE_FACILITY_ASSEMBLY_VERSION,
  MACHINE_PRODUCT_FACILITY_IDS,
  deriveMachineFacilityAssemblies,
  validateMachineFacilityAssemblies,
} from '../frontend/spatial/machine-facility-assembly.js';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { requiredStructuralRootsForSlice } from '../frontend/spatial/machine-spatial-root-contract.js';

test('S6 maps the eleven product facilities onto four outer machine destinations', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const outer = core.parts.filter((part) => part.kind === 'outer-housing');
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: outer });
  const result = validateMachineFacilityAssemblies(assemblies);
  assert.equal(result.valid, true, result.reasons.join(', '));
  assert.equal(assemblies.length, 4);
  assert.equal(new Set(assemblies.flatMap((assembly) => assembly.facilities.map((facility) => facility.id))).size, 11);
  assert.equal(MACHINE_PRODUCT_FACILITY_IDS.length, 11);
});

test('S6 facility destinations never become Seat/Pod children', () => {
  const core = createBranchConnectionCore({ seatCount: 3, expansionAmount: 0 });
  const outer = core.parts.filter((part) => part.kind === 'outer-housing');
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: outer });
  assert.ok(assemblies.every((assembly) => assembly.seatHierarchyParent === null));
  assert.ok(assemblies.every((assembly) => assembly.outerHousing.branchId.startsWith('BRANCH-OUTER-')));
});

test('S6 source modules remain references, not spatial authority', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.deepEqual(
    new Set(assemblies.flatMap((assembly) => assembly.facilities.map((facility) => facility.sourceModule))),
    new Set([
      'workspace-capability-facility.js',
      'projects-library',
      'artifacts.js',
      'storage-inventory-facility.js',
      'team-agents-facility.js',
      'skills-responsibility',
      'mcp-capability-facility.js',
      'orchestration-scheduler',
      'settings.js',
      'marketplace-commerce-facility.js',
      'auth-gateway',
    ]),
  );
});

test('S6 assembly root inherits the complete predecessor prefix and versioned identity', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assembly = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  })[0];
  assert.equal(assembly.version, MACHINE_FACILITY_ASSEMBLY_VERSION);
  assert.equal(assembly.constructionSlice, 'S6');
  assert.deepEqual(assembly.inheritedStructuralRoots, requiredStructuralRootsForSlice('S6'));
  assert.equal(assembly.seatHierarchyParent, null);
  assert.ok(assembly.facilities.length > 0);
});

test('S6 each product facility has a stable physical port and subject', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  for (const assembly of assemblies) {
    assert.equal(assembly.id.startsWith(MACHINE_FACILITY_ASSEMBLY_ID + ':'), true);
    assert.ok(assembly.ports.every((port) => Number.isFinite(port.point.x) && Number.isFinite(port.point.y) && Number.isFinite(port.point.z)));
    assert.ok(assembly.subject);
    assert.ok(assembly.envelope.radius > 0);
  }
});
