import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const applyScripts = ["scripts/apply-seat-plate-phase2.mjs","scripts/apply-seat-connection-wire.mjs","scripts/apply-seat-provider-bind-wire.mjs","scripts/apply-seat1-connection-edge-flex.mjs","scripts/apply-seat-division-focus-compaction.mjs","scripts/apply-029-adjacent-division-expansion-render.mjs"];

test('historical spatial apply wrappers are verification-only', () => {
  for (const file of applyScripts) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /writeFileSync|writeFile\(|appendFile|renameSync|unlinkSync|spawnSync/);
  }
});

test('canonical Seat shell owns the migrated dependency chain explicitly', () => {
  const shell = readFileSync('frontend/spatial/shell-nav.js', 'utf8');
  assert.match(shell, /from "\.\/seat-read-model\.js"/);
  assert.match(shell, /from "\.\/seat-connection-wire\.js"/);
  assert.match(shell, /from "\.\/seat-provider-bind-wire\.js"/);
  assert.match(shell, /async function testSeatConnection\(\)/);
  assert.match(shell, /function projectedSeat\(seatId = activeSeat\)/);
});
