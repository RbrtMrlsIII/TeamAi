# TEAM-EXPERIENCE-029 — Shell + Navigation (F1 / F2) Slice

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Depends on:** theme-root foundation on `main`

## Purpose

Land persistent chrome: **Shell (F1)** and **Navigation (F2)** on the single theme root, without composing the full Command Deck interior.

## Included

| Path | Role |
|---|---|
| `frontend/spatial/index.html` | F0 host; F1 shell; F2 nav; F6 status display-only; F3 placeholder |
| `frontend/spatial/shell-nav.css` | Shell/nav layout; theme-root tokens only |
| `frontend/spatial/shell-nav.js` | Theme + density + nav selection (presentation) |
| `frontend/spatial/shell-nav.ts` | Typed mirror of the JS presentation script |
| `frontend/spatial/theme-root.js` | Browser ESM companion of `theme-root.ts` |

Nav labels: Deck · Workplace · Seats · Planning · Working · Artifacts · Approvals · Settings.

## Legal boxes

Shell · Panel · Card · Control · Navigation only. F6 is not a nav destination. F7 not mounted.

## Allowed scripts

Theme mode (`source=user` on manual toggle), density, nav `aria-current` + stage copy.

## Forbidden (not implemented)

Firestore / PayPal / scheduler / entitlement writes; second theme root; Deck interior composition.

## Verify

Serve `frontend/spatial/` over http(s) (ES modules). Toggle theme/density; click nav. Playwright `/health` e2e unchanged. Vercel cutoff is not a blocker.

## Next

Command Deck interior (seat rail + active + why-next) still presentation-only.
