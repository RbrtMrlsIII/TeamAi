# Accessibility Skill

**Status:** SPATIAL COMPANION / CONTRAST, FOCUS, KEYBOARD, REDUCED MOTION  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when implementing or verifying contrast/legibility, focus visibility, keyboard operation, reduced-motion behavior, non-pointer paths, or semantic accessibility of TeamAi Spatial Environment surfaces.

## INPUT
- Coordinator structural review and F0–F7 field map.
- Theme root plus Surface, Type, State, and Elevation tokens.
- Motion reduced-motion mapping.
- Responsive pointer/touch decisions.
- The exact interaction path being made accessible.

## AUTHORITY
Product Law requires legibility, focus visibility, keyboard navigation, reduced-motion behavior, responsive behavior, and semantic accessibility. This skill does not own theme architecture or legal-box law.

## ACTION
1. Contrast and type come from Type/Surface tokens for both Command Space and Instrument Space.
2. Focus is an explicit illumination/ring from State tokens at every interactive primitive (F5 Control and F7 Modal especially).
3. Keyboard order follows field identity: F1 Shell → F2 Navigation → F3/F4 working surfaces → F6 Status → F7 Modal if open. Do not follow visual z-index of floating panels.
4. Every pointer-only control has a keyboard equivalent.
5. Reduced motion is mandatory: consume Motion’s mapping.
6. F6 Status color is never the only status signal. Pair semantic accent with text/icon state.
7. Do not use `outline: none` without a State-token replacement.
8. Native form controls should inherit document `color-scheme`.
9. Verify Dark and Light separately.
10. Coordinate with browser-smoke once UI exists. Do not invent selectors before then.

## DO NOT
- Do not hide focus to preserve glass aesthetics.
- Do not require motion, hover, or spatial memory to complete an approval (F7) or send a command.
- Do not treat a screenshot as an accessibility pass.
- Do not create an “a11y mode” that is a second product.
- Do not treat F6 Status as a navigation destination.

## PASS
Exercised surfaces are operable by keyboard, have visible focus, sufficient contrast in both modes, a reduced-motion path, and non-color status cues, with no theme-root fork and no extra legal box for accessibility.

## EVIDENCE
Paths exercised, F0–F7 surfaces covered, contrast/focus notes per mode, keyboard order, reduced-motion result, and browser assertions when UI exists.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/responsive/SKILL.md`
- `skills/verification/browser-smoke/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
