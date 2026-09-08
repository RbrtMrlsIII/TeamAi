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
| N.1–N.3 | Skill bodies + entitlement architecture (no numbers) | **Merged** (#164–#166) |
| K | Issue hygiene + Grok Skills alignment | **Merged** (#167) |
| L | #96–#98 satisfied-by map | **Merged** (#168) |
| N.4 | `ws.authority.map`, `ws.evidence.handover` | **Merged** (#169) |
| N.5 | Remaining SEAT_SKILLS (discuss, fields, leader) | **Merged** (#170) |

## Naming

| Canonical | Legacy Hero face | Commerce? |
|-----------|------------------|-----------|
| **SEAT_SKILLS** | SEAT_TOOLKIT | No |
| **WORKSPACE_SKILLS** | WORKSPACE_ZIPSKILLS | No |
| **Zip package** | distribution format only | No |
| **Team Quality / team size / Tool Quality** | subscription axes | Yes |

Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock).

## Optional skills / toolkits (product rule)

- SEAT_SKILLS / WORKSPACE_SKILLS (and Hero faces SEAT_TOOLKIT / WORKSPACE_ZIPSKILLS) are **not required** platform setups.
- Users may assign skills outside TeamAi; presentation must not imply entitlement.

## Camera (Slice C landed)

- Free orbit / zoom: **NAVIGATE** input mode only (Hierarchy Runtime R4).
- Seat select → semantic dock (`SEAT_CLOSE`) wins; orbit paused while `INSPECT`.
- Named §9 zoom bounds; reduced-motion clamps remain contract.

## Next (ordered — one slice per session)

| Slice | Topic | Desired output | Workaround if blocked |
|-------|--------|----------------|------------------------|
| **P** | Hierarchy motion / transition polish | Stronger open-child / stack motion using existing §9 durations + motion/transition skills; **no** second animation framework | Keep current open/close if polish is large — optional |
| **F** | Health leaf → domain read-model | `source:'domain'` only under a **named** seat-read-model contract | Keep fixture; never healthy = entitled |
| **M** | Optional single-canvas background assets | One Hero canvas; semantic cameras; authored only | No paid assets; no second canvas |
| **Outer UI** | Non-Hero plates / chrome | Readable product shell so owner can fair-judge Hero | Separate from 029 release claim |
| **Owner** | Visual endorsement | #89 (and #88 if reopened) when environment + outer UI are fair | Do not fake endorsement |

## Skill catalog status (procedure library)

| Family | Status |
|--------|--------|
| WORKSPACE_SKILLS kinds with bodies | `ws.029.presentation`, `ws.contribution.flow`, `ws.tools.github`, `ws.turn.defaults`, `ws.secrets.boundary`, `ws.authority.map`, `ws.evidence.handover` |
| SEAT_SKILLS kinds with bodies | `seat.planning.summarize`, `seat.planning.discuss`, `seat.work.coding`, `seat.field.*` (backend/frontend/integration/docs/verification), `seat.coord.leader` |
| Still optional / not written as SKILL.md | Any future kinds only when product needs them |

## Owner visual note

Hero hierarchy is **visible** (e.g. GitHub Pages), but outer product UI and rich transforming/branch **machinery cinema** remain incomplete. Functional open/close + docks exist; showpiece animation is **later (P)**. **Do not** treat owner endorsement as done until a fair review is possible. Presentation ≠ 029-released.

## MASTERPLAN empty checks

TEAM-BACKEND-001 remainder **7, 13–17** = user-manual on existing `backend/BACKEND_LIVE_SERVICE_STATUS.md`. No second deployment file.

## Product rules that stay true

- Theme: `document.documentElement` only; Isolation preserved.
- Hierarchy numbers live in baseline §9; amend with code in the same PR.
- Presentation never invents entitlement, scheduler, or durable auth.
- Green CI is necessary, not Endorsement.
- CAPABILITY ≠ AUTHORIZATION ≠ WORKSPACE ≠ FIRESTORE.

## Related

- `docs/GROK_SKILLS_ALIGNMENT.md`  
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`  
- `docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md`  
- `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (#89 reduced-motion lighting)  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9  
