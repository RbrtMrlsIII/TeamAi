/**
 * TEAM-EXPERIENCE-029 Slice I.1 / Issue #95
 * Cross-root skill wiring matrix — existence + shape only.
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const COMPANIONS = Object.freeze([
  'skills/frontend/spatial/UI_UX-Promax-Skill.md',
  'skills/frontend/spatial/motion/SKILL.md',
  'skills/frontend/spatial/transition/SKILL.md',
  'skills/frontend/spatial/animation/SKILL.md',
  'skills/frontend/spatial/responsive/SKILL.md',
  'skills/frontend/spatial/accessibility/SKILL.md',
  'skills/frontend/spatial/hierarchy-runtime/SKILL.md',
  'skills/frontend/spatial/seat-shell-hierarchy/SKILL.md',
  'skills/frontend/spatial/workspace-ring/SKILL.md',
]);

const SHAPE = Object.freeze(['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']);

test('cross-root wiring matrix document exists', () => {
  const path = 'docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md';
  assert.ok(existsSync(join(root, path)), path);
  const doc = read(path);
  assert.match(doc, /Issue #95/);
  assert.match(doc, /no 029-released claim/i);
  assert.match(doc, /canonical theme root/i);
});

test('matrix lists every companion path', () => {
  const doc = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  for (const path of COMPANIONS) {
    assert.ok(doc.includes(path), `matrix missing ${path}`);
  }
});

test('every companion skill file exists', () => {
  for (const path of COMPANIONS) {
    assert.ok(existsSync(join(root, path)), `missing ${path}`);
  }
});

test('every companion skill has WHEN / AUTHORITY / ACTION / DO NOT / PASS', () => {
  for (const path of COMPANIONS) {
    const body = read(path);
    for (const section of SHAPE) {
      assert.match(body, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${path} missing ${section}`);
    }
  }
});

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

test('SKILL_WIRING points at spatial companions and hierarchy', () => {
  const wiring = read('docs/SKILL_WIRING.md');
  assert.match(wiring, /hierarchy-runtime/);
  assert.match(wiring, /motion\/transition\/animation\/responsive\/accessibility/);
  assert.match(wiring, /No Hero lighting\/theme skill/i);
});

test('matrix forbids second roots and Hero lighting skill', () => {
  const doc = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(doc, /does \*\*not\*\* invent a second/i);
  assert.match(doc, /no\*\* Hero lighting skill/i);
});

test('I.1 is docs+tests only — no hero-flex change required in matrix', () => {
  const doc = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(doc, /No runtime \/ hero-flex change/i);
});
