# Seat Shell Hierarchy v1 Skill

**Status:** SPATIAL COMPANION / FIRST PARENT FILL  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`  
**Runtime:** `skills/frontend/spatial/hierarchy-runtime/SKILL.md`  
**Sheet:** `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`

## WHEN TO USE
Use when implementing or reviewing the **first in-machine parent**: Seat shell open → v1 children → one leaf health face.

Triggers: Seat shell, SEAT_SHELL, SEAT_CONNECTION, SEAT_CONNECTION_HEALTH_FACE, seat open, dock SEAT_CLOSE, first gear open, in-machine leaf.

Do **not** use this skill to implement Subscription / Discussion / Coding / Settings gears in the same slice.

## INPUT
- Seat Shell Hierarchy v1 sheet (part IDs, child order, v1 leaf, non-goals).
- Hierarchy Runtime skill + baseline §9 living numbers.
- Machine Interaction Contract (leaves stay inside; only the room is outside).
- `public/hero-flex.js`, `hero-authored-meshes.js` `seatShell`, semantic camera `SEAT_CLOSE`.
- Seat read-model skill (future feed only — v1 leaf may stay fixture/`unknown`).
- Accessibility + motion + responsive companions.

## AUTHORITY
Product Law Families **E** (Seat) + **J** (presentation). Connection face may *read* H/I facts later without owning them. Browser must not write durable seat/health/entitlement. Mechanical open is never entitlement.

Numbers come from the baseline doc, not from this skill.

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
   Deferred: `SEAT_TOOLKIT`, `SEAT_ZIPSKILLS`.
   Stack with `CHILD_STEP_Y` / `CHILD_STEP_R`.
6. **One leaf** — `SEAT_CONNECTION_HEALTH_FACE` inside `SEAT_CONNECTION`. Presentation enums: `unknown` | `loading` | `unavailable` | (later) read-model health. Accessible name + keyboard when focused. **Not** API key / OAuth / durable bind.
7. **Evidence** — static: part IDs, one-open, leaf-inside-shell. Browser: wide → open seat → child stack visible.
8. **Stop.** Do not add other domain gears in the same PR.

PR body must include the Hierarchy Runtime R1–R10 accounting table (Seat v1 fill is already sketched in baseline §5).

## DO NOT
- Do not expand `hero-seat-stack.js` DOM as the permanent home of this hierarchy.
- Do not treat health face `healthy` as entitlement or live provider success without `source: 'domain'`.
- Do not implement Toolkit/ZipSkills or other domain gears here.
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
