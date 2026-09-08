# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work on Hero hierarchy + rings.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Ordered ladder (2026-09-08)

| Slice | Topic | Status |
|-------|--------|--------|
| A | R1/R2 hit targets + focus + wheel/touch nav | **Merged** (#150) |
| B | `RING_R1_SCALE` / `RING_R2_SCALE` in §9 + runtime | **Merged** (#151) |
| C | Camera orbit polish — NAVIGATE-only; dock wins on inspect | **Merged** (#152) |
| D | SEAT_TOOLKIT presentation stubs (optional seat-scoped) | **Merged** (#153) |
| E | WORKSPACE_ZIPSKILLS face (optional workspace equip) | **Merged** (#155) |
| G | #89 reduced-motion lighting contract | **Merged** (#156) |
| H | Legacy `MECHANISM_ZIPSKILLS` reconcile | **In PR** |

## Next development phase

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| F | Health leaf → domain read-model | `SEAT_CONNECTION_HEALTH_FACE` accepts `source: 'domain'` only when a named seat-read-model contract exists; fixture remains default | No live health feed yet → keep fixture; do not fake healthy = entitled |
| I | #95 cross-root motion / a11y integration | Motion · transition · animation · responsive · a11y skills wired as companions | **Unblocked by G** — one companion pair per PR if large |
| J | #88 remaining visual acceptance | Browser review at HERO_WIDE / SEAT_CLOSE + endorsement chain | Code already on main; evidence PR only |

## Optional skills / toolkits (product rule)

- **SEAT_TOOLKIT** and **WORKSPACE_ZIPSKILLS** are **not required** platform setups or configs.
- Users may assign skills/toolkits **outside** TeamAi; Hero presentation must not imply entitlement or mandatory bind.
- When shown: Toolkit = seat-scoped fixture only; ZipSkills = workspace-tree governance continuity only (LAW 109 — skill package, not authority).
- Legacy `MECHANISM_ZIPSKILLS` is an **alias** of `WORKSPACE_ZIPSKILLS` (same physical dock). Prefer the workspace name in new docs; keep MECHANISM_* in e2e until selectors migrate.

## Implementation entry condition

Before active implementation, re-check `MASTERPLAN.md`. Hero slices remain **presentation-only** unless a named backend contract authorizes more.

## Spatial engineering rule

Each slice introduces one new spatial capability and one verification boundary. Preserve semantic cameras, authored topology, 1–8 Seat scaling, reduced motion, and the normal-UI handoff boundary.

## Deep inspection progression

`orientation → surface → seat/focus → connection → behavior → (optional toolkit) → capability → authorization/scope → workspace → (optional ZipSkills) → task/evidence → normal UI`

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Named §9 zoom bounds; reduced-motion clamps remain contract.

## Related docs

- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`  
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`  
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` §4.1b  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md`  
