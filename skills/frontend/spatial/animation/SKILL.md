# Animation ProMax Skill

**Status:** SPATIAL COMPANION / CHOREOGRAPHY PROCEDURE  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when implementing choreographed sequences: staggered field reveals, team-panel stacking, status illumination pulses, handoff/summarizer sequences, or any multi-step visual phrase that is not a single state transition.

## INPUT
- Coordinator structural review and edit boundary.
- Motion tokens from `skills/frontend/spatial/motion/SKILL.md`.
- Transition pairs already owned by `skills/frontend/spatial/transition/SKILL.md`.
- The semantic purpose of the sequence (orientation, attention, completion, warning).
- Reduced-motion preference.

## AUTHORITY
This skill owns choreography only. Motion owns timing tokens. Transition owns single state pairs. The coordinator owns theme/root architecture. Animation cannot become decorative spectacle or a source of application state.

## ACTION
1. Confirm the sequence has a product purpose. If it only “looks alive,” do not add it.
2. Build the sequence from existing primitives and Transition pairs. Do not introduce a parallel animation framework.
3. Consume Motion tokens for delay, duration, and easing. Stagger from a shared token, not magic numbers.
4. Command Space (Dark): localized illumination and restrained depth shifts. No neon pulse on every node.
5. Instrument Space (Light): tactile settle, inset-to-raised confirmation, restrained shadow change. No bounce-for-delight on operational surfaces.
6. Looping animation is reserved for live process that is actually running (execution in progress, waiting on approval). Idle chrome must not loop.
7. Reduced motion: collapse choreography to a single static destination or one crossfade. Information must not live only in the sequence.
8. Keep sequences interruptible. User input, errors, and approval overlays cancel in-flight choreography.
9. Coordinate with Accessibility for flicker, vestibular motion, and focus during the sequence.

## DO NOT
- Do not animate every card, token, or status dot.
- Do not encode success, failure, or approval solely as an animation.
- Do not add autoplaying decorative loops.
- Do not ship keyframes that ignore reduced motion.
- Do not create page-local animation utilities that bypass Motion tokens.
- Do not treat screenshots of motion as proof of task completion.

## PASS
In-scope sequences have a named purpose, use shared Motion tokens, remain equivalent in meaning across Dark/Light, collapse under reduced motion, and never own domain state.

## EVIDENCE
Sequence name/purpose, primitives involved, tokens used, reduced-motion collapse, interruption behavior, coordinator review reference, and browser evidence for the exercised sequence.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/transition/SKILL.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_SPATIAL_THEME_CONTRACT.md`
