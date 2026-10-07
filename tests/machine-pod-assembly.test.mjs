import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  MACHINE_POD_ASSEMBLY_ID,
  POD_COMPONENT_ROLES,
  POD_DIVISION_COUNT,
  POD_PORT_ROLES,
  deriveMachinePodAssembly,
  validateMachinePodAssembly,
} from '../frontend/spatial/machine-pod-assembly.js';

test('S3 produces authored Pod assemblies across the supported 1-10 population range', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount });
    const pods = core.parts.filter((part) => part.kind === 'inner-pod');
    assert.equal(pods.length, seatCount);
    for (const pod of pods) {
      assert.equal(pod.podAssembly.id, MACHINE_POD_ASSEMBLY_ID);
      assert.equal(pod.podAssembly.constructionSlice, 'S3');
      assert.equal(pod.podAssembly.constructionOwner, 'frontend/spatial/machine-pod-assembly.js');
      assert.deepEqual(pod.podAssembly.components.map((item) => item.role), POD_COMPONENT_ROLES);
      assert.deepEqual(pod.podAssembly.ports.map((item) => item.role), POD_PORT_ROLES);
      assert.equal(pod.podAssembly.divisionAttachmentZone.divisionCount, POD_DIVISION_COUNT);
      assert.equal(validateMachinePodAssembly(pod.podAssembly).valid, true);
    }
  }
});

test('S3 payload surface responds monotonically to payload density', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-01');
  const compact = deriveMachinePodAssembly({ part, payloadDensity: 0 });
  const dense = deriveMachinePodAssembly({ part, payloadDensity: 1 });
  assert.ok(dense.payloadSurface.dimensions.x > compact.payloadSurface.dimensions.x);
  assert.ok(dense.payloadSurface.dimensions.z > compact.payloadSurface.dimensions.z);
});

test('S3 maximum-density adjacent clearance remains above the requested floor', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expanded: true });
  for (const pod of core.parts.filter((part) => part.kind === 'inner-pod')) {
    assert.ok(pod.podAssembly.envelope.neighborClearance >= pod.podAssembly.envelope.requestedClearance);
    assert.ok(pod.podAssembly.envelope.radius * 2 >= Math.hypot(
      pod.podAssembly.localInterfaces.connection.point.x - pod.center.x,
      pod.podAssembly.localInterfaces.connection.point.z - pod.center.z,
    ) * 2);
  }
});

test('S3 connection and signal interfaces live on opposite local Pod faces', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const pod = core.byBranch.get('BRANCH-SEAT-01');
  const assembly = pod.podAssembly;
  const connectionVector = {
    x: assembly.localInterfaces.connection.point.x - assembly.center.x,
    z: assembly.localInterfaces.connection.point.z - assembly.center.z,
  };
  const signalVector = {
    x: assembly.localInterfaces.signal.point.x - assembly.center.x,
    z: assembly.localInterfaces.signal.point.z - assembly.center.z,
  };
  const outward = {
    x: Math.cos(Math.atan2(assembly.center.z, assembly.center.x)),
    z: Math.sin(Math.atan2(assembly.center.z, assembly.center.x)),
  };
  const connectionProjection = connectionVector.x * outward.x + connectionVector.z * outward.z;
  const signalProjection = signalVector.x * outward.x + signalVector.z * outward.z;
  assert.ok(connectionProjection < 0);
  assert.ok(signalProjection > 0);
  assert.deepEqual(pod.port, assembly.localInterfaces.connection.point);
});

test('S3 expansion preserves Pod identity while changing local articulation', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-04');
  const collapsed = deriveMachinePodAssembly({ part, expansionAmount: 0 });
  const expanded = deriveMachinePodAssembly({ part, expansionAmount: 1 });
  assert.equal(expanded.id, collapsed.id);
  assert.equal(expanded.branchId, collapsed.branchId);
  assert.notEqual(expanded.articulation.phase, collapsed.articulation.phase);
  assert.notDeepEqual(expanded.subject, collapsed.subject);
});

test('S3 authored Pod opening profile transforms the parent machine instead of only child divisions', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-04');
  const collapsed = deriveMachinePodAssembly({ part, expansionAmount: 0 });
  const opening = deriveMachinePodAssembly({ part, expansionAmount: 0.5 });
  const expanded = deriveMachinePodAssembly({ part, expansionAmount: 1 });

  assert.equal(collapsed.mechanicalPresentation.amount, 0);
  assert.equal(expanded.mechanicalPresentation.amount, 1);
  assert.ok(expanded.mechanicalPresentation.shellPanelSeparation > opening.mechanicalPresentation.shellPanelSeparation);
  assert.ok(expanded.mechanicalPresentation.shellPanelTravel > opening.mechanicalPresentation.shellPanelTravel);
  assert.ok(expanded.mechanicalPresentation.chamberTravel > opening.mechanicalPresentation.chamberTravel);
  assert.ok(expanded.mechanicalPresentation.payloadTravel > opening.mechanicalPresentation.payloadTravel);
  assert.ok(expanded.mechanicalPresentation.payloadLift > 0);
  assert.ok(expanded.mechanicalPresentation.shellPanelRotation > 0);
  assert.equal(expanded.mechanicalPresentation.axis, 'radial-outward');
  const expandedSubjectIds = new Set(expanded.subject.sourcePartIds);
  const nonShellComponentIds = expanded.components
    .filter((item) => item.role !== 'outer-shell')
    .map((item) => item.id);
  assert.ok(nonShellComponentIds.every((id) => expandedSubjectIds.has(id)));
  assert.ok(expandedSubjectIds.has('MACHINE-POD:BRANCH-SEAT-04:OUTER-SHELL:PANEL:-1'));
  assert.ok(expandedSubjectIds.has('MACHINE-POD:BRANCH-SEAT-04:OUTER-SHELL:PANEL:1'));
  assert.ok(expanded.mechanicalPresentation.payloadTravel > 0);
});

test('S3 Pod mechanical details are authored, bounded, and included in the subject', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-04');
  const assembly = deriveMachinePodAssembly({ part, expansionAmount: 1 });
  assert.equal(assembly.mechanicalDetails.length, 17);
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'docking-strut').length,
    2,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'panel-rail').length,
    2,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'hinge-joint').length,
    2,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'chamber-rib').length,
    4,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'payload-collar').length,
    1,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'lower-plinth').length,
    1,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'upper-payload-frame').length,
    1,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'side-actuator').length,
    2,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'chamber-lock').length,
    2,
  );
  const subjectIds = new Set(assembly.subject.sourcePartIds);
  assert.ok(assembly.mechanicalDetails.every((item) => subjectIds.has(item.id)));
  assert.ok(assembly.mechanicalDetails.every((item) => item.constructionSlice === 'S3'));
  assert.ok(assembly.mechanicalDetails.every((item) => item.constructionOwner === 'frontend/spatial/machine-pod-assembly.js'));
  const detailReach = Math.max(...assembly.mechanicalDetails.map((item) =>
    Math.hypot(
      item.center.x - assembly.center.x,
      item.center.z - assembly.center.z,
    ) + Math.hypot(
      item.dimensions.x * 0.5,
      item.dimensions.z * 0.5,
    )
  ));
  assert.ok(assembly.envelope.radius >= detailReach);
  assert.ok(assembly.envelope.neighborClearance >= assembly.envelope.requestedClearance);
});

test('S3 fails closed when Pod root ownership is corrupted', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-01');
  const invalid = { ...part.podAssembly, constructionOwner: 'wrong-owner' };
  assert.equal(validateMachinePodAssembly(invalid).valid, false);
});
