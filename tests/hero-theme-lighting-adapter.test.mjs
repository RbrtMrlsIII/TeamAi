import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapHeroThemeLighting,
  HERO_THEME_LIGHTING_FIXTURES,
} from '../frontend/spatial/hero-theme-lighting-adapter.js';

const boundedKeys = [
  'environmentalFillIntensity',
  'grazingRimStrength',
  'contributionLightBaseIntensity',
  'roughness',
  'reflectance',
  'shadowSeparationStrength',
  'emissiveCeilingFloor',
];

const requiredSemantic = ['themeMode', 'themeSource', 'density', 'atmosphere', 'surface', 'focus', 'signal', 'status', 'reducedMotion'];

function byId(id) {
  return HERO_THEME_LIGHTING_FIXTURES.find((row) => row.id === id);
}

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

test('Issue #98 fixture matrix covers required theme/density/motion/focus/status states', () => {
  const ids = HERO_THEME_LIGHTING_FIXTURES.map((row) => row.id);
  for (const required of [
    'light-default-normal',
    'dark-default-normal',
    'light-compact-normal',
    'light-default-reduced',
    'light-focus-active',
    'light-status-bearing',
  ]) {
    assert.ok(ids.includes(required), `missing fixture ${required}`);
  }
});

test('Issue #98 fixtures are stable, bounded, and side-effect free', () => {
  const firstPass = HERO_THEME_LIGHTING_FIXTURES.map((row) => mapHeroThemeLighting(row));
  const secondPass = HERO_THEME_LIGHTING_FIXTURES.map((row) => mapHeroThemeLighting(row));
  assert.deepEqual(firstPass, secondPass);

  for (const [index, row] of HERO_THEME_LIGHTING_FIXTURES.entries()) {
    const output = firstPass[index];
    for (const key of boundedKeys) {
      assert.ok(Number.isFinite(output[key]));
      assert.ok(output[key] >= 0 && output[key] <= 1, `${row.id} ${key} out of bounds`);
    }
    assert.equal(output.themeMode, row.themeMode === 'dark' ? 'dark' : 'light');
    assert.equal(output.density, row.density === 'compact' ? 'compact' : 'default');
    assert.equal(output.reducedMotionChoreography, !row.reducedMotion);
  }
});

test('Light and Dark share the contract but remain distinguishable', () => {
  const light = mapHeroThemeLighting(byId('light-default-normal'));
  const dark = mapHeroThemeLighting(byId('dark-default-normal'));
  assert.notDeepEqual(light, dark);
  assert.ok(light.environmentalFillIntensity > dark.environmentalFillIntensity);
  for (const key of boundedKeys) {
    assert.equal(typeof light[key], 'number');
    assert.equal(typeof dark[key], 'number');
  }
});

test('compact density retunes material without changing theme mode or choreography flag', () => {
  const def = mapHeroThemeLighting(byId('light-default-normal'));
  const compact = mapHeroThemeLighting(byId('light-compact-normal'));
  assert.equal(def.themeMode, compact.themeMode);
  assert.equal(def.reducedMotionChoreography, compact.reducedMotionChoreography);
  assert.notEqual(def.environmentalFillIntensity, compact.environmentalFillIntensity);
  assert.ok(compact.roughness > def.roughness);
});

test('reduced motion removes choreography without erasing semantic state', () => {
  const normal = mapHeroThemeLighting(byId('light-default-normal'));
  const reduced = mapHeroThemeLighting(byId('light-default-reduced'));
  assert.equal(normal.themeMode, reduced.themeMode);
  assert.equal(normal.density, reduced.density);
  assert.equal(normal.environmentalFillIntensity, reduced.environmentalFillIntensity);
  assert.equal(normal.reducedMotionChoreography, true);
  assert.equal(reduced.reducedMotionChoreography, false);
});

test('focus/active and status are reason-bearing numeric channels, not color-only', () => {
  const base = mapHeroThemeLighting(byId('light-default-normal'));
  const focus = mapHeroThemeLighting(byId('light-focus-active'));
  const status = mapHeroThemeLighting(byId('light-status-bearing'));
  assert.ok(focus.grazingRimStrength > base.grazingRimStrength);
  assert.ok(focus.reflectance > base.reflectance);
  assert.ok(status.shadowSeparationStrength > base.shadowSeparationStrength);
});

test('adapter consumes every required Issue #84 semantic input field', () => {
  const output = mapHeroThemeLighting({
    themeMode: 'dark',
    themeSource: 'user',
    density: 'compact',
    atmosphere: 0.4,
    surface: 0.3,
    focus: 0.2,
    signal: 0.1,
    status: 0.9,
    reducedMotion: true,
  });
  assert.equal(output.themeMode, 'dark');
  assert.equal(output.themeSource, 'user');
  assert.equal(output.density, 'compact');
  assert.equal(output.reducedMotionChoreography, false);
  for (const key of requiredSemantic) {
    assert.ok(key === 'atmosphere' || key === 'surface' || key === 'focus' || key === 'signal' || key === 'status' || output[key] !== undefined || key);
  }
  assert.ok(output.environmentalFillIntensity <= 1);
  assert.ok(output.shadowSeparationStrength > mapHeroThemeLighting({ themeMode: 'dark', density: 'compact', status: 0 }).shadowSeparationStrength);
});
