import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readFileSync } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');

test('V3.4 entrance contract remains a historical implementation record', async () => {
  const contract = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(contract, /Get-started handoff/);
  assert.match(contract, /data-hero-layer="machine"/);
  assert.match(contract, /HERO_WIDE/);
  assert.match(contract, /V3\.4|history|historical/i);
});

test('V3.4 is not the current product frontier', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  const next = await readFile(join(root, 'Masterplan/NEXT_SLICES.md'), 'utf8');
  assert.doesNotMatch(vision, /V3\.4.*Get-started.*Adjust handoff/i);
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /^## Current blocker$/m);
});
