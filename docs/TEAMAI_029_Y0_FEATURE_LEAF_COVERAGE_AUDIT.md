# TeamAi 029 - Y0 Feature / Leaf Coverage Audit

Status: CURRENT IMPLEMENTATION AUDIT
Governing spatial issue: #405
Active implementation vehicle: PR #424
Feature vocabulary authority: #400 / frontend/spatial/feature-registry.js
Structural census authority: docs/TEAMAI_3D_HERO_TREE_CENSUS.*
Audit rule: classify terminal product leaves before assigning spatial geometry. Do not invent child IDs or machine geometry for controls whose terminal class is normal UI, read-model, handoff, or state-only.

## 1. Terminal classes

| Class | Meaning | Geometry implication |
|---|---|---|
| SPATIAL_SURFACE | Product surface itself is intended to be embodied in the Hero world | Requires semantic owner, payload, geometry, topology/interface, camera relation, state/loading/error, responsive, reduced-motion, accessibility, and evidence contract |
| SPATIAL_PAYLOAD | Payload physically represented inside an owned spatial surface | Inherit parent identity/ownership; no new product root by itself |
| APP_UI_HANDOFF | Hero exposes an entry/transition to a normal application surface | No duplicate machine branch solely for the handoff |
| READ_MODEL_ONLY | Hero presents derived/authoritative read-model information | No durable/backend authority recreated in renderer |
| STATE_ONLY | Status/error/readiness/transition state with no independent surface | Project state only; state authority stays with owning contract |

## 2. L0-L2 feature coverage

| Feature | Registry surface | Terminal class | Spatial decision | Owner / field |
|---|---|---|---|---|
| Workspace HQ | spatial + normal UI | SPATIAL_SURFACE + APP_UI_HANDOFF | May own a physical HQ surface; normal UI remains outside geometry | #278 + backend/runtime |
| Projects Library | normal UI | APP_UI_HANDOFF | Do not invent a 3D branch solely for the library UI | #278 + backend/runtime |
| Artifacts / Inventory | normal UI + spatial read-model | APP_UI_HANDOFF + READ_MODEL_ONLY | Read-model payload may appear inside existing world/facility surfaces; no independent tree yet | #278 + backend/runtime |
| Storage | normal UI + spatial read-model | APP_UI_HANDOFF + READ_MODEL_ONLY | Same inventory rule | #278 + backend/runtime |
| Seats 1-10 | spatial + normal UI | SPATIAL_SURFACE + APP_UI_HANDOFF | TREE-HERO-SEAT remains the canonical spatial hierarchy | #400 + Machine Interaction Contract |
| Team / Agents | normal UI + spatial handoff | APP_UI_HANDOFF | Handoff/state only until explicit spatial surface is governed | #278 + backend/runtime |
| MCP / Capability | normal UI + spatial handoff | APP_UI_HANDOFF | Seat Capabilities is a facet; do not duplicate MCP inventory as Seat children | #412 + #400 |
| Skills / Responsibility | normal UI + spatial configuration | APP_UI_HANDOFF | Use SEAT_TOOLKIT for optional resolved presentation; common-skill definitions remain shared | #256 / Skill Wiring |
| Orchestration / Scheduler | normal UI + read-model | APP_UI_HANDOFF + READ_MODEL_ONLY | Scheduler policy stays outside Seat; Hero only projects governed state | #392 + scheduler/runtime |
| Marketplace / Commerce | normal UI + spatial handoff | APP_UI_HANDOFF | Do not invent commerce or entitlement branch geometry | #278 + commerce authority |
| Settings / Control | normal UI + spatial handoff | APP_UI_HANDOFF | Cross-tree navigation/control taxonomy, not a second machine hierarchy | #278 + #400 |
| Authentication Gateway | normal UI + spatial handoff | APP_UI_HANDOFF | Gateway handoff only; renderer never grants auth/entitlement | #204 + auth/backend runtime |

## 3. L3-L5 canonical Seat leaf coverage

| Branch | Terminal leaf family | Class | Current owner state |
|---|---|---|---|
| SEAT_SHELL | identity / provider / runtime / model / overview / status | SPATIAL_SURFACE + READ_MODEL_ONLY | implemented-partial |
| SEAT_CONNECTION | connection / health / configure / bind-test-readiness | SPATIAL_SURFACE + READ_MODEL_ONLY | implemented-partial |
| SEAT_BEHAVIOR | Do/Don't / defaults / inspect-configure | SPATIAL_PAYLOAD | implemented-partial |
| SEAT_TOOLKIT | core skill / domain skill / external assign / configure-equip | SPATIAL_PAYLOAD + APP_UI_HANDOFF | implemented-partial; user editing incomplete |
| SEAT_CAPABILITIES | capabilities / available actions / inspect-configure | SPATIAL_PAYLOAD + APP_UI_HANDOFF | implemented-partial |
| SEAT_AUTHORIZATION | authorization preview / reason / inspect-configure | SPATIAL_PAYLOAD + READ_MODEL_ONLY | implemented-partial; presentation only |
| SEAT_WORKSPACE_SCOPE | workspace / project / repository / path / workstation | SPATIAL_PAYLOAD + READ_MODEL_ONLY | implemented-partial |
| SEAT_TASK_EVIDENCE | task / result / trace / report / evidence | SPATIAL_PAYLOAD + READ_MODEL_ONLY | implemented-partial |

## 4. Leaf eligibility rule

Eligible physical leaf = semantic identity -> payload source -> owning spatial parent -> authored geometry -> connection/interface -> camera subject/travel -> lifecycle state -> responsive/reduced-motion behavior -> verification evidence.

A leaf lacking one of these must not be 'completed' by a box, icon, glow, wire, or placeholder mesh.

## 5. Gaps found

1. G-Y0-01: TREE-DOMAIN is semantic-only. No geometry should be invented during Y0.
2. G-Y0-02: TREE-SKILL-RESPONSIBILITY is semantic-only. Current safe representation is SEAT_TOOLKIT payload plus normal UI.
3. G-Y0-03: global orchestration configuration is defined but not implementation-complete and must not be pushed under SEAT_BEHAVIOR.
4. G-Y0-04: user-owned skill editing is defined but not implementation-complete; user-owned material must remain distinct from common TeamAi skills.
5. G-Y0-05: most non-Seat facilities are intentionally handoff/read-model boundaries, not missing spatial trees.

## 6. Y0 decision

Y0 status = COVERAGE-CLASSIFIED / IMPLEMENTATION-PARTIAL.
The audit closes the question 'what exists and what kind of terminal surface is it?' but does not claim every terminal surface is spatially embodied.

Correct execution order:
Y1 substrate -> S2-S10 structural visual candidate -> structural visual acceptance -> S24-S26 expression.

## 7. Issue field routing

- #405 = single spatial continuation/governance issue.
- PR #424 = active spatial implementation/review vehicle.
- #400 = frontend/product feature grammar.
- #278 = broad product-experience execution ledger.
- #412 = MCP/Capability contract.
- #392 = Seat budget/usage/handoff/scheduler boundary.
- #83 = visual/material direction.
- #427 = post-S26 visual-coherence checkpoint.
- #401 = production Firestore/runtime evidence.
- #360 = residual diagnostics only.
- #204 = trusted GitHub/Firebase UID binding.
- #396 = closed historical construction provenance.

No new micro-issues are required by this audit because none of the five gaps is currently an independent governed spatial implementation field.

## 8. Evidence boundary

This artifact does not claim production deployment, live Firebase/Firestore state, provider execution, human visual acceptance, final polish, or merge authorization.
