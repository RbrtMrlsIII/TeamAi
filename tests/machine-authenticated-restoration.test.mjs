import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT,
  getAuthenticatedRestorationReadModel,
  normalizeAuthenticatedRestorationReadModel,
  restorationReasons,
  restorationStates,
} from '../frontend/spatial/machine-authenticated-restoration.js';

const source = await readFile(
  new URL('../frontend/spatial/machine-authenticated-restoration.js', import.meta.url),
  'utf8',
);
const publicSource = await readFile(
  new URL('../public/machine-authenticated-restoration.js', import.meta.url),
  'utf8',
);

const READY_INPUT = {
  identity: { provider: 'firebase', subjectId: 'uid-test' },
  authenticated: true,
  workplace: { id: 'workplace-1', label: 'Operator Workplace' },
  project: { id: 'project-1', label: 'Project Alpha' },
  team: { id: 'team-1', label: 'Team Alpha' },
  readiness: {
    authenticated: true,
    workspaceKnown: true,
    projectKnown: true,
    authorized: true,
    entitled: true,
    schedulerEligible: true,
    healthy: true,
  },
  seats: [
    { id: 'seat-1', label: 'Seat One', durable: true, state: 'READY' },
    { id: 'seat-2', label: 'Seat Two', durable: true, state: 'READY' },
  ],
};

test('S12 owns one presentation-only authenticated restoration root and inherits S0-S10', () => {
  assert.equal(AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT.constructionSlice, 'S12');
  assert.equal(AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT.constructionLayer, 'product-runtime');
  assert.equal(
    AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT.constructionOwner,
    'frontend/spatial/machine-authenticated-restoration.js',
  );
  assert.equal(AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT.semanticBoundary, 'presentation-only');
  assert.deepEqual(
    AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT.inheritedStructuralRoots,
    Array.from({ length: 11 }, (_, index) => 'S' + index),
  );
});

test('S12 restores only explicit backend-read-model identity, context, readiness, and durable seats', () => {
  const result = normalizeAuthenticatedRestorationReadModel(READY_INPUT);
  assert.equal(result.source, 'backend-read-model');
  assert.deepEqual(result.identity, { provider: 'firebase', subjectId: 'uid-test' });
  assert.deepEqual(result.workspace.context, {
    workplace: { id: 'workplace-1', label: 'Operator Workplace' },
    project: { id: 'project-1', label: 'Project Alpha' },
    team: { id: 'team-1', label: 'Team Alpha' },
  });
  assert.equal(result.state, restorationStates().AUTHENTICATED_READY);
  assert.equal(result.available, true);
  assert.equal(result.durableSeatCount, 2);
  assert.equal(result.durableSeats.length, 2);
  assert.equal(result.returnPath, 'world');
  assert.equal(result.presentationOnly, true);
  assert.equal(result.notAuthority, true);
  assert.equal(result.notDurableState, true);
});

test('S12 rejects authenticated state without an explicit Firebase identity', () => {
  const result = normalizeAuthenticatedRestorationReadModel({
    ...READY_INPUT,
    identity: null,
  });
  assert.equal(result.state, restorationStates().AUTHENTICATED_UNAVAILABLE);
  assert.equal(result.reason, restorationReasons().IDENTITY_UNAVAILABLE);
  assert.equal(result.available, false);
  assert.equal(result.durableSeatCount, 0);
});

test('S12 remains reason-bearing when authoritative context is incomplete', () => {
  const result = normalizeAuthenticatedRestorationReadModel({
    ...READY_INPUT,
    project: null,
  });
  assert.equal(result.state, restorationStates().AUTHENTICATED_UNAVAILABLE);
  assert.equal(result.reason, restorationReasons().PROJECT_UNAVAILABLE);
  assert.equal(result.available, false);
});

test('S12 restores durable Seats before evaluating scheduler/runtime readiness', () => {
  const result = normalizeAuthenticatedRestorationReadModel({
    ...READY_INPUT,
    readiness: {
      ...READY_INPUT.readiness,
      schedulerEligible: false,
      healthy: false,
    },
  });
  assert.equal(result.state, restorationStates().AUTHENTICATED_UNAVAILABLE);
  assert.equal(result.reason, restorationReasons().SCHEDULER_UNAVAILABLE);
  assert.equal(result.available, false);
  assert.equal(result.durableSeatCount, 2);
  assert.deepEqual(result.durableSeats.map((seat) => seat.id), ['seat-1', 'seat-2']);
});

test('S12 does not fabricate durable Seats from presentation slots', () => {
  const result = normalizeAuthenticatedRestorationReadModel({
    ...READY_INPUT,
    seats: [
      { id: 'seat-presented', label: 'Presented Seat', durable: false },
    ],
  });
  assert.equal(result.state, restorationStates().AUTHENTICATED_UNAVAILABLE);
  assert.equal(result.reason, restorationReasons().DURABLE_SEATS_UNAVAILABLE);
  assert.equal(result.durableSeatCount, 0);
});

test('S12 rejects impossible durable population instead of silently clamping it', () => {
  const seats = Array.from({ length: 11 }, (_, index) => ({
    id: 'seat-' + (index + 1),
    label: 'Seat ' + (index + 1),
    durable: true,
  }));
  const result = normalizeAuthenticatedRestorationReadModel({ ...READY_INPUT, seats });
  assert.equal(result.state, restorationStates().AUTHENTICATED_UNAVAILABLE);
  assert.equal(result.reason, restorationReasons().DURABLE_SEAT_CAPACITY_INVALID);
  assert.equal(result.durableSeatCount, 0);
  assert.deepEqual(result.durableSeats, []);
});

test('S12 source and public runtime copies remain exact', () => {
  assert.equal(source, publicSource);
});

test('S12 module stays outside Firebase, Firestore, and trusted execution authority', () => {
  assert.doesNotMatch(source, /firebase\/app|firebase\/auth|firestore|supabase|paypal/i);
  assert.doesNotMatch(source, /setDoc|updateDoc|addDoc|writeBatch|deleteDoc/i);
});

assert.equal(
  getAuthenticatedRestorationReadModel().state,
  restorationStates().AUTHENTICATION_REQUIRED,
);
