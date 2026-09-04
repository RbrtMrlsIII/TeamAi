# Transition ProMax Skill

**Status:** SPATIAL COMPANION / STATE-TRANSITION PROCEDURE  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when changing how TeamAi UI moves between states: theme mode switch, panel open/close, seat/task activation, F7 modal/approval appearance, navigation between fields, or any enter/exit of a surface.

## INPUT
- Coordinator structural review, edit boundary, and F0–F7 field map.
- Canonical theme root and semantic tokens, especially Elevation and State.
- Motion tokens from `skills/frontend/spatial/motion/SKILL.md`.
- The exact state pair (`from → to`) and whether it is user-initiated, scheduler-driven, or system-driven.
- Reduced-motion preference.

## AUTHORITY
The Spatial coordinator owns theme/root architecture and field-identity mapping. Motion owns duration/easing tokens. This skill owns only state-transition behavior.

## ACTION
1. Confirm one theme root and the owning F0–F7 field. Do not start from a page-local CSS transition.
2. Name the semantic state pair. Theme mode, elevation change, presence, selection, and F7 approval are different pairs.
3. Consume Motion tokens. Do not invent local durations or curves.
4. Keep Dark and Light transitions semantically equivalent.
5. Theme-mode transitions retune material/elevation only. They must not reshuffle layout, F2 Navigation, or domain state.
6. Elevation changes should feel like a surface moving in Command Space / Instrument Space.
7. Honor reduced motion: replace spatial travel with instantaneous or crossfade change.
8. Enter/exit of F7 Modal uses the strongest elevation (E4); do not transition the F0 atmosphere as if it were the approval plate.
9. After the change, verify the destination state is reachable with keyboard and that focus is not lost.

## DO NOT
- Do not put transition timing on random page selectors.
- Do not animate identity, authorization, scheduler decisions, or durable records.
- Do not create a second motion token set.
- Do not treat F7 as a second dialog system with a separate transition language.
- Do not implement keyframe choreography here; that belongs to Animation.

## PASS
Each in-scope state pair has one owning transition, uses Motion tokens, remains semantically equivalent across theme modes, survives reduced motion, and maps to F0–F7 without creating a new legal box.

## EVIDENCE
State pairs changed, owning F-field, Motion tokens used, reduced-motion path, coordinator review reference, and browser verification.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/animation/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
