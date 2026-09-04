# TeamAi UI/UX ProMax Spatial Skill

**Status:** BASELINE FRONTEND / 029 PLANNING PROCEDURE

## WHEN TO USE
Use when defining, reconciling, implementing, or verifying the TeamAi visual theme and spatial interaction system for TEAM-EXPERIENCE-029, including the dark/light spatial visual modes.

## INPUT
- Applicable Product Law visual/theme requirements.
- 029 Masterplan checklist item and approved scope.
- Existing UI roots/components/tokens and spatial semantics.
- Accessibility, responsive, browser-verification, and performance constraints.
- Current canonical theme state and user-selected light/dark setting where implemented.

## AUTHORITY
- `PRODUCT_LAW.md` owns product visual/theme requirements.
- `MASTERPLAN.md` owns chronological execution scope.
- `POLICY.md` / ORUCAVEAM own execution discipline.
- Existing UI/domain contracts own component meaning and behavior.
- This skill is procedural only and cannot create product authority or permission.

## ACTION
1. Inspect the canonical visual/theme requirement before changing UI roots.
2. Reconcile the active theme mode with the user's current setting:
   - Dark = **Dark Spatial Glassmorphism**.
   - Light = **Light Spatial Skeuomorphism**.
3. Treat light/dark selection as one bounded theme-state switch; changing the setting changes the active visual treatment without creating a second product theme authority.
4. Define reusable tokens and component primitives for spatial depth, surfaces, elevation, translucency/material treatment, borders, typography, controls, motion, focus, and state feedback rather than page-local styling rules.
5. Preserve semantic UI behavior across theme modes; theme changes must not alter identity, authorization, domain state, scheduler behavior, commerce truth, or other backend authority.
6. Validate responsive behavior, accessibility, legibility, reduced-motion behavior, interaction states, and browser behavior at representative breakpoints.
7. Record the exact visual system decision, affected roots, verification scope, and evidence before handover.

## DO NOT
- Do not create a page-local visual authority that conflicts with Product Law or shared UI roots.
- Do not interpret Glassmorphism/Skeuomorphism as backend, scheduler, identity, commerce, or persistence behavior.
- Do not duplicate theme state across unrelated components.
- Do not sacrifice contrast, focus visibility, keyboard accessibility, reduced-motion support, or responsive behavior for visual effects.
- Do not hard-code a separate dark/light design system in individual pages when shared tokens/primitives can own the behavior.
- Do not treat a screenshot as proof of persistence, authorization, backend correctness, or product completion.

## PASS
Pass when:
- both canonical modes resolve from the same theme setting;
- Dark selects Dark Spatial Glassmorphism and Light selects Light Spatial Skeuomorphism;
- shared primitives/tokens own the visual treatment rather than page-local duplication;
- semantic behavior remains equivalent across modes;
- accessibility, responsive, and browser checks for the exercised scope pass;
- visual evidence is linked to the exact implementation commit/run and remains separate from canonical project source.

## EVIDENCE
Record:
- governing Product Law section;
- Masterplan checklist item;
- affected UI roots/components/tokens;
- theme-state behavior;
- browser/accessibility verification results;
- GitHub commit and workflow evidence references;
- screenshots/captures only as separate verification artifacts when useful.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/verification/browser-smoke/SKILL.md`
- `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
