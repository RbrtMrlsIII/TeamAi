/**
 * #258 residual — ENT-R2/R3 + CHR-R1/R2 layer/chrome (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('ENT-R2 machine layer retires brand (opacity 0 / hidden, not 0.42 soft)', async () => {
  const css = await readFile(join(root, 'public/hero.css'), 'utf8');
  assert.match(css, /data-hero-layer="machine"\] \.hero-copy/);
  assert.match(css, /visibility:\s*hidden/);
  assert.doesNotMatch(css, /opacity:\s*0\.42/);
});

test('ENT-R3 return control wired in index and visible only on machine layer', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  const css = await readFile(join(root, 'public/hero.css'), 'utf8');
  const handoff = await readFile(join(root, 'public/hero-layer-handoff.js'), 'utf8');
  assert.match(html, /data-hero-layer-return/);
  assert.match(css, /data-hero-layer-return/);
  assert.match(handoff, /data-hero-layer-return|returnToEntranceLayer/);
});

test('CHR-R2 soft-hides seat-stack modules on machine layer; keeps machine-nav owners', async () => {
  const chrome = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(chrome, /seat-stack__module/);
  assert.match(chrome, /data-hero-layer="machine"/);
  assert.match(chrome, /machine-nav/);
  // Must not claim hierarchy machine-ui ownership in this residual
  assert.match(chrome, /Does not set data-hero-machine-ui|hierarchy absorption/i);
});

test('RES-0 contract doc names inventory and forbidden second runtime', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md'), 'utf8');
  assert.match(doc, /ENT-R2/);
  assert.match(doc, /CHR-R2/);
  assert.match(doc, /no 029-released/);
  assert.match(doc, /Second canvas|second theme/i);
});

test('Still one canvas and layer handoff module (no second WebGL)', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  const canvases = html.match(/<canvas\b/gi) || [];
  assert.equal(canvases.length, 1);
  assert.match(html, /hero-layer-handoff\.js/);
});
