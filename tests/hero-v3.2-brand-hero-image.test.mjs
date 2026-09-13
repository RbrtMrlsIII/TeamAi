/**
 * V3.2 — Brand hero image in entrance brand region (Vision Phase V3).
 * Additive asset only; no second WebGL / theme root / 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetRel = 'assets/hero-spatial/teamai_icon_2_5d.png';

test('V3.2 brand asset file exists on disk', async () => {
  await access(join(root, 'public', assetRel), constants.R_OK);
});

test('V3.2 index wires brand mark into entrance-brand region', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /data-entrance-region="brand"/);
  assert.match(html, /class="hero-brand-mark"/);
  assert.match(html, /src=".\/assets\/hero-spatial\/teamai_icon_2_5d\.png"/);
  assert.match(html, /alt="TeamAi/);
  // The current entrance still owns atmosphere/far regions, while the legacy inspection spine is retired.
  assert.match(html, /data-entrance-region="atmosphere"/);
  assert.match(html, /data-entrance-region="far"/);
  assert.doesNotMatch(html, /data-inspection-reset/);
  assert.doesNotMatch(html, /hero-inspection/);
  assert.doesNotMatch(html, /<canvas[^>]+id="(?!hero-canvas)/);
});

test('V3.2 CSS styles brand mark without second theme root', async () => {
  const css = await readFile(join(root, 'public/hero.css'), 'utf8');
  assert.match(css, /\.hero-brand-mark/);
  assert.doesNotMatch(css, /data-theme-root|second-theme/);
});
