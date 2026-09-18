# SKILL_WIRING — active routing map

**Role:** routing only. It does not define Product Law, chronology, acceptance, or permission.

The repository has **one single skills tree**: `skills/**/SKILL.md`. Skills are reusable procedures only; they are never a source of Product Law, permission, identity, scheduler, entitlement, durable-state, or merge authority.

## Authority path

`Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → this map → applicable Skill(s) → owning Issue → PR → implementation → verification/evidence → AI_ASSISTANT_READ_ME.md`

## Development fields

| Field | Primary Skill family | Main verification |
|---|---|---|
| Product & Governance | `skills/governance/**` + ORUCAVEAM | governance validators |
| Backend & Runtime | `skills/backend/**` | backend/runtime verification |
| Frontend & Experience | `skills/frontend/**` | tests + browser verification |
| Integration & Contracts | applicable backend/frontend contract Skills | contract/integration tests |
| Verification & CI/Browser | `skills/verification/**` | CI/browser/evidence |
| Documentation, Knowledge & Session | `skills/governance/learning-handover/**` + synchronization | synchronization/audit |
| Recovery, History & Reconciliation | applicable recovery/workspace Skills | recovery verification |
| Delivery & Operations | applicable delivery/tool Skills | delivery verification |

## Governance routing

- Repository synchronization: `skills/governance/repository-synchronization/SKILL.md`
- User-directed validation changes: `skills/governance/user-directed-validation/SKILL.md`
- Product Law change: `skills/governance/product-law-change/SKILL.md`
- Masterplan/Skill routing: `skills/governance/masterplan-skill-wiring/SKILL.md`
- Machine builder: `skills/governance/machine-builder/SKILL.md`
- Learning/session continuity: `skills/governance/learning-handover/SKILL.md`
- Shared model-assisted PR review: `skills/governance/ai-advisory-review/SKILL.md`
- Nemotron-specific review/approval boundary: `skills/governance/nemotron-copilot-review/SKILL.md`

Governance Skills are procedures only. They cannot authorize an action outside Product Law, Policy, repository permissions, or the owning Issue/PR contract.

## Validation lifecycle routing

Draft PRs continue substantive validation. Governance Integrity, evidence consistency, agent validation, Full-System, Security, and applicable Browser/Runtime evidence remain active against the exact PR head. `review-readiness` may be skipped on Draft by lifecycle design.

Ready-for-review PRs retain current exact-head substantive evidence and additionally enter `review-readiness`, which evaluates review/authorization conditions. Submitted or dismissed human review events may re-trigger that same exact-head evaluation. While an independent human approval for the exact current head is absent, `review-readiness` remains pending rather than failing. Merge candidates require current passing required checks and normal review/merge authorization.

A downstream **skipped** job is never a passing validation. Recovery must inspect the controlling upstream job and exact current head.

### Advisory reviewer execution gate

The reusable advisory-review runner is downstream of the substantive validator set. For every invocation it polls the exact PR head and accepts only successful completion of the required exact-head check-runs before invoking the external model. The packet receives current governing-file context, the owning Issue state, exact-head execution evidence, and the complete bounded diff.

A reusable runner transport/parser repair is a Verification & CI/Browser implementation concern. It must be proven by fresh exact-head execution after the repaired path is governed and merged; static route declarations and green non-provider validators are not sufficient provider runtime evidence.

### Automatic reviewer sequence

The automatic review lifecycle is one ordered three-stage cohort sequence, not a matrix:

`Nemotron Ultra → 2 minutes 30 seconds → Ling 3.0 Flash + Poolside → 2 minutes 30 seconds → Laguna + Dots3-Note Preview`

There is no automatic interval before Nemotron. Nemotron is the frontline reviewer and starts only after the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event has passed the substantive exact-head validation gate.

After Nemotron reaches a `success` or `failure` execution result, a 150-second barrier precedes the second-stage pair. A `skipped` or `cancelled` Nemotron job does not open that barrier. Ling 3.0 Flash and Poolside then execute concurrently against the same original triggering head. Their dependent jobs explicitly use `always() && needs.delay_to_second_stage.result == 'success'` so GitHub's implicit upstream-success behavior cannot suppress an allowed failure cohort.

