# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work on Hero hierarchy + rings.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Ordered ladder (2026-09-08)

| Slice | Topic | Status |
|-------|--------|--------|
| A | R1/R2 hit targets + focus + wheel/touch nav | **Merged** (#150) |
| B | `RING_R1_SCALE` / `RING_R2_SCALE` in §9 + runtime | **Merged** (#151) |
| C | Camera orbit polish — NAVIGATE-only; dock wins on inspect | **Next** |
| D | SEAT_TOOLKIT presentation stubs (optional seat-scoped) | Queued |
| E | WORKSPACE_ZIPSKILLS face (optional workspace equip) | Queued |

## Optional skills / toolkits (product rule)

- **SEAT_TOOLKIT** and **WORKSPACE_ZIPSKILLS** are **not required** platform setups or configs.
- Users may assign skills/toolkits **outside** TeamAi; Hero presentation must not imply entitlement or mandatory bind.
- When shown: Toolkit = seat-scoped fixture only; ZipSkills = workspace-tree governance continuity only.

## Implementation entry condition

Before active implementation, re-check `MASTERPLAN.md`. Hero slices remain **presentation-only** unless a named backend contract authorizes more.

## Spatial engineering rule

Each slice introduces one new spatial capability and one verification boundary. Preserve semantic cameras, authored topology, 1–8 Seat scaling, reduced motion, and the normal-UI handoff boundary.

## Deep inspection progression

`orientation → surface → seat/focus → connection → behavior → (optional toolkit) → capability → authorization/scope → workspace → task/evidence → normal UI`

## Camera (Slice C target)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Wheel + touch/pinch already on main; polish = mode gate + §9 named zoom bounds + optional reset affordance.
- Reduced-motion clamps remain contract.

## Related docs

- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`  
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`  
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` §4.1b  
- `skills/frontend/spatial/workspace-ring/SKILL.md`
