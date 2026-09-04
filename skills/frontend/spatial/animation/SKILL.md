# Animation ProMax Skill

**Status:** SPATIAL COMPANION / CHOREOGRAPHY PROCEDURE  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when implementing choreographed sequences: staggered field reveals, team-panel stacking, F6 status illumination pulses, handoff/summarizer sequences, or any multi-step visual phrase that is not a single state transition.

## INPUT
- Coordinator structural review, edit boundary, and F0–F7 field map.
- Motion tokens from `skills/frontend/spatial/motion/SKILL.md`.
- Transition pairs already owned by `skills/frontend/spatial/transition/SKILL.md`.
- The semantic purpose of the sequence.
- Reduced-motion preference.

## AUTHORITY
This skill owns choreography only. Motion owns timing tokens. Transition owns single state pairs. The coordinator owns theme/root architecture and field identity.

## ACTION
1. Confirm the sequence has a product purpose. If it only “looks alive,” do not add it.
2. Build the sequence from existing primitives and Transition pairs. Do not introduce a parallel animation framework.
3. Consume Motion tokens for delay, duration, and easing.
4. Command Space (Dark): localized illumination and restrained depth shifts.
5. Instrument Space (Light): tactile settle, inset-to-raised confirmation, restrained shadow change.
6. Looping animation is reserved for live process that is actually running. Idle chrome must not loop.
7. Reduced motion: collapse choreography to a static destination or one crossfade. F6 Status information must not live only in the sequence.
8. Keep sequences interruptible. User input, errors, and F7 approval overlays cancel in-flight choreography.
9. Coordinate with Accessibility for flicker, vestibular motion, and focus.

## DO NOT
- Do not animate every F4 Card or F6 status dot.
- Do not encode success, failure, or approval solely as an animation.
- Do not add autoplaying decorative loops.
- Do not ship keyframes that ignore reduced motion.
- Do not create page-local animation utilities that bypass Motion tokens.

## PASS
In-scope sequences have a named purpose, use shared Motion tokens, remain equivalent in meaning across Dark/Light, collapse under reduced motion, and never own domain state or invent legal boxes.

## EVIDENCE
Sequence name/purpose, F0–F7 primitives involved, tokens used, reduced-motion collapse, interruption behavior, and browser evidence.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/transition/SKILL.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
