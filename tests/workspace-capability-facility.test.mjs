import test from 'node:test';
import assert from 'node:assert/strict';
import { STRUCTURAL_ROOT_SLICES, validateSpatialConstructionNode } from '../frontend/spatial/machine-spatial-root-contract.js';
import { readFileSync } from 'node:fs';

test('S13 Workspace HQ inherits the complete S0-S10 structural root contract', async () => {
  const { WORKSPACE_FACILITY_SPATIAL_CONTEXT } = await import('../frontend/spatial/workspace-capability-facility.js');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.constructionSlice, 'S13');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.constructionOwner, 'frontend/spatial/workspace-capability-facility.js');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.semanticId, 'WORKSPACE_CENTER');
  assert.deepEqual(WORKSPACE_FACILITY_SPATIAL_CONTEXT.inheritedStructuralRoots, STRUCTURAL_ROOT_SLICES);
  assert.equal(validateSpatialConstructionNode(WORKSPACE_FACILITY_SPATIAL_CONTEXT).valid, true);
});

test('live Hero surface exposes Workspace HQ as a first-party capability facility', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/workspace-capability.css', 'utf8');

  assert.match(html, /data-workspace-open/);
  assert.match(html, /workspace-capability-facility\.js/);
  assert.match(html, /workspace-capability\.css/);
  assert.match(facility, /WORKSPACE_CENTER_ID/);
  assert.match(facility, /teamai:workspace-capability-intent/);
  assert.match(facility, /TeamAiWorkspaceFacility/);
  assert.match(css, /workspace-facility/);
});

test('Workspace facility source/public copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8'), readFileSync('public/workspace-capability-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/workspace-capability.css', 'utf8'), readFileSync('public/workspace-capability.css', 'utf8'));
});
