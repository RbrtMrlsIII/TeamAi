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

test('029 reconciliation keeps retired TURN_FOLLOW absent from controller', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.doesNotMatch(runtime, /setCamera\(['"]TURN_FOLLOW['"]\)/);
});

test('029 reconciliation leaves contribution transition camera-neutral', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.match(runtime, /setState\(\s*['"]CONTRIBUTE['"]\s*,\s*['"]contribution-start['"]\s*\)/);
  assert.doesNotMatch(
    runtime,
    /setCamera\(['"](?:TURN_FOLLOW|HERO_WIDE)['"]\);\s*setState\(['"]CONTRIBUTE['"],\s*['"]contribution-start['"]\)/,
  );
});

test('029 controller uses safe background click no-op', async () => {
  reconcile();
  const runtime = await readRuntime();
  assert.match(runtime, /event\.preventDefault\(\)/);
});

test('029 reconciliation script is validation-only', async () => {
  reconcile();
  const runtime = await readRuntime();
  const script = await readFile(new URL('../scripts/apply-029-camera-click-reconcile.mjs', import.meta.url), 'utf8');
  assert.match(script, /no patch|source-owned|no mutation/i);
});
