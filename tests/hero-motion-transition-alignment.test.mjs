/**
 * TEAM-EXPERIENCE-029 Slice I.2 / Issue #95
 * Motion + transition token alignment vs hierarchy §9.
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  CAMERA_LERP_MS,
  HIERARCHY_REDUCED_SNAP,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('alignment document exists', () => {
  const path = 'docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md';
  assert.ok(existsSync(join(root, path)));
  const doc = read(path);
  assert.match(doc, /Issue #95/);
  assert.match(doc, /no 029-released claim/i);
  assert.match(doc, /OPEN_DURATION_MS/);
  assert.match(doc, /page-local timing/i);
});

test('§9 documents hierarchy duration names used by runtime', () => {
  const baseline = read('docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md');
  assert.match(baseline, /`OPEN_DURATION_MS`\s*\|\s*`520`/);
  assert.match(baseline, /`CLOSE_DURATION_MS`\s*\|\s*`420`/);
  assert.match(baseline, /`CAMERA_LERP_MS`\s*\|\s*`700`/);
  assert.match(baseline, /`HIERARCHY_REDUCED_SNAP`\s*\|\s*`true`/);
  assert.match(baseline, /`REDUCED_MOTION_K`\s*\|\s*`0\.35`/);
});

test('runtime exports match §9 duration values', () => {
  assert.equal(OPEN_DURATION_MS, 520);
  assert.equal(CLOSE_DURATION_MS, 420);
  assert.equal(CAMERA_LERP_MS, 700);
  assert.equal(HIERARCHY_REDUCED_SNAP, true);
});

test('motion skill forbids component-local duration stores', () => {
  const motion = read('skills/frontend/spatial/motion/SKILL.md');
  assert.match(motion, /Do not store durations in component files/i);
  assert.match(motion, /reduced.?motion/i);
  assert.match(motion, /Instant is a first-class token/i);
});

test('transition skill requires motion tokens and reduced path', () => {
  const transition = read('skills/frontend/spatial/transition/SKILL.md');
  assert.match(transition, /Consume Motion tokens/i);
  assert.match(transition, /Honor reduced motion/i);
  assert.match(transition, /Do not put transition timing on random page selectors/i);
});

test('alignment maps open/close/camera to motion roles', () => {
  const doc = read('docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md');
  assert.match(doc, /medium.*enter|enter.*medium/i);
  assert.match(doc, /long.*move|move.*long/i);
  assert.match(doc, /rest → opening → open/);
  assert.match(doc, /HERO_WIDE.*SEAT_CLOSE|SEAT_CLOSE.*HERO_WIDE/);
});

test('no parallel --hero-duration namespace introduced by alignment doc', () => {
  const doc = read('docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md');
  assert.match(doc, /Does \*\*not\*\* ship a CSS `--hero-duration/i);
});

test('cross-root matrix still lists motion and transition', () => {
  const matrix = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(matrix, /skills\/frontend\/spatial\/motion\/SKILL\.md/);
  assert.match(matrix, /skills\/frontend\/spatial\/transition\/SKILL\.md/);
});
