# Machine Builder Skill

## WHEN TO USE
Use for PR #344 and later semantic 3D Hero machine work. This Skill is procedural only and never authorizes product changes.

## INPUT
Current slice; owning Issue/PR; relevant Product Law field; semantic tree/branch/division definitions; payload requirements; geometry/clearance requirements; connection topology; camera relationship; verification target.

## AUTHORITY
`Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → this Skill → implementation`

## ACTION
1. Establish semantic identity and purpose before choosing coordinates.
2. Define UI/configuration/accessibility payload.
3. Derive expansion footprint, adjacency, clearance, wiring corridors, and camera requirements from semantic inputs.
4. Define parts, ports, relationships, and connection state.
5. Generate geometry from semantic inputs, not prototype coordinates or mesh indexes.
6. Make transitions parameterized and interruption-safe.
7. Derive semantic subject from active geometry where governed.
8. Keep camera configuration separate from semantic identity.
9. Exercise a second valid semantic case through the same renderer/transition algorithm when parameterization is claimed.
10. Verify reduced-motion and responsive behavior without changing semantic state.
11. Record exact evidence for every claimed invariant.

## DO NOT
- Fabricate undefined tree IDs, branch IDs, divisions, dimensions, or backend mappings.
- Turn prototype animation, camera, timing, or effects into product law.
- Let coordinates, mesh names, ring indexes, or camera presets define semantic identity.
- Put backend authority, authorization, scheduler, commerce, entitlement, or durable state in the renderer.
- Create a second renderer branch merely to support a second semantic case when parameterization is required.
- Treat a visually convincing render or green CI as sufficient promotion evidence.

## PASS
The implementation follows `semantic identity → payload → footprint/topology → geometry → transition → subject → camera → rendering`, remains presentation-only at the frontend boundary, and has deterministic verification for each claimed invariant.

## EVIDENCE
Record PR/head, semantic cases, geometry/topology assertions, browser evidence where applicable, responsive/reduced-motion result, and residual unproven boundaries in `AI_ASSISTANT_READ_ME.md` or the owning evidence surface.

## SEE ALSO
`Product_Law/PRODUCT_LAW.md`; `Product_Law/WIRING.md`; `Masterplan/MASTERPLAN.md`; `Masterplan/NEXT_SLICES.md`; `POLICY.md`; `docs/SKILL_WIRING.md`; `skills/governance/repository-synchronization/SKILL.md`; `skills/frontend/spatial/`; Issue #278; PR #344.
