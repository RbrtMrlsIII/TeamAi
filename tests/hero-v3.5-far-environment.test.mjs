/**
 * V3.5 — Far-environment clarity.
 * Historical slice record. Outside .hero-shell · never machine chrome · no 029 release claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V3.5 far-environment remains outside hero-shell', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  const shellClose = html.indexOf('</main>');
  const farIdx = html.indexOf('class="far-environment"');
  assert.ok(shellClose > 0 && farIdx > shellClose, 'far must appear after </main> hero-shell');
  assert.match(html, /data-entrance-region="far"/);
  assert.match(html, /data-far-outside-machine="1"/);
  assert.match(html, /role="contentinfo"/);
  assert.match(html, /data-far-link="about"/);
  assert.match(html, /data-far-link="privacy"/);
  const mainOpen = html.indexOf('<main');
  const mainInner = html.slice(mainOpen, shellClose);
  assert.equal(mainInner.includes('class="far-environment"'), false);
});

test('V3.5 CSS keeps far fixed and outside machine-ui absorption', async () => {
  const css = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(css, /V3\.5/);
  assert.match(css, /\.far-environment\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /data-far-outside-machine/);
  assert.match(css, /never target far-environment|outside \.hero-shell/i);
  const absorbBlock = css.match(/data-hero-machine-ui="1"[\s\S]*?pointer-events:\s*none;/);
  assert.ok(absorbBlock, 'machine-ui absorption block exists');
  assert.doesNotMatch(absorbBlock[0], /far-environment/);
});

test('V3.5 contract remains historical evidence for the outside-machine invariant', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_5_FAR_ENVIRONMENT.md'), 'utf8');
  assert.match(doc, /V3\.5/);
  assert.match(doc, /outside/i);
  assert.match(doc, /no 029-released/);
  assert.match(doc, /hero-shell/);
});

test('V3.5 no longer owns current product execution', async () => {
  const vision = await readFile(join(root, 'docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md'), 'utf8');
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.match(vision, /single product-experience vision/i);
  assert.doesNotMatch(vision, /V3\.5.*Far-environment.*adjust/i);
  assert.match(contract, /entrance-far|far-environment/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /^## Current blocker$/m);
});
