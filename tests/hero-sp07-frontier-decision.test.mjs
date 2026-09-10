/**
 * SP-07 — Current frontier decision after SP-01–SP-06.
 * Locks one current spatial slice and one next authorized command.
 * Presentation only · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('SP-07 decision doc exists and names Gate after SP-01–SP-06', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /SP-07/);
  assert.match(doc, /SP-01/);
  assert.match(doc, /SP-06/);
  assert.match(doc, /no 029-released/);
});

test('SP-07 closes spatial SP sequence as merged or satisfied', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /SP-02.*Merged|#236/s);
  assert.match(doc, /SP-03.*Merged|#237/s);
  assert.match(doc, /SP-04.*Merged|#239/s);
  assert.match(doc, /SP-05.*Merged|#241/s);
  assert.match(doc, /SP-06.*Merged|#242/s);
  assert.match(doc, /Satisfied|Merged/);
});

test('SP-07 names exactly one current spatial slice: V3.3 Gentle Hero atmosphere', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /V3\.3/);
  assert.match(doc, /Gentle Hero atmosphere|gentle Hero atmosphere/i);
  assert.match(doc, /entrance-atmosphere|Layer A/i);
  assert.match(doc, /No second runtime|no second WebGL|no second runtime/i);
});

test('SP-07 records one next authorized command pointing at V3.3', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /NEXT AUTHORIZED SPATIAL COMMAND/);
  assert.match(doc, /V3\.3/);
  assert.match(doc, /Adjust existing/i);
});

test('SP-07 forbids backend and color polish in this decision', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /Leave backend|backend.*untouched|Explicitly untouched/i);
  assert.match(doc, /color\/material|color.*polishing|art-direction/i);
  assert.match(doc, /Conn-3|parallel/i);
});

test('SP-07 reclassifies Cam-2 restart and V1.3 as closed/satisfied', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md'), 'utf8');
  assert.match(doc, /Cam-2/);
  assert.match(doc, /Closed|Satisfied/);
  assert.match(doc, /V1\.3/);
  assert.match(doc, /V0\.2/);
});

test('VISION still lists V3.3 as Gentle Hero atmosphere adjust', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  assert.match(vision, /V3\.3/);
  assert.match(vision, /Gentle Hero atmosphere/i);
  assert.match(vision, /Adjust wiring/i);
});

test('Entrance contract still owns entrance-atmosphere region', async () => {
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(contract, /entrance-atmosphere/);
  assert.match(contract, /no second WebGL/i);
  assert.match(contract, /V3\.3/);
});
