import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
  seatShellParentId,
  HIERARCHY_PHASE,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
} from '../public/hero-hierarchy-runtime.js';

const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const hierarchy = await readFile(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');
const sheet = await readFile(new URL('../docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md', import.meta.url), 'utf8');
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const combined = runtime + '\n' + hierarchy;

test('Seat shell v1 part IDs are defined in hierarchy runtime module', () => {
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
    assert.match(hierarchy, new RegExp(id));
  }
});

test('HierarchyRuntimeState fields and phases are present (R1)', () => {
  assert.match(combined, /hierarchyRuntime|createHierarchyRuntime/);
  assert.match(hierarchy, /openParentId/);
  assert.match(hierarchy, /focusedChildId/);
  assert.match(hierarchy, /focusedLeafId/);
  assert.match(hierarchy, /HIERARCHY_PHASE/);
  assert.match(hierarchy, /['"]rest['"]/);
  assert.match(hierarchy, /['"]opening['"]/);
  assert.match(hierarchy, /['"]open['"]/);
  assert.match(hierarchy, /['"]closing['"]/);
});

test('openSeatShellParent sets one parent and connection focus (Step 2)', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 2);
  assert.equal(state.openParentId, 'SEAT_SHELL#2');
  assert.equal(state.selectedSeatIndex, 2);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  openSeatShellParent(state, 5);
  assert.equal(state.openParentId, 'SEAT_SHELL#5');
  assert.notEqual(state.openParentId, 'SEAT_SHELL#2');
  closeHierarchyParent(state);
  assert.equal(state.openParentId, null);
  assert.equal(state.phase, HIERARCHY_PHASE.REST);
});

test('hero-flex selectSeatShell docks SEAT_CLOSE and wires one-open', () => {
  assert.match(runtime, /function selectSeatShell/);
  assert.match(runtime, /setCamera\(['"]SEAT_CLOSE['"]\)/);
  assert.match(runtime, /openSeatShellParent/);
  assert.match(runtime, /returnFromSeatShell|closeHierarchyParent/);
  assert.match(runtime, /hero-hierarchy-runtime\.js/);
});

test('v1 children order excludes deferred Toolkit and ZipSkills', () => {
  assert.equal(SEAT_SHELL_V1_CHILDREN.includes(HIERARCHY_PART.SEAT_CONNECTION), true);
  assert.equal(SEAT_SHELL_V1_CHILDREN.some((id) => id.includes('TOOLKIT') || id.includes('ZIPSKILLS')), false);
});

test('sheet and baseline remain the number/part authority', () => {
  assert.match(sheet, /SEAT_CONNECTION_HEALTH_FACE/);
  assert.match(sheet, /SEAT_CLOSE/);
  assert.match(baseline, /SEAT_OPEN_LIFT/);
  assert.match(baseline, /openParentId/);
});

test('presentation-only boundary held', () => {
  assert.match(combined, /presentation only|Presentation only/i);
  assert.doesNotMatch(combined, /firestore|paypal|scheduler eligibility/i);
});

test('seatShellParentId format', () => {
  assert.equal(seatShellParentId(0), 'SEAT_SHELL#0');
  assert.equal(seatShellParentId(3), 'SEAT_SHELL#3');
});
