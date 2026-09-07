import test from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroThemeLighting, HERO_THEME_LIGHTING_FIXTURES } from '../frontend/spatial/hero-theme-lighting-adapter.js';
import {
  authoredRingMaterial,
  authoredSeatShellMaterial,
  authoredSeatInsetMaterial,
  assertMaterialDepthHierarchy,
  HERO_AUTHORED_MATERIAL_ROLES,
} from '../public/hero-authored-materials.js';
import fs from 'node:fs';
import path from 'node:path';

const heroFlex = fs.readFileSync(path.join(process.cwd(), 'public/hero-flex.js'), 'utf8');

test('Issue #88 material roles are explicit and pure', () => {
  assert.deepEqual([...HERO_AUTHORED_MATERIAL_ROLES], [
    'workspaceRing',
    'seatShell',
    'seatShellInset',
  ]);
  const L = mapHeroThemeLighting({ themeMode: 'light', density: 'default' });
  const ring = authoredRingMaterial(L);
  const shell = authoredSeatShellMaterial(L);
  const inset = authoredSeatInsetMaterial(L);
  assert.equal(ring.role, 'workspaceRing');
  assert.equal(shell.role, 'seatShell');
  assert.equal(inset.role, 'seatShellInset');
  for (const m of [ring, shell, inset]) {
    assert.ok(m.rough >= 0 && m.rough <= 1);
    assert.equal(m.color.length, 3);
    assert.equal(m.spec.length, 3);
  }
  assert.ok(assertMaterialDepthHierarchy(ring, shell, inset));
});

test('Issue #88 depth hierarchy holds across adapter fixtures', () => {
  for (const row of HERO_THEME_LIGHTING_FIXTURES) {
    const L = mapHeroThemeLighting(row);
    const ring = authoredRingMaterial(L);
    const shell = authoredSeatShellMaterial(L);
    const inset = authoredSeatInsetMaterial(L);
    assert.ok(
      assertMaterialDepthHierarchy(ring, shell, inset),
      `hierarchy failed for fixture ${row.id}`,
    );
  }
});

test('Light and Dark material families remain distinguishable', () => {
  const light = mapHeroThemeLighting({ themeMode: 'light' });
  const dark = mapHeroThemeLighting({ themeMode: 'dark' });
  assert.notDeepEqual(authoredRingMaterial(light), authoredRingMaterial(dark));
  assert.notDeepEqual(authoredSeatShellMaterial(light), authoredSeatShellMaterial(dark));
});

test('status increases inset depth without changing ring role', () => {
  const base = mapHeroThemeLighting({ themeMode: 'light', status: 0 });
  const high = mapHeroThemeLighting({ themeMode: 'light', status: 1 });
  const insetBase = authoredSeatInsetMaterial(base);
  const insetHigh = authoredSeatInsetMaterial(high);
  assert.ok(insetHigh.rough >= insetBase.rough);
  assert.ok(insetHigh.color[0] <= insetBase.color[0]);
  assert.equal(authoredRingMaterial(base).role, 'workspaceRing');
});

test('hero-flex consumes authored material helpers and stays public-self-contained', () => {
  assert.match(heroFlex, /authoredRingMaterial/);
  assert.match(heroFlex, /authoredSeatShellMaterial/);
  assert.match(heroFlex, /authoredSeatInsetMaterial/);
  assert.match(heroFlex, /heroMaterialContext/);
  assert.doesNotMatch(heroFlex, /mapHeroThemeLighting/);
  assert.doesNotMatch(heroFlex, /frontend\/spatial/);
  assert.match(heroFlex, /AUTHORED_RING/);
  assert.match(heroFlex, /AUTHORED_SEAT_SHELL/);
});

test('materials are deterministic for identical lighting input', () => {
  const L = mapHeroThemeLighting({ themeMode: 'light', surface: 0.7, focus: 0.4 });
  assert.deepEqual(authoredRingMaterial(L), authoredRingMaterial(L));
  assert.deepEqual(authoredSeatShellMaterial(L), authoredSeatShellMaterial(L));
  assert.deepEqual(authoredSeatInsetMaterial(L), authoredSeatInsetMaterial(L));
});
