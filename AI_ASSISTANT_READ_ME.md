# TeamAi — End-to-End AI Development Journey: `Endorsement → PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → system/tool execution → verification → evidence → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`

This is the operational recovery and continuation entry point for AI Development Team agents working on TeamAi.

## Authority and navigation order

1. `PRODUCT_LAW.md` — canonical product/architecture authority.
2. `MASTERPLAN.md` — chronological plan, checklist, dependencies, and gates.
3. `POLICY.md` — execution constitution and single ORUCAVEAM discipline.
4. `docs/SKILL_WIRING.md` — end-to-end concept → checklist → ORUCAVEAM → field/domain skill → tool → verification map.
5. `skills/**/SKILL.md` — direct operational procedures for the current work class.
6. `PRODUCT-KNOWLEDGE.md` — validated and distilled lessons; read relevant anti-patterns/evidence before repeating work.
7. `docs/project-guide/HandOver.md` — durable continuation and learning handoff.
8. `docs/project-guide/Endorsement.md` — authorized completion and learning acceptance.
9. Domain contracts, implementation, verification evidence, and historical records.

The end-to-end journey is cyclic. An endorsed result becomes the next reliable recovery point: `Endorsement → PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → system/tool execution → verification → evidence → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`.

Do not reconstruct current authority from chat memory when the repository contains the authority.

## Fresh-session bootstrap — assume you know nothing

Every new agent/session MUST treat itself as unfamiliar with TeamAi, even when a prior agent, issue, prompt, or conversation claims to have explained it.

Before meaningful implementation, reconstruct the minimum sufficient project context in this order:

1. `README.md`
2. `PRODUCT_LAW.md`
3. `MASTERPLAN.md`
4. `POLICY.md`
5. `docs/SKILL_WIRING.md`
6. `/AI_ASSISTANT_READ_ME.md`
7. `docs/TEAMAI_CURRENT_STATE.md`
8. the relevant phase/domain contract(s)
9. the applicable governance controls and direct skills
10. relevant implementation roots, verification tests, evidence, `HandOver.md`, and `Endorsement.md`

Then determine the current repository baseline from GitHub itself: current branch/HEAD, latest merged changes, relevant Issue/PR state, relevant workflow/CI state, and current deployment state when applicable.

Do not trust a remembered baseline, an old issue description, a stale PR description, a prior green run, or another agent's conclusion without revalidation against the current repository.

## Current truth reconstruction

For every task distinguish:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

These states are not interchangeable.

A merged authorized change becomes current repository truth. Earlier implementation baselines remain historical unless explicitly superseded.

Issues and PR descriptions are work inputs and historical context, not automatically the highest authority. When an issue is stale relative to merged repository state, use the current repository state while preserving the historical record.

Before changing a canonical concept, inspect its consumers: imports, callers, state readers/writers, contracts, tests, scripts, workflows, deployment surfaces, documentation, and Skills.

## Before any meaningful action

`inspect Product Law → inspect Masterplan → inspect Policy/ORUCAVEAM → resolve applicable ORUCAVEAM skill set → resolve field/domain skills → inspect existing roots/implementation → check known anti-patterns → classify impact → confirm permission → implement smallest canonical change → verify → record evidence → handover/endorsement → update knowledge when learned`

## Mandatory governance preflight — governance, not a skill

Governance is a mandatory execution gate. Skills provide bounded procedures; governance determines whether the change is admissible and whether the repository remains synchronized. Do not treat governance as optional documentation or as something discovered only after CI fails.

Before opening or updating any PR, inspect the changed paths and classify them.

| Changed path | Governance consequence | Required same-PR reconciliation | Mandatory gate |
|---|---|---|---|
| `public/**` | spatial implementation change | `MASTERPLAN.md` + `docs/TEAMAI_029_CURRENT_STATE_MAP.md` + `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` | `governance-drift` |
| `skills/frontend/spatial/**` | spatial implementation change | `MASTERPLAN.md` + `docs/TEAMAI_029_CURRENT_STATE_MAP.md` + `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` | `governance-drift` |
| `backend/**` | backend implementation change | `MASTERPLAN.md` + `docs/TEAMAI_029_CURRENT_STATE_MAP.md` + `backend/BACKEND_LIVE_SERVICE_STATUS.md` | `governance-drift` |
| `supabase/**` | backend implementation change | `MASTERPLAN.md` + `docs/TEAMAI_029_CURRENT_STATE_MAP.md` + `backend/BACKEND_LIVE_SERVICE_STATUS.md` | `governance-drift` |
| `skills/**` | Skills change | `docs/SKILL_WIRING.md` + `MASTERPLAN.md` | `governance-drift` |

