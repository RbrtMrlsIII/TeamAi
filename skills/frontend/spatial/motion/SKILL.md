# Motion Skill

**Status:** SPATIAL COMPANION / MOVEMENT AND TIMING TOKENS  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when defining or changing duration, easing, delay, spatial travel distance, or reduced-motion substitutes. Transition and Animation consume this skill; they do not own the token set.

## INPUT
- Coordinator structural review and F0–F7 field map.
- Current semantic token architecture (Surface, Depth, Elevation, Type, State).
- Existing motion tokens, if any.
- `prefers-reduced-motion` and any application reduced-motion override.

## AUTHORITY
This skill owns the shared motion token vocabulary. It does not own theme mode, choreography, layout, or legal-box law. Tokens must live under the unified theme root.

## ACTION
1. Place motion tokens next to other semantic tokens under the unified theme root. One token set serves both Dark and Light.
2. Define a small scale only: duration instant/short/medium/long; easing enter/exit/move/emphasize; delay none/stagger-step; travel none/small/medium.
3. Instant is a first-class token. Reduced motion maps travel to none and longer durations to instant or short crossfade.
4. Dark and Light may retune opacity/blur/shadow associated with a motion, but duration roles stay shared.
5. F6 Status and focus illumination use State tokens plus short/medium motion. They are not a license for continuous travel.
6. F7 Modal mount uses long + enter; unmount uses short + exit; reduced motion makes E4 instant.
7. Document which Transition pairs and Animation sequences consume which tokens.
8. If a caller needs a one-off curve, treat that as a discrepancy.

## DO NOT
- Do not store durations in component files.
- Do not give Dark a different timing language than Light.
- Do not use bounce, elastic, or spring on operational F5 Controls.
- Do not make motion a prerequisite for reading F6 Status.
- Do not create a second `--transition-*` namespace beside the theme root.

## PASS
A single shared motion token scale exists under the theme root, is consumed by Transition and Animation, has a reduced-motion mapping, and does not invent extra legal boxes.

## EVIDENCE
Token names/values, reduced-motion mapping, F6/F7 consumption notes, rejected one-off timings, and coordinator review reference.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/transition/SKILL.md`
- `skills/frontend/spatial/animation/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
