import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  MACHINE_POD_ASSEMBLY_ID,
  MACHINE_POD_ASSEMBLY_VERSION,
  POD_COMPONENT_ROLES,
  POD_DIVISION_COUNT,
  POD_PORT_ROLES,
  deriveMachinePodAssembly,
  validateMachinePodAssembly,
} from '../frontend/spatial/machine-pod-assembly.js';

test('S3 shell ribs use bounded authored profiles inside the existing Pod envelope', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-04');
  const assembly = deriveMachinePodAssembly({ part, expansionAmount: 1 });
  const ribs = assembly.mechanicalDetails.filter((item) => item.role === 'shell-rib');

  assert.equal(ribs.length, 6);
  assert.ok(ribs.every((item) => item.profile === 'pod-shell-rib'));
  assert.ok(ribs.every((item) => item.outline?.length === 7));
  assert.ok(ribs.every((item) => item.constructionSlice === 'S3'));
  assert.ok(ribs.every((item) => item.constructionOwner === 'frontend/spatial/machine-pod-assembly.js'));

  const shellRadius = Math.max(
    Number(assembly.components.find((item) => item.role === 'outer-shell')?.dimensions.x || 0),
    Number(assembly.components.find((item) => item.role === 'outer-shell')?.dimensions.z || 0),
  ) * 0.5;
  const ribExtent = Math.max(
    ...ribs.map((item) =>
      Math.hypot(item.center.x - assembly.center.x, item.center.z - assembly.center.z)
      + Math.hypot(item.dimensions.x * 0.5, item.dimensions.z * 0.5),
    ),
  );
  assert.ok(ribExtent <= shellRadius - 0.03);

  const subjectIds = new Set(assembly.subject.sourcePartIds);
  assert.ok(ribs.every((item) => subjectIds.has(item.id)));
});

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
  assert.equal(assembly.mechanicalDetails.length, 31);
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
    assembly.mechanicalDetails.filter((item) => item.role === 'shell-bulkhead').length,
    4,
  );
  assert.equal(
    assembly.mechanicalDetails.filter((item) => item.role === 'shell-face-brace').length,
    4,
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
});

test('S3 fails closed when Pod root ownership is corrupted', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const part = core.byBranch.get('BRANCH-SEAT-01');
  const invalid = { ...part.podAssembly, constructionOwner: 'wrong-owner' };
  assert.equal(validateMachinePodAssembly(invalid).valid, false);
});


test('S3 external shell-face braces stay inside the authored Pod outer envelope', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  for (const part of scene.parts.filter((entry) => entry.kind === 'inner-pod')) {
    const assembly = deriveMachinePodAssembly({ part, expansionAmount: 0 });
    const outer = assembly.components.find((component) => component.role === 'outer-shell');
    const braces = assembly.mechanicalDetails.filter((detail) => detail.role === 'shell-face-brace');
    for (const brace of braces) {
      const reach = Math.hypot(
        brace.center.x - assembly.center.x,
        brace.center.z - assembly.center.z,
      ) + Math.hypot(
        brace.dimensions.x * 0.5,
        brace.dimensions.z * 0.5,
      );
      assert.ok(
        reach < Math.max(outer.dimensions.x, outer.dimensions.z) * 0.5,
        brace.id + ': external brace must remain within outer shell envelope',
      );
    }
  }
});


