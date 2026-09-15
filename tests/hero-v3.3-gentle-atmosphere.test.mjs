import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();

test('V3.3 document remains a historical contract record', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_V3_3_GENTLE_ATMOSPHERE.md'), 'utf8');
  assert.match(doc, /V3\.3/);
  assert.match(doc, /no second WebGL/i);
  assert.match(doc, /hero-aura/);
  assert.match(doc, /no 029-released/);
});

test('V3.3 no longer owns the current frontier', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.match(vision, /single product-experience vision/i);
  assert.match(vision, /no 029-released claim/i);
  assert.doesNotMatch(vision, /V3\.3.*Gentle Hero atmosphere adjust/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
});
