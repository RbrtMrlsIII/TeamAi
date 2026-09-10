/**
 * SP-04 — Apply-path integrity (Gate S8).
 * Spatial execution basis · Issue #232 residual · presentation only · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  EXPECTED_FLEX_MARKERS,
  PINNED_BASE_HINT,
  verifyFlexIntegrity,
  assertFlexIntegrityOrExit,
} from '../scripts/flex-apply-integrity.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('SP-04 expected marker list is non-empty and ordered', () => {
  assert.ok(EXPECTED_FLEX_MARKERS.length >= 10);
  const ids = EXPECTED_FLEX_MARKERS.map((m) => m.id);
  assert.ok(ids.includes('cam2-import'));
  assert.ok(ids.includes('cam4-import'));
  assert.ok(ids.includes('seat-dock'));
  assert.ok(ids.includes('edge-drift'));
  assert.ok(ids.includes('world-baseline'));
});

test('SP-04 verifyFlexIntegrity fails on empty / emergency loader', () => {
  const empty = verifyFlexIntegrity('');
  assert.equal(empty.ok, false);
  assert.ok(empty.missing.length > 0);

  const emergency = verifyFlexIntegrity(
    "/** emergency loader */\nconst MAIN_URL = 'https://example.com';\nfunction patchSource(src) { return src; }\n",
  );
  assert.equal(emergency.ok, false);
  assert.equal(emergency.isEmergencyLoader, true);
});

test('SP-04 verifyFlexIntegrity passes full assembly with all markers', () => {
  const needles = EXPECTED_FLEX_MARKERS.map((m) => m.needle).join('\n');
  const fake = `// full assembly\nfunction cameras(){ return {}; }\n${'x'.repeat(12000)}\n${needles}\n`;
  const report = verifyFlexIntegrity(fake);
  assert.equal(report.ok, true);
  assert.equal(report.missing.length, 0);
  assert.equal(report.isFullAssembly, true);
  assert.equal(report.isEmergencyLoader, false);
});

test('SP-04 verifyFlexIntegrity reports partial missing', () => {
  const partial = `function cameras(){\n  return {};\n}\n${'y'.repeat(12000)}\nfrom './hero-cam2-tree-follow.js'\n`;
  const report = verifyFlexIntegrity(partial);
  assert.equal(report.ok, false);
  assert.ok(report.missing.includes('cam4-import'));
  assert.ok(report.present.includes('cam2-import'));
});

test('SP-04 assertFlexIntegrityOrExit exits non-zero on failure', () => {
  let code = null;
  const logs = [];
  assertFlexIntegrityOrExit('// not full', {
    exit: (c) => {
      code = c;
    },
    log: (...a) => logs.push(a.join(' ')),
  });
  assert.equal(code, 1);
  assert.ok(logs.some((l) => /SP-04 FAIL/i.test(l)));
});

test('SP-04 apply script wires integrity module and pinned base hint', async () => {
  const apply = await readFile(join(root, 'scripts/apply-cam2-tree-follow-flex.mjs'), 'utf8');
  assert.match(apply, /flex-apply-integrity/);
  assert.match(apply, /assertFlexIntegrityOrExit/);
  assert.match(apply, /SP-04/);
  assert.ok(apply.includes(PINNED_BASE_HINT) || apply.includes('a2f8a3e'));
});

test('SP-04 apply script remains presentation-only', async () => {
  const apply = await readFile(join(root, 'scripts/apply-cam2-tree-follow-flex.mjs'), 'utf8');
  assert.doesNotMatch(apply, /firestore|paypal|OAuth|scheduler/i);
  const integrity = await readFile(join(root, 'scripts/flex-apply-integrity.mjs'), 'utf8');
  assert.match(integrity, /presentation only|no 029-released/i);
  assert.doesNotMatch(integrity, /firestore|paypal|OAuth|scheduler/i);
});

test('SP-04 spatial basis documents apply integrity requirements', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md'), 'utf8');
  assert.match(doc, /SP-04/);
  assert.match(doc, /silent no-op/i);
  assert.match(doc, /hero-flex\.js/);
});
