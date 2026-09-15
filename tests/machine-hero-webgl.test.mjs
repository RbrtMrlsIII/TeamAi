import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../public/machine-hero-webgl.js', import.meta.url), 'utf8');
const payload = await readFile(new URL('../public/machine-hero-payload.js', import.meta.url), 'utf8');
const graph = await readFile(new URL('../public/machine-hero-graph.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../public/machine-hero-preview.html', import.meta.url), 'utf8');
const magnificent = await readFile(new URL('../public/machine-hero-magnificent.js', import.meta.url), 'utf8');
const magnificentPage = await readFile(new URL('../public/machine-hero-magnificent.html', import.meta.url), 'utf8');

test('WebGL machine preview is opt-in and separate from production canvas', () => {
  assert.match(source, /get\('machine-preview'\)/);
  assert.match(source, /mountMachineWebGLPreview/);
  assert.match(source, /data-machine-hero-webgl/);
  assert.match(page, /mountMachineWebGLPreview/);
});

test('WebGL projector resolves its browser graph dependency and graph resolves payload dependency', () => {
  assert.match(source, /\.\/machine-hero-graph\.js/);
  assert.match(graph, /\.\/machine-hero-scene\.js/);
  assert.match(payload, /createMachineTransitionFromPayload/);
  assert.match(graph, /createMachineGraph/);
});

test('WebGL projector renders multiple semantic parts and wiring routes', () => {
  assert.match(source, /SEAT_CONNECTION/);
  assert.match(source, /SEAT_BEHAVIOR/);
  assert.match(source, /SEAT_TOOLKIT/);
  assert.match(source, /createMachineGraph/);
  assert.match(source, /graph\.transitions/);
  assert.match(source, /transition\.wiring\.route/);
  assert.match(source, /graph\.renderedParts/);
  assert.match(source, /gl\.LINE_STRIP/);
});

test('WebGL preview exposes a real expansion state transition', () => {
  assert.match(source, /data-machine-webgl-expand/);
  assert.match(source, /expanded=!expanded/);
  assert.match(source, /sourceAmount:0,targetAmount:1/);
  assert.match(source, /divisions expanded/);
});

test('WebGL projector keeps named camera identity separate from semantic subject', () => {
  assert.match(source, /resolveMachineCamera/);
  assert.match(source, /cameraId:'SEAT_CLOSE'/);
  assert.match(source, /graph\.subject/);
});

test('magnificent renderer is downstream of the shared 15-module machine core', () => {
  assert.match(magnificent, /\.\/machine-core-layout-runtime\.js/);
  assert.match(magnificent, /\.\/machine-core-animation\.js/);
  assert.match(magnificent, /createBranchConnectionCore/);
  assert.match(magnificent, /resolveBranchCamera/);
  assert.match(magnificent, /createMachineAnimation/);
  assert.match(magnificent, /scene\.parts/);
  assert.match(magnificent, /scene\.connections/);
  assert.match(magnificent, /requestAnimationFrame/);
  assert.match(magnificent, /createGradientRing/);
  assert.match(magnificentPage, /data-machine-magnificent/);
  assert.match(magnificentPage, /prototype · not production/);
});

test('WebGL preview has no provider, auth, or durable-state authority', () => {
  assert.doesNotMatch(source, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
  assert.doesNotMatch(magnificent, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(magnificent, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
});
