# TEAM-EXPERIENCE-029 — Workplace Composition

**Status:** IMPLEMENTATION SLICE / presentation-only  
**Branch:** `ui/029-workplace-composition-v1`  
**Depends on:** Command Deck inhabited skeleton (#29)

## Purpose

Give the first secondary composition its own inhabited body while preserving the Command Deck skeleton: choose and understand the current Workplace / Project, then return to Deck.

## Implemented proof

- F1 Shell and F2 Navigation persist.
- Workplace is composed from the existing F3 Panel and F4 Card primitives.
- Project list exposes Workplace-owned presentation context and health.
- Selected Project occupies an E3 detail panel.
- `Enter Project` returns to Deck presentation state.
- Selection and entry remain UI-only; no domain mutation is performed.
- Compact layout collapses the list/detail columns without horizontal document overflow.

## Boundaries

This slice must not host seat OAuth, commerce checkout, or the live conversation. It does not write Firestore, invoke the scheduler, alter entitlements, charge PayPal, or execute actions.

The later Workplace destructive boundary (leave/archive/transfer) remains part of the shared F7 contract work and is not introduced as a third modal cluster here.

## Contract alignment

- Same theme root and material law as the Command Deck.
- Same five legal boxes: Shell, Panel, Card, Control, Navigation.
- F0 atmosphere remains environmental context.
- F6 remains a controlled status surface, not a nav destination.
- F7 remains the existing single shared E4 plate from the prior slices.
