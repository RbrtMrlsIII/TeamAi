import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import {
  deriveMachineWorldFacilityDockingEmbodiment,
  validateMachineWorldFacilityDockingEmbodiment,
  MACHINE_WORLD_FACILITY_DOCKING_EMBODIMENT_VERSION,
} from '../frontend/spatial/machine-world-facility-docking-embodiment.js';

function buildMachinery(seatCount, expansionAmount = 0) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount });
  const facilityAssemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  return deriveMachineFacilityMachinery({ facilityAssemblies });
}

test('S8 facility endpoint embodiment projects only existing authored ports', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 1]) {
      const machinery = buildMachinery(seatCount, expansionAmount);
      const descriptors = deriveMachineWorldFacilityDockingEmbodiment(machinery);
      const validation = validateMachineWorldFacilityDockingEmbodiment(
        descriptors,
        machinery,
      );

      assert.equal(validation.valid, true, validation.reasons.join(', '));
      assert.equal(validation.descriptorCount, 19);
      assert.equal(validation.endpointCount, 8);
      assert.equal(validation.facilityCount, 11);

      const authoredMachinePortIds = new Set(
        machinery.flatMap((machine) =>
          machine.ports
            .filter((port) => port.role === 'machine-core-input' || port.role === 'machine-output')
            .map((port) => port.id),
        ),
      );
      const authoredFacilityAdapterIds = new Set(
        machinery.flatMap((machine) =>
          machine.physicalInterfaces
            .filter((entry) => entry.role === 'facility-port-adapter')
            .map((entry) => entry.portId),
        ),
      );

      for (const entry of descriptors) {
        if (entry.role === 'machine-endpoint-collar') {
          assert.ok(authoredMachinePortIds.has(entry.portId), entry.id);
        } else {
          assert.ok(authoredFacilityAdapterIds.has(entry.portId), entry.id);
        }
        assert.equal(entry.constructionSlice, 'S8');
        assert.equal(entry.semanticBoundary, 'presentation-only');
      }
    }
  }
});

test('S8 facility endpoint collars preserve inter-machine clearance', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 1]) {
      const machinery = buildMachinery(seatCount, expansionAmount);
      const descriptors = deriveMachineWorldFacilityDockingEmbodiment(machinery);

      for (const entry of descriptors) {
        const owner = machinery.find((machine) =>
          entry.id.startsWith('FACILITY-ENDPOINT:' + machine.branchId + ':')
          || entry.id.startsWith('FACILITY-FLANGE:' + machine.branchId + ':')
        );
        assert.ok(owner, entry.id);
        for (const other of machinery) {
          if (other === owner) continue;
          const ax = entry.connectorStart.x;
          const az = entry.connectorStart.z;
          const bx = entry.connectorEnd.x;
          const bz = entry.connectorEnd.z;
          const px = other.outerHousing.center.x;
          const pz = other.outerHousing.center.z;
          const abx = bx - ax;
          const abz = bz - az;
          const ab2 = abx * abx + abz * abz;
          const projection = Math.max(
            0,
            Math.min(
              1,
              ((px - ax) * abx + (pz - az) * abz) / Math.max(0.000001, ab2),
            ),
          );
          const closestX = ax + abx * projection;
          const closestZ = az + abz * projection;
          const segmentDistance = Math.hypot(closestX - px, closestZ - pz);
          assert.ok(
            segmentDistance - Number(other.envelope.radius) - Number(entry.radius) >= 0.16 - 1e-9,
            entry.id + ': connector clearance against ' + other.branchId
              + ' at seats=' + seatCount + ', expansion=' + expansionAmount,
          );
        }
      }
    }
  }
});

test('S8 facility endpoint collars stay within the declared compact envelope', () => {
  const machinery = buildMachinery(10, 1);
  const descriptors = deriveMachineWorldFacilityDockingEmbodiment(machinery);
  assert.ok(descriptors.every((entry) => entry.radius >= 0.08 && entry.radius <= 0.16));
  assert.ok(descriptors.every((entry) => entry.length >= 0.07 && entry.length <= 0.30));
  assert.ok(descriptors.every((entry) =>
    [entry.point.x, entry.point.y, entry.point.z, entry.center.x, entry.center.y, entry.center.z]
      .every(Number.isFinite)
  ));
  assert.equal(
    new Set(descriptors.map((entry) => entry.id)).size,
    descriptors.length,
  );
});

test('S8 facility endpoint renderer and public manifest consume the embodiment module', () => {
  const renderer = readFileSync(
    'frontend/spatial/machine-world-renderer.js',
    'utf8',
  );
  const publicRenderer = readFileSync(
    'public/machine-world-renderer.js',
    'utf8',
  );
  const manifest = readFileSync(
    'scripts/machine-spatial-runtime-manifest.mjs',
    'utf8',
  );
  const sourceModule = readFileSync(
    'frontend/spatial/machine-world-facility-docking-embodiment.js',
    'utf8',
  );
  const publicModule = readFileSync(
    'public/machine-world-facility-docking-embodiment.js',
    'utf8',
  );

  assert.equal(MACHINE_WORLD_FACILITY_DOCKING_EMBODIMENT_VERSION, 'S8-ENDPOINT-V3');
  assert.match(renderer, /machine-world-facility-docking-embodiment.js/);
  assert.match(renderer, /renderMachineWorldFacilityDockingEmbodiment/);
  assert.match(renderer, /machineWorldFacilityDockingCount/);
  assert.match(renderer, /machineWorldFacilityDockingEndpointCount/);
  assert.match(renderer, /machineWorldFacilityDockingFacilityCount/);
  assert.equal(publicRenderer, renderer);
  assert.equal(publicModule, sourceModule);
  assert.match(manifest, /machine-world-facility-docking-embodiment.js/);
});


test('S8 facility endpoints expose an authored outward connector span', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 1]) {
      const machinery = buildMachinery(seatCount, expansionAmount);
      const descriptors = deriveMachineWorldFacilityDockingEmbodiment(machinery);

      for (const entry of descriptors) {
        const owner = machinery.find((machine) =>
          entry.id.startsWith('FACILITY-ENDPOINT:' + machine.branchId + ':')
          || entry.id.startsWith('FACILITY-FLANGE:' + machine.branchId + ':'),
        );
        assert.ok(owner, entry.id);

        const dx = entry.point.x - owner.outerHousing.center.x;
        const dz = entry.point.z - owner.outerHousing.center.z;
        const radialLength = Math.hypot(dx, dz);
        assert.ok(radialLength > 0, entry.id);

        const radialX = dx / radialLength;
        const radialZ = dz / radialLength;
        assert.ok(
          Math.hypot(entry.direction.x - radialX, entry.direction.z - radialZ) < 1e-9,
          entry.id + ': direction must follow authored radial basis',
        );

        const span = Math.hypot(
          entry.connectorEnd.x - entry.connectorStart.x,
          entry.connectorEnd.z - entry.connectorStart.z,
        );
        assert.ok(span >= entry.length * 0.99, entry.id + ': connector span');
        assert.ok(
          Math.hypot(
            entry.connectorEnd.x - owner.outerHousing.center.x,
            entry.connectorEnd.z - owner.outerHousing.center.z,
          ) > radialLength + 0.12,
          entry.id + ': connector must protrude outward',
        );
        assert.ok(
          Math.abs(entry.center.x - (entry.connectorStart.x + entry.connectorEnd.x) * 0.5) < 1e-9
          && Math.abs(entry.center.z - (entry.connectorStart.z + entry.connectorEnd.z) * 0.5) < 1e-9,
          entry.id + ': center must bisect connector span',
        );
      }
    }
  }
});
