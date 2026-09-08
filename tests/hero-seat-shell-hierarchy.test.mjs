import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  focusLeaf,
  clearLeafFocus,
  healthLeafAccessibleName,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  HEALTH_STATUS,
  CHILD_STEP_Y,
  SEAT_REST_Y,
} from '../public/hero-hierarchy-runtime.js';

const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const hierarchy = await readFile(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');
const combined = runtime + '\n' + hierarchy;

test('v1 leaf ID and health enums are presentation fixture only', () => {
  assert.equal(HEALTH_STATUS.UNKNOWN, 'unknown');
  assert.equal(HEALTH_STATUS.LOADING, 'loading');
  assert.equal(HEALTH_STATUS.UNAVAILABLE, 'unavailable');
  assert.match(hierarchy, /SEAT_CONNECTION_HEALTH_FACE/);
  assert.match(hierarchy, /not domain|Presentation only|presentation-only/i);
});

test('focusLeaf only when parent open; lives under Connection', () => {
  const state = createHierarchyRuntime();
  focusLeaf(state, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(state.focusedLeafId, null);
  openSeatShellParent(state, 1, { snap: true, nowMs: 0 });
  focusLeaf(state, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(state.focusedLeafId, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  clearLeafFocus(state);
  assert.equal(state.focusedLeafId, null);
});

test('accessible name announces presentation-only health', () => {
  const name = healthLeafAccessibleName(HEALTH_STATUS.UNKNOWN);
  assert.match(name, /health/i);
  assert.match(name, /unknown/i);
  assert.match(name, /Presentation only|not authorization/i);
});

test('hero-flex draws leaf and wires a11y/keyboard', () => {
  assert.match(runtime, /function drawHealthLeaf/);
  assert.match(runtime, /drawHealthLeaf\(/);
  assert.match(runtime, /aria-live/);
  assert.match(runtime, /healthLeafAccessibleName/);
  assert.match(runtime, /focusHierarchyLeaf|focusLeaf/);
  assert.match(runtime, /HEALTH_STATUS/);
});

test('v1 children order and child stack numbers held', () => {
  assert.equal(SEAT_SHELL_V1_CHILDREN[0], HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(CHILD_STEP_Y, 0.22);
  assert.equal(SEAT_REST_Y, 0.62);
});

test('presentation-only boundary held', () => {
  assert.match(combined, /presentation only|Presentation only/i);
  assert.doesNotMatch(combined, /firestore|paypal|scheduler eligibility/i);
  assert.doesNotMatch(combined, /OAuth|API key entry/i);
});
