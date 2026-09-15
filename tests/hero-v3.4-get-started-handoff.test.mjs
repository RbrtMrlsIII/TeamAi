/**
 * V3.4 — Get-started → machine baseline handoff.
 * One Hero instance · data-hero-layer machine/entrance · HERO_WIDE · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V3.4 layer handoff module exports enter/return and HERO_WIDE baseline', async () => {
  const js = await readFile(join(root, 'public/hero-layer-handoff.js'), 'utf8');
  assert.match(js, /enterMachineLayer/);
  assert.match(js, /returnToEntranceLayer/);
  assert.match(js, /HERO_WIDE/);
  assert.match(js, /data-hero-layer|heroLayer/);
  assert.match(js, /Do not set data-hero-machine-ui|does NOT set data-hero-machine-ui/i);
  assert.match(js, /teamai:web-ai-hero-engine-open/);
  assert.match(js, /data-hero-layer-return/);
  assert.match(js, /no second|notSecondRuntime|presentation only/i);
  assert.doesNotMatch(js, /WebGLRenderer|THREE\.Scene|createElement\(['"]canvas['"]\)/);
  assert.doesNotMatch(js, /firestore|oauth|client_secret/i);
});

test('V3.4 index wires layer handoff script and keeps single canvas', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /hero-layer-handoff\.js/);
  assert.match(html, /data-hero-layer="entrance"/);
  assert.match(html, /data-hero-engine-open/);
  assert.match(html, /data-world-camera-request="HERO_WIDE"/);
  assert.doesNotMatch(html, /data-inspection-reset/);
  assert.doesNotMatch(html, /hero-inspection/);
  const canvases = html.match(/<canvas\b/gi) || [];
  assert.equal(canvases.length, 1);
});

test('V3.4 docs remain a historical contract record', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_4_GET_STARTED_HANDOFF.md'), 'utf8');
  assert.match(doc, /V3\.4/);
  assert.match(doc, /HERO_WIDE/);
  assert.match(doc, /data-hero-layer/);
  assert.match(doc, /no second WebGL/i);
  assert.match(doc, /no 029-released/);
});

test('V3.4 entrance contract remains a historical implementation record', async () => {
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(contract, /Get-started handoff/);
  assert.match(contract, /data-hero-layer="machine"/);
  assert.match(contract, /HERO_WIDE/);
  assert.match(contract, /V3\.4|history|historical/i);
});

test('V3.4 is not the current product frontier', async () => {
  const vision = await readFile(join(root, 'docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.doesNotMatch(vision, /V3\.4.*Get-started.*Adjust handoff/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /^## Current blocker$/m);
});
