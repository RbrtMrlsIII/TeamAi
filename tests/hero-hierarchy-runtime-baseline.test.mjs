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
const ringMap = read('docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md');

test('R0–R3 remain the currently defined shared ring set', () => {
  for (const ring of ['R0', 'R1', 'R2', 'R3']) {
    assert.ok(baseline.includes(ring), ring);
    assert.ok(ringMap.includes(new RegExp(`\\b${ring}\\b`).test(ringMap)), `ring map ${ring}`);
  }
  assert.match(baseline, /R1\/R2.*planned|R1\/R2.*specified/i);
  assert.match(baseline, /R3.*Seat Ring/i);
  assert.match(ringMap, /R0\s+WORKSPACE CORE/);
  assert.match(ringMap, /R1\s+BACKEND DISPLAY RING/);
  assert.match(ringMap, /R2\s+SETUP \/ CONFIG RING/);
  assert.match(ringMap, /R3\s+SEAT RING/);
});

test('skill wiring points at the canonical spatial and machine-builder routes', () => {
  assert.match(wiring, /skills\/governance\/machine-builder\/SKILL\.md/);
  assert.match(wiring, /skills\/frontend\/spatial\/hierarchy-runtime\/SKILL\.md/);
  assert.match(wiring, /skills\/frontend\/spatial\/seat-shell-hierarchy\/SKILL\.md/);
  assert.match(wiring, /## Forbidden active routing surfaces/);
  assert.match(wiring, /legacy `docs\/skills\/` namespace/);
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
