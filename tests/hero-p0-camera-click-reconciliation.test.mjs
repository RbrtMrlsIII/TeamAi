import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

test('029 reconciliation removes retired TURN_FOLLOW from generated runtime', () => {
  assert.doesNotMatch(runtime, /setCamera\(['"]TURN_FOLLOW['"]\)/);
});

test('029 reconciliation leaves contribution transition camera-neutral', () => {
  assert.match(runtime, /contribution=0;setState\(['"]CONTRIBUTE['"],'contribution-start'\)/);
  assert.doesNotMatch(
    runtime,
    /contribution=0;setCamera\(['"](?:TURN_FOLLOW|HERO_WIDE)['"]\);setState\(['"]CONTRIBUTE['"],'contribution-start'\)/,
  );
});

test('029 reconciliation removes generic background Seat cycling', () => {
  assert.doesNotMatch(runtime, /selectSeatShell\(\(selectedSeat\+1\)%seatCount\)/);
});

test('029 reconciliation does not invent another Seat walker', () => {
  assert.doesNotMatch(runtime, /nextSeat|previousSeat|advanceSeat/);
});
