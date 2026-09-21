import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FEATURE_STATES,
  featureStateMetadata,
  featureStatePrecedence,
  isFeatureState,
  normalizeFeatureState,
  resolveFeaturePresentationState,
} from '../frontend/spatial/feature-state.js';

test('Issue #400 feature state vocabulary is canonical and closed', () => {
  assert.equal(new Set(FEATURE_STATES).size, FEATURE_STATES.length);
  assert.equal(FEATURE_STATES.length, 18);
  for (const state of FEATURE_STATES) assert.equal(isFeatureState(state), true);
  assert.equal(isFeatureState('CLICKED'), false);
  assert.equal(normalizeFeatureState('CLICKED'), 'INACTIVE');
});

test('presentation precedence matches the Product Law frontend contract', () => {
  assert.deepEqual(featureStatePrecedence(), [
    'BLOCKED', 'ERROR', 'DISABLED', 'UNAVAILABLE', 'PRESSED',
    'SELECTED', 'OPENING', 'OPEN', 'CLOSING', 'FOCUS', 'HOVER',
    'ACTIVE', 'INACTIVE',
  ]);
  assert.equal(resolveFeaturePresentationState(['HOVER', 'FOCUS']), 'FOCUS');
  assert.equal(resolveFeaturePresentationState(['SELECTED', 'PRESSED']), 'PRESSED');
  assert.equal(resolveFeaturePresentationState(['ACTIVE', 'ERROR']), 'ERROR');
  assert.equal(resolveFeaturePresentationState(['UNKNOWN', 'HOVER']), 'HOVER');
});

test('PRESSED is an interaction transition and state metadata remains presentation-only', () => {
  assert.deepEqual(featureStateMetadata('PRESSED'), {
    state: 'PRESSED',
    presentationOnly: true,
    interactionTransition: true,
    continuousMotionAllowed: true,
  });
  assert.equal(featureStateMetadata('ERROR').continuousMotionAllowed, false);
});

test('source and public state modules remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/feature-state.js', 'utf8'),
    readFileSync('public/feature-state.js', 'utf8'),
  );
});
