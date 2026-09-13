/**
 * 029 pre-P1 camera/input reconciliation.
 *
 * Purpose: remove two behaviors proven by owner + browser smoke from the active
 * generated Hero runtime without creating a new camera or navigation authority:
 *   1) turn-loop contribution must not seize the camera;
 *   2) empty/background canvas clicks must not cycle to the next Seat.
 *
 * The real semantic spatial hit-test remains a later governed slice. Until then,
 * background clicks are a safe no-op rather than an invented selection rule.
 *
 * Input: public/hero-flex.js (assembled runtime)
 * Output: same file, deterministically reconciled.
 * No 029-release claim.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../public/hero-flex.js', import.meta.url);
let text = readFileSync(path, 'utf8');
let changed = false;

const retiredTurnCamera = "setCamera('TURN_FOLLOW')";
if (text.includes(retiredTurnCamera)) {
  text = text.replaceAll(retiredTurnCamera, 'void 0 /* retired TURN_FOLLOW */');
  changed = true;
}

const contributionWideCamera = "contribution=0;setCamera('HERO_WIDE');setState('CONTRIBUTE','contribution-start')";
if (text.includes(contributionWideCamera)) {
  text = text.replace(
    contributionWideCamera,
    "contribution=0;setState('CONTRIBUTE','contribution-start')",
  );
  changed = true;
}

const backgroundSeatCycle = /selectSeatShell\(\(selectedSeat\+1\)%seatCount\)/g;
if (backgroundSeatCycle.test(text)) {
  text = text.replace(backgroundSeatCycle, 'void 0 /* background click no-op */');
  changed = true;
}

writeFileSync(path, text);
console.log(`029 camera/click reconcile: ${changed ? 'changed' : 'already clean'}`);
