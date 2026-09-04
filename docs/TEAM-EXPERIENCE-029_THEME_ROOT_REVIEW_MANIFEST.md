# TeamAi 029 — Theme-root review manifest

**Base:** PR #19 head `fad930c8bf41456e246baf58a65878f7a92e9c95`  
**Branch:** `arch/029-theme-root-reconciliation-v1`  
**Status:** review only; not Product Law; not merged

This slice explicitly reconciles a vocabulary change rather than pretending none occurred.

## Canonical legal boxes preserved from PR #19

`Shell · Panel · Card · Control · Navigation`

## Implementation field identities

`F0 atmosphere` · `F1 shell` · `F2 navigation` · `F3 panel` · `F4 card` · `F5 control` · `F6 status` · `F7 modal`

F0 is the environment; F6 is the controlled Status system surface; F7 is the single shared E4 Modal system surface. F0/F6/F7 are **not** new general-purpose legal boxes.

## Included review decisions

- Command Deck + Workplace + Seats + Planning + Working + Artifacts + Approvals + Settings remain composition rearrangements.
- Planning vs Working is an E3 stage, not a theme.
- Seat plate is full capability, not chat; Deck seat rail is its compact projection.
- One E4 plate; Action and Planning Handoff clusters only.
- 44px primary/touch floor; compact density changes spacing, not type or touch minimums.
- Command Space / Instrument Space remain recommended names, not Product Law names.
- First palette anchors: `#07111C` / `#E7DCC8`.
- Dark blur cap 12px; Light blur 0px; E4 adds no whole-deck blur.
- Motion `0/120/200/320ms`, travel `0/4/8px`, shared easing, reduced-motion map.
- Status is never color-only.
- Theme root is singular; scripts are presentation-only.
- No scheduler, Firestore, PayPal, entitlement, action-execution, or authorization mutation.

## Files

`docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md` is the primary reconciliation record. The uploaded `theme-root.css` and `theme-root.ts` remain the implementation review artifacts locally until the full implementation slice is reviewed as a unit.
