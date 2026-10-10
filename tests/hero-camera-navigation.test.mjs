import assert from 'node:assert/strict';
import test from 'node:test';
import { createHeroCameraNavigationController } from '../public/hero-camera-navigation.js';

function fixture() {
  const events = [];
  const buttons = [
    'BRANCH-OUTER-ALPHA',
    'BRANCH-OUTER-BETA',
    'BRANCH-OUTER-GAMMA',
    'BRANCH-OUTER-DELTA',
  ].map((branchId) => ({
    dataset: { facilityFocus: branchId },
    attributes: {},
    handlers: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { this.handlers[name] = handler; },
  }));
  const status = { textContent: '' };
  const documentRef = {
    querySelectorAll(selector) { return selector === '[data-facility-focus]' ? buttons : []; },
    querySelector(selector) { return selector === '#facility-focus-status' ? status : null; },
  };
  const windowRef = {
    CustomEvent: class {
      constructor(type, init) { this.type = type; this.detail = init.detail; }
    },
    dispatchEvent(event) { events.push(event); },
  };
  let camera = 'HERO_WIDE';
  let resets = 0;
  let stops = 0;
  let selectedSeat = 0;
  let seatCount = 10;
  let shellOpen = false;
  const controller = createHeroCameraNavigationController({
    documentRef,
    windowRef,
    getCameraId: () => camera,
    setBaseCamera: (next) => (camera = next),
    resetToWorld: () => { resets += 1; shellOpen = false; },
    stopLoop: () => { stops += 1; },
    getHierarchyOpen: () => shellOpen,
    getSelectedSeat: () => selectedSeat,
    getSeatCount: () => seatCount,
  });
  return {
    controller, buttons, status, events,
    get camera() { return camera; },
    get resets() { return resets; },
    get stops() { return stops; },
    setSeat(index) { selectedSeat = index; },
    setSeats(count) { seatCount = count; },
    setShellOpen(open) { shellOpen = open; },
  };
}

test('facility focus uses canonical S7 IDs and keeps UI status truthful', () => {
  const f = fixture();
  const result = f.controller.focusFacility('BRANCH-OUTER-BETA');
  assert.deepEqual(result, {
    ok: true,
    branchId: 'BRANCH-OUTER-BETA',
    mode: 'FACILITY_FOCUS',
    cameraId: 'HERO_WIDE',
    presentationOnly: true,
  });
  assert.equal(f.controller.getBranchId(), 'BRANCH-OUTER-BETA');
  assert.equal(f.controller.getState().mode, 'FACILITY_FOCUS');
  assert.equal(f.buttons[1].attributes['aria-pressed'], 'true');
  assert.match(f.status.textContent, /Operations · Fin deployment/);
  assert.equal(f.events.at(-1).type, 'teamai:facility-focus-change');
  assert.equal(f.events.at(-1).detail.mode, 'FACILITY_FOCUS');
  assert.equal(f.resets, 1);
  assert.equal(f.stops, 1);
});

test('unknown facility IDs fail closed and return to World', () => {
  const f = fixture();
  f.controller.focusFacility('BRANCH-OUTER-ALPHA');
  const result = f.controller.focusFacility('BRANCH-OUTER-UNKNOWN');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'UNKNOWN_FACILITY_BRANCH');
  assert.equal(f.controller.getBranchId(), null);
  assert.equal(f.controller.getState().mode, 'WORLD_OVERVIEW');
  assert.equal(f.status.textContent, 'World overview');
  assert.equal(f.resets, 2);
  assert.equal(f.events.at(-1).detail.mode, 'WORLD_OVERVIEW');
});

test('ordinary camera navigation clears facility focus and bounds unknown camera IDs', () => {
  const f = fixture();
  f.controller.focusFacility('BRANCH-OUTER-GAMMA');
  assert.equal(f.controller.setCamera('TEAM_ORBIT'), 'TEAM_ORBIT');
  assert.equal(f.controller.getBranchId(), null);
  assert.equal(f.camera, 'TEAM_ORBIT');
  assert.equal(f.controller.setCamera('UNRECOGNIZED_CAMERA'), 'HERO_WIDE');
  assert.equal(f.camera, 'HERO_WIDE');
});

test('subject lock still uses the selected Seat and the existing hierarchy-open override', () => {
  const f = fixture();
  f.setSeat(4);
  const closed = f.controller.getSubjectLockSnapshot();
  assert.equal(closed.selectedSeat, 4);
  assert.equal(closed.seatCount, 10);
  assert.equal(closed.shellOpen, false);
  f.setShellOpen(true);
  const opened = f.controller.getSubjectLockSnapshot();
  assert.equal(opened.shellOpen, true);
  assert.equal(opened.active, true);
  assert.equal(opened.cameraId, 'HERO_WIDE');
});
