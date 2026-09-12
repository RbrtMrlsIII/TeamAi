import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  LOCK_ONLY_CAMERA_IDS,
  TREE_ALIGNED_CAMERA_IDS,
  resolveDomCameraAction,
} from '../public/hero-dom-action-map.js';

test('lock-only set is non-empty and disjoint from tree-aligned', () => {
  // CAM-R-RETIRE: HERO_LOW_ORBIT + TURN_FOLLOW removed; remaining lock-only >= 2
  assert.ok(LOCK_ONLY_CAMERA_IDS.length >= 2);
  for (const id of LOCK_ONLY_CAMERA_IDS) {
    assert.ok(!TREE_ALIGNED_CAMERA_IDS.includes(id));
  }
});

test('lock-only while hierarchy open is blocked', () => {
  const r = resolveDomCameraAction('TEAM_ORBIT', { hierarchyOpen: true });
  assert.equal(r.allowed, false);
  assert.equal(r.retired, true);
  assert.equal(r.effectiveCameraId, null);
});

test('lock-only while hierarchy closed maps to HERO_WIDE', () => {
  const r = resolveDomCameraAction('OVERHEAD_MAP', { hierarchyOpen: false });
  assert.equal(r.allowed, true);
  assert.equal(r.effectiveCameraId, 'HERO_WIDE');
  assert.equal(r.retired, true);
  assert.equal(r.freeNav, true);
});

test('SEAT_CLOSE remains allowed when hierarchy open', () => {
  const r = resolveDomCameraAction('SEAT_CLOSE', { hierarchyOpen: true });
  assert.equal(r.allowed, true);
  assert.equal(r.effectiveCameraId, 'SEAT_CLOSE');
  assert.equal(r.retired, false);
});

test('module and absorption plan stay presentation-only', async () => {
  const src = await readFile(new URL('../public/hero-dom-action-map.js', import.meta.url), 'utf8');
  assert.match(src, /lock-only|TREE_ALIGNED|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth/i);
  const plan = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md', import.meta.url),
    'utf8'
  );
  assert.match(plan, /Retire lock-only|Far-environment/i);
});

test('hero-flex wires resolveDomCameraAction after apply', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });
  const flex = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(flex, /resolveDomCameraAction/);
  assert.match(flex, /hero-dom-action-map/);
});

test('index marks far-environment outside shell', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  // C5/D (#278): TEAM_ORBIT/OVERHEAD_MAP (the only data-lock-only="1" markup)
  // were removed from the DOM outright, not soft-hidden, so no lock-only
  // marker is expected here anymore. LOCK_ONLY_CAMERA_IDS itself (tested
  // above) still governs runtime dom-action-map behavior.
  assert.match(html, /far-environment/);
  const farIdx = html.indexOf('far-environment');
  const shellEnd = html.indexOf('</main>');
  assert.ok(farIdx > shellEnd, 'far-environment must be outside main.hero-shell');
});
