import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_TOOLKIT_V1,
  toolkitChildAccessibleName,
} from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const sheet = await readFile(new URL('../docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md', import.meta.url), 'utf8');

test('SEAT_TOOLKIT is optional child in shell children', () => {
  assert.equal(HIERARCHY_PART.SEAT_TOOLKIT, 'SEAT_TOOLKIT');
  assert.ok(SEAT_SHELL_V1_CHILDREN.includes(HIERARCHY_PART.SEAT_TOOLKIT));
  assert.ok(SEAT_TOOLKIT_V1.length >= 2);
  assert.ok(SEAT_TOOLKIT_V1.every((x) => x.optional === true));
});

test('accessible name denies entitlement / required setup', () => {
  const name = toolkitChildAccessibleName();
  assert.match(name, /optional/i);
  assert.match(name, /not required/i);
  assert.doesNotMatch(name, /authorized|entitled|must configure/i);
});

test('hero-flex wires toolkit label and draw path', () => {
  assert.match(hero, /SEAT_TOOLKIT/);
  assert.match(hero, /toolkitChildAccessibleName/);
  assert.match(hero, /isToolkit/);
});

test('seat shell sheet marks toolkit optional', () => {
  assert.match(sheet, /SEAT_TOOLKIT/);
  assert.match(sheet, /optional|Not required/i);
});
