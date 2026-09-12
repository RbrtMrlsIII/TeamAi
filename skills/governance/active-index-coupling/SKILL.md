---
name: active-index-coupling
description: Use before any PR that changes public/, backend/, supabase/, or skills/ — enforces canonical index sync, forbids MASTERPLAN truncation, fail-closed governance drift, and separates issue-body authority from comment evidence.
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

## AUTHORITY

- Gate script: `scripts/governance/verify-active-index.mjs`
- Manifest: `.github/teamai/execution-state.yml`
- Indexes (spatial): `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- Indexes (backend): those plus `backend/BACKEND_LIVE_SERVICE_STATUS.md` when backend roots change
- Indexes (skills): `docs/SKILL_WIRING.md` + `MASTERPLAN.md`
- Product/execution: `PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md` / ORUCAVEAM

A skill does not authorize skipping the gate.

## ISSUE BODY / COMMENT AUTHORITY

The **active Issue body is the durable guide for an Issue**. Put product truth, scope, requirements, acceptance conditions, dependency relationships, warnings that must govern future work, and the execution contract in the Issue body itself.

**Issue comments are evidence records, not guidance documents.** A new comment may contain only:

1. agent diagnosis output;
2. real data actually observed or retrieved, with the baseline/date/commit needed to interpret it;
3. explicit warnings or discrepancies discovered during that observation;
4. a record of a slice that was actually executed, clearly labeled **EXECUTED** or equivalent.

A comment must **not** contain a checklist, implementation plan, recommended next-slice queue, "do this next" instructions, acceptance checklist, or a claim that an executed slice is **PROVEN**. Proof state belongs to the evidence/validation record and current Issue/PR state, not to the word "executed".

Historical comments are immutable evidence. Do not rewrite old comments solely to make them conform to the new format. Treat their instructions, plans, or stale conclusions as historical context only. Transfer any still-current guidance into the active Issue body and record the correction in a new evidence-only comment.

## SCOPED FIELDS (what must change together)

### Spatial field

**If** any path under `public/` or `skills/frontend/spatial/` is added/modified in the PR:

**Then** the PR diff **must include all** of:

1. `MASTERPLAN.md`
2. `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
3. `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`

Minimal honest update is enough (frontier residual note, claim marker consistency, what landed / what remains). Do not invent a new product law.

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

## Freshness (all fields)

Index files in the PR must not be **older** than the implementation files they cover (`assertFresh`). Prefer **one commit** or a final commit that touches indexes **after** or **with** the code change.

## MASTERPLAN RULES (hard)

1. **Never truncate.** Restoring or editing `MASTERPLAN.md` means **full body from `main`** (or current branch tip), then **only** the intended residual/frontier lines.
2. **Preserve** at least:
   - endorsement line: `**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.`
   - spatial frontier needle: `Vision V3.5 complete` (until a deliberate frontier change updates the validator)
   - **TEAM-EXPERIENCE-029 — Spatial Theme and Visual System** section (checklist, skill-routing table, open questions, root-wiring guard)
3. **Do not** replace the Spatial Theme block with a one-paragraph summary.
4. Payload limits / partial tool writes are **not** an excuse. If the agent cannot push the full file, **stop** and hand the operator a one-line patch script — do not ship a short MASTERPLAN.

## ACTION (agent checklist)

Before opening or updating a PR:

1. List paths changed under the implementation roots above.
2. Map to **spatial** / **backend** / **skills** (a PR may hit more than one).
3. Open every required index file; apply the **smallest** accurate status note.
4. For `MASTERPLAN.md`: start from full current text; edit only the active-state / frontier sentences needed.
5. Confirm claim HTML markers in state map / next slices still match `.github/teamai/execution-state.yml` when claims are involved.
6. Run locally when possible: `node scripts/governance/verify-active-index.mjs --mode=governance` with base `origin/main`.
7. Only then push.

## WHEN NOT FOLLOWED (what happens)

| Failure | CI / gate behavior |
|---------|-------------------|
| Missing required index in PR diff | **governance-drift FAIL** — `implementation changed without required index updates: …` |
| MASTERPLAN missing endorsement or `Vision V3.5 complete` needle | **governance-drift FAIL** — stale MASTERPLAN |
| Indexes older than code in the same branch | **governance-drift FAIL** — active indexes older than implementation |
| Historical evidence rewritten | **governance-drift FAIL** — historical existing evidence is immutable |
| Governance fails | **agent-validation SKIPPED** (fail-closed); merge blocked under gate **#133** |

This is intentional. The system fails **closed** so bookkeeping gaps and silent knowledge loss do not merge.

## DO NOT

- Ship `public/` (or spatial skill) changes without the three spatial indexes in the **same** PR.
- Truncate or summarize away MASTERPLAN sections to fit a tool payload.
- Treat green unit/Playwright tests as a substitute for governance-drift PASS.
- Upgrade claim markers (e.g. SPATIAL-V3.5) without matching evidence and manifest state.
- Rewrite files under `docs/evidence/` or historical HandOver/Endorsement paths.
- Rewrite historical Issue comments solely to satisfy the new comment format.
- Put active guidance, checklists, or next-step instructions in new Issue comments.
- Mark an executed slice as **PROVEN** merely because it ran or merged.
- Claim **029-released** from a residual or index-sync PR.
- Create a second WebGL runtime, second theme root, or second settings island while fixing docs.
- Use this skill to bypass Product Law or invent backend authority from the Hero.

## PASS

- Every touched implementation root has its full required index set in the PR diff.
- `MASTERPLAN.md` is full-length relative to `main` plus only intended residual lines.
- `node scripts/governance/verify-active-index.mjs` reports PASS for governance mode against `origin/main`.
- New Issue guidance resides in the Issue body, not in comments.
- New comments are evidence-only and do not contain checklists or proof claims for executed work.
- No historical evidence mutation; no 029-released claim.

## EVIDENCE

- PR file list includes required indexes for the field(s) touched.
- CI job **governance-drift** = success.
- Optional local log of `verify-active-index.mjs --mode=governance`.

## SEE ALSO

- `scripts/governance/verify-active-index.mjs`
- `.github/teamai/execution-state.yml`
- `docs/SKILL_WIRING.md`
- `skills/governance/masterplan-skill-wiring/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
- `docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md` (example residual that must obey this skill)
