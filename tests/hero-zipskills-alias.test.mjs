/**
 * TEAM-EXPERIENCE-029 Slice H — MECHANISM_ZIPSKILLS ↔ WORKSPACE_ZIPSKILLS alias
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const camera = read('public/hero-semantic-camera.js');
const spine = read('public/hero-inspection-spine.js');
const stack = read('public/hero-seat-stack.js');
const next = read('docs/TEAMAI_3D_HERO_NEXT_SLICES.md');
const map = read('docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md');

test('SEMANTIC_CAMERAS includes both MECHANISM_ZIPSKILLS and WORKSPACE_ZIPSKILLS', () => {
  assert.match(camera, /MECHANISM_ZIPSKILLS:\s*'DETAIL_ANCHOR'/);
  assert.match(camera, /WORKSPACE_ZIPSKILLS:\s*'DETAIL_ANCHOR'/);
});

test('canonical alias maps MECHANISM_ZIPSKILLS → WORKSPACE_ZIPSKILLS', () => {
  assert.match(camera, /MECHANISM_ZIPSKILLS:\s*'WORKSPACE_ZIPSKILLS'/);
  assert.match(camera, /function canonical/);
  assert.match(camera, /aliases:\s*\(\)/);
});

test('inspection spine ZIPSKILLS stage keeps legacy id and notes canonical', () => {
  assert.match(spine, /semanticCamera:\s*'MECHANISM_ZIPSKILLS'/);
  assert.match(spine, /canonicalSemanticCamera:\s*'WORKSPACE_ZIPSKILLS'/);
  assert.match(spine, /optional/i);
});

test('seat-stack zipskills layer is optional + workspace-scoped presentation', () => {
  assert.match(stack, /id:\s*'zipskills'/);
  assert.match(stack, /semanticCamera:\s*'MECHANISM_ZIPSKILLS'/);
  assert.match(stack, /canonicalSemanticCamera:\s*'WORKSPACE_ZIPSKILLS'/);
  assert.match(stack, /optional:\s*true/);
  assert.match(stack, /workspaceScoped:\s*true/);
  assert.match(stack, /not a required setup/i);
});

test('docs prefer WORKSPACE_ZIPSKILLS and record Slice H', () => {
  assert.match(next, /WORKSPACE_ZIPSKILLS/);
  assert.match(next, /MECHANISM_ZIPSKILLS/);
  assert.match(map, /WORKSPACE_ZIPSKILLS/);
});

test('presentation-only: no entitlement or required setup from ZipSkills alias', () => {
  assert.doesNotMatch(camera, /required\s*setup|entitlement\s*=\s*true/i);
  assert.match(stack, /presentationOnly:\s*true/);
});
