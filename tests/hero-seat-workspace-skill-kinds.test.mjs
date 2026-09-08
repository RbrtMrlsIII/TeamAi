/**
 * TEAM-EXPERIENCE-029 — Seat / workspace skill kinds taxonomy
 * Presentation/planning continuity. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const path = 'docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md';

test('skill kinds contract exists', () => {
  assert.ok(existsSync(join(root, path)));
});

test('canonical terms SEAT_SKILLS and WORKSPACE_SKILLS are defined', () => {
  const doc = read(path);
  assert.match(doc, /\*\*SEAT_SKILLS\*\*/);
  assert.match(doc, /\*\*WORKSPACE_SKILLS\*\*/);
  assert.match(doc, /no 029-released claim/i);
});

test('commerce is not renamed to ZIP_SKILLS', () => {
  const doc = read(path);
  assert.match(doc, /Do not\*\* rename commerce SKUs to `ZIP_SKILLS`/i);
  assert.match(doc, /Team Quality/);
  assert.match(doc, /Tool Quality/);
  assert.match(doc, /Zip package.*Distribution format/is);
});

test('legacy Hero faces mapped without dropping continuity', () => {
  const doc = read(path);
  assert.match(doc, /SEAT_TOOLKIT/);
  assert.match(doc, /WORKSPACE_ZIPSKILLS/);
  assert.match(doc, /MECHANISM_ZIPSKILLS/);
});

test('skills do not grant authorization language present', () => {
  const doc = read(path);
  assert.match(doc, /do not\*\* grant permission/i);
  assert.match(doc, /OAuth GitHub connection/i);
});

test('kind tables include seat and workspace kind ids', () => {
  const doc = read(path);
  assert.match(doc, /seat\.planning\.summarize/);
  assert.match(doc, /seat\.work\.coding/);
  assert.match(doc, /ws\.contribution\.flow/);
  assert.match(doc, /ws\.tools\.github/);
});