This path-triggered table is an agent preflight rule. The complete governance procedure remains in `skills/governance/active-index-coupling/SKILL.md`, but the agent MUST know to invoke it from the changed-path classification rather than waiting for CI feedback.

### Mandatory pre-PR sequence

1. List every changed path.
2. Detect all affected governance fields; a PR may affect more than one.
3. Load the required governance control(s), especially `skills/governance/active-index-coupling/SKILL.md` for `public/`, spatial frontend, backend, Supabase, or Skills changes.
4. Read every required index before finalizing the implementation.
5. Preserve the full `MASTERPLAN.md`; never truncate it to satisfy a payload or validator.
6. Keep historical evidence immutable.
7. Run the repository governance validator locally when possible:
   `node scripts/governance/verify-active-index.mjs --mode=governance --base="origin/main"`
8. Open/update the PR only after the required governance reconciliation is present.
9. Require `governance-drift = PASS` and `evidence-consistency = PASS` before merge readiness.
10. Do not interpret unit tests, Playwright, deployment, or a green non-governance job as a substitute for governance gates.

### Fail-closed behavior

The repository's governance workflow runs `governance-drift` and `evidence-consistency` before `agent-validation`. If either gate fails, downstream agent validation is not allowed to proceed.

Therefore:

`governance failure → agent-validation skipped → merge blocked`

Never weaken, bypass, disable, or rewrite a validator merely to make a PR green. If the product requirement has legitimately changed, update the canonical contract and validator with equal or stronger specificity through the appropriate authorized path.

## Verification is a layered contract

Verification must be selected from the claim being made, not from habit.

Use the smallest sufficient stack that actually proves the claim:

`static/syntax → unit/domain/contract → governance → integration → build/package → deterministic browser → deployed browser → authoritative backend/provider evidence → owner acceptance`

A successful test proves only the behavior it exercised.

A browser test does not prove durable backend authority unless it actually verifies that authority.

A screenshot proves only what is visually observable.

A green CI run proves only the jobs that ran and passed for that commit.

A green deployment proves deployment, not complete product correctness.

C9/product acceptance is a human/product gate and is not satisfied by green CI or Playwright alone when the governing product contract requires owner acceptance.

Never claim evidence broader than the evidence actually collected.

## Validation / evidence routing

For common TeamAi work classes, use these routes:

| Work class | Primary validation | Evidence boundary |
|---|---|---|
| Product/architecture change | authority + discrepancy review | Product Law / approved contract + HandOver/Endorsement |
| `public/**` or spatial change | governance + focused tests + browser when behavior is UI/runtime | required spatial indexes + CI governance + actual browser evidence |
| `backend/**` or `supabase/**` | governance + backend/contract tests + authoritative runtime evidence as applicable | backend indexes + direct service evidence |
| `skills/**` | governance + Skill wiring validation + relevant execution proof | `docs/SKILL_WIRING.md` + Masterplan + Skill evidence |
| browser-facing behavior | deterministic Playwright | exercised browser path only |
| project package/handover | package validator | extracted-path and byte/hash equality |
| learned reusable procedure | evidence + learning/endorsement | `HandOver.md` → applicable Skill / this file → `PRODUCT-KNOWLEDGE.md` when validated |

## Product Law change rule

When the user adds or changes a feature, read the existing `PRODUCT_LAW.md` logic first. Amend the existing canonical concept when applicable instead of appending a duplicate. Inspect affected consumers and skills. Warn the user before proceeding when the request introduces a discrepancy with an existing protected root, canonical rule, contract, permission boundary, or authority.

Use `skills/governance/product-law-change/SKILL.md` together with the applicable ORUCAVEAM skills.

## Masterplan and skill wiring

Every executable Masterplan checklist item must resolve through `docs/SKILL_WIRING.md` to the applicable ORUCAVEAM letter skills plus relevant field/domain/tool skills, or an explicit no-skill rationale.

