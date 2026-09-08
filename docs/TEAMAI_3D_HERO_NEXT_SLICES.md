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
| I.1–I.3 | #95 cross-root skill wiring | **Merged** (#158–#160); issue **closed** |
| J | #88 material depth evidence + HandOver | **Merged** (#161) |
| Taxonomy | SEAT_SKILLS / WORKSPACE_SKILLS (Zip ≠ commerce) | **Merged** (#163) |
| N.1 | First skill bodies (`ws.029.presentation`, `seat.planning.summarize`) | **Merged** (#164) |
| N.2 | More skill bodies (`ws.contribution.flow`, `seat.work.coding`, `ws.tools.github`) | **Merged** (#165) |
| N.3 | Entitlement architecture (no numbers) + turn/secrets/verification skills | **Merged** (#166) |
| K | Issue hygiene + living NEXT_SLICES + Grok Skills alignment | **Merged** (#167) |
| L | Verification residual #96–#98 satisfied-by map | **In PR** |

Stale PR **#162** was closed as superseded under Slice K.

## Naming

| Canonical | Legacy Hero face | Commerce? |
|-----------|------------------|-----------|
| **SEAT_SKILLS** | SEAT_TOOLKIT | No |
| **WORKSPACE_SKILLS** | WORKSPACE_ZIPSKILLS | No |
| **Zip package** | distribution format only | No |
| **Team Quality** | seat count / team capacity | Yes |
| **Tool Quality** | optional tools/MCP packs | Yes (separate) |
| **Team size** | persistent WebAi seats unlocked | Part of Team Quality |

Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock).

## Optional skills (product rule)

- SEAT_SKILLS / WORKSPACE_SKILLS are **not required** platform setups.
- Users may assign skills outside TeamAi; presentation must not imply entitlement.

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Named §9 zoom bounds; reduced-motion clamps remain contract.

## Next (ordered — execute one slice per session)

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| **N.4** | Remaining WORKSPACE_SKILLS bodies | `ws.authority.map`, `ws.evidence.handover` | Same SKILL.md contract as N.1–N.3; not Product Law |
| **N.5** | Remaining SEAT_SKILLS bodies | `seat.planning.discuss`, `seat.field.*`, `seat.coord.leader` | One kind per PR if large |
| **F** | Health leaf → domain read-model | `source:'domain'` only under named contract | Keep fixture; never healthy = entitled |
| **M** | Optional background 3D Hero assets | One Hero canvas; semantic cameras | No paid assets; no second canvas |
| **Owner** | #88 / #89 endorsement | Product-owner visual sign-off | Required to close those issues |

## MASTERPLAN empty checks (do not invent live evidence)

Remaining TEAM-BACKEND-001 checkboxes **7, 13–17** are **user-manual / environment / owner** — flagged on `backend/BACKEND_LIVE_SERVICE_STATUS.md`. Do **not** create a second deployment file.

## Grok Skills alignment

Route through `docs/GROK_SKILLS_ALIGNMENT.md` and `docs/SKILL_WIRING.md` §8b / §13. Repository `skills/**` + Product Law win.

## Product rules that stay true

- Theme: `document.documentElement` only; Isolation preserved.
- Hierarchy numbers live in baseline §9; amend with code in the same PR.
- Presentation never invents entitlement, scheduler, or durable auth.
- Green CI is necessary, not Endorsement.

## Related

- `docs/EVIDENCE_TEAM-EXPERIENCE-029_VERIFICATION_96_98_SATISFIED_BY.md`  
- `docs/GROK_SKILLS_ALIGNMENT.md`  
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89)  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
