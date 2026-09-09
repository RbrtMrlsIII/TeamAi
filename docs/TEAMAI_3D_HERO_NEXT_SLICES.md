# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

**P1**–**P7.1** **merged** (#174–#187). **P-R2** **merged** (#188). **P-R0** **merged** (#189). **F** **merged** (#190). **Cam-1** hierarchy camera follow contract **this PR**.

## Completed ladder (structure + skills)

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
| N.1 | First skill bodies | **Merged** (#164) |
| N.2 | contribution / coding / GitHub skills | **Merged** (#165) |
| N.3 | entitlement arch + turn/secrets/verification skills | **Merged** (#166) |
| K | Issue hygiene + Grok Skills alignment | **Merged** (#167) |
| L | #96–#98 satisfied-by map | **Merged** (#168) |
| N.4 | `ws.authority.map`, `ws.evidence.handover` | **Merged** (#169) |
| N.5 | Remaining SEAT_SKILLS (discuss, fields, leader) | **Merged** (#170) |

## Product rule: depth-first hierarchy animation (plan of record)

We build **one hierarchy node at a time**, not a thin shell with empty faces forever.

### Camera-fill rule (login / signup / full-area content)

When a face or plate **covers the whole working area** (e.g. auth login/signup, wide config):

1. Semantic camera **docks** to that content’s anchor (not free orbit while INSPECT).
2. Zoom / framing continues until **the whole contents can be seen** (or the maximum safe dock), within §9 clamps.
3. On narrow viewports, FOV boost may assist readability.
4. Reduced motion: snap dock; no continuous travel choreography.
5. If the form cannot live honestly in WebGL → **APP_UI_HANDOFF** / normal UI (auth remains Firebase-owned).

## Hierarchy animation ladder (execute in order)

| Slice | Node | Desired output | Pass gate |
|-------|------|----------------|-----------|
| **P1** | `SEAT_CONNECTION` (+ health leaf) | Branch open motion; camera to readable connection face; path to configure / normal UI | **Merged** runtime |
| **P1.1** | CONNECTION visual flex | Frame tick + branchBoost + keyboard **C** + accessible name | **Merged** (#174) |
| **P2** | `SEAT_BEHAVIOR` | Branch open motion; Do/Dont face a11y + configure handoff | **Merged** (#175) |
| **P2.1** | BEHAVIOR visual flex | Frame tick + branchBoost + keyboard **B** | **Merged** (#176) |
| **P3** | `SEAT_TOOLKIT` (optional) | Branch open motion; optional equip a11y + configure handoff | **Merged** (#178) |
| **P3.1** | TOOLKIT visual flex | Frame tick + branchBoost + keyboard **T** | **Merged** (#179) |
| **P4** | `SEAT_CAPABILITIES` | Branch open motion; capability face a11y + handoff (**not** authorization) | **Merged** (#180) |
| **P4.1** | CAPABILITIES visual flex | Frame tick + branchBoost + keyboard **K** | **Merged** (#181) |
| **P5** | `SEAT_AUTHORIZATION` | Branch open motion; authorization face a11y + handoff (**not** capability) | **Merged** (#182) |
| **P5.1** | AUTHORIZATION visual flex | Frame tick + branchBoost + keyboard **A** | **Merged** (#183) |
| **P6** | `SEAT_WORKSPACE_SCOPE` | Branch open motion; workspace scope face a11y + handoff (**not** durable store) | **Merged** (#184) |
| **P6.1** | WORKSPACE_SCOPE visual flex | Frame tick + branchBoost + keyboard **W** | **Merged** (#185) |
| **P7** | `SEAT_TASK_EVIDENCE` | Branch open motion; task evidence face a11y + handoff (presentation only) | **Merged** (#186) |
| **P7.1** | TASK_EVIDENCE visual flex | Frame tick + branchBoost + keyboard **E** | **Merged** (#187) |
| **P-R2** | Setup ring (incl. **login/signup** full-area) | Camera-fill until whole auth/config contents visible; handoff if needed | **Merged** (#188) |
| **P-R0** | WORKSPACE_ZIPSKILLS crown | Small optional branch on workspace tree | **Merged** (#189) |
| **F** | Health leaf domain read-model | `source:'domain'` only with named contract | **Merged** (#190) |
| **Cam-1** | Hierarchy Camera Follow Contract | Docs: follow tree, center-target zoom, retire lock-only cams, interim DOM debt | **This PR** |
| **Cam-2** | Camera follows open parent/child | Pre-made docks + center target per node | Next |
| **Cam-3** | Free zoom on current tree center | Even when parent open | After Cam-2 |
| **Cam-4** | Edge-drag + inverse-swipe | Whole-web PoV | After Cam-3 |
| **Cam-5** | Absorb DOM chrome + UI scale 50–100% | Settings tree preference | Parallel |
| **M** | Background assets | One canvas only | No paid assets |
| **Owner** | Visual endorsement | When environment + outer UI fair | after follow |

## Optional skills / toolkits (product rule)

- SEAT_SKILLS / WORKSPACE_SKILLS (and Hero faces SEAT_TOOLKIT / WORKSPACE_ZIPSKILLS) are **not required** platform setups.
- Users may assign skills outside TeamAi; presentation must not imply entitlement.

## Camera (baseline already on main)

- Free orbit / zoom: **NAVIGATE** only (R4).
- Inspect → semantic dock (`SEAT_CLOSE`, `DETAIL_ANCHOR`, `WORKSPACE_CLOSE`, …) wins.
- Named §9 zoom bounds; reduced-motion clamps remain contract.
- **New emphasis:** full-area content → zoom/dock until contents fit (see camera-fill rule).
- Physical eye/target/FOV positions already live in `hero-flex.js` `cameras()` (`HERO_WIDE`, `SEAT_CLOSE`, `DETAIL_ANCHOR`, `WORKSPACE_CLOSE`, …). Per-node refined docks may evolve later; baseline positions exist now.
- **Cam-1 contract:** camera must follow growing hierarchy trees; lock-only presets are debt; see `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`.

## Naming

| Canonical | Legacy Hero face | Commerce? |
|-----------|------------------|-----------|
| **SEAT_SKILLS** | SEAT_TOOLKIT | No |
| **WORKSPACE_SKILLS** | WORKSPACE_ZIPSKILLS | No |
| **Zip package** | distribution format only | No |
| **Team Quality / team size / Tool Quality** | subscription axes | Yes |

Legacy `MECHANISM_ZIPSKILLS` aliases `WORKSPACE_ZIPSKILLS` (same dock).

## Product rules that stay true

- Presentation only. No durable grant from canvas.
- No 029-released claim until backend gate + endorsement.
- One hierarchy node at a time (depth-first).
- Skills packages are not authority / entitlement (LAW 109).
