import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');
const wiring = read('docs/SKILL_WIRING.md');
const spatialReadme = read('skills/frontend/spatial/README.md');
const runtimeSkill = read('skills/frontend/spatial/hierarchy-runtime/SKILL.md');
const seatSkill = read('skills/frontend/spatial/seat-shell-hierarchy/SKILL.md');
const baseline = read('docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md');

test('R1–R10 remain the shared root set', () => {
  for (const root of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10']) {
    assert.ok(baseline.includes(root), root);
    assert.ok(runtimeSkill.includes(root), `skill ${root}`);
  }
});

test('skill wiring points at the canonical spatial and machine-builder routes', () => {
  assert.match(wiring, /skills\/governance\/machine-builder\/SKILL\.md/);
  assert.match(wiring, /skills\/frontend\/spatial\/hierarchy-runtime\/SKILL\.md/);
  assert.match(wiring, /skills\/frontend\/spatial\/seat-shell-hierarchy\/SKILL\.md/);
  assert.match(wiring, /active `docs\/skills\/`/);
  assert.match(wiring, /single skills tree/i);
  assert.match(spatialReadme, /hierarchy-runtime\/SKILL\.md/);
  assert.match(spatialReadme, /seat-shell-hierarchy\/SKILL\.md/);
});

test('skills do not become a second theme root or freeze numbers', () => {
  assert.match(runtimeSkill, /second theme root/i);
  assert.match(runtimeSkill, /Number home/);
  assert.match(runtimeSkill, /Do \*\*not\*\* freeze|Do not freeze/i);
  assert.match(seatSkill, /Numbers come from the baseline doc/);
});
