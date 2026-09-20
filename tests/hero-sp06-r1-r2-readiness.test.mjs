/**
 * SP-06 — R1/R2 readiness boundary (Gate S7).
 * Validate the current named R1/R2 presentation owners. Presentation only · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { access } from 'node:fs/promises';

import {
  RING_R1_SCALE,
  RING_R2_SCALE,
  RING_R0_ZIP_SCALE,
  HIERARCHY_PART,
  BACKEND_DISPLAY_V1,
  SETUP_CONFIG_V1,
  SETUP_RING_FILL_MS,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('SP-06 R0 ZipSkills owner module exists', async () => {
  await access(join(root, 'public/hero-p-r0-zipskills.js'));
  assert.ok(RING_R0_ZIP_SCALE > 0 && RING_R0_ZIP_SCALE < 1);
});

test('SP-06 R1 catalog + scale have a concrete Slice-D renderer owner', async () => {
  assert.ok(BACKEND_DISPLAY_V1.length >= 2);
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_DISPLAY, 'WORKSPACE_BACKEND_DISPLAY');
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_THREAD, 'WORKSPACE_BACKEND_THREAD');
  assert.ok(RING_R1_SCALE > 1);
  await access(join(root, 'public/hero-r1-backend-display.js'));
  const r1 = await readFile(join(root, 'public/hero-r1-backend-display.js'), 'utf8');
  assert.match(r1, /deriveBackendDisplayPlacements/);
  assert.match(r1, /drawBackendDisplayRing/);
  assert.doesNotMatch(r1, /oauth|password|apiKey|firebase\.auth|supabase/i);
  await access(join(root, 'public/hero-r1-backend-threads.js'));
  const threads = await readFile(join(root, 'public/hero-r1-backend-threads.js'), 'utf8');
  assert.match(threads, /R1_BACKEND_PRESENTATION_THREADS_V1/);
  assert.match(threads, /resolveBackendPresentationThreads/);
  assert.match(threads, /presentationOnly: true/);
});

test('SP-06 R2 has named draw owner module + canonical caller scale', async () => {
  await access(join(root, 'public/hero-r2-setup-ring.js'));
  const src = await readFile(join(root, 'public/hero-r2-setup-ring.js'), 'utf8');
  const hero = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /drawSetupConfigRing/);
  assert.match(src, /presentation only|authoritative ring scale/i);
  assert.match(hero, /drawSetupConfigRingModule/);
  assert.match(hero, /ringScale: RING_R2_SCALE/);
  assert.ok(RING_R2_SCALE > RING_R1_SCALE);
  assert.ok(SETUP_RING_FILL_MS > 0);
  assert.ok(SETUP_CONFIG_V1.length >= 3);
  assert.ok(SETUP_CONFIG_V1.some((i) => /auth|login/i.test(i.kind) || /login/i.test(i.label)));
});

test('SP-06 readiness doc classifies R1 threads as implemented-partial and R2 draw as implemented', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_R1_R2_READINESS.md'), 'utf8');
  assert.match(doc, /SP-06/);
  assert.match(doc, /Gate S7/);
  assert.match(doc, /stubbed/i);
  assert.match(doc, /implemented-partial/i);
  assert.match(doc, /hero-r1-backend-threads/);
  assert.match(doc, /hero-r2-setup-ring/);
  assert.match(doc, /hero-r1-backend-threads/);
  assert.match(doc, /Do not invent/i);
  assert.match(doc, /no 029-released/);
});

test('SP-06 presentation-only: R1/R2 owners must not embed OAuth secrets', async () => {
  for (const rel of [
    'public/hero-r1-backend-display.js',
    'public/hero-r2-setup-ring.js',
    'public/hero-p-r0-zipskills.js',
    'public/hero-hierarchy-runtime.js',
  ]) {
    const src = await readFile(join(root, rel), 'utf8');
    assert.doesNotMatch(src, /client_secret|Bearer [A-Za-z0-9]|firebase\.auth\(/i);
    assert.doesNotMatch(src, /firestore|paypal/i);
  }
});

test('SP-06 ring map still places R1 backend and R2 setup', async () => {
  const map = await readFile(join(root, 'docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md'), 'utf8');
  assert.match(map, /R1/);
  assert.match(map, /R2/);
  assert.match(map, /BACKEND DISPLAY/i);
  assert.match(map, /SETUP|CONFIG/i);
});
