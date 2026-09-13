import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const reconcile = () => {
  const result = spawnSync('node', ['scripts/apply-029-camera-click-reconcile.mjs'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
};

const readRuntime = () => readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

test('029 reconciliation removes retired TURN_FOLLOW from generated runtime', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.doesNotMatch(runtime, /setCamera\(['"]TURN_FOLLOW['"]\)/);
});

test('029 reconciliation leaves contribution transition camera-neutral', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.match(runtime, /setState\(['"]CONTRIBUTE['"],['"]contribution-start['"]\)/);
  assert.doesNotMatch(
    runtime,
    /setCamera\(['"](?:TURN_FOLLOW|HERO_WIDE)['"]\);setState\(['"]CONTRIBUTE['"],['"]contribution-start['"]\)/,
  );
});

test('029 reconciliation removes generic background Seat cycling', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.doesNotMatch(runtime, /selectSeatShell\(\(selectedSeat\+1\)%seatCount\)/);
});

test('029 reconciliation does not invent another Seat walker', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.doesNotMatch(runtime, /nextSeat|previousSeat|advanceSeat/);
});
