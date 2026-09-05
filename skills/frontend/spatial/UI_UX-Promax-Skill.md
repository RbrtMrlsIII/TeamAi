# TeamAi UI/UX ProMax Spatial Skill

**Status:** BASELINE FRONTEND / 029 PLANNING + IMPLEMENTATION + VERIFICATION PROCEDURE

## WHEN TO USE
Use when defining, reconciling, implementing, reviewing, or verifying the TeamAi visual and spatial interaction system for TEAM-EXPERIENCE-029, including light/dark treatments and any cross-cutting motion, transition, animation, responsive, accessibility, or interaction work.

## INPUT
- Applicable `PRODUCT_LAW.md` visual/theme requirements.
- 029 `MASTERPLAN.md` checklist item and approved scope.
- `POLICY.md` / ORUCAVEAM execution discipline.
- The single canonical unified theme root and its actual implementation location/state.
- Existing UI roots, tokens, primitives, and state boundaries.
- Frozen field-identity vocabulary (F0–F7) and the five legal boxes.
- Companion spatial skills and `docs/SKILL_WIRING.md`.
- Accessibility, responsive, browser-verification, and performance constraints.
- When consuming backend-owned execution facts: the typed backend-fact contract, provenance/source marker, and current backend authority boundary.

## AUTHORITY
- `PRODUCT_LAW.md` owns product visual/theme requirements.
- `MASTERPLAN.md` owns chronological execution scope.
- `POLICY.md` / ORUCAVEAM own execution discipline.
- Existing UI/domain contracts and the canonical unified theme root own component meaning and behavior.
- Backend-owned execution state remains authoritative for task state, approval, scheduler decisions, connections, capabilities, durable events, and provider execution.
- Companion frontend skills own only their bounded procedure.
- This skill is procedural only and cannot create product authority, permission, domain state, or scheduler authority.

## FIELD IDENTITY + LEGAL BOXES (FROZEN)

**Legal boxes:** `Shell · Panel · Card · Control · Navigation`

**Field identity (F0–F7)** is an explicit extension of field identity, not a silent rewrite of legal-box law:

| Field | Identity | Legal-box status |
|-------|----------|------------------|
| F0 | Atmosphere | environment; not a legal box |
| F1 | Shell | existing legal box |
| F2 | Navigation | existing legal box |
| F3 | Panel | existing legal box |
| F4 | Card | existing legal box |
| F5 | Control | existing legal box |
| F6 | Status | controlled system surface; not a new general-purpose legal box |
| F7 | Modal | controlled system surface; not a second dialog system |

- F6 Status is the Status strip/system surface (connection + TeamAi vs provider entitlement + recovery). It is never a navigation destination.
- F7 Modal is the single shared E4 approval plate. It is never a second dialog framework.

## PRE-EDIT STRUCTURAL REVIEW — REQUIRED GATE
Before editing any UI/style/theme code:

1. Locate the unified theme root. Do not create a second theme provider, attribute, context, store, or mode switch.
2. Map the styling architecture before changing selectors.
3. Resolve companion skills. Do not invent a duplicate local authority.
4. Prefer changing the owning token, primitive, root selector, or shared utility over page-level exceptions.
5. Run discrepancy detection against Product Law, Masterplan, skill wiring, and current theme root.
6. Establish an edit boundary.
7. Confirm every new or changed surface maps to F0–F7 and does not invent a sixth legal box.
8. When a surface presents backend-owned execution facts, identify the fact contract and keep the UI path read-only.

**BLOCK CONDITION:** unresolved authority conflicts, duplicate theme roots, unexplained cross-mode semantic differences, promotion of Status/Modal into legal boxes, or frontend behavior that attempts to become backend execution authority.

## ACTION
1. Inspect the canonical visual/theme requirement before changing UI roots.
2. Resolve the single canonical unified theme root.
3. Reconcile theme mode:
   - Dark = Dark Spatial Glassmorphism (Command Space).
   - Light = Light Spatial Skeuomorphism (Instrument Space).
4. Resolve companion procedures before touching their concerns.
5. Reuse shared semantic tokens and primitives rather than page-local styling.
6. Map every surface to the correct F0–F7 field identity while preserving the five legal boxes.
7. Preserve semantic UI behavior across theme modes; theme changes must not alter identity, authorization, domain state, scheduler behavior, commerce truth, approval policy, or durable events.
8. For backend-owned execution facts, consume the typed fact contract, preserve its provenance, validate presentation invariants, and expose validation failures without repairing or mutating backend state.
9. Never infer authorization, persistence, scheduler selection, entitlement, or completion from a UI validation result alone.
10. Prefer low-specificity CSS. Avoid mass `!important`.
11. Validate responsive, accessibility, reduced-motion, and browser behavior.
12. Perform a post-edit structural review against the pre-edit map.
13. Record decisions, affected roots, skills used, verification, evidence, and any learned procedure.

## DO NOT
- Do not create a second theme root.
- Do not promote F6 Status or F7 Modal into the legal-box list.
- Do not invent a sixth legal box or a second dialog system.
- Do not treat Glassmorphism/Skeuomorphism as backend, scheduler, identity, or commerce behavior.
- Do not treat a screenshot as proof of persistence, authorization, or completion.
- Do not let a frontend validator become an authorization or execution gate.
- Do not make the UI repair backend facts or write scheduler/task state as a side effect of validation.
- Do not bypass structural review because a change looks small.

## PASS
Pass when one theme root controls both modes; F0–F7 is respected; the five legal boxes remain the only general-purpose boxes; Status and Modal stay controlled system surfaces; companion skills were used for their bounded concerns; backend-owned facts are consumed read-only through an explicit contract; and exercised accessibility/responsive/browser checks pass.

## EVIDENCE
Record Product Law section, Masterplan item, theme root, F0–F7 mapping, reviews, companion skills, backend fact contract/provenance when applicable, verification results, and GitHub evidence. Screenshots are separate verification artifacts only.

## LEARNED PATTERN — BACKEND FACT CONSUMPTION
When backend execution facts cross into the spatial UI, keep the layers explicit:

`backend-owned fact contract → frontend validation/presentation → backend runtime authority`

A frontend validator checks presentation integrity; it does not authorize execution. A UI contract may display task status, approval, connection, seat/provider identity, or terminal events without acquiring ownership of those facts. Deterministic UI/runtime tests do not prove live external-service completion.

This is a TeamAi-specific learned procedure until broader evidence establishes generalization.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`
- `docs/TEAM-EXPERIENCE-029_COMMAND_DECK_AND_TOKEN_FREEZE.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/governance/learning-handover/SKILL.md`
- `skills/verification/browser-smoke/SKILL.md`