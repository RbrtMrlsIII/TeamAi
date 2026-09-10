/**
 * SP-06 — R1/R2 readiness boundary (Gate S7).
 * Classify owners only; do not invent modules. Presentation only · no 029-released claim.
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

test('SP-06 R1 catalog + scale are implemented without a fake r1 module', async () => {
  assert.ok(BACKEND_DISPLAY_V1.length >= 2);
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_DISPLAY, 'WORKSPACE_BACKEND_DISPLAY');
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_THREAD, 'WORKSPACE_BACKEND_THREAD');
  assert.ok(RING_R1_SCALE > 1);
  // No invented dedicated module required for SP-06 classification
  let r1Module = false;
  try {
    await access(join(root, 'public/hero-r1-backend-display.js'));
    r1Module = true;
  } catch {
    r1Module = false;
  }
  assert.equal(r1Module, false, 'SP-06 must not invent hero-r1-backend-display.js');
});

test('SP-06 R2 has named draw owner module + fill constants', async () => {
  await access(join(root, 'public/hero-r2-setup-ring.js'));
  const src = await readFile(join(root, 'public/hero-r2-setup-ring.js'), 'utf8');
  assert.match(src, /drawSetupConfigRing/);
  assert.match(src, /RING_R2_SCALE/);
  assert.match(src, /presentation only|not auth authority/i);
  assert.ok(RING_R2_SCALE > RING_R1_SCALE);
  assert.ok(SETUP_RING_FILL_MS > 0);
  assert.ok(SETUP_CONFIG_V1.length >= 3);
  assert.ok(SETUP_CONFIG_V1.some((i) => /auth|login/i.test(i.kind) || /login/i.test(i.label)));
});

test('SP-06 readiness doc classifies R1 threads as planned and R2 draw as implemented', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_R1_R2_READINESS.md'), 'utf8');
  assert.match(doc, /SP-06/);
  assert.match(doc, /Gate S7/);
  assert.match(doc, /stubbed/i);
  assert.match(doc, /planned/i);
  assert.match(doc, /hero-r2-setup-ring/);
  assert.match(doc, /WORKSPACE_BACKEND_THREAD/);
  assert.match(doc, /Do not invent/i);
  assert.match(doc, /no 029-released/);
});

test('SP-06 presentation-only: R1/R2 owners must not embed OAuth secrets', async () => {
  for (const rel of [
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
