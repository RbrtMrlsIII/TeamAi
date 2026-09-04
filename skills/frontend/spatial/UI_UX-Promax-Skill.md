# TeamAi UI/UX ProMax Spatial Skill

**Status:** BASELINE FRONTEND / 029 PLANNING + IMPLEMENTATION + VERIFICATION PROCEDURE

## WHEN TO USE
Use when defining, reconciling, implementing, reviewing, or verifying the TeamAi visual and spatial interaction system for TEAM-EXPERIENCE-029, including the required light/dark visual treatments and any cross-cutting motion, transition, animation, responsive, accessibility, or interaction work.

## INPUT
- Applicable `PRODUCT_LAW.md` visual/theme requirements.
- 029 `MASTERPLAN.md` checklist item and approved scope.
- `POLICY.md` / ORUCAVEAM execution discipline.
- The **single canonical unified theme root** and its actual implementation location/state.
- Existing UI roots, component hierarchy, design tokens, CSS/style architecture, layout primitives, and state boundaries.
- Existing and applicable companion skills, including transition/motion/animation skills such as `Transition_Promax-skills.md`, `Animation-Promax-skills.md`, and other frontend field skills when they exist in the canonical skill library or are explicitly routed by `docs/SKILL_WIRING.md`.
- Accessibility, responsive, browser-verification, and performance constraints.
- Current theme-state behavior and user-selected light/dark setting where implemented.

## AUTHORITY
- `PRODUCT_LAW.md` owns product visual/theme requirements.
- `MASTERPLAN.md` owns chronological execution scope.
- `POLICY.md` / ORUCAVEAM own execution discipline.
- Existing UI/domain contracts and the canonical unified theme root own component meaning and behavior.
- Companion frontend skills own only their bounded procedure (for example transition/animation implementation or responsive/accessibility checks) and remain subordinate to the canonical theme/root architecture.
- This skill is procedural only and cannot create product authority, permission, domain state, or scheduler authority.

## PRE-EDIT STRUCTURAL REVIEW — REQUIRED GATE
Before editing any UI/style/theme code, perform a structural review and record the result in the working notes/PR evidence:

1. **Locate the unified theme root.** Identify the actual single theme-state/root mechanism, the token/primitive roots it feeds, and every known consumer that can alter visual mode. Do not create a second theme provider, theme attribute, context, store, or mode switch while another canonical root exists.
2. **Map the styling architecture.** Inspect global styles, tokens, CSS modules/utility layers, component primitives, layout/shell roots, responsive rules, and any generated/build-time styling before changing selectors.
3. **Resolve companion skills.** Check the applicable transition, animation, motion, typography, responsive, accessibility, component, and browser-verification skills. If a named companion skill is not present in the repository, treat it as an explicit skill-library gap or external routed dependency; do not silently invent a duplicate local authority.
4. **Review existing structure before adding overrides.** Prefer changing the owning token, primitive, root selector, component contract, or shared utility over stacking page-level exceptions.
5. **Run discrepancy detection.** Compare Product Law, Masterplan, skill wiring, current theme root, component behavior, and implementation structure. Surface contradictions, duplicate authorities, stale selectors, dead roots, conflicting mode logic, or unexpected specificity before editing.
6. **Establish an edit boundary.** Record the exact files/roots/components that may change. Unrelated structural cleanup is out of scope unless required to remove a direct discrepancy or unsafe coupling.

**BLOCK CONDITION:** unresolved authority conflicts, duplicate theme roots, unexplained cross-mode semantic differences, or materially conflicting companion-skill instructions block implementation until reconciled.

## ACTION
1. Inspect the canonical visual/theme requirement before changing UI roots.
2. Resolve the single canonical unified theme root and confirm that all visual-mode decisions descend from it.
3. Reconcile the active theme mode with the user's current setting:
   - Dark = **Dark Spatial Glassmorphism**.
   - Light = **Light Spatial Skeuomorphism**.
4. Resolve applicable companion procedures before touching their concern areas:
   - transition timing/easing/state-change behavior → applicable Transition/interaction skill;
   - animation/keyframe/motion choreography → applicable Animation/Motion skill;
   - responsive/layout behavior → responsive skill;
   - keyboard/focus/contrast/reduced-motion behavior → accessibility skill;
   - browser behavior and regression validation → Playwright/browser verification skill.
5. Define or reuse shared semantic tokens and component primitives for spatial depth, surfaces, elevation, translucency/material treatment, borders, typography, controls, motion, focus, status feedback, and responsive behavior rather than page-local styling rules.
6. Preserve semantic UI behavior across theme modes; theme changes must not alter identity, authorization, domain state, scheduler behavior, commerce truth, approval policy, durable events, or any other backend authority.
7. Prefer low-specificity, structurally correct CSS. Fix ownership at the root/token/primitive/component layer before reaching for overrides.
8. **Avoid `!important` by default.** Do not introduce bulk or cascading `!important` rules. A new `!important` requires a narrowly scoped, documented reason (for example a browser/accessibility exception that cannot be solved cleanly at the owning layer), must be localized to the smallest selector/property, and must be included in post-edit structural review. Repeated `!important` use is a discrepancy signal, not a styling strategy.
9. Validate responsive behavior, accessibility, legibility, reduced-motion behavior, interaction states, and browser behavior at representative breakpoints.
10. Perform a **post-edit structural review** against the pre-edit map: confirm one theme root remains, shared primitives remain shared, no duplicate mode logic was introduced, specificity did not become a workaround system, and no semantic behavior changed.
11. Record the exact visual-system decision, affected roots, companion skills used, verification scope, and evidence before handover.

## DO NOT
- Do not create a page-local visual authority that conflicts with Product Law or shared UI roots.
- Do not create a second theme root/provider/store/DOM mode switch when a canonical unified theme root exists.
- Do not bypass the structural review because a change appears visually small.
- Do not ignore or replace applicable Transition/Animation/Motion/Responsive/Accessibility skills with ad-hoc CSS conventions.
- Do not interpret Glassmorphism/Skeuomorphism as backend, scheduler, identity, commerce, or persistence behavior.
- Do not duplicate theme state across unrelated components.
- Do not sacrifice contrast, focus visibility, keyboard accessibility, reduced-motion support, or responsive behavior for visual effects.
- Do not hard-code a separate dark/light design system in individual pages when shared tokens/primitives can own the behavior.
- Do not use mass `!important` to overpower the existing style architecture. Refactor the owning layer instead.
- Do not treat a screenshot as proof of persistence, authorization, backend correctness, or product completion.
- Do not claim a companion skill was followed when its source was not actually available or inspected.

## PASS
Pass when:
- one canonical theme root controls both modes;
- Dark selects Dark Spatial Glassmorphism and Light selects Light Spatial Skeuomorphism;
- pre-edit and post-edit structural reviews are recorded;
- applicable companion skills were resolved and used for their bounded concerns;
- shared primitives/tokens own the visual treatment rather than page-local duplication;
- semantic behavior remains equivalent across modes;
- specificity remains structurally controlled and no mass `!important` pattern is introduced;
- accessibility, responsive, and browser checks for the exercised scope pass;
- visual evidence is linked to the exact implementation commit/run and remains separate from canonical project source.

## EVIDENCE
Record:
- governing Product Law section;
- Masterplan checklist item;
- unified theme root and affected UI roots/components/tokens;
- pre-edit structural review and discrepancy disposition;
- companion skills resolved/used (including transition/animation/motion where applicable);
- theme-state behavior;
- post-edit structural review;
- `!important` exceptions, if any, with selector/property and reason;
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
