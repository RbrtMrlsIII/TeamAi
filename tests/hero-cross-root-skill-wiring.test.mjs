import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('motion skill owns reduced-motion mapping language', () => {
  const motion = read('skills/frontend/spatial/motion/SKILL.md');
  assert.match(motion, /reduced.?motion/i);
  assert.match(motion, /DO NOT/);
});

test('accessibility skill requires non-color status and keyboard', () => {
  const a11y = read('skills/frontend/spatial/accessibility/SKILL.md');
  assert.match(a11y, /keyboard/i);
  assert.match(a11y, /color is never the only status|non-color|text\/icon/i);
});

test('SKILL_WIRING names explicit spatial companion routes', () => {
  const wiring = read('docs/SKILL_WIRING.md');
  for (const route of [
    'hierarchy-runtime/SKILL.md',
    'seat-shell-hierarchy/SKILL.md',
    'motion/SKILL.md',
    'transition/SKILL.md',
    'responsive/SKILL.md',
    'accessibility/SKILL.md',
  ]) assert.match(wiring, new RegExp(route.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')));
  assert.match(wiring, /Hero lighting\/theme is not a Skill/i);
  assert.match(wiring, /Do not create a Hero lighting Skill/i);
});

test('matrix forbids second roots and Hero lighting Skill', () => {
  const doc = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(doc, /does \*\*not\*\* invent a second/i);
  assert.match(doc, /no\*\* Hero lighting skill/i);
});

test('I.1 remains documentation/verification-only and does not require hero runtime changes', () => {
  const matrix = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(matrix, /I\.1/);
  assert.match(matrix, /No runtime \/ hero-flex change in this slice/i);
});