After both second-stage reviewers reach a `success` or `failure` execution result, a second 150-second barrier precedes the third-stage pair. A `skipped` or `cancelled` Ling 3.0 Flash or Poolside job does not open that barrier. Laguna and Dots3-Note Preview then execute concurrently against the same original triggering head.

A reviewer failure inside a cohort is execution evidence and does not trigger secret substitution, stage reordering, or early launch. The inter-stage barrier is time-and-head controlled. A PR-head change during a barrier fails closed and prevents later automatic stages from reviewing stale code.

The sequence is entered only from the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event. Draft PRs do not invoke models automatically. `synchronize` never restarts the chain. A durable sequence-claim comment is recorded before Nemotron starts.

### Manual reviewer routing

Later-head analysis remains deliberate:

- `/nemotron-ultra` → `nemotron-copilot-review.yml`
- `/ling`, `/poolside`, `/laguna`, or `/dots3` → `additional-ai-advisory-reviews.yml`

Authorized workflow dispatch provides the same reviewer-specific control. Manual review is not a second automatic allowance.

### Reviewer configuration

| Reviewer | Secret | OpenRouter model | Cost class | Automatic stage |
|---|---|---|---|---:|
| Nemotron Ultra | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` | **Free** | 1 |
| Ling 3.0 Flash | `OPENROUTER_API_KEY_OPENAI` | `inclusionai/ling-3.0-flash:free` | **Free** | 2 |
| Poolside | `OPENROUTER_API_KEY_POOLSIDE` | `poolside/laguna-xs-2.1:free` | **Free** | 2 |
| Laguna | `OPENROUTER_API_KEY_DEEPSEEK` | `poolside/laguna-s-2.1:free` | **Free** | 3 |
| Dots3-Note Preview | `OPENROUTER_API_KEY_GWEN` | `dots-studio/dots-3-note-preview:free` | **Free** | 3 |

This cost classification was externally audited on 2026-09-17. All five active reviewer routes are pinned `:free` bindings. Secret names remain aliases only and are intentionally decoupled from reviewer/model identity.

Free model routes can also have provider-specific data-use terms, so “free” does not automatically mean suitable for confidential repository review packets.

## Canonical live-site routing reference

For public live website validation, all applicable verification routes converge on exactly `https://RbrtMrlsIII.github.io/TeamAi/`. Preserve the `TeamAi` path casing in recorded evidence. Public live-site validation is separate from PR/candidate validation, which remains exact-head CI/browser evidence.

## Machine Hero routing

PR #353 is the current merged machine candidate and remains non-production. Its routing is:

`Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md → repository-synchronization → machine-builder → applicable frontend/spatial Skills → verification/browser evidence`

The machine builder owns the construction procedure. It does not own product semantics, backend authority, authorization, scheduler selection, entitlement, commerce, durable-state, or promotion.

Relevant spatial companions are selected only when required:

- `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
- `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/transition/SKILL.md`
- `skills/frontend/spatial/responsive/SKILL.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `skills/frontend/spatial/camera-ladder-recovery/SKILL.md`
- `skills/frontend/spatial/workspace-ring/SKILL.md`
- `skills/frontend/spatial/workspace-zipskills/SKILL.md`

## Routing rule

Every executable `Masterplan/MASTERPLAN.md` item must resolve to concrete Skill path(s), or explicitly state `No skill required` with rationale. A folder name alone is not routing.

A missing reusable Skill is an execution gap. Do not create a governance document as a substitute for a Skill.

## Non-Skill boundary

Hero lighting/theme is not a Skill. It is owned by the canonical presentation adapter and theme root. Do not create a Hero lighting Skill.

## History rule

Retired procedures live under `docs/archive/` only. Historical handover evidence may remain under `handover/`. Neither is active routing.

## Forbidden active routing surfaces

The following classes are forbidden as active routing: retired root Product Law, retired root Masterplan, retired root current-slice files, the legacy `docs/skills/` namespace, retired project-guide handover/acceptance documents, and `OBSOLETE_FILES.md` registry.

<!-- #361 reconciliation: post-merge semantic topology/adaptive-clearance baseline is current; #370/#371 runner runtime-proof investigation is a bounded Verification & CI/Browser concern. -->

### Draft proof target parser boundary

Governance validation consumes the PR body's `Draft proof target` section. The accepted heading contract is level-2 or level-3 Markdown, including the canonical `### Draft proof target` form. Skills do not create this authority; they route the governed procedure.
