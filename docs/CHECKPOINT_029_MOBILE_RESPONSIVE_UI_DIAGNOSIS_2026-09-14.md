# CHECKPOINT — 029 MOBILE RESPONSIVE UI DIAGNOSIS

**Date:** 2026-09-14  
**Ledger:** Issue #278  
**Diagnostic record:** Issue #314  
**Status:** DIAGNOSIS / MOBILE RESPONSIVE INVESTIGATION  
**No 029-release claim.**

## Purpose

Investigate the remaining mobile responsive discrepancy observed after the desktop 3D UI cleanup. This checkpoint is a diagnostic record only.

It is **not a second `MASTERPLAN.md`**, not a replacement for Product Law, Vision, Issue #278, Issue #284, the spatial contracts, or the Tree Census, and it does not authorize implementation by itself.

## Current observed boundary

The current public 3D surface is materially cleaner on desktop, with the former duplicate camera wall gone. A prior owner + Browser Use smoke pass on `390×844` nevertheless observed the Seat Stack overlapping the 3D world and the selector clipping at the right edge.

The relevant current CSS uses responsive overrides around the Seat Stack, including:

- `@media(max-width:760px)` → width `220px`, scale `.88`
- `@media(max-width:520px)` → width `195px`, scale `.76`

The investigation must determine whether the problem is caused by the stacking model, transform scaling, absolute positioning against the world viewport, content height, selector width, safe-area/inset behavior, or an interaction collision with other mobile controls.

## Diagnostic questions

1. Does the Seat Stack remain fully within the visual viewport at representative widths/heights?
2. Does its transformed bounding box differ materially from its CSS layout box, causing clipping or overlap that a simple width calculation misses?
3. Do seat-stack modules, the Parts selector, world navigation, settings panel, or bottom controls overlap one another or cover meaningful world content?
4. Are any controls clipped while still accepting pointer input outside their visible bounds?
5. Does the issue appear at `390×844`, `360×800`, `320×700`, or only one breakpoint?
6. Does browser zoom/device scale alter the result?
7. Is the mobile layout using one coherent DOM/UI authority, or does legacy inspection/chrome remain reachable through another path?
8. Does reduced-motion change the spatial/UI occupancy or only animation?

## Do not assume yet

- Do not invent a new mobile layout or new navigation rule before the source and responsive contracts are reconciled.
- Do not fix by simply hiding the Seat Stack, Parts selector, or other product controls.
- Do not move controls into a second UI rail if that creates another chrome authority.
- Do not weaken desktop behavior to make the mobile screenshot look clean.
- Do not promote a measured value into product law without representative browser evidence.

## Verification plan

`current main → Vision / spatial responsive contract → exact DOM/CSS owner → representative browser measurements → interaction hit-test observation → bounded diagnosis → implementation PR only after contract reconciliation`

The eventual fix, if required, should preserve the existing single world-navigation and single machine-chrome ownership model and must be separately verified on desktop and multiple narrow viewports.

## Residual #315 check

A small post-merge residual source check found that legacy `TURN_FOLLOW` and the old generic Seat-cycle expression still exist in the **base/generated-source history**, but the repository-owned build path applies the #315 reconciliation before testing/deployment. This remains source-generation debt, not proof of active public behavior. The mobile PR does not change that boundary.

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
