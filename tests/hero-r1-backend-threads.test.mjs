import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { BACKEND_DISPLAY_V1 } from '../public/hero-hierarchy-runtime.js';
import {
  R1_BACKEND_PRESENTATION_THREADS_V1,
  resolveBackendPresentationThreads,
  deriveBackendPresentationThreadPaths,
  pointOnBackendThread,
} from '../frontend/spatial/hero-r1-backend-threads.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const source = await readFile(
  new URL('../frontend/spatial/hero-r1-backend-threads.js', import.meta.url),
  'utf8',
);
const publicModule = await readFile(
  new URL('../public/hero-r1-backend-threads.js', import.meta.url),
  'utf8',
);

test('R1 presentation relationships use stable source/target identities', () => {
  assert.equal(R1_BACKEND_PRESENTATION_THREADS_V1.length, 2);
  assert.deepEqual(
    R1_BACKEND_PRESENTATION_THREADS_V1.map((thread) => [thread.id, thread.from, thread.to]),
    [
      [
        'WORKSPACE_BACKEND_THREAD#docs→rules',
        'WORKSPACE_BACKEND_DISPLAY#docs',
        'WORKSPACE_BACKEND_DISPLAY#rules',
      ],
      [
        'WORKSPACE_BACKEND_THREAD#rules→connect',
        'WORKSPACE_BACKEND_DISPLAY#rules',
        'WORKSPACE_BACKEND_DISPLAY#connect',
      ],
    ],
  );
});

test('R1 thread resolution fails closed for missing presentation endpoints', () => {
  const resolved = resolveBackendPresentationThreads({
    catalog: BACKEND_DISPLAY_V1,
    relationships: [
      ...R1_BACKEND_PRESENTATION_THREADS_V1,
      {
        id: 'WORKSPACE_BACKEND_THREAD#missing',
        from: 'WORKSPACE_BACKEND_DISPLAY#missing',
        to: 'WORKSPACE_BACKEND_DISPLAY#docs',
      },
    ],
  });
  assert.equal(resolved.length, 2);
  assert.equal(resolved.every((thread) => thread.presentationOnly), true);
});

test('R1 thread paths are deterministic and route outside the workspace center', () => {
  const first = deriveBackendPresentationThreadPaths({
    workspaceRadius: 5.95,
    ringScale: 1.18,
    catalog: BACKEND_DISPLAY_V1,
  });
  const second = deriveBackendPresentationThreadPaths({
    workspaceRadius: 5.95,
    ringScale: 1.18,
    catalog: BACKEND_DISPLAY_V1,
  });
  assert.deepEqual(first, second);
  assert.equal(first.length, 2);
  for (const path of first) {
    assert.ok(path.length > 0);
    assert.equal(path.presentationOnly, true);
    const mid = pointOnBackendThread(path, 0.5);
    const midpointRadius = Math.hypot(mid.x, mid.z);
    assert.ok(midpointRadius >= path.ringRadius);
    assert.ok(path.ringRadius > 5.95);
    assert.equal(path.points.length, 9);
  }
});

test('R1 thread owner stays synchronized and canonical Hero calls it', () => {
  assert.equal(source, publicModule);
  assert.match(hero, /drawBackendDisplayThreadsModule/);
  assert.match(hero, /drawBackendDisplayThreads\(now\/1000\)/);
  assert.match(hero, /ringScale: RING_R1_SCALE/);
});

test('R1 thread owner is presentation-only', () => {
  assert.doesNotMatch(source, /oauth|password|apiKey|firebase\.auth|supabase|firestore|paypal/i);
});
