/**
 * TEAM-EXPERIENCE-029 Slice H — MECHANISM_ZIPSKILLS ↔ WORKSPACE_ZIPSKILLS alias
 * Presentation only. No 029-released claim.
 *
 * VALIDATION CHANGE WARNING
 * Protected old invariant: NEXT_SLICES owned one current slice and did not become a semantic-machine history index.
 * Authorized new rule: the current slice title is allowed to change as execution advances, while the one-current-slice
 * structure and separation from semantic-machine history remain protected.
 * Why the old invariant is obsolete/retained: the literal title "Repository Governance Foundation Reconciliation"
 * became historical after #346 and #348 merged; freezing that wording would make the test reject truthful session state.
 * Replacement invariant: NEXT_SLICES exposes the canonical current-slice contract and does not contain ZipSkills/semantic-
 * machine history identifiers in the current-slice surface.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const camera = read('public/hero-semantic-camera.js');
const stack = read('public/hero-seat-stack.js');
const next = read('Masterplan/NEXT_SLICES.md');
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

test('ZipSkills semantic alias is defined without retired inspection-spine ownership', () => {
  assert.match(camera, /MECHANISM_ZIPSKILLS:\s*'DETAIL_ANCHOR'/);
  assert.match(camera, /WORKSPACE_ZIPSKILLS:\s*'DETAIL_ANCHOR'/);
  assert.doesNotMatch(stack, /inspection-spine/i);
});

test('seat-stack zipskills layer is optional + workspace-scoped presentation', () => {
  assert.match(stack, /id:\s*'zipskills'/);
  assert.match(stack, /semanticCamera:\s*'MECHANISM_ZIPSKILLS'/);
  assert.match(stack, /canonicalSemanticCamera:\s*'WORKSPACE_ZIPSKILLS'/);
  assert.match(stack, /optional:\s*true/);
  assert.match(stack, /workspaceScoped:\s*true/);
  assert.match(stack, /not a required setup/i);
});

test('current slice does not become a semantic-machine history index', () => {
  assert.match(next, /## Current Slice/i);
  assert.match(next, /## Status/i);
  assert.match(next, /CLOSURE PENDING|IN PROGRESS/i);
  assert.doesNotMatch(next, /WORKSPACE_ZIPSKILLS|MECHANISM_ZIPSKILLS|Slice H/);
  assert.match(map, /WORKSPACE_ZIPSKILLS/);
});

test('presentation-only: ZipSkills alias does not assert entitlement grants', () => {
  assert.doesNotMatch(camera, /entitlement\s*=\s*true/i);
  assert.doesNotMatch(camera, /grantsPermission:\s*true/);
  assert.match(stack, /presentationOnly:\s*true/);
  assert.match(camera, /presentationOnly:\s*true/);
});
