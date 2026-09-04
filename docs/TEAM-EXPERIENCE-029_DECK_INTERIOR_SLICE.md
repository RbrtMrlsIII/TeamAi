# TEAM-EXPERIENCE-029 — Command Deck Interior Slice

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Depends on:** Shell + Navigation (#24) + theme-root

## Purpose

Inhabit the Deck body with the freeze layout: **seat rail**, **active E3 stage** (Planning/Working skin only), and **why-next** panel.

## Included

| Path | Role |
|---|---|
| `frontend/spatial/index.html` | Deck grid + off-deck placeholder |
| `frontend/spatial/deck-interior.css` | Grid, seat cards, active/why layout |
| `frontend/spatial/shell-nav.js` | Stage toggle, seat select highlight, composition switch |

Placeholder seats (Alpha / Beta / Gamma) are static presentation fixtures — not domain seats.

## Scripts

| May | Must not |
|---|---|
| Planning/Working stage skin | Second theme |
| Seat `selected` highlight | Choose next scheduler actor |
| Theme / density | Firestore / PayPal / entitlements |

## CSS notes (review)

- `[hidden]` uses attribute specificity against `.ta-deck { display: grid }` — **no `!important`**.
- Deck panels override shell-nav `.ta-main .ta-panel { max-width: 48rem }` so the three-column grid is not cramped.

## Not included

- Live conversation / task graph
- F7 approval plate
- Real seat/provider data
- Scheduler eligibility logic

## Verify

Serve `frontend/spatial/`. On Deck: select seats, toggle Planning/Working, theme, density. Other nav destinations show off-deck placeholder. GitHub Actions authoritative; Vercel cutoff non-blocking.
