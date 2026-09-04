# TEAM-EXPERIENCE-029 — F7 Shared E4 Plate Slice

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Depends on:** Deck interior (#25) + theme-root

## Purpose

Mount the **single shared F7 Modal** (E4 approval plate): focus trap, DENY · APPROVE cluster, no domain execution.

## Included

| Path | Role |
|---|---|
| `frontend/spatial/f7-modal.css` | Plate layout on theme-root modal primitives |
| `frontend/spatial/index.html` | F7 markup + preview trigger |
| `frontend/spatial/shell-nav.js` / `.ts` | open/close, Escape, Tab trap, UI-only result note |
| Skill hygiene | Spatial README runtime mirrors; SKILL_WIRING agent-mirror note |

## Contracts honored

- One plate; not a second dialog system
- Primary is not the only visible verb (DENY + APPROVE)
- Color is not the only status signal
- `approval.mount` does not execute or write domain state
- Reduced motion: no travel dependency on the plate

## Not included

- Real action queue / PayPal / Firestore
- Planning Handoff cluster (REJECT · EDIT · MORE · APPROVE) — next optional shell
- Hosting route wiring

## Verify

Serve `frontend/spatial/`. Open **Preview approval plate**, Tab within plate, Escape/Close/DENY/APPROVE. Confirm result note is UI-only. GitHub Actions authoritative; Vercel cutoff non-blocking.
