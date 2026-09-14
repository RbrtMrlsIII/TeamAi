# CHECKPOINT — 029 MOBILE RESPONSIVE UI DIAGNOSIS

**Date:** 2026-09-14  
**Ledger:** Issue #278  
**Diagnostic record:** Issue #314  
**Status:** DIAGNOSED / MOBILE RESPONSIVE INVESTIGATION  
**No 029-release claim.**

## Purpose

Investigate the remaining mobile responsive discrepancy observed after the desktop 3D UI cleanup. This checkpoint is a diagnostic record only.

It is **not a second `MASTERPLAN.md`**, not a replacement for Product Law, Vision, Issue #278, Issue #284, the spatial contracts, or the Tree Census, and it does not authorize implementation by itself.

## Source boundary

The current Seat Stack responsive CSS uses:

- `@media(max-width:760px)` → width `220px`, scale `.88`
- `@media(max-width:520px)` → width `195px`, scale `.76`

The machine navigation has its own responsive positioning under the current DOM chrome implementation. The mobile investigation must treat transformed visual bounds, actual pointer hit areas, viewport clipping, and the fixed footer as separate concerns.

## Independent Browser Use diagnosis — 2026-09-14

Focused public-browser smoke was run against `/TeamAi/hero/` at `390×844` and `320×700`.

### 390×844

- `.seat-stack`: `(234,126.6)` → `(382.2,197.6)`, `z-index:3`.
- `.machine-nav`: right edge reaches `x=393.0`, approximately `3px` beyond the viewport and clipped by `.hero-shell`.
- Visible machine navigation select remains inside the viewport: `(240.7,163.1)` → `(386.3,184.0)`.
- `.spatial-parts` is hidden (`0×0`).
- Bottom controls: `(14,670)` → `(376,830)`.
- Fixed footer: `(0,814.1)` → `(390,844)`, `z-index:6`.

### 320×700

- `.seat-stack`: `(165.4,105)` → `(313.6,176.0)`.
- `.machine-nav`: right edge reaches `x=324.4`, approximately `4.4px` beyond the viewport and clipped.
- Visible select remains inside: `(172.1,141.5)` → `(317.7,162.4)`.
- `.spatial-parts` is hidden (`0×0`).
- Bottom controls: `(14,526)` → `(306,686)`.
- Fixed footer: `(0,670.1)` → `(320,700)`, `z-index:6`.

### Interaction / collision findings

- The fixed footer overlaps the bottom approximately `15.9px` of the control panel at both tested sizes.
- The `Reduced motion` button is overlapped by the footer by approximately `4.9px`; `elementFromPoint` resolves the lower strip to the footer rather than the button.
- No button-to-button overlaps were found.
- Status text wraps to two lines, more tightly at `320px`, but retains approximately `10px` before the motion button.
- No document-level horizontal overflow exists. The machine-nav parent itself is clipped at the right edge.
- Menu is fully visible at both widths.
- Settings panel is hidden in the tested default state and did not create an active collision.

## Residual #315 check — behavior clean

The same focused browser run confirmed:

- ordinary background canvas click remains inert;
- no unintended Seat selection occurred through the tested canvas path;
- before starting the loop the state remained stable at `IDLE`, camera `HERO_WIDE`, zoom `1`, hierarchy closed.

Source/runtime follow-up remains limited to the known generator history: legacy `TURN_FOLLOW` and the old generic Seat-cycle text are still present in preserved base source, while the repository build/deploy path applies the #315 reconciliation before runtime use. This is source-generation debt, not evidence of active public behavior.

## Diagnosis

The original mobile “Seat Stack clipping” description is too broad. The stronger reproducible discrepancy is:

**A. Severe interaction/accessibility issue:** the fixed footer occupies the same vertical region as the bottom controls and can intercept the lower part of the `Reduced motion` control.

**B. Minor visual/containment issue:** `.machine-nav` is allowed to extend a few pixels beyond the narrow viewport and is clipped by the shell even though the visible select remains mostly inside.

**C. Not reproduced as a current issue:** the Seat Stack itself is not materially outside the viewport at the two tested sizes; its visible transformed bounds remain inside the viewport.

**D. Desktop remains materially cleaner:** this investigation does not imply a need to reintroduce the retired camera wall or create a second UI rail.

## Do not assume yet

- Do not invent a new mobile layout or new navigation rule before the source and responsive contracts are reconciled.
- Do not fix by hiding the Seat Stack, Parts selector, world navigation, or bottom controls.
- Do not move controls into a second UI rail if that creates another chrome authority.
- Do not weaken desktop behavior to make the mobile screenshot look clean.
- Do not promote a measured value into product law without representative browser evidence.
- Do not classify the Seat Stack itself as the primary mobile defect unless a future device/viewport reproduces a stronger failure.

## Next diagnostic boundary

Before implementation, reconcile the responsive owner contract for:

`machine-nav + seat-stack + hero-controls + fixed footer`

and determine the intended invariant:

`all interactive targets fully visible + pointer-hit areas non-overlapping + world remains readable + one coherent machine-chrome authority`

Then implement the smallest governed change and re-test at representative narrow widths, including at least `390×844`, `360×800`, and `320×700`.

## Verification plan

`current main → Vision / spatial responsive contract → exact DOM/CSS owner → representative browser measurements → interaction hit-test observation → bounded diagnosis → implementation PR only after contract reconciliation`

The eventual fix, if required, should preserve the existing single world-navigation and single machine-chrome ownership model and must be separately verified on desktop and multiple narrow viewports.

## Related authorities

- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `docs/VISION.md`
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`
- `docs/TEAMAI_3D_HERO_MACHINE_CONSTRUCTION.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- Issue #278
- Issue #314
- PR #315
- PR #316
