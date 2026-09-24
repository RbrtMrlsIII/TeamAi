import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { requiredStructuralRootsForSlice } from '../frontend/spatial/machine-spatial-root-contract.js';
import {
  MACHINE_SEAT_DIVISION_COMPONENT_PROFILES,
  MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES,
  MACHINE_SEAT_DIVISION_ASSEMBLY_ID,
  MACHINE_SEAT_DIVISION_ASSEMBLY_VERSION,
  deriveMachineSeatDivisionAssembly,
  validateMachineSeatDivisionAssembly,
} from '../frontend/spatial/machine-seat-division-assembly.js';
import {
  deriveFocusedSeatDivisionGeometry,
  resolveSeatDivisionAttachmentTransform,
} from '../frontend/spatial/machine-seat-division-presentation.js';

const divisions = [
  'SEAT_CONNECTION',
  'SEAT_BEHAVIOR',
  'SEAT_TOOLKIT',
  'SEAT_CAPABILITIES',
  'SEAT_AUTHORIZATION',
  'SEAT_WORKSPACE_SCOPE',
  'SEAT_TASK_EVIDENCE',
];

test('S4 derives a rooted physical assembly for every semantic division family', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  for (const [childIndex, childId] of divisions.entries()) {
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 });
    const assembly = deriveMachineSeatDivisionAssembly({ parent, childId, childIndex, amount: 1, geometry });
    assert.equal(assembly.id, MACHINE_SEAT_DIVISION_ASSEMBLY_ID);
    assert.equal(assembly.version, MACHINE_SEAT_DIVISION_ASSEMBLY_VERSION);
    assert.equal(assembly.semanticId, childId);
    assert.equal(assembly.constructionSlice, 'S4');
    assert.ok(assembly.components.every((component) =>
      component.dimensions.x === component.scale.x * 2
      && component.dimensions.y === component.scale.y
      && component.dimensions.z === component.scale.z * 2
    ));
    assert.equal(assembly.constructionOwner, 'frontend/spatial/machine-seat-division-assembly.js');
    assert.ok(assembly.mechanism.attachment?.type);
    assert.equal(
      assembly.mechanism.attachment.primaryComponent,
      MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES[childId].primaryComponent,
    );
    assert.deepEqual(assembly.inheritedStructuralRoots, requiredStructuralRootsForSlice('S4'));
    assert.ok(assembly.components.every((component) => component.inheritedStructuralRoots.join(',') === requiredStructuralRootsForSlice('S4').join(',')));
    assert.equal(validateMachineSeatDivisionAssembly(assembly).valid, true);
  }
});

test('S4 geometry families are semantically distinct rather than one universal primitive recipe', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  const signatures = new Set();
  for (const [childIndex, childId] of divisions.entries()) {
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 });
    const assembly = deriveMachineSeatDivisionAssembly({ parent, childId, childIndex, amount: 1, geometry });
    signatures.add(
      assembly.components.map(({ profile, shape }) => profile + ':' + shape).join('|'),
    );
  }
  assert.equal(signatures.size, divisions.length);
  for (const childId of divisions) assert.equal(MACHINE_SEAT_DIVISION_COMPONENT_PROFILES[childId].length, 3);
});

test('S4 assembly identity remains stable across expansion and geometry mutation', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  const compactGeometry = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_CONNECTION', childIndex: 0, amount: 0 });
  const openGeometry = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_CONNECTION', childIndex: 0, amount: 1 });
  const compact = deriveMachineSeatDivisionAssembly({ parent, childId: 'SEAT_CONNECTION', childIndex: 0, amount: 0, geometry: compactGeometry });
  const open = deriveMachineSeatDivisionAssembly({ parent, childId: 'SEAT_CONNECTION', childIndex: 0, amount: 1, geometry: openGeometry });
  assert.equal(compact.id, open.id);
  assert.equal(compact.semanticId, open.semanticId);
  assert.equal(compact.branchId, open.branchId);
  assert.notDeepEqual(compact.subject, open.subject);
});

test('S4 assembly envelopes expand monotonically with authored division travel', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-04');
  const compactGeometry = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_TOOLKIT', childIndex: 2, amount: 0 });
  const openGeometry = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_TOOLKIT', childIndex: 2, amount: 1 });
  const compact = deriveMachineSeatDivisionAssembly({ parent, childId: 'SEAT_TOOLKIT', childIndex: 2, amount: 0, geometry: compactGeometry });
  const open = deriveMachineSeatDivisionAssembly({ parent, childId: 'SEAT_TOOLKIT', childIndex: 2, amount: 1, geometry: openGeometry });
  assert.ok(open.envelope.radius >= compact.envelope.radius);
  assert.ok(open.envelope.radialDistance > compact.envelope.radialDistance);
});

test('S4 invalid family cannot validate as a different division', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId: 'SEAT_AUTHORIZATION', childIndex: 4, amount: 1 });
  const assembly = deriveMachineSeatDivisionAssembly({ parent, childId: 'SEAT_AUTHORIZATION', childIndex: 4, amount: 1, geometry });
  const invalid = { ...assembly, semanticId: 'SEAT_TOOLKIT' };
  const result = validateMachineSeatDivisionAssembly(invalid, { expectedSemanticId: 'SEAT_AUTHORIZATION' });
  assert.equal(result.valid, false);
});

test('S4 all seven assemblies expose geometry-aware ports and finite subjects', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  for (const [childIndex, childId] of divisions.entries()) {
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 0.5 });
    const assembly = deriveMachineSeatDivisionAssembly({ parent, childId, childIndex, amount: 0.5, geometry });
    assert.equal(assembly.ports.length, 2);
    assert.ok(assembly.ports.every((port) => Number.isFinite(port.point.x) && Number.isFinite(port.point.y) && Number.isFinite(port.point.z)));
    assert.ok(assembly.subject);
    assert.ok(assembly.interfaceSubject);
    assert.ok(Number.isFinite(assembly.subject.center.x));
    assert.ok(
      assembly.subject.sourcePartIds.every((id) => !String(id).includes(':WORKSPACE_PORT')),
    );
  }
});

test('S4 radial attachment travel follows the authored division outward axis', () => {
  const angle = Math.PI * 0.73;
  const travel = 0.32;
  const assembly = {
    geometry: { angle: angle - Math.PI },
    mechanism: {
      attachment: {
        primaryComponent: 'equipment-rack',
        motion: 'translate',
        travel,
      },
    },
  };
  const component = { profile: 'equipment-rack', rotationY: 0 };
  const transform = resolveSeatDivisionAttachmentTransform(assembly, component, 1);
  assert.ok(Math.abs(transform.x - Math.cos(angle) * travel) < 1e-9);
  assert.ok(Math.abs(transform.z - Math.sin(angle) * travel) < 1e-9);
});
test('S4 attachment mechanisms are distinct across all seven semantic families', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const parent = core.byBranch.get('BRANCH-SEAT-01');
  const types = new Set();
  for (const [childIndex, childId] of divisions.entries()) {
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 });
    const assembly = deriveMachineSeatDivisionAssembly({ parent, childId, childIndex, amount: 1, geometry });
    types.add(assembly.mechanism.attachment.type);
  }
  assert.equal(types.size, divisions.length);
});
