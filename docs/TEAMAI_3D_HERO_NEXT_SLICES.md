# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work on Hero hierarchy + rings.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Ordered ladder (2026-09-08)

| Slice | Topic | Status |
|-------|--------|--------|
| A | R1/R2 hit targets + focus + wheel/touch nav | **Merged** (#150) |
| B | `RING_R1_SCALE` / `RING_R2_SCALE` in §9 + runtime | **Merged** (#151) |
| C | Camera orbit polish — **NAVIGATE**-only; dock wins on inspect | **Merged** (#152) |
| D | SEAT_TOOLKIT presentation stubs (optional seat-scoped) | **Merged** (#153) |
| E | WORKSPACE_ZIPSKILLS face (optional workspace equip) | **Merged** (#155) |
| G | #89 reduced-motion lighting contract | **Merged** (#156) |
| H | Legacy `MECHANISM_ZIPSKILLS` reconcile | **Merged** (#157) |
| I.1 | #95 cross-root skill wiring matrix | **Merged** (#158) |
| I.2 | Motion + transition token alignment vs §9 | **In PR** |

## Next development phase

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| I.3 | Responsive + a11y wiring + reduced regression | Static assertions; G contract still true; keyboard/non-color notes | One concern per commit if noisy |
| F | Health leaf → domain read-model | `source: 'domain'` only under named contract | Keep fixture |
| J | #88 visual acceptance | Browser frames + HandOver / endorsement evidence | Evidence only |

## Optional skills / toolkits (product rule)

- **SEAT_TOOLKIT** and **WORKSPACE_ZIPSKILLS** are **not required** platform setups or configs.
- Users may assign skills/toolkits **outside** TeamAi; Hero presentation must not imply entitlement or mandatory bind.
- Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same physical dock).

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Named §9 zoom bounds; reduced-motion clamps remain contract.

## Related docs

- `docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md`  
- `docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89 reduced-motion lighting)  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
