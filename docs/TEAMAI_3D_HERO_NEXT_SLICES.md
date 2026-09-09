# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

## Completed ladder (structure + skills)

| Slice | Topic | Status |
|-------|--------|--------|
| A–N.5 | Hierarchy, rings, skills, hygiene | **Merged** (see prior rows in git history) |
| **P1** | `SEAT_CONNECTION` runtime branch + handoff | **Merged** (#173 path) |
| **P1.1** | Connection flex wiring in `hero-flex.js` | **This PR** |

## Product rule: depth-first hierarchy animation (plan of record)

```text
Open parent → first child branch → camera dock until readable
  → full-area content uses camera-fill → normal-UI handoff if needed
  → only then the next sibling child
```

## Hierarchy animation ladder (execute in order)

| Slice | Node | Desired output | Pass gate |
|-------|------|----------------|-----------|
| **P1** | `SEAT_CONNECTION` (+ health leaf) | Branch open motion; configure handoff | **Runtime done** |
| **P1.1** | Connection **flex** | Visible branch + **C** key + frame tick | **This PR** |
| **P2** | `SEAT_BEHAVIOR` | Same treatment for Do/Don’t face | Don’t start until P1.1 pass |
| **P3** | `SEAT_TOOLKIT` (optional) | Optional equip face | Optional |
| **P4…** | Capabilities → Authz → Scope → Task | One face per slice | Same gates |
| **P-R2** | Setup ring (login/signup full-area) | Camera-fill until whole contents visible | FOV + narrow |
| **P-R0** | WORKSPACE_ZIPSKILLS crown | Small optional branch | Not a seat child |
| **F** | Health leaf domain read-model | `source:'domain'` only with contract | Else fixture |
| **M** | Background assets | One canvas only | No paid assets |
| **Owner** | Visual endorsement | When environment + outer UI fair | #89 open |

## Product rules that stay true

- Theme: `document.documentElement` only
- Hierarchy numbers live in baseline §9
- Presentation never invents entitlement / scheduler / durable auth
- Green CI ≠ Endorsement
- **no 029-released claim**

## Related

- `docs/TEAMAI_3D_HERO_HIERARCHY_ANIMATION_LADDER.md`
- `docs/CHECKPOINT_TEAM-EXPERIENCE-029_P1_SEAT_CONNECTION_2026-09-09.md`
- `docs/CHECKPOINT_TEAM-EXPERIENCE-029_P1_1_CONNECTION_FLEX_2026-09-09.md`
- `docs/GROK_SKILLS_ALIGNMENT.md`
