/**
 * V3.3 — Gentle Hero atmosphere (Layer A backdrop).
 * Adjust existing #hero-canvas + .hero-aura-* · no second WebGL · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V3.3 index marks entrance layer and keeps single canvas + aura nodes', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /data-hero-layer="entrance"/);
  assert.match(html, /data-entrance-region="atmosphere"/);
  assert.match(html, /class="hero-aura hero-aura-a"/);
  assert.match(html, /class="hero-aura hero-aura-b"/);
  const canvases = html.match(/<canvas\b/gi) || [];
  assert.equal(canvases.length, 1, 'exactly one canvas — no second WebGL');
  assert.match(html, /hero-aura\.js/);
  assert.match(html, /inspection-spine/);
  assert.match(html, /motion-toggle/);
});

test('V3.3 CSS defines gentle aura drift and reduced-motion static', async () => {
  const css = await readFile(join(root, 'public/hero.css'), 'utf8');
  assert.match(css, /\.hero-aura\s*\{/);
  assert.match(css, /hero-aura-drift-a/);
  assert.match(css, /hero-aura-drift-b/);
  assert.match(css, /data-atmosphere-motion="static"/);
  assert.match(css, /prefers-reduced-motion: reduce/[\s\S]*hero-aura/);
  assert.match(css, /--hero-atmosphere/);
});

test('V3.3 hero-aura.js sets gentle atmosphere data and motion flags', async () => {
  const js = await readFile(join(root, 'public/hero-aura.js'), 'utf8');
  assert.match(js, /data-hero-layer|heroLayer|entrance/);
  assert.match(js, /atmosphere.*gentle|dataset\.atmosphere/);
  assert.match(js, /atmosphereMotion|data-atmosphere-motion|static|drift/);
  assert.match(js, /--hero-atmosphere/);
  assert.match(js, /reducedMotion|prefers-reduced-motion/);
  assert.doesNotMatch(js, /createElement\(['"]canvas['"]\)/);
  assert.doesNotMatch(js, /WebGLRenderer|THREE\.Scene/);
});

test('V3.3 docs name owners and forbid second runtime', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_3_GENTLE_ATMOSPHERE.md'), 'utf8');
  assert.match(doc, /V3\.3/);
  assert.match(doc, /no second WebGL/i);
  assert.match(doc, /hero-aura/);
  assert.match(doc, /no 029-released/);
  assert.match(doc, /V3\.4/);
});

test('V3.3 VISION and entrance contract still authorize atmosphere adjust', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(vision, /V3\.3/);
  assert.match(vision, /Gentle Hero atmosphere/i);
  assert.match(contract, /entrance-atmosphere/);
  assert.match(contract, /no second WebGL/i);
});
