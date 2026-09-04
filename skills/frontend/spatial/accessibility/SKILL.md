# Accessibility Skill

**Status:** SPATIAL COMPANION / CONTRAST, FOCUS, KEYBOARD, REDUCED MOTION  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when implementing or verifying contrast/legibility, focus visibility, keyboard operation, reduced-motion behavior, non-pointer paths, or semantic accessibility of TeamAi Spatial Environment surfaces.

## INPUT
- Coordinator structural review.
- Theme root plus Surface, Type, State, and Elevation tokens.
- Motion reduced-motion mapping.
- Responsive pointer/touch decisions.
- The exact interaction path being made accessible.

## AUTHORITY
Product Law requires legibility, focus visibility, keyboard navigation, reduced-motion behavior, responsive behavior, and semantic accessibility. Visual effects must not become a prerequisite for or source of durable application state. This skill enforces that boundary; it does not own theme architecture.

## ACTION
1. Contrast and type come from Type/Surface tokens for both Command Space and Instrument Space. Glass and skeuomorphic treatments must not drop text or icon contrast below a usable semantic threshold.
2. Focus is an explicit illumination/ring from State tokens at every interactive primitive. Focus must remain visible on glass and on material surfaces.
3. Keyboard order follows semantic structure (shell → navigation → active field → action/approval), not visual z-index of floating panels.
4. Every pointer-only control has a keyboard equivalent. Drag-to-reposition spatial panels cannot be the only way to reach a surface.
5. Reduced motion is mandatory: consume Motion’s mapping; do not leave a separate CSS exception pile.
6. Status color is never the only status signal. Pair semantic accent with text/icon state.
7. Do not use `outline: none` without a replacement focus treatment owned by State tokens.
8. Native form controls should inherit document `color-scheme` rather than being restyled into inaccessible custom widgets without a verified replacement.
9. Verify Dark and Light separately. Equivalence of meaning does not mean identical contrast math.
10. Coordinate with browser-smoke for keyboard and reduced-motion assertions once UI exists. Do not invent selectors before then.

## DO NOT
- Do not hide focus to preserve glass aesthetics.
- Do not require motion, hover, or spatial memory to complete an approval or send a command.
- Do not treat a pretty screenshot as an accessibility pass.
- Do not create an “a11y mode” that is a second product.
- Do not skip Light-mode contrast because Dark was checked, or the reverse.

## PASS
Exercised surfaces are operable by keyboard, have visible focus, sufficient contrast in both modes, a reduced-motion path, and non-color status cues, with no theme-root fork for accessibility.

## EVIDENCE
Paths exercised, contrast/focus notes per mode, keyboard order, reduced-motion result, native `color-scheme` behavior, coordinator review reference, and browser assertions when UI exists.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/responsive/SKILL.md`
- `skills/verification/browser-smoke/SKILL.md`
- `PRODUCT_LAW.md` — TEAM-EXPERIENCE-029 Visual Experience Law
- `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`
