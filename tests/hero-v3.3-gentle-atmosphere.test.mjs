/**
 * V3.3 — Gentle Hero atmosphere (historical Layer A presentation record).
 * One Hero runtime · no second WebGL · no 029 release claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V3.3 index still preserves the single-canvas entrance invariant', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /data-hero-layer="entrance"/);
  assert.match(html, /data-entrance-region="atmosphere"/);
  assert.match(html, /class="hero-aura hero-aura-a"/);
  assert.match(html, /class="hero-aura hero-aura-b"/);
  const canvases = html.match(/<canvas\b/gi) || [];
  assert.equal(canvases.length, 1, 'exactly one canvas — no second WebGL');
  assert.match(html, /hero-aura\.js/);
  assert.doesNotMatch(html, /hero-inspection|data-inspection-(?:stage|prev|next|reset)/);
  assert.match(html, /motion-toggle/);
});

test('V3.3 CSS retains gentle atmosphere and reduced-motion behavior', async () => {
  const css = await readFile(join(root, 'public/hero.css'), 'utf8');
  assert.match(css, /\.hero-aura\s*\{/);
  assert.match(css, /hero-aura-drift-a/);
  assert.match(css, /hero-aura-drift-b/);
  assert.match(css, /data-atmosphere-motion="static"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.hero-aura\s*\{[^}]*animation:\s*none/s);
  assert.match(css, /--hero-atmosphere/);
});

test('V3.3 hero-aura.js remains presentation-only', async () => {
  const js = await readFile(join(root, 'public/hero-aura.js'), 'utf8');
  assert.match(js, /data-hero-layer|heroLayer|entrance/);
  assert.match(js, /atmosphere.*gentle|dataset\.atmosphere/);
  assert.match(js, /atmosphereMotion|data-atmosphere-motion|static|drift/);
  assert.match(js, /--hero-atmosphere/);
  assert.match(js, /reducedMotion|prefers-reduced-motion/);
  assert.doesNotMatch(js, /createElement\(['"]canvas['"]\)/);
  assert.doesNotMatch(js, /WebGLRenderer|THREE\.Scene/);
});

test('V3.3 document remains a historical contract record', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_3_GENTLE_ATMOSPHERE.md'), 'utf8');
  assert.match(doc, /V3\.3/);
  assert.match(doc, /no second WebGL/i);
  assert.match(doc, /hero-aura/);
  assert.match(doc, /no 029-released/);
});

test('V3.3 no longer owns the current frontier', async () => {
  const vision = await readFile(join(root, 'docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.match(vision, /single product-experience vision/i);
  assert.match(vision, /no 029-released claim/i);
  assert.doesNotMatch(vision, /V3\.3.*Gentle Hero atmosphere adjust/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
});
