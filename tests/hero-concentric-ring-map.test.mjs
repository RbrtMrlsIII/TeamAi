import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const contract = await readFile(new URL('../docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md', import.meta.url), 'utf8');
const seatSheet = await readFile(new URL('../docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md', import.meta.url), 'utf8');

test('concentric ring map defines R0–R3 center to outer', () => {
  assert.match(map, /R0/);
  assert.match(map, /R1/);
  assert.match(map, /R2/);
  assert.match(map, /R3/);
  assert.match(map, /WORKSPACE CORE|Workspace core/i);
  assert.match(map, /BACKEND DISPLAY/i);
  assert.match(map, /SETUP|CONFIG/i);
  assert.match(map, /SEAT RING|Seat ring/i);
});

test('WORKSPACE_ZIPSKILLS is workspace tree not seat child', () => {
  assert.match(map, /WORKSPACE_ZIPSKILLS/);
  assert.match(seatSheet, /WORKSPACE_ZIPSKILLS/);
  assert.doesNotMatch(seatSheet, /\|\s*\d+\s*\|\s*`SEAT_ZIPSKILLS`/);
});

test('baseline and machine contract point at ring map', () => {
  assert.match(baseline, /Concentric ring map|Concentric Ring Map/i);
  assert.match(contract, /Concentric Ring Map|Intermediate rings/i);
});

test('presentation-only boundary on backend threads and setup', () => {
  assert.match(map, /Presentation only|presentation only/);
  assert.match(map, /animated threads/i);
  assert.match(map, /No OAuth|not auth authority|Presentation only/i);
  assert.doesNotMatch(map, /client_secret|Bearer [A-Za-z0-9]/i);
});
