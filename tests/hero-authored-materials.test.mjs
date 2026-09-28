import test from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroThemeLighting } from '../frontend/spatial/hero-theme-lighting-adapter.js';
import {
  authoredRingMaterial,
  authoredSeatShellMaterial,
  authoredSeatInsetMaterial,
  authoredHeroMaterialSet,
  HERO_AUTHORED_MATERIAL_ROLES,
} from '../frontend/spatial/hero-authored-materials.js';
import fs from 'node:fs';
import path from 'node:path';

const heroFlex = fs.readFileSync(path.join(process.cwd(), 'public/hero-flex.js'), 'utf8');
const authoredSource = fs.readFileSync(path.join(process.cwd(), 'frontend/spatial/hero-authored-materials.js'), 'utf8');
const authoredPublic = fs.readFileSync(path.join(process.cwd(), 'public/hero-authored-materials.js'), 'utf8');

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
  assert.ok(ring.rough < shell.rough);
  assert.ok(inset.color[0] < shell.color[0]);
});


test('full renderer material set is derived from authored theme roles', () => {
  const light = mapHeroThemeLighting({ themeMode: 'light', density: 'default', signal: 0.8 });
  const dark = mapHeroThemeLighting({ themeMode: 'dark', density: 'default', signal: 0.8 });
  const lightSet = authoredHeroMaterialSet(light);
  const darkSet = authoredHeroMaterialSet(dark);

  assert.deepEqual(Object.keys(lightSet), [
    'metal', 'metal2', 'glass', 'energy', 'trace',
    'workspaceRing', 'seatShell', 'seatShellInset',
  ]);
  assert.equal(lightSet.metal.role, 'workspaceRing');
  assert.equal(lightSet.seatShell.role, 'seatShell');
  assert.equal(lightSet.seatShellInset.role, 'seatShellInset');
  assert.equal(lightSet.metal2.role, 'secondaryStructure');
  assert.equal(lightSet.glass.role, 'glassSurface');
  assert.equal(lightSet.energy.role, 'energySignal');
  assert.equal(lightSet.trace.role, 'signalTrace');
  assert.notDeepEqual(lightSet, darkSet);

  for (const material of Object.values(lightSet)) {
    assert.ok(material.rough >= 0 && material.rough <= 1);
    assert.equal(material.color.length, 3);
    assert.equal(material.spec.length, 3);
    assert.ok(material.emit >= 0 && material.emit <= 1);
  }
});

test('Light and Dark material families remain distinguishable', () => {
  const light = mapHeroThemeLighting({ themeMode: 'light' });
  const dark = mapHeroThemeLighting({ themeMode: 'dark' });
  assert.notDeepEqual(authoredRingMaterial(light), authoredRingMaterial(dark));
  assert.notDeepEqual(authoredSeatShellMaterial(light), authoredSeatShellMaterial(dark));
});

test('canonical machine renderer owns authored-material consumption', async () => {
  const renderer = await fs.promises.readFile(path.join(process.cwd(), 'public/machine-world-renderer.js'), 'utf8');
  assert.match(renderer, /const COLORS/);
  assert.match(renderer, /UI_COLORS/);
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /authoredSeatShellMaterial/);
  assert.match(renderer, /authoredSeatInsetMaterial/);
  assert.match(renderer, /authoredRingMaterial/);
  assert.match(renderer, /authoredHeroMaterialSet/);
  assert.match(renderer, /activeHeroMaterials/);
  assert.match(renderer, /activeHeroLighting/);
  assert.match(renderer, /solidRoughness/);
  assert.match(renderer, /solidSpecular/);
  assert.match(renderer, /solidKeyDirection/);
  assert.match(renderer, /bounded-lit-v1/);
  assert.doesNotMatch(renderer, /const RING_MATERIALS/);
  const rendererSource = await fs.promises.readFile(path.join(process.cwd(), 'frontend/spatial/machine-world-renderer.js'), 'utf8');
  assert.equal(rendererSource, renderer);
  assert.equal(authoredSource, authoredPublic);
  assert.match(renderer, /gl.drawArrays/);
  assert.doesNotMatch(heroFlex, /gl\.createShader|gl\.createProgram|gl\.drawArrays/);
});

test('materials are deterministic for identical lighting input', () => {
  const L = mapHeroThemeLighting({ themeMode: 'light', surface: 0.7, focus: 0.4 });
  assert.deepEqual(authoredRingMaterial(L), authoredRingMaterial(L));
  assert.deepEqual(authoredSeatShellMaterial(L), authoredSeatShellMaterial(L));
});

test('B/E reconciliation: theme presentation remains document-root based', async () => {
  assert.doesNotMatch(heroFlex, /body\?\.dataset\?\.theme|body\.dataset\.theme/);
  const themeRoot = await fs.promises.readFile(path.join(process.cwd(), 'frontend/spatial/theme-root.js'), 'utf8');
  assert.match(themeRoot, /document\.documentElement/);
  assert.match(themeRoot, /data-theme-mode/);
  assert.match(themeRoot, /data-density/);
});

