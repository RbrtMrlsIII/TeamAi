# TEAM-EXPERIENCE-029 — Command Deck Inhabited Skeleton

**Status:** IMPLEMENTATION SLICE / presentation-only
**Branch:** `ui/029-command-deck-inhabited-v1`

## Purpose

Give the endorsed 029 skeleton its first complete inhabited body: the Command Deck. The Deck is the first body on the shared skeleton, not a marketing hero or a separate design system.

## Implemented proof

- F0 atmosphere persists behind the composition.
- F1 Shell carries Workplace / Project, health, theme, density, and account presentation.
- F2 Navigation has the full destination set and a compact select presentation.
- Seat rail is F3 Panel + F4 Cards with role/provider/model, health, connection, and eligibility display.
- Active work is F3 E3 with Planning / Working as one stage, preserving the pinned user instruction.
- Why-next exposes dependency, event, readiness, scheduler ownership, and capability gate.
- F6 status exposes connection, the TeamAi/provider entitlement split, and recovery state.
- F7 remains the existing shared E4 plate from the prior slice.

## Boundaries

This slice is presentation-only. Scripts may update local presentation state, theme, density, stage, seat selection, and F7 visibility/focus. They do not choose the scheduler actor, mutate Firestore, charge PayPal, alter entitlements, or execute actions.

## Compact law exercised

- E3 remains reachable.
- E2 seat rails collapse into a horizontal rail before E3 is displaced.
- Primary navigation becomes a compact bar/menu presentation.
- No horizontal document overflow is allowed.
- F7 remains reachable when open.

## Verification target

Playwright should verify the inhabited regions, Planning/Working stage behavior, seat selection as presentation state, and compact viewport overflow/navigation behavior. Existing F7 smoke remains unchanged.
