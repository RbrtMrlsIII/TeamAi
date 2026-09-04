# TEAM-EXPERIENCE-029 — F7 Handoff cluster + Playwright smoke

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Depends on:** F7 plate (#26)

## Purpose

1. **Cluster B** on the same F7 plate: `REJECT` · `EDIT` · `MORE` · `APPROVE` (Planning Handoff).
2. **Playwright smoke** for open/close and both clusters via `/spatial/` static serve.

## Contracts

- One plate; two clusters (`data-modal-cluster="action"|"handoff"`)
- Handoff Escape / MORE dismisses plate without approving
- All verbs presentation-only — no Firestore / PayPal / scheduler
- Primary never the only visible verb

## Routes

| Path | Role |
|------|------|
| `GET /spatial/` | Presentation HTML (`frontend/spatial/`) |
| `GET /health` | Existing API health |

Static spatial serve is for verification and local review only — not Firebase Hosting authority.

## Verify

`npm run test:e2e` includes `tests/e2e/spatial-f7.spec.ts`. GitHub Actions authoritative; Vercel cutoff non-blocking.
