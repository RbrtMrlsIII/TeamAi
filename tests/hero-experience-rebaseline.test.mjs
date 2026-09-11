import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = () => readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const css = () => readFile(new URL('../public/experience-rebaseline.css', import.meta.url), 'utf8');
const js = () => readFile(new URL('../public/experience-rebaseline.js', import.meta.url), 'utf8');

test('classic entrance is explicit and 3D is an intentional destination', async () => {
  const src = await html();
  assert.match(src, /data-experience="classic"/);
  assert.match(src, /data-world-entry/);
  assert.match(src, /Enter 3D world/);
  assert.match(src, /data-classic-return/);
  assert.match(src, /data-experience="classic"/);
  assert.match(src, /experience-rebaseline\.js/);
});

test('classic mode removes the former overlay wall instead of soft-hiding it', async () => {
  const src = await css();
  assert.match(src, /data-experience="classic"/);
  assert.match(src, /\.seat-stack/);
  assert.match(src, /\.spatial-parts/);
  assert.match(src, /display:\s*none\s*!important/);
});

test('world navigation has one coherent menu and settings destination', async () => {
  const src = await html();
  assert.match(src, /class="world-navigation"/);
  assert.match(src, /data-world-menu-toggle/);
  assert.match(src, /data-settings-open/);
  assert.match(src, /data-world-camera-request="HERO_WIDE"/);
});

test('experience controller preserves one explicit mode transition', async () => {
  const src = await js();
  assert.match(src, /setExperience\('world'/);
  assert.match(src, /setExperience\('classic'/);
  assert.match(src, /TeamAiHeroLayerHandoff/);
});

test('retired camera concepts are not reintroduced by the new experience layer', async () => {
  const src = `${await html()}\n${await css()}\n${await js()}`;
  assert.doesNotMatch(src, /HERO_LOW_ORBIT/);
  assert.doesNotMatch(src, /TURN_FOLLOW/);
});
