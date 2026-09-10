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
  assert.match(js, /heroMachineUi|data-hero-machine-ui/);
  assert.match(js, /teamai:web-ai-hero-engine-open/);
  assert.match(js, /data-inspection-reset/);
  assert.match(js, /no second|notSecondRuntime|presentation only/i);
  assert.doesNotMatch(js, /WebGLRenderer|THREE\.Scene|createElement\(['"]canvas['"]\)/);
  assert.doesNotMatch(js, /firestore|oauth|client_secret/i);
});

test('V3.4 index wires layer handoff script and keeps single canvas', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /hero-layer-handoff\.js/);
  assert.match(html, /data-hero-layer="entrance"/);
  assert.match(html, /data-hero-engine-open/);
  assert.match(html, /data-camera="HERO_WIDE"/);
  assert.match(html, /data-inspection-reset/);
  const canvases = html.match(/<canvas\b/gi) || [];
  assert.equal(canvases.length, 1);
});

test('V3.4 docs name Layer A→B contract and forbid second runtime', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_4_GET_STARTED_HANDOFF.md'), 'utf8');
  assert.match(doc, /V3\.4/);
  assert.match(doc, /HERO_WIDE/);
  assert.match(doc, /data-hero-layer/);
  assert.match(doc, /no second WebGL/i);
  assert.match(doc, /no 029-released/);
  assert.match(doc, /V3\.5/);
});

test('V3.4 entrance contract still defines get-started handoff steps', async () => {
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(contract, /Get-started handoff/);
  assert.match(contract, /data-hero-layer="machine"/);
  assert.match(contract, /HERO_WIDE/);
  assert.match(contract, /V3\.4/);
});

test('V3.4 VISION lists get-started machine baseline as adjust handoff', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  assert.match(vision, /V3\.4/);
  assert.match(vision, /Get-started → machine baseline/);
  assert.match(vision, /Adjust handoff/);
});
