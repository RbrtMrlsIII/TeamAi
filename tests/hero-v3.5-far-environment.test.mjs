import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');

test('V3.5 contract remains historical evidence for the outside-machine invariant', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_5_FAR_ENVIRONMENT.md'), 'utf8');
  assert.match(doc, /V3\.5/);
  assert.match(doc, /outside/i);
  assert.match(doc, /no 029-released/);
  assert.match(doc, /hero-shell/);
});

test('V3.5 no longer owns current product execution', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.match(vision, /single product-experience vision/i);
  assert.doesNotMatch(vision, /V3\.5.*Far-environment.*adjust/i);
  assert.match(contract, /entrance-far|far-environment/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /^## Current blocker$/m);
});
