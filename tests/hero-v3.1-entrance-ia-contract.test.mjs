/**
 * V3.1 — Entrance IA / layout contract (Vision Phase V3).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V3.1 entrance IA contract document exists', async () => {
  const doc = await readFile(join(root, 'docs/ENTRANCE_IA_LAYOUT_CONTRACT.md'), 'utf8');
  assert.match(doc, /Layer A/);
  assert.match(doc, /entrance-brand/);
  assert.match(doc, /entrance-atmosphere/);
  assert.match(doc, /entrance-far/);
  assert.match(doc, /no second WebGL/);
  assert.match(doc, /V3\.4/);
});

test('V3.1 VISION points at entrance contract', async () => {
  const vision = await readFile(join(root, 'docs/VISION.md'), 'utf8');
  assert.match(vision, /ENTRANCE_IA_LAYOUT_CONTRACT/);
});

test('V3.1 index carries entrance region markers and no retired inspection spine', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /data-entrance-region="brand"/);
  assert.match(html, /data-entrance-region="atmosphere"/);
  assert.match(html, /data-entrance-region="far"/);
  assert.doesNotMatch(html, /data-inspection-reset/);
  assert.doesNotMatch(html, /hero-inspection/);
});
