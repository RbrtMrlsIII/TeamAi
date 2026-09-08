# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Completed ladder

| Slice | Topic | Status |
|-------|--------|--------|
| A | R1/R2 hit targets + focus + wheel/touch nav | **Merged** (#150) |
| B | `RING_R1_SCALE` / `RING_R2_SCALE` in §9 + runtime | **Merged** (#151) |
| C | Camera orbit polish — **NAVIGATE**-only; dock wins on inspect | **Merged** (#152) |
| D | SEAT_TOOLKIT presentation stubs (optional seat-scoped) | **Merged** (#153) |
| E | WORKSPACE_ZIPSKILLS face (optional workspace equip) | **Merged** (#155) |
| G | #89 reduced-motion lighting contract | **Merged** (#156) |
| H | Legacy `MECHANISM_ZIPSKILLS` reconcile | **Merged** (#157) |
| I.1–I.3 | #95 cross-root skill wiring | **Merged** (#158–#160) |
| J | #88 material depth evidence + HandOver | **Merged** (#161) |
| Taxonomy | SEAT_SKILLS / WORKSPACE_SKILLS (Zip ≠ commerce) | **Merged** (#163) |
| N.1 | First skill bodies (`ws.029.presentation`, `seat.planning.summarize`) | **In PR** |

## Naming

| Canonical | Legacy Hero face | Commerce? |
|-----------|------------------|-----------|
| **SEAT_SKILLS** | SEAT_TOOLKIT | No |
| **WORKSPACE_SKILLS** | WORKSPACE_ZIPSKILLS | No |
| **Zip package** | distribution format only | No |
| **Team Quality** | seat count / team capacity | Yes |
| **Tool Quality** | optional tools/MCP packs | Yes (separate) |
| **Team size** | persistent WebAi seats unlocked | Part of Team Quality |

Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock). Prefer WORKSPACE_ZIPSKILLS / WORKSPACE_SKILLS in new docs.

## Optional skills (product rule)

- SEAT_SKILLS / WORKSPACE_SKILLS are **not required** platform setups.
- Users may assign skills outside TeamAi; presentation must not imply entitlement.

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Named §9 zoom bounds; reduced-motion clamps remain contract.

## Next

| Slice | Topic | Desired output |
|-------|--------|----------------|
| N.2 | More skill bodies | `ws.contribution.flow`, `seat.work.coding`, `ws.tools.github` |
| K | Issue hygiene | #88/#89/#95 comments |
| L | #96–#98 map | Satisfied-by notes |
| F | Health domain read-model | Named contract only |

## Related

- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`  
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`  
- `docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`  
- `skills/workspace/ws.029.presentation/SKILL.md`  
- `skills/seat/seat.planning.summarize/SKILL.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89 reduced-motion lighting)  
