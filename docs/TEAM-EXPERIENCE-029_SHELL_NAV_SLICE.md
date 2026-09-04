# TEAM-EXPERIENCE-029 — Shell + Navigation (F1 / F2) Slice

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Depends on:** theme-root foundation on `main` (`frontend/spatial/theme-root.css`, `theme-root.ts`)

## Purpose

Land the first inhabited persistent chrome: **Shell (F1)** and **Navigation (F2)** on the single theme root, without composing the full Command Deck interior.

## Included

| Path | Role |
|---|---|
| `frontend/spatial/index.html` | F0 atmosphere host; F1 shell; F2 nav; F6 status display-only; F3 placeholder stage |
| `frontend/spatial/shell-nav.css` | Layout for shell/nav only; consumes theme-root tokens |
| `frontend/spatial/shell-nav.ts` | Theme toggle, density toggle, nav `aria-current`, stage label |

Nav destinations (labels only): Deck · Workplace · Seats · Planning · Working · Artifacts · Approvals · Settings.

## Legal boxes preserved

Shell · Panel · Card · Control · Navigation remain the only legal boxes. F6 Status is a system surface (not a nav destination). F7 Modal is not mounted in this slice.

## Scripts (allowed)

- Theme mode + source=user on manual toggle
- Density default/compact
- Nav selection (presentation highlight + placeholder copy)

## Must not (and does not)

- Write Firestore, charge PayPal, pick scheduler actor, alter entitlements
- Second theme root or page-local palette
- Seat rail, active E3 stage, why-next, or approval plate composition
- Treat F6 as a debugger or navigation destination

## Verification

- Open `frontend/spatial/index.html` via a static file server or IDE preview (ES modules require http(s), not always `file://`).
- Confirm theme toggle retunes material without reshuffling shell/nav structure.
- Confirm density compact tightens spacing tokens from theme-root.
- Confirm nav updates `aria-current` and stage title only.
- Existing Playwright health e2e remains on `/health` and is unchanged.
- Vercel cutoff: do not block on Vercel; GitHub Actions remain authoritative CI.

## Next authorized slices

1. Command Deck interior: seat rail (F4 cards in F3 panel) + active stage + why-next (still presentation).
2. Optional static route from Fastify/Firebase Hosting when delivery wiring is authorized — not required for this skeleton.
