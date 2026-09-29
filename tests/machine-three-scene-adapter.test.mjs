import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  collectThreeDescriptors,
  normalizeThreeDescriptor,
  normalizeThreeShape,
  MACHINE_THREE_ADAPTER_ID,
  MACHINE_THREE_ADAPTER_VERSION,
  resolveThreeMaterialPresentation,
} from '../frontend/spatial/machine-three-scene-adapter.js';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineCoreAssembly } from '../frontend/spatial/machine-core-assembly.js';
import { deriveMachinePodAssembly } from '../frontend/spatial/machine-pod-assembly.js';

test('Y1 adapter exposes one stable rendering bridge identity', () => {
  assert.equal(MACHINE_THREE_ADAPTER_ID, 'MACHINE-THREE-SCENE-ADAPTER');
  assert.equal(MACHINE_THREE_ADAPTER_VERSION, 'Y1-V1');
});

test('Y1 shape normalization preserves authored profiles without changing semantic ids', () => {
  assert.equal(normalizeThreeShape({ shape: 'TORUS' }), 'TORUS');
  assert.equal(normalizeThreeShape({ shape: 'CYL' }), 'CYLINDER');
  assert.equal(normalizeThreeShape({ shape: 'CUBE' }), 'BOX');
  assert.equal(normalizeThreeShape({ shape: 'SPH' }), 'SPHERE');
  assert.equal(normalizeThreeShape({ profile: 'hex-foundation' }), 'CYLINDER');
  assert.equal(normalizeThreeShape({ profile: 'semantic-payload-deck' }), 'BOX');
});

test('Y1 descriptors preserve S2/S3 semantic identity and dimensions', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const hub = machine.parts.find((part) => part.kind === 'hub');
  const podPart = machine.parts.find((part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01');
  const core = deriveMachineCoreAssembly({ hub, workspaceCore: { radius: 4.046 }, adjacentSeatRadius: 5.05 });
  const pod = deriveMachinePodAssembly({ part: podPart, payloadDensity: 0.45, adjacentCenterSpacing: 2.812 });
  const sample = normalizeThreeDescriptor(core.components[0], core.id);
  assert.equal(sample.id, core.components[0].id);
  assert.equal(sample.semanticId, null);
  assert.equal(sample.constructionSlice, 'S2');
  assert.equal(sample.constructionOwner, 'frontend/spatial/machine-core-assembly.js');
  assert.equal(sample.parentId, core.id);
  assert.deepEqual(sample.dimensions, core.components[0].dimensions);
  const descriptors = collectThreeDescriptors({ core, pods: [pod] });
  assert.equal(descriptors.length, core.components.length + core.mechanicalDetails.length + pod.components.length + pod.mechanicalDetails.length);
  assert.ok(descriptors.some((descriptor) => descriptor.id === 'MACHINE-POD:BRANCH-SEAT-01:OUTER-SHELL'));
});

test('Y1 descriptor conversion is fail-closed for malformed input', () => {
  assert.throws(() => normalizeThreeDescriptor(null), /requires an id/);
});


test('Y1 adapter source and browser copy remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  const browser = readFileSync('public/machine-three-scene-adapter.js', 'utf8');
  assert.equal(browser, source);
});


test('Y1 never invents semantic identity for component-only geometry', () => {
  const descriptor = normalizeThreeDescriptor({
    id: 'CORE_FOUNDATION_SHELL',
    center: { x: 1, y: 2, z: 3 },
    dimensions: { x: 4, y: 1, z: 4 },
    constructionSlice: 'S2',
    constructionOwner: 'frontend/spatial/machine-core-assembly.js',
  }, 'MACHINE-CORE-ASSEMBLY');
  assert.equal(descriptor.semanticId, null);
  assert.equal(descriptor.id, 'CORE_FOUNDATION_SHELL');
});

test('Y1 adapter copies are still exact after the structural projection extension', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  const browser = readFileSync('public/machine-three-scene-adapter.js', 'utf8');
  assert.equal(browser, source);
});


test('S24 Three bridge consumes the canonical authored material family', () => {
  const authored = {
    metal: { color: [0.7, 0.71, 0.68], rough: 0.22, emit: 0.01 },
    metal2: { color: [0.42, 0.44, 0.43], rough: 0.40, emit: 0.02 },
    glass: { color: [0.72, 0.80, 0.84], rough: 0.19, emit: 0.04 },
    energy: { color: [0.16, 0.55, 0.88], rough: 0.24, emit: 0.12 },
    trace: { color: [0.28, 0.56, 0.72], rough: 0.34, emit: 0.02 },
    seatShell: { color: [0.89, 0.88, 0.84], rough: 0.50, emit: 0.01 },
    seatShellInset: { color: [0.13, 0.15, 0.14], rough: 0.64, emit: 0 },
    workspaceRing: { color: [0.74, 0.75, 0.71], rough: 0.22, emit: 0.01 },
  };
  const shell = resolveThreeMaterialPresentation('seat-shell', authored);
  assert.equal(shell.authoredRole, 'seatShell');
  assert.deepEqual(shell.color, authored.seatShell.color);
  assert.equal(shell.transparent, false);

  const glass = resolveThreeMaterialPresentation('glass', authored);
  assert.equal(glass.authoredRole, 'glass');
  assert.equal(glass.transparent, true);
  assert.equal(glass.metalness, 0.04);

  const energy = resolveThreeMaterialPresentation('energy', authored);
  assert.deepEqual(energy.emissive, authored.energy.color);
  assert.equal(energy.emissiveIntensity, authored.energy.emit);
});

test('S24 unknown material roles fail to a canonical authored structural family', () => {
  const resolved = resolveThreeMaterialPresentation('unknown-role', {
    metal: { color: [0.7, 0.7, 0.7], rough: 0.3, emit: 0 },
    metal2: { color: [0.4, 0.4, 0.4], rough: 0.4, emit: 0 },
  });
  assert.equal(resolved.authoredRole, 'metal2');
});
