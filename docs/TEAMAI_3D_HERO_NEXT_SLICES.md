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

## Naming harden (this track)

| Canonical | Legacy Hero face | Commerce? |
|-----------|------------------|-----------|
| **SEAT_SKILLS** | SEAT_TOOLKIT | No |
| **WORKSPACE_SKILLS** | WORKSPACE_ZIPSKILLS | No |
| **Zip package** | distribution format | No |
| **Team Quality / Tool Quality** | billing axes | Yes |

Contract: `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`

## Next development phase (ordered)

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| **K** | Issue hygiene #88/#89/#95 | Comments → evidence PRs; leave endorsement open | Do not close without owner |
| **L** | Verification residual #96–#98 | Map landed adapter work to issues | Docs-only “satisfied by” |
| **F** | Health leaf domain read-model | `source:'domain'` under named contract | Keep fixture |
| **N** | Author first SEAT_SKILLS / WORKSPACE_SKILLS bodies | One kind per PR | Start with `ws.029.presentation` + `seat.planning.summarize` |
| **M** | Optional single-canvas background assets | Semantic camera angles only | No second canvas |
| **Owner** | #88 / #89 endorsement | Visual sign-off | Optional for continuity |

## Optional skills / toolkits (product rule)

- **SEAT_SKILLS** / **WORKSPACE_SKILLS** (and Hero faces SEAT_TOOLKIT / WORKSPACE_ZIPSKILLS) are **not required** platform setups.
- Users may assign skills **outside** TeamAi; presentation must not imply entitlement.
- Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock).
- **Zip package** = distribution only; **not** a commerce SKU name.

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** only (R4).
- Inspect → semantic dock wins; orbit paused.
- Named §9 zoom bounds + reduced clamps.

## Related docs

- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`  
- `docs/EVIDENCE_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md`  
- `docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89 reduced-motion lighting)  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
