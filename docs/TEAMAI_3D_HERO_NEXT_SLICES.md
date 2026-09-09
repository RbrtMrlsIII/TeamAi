# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

**P1** + **P1.1** SEAT_CONNECTION **merged** (#174). **P2** SEAT_BEHAVIOR runtime **this PR**. Next: **P2.1** visual flex (optional) → **P3 SEAT_TOOLKIT**.

## Hierarchy animation ladder (execute in order)

| Slice | Node | Desired output | Pass gate |
|-------|------|----------------|-----------|
| **P1** | `SEAT_CONNECTION` (+ health leaf) | Branch open motion; camera to readable connection face; path to configure / normal UI | **Merged** runtime |
| **P1.1** | CONNECTION visual flex | Frame tick + branchBoost + keyboard **C** + accessible name | **Merged** (#174) |
| **P2** | `SEAT_BEHAVIOR` | Branch open motion; Do/Don't face a11y + configure handoff | **This PR** (runtime) |
| **P2.1** | BEHAVIOR visual flex | Frame tick + branchBoost + keyboard **B** | After P2 merge |
| **P3** | `SEAT_TOOLKIT` (optional) | Optional equip face; still **not required** setup | Optional skip if product defers |
| **P4…** | Capabilities → Authorization → Workspace scope → Task/evidence | One face per slice | Same gates |
| **P-R2** | Setup ring (incl. **login/signup** full-area) | Camera-fill until whole auth/config contents visible; handoff if needed | FOV + narrow viewport |
| **P-R0** | WORKSPACE_ZIPSKILLS crown | Small optional branch on workspace tree | Not a seat child |
| **F** | Health leaf domain read-model | `source:'domain'` only with named contract | Else keep fixture |
| **M** | Background assets | One canvas only | No paid assets |
| **Owner** | Visual endorsement | When environment + outer UI fair | #89 open |

## Boundaries

- Presentation only · one theme root · no 029-released claim
- CAPABILITY ≠ AUTHORIZATION ≠ WORKSPACE ≠ FIRESTORE
- Green CI ≠ Endorsement
