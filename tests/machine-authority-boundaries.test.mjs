import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineSeatDivisionAssembly } from '../frontend/spatial/machine-seat-division-assembly.js';
import { deriveFocusedSeatDivisionGeometry } from '../frontend/spatial/machine-seat-division-presentation.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import {
  buildMachineWorldTopology,
  validateMachineWorldTopology,
} from '../frontend/spatial/machine-world-topology.js';
import { MACHINE_EXPANSION_PHASE } from '../frontend/spatial/machine-expansion-mechanism.js';

const DIVISIONS = [
  'SEAT_CONNECTION',
  'SEAT_BEHAVIOR',
  'SEAT_TOOLKIT',
  'SEAT_CAPABILITIES',
  'SEAT_AUTHORIZATION',
  'SEAT_WORKSPACE_SCOPE',
  'SEAT_TASK_EVIDENCE',
];

function buildFixture() {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const outerHousings = scene.parts.filter((part) => part.kind === 'outer-housing');
  const facilityAssemblies = deriveMachineFacilityAssemblies({ outerHousings });
  const facilityMachinery = deriveMachineFacilityMachinery({ facilityAssemblies });
  const topology = buildMachineWorldTopology({
    scene,
    facilityAssemblies,
    facilityMachinery,
  });
  return { scene, facilityAssemblies, facilityMachinery, topology };
}

test('C1 facility, division, and expansion authorities remain bounded to their owning slices', () => {
  const { scene, facilityAssemblies, facilityMachinery } = buildFixture();

  assert.equal(new Set(facilityAssemblies.map((assembly) => assembly.constructionOwner)).size, 1);
  assert.equal(
    facilityAssemblies[0].constructionOwner,
    'frontend/spatial/machine-facility-assembly.js',
  );
  assert.equal(
    facilityMachinery.every(
      (machine) =>
        machine.constructionSlice === 'S7' &&
        machine.constructionOwner === 'frontend/spatial/machine-facility-machinery.js',
    ),
    true,
  );

  const source = scene.byBranch.get('BRANCH-SEAT-01');
  for (const [childIndex, childId] of DIVISIONS.entries()) {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent: source,
      childId,
      childIndex,
      amount: 1,
    });
    const assembly = deriveMachineSeatDivisionAssembly({
      parent: source,
      childId,
      childIndex,
      amount: 1,
      geometry,
    });
    assert.equal(assembly.constructionSlice, 'S4');
    assert.equal(
      assembly.constructionOwner,
      'frontend/spatial/machine-seat-division-assembly.js',
    );
  }

  assert.deepEqual(
    Object.keys(MACHINE_EXPANSION_PHASE),
    ['CLOSED', 'PREPARING', 'OPENING', 'ACTIVE', 'CLOSING', 'CLEARANCE_LIMITED'],
  );
});

test('C1 semantic expansion state and physical expansion mechanism do not become a second authority', () => {
  const semanticSource = readFileSync(
    new URL('../public/hero-hierarchy-runtime.js', import.meta.url),
    'utf8',
  );
  const physicalSource = readFileSync(
    new URL('../frontend/spatial/machine-expansion-mechanism.js', import.meta.url),
    'utf8',
  );

  assert.equal(physicalSource.includes('hero-hierarchy-runtime'), false);
  assert.equal(physicalSource.includes('HIERARCHY_PHASE'), false);
  assert.equal(semanticSource.includes('machine-expansion-mechanism'), false);
  assert.equal(semanticSource.includes('HIERARCHY_PHASE'), true);
});

test('C1 authored ports, corridor reservations, and aggregate edges stay single-source in S8', () => {
  const { facilityAssemblies, facilityMachinery, topology } = buildFixture();
  const validation = validateMachineWorldTopology(topology, { expectedSeatCount: 10 });
  assert.equal(validation.valid, true, validation.reasons.join(', '));

  for (const assembly of facilityAssemblies) {
    assert.ok(assembly.ports.length > 0);
    assert.equal(
      assembly.ports.every(
        (port) =>
          port.constructionSlice === 'S6' &&
          port.constructionOwner === 'frontend/spatial/machine-facility-assembly.js',
      ),
      true,
    );
  }

  for (const machine of facilityMachinery) {
    assert.equal(
      machine.ports.every(
        (port) =>
          port.constructionSlice === 'S7' &&
          port.constructionOwner === 'frontend/spatial/machine-facility-machinery.js',
      ),
      true,
    );
  }

  const edgeIds = new Set();
  for (const edge of topology.edges) {
    assert.equal(edge.constructionSlice, 'S8');
    assert.equal(edge.constructionOwner, 'frontend/spatial/machine-world-topology.js');
    assert.ok(edge.semanticEdgeId);
    assert.equal(edgeIds.has(edge.semanticEdgeId), false);
    edgeIds.add(edge.semanticEdgeId);

    if (!['inner-spoke', 'outer-spine', 'lattice-link'].includes(edge.kind)) {
      assert.equal(edge.corridorReserved, true);
      assert.equal(edge.corridor.id, 'CORRIDOR:' + edge.semanticEdgeId);
      assert.equal(edge.corridor.semanticEdgeId, edge.semanticEdgeId);
    }
  }
});
