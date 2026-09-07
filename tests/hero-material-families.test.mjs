import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { mapHeroThemeLighting } from '../frontend/spatial/hero-theme-lighting-adapter.js';
import {
  mapHeroMaterialFamily,
  HERO_MATERIAL_FAMILY_KINDS,
} from '../frontend/spatial/hero-material-families.js';

const heroFlex = fs.readFileSync(path.join(process.cwd(), 'public/hero-flex.js'), 'utf8');

const lighting = mapHeroThemeLighting({ themeMode: 'light', surface: 0.6, focus: 0.4 });

test('material families exist only for authored workspaceRing and seatShell', () => {
  assert.deepEqual([...HERO_MATERIAL_FAMILY_KINDS], ['workspaceRing', 'seatShell']);
});

test('families stay bounded and consume adapter outputs rather than inventing a theme root', () => {
  for (const kind of HERO_MATERIAL_FAMILY_KINDS) {
    const family = mapHeroMaterialFamily(kind, lighting);
    for (const key of ['roughness', 'reflectance', 'grazing', 'shadow', 'insetSeparation']) {
      assert.ok(family[key] >= 0 && family[key] <= 1, `${kind}.${key} out of bounds`);
    }
    assert.equal(family.spec.length, 3);
    assert.ok(family.spec.every((channel) => channel >= 0 && channel <= 1));
  }
});

test('workspaceRing is tighter and more reflective than seatShell under the same light map', () => {
  const ring = mapHeroMaterialFamily('workspaceRing', lighting);
  const shell = mapHeroMaterialFamily('seatShell', lighting);
  assert.ok(ring.roughness < shell.roughness);
  assert.ok(ring.reflectance > shell.reflectance);
  assert.ok(ring.insetSeparation > shell.insetSeparation);
});

test('unknown kind falls back without throwing or writing domain fields', () => {
  const family = mapHeroMaterialFamily('not-a-legal-box', lighting);
  assert.equal(family.kind, 'seatShell');
  assert.equal(Object.prototype.hasOwnProperty.call(family, 'firestore'), false);
});

test('hero-flex consumes material families for authored ring and shell draws', () => {
  assert.match(heroFlex, /mapHeroMaterialFamily/);
  assert.match(heroFlex, /workspaceRing/);
  assert.match(heroFlex, /seatShell/);
  assert.match(heroFlex, /readHeroLightingFromShell/);
});
