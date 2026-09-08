import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  WORKSPACE_ZIPSKILLS_V1,
  RING_R0_ZIP_SCALE,
  zipskillsAccessibleName,
  createRingFocusState,
  focusRingItem,
  cycleRingFocus,
  ringFocusAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');
const seatSheet = await readFile(new URL('../docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md', import.meta.url), 'utf8');
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');

test('WORKSPACE_ZIPSKILLS is workspace-tree, not a Seat child', () => {
  assert.equal(HIERARCHY_PART.WORKSPACE_ZIPSKILLS, 'WORKSPACE_ZIPSKILLS');
  assert.equal(SEAT_SHELL_V1_CHILDREN.includes(HIERARCHY_PART.WORKSPACE_ZIPSKILLS), false);
  assert.ok(WORKSPACE_ZIPSKILLS_V1.length >= 3);
  assert.ok(WORKSPACE_ZIPSKILLS_V1.every((x) => x.optional === true));
  assert.ok(WORKSPACE_ZIPSKILLS_V1.every((x) => String(x.id).startsWith('WORKSPACE_ZIPSKILLS#')));
});

test('accessible name denies entitlement / required setup / authority', () => {
  const name = zipskillsAccessibleName(WORKSPACE_ZIPSKILLS_V1[0]);
  assert.match(name, /optional/i);
  assert.match(name, /not required/i);
  assert.match(name, /workspace/i);
  assert.match(name, /Presentation only/i);
  assert.doesNotMatch(name, /authorized|entitled|must configure|grants merge/i);
});

test('R0 ring catalog cycles ZipSkills faces', () => {
  const rf = createRingFocusState();
  focusRingItem(rf, 'r0', 0);
  assert.equal(rf.ring, 'r0');
  cycleRingFocus(rf, 'r0', 1);
  assert.equal(rf.index, 1);
  const spoken = ringFocusAccessibleName(rf);
  assert.match(spoken, /optional/i);
  assert.match(spoken, /Presentation only/i);
});

test('hero-flex draws inner crown and wires z/x keys', () => {
  assert.match(hero, /function drawWorkspaceZipskills/);
  assert.match(hero, /drawWorkspaceZipskills\(/);
  assert.match(hero, /workspace \* RING_R0_ZIP_SCALE/);
  assert.match(hero, /cycleRingFocus\(ringFocus,'r0'/);
  assert.match(hero, /event\.key==='z'/);
  assert.match(hero, /WORKSPACE_ZIPSKILLS_V1/);
  assert.match(hero, /zipskillsAccessibleName/);
  assert.match(hero, /Isolation preserved/);
});

test('docs place ZipSkills on R0 workspace tree; §9 holds RING_R0_ZIP_SCALE', () => {
  assert.equal(RING_R0_ZIP_SCALE, 0.22);
  assert.match(baseline, /`RING_R0_ZIP_SCALE`\s*\|\s*`0\.22`/);
  assert.match(map, /WORKSPACE_ZIPSKILLS/);
  assert.match(seatSheet, /WORKSPACE_ZIPSKILLS/);
  assert.doesNotMatch(seatSheet, /\|\s*\d+\s*\|\s*`SEAT_ZIPSKILLS`/);
  assert.ok(RING_R0_ZIP_SCALE < 1);
});

test('presentation-only: no durable bind from ZipSkills draw path', () => {
  assert.doesNotMatch(hero, /oauth|password|apiKey|firebase\.auth/i);
});
