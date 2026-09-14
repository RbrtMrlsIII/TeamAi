# CHECKPOINT — 029 TURN LOOP CAMERA + SEAT CLICK DIAGNOSIS

**Date:** 2026-09-14
**Ledger:** Issue #278
**Diagnostic record:** Issue #314
**Status:** DIAGNOSIS / PRE-P1.1 RECONCILIATION
**No 029-release claim.**

## Evidence

Owner smoke observation and independent Browser Use verification both establish:

- The legacy 1–15 low-POV behavior is no longer visible on the active 3D surface.
- The 3D desktop surface no longer shows the former duplicate/messy camera-control wall.
- Supported swipe/orbit behavior is directly proportional.
- During the turn loop, the runtime accepts orbit input but also forces camera/subject transitions.
- Clicking an empty-looking scene area advances Seat selection and opens the newly selected Seat connection face.

Independent browser pass was executed on desktop 1440×900 and mobile 390×844.

## Source reconciliation

### Turn-loop camera

The assembled runtime currently contains `HERO_WIDE` at the `ACTIVE → CONTRIBUTE` transition after the existing generator pass, while the preserved base source still contains the retired `setCamera('TURN_FOLLOW')` call. The patch engine itself rewrites that retired call to `HERO_WIDE`.

This establishes a source-generation discrepancy rather than proof that the deployed runtime is literally invoking `TURN_FOLLOW`.

The active browser still demonstrates automatic camera/subject transitions during the loop. Therefore the architectural question is broader than the stale identifier: the turn-loop transition still owns a camera transition at contribution start.

Current intended diagnostic boundary: ordinary free 3D orbit/zoom remains user camera control during contribution unless a current canonical contract explicitly grants camera subject capture. Do not create or revive another camera mode.

### Scene click → next Seat

`docs/TEAMAI_3D_HERO_NEXT_SLICES.md` and current Hero source document the current click fallback: clicks outside ring-focus side bands cycle `selectSeatShell((selectedSeat+1)%seatCount)` because true spatial hit-testing is not yet implemented.

Browser verification reproduced this exact consequence.

Current diagnostic boundary: this behavior is implemented, but it is not established as final product law. The semantic question is whether world clicks should select the Seat actually under the pointer via spatial hit-testing, or whether another explicit interaction contract is intended.

### Orbit

`public/hero-cam4-edge-swipe.js` implements `proportionalSwipeDelta()` and retains `inverseSwipeDelta` only as a backward-named compatibility export pointing to the proportional implementation. Browser behavior matches proportional motion.

## Pre-P1.1 rule

These findings are recorded before the first new structural vertical so that `SEAT_CONNECTION` does not inherit disputed camera/input ownership.

The recommended first vertical remains the existing `TREE-HERO-SEAT → SEAT_CONNECTION` fixture vertical with:

`payload → division → OPENING/OPEN/CLOSING → clearance → semantic camera subject → one connection port/edge → minimal electricity → tests/browser/census`

See `docs/TEAMAI_3D_HERO_MACHINE_CONSTRUCTION.md` §4 and §3. The diagnostic record is not a second Masterplan.

## Validation correction

The first PR test run reached the full project suite and returned **624 passing / 1 failing** because the initial new camera-neutral assertion was too formatting-specific. The assertion was corrected to verify the actual invariant after deterministic runtime reconciliation. The subsequent TeamAi project suite and Governance run passed, including the Full Project ZIP verification.

## Browser regression guard

`tests/e2e/029-camera-input-regressions.spec.ts` adds browser-level regression coverage for the two diagnosed behaviors: preserving the selected camera and Seat during contribution, and preventing an empty-canvas click from advancing Seat selection. The guard protects the reconciled behavior; it does not define the eventual semantic hit-testing design.
