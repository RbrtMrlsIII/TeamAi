import assert from 'node:assert/strict';
import test from 'node:test';
import {
  TEAMAI_FRONTEND_FEATURES,
  getFeatureTerminalClasses,
  getFrontendFeature,
} from '../frontend/spatial/feature-registry.js';

const EXPECTED = Object.freeze({
  'workspace-hq': ['SPATIAL_SURFACE', 'APP_UI_HANDOFF'],
  'projects-library': ['APP_UI_HANDOFF'],
  'artifacts-inventory': ['APP_UI_HANDOFF', 'READ_MODEL_ONLY'],
  'storage': ['APP_UI_HANDOFF', 'READ_MODEL_ONLY'],
  'seats': ['SPATIAL_SURFACE', 'APP_UI_HANDOFF'],
  'team-agents': ['APP_UI_HANDOFF'],
  'mcp-capability': ['APP_UI_HANDOFF'],
  'skills-responsibility': ['APP_UI_HANDOFF'],
  'orchestration': ['APP_UI_HANDOFF', 'READ_MODEL_ONLY'],
  'marketplace': ['APP_UI_HANDOFF'],
  'settings': ['APP_UI_HANDOFF'],
  'auth-gateway': ['APP_UI_HANDOFF'],
});

test('Y0 Feature Registry terminal classes remain explicit and governed', () => {
  assert.equal(TEAMAI_FRONTEND_FEATURES.length, Object.keys(EXPECTED).length);
  for (const [featureId, expectedClasses] of Object.entries(EXPECTED)) {
    const feature = getFrontendFeature(featureId);
    assert.ok(feature, featureId + ' missing from Feature Registry');
    assert.deepEqual(getFeatureTerminalClasses(feature), expectedClasses, featureId);
    assert.ok(feature.authority, featureId + ' missing authority');
    assert.ok(feature.branchModel, featureId + ' missing branch model');
  }
});

test('Y0 does not create a spatial feature class for normal UI handoffs', () => {
  for (const feature of TEAMAI_FRONTEND_FEATURES) {
    const classes = getFeatureTerminalClasses(feature);
    const hasSpatial = classes.includes('SPATIAL_SURFACE');
    if (hasSpatial) continue;
    assert.ok(
      classes.includes('APP_UI_HANDOFF') || classes.includes('READ_MODEL_ONLY') || classes.includes('STATE_ONLY'),
      feature.id + ' has no terminal classification',
    );
  }
});
