/**
 * V0.5 — Zoom ceiling ~200% (Vision).
 * Owner: NAV_ZOOM_MAX in hero-hierarchy-runtime.js + §9 baseline · no new module.
 * presentation only · no 029-released claim · Issue #214
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  NAV_ZOOM_MIN,
  NAV_ZOOM_MAX,
  NAV_ZOOM_REDUCED_MAX,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V0.5 NAV_ZOOM_MAX is 2.0 (~200%)', () => {
  assert.equal(NAV_ZOOM_MAX, 2.0);
});

test('V0.5 max is above prior 1.55 ceiling and above min', () => {
  assert.ok(NAV_ZOOM_MAX > 1.55);
  assert.ok(NAV_ZOOM_MAX > NAV_ZOOM_MIN);
});

test('V0.5 reduced-motion max stays strictly below full max', () => {
  assert.ok(NAV_ZOOM_REDUCED_MAX < NAV_ZOOM_MAX);
});

test('V0.5 baseline §9 documents 2.0', async () => {
  const baseline = await readFile(
    join(root, 'docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md'),
    'utf8',
  );
  assert.match(baseline, /`NAV_ZOOM_MAX`\s*\|\s*`2\.0`/);
});
