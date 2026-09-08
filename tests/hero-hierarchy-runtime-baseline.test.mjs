import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';

const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const seatSheet = await readFile(new URL('../docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md', import.meta.url), 'utf8');
const wiring = await readFile(new URL('../docs/SKILL_WIRING.md', import.meta.url), 'utf8');
const spatialReadme = await readFile(new URL('../skills/frontend/spatial/README.md', import.meta.url), 'utf8');
const runtimeSkill = await readFile(new URL('../skills/frontend/spatial/hierarchy-runtime/SKILL.md', import.meta.url), 'utf8');
const seatSkill = await readFile(new URL('../skills/frontend/spatial/seat-shell-hierarchy/SKILL.md', import.meta.url), 'utf8');
const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

test('hierarchy-runtime and seat-shell-hierarchy skill files exist', async () => {
  await access(new URL('../skills/frontend/spatial/hierarchy-runtime/SKILL.md', import.meta.url));
  await access(new URL('../skills/frontend/spatial/seat-shell-hierarchy/SKILL.md', import.meta.url));
});

test('skills follow WHEN TO USE → AUTHORITY → ACTION → DO NOT → PASS', () => {
  for (const body of [runtimeSkill, seatSkill]) {
    for (const heading of ['WHEN TO USE', 'INPUT', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS', 'EVIDENCE', 'SEE ALSO']) {
      assert.ok(body.includes(`## ${heading}`), heading);
    }
  }
});

test('docs hold named living numbers (baseline §9)', () => {
  for (const name of [
    'SEAT_REST_Y',
    'SEAT_OPEN_LIFT',
    'CHILD_STEP_Y',
    'CHILD_STEP_R',
    'CAMERA_LERP_MS',
    'REDUCED_MOTION_K',
    'HIERARCHY_REDUCED_SNAP',
    'OPEN_DURATION_MS',
    'CLOSE_DURATION_MS',
    'FOV_BOOST_NARROW',
    'WORKSPACE_R_MIN',
    'SEAT_R_MAX',
    'ROUGH_LIGHT',
    'REFL_DARK',
  ]) {
    assert.ok(baseline.includes('`' + name + '`') || baseline.includes(name), name);
  }
  assert.match(baseline, /Living numbers table/);
  assert.match(baseline, /documentation holds numbers/i);
  assert.match(baseline, /0\.62/);
  assert.match(baseline, /700/);
  assert.match(baseline, /0\.35/);
});

test('measured numbers still match hero-flex anchors', () => {
  assert.match(hero, /seatRadius,(?:0?\.62|SEAT_REST_Y)/);
  assert.match(hero, /clamp\(count,1,8\)/);
  assert.match(hero, /lerp\(4\.35,5\.95/);
  assert.match(hero, /lerp\(4\.25,6\.45/);
  assert.match(hero, /lerp\(9\.6,12\.2/);
  assert.match(hero, /\/700,/);
  assert.match(hero, /reducedMotion\?0\.35:1/);
  assert.match(hero, /themeMode==='dark'\?0\.62:0\.48/);
  assert.match(hero, /themeMode==='dark'\?0\.54:0\.72/);
});

test('R1–R10 remain the shared root set', () => {
  for (const root of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10']) {
    assert.ok(baseline.includes(root), root);
    assert.ok(runtimeSkill.includes(root), `skill ${root}`);
  }
});

test('skill wiring points at the new companions', () => {
  assert.match(wiring, /skills\/frontend\/spatial\/hierarchy-runtime\/SKILL\.md/);
  assert.match(wiring, /skills\/frontend\/spatial\/seat-shell-hierarchy\/SKILL\.md/);
  assert.match(wiring, /Issue #142/);
  assert.match(spatialReadme, /hierarchy-runtime\/SKILL\.md/);
  assert.match(spatialReadme, /seat-shell-hierarchy\/SKILL\.md/);
});

test('skills do not become a second theme root or freeze numbers', () => {
  assert.match(runtimeSkill, /second theme root/i);
  assert.match(runtimeSkill, /Number home/);
  assert.match(runtimeSkill, /Do \*\*not\*\* freeze|Do not freeze/i);
  assert.match(seatSkill, /Numbers come from the baseline doc/);
  assert.match(spatialReadme, /Documentation holds numbers/);
});

test('Seat v1 part IDs are in the sheet and seat-shell skill', () => {
  for (const id of [
    'SEAT_SHELL',
    'SEAT_CONNECTION',
    'SEAT_BEHAVIOR',
    'SEAT_CAPABILITIES',
    'SEAT_AUTHORIZATION',
    'SEAT_WORKSPACE_SCOPE',
    'SEAT_TASK_EVIDENCE',
    'SEAT_CONNECTION_HEALTH_FACE',
  ]) {
    assert.ok(seatSheet.includes(id), `sheet ${id}`);
    assert.ok(seatSkill.includes(id), `skill ${id}`);
  }
});
