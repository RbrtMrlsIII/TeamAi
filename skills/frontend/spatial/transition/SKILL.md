# Transition ProMax Skill

**Status:** SPATIAL COMPANION / STATE-TRANSITION PROCEDURE  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when changing how TeamAi UI moves between states: theme mode switch, panel open/close, seat/task activation, modal/approval appearance, navigation between fields, focus movement that has a spatial handoff, or any enter/exit of a surface.

## INPUT
- Coordinator structural review and edit boundary.
- Canonical theme root and semantic tokens, especially Elevation and State.
- Motion tokens from `skills/frontend/spatial/motion/SKILL.md`.
- The exact state pair being transitioned (`from → to`) and whether it is user-initiated, scheduler-driven, or system-driven.
- Reduced-motion preference.

## AUTHORITY
The Spatial coordinator owns theme/root architecture. Motion owns duration/easing tokens. This skill owns only state-transition behavior. It cannot create a theme, a second animation system, or backend state.

## ACTION
1. Confirm the coordinator has identified one theme root and the owning primitive/field. Do not start from a page-local CSS transition.
2. Name the semantic state pair. Theme mode, elevation change, presence (enter/exit), selection, and approval are different pairs; do not reuse one transition for all of them.
3. Consume Motion tokens. Do not invent local durations or curves.
4. Keep Dark and Light transitions semantically equivalent. Material treatment may differ; meaning, timing role, and destination state must not.
5. Theme-mode transitions retune material/elevation only. They must not reshuffle layout, navigation, or domain state.
6. Elevation changes should feel like a surface moving in the Spatial Command Deck (Command Space / Instrument Space), not like a generic fade.
7. Honor reduced motion: replace spatial travel with an instantaneous or crossfade state change. Never require motion to reach a usable state.
8. Enter/exit of modal/approval surfaces uses the strongest elevation; do not transition the workspace background.
9. After the change, verify the destination state is reachable with keyboard and that focus is not lost in the transition.

## DO NOT
- Do not put transition timing on random page selectors.
- Do not animate identity, authorization, scheduler decisions, or durable records.
- Do not create a second motion token set.
- Do not keep moving elements that reduced-motion users need immediately.
- Do not use blur, opacity, or scale as decoration on every state change.
- Do not implement keyframe choreography here; that belongs to Animation.

## PASS
Each in-scope state pair has one owning transition, uses Motion tokens, remains semantically equivalent across theme modes, survives reduced motion, and does not own theme or domain state.

## EVIDENCE
State pairs changed, owning primitive/field, Motion tokens used, reduced-motion path, coordinator review reference, and browser verification for the exercised transitions.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/animation/SKILL.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_SPATIAL_THEME_CONTRACT.md`
