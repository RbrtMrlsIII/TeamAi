import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  FINAL_PROOF_SLICES,
  PRODUCT_RUNTIME_SLICES,
  SPATIAL_SLICE_PHASES,
  SPATIAL_SLICE_PLAN,
  STRUCTURAL_ROOT_SLICES,
  WORLD_EXPRESSION_SLICES,
  createSpatialConstructionContext,
  requiredStructuralRootsForSlice,
  validateSpatialConstructionNode,
  validateSpatialRootedCore,
} from '../frontend/spatial/machine-spatial-root-contract.js';

test('structural roots are exactly S0-S10 and later layers inherit them', () => {
  assert.deepEqual(STRUCTURAL_ROOT_SLICES, Array.from({ length: 11 }, (_, index) => `S${index}`));
  assert.deepEqual(requiredStructuralRootsForSlice('S0'), []);
  assert.deepEqual(requiredStructuralRootsForSlice('S1'), ['S0']);
  assert.deepEqual(requiredStructuralRootsForSlice('S10'), ['S0','S1','S2','S3','S4','S5','S6','S7','S8','S9']);
  assert.deepEqual(requiredStructuralRootsForSlice('S11'), STRUCTURAL_ROOT_SLICES);
  assert.deepEqual(requiredStructuralRootsForSlice('S21'), STRUCTURAL_ROOT_SLICES);
  assert.deepEqual(requiredStructuralRootsForSlice('S29'), STRUCTURAL_ROOT_SLICES);
  assert.deepEqual(requiredStructuralRootsForSlice('S33'), STRUCTURAL_ROOT_SLICES);
  assert.equal(PRODUCT_RUNTIME_SLICES.length, 11);
  assert.equal(WORLD_EXPRESSION_SLICES.length, 8);
  assert.deepEqual(FINAL_PROOF_SLICES, ['S30','S31','S32','S33']);
  assert.equal(SPATIAL_SLICE_PLAN.length, 34);
  assert.deepEqual(SPATIAL_SLICE_PLAN[0], { slice: 'S0', layer: 'structural-root' });
  assert.deepEqual(SPATIAL_SLICE_PLAN[33], { slice: 'S33', layer: 'verification-acceptance' });
  assert.deepEqual(SPATIAL_SLICE_PHASES.map((phase) => phase.to), [10,21,29,33]);
});

test('construction contexts make owner and inherited-root requirements explicit', () => {
  const context = createSpatialConstructionContext({
    slice: 'S13',
    owner: 'frontend/spatial/workspace-capability-facility.js',
    semanticId: 'WORKSPACE_CENTER',
  });
  assert.equal(context.constructionLayer, 'product-runtime');
  assert.equal(context.constructionOwner, 'frontend/spatial/workspace-capability-facility.js');
  assert.deepEqual(context.inheritedStructuralRoots, STRUCTURAL_ROOT_SLICES);
  assert.equal(validateSpatialConstructionNode(context).valid, true);
});

test('semantic identity is required unless the node is explicitly presentation-only', () => {
  const invalid = createSpatialConstructionContext({
    slice: 'S13',
    owner: 'test-owner',
  });
  assert.equal(validateSpatialConstructionNode(invalid).valid, false);
  assert.ok(validateSpatialConstructionNode(invalid).reasons.includes('MISSING_SEMANTIC_ID'));

  const presentation = createSpatialConstructionContext({
    slice: 'S7',
    owner: 'frontend/spatial/machine-core-layout.js',
    semanticBoundary: 'presentation-only',
  });
  assert.equal(validateSpatialConstructionNode(presentation).valid, true);
});

test('current machine core carries explicit S2/S3/S7 roots and S8 topology', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expanded: true });
  assert.equal(core.rootValidation.valid, true);
  assert.equal(core.constructionSlice, 'S1');
  assert.equal(core.constructionOwner, 'frontend/spatial/machine-core-layout.js');
  assert.deepEqual(core.inheritedStructuralRoots, ['S0']);
  assert.equal(core.hub.constructionSlice, 'S2');
  assert.equal(core.hub.constructionOwner, 'frontend/spatial/hero-workspace-core.js');
  assert.equal(core.parts.filter((part) => part.kind === 'inner-pod').every((part) => part.constructionSlice === 'S3'), true);
  assert.equal(core.parts.filter((part) => part.kind === 'inner-pod').every((part) => part.constructionOwner === 'frontend/spatial/machine-pod-assembly.js'), true);
  assert.equal(core.parts.filter((part) => part.kind === 'outer-housing').every((part) => part.constructionSlice === 'S7'), true);
  assert.equal(core.connections.every((edge) => edge.constructionSlice === 'S8'), true);
  assert.equal(core.connections.every((edge) => edge.constructionOwner === 'frontend/spatial/machine-core-topology.js'), true);
});

test('root inheritance mismatch fails closed', () => {
  const context = createSpatialConstructionContext({
    slice: 'S13',
    owner: 'workspace',
    semanticId: 'WORKSPACE_CENTER',
  });
  const invalid = { ...context, inheritedStructuralRoots: ['S0','S1'] };
  const validation = validateSpatialConstructionNode(invalid);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('STRUCTURAL_ROOT_INHERITANCE_MISMATCH'));
  const graph = validateSpatialRootedCore({
    parts: [invalid],
    connections: [],
  });
  assert.equal(graph.valid, false);
});


test('core root validation rejects a mislabeled part even when the inheritance list is otherwise valid',()=>{
  const core=createBranchConnectionCore({seatCount:10});
  const invalid={...core,parts:core.parts.map(part=>part.kind==='hub'?{...part,constructionSlice:'S3'}:part)};
  const validation=validateSpatialRootedCore(invalid);
  assert.equal(validation.valid,false);
  assert.ok(validation.reasons.some((reason)=>reason.includes('CORE_PART_CONSTRUCTION_SLICE_MISMATCH')));
});
