# TEAM-EXPERIENCE-029 — Command Deck Reconciliation + Polish Slice

**Status:** PROPOSED / CONTROLLED FRONTEND CATCH-UP SLICE
**Baseline:** `main` after the merged 029 composition sequence and TEAM-BACKEND-001 task execution gate.

## Objective

Bring the Command Deck presentation to a stable, polished, accurately-labeled state while TeamAi deliberately slows TEAM-BACKEND-001 work that depends on external/live evidence.

This slice reconciles what is already implemented; it does not rebuild the frontend and does not introduce a new domain authority.

## Canonical roots

- Product meaning: `PRODUCT_LAW.md`
- Chronological execution: `MASTERPLAN.md`
- Execution discipline: `POLICY.md` / ORUCAVEAM
- Skill routing: `docs/SKILL_WIRING.md`
- Spatial UI procedure: `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- Browser verification: `skills/verification/browser-smoke/SKILL.md`
- Current-state navigation: `docs/TEAMAI_CURRENT_STATE.md`

## Reconciled facts

The Command Deck is already implemented through the merged 029 composition progression. It is not a blank frontend. Its data remains presentation fixtures by design until a separate, authorized integration contract replaces them.

The Command Deck must therefore:

1. retain the existing F0–F7 field vocabulary and five legal boxes;
2. retain the single shared F7 E4 plate;
3. retain Planning vs Working as an E3 product stage;
4. preserve status semantics as text plus state treatment, not color alone;
5. make fixture status unmistakable so display values cannot be mistaken for live state;
6. improve visual hierarchy, spacing, responsive behavior, and interaction feedback using the existing theme-root tokens;
7. preserve keyboard, focus, reduced-motion, compact, and semantic accessibility behavior;
8. avoid introducing browser-owned scheduler, authorization, entitlement, commerce, Firestore, or provider state.

## Included

- Command Deck spacing/hierarchy refinement using existing tokens.
- Clearer fixture labeling for non-authoritative display values.
- Stronger active-stage and selected-seat affordances that remain presentation-only.
- Responsive refinements for narrow/mobile widths without horizontal overflow.
- Status/evidence presentation refinement without changing semantic meaning.
- Deterministic Playwright verification updates where the visible contract changes.
- Synchronization of Masterplan/current-state wording with what is actually merged.

## Explicitly excluded

- Firebase Auth implementation.
- Browser Firestore writes.
- Scheduler implementation or next-actor selection.
- Provider invocation.
- PayPal or entitlement activity.
- Vercel activation.
- New Product Law concepts.
- New modal systems or legal boxes.
- Replacement of the fixture data with invented backend responses.

## Pass condition

The Command Deck is visually and semantically polished across wide and compact layouts, the fixture boundary is unambiguous, all interaction remains presentation-only, and deterministic browser verification passes for the exercised scope.

## Evidence language

A polished Command Deck is **IMPLEMENTED** and **VERIFIED** for its presentation scope. It is not **RUNTIME-PROVEN** as a live domain surface until the separately authorized frontend/backend integration contract exists and is exercised.
