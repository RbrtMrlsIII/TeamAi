---
name: active-index-coupling
description: Use before any PR that changes public/, backend/, supabase/, or skills/ — enforces canonical index sync, forbids MASTERPLAN truncation, fail-closed governance drift, and 3D Hero tree-census synchronization when spatial structure changes.
---

# Active-index coupling (execution guide)

## WHEN TO USE

Use **before coding ends and before push/PR** whenever the change set touches any of:

| Implementation root | Coupling class |
|---------------------|----------------|
| `public/` | **spatial** |
| `skills/frontend/spatial/` | **spatial** |
| `backend/` | **backend** |
| `supabase/` | **backend** |
| `skills/` (any skill path) | **skills** |

Also use when repairing a **governance-drift** CI failure from `scripts/governance/verify-active-index.mjs`.

For spatial work, additionally determine whether the change affects the semantic 3D Hero tree/branch/division model. If it does, the tree census is a required synchronized design/recovery surface.

## AUTHORITY

- Gate script: `scripts/governance/verify-active-index.mjs`
- Manifest: `.github/teamai/execution-state.yml`
- Indexes (spatial): `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- Indexes (backend): those plus `backend/BACKEND_LIVE_SERVICE_STATUS.md` when backend roots change
- Indexes (skills): `docs/SKILL_WIRING.md` + `MASTERPLAN.md`
- Spatial tree census: `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`, `.json`, `.md`, `.xml`
- Product/execution: `PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md` / ORUCAVEAM

A skill does not authorize skipping the gate.

## SCOPED FIELDS (what must change together)

### Spatial field

**If** any path under `public/` or `skills/frontend/spatial/` is added/modified in the PR:

**Then** the PR diff **must include all** of:

1. `MASTERPLAN.md`
2. `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
3. `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`

Minimal honest update is enough (frontier residual note, claim marker consistency, what landed / what remains). Do not invent a new product law.

#### Spatial tree-census subrule

**If** the change adds, removes, renames, materially restructures, or reimplements any 3D Hero `treeID`, `branchId`, division, tree payload, expansion model, connection point/path, or semantic tree presentation behavior:

**Then** the PR must also reconcile all four census representations in the same governed change:

1. `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`
2. `docs/TEAMAI_3D_HERO_TREE_CENSUS.json`
3. `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
4. `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`

The census update must be limited to demonstrated truth. A tree or branch stays provisional/partial/pending when its semantics, payload, geometry, expansion, connection topology, runtime behavior, or verification are incomplete.

This census requirement is a **governance synchronization rule**, not permission to bypass the active-index gate and not a new product authority.

### Backend field

**If** any path under `backend/` or `supabase/` changes:

**Then** the PR diff **must include all** of:

1. `MASTERPLAN.md`
2. `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
3. `backend/BACKEND_LIVE_SERVICE_STATUS.md`

### Skills field

**If** any path under `skills/` changes:

**Then** the PR diff **must include all** of:

1. `docs/SKILL_WIRING.md` (concrete skill path row)
2. `MASTERPLAN.md` (wiring/recovery surface stays current)

### Freshness (all fields)

Index files in the PR must not be **older** than the implementation files they cover (`assertFresh`). Prefer **one commit** or a final commit that touches indexes **after** or **with** the code change.

The census representations are subject to the same freshness principle when they describe changed spatial tree structure. Do not land code that claims a newer tree/branch state while leaving the census on an older state.

## MASTERPLAN RULES (hard)

1. **Never truncate.** Restoring or editing `MASTERPLAN.md` means **full body from `main`** (or current branch tip), then **only** the intended residual/frontier lines.
2. **Preserve** at least:
   - endorsement line: `**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.`
   - spatial frontier needle: `Vision V3.5 complete` (until a deliberate frontier change updates the validator)
   - **TEAM-EXPERIENCE-029 — Spatial Theme and Visual System** section (checklist, skill-routing table, open questions, root-wiring guard)
3. **Do not** replace the Spatial Theme block with a one-paragraph summary.
4. Payload limits / partial tool writes are **not** an excuse. If the agent cannot push the full file, **stop** and hand the operator a one-line patch script — do not ship a short MASTERPLAN.
5. The tree/machine vision belongs as **conceptual product context** in the appropriate canonical vision/contract material; do not create a second Masterplan checklist to mirror the tree census.

## ACTION (agent checklist)

Before opening or updating a PR:

1. List paths changed under the implementation roots above.
2. Map to **spatial** / **backend** / **skills** (a PR may hit more than one).
3. Open every required index file; apply the **smallest** accurate status note.
4. For any spatial tree/branch/division change, open the census representations and reconcile them to the actual semantic/runtime state.
5. For `MASTERPLAN.md`: start from full current text; edit only the active-state / frontier sentences needed.
6. Confirm claim HTML markers in state map / next slices still match `.github/teamai/execution-state.yml` when claims are involved.
7. Run locally when possible: `node scripts/governance/verify-active-index.mjs --mode=governance` with base `origin/main`.
8. Only then push.

## WHEN NOT FOLLOWED (what happens)

| Failure | CI / gate behavior |
|---------|-------------------|
| Missing required index in PR diff | **governance-drift FAIL** — `implementation changed without required index updates: …` |
| MASTERPLAN missing endorsement or `Vision V3.5 complete` needle | **governance-drift FAIL** — stale MASTERPLAN |
| Indexes older than code in the same branch | **governance-drift FAIL** — active indexes older than implementation |
| Spatial tree/branch/division change without census reconciliation | **governance-drift FAIL / required governance review** — tree truth and implementation diverge |
| Historical evidence rewritten | **governance-drift FAIL** — historical existing evidence is immutable |
| Governance fails | **agent-validation SKIPPED** (fail-closed); merge blocked under gate **#133** |

This is intentional. The system fails **closed** so bookkeeping gaps and silent knowledge loss do not merge.

## DO NOT

- Ship `public/` (or spatial skill) changes without the three spatial indexes in the **same** PR.
- Ship a semantic tree/branch/division change without reconciling the four census representations.
- Truncate or summarize away MASTERPLAN sections to fit a tool payload.
- Treat green unit/Playwright tests as a substitute for governance-drift PASS.
- Upgrade claim markers (e.g. SPATIAL-V3.5) without matching evidence and manifest state.
- Rewrite files under `docs/evidence/` or historical HandOver/Endorsement paths.
- Claim **029-released** from a residual or index-sync PR.
- Create a second WebGL runtime, second theme root, or second settings island while fixing docs.
- Use this governance control to bypass Product Law or invent backend authority from the Hero.
- Treat prototype coordinates, branch heights, or current camera timing as universal tree geometry/animation law.
- Treat a visible mesh or selector as proof that a tree/branch is semantically complete.

## PASS

- Every touched implementation root has its full required index set in the PR diff.
- Every affected spatial tree/branch/division change has synchronized census representations.
- `MASTERPLAN.md` is full-length relative to `main` plus only intended residual lines.
- `node scripts/governance/verify-active-index.mjs` reports PASS for governance mode against `origin/main`.
- No historical evidence mutation; no 029-released claim.

## EVIDENCE

- PR file list includes required indexes for the field(s) touched.
- PR census files agree on semantic tree state when tree structure changed.
- CI job **governance-drift** = success.
- Optional local log of `verify-active-index.mjs --mode=governance`.

## SEE ALSO

- `scripts/governance/verify-active-index.mjs`
- `.github/teamai/execution-state.yml`
- `docs/SKILL_WIRING.md`
- `skills/governance/masterplan-skill-wiring/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
