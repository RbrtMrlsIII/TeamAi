import test from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroThemeLighting } from '../frontend/spatial/hero-theme-lighting-adapter.js';

const boundedKeys = [
  'environmentalFillIntensity',
  'grazingRimStrength',
  'contributionLightBaseIntensity',
  'roughness',
  'reflectance',
  'shadowSeparationStrength',
  'emissiveCeilingFloor',
];

test('maps light and dark themes to distinct bounded spatial parameters', () => {
  const light = mapHeroThemeLighting({ themeMode: 'light', atmosphere: 1, surface: 1, focus: 1, signal: 1, status: 1 });
  const dark = mapHeroThemeLighting({ themeMode: 'dark', atmosphere: 1, surface: 1, focus: 1, signal: 1, status: 1 });

  assert.notDeepEqual(light, dark);
  for (const output of [light, dark]) {
    for (const key of boundedKeys) {
      assert.ok(output[key] >= 0 && output[key] <= 1, `${key} out of bounds`);
    }
    assert.ok(Math.abs(Math.hypot(...output.keyLight.direction) - 1) < 1e-9);
  }
});

test('clamps untrusted semantic magnitudes without throwing', () => {
  const output = mapHeroThemeLighting({
    themeMode: 'light', atmosphere: 999, surface: -999, focus: 999, signal: -999, status: 999,
  });
  for (const key of boundedKeys) assert.ok(output[key] >= 0 && output[key] <= 1);
});

test('reduced motion disables nonessential spatial choreography', () => {
  assert.equal(mapHeroThemeLighting({ themeMode: 'light', reducedMotion: false }).reducedMotionChoreography, true);
  assert.equal(mapHeroThemeLighting({ themeMode: 'light', reducedMotion: true }).reducedMotionChoreography, false);
});

test('same semantic inputs are deterministic and do not mutate source input', () => {
  const semantic = Object.freeze({ themeMode: 'light', themeSource: 'user', atmosphere: 0.6, surface: 0.8, focus: 0.4, signal: 0.7, status: 0.2 });
  const a = mapHeroThemeLighting(semantic);
  const b = mapHeroThemeLighting(semantic);
  assert.deepEqual(a, b);
  assert.equal(semantic.themeMode, 'light');
});
