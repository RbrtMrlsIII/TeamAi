# TEAM-EXPERIENCE-029 — Command Deck Finishing / Reconciliation Contract

**Status:** ACTIVE FRONTEND CATCH-UP SLICE
**Baseline:** `main` at `72613b93cbe59c861ceefd2361a416b7afd4e2f1`

## Purpose

Finish and reconcile the already-inhabited Command Deck without introducing a new product, backend, scheduler, provider, commerce, or theme authority.

## Canonical boundaries

- `PRODUCT_LAW.md` remains product authority.
- `MASTERPLAN.md` remains chronological execution authority.
- The existing `frontend/spatial/theme-root.css` remains the single visual root.
- F0-F7 remain field identities; the five reusable legal boxes remain Shell, Panel, Card, Control, Navigation.
- F6 remains a controlled status surface and F7 remains the single shared E4 modal surface.
- Command Deck seat/task/provider values remain presentation fixtures until a separately authorized live frontend/domain integration is implemented and runtime-proven.
- TEAM-BACKEND-001 remains intentionally slowed; this slice must not advance backend gates.
- Vercel remains present as a non-authoritative platform but is paused and must not be resumed without explicit user approval.

## Finishing checks

1. Command Deck visual hierarchy is consistent across the seat rail, active E3 stage, Why-next evidence, and F6 status surface.
2. Theme presentation remains driven by the existing theme root with equivalent semantic behavior across dark/light modes.
3. Compact layout remains usable without horizontal document overflow; seat rail may use bounded horizontal scrolling.
4. Reduced-motion behavior removes unnecessary travel/hover movement without removing semantic state.
5. F7 remains one shared modal surface and only the selected action/handoff cluster is visible.
6. Status meaning is not communicated by color alone.
7. Navigation does not expose stale "not implemented" composition messaging now that the merged 029 compositions exist.
8. The Command Deck remains presentation-only; no browser writes to Firestore, no provider invocation, no scheduler selection, no entitlement mutation, and no PayPal activity are introduced.

## Evidence boundary

The slice proves presentation and browser behavior only. It does not prove authenticated frontend/domain integration, live provider execution, live PayPal behavior, or TEAM-BACKEND-001 completion.

## Branch rule

The branch is a current frontend field branch only. It must be rebased/reconciled against current `main` before reuse after other agents merge changes. Historical frontend branches remain evidence/work candidates, not authority.