A checklist item is not fully wired merely because it names a domain. The concrete procedure must resolve to an existing direct skill, or the required skill must be proposed/updated before the item is considered executable.

Use `skills/governance/masterplan-skill-wiring/SKILL.md`.

## Execution discipline — ORUCAVEAM

ORUCAVEAM is the single execution-discipline framework. It is an integrated sequence containing **M — Minimalistic Efficiency / Resource Use** as its final dimension. There is no separate O-R-U-C-A-V-E-A lifecycle or secondary execution framework.

`O — Objective → R — Restrictions → U — User Authority → C — Canonical Authority → A — Action → V — Verification → E — Efficiency → A — Audit → M — Minimalistic Efficiency / Resource Use`

Each letter resolves to one or more small direct execution skills under `skills/execution/orucaveam/`, except **M**, which resolves to the existing reusable `skills/tools/minimal-tool-usage/SKILL.md` because that tool/resource procedure already provides the required bounded operation.

Use `skills/execution/orucaveam/SKILL.md` first, then resolve only the applicable letter and domain skills needed for the bounded action.

## Permission to proceed

A skill never creates permission. Permission comes from direct user authorization, an approved Masterplan item within scope, or a permitted policy-defined routine that remains inside its recorded scope. Changes to Product Law, protected canonical roots, destructive history, security/authorization boundaries, entitlement, or other high-impact architecture require the appropriate approval/reconciliation gate.

## Code-to-code execution requirement

For every non-trivial change, trace the actual causal path instead of relying on filenames or documentation alone:

`user-visible behavior → route/entry → event → state → function/module → contract → API/backend → durable state → provider/external system → verification`

For build/assembly systems also trace:

`source module → assembly/build script → committed artifact → browser runtime`

Inspect imports, callers, readers, writers, scripts, workflows, tests, documentation, deployment surfaces, and active Skills that consume or describe the changed concept.

Look specifically for duplicate authorities, stale aliases, shadow state, parallel runtimes, duplicate UI surfaces, misleading names, dead compatibility paths, missing tests, false-positive tests, and authority leakage.

## Issue and PR operating rule

Issues are work inputs, not supreme authority.

Before implementing an Issue:

1. Read the Issue and relevant comments.
2. Separate requirements from historical discussion and observations.
3. Map each requirement to Product Law and Masterplan state.
4. Check current merged repository state.
5. Check related merged/superseded/open PRs.
6. Map each remaining item to the applicable field/domain and governance controls.
7. Verify that the requested work has not already landed under another PR.

Do not reopen retired behavior or duplicate already-merged work without new evidence and authorization.

## Learning and teach-back

When an agent discovers a better, safer, clearer, more accurate, or more efficient approach, do not bury it in chat. Tie it to the executed checklist and evidence, capture it in `HandOver.md`, obtain the appropriate endorsement, then update the affected Skill and/or this file. Promote to `PRODUCT-KNOWLEDGE.md` only when validated. Propose a ToolKit upstream lesson only after generalization is demonstrated.

An improved procedure belongs in the relevant Skill when it is reusable and bounded. This file remains the practical recovery/memory layer and must not become a second policy or product authority.

Use `skills/governance/learning-handover/SKILL.md`.

## Canonical service boundaries

- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current TeamAi web delivery authority.
- GitHub Pages = validation-only static browser surface; it may publish the canonical `frontend/spatial` UI for human/browser verification but is not a second TeamAi source, backend, commerce, scheduler, or production-web authority.
- Vercel = controlled web development, preview, and browser-verification surface; not TeamAi source, domain-state, backend, commerce, or scheduler authority.

The authoritative Firebase project is `team-ai-official`.

## Hierarchy runtime (029 presentation)

