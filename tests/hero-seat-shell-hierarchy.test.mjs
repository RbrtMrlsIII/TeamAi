import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
  assert.match(hierarchy, /NAVIGATE/);
  assert.match(hierarchy, /INSPECT/);
});

test('one-open closeHierarchyParent exists and is presentation-only', () => {
  assert.match(hierarchy, /function closeHierarchyParent|export function closeHierarchyParent/);
  assert.match(runtime, /getHierarchyState/);
  assert.match(combined, /presentation only|Presentation only/i);
});

test('v1 children order excludes deferred Toolkit and ZipSkills', () => {
  assert.match(hierarchy, /SEAT_SHELL_V1_CHILDREN/);
  const childrenBlock = hierarchy.match(/SEAT_SHELL_V1_CHILDREN\s*=\s*\[[^\]]+\]/);
  assert.ok(childrenBlock, 'SEAT_SHELL_V1_CHILDREN array present');
  assert.doesNotMatch(childrenBlock[0], /SEAT_TOOLKIT|SEAT_ZIPSKILLS/);
});

test('sheet and baseline remain the number/part authority', () => {
  assert.match(sheet, /SEAT_CONNECTION_HEALTH_FACE/);
  assert.match(sheet, /one fully open|Only \*\*one\*\* Seat shell/i);
  assert.match(baseline, /SEAT_OPEN_LIFT/);
  assert.match(baseline, /HierarchyRuntimeState|openParentId/);
});

test('TeamAiHero exposes hierarchy getters; hero-flex imports hierarchy module', () => {
  assert.match(runtime, /hero-hierarchy-runtime\.js/);
  assert.match(runtime, /getHierarchyState/);
  assert.match(runtime, /closeHierarchyParent/);
  assert.doesNotMatch(combined, /firestore|paypal|scheduler eligibility/i);
});
