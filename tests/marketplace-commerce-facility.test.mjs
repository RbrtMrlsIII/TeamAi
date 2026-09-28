import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('S19 Marketplace facility inherits the full S0-S10 spatial root contract', async () => {
  const { MARKETPLACE_FACILITY_SPATIAL_CONTEXT } = await import('../frontend/spatial/marketplace-commerce-facility.js');
  const { STRUCTURAL_ROOT_SLICES } = await import('../frontend/spatial/machine-spatial-root-contract.js');

  assert.equal(MARKETPLACE_FACILITY_SPATIAL_CONTEXT.constructionSlice, 'S19');
  assert.equal(
    MARKETPLACE_FACILITY_SPATIAL_CONTEXT.constructionOwner,
    'frontend/spatial/marketplace-commerce-facility.js',
  );
  assert.equal(MARKETPLACE_FACILITY_SPATIAL_CONTEXT.semanticId, 'hero-marketplace-facility');
  assert.deepEqual(MARKETPLACE_FACILITY_SPATIAL_CONTEXT.inheritedStructuralRoots, STRUCTURAL_ROOT_SLICES);
  assert.equal(MARKETPLACE_FACILITY_SPATIAL_CONTEXT.semanticBoundary, 'presentation-only');
});

test('S19 Marketplace source and browser delivery copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/marketplace-commerce-facility.js', 'utf8'),
    readFileSync('public/marketplace-commerce-facility.js', 'utf8'),
  );
});
