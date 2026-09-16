import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  NAV_ZOOM_MIN,
  NAV_ZOOM_MAX,
  NAV_ZOOM_REDUCED_MIN,
  NAV_ZOOM_REDUCED_MAX,
  HIERARCHY_INPUT,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const next = await readFile(new URL('../Masterplan/NEXT_SLICES.md', import.meta.url), 'utf8');

test('nav zoom bounds match §9', () => {
  assert.equal(NAV_ZOOM_MIN, 0.72);
  assert.equal(NAV_ZOOM_MAX, 2.0);
  assert.equal(NAV_ZOOM_REDUCED_MIN, 0.9);
  assert.equal(NAV_ZOOM_REDUCED_MAX, 1.2);
  assert.match(baseline, /`NAV_ZOOM_MIN`\s*\|\s*`0\.72`/);
  assert.match(baseline, /`NAV_ZOOM_MAX`\s*\|\s*`2\.0`/);
});

test('hero-flex uses Cam-3 tree-center nav + named zoom bounds', () => {
  assert.match(hero, /poseAboutTreeCenter|shouldApplyTreeNav|hero-cam3-tree-center-zoom/);
  assert.match(hero, /NAV_ZOOM_MIN/);
  assert.match(hero, /NAV_ZOOM_MAX/);
  assert.doesNotMatch(hero, /clamp\(navZoom \+ delta, 0\.72, 1\.55\)/);
});

test('current slice lives under Masterplan and exposes required contract', () => {
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  for (const heading of ['## Status', '## Objective', '## Dependencies', '## Verification', '## Current blocker']) {
    assert.match(next, new RegExp(`^${heading}$`, 'm'));
  }
  assert.match(next, /TEAM-EXPERIENCE-029|post-#346/i);
});

test('HIERARCHY_INPUT exposes NAVIGATE', () => {
  assert.equal(HIERARCHY_INPUT.NAVIGATE, 'NAVIGATE');
  assert.equal(HIERARCHY_INPUT.INSPECT, 'INSPECT');
});
