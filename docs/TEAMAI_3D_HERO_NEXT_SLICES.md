# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work on Hero hierarchy + rings.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Completed ladder (2026-09-08)

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
| I.2 | Motion + transition token alignment vs §9 | **Merged** (#159) |
| I.3 | Responsive + a11y wiring + reduced regression | **Merged** (#160) |
| J | #88 material depth evidence + HandOver | **Merged** (#161) |

## Next development phase (ordered)

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| **K** | Issue hygiene — #89 / #95 / #88 presentation close notes | Comment on issues pointing at merged PRs + evidence; leave Masterplan gate explicit | Do not close issues that still require product-owner endorsement |
| **L** | Verification residual #96–#98 | Map already-landed adapter/fixture work to verification issues; evidence pointers only | If implementation already on main, file docs-only “satisfied by” notes — no re-implement |
| **F** | Health leaf → domain read-model | `SEAT_CONNECTION_HEALTH_FACE` accepts `source:'domain'` only under a **named** seat-read-model contract | No contract yet → keep fixture; never fake healthy = entitled |
| **M** | Optional background 3D Hero assets (angles/routes) | One Hero canvas; page angles via semantic cameras; 2.5D container assets only if authored | No external paid assets; no second canvas |
| **Owner** | #88 / #89 endorsement | Product owner visual sign-off | Optional for presentation continuity; required for PRODUCT-KNOWLEDGE promotion |

## Product rules that stay true

- **SEAT_TOOLKIT** and **WORKSPACE_ZIPSKILLS** are **not required** platform setups.
- Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock).
- Hierarchy numbers live in baseline §9; amend with code in the same PR.
- Theme: `document.documentElement` only; Isolation preserved.
- Presentation never invents entitlement, scheduler, or durable auth.

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** only (R4).
- Inspect → semantic dock wins; orbit paused.
- Named §9 zoom bounds + reduced clamps.

## Related docs

- `docs/EVIDENCE_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md`  
- `docs/HANDOVER_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md`  
- `docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md`  
- `docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md`  
- `docs/TEAMAI_3D_HERO_RESPONSIVE_A11Y_WIRING.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89 reduced-motion lighting)  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
