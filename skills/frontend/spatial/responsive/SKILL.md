# Responsive Skill

**Status:** SPATIAL COMPANION / VIEWPORT ADAPTATION  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`

## WHEN TO USE
Use when adapting TeamAi Spatial Environment layout across viewports, pointer types, or density: shell collapse, panel stacking, navigation relocation, card reflow, or split-workspace behavior.

## INPUT
- Coordinator structural review and primitive map.
- Five legal boxes: Shell, Panel, Card, Control, Navigation.
- F0–F7 field-identity map, including F6 Status and F7 Modal as system surfaces.
- Canonical 029 surfaces.
- Breakpoints owned by the theme/layout root, if any.
- Pointer/hover capability and minimum touch target constraints from Accessibility.

## AUTHORITY
Responsive adaptation changes presentation and density, not product meaning. This skill cannot invent a mobile-only business rule or a sixth legal box.

## ACTION
1. Adapt primitives, not pages. F1 Shell, F2 Navigation, F3 Panels, and F4 Cards reflow; fields do not get a second theme.
2. Prefer a small shared breakpoint scale on the theme/layout root.
3. Spatial depth survives compression.
4. Command Space and Instrument Space share structure. Only material treatment changes with theme.
5. When space is insufficient, collapse by elevation priority: keep F7 Modal and F3 active task reachable; park F0 atmosphere chrome first; F2 Navigation may become a bar/menu; extra F2/E2 rails compress or park.
6. F6 Status remains available from Shell/Status on every composition. It is not a nav destination and must not disappear on compact viewports.
7. Touch targets and hover-only affordances are coordinated with Accessibility. Hover is never the only path.
8. Horizontal overflow is a defect.
9. Record which primitive/field owns each collapse decision.

## DO NOT
- Do not ship a separate “mobile theme.”
- Do not hide Planning, Working, approval (F7), or Status (F6) meaning on small viewports.
- Do not use viewport width as a permission or entitlement signal.
- Do not assign a new legal box from a responsive sketch.

## PASS
The same semantic workflow is reachable at representative desktop and compact viewports, primitives own the collapse, F0–F7 mapping is intact, theme mode remains one root, and no horizontal overflow exists in the exercised scope.

## EVIDENCE
Breakpoints used, primitives/fields that collapsed, surfaces still reachable including F6 and F7, overflow checks, and browser verification.

## SEE ALSO
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_COMMAND_DECK_AND_TOKEN_FREEZE.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
- `skills/verification/browser-smoke/SKILL.md`