In-machine parent/open work (Seat shell, later domain gears) must load `skills/frontend/spatial/hierarchy-runtime/SKILL.md`. **Documentation holds numbers** in `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9. Do not invent a private altitude/duration table. Seat shell v1 uses `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`. This is not a Hero lighting skill and not a second theme root.

## GitHub branch and deployment guard

The default branch is protected by the repository ruleset and must not be bypassed. The development team must preserve the repository's PR-based progression and deployment gate.

For live browser validation, GitHub Pages is configured with **Source = GitHub Actions**. A dedicated Pages workflow may publish `frontend/spatial` under the project route `/spatial/` without moving or duplicating the canonical HTML. The intended publication shape is `dist/spatial/index.html`, preserving the existing application route.

When a protected/default-branch ruleset requires a successful deployment, do not disable or bypass the rule to make a change. Resolve the required Pages deployment through the normal PR/deployment path, then collect real deployment and browser evidence. Treat a ruleset that is marked Active but targets zero branches/resources as not effectively protecting the intended branch; ensure the intended target is configured.

A successful GitHub Pages deployment is deployment evidence only. It does not replace deterministic Playwright CI evidence, backend verification, or Product Law authority. Do not treat a prior green Pages deployment as proof of current correctness.

## Browser verification

When a real browser is required, use deterministic Playwright verification. For human validation, use the current GitHub Pages `/spatial/` deployment when available. Do not invent UI selectors for UI that does not yet exist. A browser pass proves only the exercised scope. Generated screenshots are not canonical evidence.

Use `skills/verification/browser-smoke/SKILL.md` and applicable ORUCAVEAM verification/audit skills.

## Packaging

The Full Project ZIP is a derived project-state package. It must be produced from a pinned canonical repository tree and verified by extracted-path and file-byte/hash equality. It never becomes a second source authority.

Use `skills/packaging/project-package/SKILL.md` with applicable ORUCAVEAM skills, especially verification, audit, efficiency, and M.

## Automated agent operating contract

Automated agents must use the repository as their durable operating context. The automation prompt is not a replacement for TeamAi authority; it is a dispatcher into this file and the authority chain above.

For every fresh or resumed automation session:

1. Bootstrap from the current repository, never from task memory alone.
2. Re-establish current HEAD, branch, merged baseline, relevant Issue/PR state, workflow state, and deployment state.
3. Read the relevant canonical documents and applicable governance controls before changing anything.
4. Resolve Skills only after the affected field/domain is known.
5. Apply ORUCAVEAM to the bounded action.
6. Trace the implementation code-to-code and consumer-by-consumer.
7. Make the smallest coherent authorized change.
8. Run focused verification, then all mandatory governance/CI checks for the touched field.
9. Inspect the final diff for scope, authority, historical integrity, and evidence accuracy.
10. Record a durable handover with current baseline, what changed, what was proven, limitations, and the next authorized action.

Automated agents must not interpret a prompt such as “fix Issue #N” as authorization to skip project bootstrap, governance preflight, Skill resolution, dependency analysis, or verification.

## Agent start checkpoint

Before meaningful code/document changes, establish:

```text
CURRENT BASELINE
CURRENT AUTHORITY
TASK OBJECTIVE
IMPACTED FIELD(S)
GOVERNANCE CONTROLS
APPLICABLE SKILLS
AFFECTED IMPLEMENTATION ROOTS
DEPENDENCIES / CONSUMERS
RESTRICTIONS
AUTHORIZATION BASIS
VERIFICATION PLAN
EXPECTED EVIDENCE
KNOWN UNCERTAINTIES
```

If any high-impact authority, permission, canonical owner, or required governance rule is unclear, stop the affected path and reconcile it rather than guessing.

## Agent completion checkpoint

Report and preserve:

```text
WHAT CHANGED
WHY IT IS CANONICAL
FILES / ROOTS AFFECTED
GOVERNANCE CHECKS
SKILLS USED
TESTS / VALIDATION RUN
ACTUAL RESULTS
EVIDENCE BOUNDARY
LIMITATIONS
REMAINING WORK
CURRENT BASELINE / COMMIT
NEXT AUTHORIZED ACTION
```

Do not call a task “fixed”, “complete”, “accepted”, “production-ready”, or “released” unless the available evidence supports that exact state.

## Cross-session recovery

Assume sessions can terminate or switch agents at any time.

On resume:

`current GitHub truth → current docs → current handover → current PR/Issue/workflow state → revalidate assumptions → continue only from authorized current state`

Do not assume the previous agent's memory, local workspace, CI result, deployment, or conclusion remains current.

## Recovery rule

Preserve current authority, unresolved limitations, evidence boundaries, and next authorized action across sessions. A previous green deployment or AI answer is not proof of current correctness. Distinguish planned, implemented, verified, runtime-proven, completed, and generalized states.
