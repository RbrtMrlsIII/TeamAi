import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const aura = await readFile(new URL('../public/hero-aura.js', import.meta.url), 'utf8');
const materials = await readFile(new URL('../public/hero-materials.css', import.meta.url), 'utf8');

for (const token of [
  'mapHeroThemeLighting',
  '--hero-light-fill',
  '--hero-light-key',
  '--hero-light-grazing',
  '--hero-light-contribution',
  '--hero-light-shadow',
  '--hero-light-emissive',
]) {
  test(`Hero light rig contains ${token}`, () => assert.match(`${aura}\n${materials}`, new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'))));
}

test('Hero light rig remains presentation-only', () => {
  assert.doesNotMatch(aura, /firestore|supabase|paypal|credential|provider.{0,20}invoke|scheduler/i);
});

test('Reduced motion is represented in the light rig', () => {
  assert.match(aura, /reducedMotion/);
  assert.match(materials, /data-motion='reduced'|prefers-reduced-motion/);
});
