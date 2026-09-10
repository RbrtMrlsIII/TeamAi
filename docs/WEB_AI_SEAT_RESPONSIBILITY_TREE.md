# WebAi Seat — Responsibility Unit Tree (H-T1)

**Status:** PLANNING CONTRACT / structure guide · **not** Product Law amendment  
**Issue:** [#256](https://github.com/RbrtMrlsIII/TeamAi/issues/256)  
**Authority:** `PRODUCT_LAW.md` (skills ≠ authorization) · `docs/WEB_AI_SEAT_TOOLKIT_BOUNDARY.md` (#254) · Hierarchy Runtime Baseline · LAW 109  
**No 029-released claim.** Hero faces remain **presentation only**.

## 1. Objective (ORUCAVEAM-O)

Define a **small, stable catalog of responsibility units (RUs)** so hierarchy growth means **allocating work**, not duplicating the universal skill library. Map each RU to existing Hero parts and seat/workspace skill kinds **without** inventing new `HIERARCHY_PART` IDs in this slice.

## 2. Restrictions (R)

- Do not grant durable permission, GitHub write, or entitlement from an RU or Hero open state.
- Do not treat Agent count as a reason to fork skill definitions.
- Do not add commerce SKUs as hierarchy children.
- Do not make ToolKit or SEAT_SKILLS mandatory in the Hero.
- Numbers stay in `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9 only.
- Prefer **reuse** of `SEAT_SHELL_V1_CHILDREN` faces over new part IDs.

## 3. Seat model (from #254)

```text
WebAi seat =
  responsibility boundary
  + applicable skill bundle
  + workspace governance
  + project adaptation
  + current Agent capacity
```

**Agent capacity rule:** fewer Agents may carry several RUs; more Agents partition the same RUs. Underlying skill definitions stay shared.

**Load rule:** smallest sufficient skill bundle for project, field, phase, task/domain, provider/runtime, tools, and policy. Skills instruct; policy authorizes.

## 4. Responsibility unit catalog

| RU ID | Responsibility | Primary Hero face (reuse) | Typical SEAT_SKILLS (examples) | WORKSPACE_SKILLS touch? | Agent isolation default |
|-------|----------------|---------------------------|--------------------------------|-------------------------|-------------------------|
| `RU-IDENTITY` | Who is acting; account/session orientation | (domain / shell — not a seat child) | — | `ws.authority.map` | Shareable |
| `RU-CONNECTION` | External connection health + bind handoff | `SEAT_CONNECTION` (+ health leaf) | connection-test procedures | `ws.secrets.boundary`, `ws.tools.github` | Prefer dedicated when live keys |
| `RU-PROVIDER` | Provider key bind, probe, model choice | `SEAT_CONNECTION` / capabilities presentation | provider bind procedures | `ws.secrets.boundary` | Prefer dedicated |
| `RU-BEHAVIOR` | How the seat participates in turns | `SEAT_BEHAVIOR` | `seat.planning.*`, turn defaults | `ws.turn.defaults` | Shareable |
| `RU-TOOLKIT` | Optional seat skill equip (not commerce) | `SEAT_TOOLKIT` | field bundles below | — | Shareable |
| `RU-CODING` | Implementation / coding work | `SEAT_TOOLKIT` → field coding | `seat.work.coding`, `seat.field.frontend` / `backend` / `integration` | `ws.contribution.flow` | Often dedicated |
| `RU-DOCS` | Documentation / continuity writing | `SEAT_TOOLKIT` | `seat.field.docs` | `ws.evidence.handover` | Shareable |
| `RU-VERIFY` | Verification / QA discipline | `SEAT_TOOLKIT` / task face | `seat.field.verification` | `ws.evidence.handover` | Shareable or pair with coding |
| `RU-COORD` | Multi-seat coordination | `SEAT_BEHAVIOR` / workspace | `seat.coord.leader` | `ws.authority.map` | Often dedicated when many seats |
| `RU-CAPABILITIES` | Mechanism inventory (what *can* run) | `SEAT_CAPABILITIES` | — | — | Shareable |
| `RU-AUTHORIZATION` | Permitted control **presentation** (not grant) | `SEAT_AUTHORIZATION` | — | `ws.authority.map` | N/A (display) |
| `RU-SCOPE` | Workplace / project scope presentation | `SEAT_WORKSPACE_SCOPE` | — | workspace equip | Shareable |
| `RU-EVIDENCE` | Task / evidence continuity | `SEAT_TASK_EVIDENCE` | verification + handover procedures | `ws.evidence.handover` | Shareable |
| `RU-GOVERNANCE` | Project rules (workspace tree, not seat child) | `WORKSPACE_ZIPSKILLS` (R0) | — | all `ws.*` kinds | Workspace-owned |
| `RU-COMMERCE` | Entitlement / billing **gated** | Settings / commerce UI — **not** Hero seat mandatory child | — | — | Isolate; Product Law commerce boundary |

### Seat field skills (under RU-TOOLKIT / RU-CODING)

| Skill folder | Maps toward |
|--------------|-------------|
| `seat.field.frontend` | Frontend implementation RU-CODING |
| `seat.field.backend` | Backend implementation RU-CODING |
| `seat.field.integration` | Integration RU-CODING |
| `seat.field.docs` | RU-DOCS |
| `seat.field.verification` | RU-VERIFY |
| `seat.work.coding` | RU-CODING core |
| `seat.planning.discuss` / `summarize` | RU-BEHAVIOR |
| `seat.coord.leader` | RU-COORD |

## 5. Map to Hero shell children (no new parts)

Canonical order remains:

```text
Seat Shell (one open parent)
├── SEAT_CONNECTION      ← RU-CONNECTION, RU-PROVIDER (handoff)
├── SEAT_BEHAVIOR        ← RU-BEHAVIOR, RU-COORD (presentation)
├── SEAT_TOOLKIT         ← RU-TOOLKIT, RU-CODING, RU-DOCS, RU-VERIFY (optional equip)
├── SEAT_CAPABILITIES    ← RU-CAPABILITIES
├── SEAT_AUTHORIZATION   ← RU-AUTHORIZATION (display only)
├── SEAT_WORKSPACE_SCOPE ← RU-SCOPE
└── SEAT_TASK_EVIDENCE   ← RU-EVIDENCE
```

`WORKSPACE_ZIPSKILLS` / R0 stays on the **workspace tree** → `RU-GOVERNANCE`.

## 6. Two-Agent vs N-Agent allocation (examples)

| Agents | Example partition |
|--------|-------------------|
| **1** | One Agent carries CONNECTION + CODING + VERIFY + EVIDENCE (smallest bundle still applies) |
| **2** | Agent A: CONNECTION + PROVIDER + CODING; Agent B: VERIFY + DOCS + EVIDENCE |
| **3+** | Split CODING fields (frontend/backend); keep GOVERNANCE on workspace; avoid duplicating skill definitions |

Scaling changes **who holds which RU**, not the RU catalog itself.

## 7. Equip chain (unchanged product order)

```text
Identity (Firebase)
  → optional GitHub Connection (Conn-3; normal UI — not Hero C)
  → WORKSPACE_SKILLS (RU-GOVERNANCE)
  → Seat + SEAT_SKILLS (RU-* on seat)
  → optional connection on seat scope
  → capability / health / authorization / scheduler
  → usable turn
```

Reason states remain:  
`available → configured → entitled → compatible → authorized → scoped → seat-allowed → healthy → usable`

## 8. Deferred (explicit)

| Item | Why deferred |
|------|----------------|
| H-T2 Toolkit child meshes/stubs under `SEAT_TOOLKIT` | Structure catalog first |
| H-T3 Domain multi-seat tree plate | After RU vocabulary stable |
| Runtime effective-skill resolver | TEAM-BACKEND-001 |
| New `HIERARCHY_PART` IDs | Not required for H-T1 |
| Conn-3 browser proof | Parallel operator track |
| Visual polish / materials | After hierarchy structure complete (#256) |

## 9. Verification (V)

- [ ] Every RU maps to an existing face or an explicit non-Hero surface
- [ ] No RU invents billing as a seat child
- [ ] Agent examples do not redefine skills
- [ ] Pointers from boundary + skill-kinds docs
- [ ] CI docs-only PR green under #133

## 10. See also

- Issue **#256** (hierarchy trees guide)
- `docs/WEB_AI_SEAT_TOOLKIT_BOUNDARY.md`
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`
- `docs/backend/WEB_AI_SKILL_INHERITANCE_CANONICAL.md`
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`
- `public/hero-hierarchy-runtime.js` (`SEAT_SHELL_V1_CHILDREN`)
- `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`
- `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
