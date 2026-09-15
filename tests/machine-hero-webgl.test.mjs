import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../public/machine-hero-webgl.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../public/machine-hero-preview.html', import.meta.url), 'utf8');

test('WebGL machine preview is opt-in and separate from production canvas', () => {
  assert.match(source, /get\('machine-preview'\)/);
  assert.match(source, /mountMachineWebGLPreview/);
  assert.match(source, /data-machine-hero-webgl/);
  assert.match(page, /mountMachineWebGLPreview/);
});

test('WebGL projector consumes semantic subject, camera identity, and wiring route', () => {
  assert.match(source, /createMachineTransition/);
  assert.match(source, /resolveMachineCamera/);
  assert.match(source, /cameraId:\s*'SEAT_CLOSE'/);
  assert.match(source, /subject\.center/);
  assert.match(source, /t\.wiring\.route/);
  assert.match(source, /gl\.LINE_STRIP/);
});

test('WebGL preview has no provider, auth, or durable-state authority', () => {
  assert.doesNotMatch(source, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
});