test('S3 face braces stay mounted to their split shell panels across Seat counts and opening states', () => {
  assert.equal(MACHINE_POD_ASSEMBLY_VERSION, 'S3-V8');

  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const core = createBranchConnectionCore({ seatCount, expansionAmount });
      const pods = core.parts.filter((part) => part.kind === 'inner-pod');

      for (const part of pods) {
        const assembly = part.podAssembly;
        const mechanical = assembly.mechanicalPresentation;
        const outer = assembly.components.find((component) => component.role === 'outer-shell');
        const width = Number(outer.dimensions.x);
        const depth = Number(outer.dimensions.z);
        const shellRadius = Math.max(width, depth) * 0.5;
        const braces = assembly.mechanicalDetails.filter((detail) => detail.role === 'shell-face-brace');
        assert.equal(braces.length, 4);

        const sideCounts = new Map([[-1, 0], [1, 0]]);
        for (const brace of braces) {
          const index = Number(brace.id.split(':').at(-1)) - 1;
          assert.ok(index >= 0 && index < 4, brace.id);

          const angle = mechanical.outwardAngle + Math.PI / 4 + index * (Math.PI * 2 / 4);
          const localAngle = angle - mechanical.outwardAngle;
          const side = Math.sin(localAngle) >= 0 ? 1 : -1;
          sideCounts.set(side, sideCounts.get(side) + 1);

          const faceRadius = shellRadius * 0.42;
          const localX = faceRadius * Math.cos(localAngle);
          const localZ = faceRadius * Math.sin(localAngle);
          const panelAngle = mechanical.outwardAngle + mechanical.shellPanelRotation * side;
          const panelCenter = {
            x: assembly.center.x
              + mechanical.outward.x * mechanical.shellPanelTravel
              + mechanical.tangent.x * mechanical.shellPanelSeparation * side,
            y: assembly.center.y
              + Number(part.dimensions.y) * 0.06
              + mechanical.shellPanelLift,
            z: assembly.center.z
              + mechanical.outward.z * mechanical.shellPanelTravel
              + mechanical.tangent.z * mechanical.shellPanelSeparation * side,
          };

          // This is the renderer's column-major rotateYMatrix transform:
          // x' = cos(theta) * x + sin(theta) * z
          // z' = -sin(theta) * x + cos(theta) * z
          const cosine = Math.cos(panelAngle);
          const sine = Math.sin(panelAngle);
          const expectedX = panelCenter.x + cosine * localX + sine * localZ;
          const expectedZ = panelCenter.z - sine * localX + cosine * localZ;
          const expectedY = panelCenter.y + Number(part.dimensions.y) * 0.12;
          assert.ok(Math.abs(brace.center.x - expectedX) < 1e-9, brace.id + ': X must follow actual panel matrix');
          assert.ok(Math.abs(brace.center.y - expectedY) < 1e-9, brace.id + ': Y must follow panel lift');
          assert.ok(Math.abs(brace.center.z - expectedZ) < 1e-9, brace.id + ': Z must follow actual panel matrix');
          assert.ok(
            Math.abs(brace.rotationY - panelAngle) < 1e-9,
            brace.id + ': brace orientation must match its panel transform',
          );

          const worldDx = brace.center.x - panelCenter.x;
          const worldDz = brace.center.z - panelCenter.z;
          const recoveredLocalX = cosine * worldDx - sine * worldDz;
          const recoveredLocalZ = sine * worldDx + cosine * worldDz;
          assert.ok(Math.abs(recoveredLocalX - localX) < 1e-9, brace.id + ': X must invert to panel-local offset');
          assert.ok(Math.abs(recoveredLocalZ - localZ) < 1e-9, brace.id + ': Z must invert to panel-local offset');

          const panelHalfWidth = width * 0.27;
          const panelHalfDepth = depth * 0.44;
          assert.ok(
            Math.abs(recoveredLocalX) + Number(brace.dimensions.x) * 0.5 <= panelHalfWidth + 1e-9,
            brace.id + ': brace width escaped split panel boundary',
          );
          assert.ok(
            Math.abs(recoveredLocalZ) + Number(brace.dimensions.z) * 0.5 <= panelHalfDepth + 1e-9,
            brace.id + ': brace depth escaped split panel boundary',
          );
          assert.equal(brace.constructionSlice, 'S3');
          assert.equal(brace.constructionOwner, 'frontend/spatial/machine-pod-assembly.js');
          assert.ok(assembly.subject.sourcePartIds.includes(brace.id));
        }

        assert.equal(sideCounts.get(-1), 2, part.branchId + ': two braces must mount to the negative panel');
        assert.equal(sideCounts.get(1), 2, part.branchId + ': two braces must mount to the positive panel');

        if (seatCount > 1) {
          assert.ok(
            assembly.envelope.neighborClearance >= assembly.envelope.requestedClearance - 1e-9,
            part.branchId + ': Seat clearance fell below floor at expansion=' + expansionAmount,
          );
        }
      }
    }
  }
});
