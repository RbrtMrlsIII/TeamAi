/**
 * 029 pre-P1 camera/input reconciliation.
 *
 * Purpose: remove two behaviors proven by owner + browser smoke from the active
 * generated Hero runtime without creating a new camera or navigation authority:
 *   1) turn-loop camera mutations;
 *   2) empty/background canvas Seat cycling.
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

const turnFollow = "setCamera('TURN_FOLLOW')";
if (text.includes(turnFollow)) {
  text = text.replaceAll(turnFollow, 'void 0 /* retired TURN_FOLLOW */');
  changed = true;
}

const contributionCamera = "contribution=0;setCamera('HERO_WIDE');setState('CONTRIBUTE','contribution-start')";
if (text.includes(contributionCamera)) {
  text = text.replace(
    contributionCamera,
    "contribution=0;setState('CONTRIBUTE','contribution-start')",
  );
  changed = true;
}

const handoffCamera = "selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('TEAM_ORBIT')";
if (text.includes(handoffCamera)) {
  text = text.replace(
    handoffCamera,
    "selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus')",
  );
  changed = true;
}

const backgroundSeatCycle = "const next=(selectedSeat+1)%seatCount;selectSeatShell(next);";
if (text.includes(backgroundSeatCycle)) {
  text = text.replace(
    backgroundSeatCycle,
    'void 0 /* background click no-op; semantic hit-testing is a later governed slice */;',
  );
  changed = true;
}

writeFileSync(path, text);
console.log(`029 camera/click reconcile: ${changed ? 'changed' : 'already clean'}`);
