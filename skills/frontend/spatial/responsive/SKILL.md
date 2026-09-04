# Responsive Skill

**Status:** SPATIAL COMPANION / VIEWPORT ADAPTATION  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when adapting TeamAi Spatial Environment layout across viewports, pointer types, or density: shell collapse, panel stacking, navigation relocation, card reflow, or split-workspace behavior.

## INPUT
- Coordinator structural review and primitive map (Shell, Panels, Cards, Controls, Navigation).
- Canonical 029 surfaces from `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`.
- Breakpoints already owned by the theme/layout root, if any.
- Pointer/hover capability and minimum touch target constraints from Accessibility.

## AUTHORITY
Responsive adaptation changes presentation and density, not product meaning. Scheduler, identity, approvals, and commerce remain the same semantic workflow at every viewport. This skill cannot invent a mobile-only business rule.

## ACTION
1. Adapt primitives, not pages. Shell, Navigation, Panels, and Cards reflow; fields do not get a second theme.
2. Prefer a small shared breakpoint scale on the theme/layout root. Do not add page-local breakpoints.
3. Spatial depth survives compression: stacked panels still read as elevated surfaces, not as a flat mobile brochure.
4. Command Space and Instrument Space share structure. Only material treatment changes with theme; layout roles stay shared.
5. When space is insufficient, collapse by elevation priority: keep approval/action and active task reachable; park ambient workspace chrome first.
6. Navigation may relocate (rail → bar → menu) without renaming destinations or dropping required 029 concepts.
7. Touch targets and hover-only affordances are coordinated with Accessibility. Hover is enhancement, never the only path.
8. Horizontal overflow is a defect. Verify representative widths before claiming responsive pass.
9. Record which primitive owns each collapse decision.

## DO NOT
- Do not ship a separate “mobile theme.”
- Do not hide Planning Team, Working Team, approval, or scheduler meaning on small viewports.
- Do not use viewport width as a permission or entitlement signal.
- Do not duplicate components per breakpoint when one primitive can reflow.
- Do not assign permanent field numbers from a responsive sketch.

## PASS
The same semantic workflow is reachable at representative desktop and compact viewports, primitives own the collapse, theme mode remains one root, and no horizontal overflow exists in the exercised scope.

## EVIDENCE
Breakpoints used, primitives that collapsed, surfaces still reachable, overflow checks, theme-mode comparison at each viewport, coordinator review reference, and browser verification.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_FRONTEND_STRUCTURAL_INVENTORY.md`
- `skills/verification/browser-smoke/SKILL.md`
