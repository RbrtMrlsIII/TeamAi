# CHECKPOINT — Issue #98 Theme-lighting adapter fixture matrix

**Date:** 2026-09-08  
**Status:** IMPLEMENTED (contract tests on `main`) / NOT full Slice-B live light-rig endorsement  
**Issue:** #98 (verification) · related #84 (adapter)

## What is proven

| Claim | Evidence |
|-------|----------|
| Fixture matrix covers light/dark, compact, reduced motion, focus, status | `HERO_THEME_LIGHTING_FIXTURES` + `tests/hero-theme-lighting-adapter.test.mjs` |
| Outputs finite and bounded [0,1] | same tests + `HERO_THEME_LIGHTING_LIMITS` |
| Deterministic, side-effect free | double-map equality tests |
| Light ≠ Dark under shared contract | intensity distinction assertions |
| Reduced motion flips choreography only | intensity preserved, `reducedMotionChoreography` false |
| Status/focus are numeric channels | shadow / grazing deltas |
| No Firebase / provider I/O in adapter | source scan assertion |

## Boundary

- Adapter remains **presentation-only**.
- Full Masterplan endorsement of TEAM-EXPERIENCE-029 is **separate**.
- Slice B (live environment-light rig consuming adapter in browser) remains downstream (#85).

## Files

- `frontend/spatial/hero-theme-lighting-adapter.js`
- `tests/hero-theme-lighting-adapter.test.mjs`
