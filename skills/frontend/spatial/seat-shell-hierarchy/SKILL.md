---
name: seat-shell-hierarchy
description: >
  Seat Shell Hierarchy v1 — first in-machine parent open path for TeamAi 3D Hero.
  Use when implementing or reviewing Seat shell open, v1 children, health leaf,
  one-open rule, or amending the Seat Shell sheet. ZipSkills is NOT seat-scoped.
---

# Seat Shell Hierarchy

## WHEN TO USE
Use when implementing or reviewing the **first in-machine parent**: Seat shell open → v1 children → one leaf health face.

Triggers: Seat shell, SEAT_SHELL, SEAT_CONNECTION, SEAT_CONNECTION_HEALTH_FACE, seat open, dock SEAT_CLOSE, first gear open, in-machine leaf.

## INPUT
- Seat Shell Hierarchy v1 sheet (part IDs, child order, v1 leaf, non-goals).
- Hierarchy Runtime Baseline R1–R10 + §9 living numbers.
- `public/hero-flex.js`, `hero-authored-meshes.js` `seatShell`, semantic camera `SEAT_CLOSE`.
- Seat read-model skill (future feed only — v1 leaf may stay fixture/`unknown`).

## AUTHORITY
1. PRODUCT_LAW.md (Families E, H, J)
2. Machine Interaction Contract
3. Hierarchy Runtime Baseline + hierarchy-runtime skill
4. This sheet + this skill
5. Presentation-only boundary unless a named backend contract authorizes more

## ACTION
Execute the sheet ladder, one step per PR if needed:

1. **Confirm sheet** — child order and v1 leaf unchanged unless the user amends the sheet.
2. **State (R1)** — `SeatShellState { index, open, focusedChildId }` mapped into `HierarchyRuntimeState` (`openParentId = SEAT_SHELL#index`).
3. **Select + dock (R3/R4)** — click/focus Seat from wide/team → `SEAT_CLOSE` (or successor). Opening another Seat closes the previous (one-open).
4. **Open/close pose (R2/R5)** — rest Y = `SEAT_REST_Y`; open Y = rest + `SEAT_OPEN_LIFT`. Reduced motion **snaps**. Named constants from §9.
5. **Place v1 children (R6)** in Product Law order, inside the open shell:
   - `SEAT_CONNECTION` — layer (interactive target)
   - `SEAT_BEHAVIOR` — stub
   - `SEAT_CAPABILITIES` — stub
   - `SEAT_AUTHORIZATION` — stub
   - `SEAT_WORKSPACE_SCOPE` — stub
   - `SEAT_TASK_EVIDENCE` — stub  
   Deferred **seat-scoped**: `SEAT_TOOLKIT` (skill bundles from seat preferences / responsibilities).
   **Not a Seat child:** ZipSkills — workplace governance / execution discipline (team-lead, shared team, or branch-before-main). See sheet § children / ZipSkills note.
   Stack with `CHILD_STEP_Y` / `CHILD_STEP_R`.
6. **One leaf** — `SEAT_CONNECTION_HEALTH_FACE` inside `SEAT_CONNECTION`. Presentation enums: `unknown` | `loading` | `unavailable` | (later) read-model health. Accessible name + keyboard when focused. **Not** API key / OAuth / durable bind.
7. **Evidence** — static: part IDs, one-open, leaf-inside-shell. Browser: wide → open seat → child stack visible.
8. **Stop.** Do not add other domain gears in the same PR.

PR body must include the Hierarchy Runtime R1–R10 accounting table (Seat v1 fill is already sketched in baseline §5).

## DO NOT
- Do not expand `hero-seat-stack.js` DOM as the permanent home of this hierarchy.
- Do not treat health face `healthy` as entitlement or live provider success without `source: 'domain'`.
- Do not implement `SEAT_TOOLKIT` or other deferred seat gears here.
- Do not place ZipSkills on seats — workspace governance only (sheet amendment).
- Do not invent numbers; load §9.
- Do not skip reduced-motion snap or a11y name on the leaf.
- Do not write Firestore / PayPal / scheduler state.

## PASS
One Seat can open; v1 children visible in order; one leaf inside the shell; one-open rule; numbers named; presentation-only; tests + optional frames; no 029-released claim.

## EVIDENCE
Part-ID static tests, R1–R10 PR table, browser frame (wide → open), limitations, next parent (not this skill).

## SEE ALSO
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`
- `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
- `skills/frontend/spatial/seat-read-model/SKILL.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `docs/SKILL_WIRING.md`
