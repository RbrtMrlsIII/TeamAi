/**
 * P-R2 R2 setup-ring camera-fill — presentation only
 * Login/signup full-area dock + APP_UI_HANDOFF · not Firebase Auth · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  APP_UI_HANDOFF,
  FOV_BOOST_NARROW,
  SETUP_RING_FILL_MS,
  SETUP_RING_FOV_FILL,
  SETUP_CONFIG_V1,
  createHierarchyRuntime,
  createRingFocusState,
  focusRingItem,
  cycleRingFocus,
  beginSetupRingFill,
  tickSetupRingFill,
  getSetupRingFillAmount,
  isSetupFullAreaItem,
  setupRingCameraId,
  setupRingFocusedItem,
  setupRingAccessibleName,
  requestSetupRingHandoff,
  setupRingFovBoost,
  ringFocusAccessibleName,
  openSeatShellParent,
} from '../public/hero-hierarchy-runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('SETUP_RING_FILL_MS and FOV numbers are named and positive', () => {
  assert.equal(typeof SETUP_RING_FILL_MS, 'number');
  assert.ok(SETUP_RING_FILL_MS > 0 && SETUP_RING_FILL_MS < 2000);
  assert.equal(FOV_BOOST_NARROW, 4);
  assert.equal(SETUP_RING_FOV_FILL, 3);
  assert.equal(APP_UI_HANDOFF, 'APP_UI_HANDOFF');
});

test('login/register/config are full-area; engine is not', () => {
  const login = SETUP_CONFIG_V1.find((i) => i.id.includes('login'));
  const register = SETUP_CONFIG_V1.find((i) => i.id.includes('register'));
  const engine = SETUP_CONFIG_V1.find((i) => i.kind === 'engine');
  assert.ok(login && register && engine);
  assert.equal(isSetupFullAreaItem(login), true);
  assert.equal(isSetupFullAreaItem(register), true);
  assert.equal(setupRingCameraId(login), 'DETAIL_ANCHOR');
  assert.equal(setupRingCameraId(register), 'DETAIL_ANCHOR');
  assert.equal(setupRingCameraId(engine), 'WORKSPACE_CLOSE');
});

test('focusing R2 login starts camera-fill; reduced motion snaps', () => {
  const state = createHierarchyRuntime();
  const rf = createRingFocusState();
  focusRingItem(rf, 'r2', 1);
  const item = setupRingFocusedItem(rf);
  assert.equal(item.kind, 'auth');
  beginSetupRingFill(state, rf, { nowMs: 0, snap: false });
  assert.ok(getSetupRingFillAmount(state) <= 0.15);
  tickSetupRingFill(state, rf, SETUP_RING_FILL_MS, false);
  assert.equal(getSetupRingFillAmount(state), 1);
  const reduced = createHierarchyRuntime();
  beginSetupRingFill(reduced, rf, { nowMs: 0, snap: false });
  tickSetupRingFill(reduced, rf, 10, true);
  assert.equal(getSetupRingFillAmount(reduced), 1);
});

test('open seat shell clears setup-ring fill (mutual exclusion)', () => {
  const state = createHierarchyRuntime();
  const rf = createRingFocusState();
  focusRingItem(rf, 'r2', 1);
  beginSetupRingFill(state, rf, { nowMs: 0, snap: true });
  assert.equal(getSetupRingFillAmount(state), 1);
  openSeatShellParent(state, 0, { snap: true, nowMs: 20 });
  tickSetupRingFill(state, rf, 20, false);
  assert.equal(getSetupRingFillAmount(state), 0);
});

test('accessible name and handoff are presentation-only not Firebase Auth', () => {
  const login = SETUP_CONFIG_V1.find((i) => i.kind === 'auth');
  const name = setupRingAccessibleName(login, 1);
  assert.match(name, /camera-fill/i);
  assert.match(name, /not Firebase Auth/i);
  assert.match(name, /Press L/i);
  assert.doesNotMatch(name, /password|oauth|entitled/i);
  const intent = requestSetupRingHandoff({ item: login, targetSection: 'auth' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthority, true);
  assert.equal(intent.notFirebaseAuth, true);
  assert.equal(intent.appUiHandoff, true);
  assert.equal(intent.reason, APP_UI_HANDOFF);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.source, 'p-r2-setup-ring');
  assert.equal(intent.cameraId, 'DETAIL_ANCHOR');
});

test('ring focus a11y for R2 uses setup-ring camera-fill copy', () => {
  const rf = createRingFocusState();
  focusRingItem(rf, 'r2', 1);
  const name = ringFocusAccessibleName(rf);
  assert.match(name, /Presentation only|camera-fill/i);
  assert.doesNotMatch(name, /authorized|entitled/i);
});

test('setupRingFovBoost adds fill FOV on top of narrow boost', () => {
  assert.equal(setupRingFovBoost(0, FOV_BOOST_NARROW), FOV_BOOST_NARROW);
  assert.equal(setupRingFovBoost(1, FOV_BOOST_NARROW), FOV_BOOST_NARROW + SETUP_RING_FOV_FILL);
});

test('hero-flex wires P-R2 camera-fill, keyboard L, and FOV', () => {
  const src = read('public/hero-flex.js');
  assert.match(src, /tickSetupRingFill\s*\(\s*hierarchyRuntime/);
  assert.match(src, /syncSetupRingCamera/);
  assert.match(src, /key===['"]l['"]/);
  assert.match(src, /requestSetupRingHandoff/);
  assert.match(src, /FOV_BOOST_NARROW/);
  assert.match(src, /setupRingFovBoost/);
  assert.match(src, /fillAmount:\s*getSetupRingFillAmount/);
  assert.match(src, /Isolation preserved/);
});

test('R2 draw scales full-area plates by fillAmount', () => {
  const r2 = read('public/hero-r2-setup-ring.js');
  assert.match(r2, /fillAmount/);
  assert.match(r2, /fullArea/);
  assert.doesNotMatch(r2, /password|oauth|credential/i);
});
