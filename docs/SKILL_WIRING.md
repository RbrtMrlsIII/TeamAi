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

Governance Skills are procedures only. They cannot authorize an action outside Product Law, Policy, repository permissions, or the owning Issue/PR contract.

## Validation lifecycle routing

Draft PRs continue substantive validation. Governance Integrity, evidence consistency, agent validation, Full-System, Security, and applicable Browser/Runtime evidence remain active against the exact PR head. `review-readiness` may be skipped on Draft by lifecycle design.

Ready-for-review PRs retain current exact-head substantive evidence and additionally enter `review-readiness`, which evaluates review/authorization conditions. Submitted or dismissed human review events may re-trigger that same exact-head evaluation. While an independent human approval for the exact current head is absent, `review-readiness` remains pending rather than failing. Merge candidates require current passing required checks and normal review/merge authorization.

A downstream **skipped** job is never a passing validation. Recovery must inspect the controlling upstream job and exact current head.

### Advisory reviewer execution gate

The reusable advisory-review runner is downstream of the substantive validator set. For every invocation it polls the exact PR head and accepts only successful completion of the required exact-head check-runs before invoking the external model. The packet receives current governing-file context, the owning Issue state, exact-head execution evidence, and the complete bounded diff.

A reusable runner transport/parser repair is a Verification & CI/Browser implementation concern. It must be proven by fresh exact-head execution after the repaired path is governed and merged; static route declarations and green non-provider validators are not sufficient provider runtime evidence.

### Automatic reviewer sequence
OpenRouter Free Router → 5 parallel slots → no inter-slot interval; terminal slot outcome is explicit; actual routed model/provider recorded on successful review
Execution state is separate from advisory content: each slot records one terminal outcome (`SUCCEEDED`, `PROVIDER_FAILED`, `REVIEW_POST_FAILED`, or `PRE_PROVIDER_FAILURE`); only a successful slot publishes advisory review content, while a failed slot publishes compact failure evidence. Execution completion does not imply advisory approval or human acceptance.
The sequence begins only after the first eligible non-draft opened, reopened, or ready_for_review event has passed the substantive exact-head validation gate. Five reusable reviewer jobs fan out concurrently with fail-fast disabled so one provider failure does not cancel peer slots.
A durable sequence claim is written before the fan-out. synchronize and reopen events never restart a prior claimed sequence for the same PR. Every slot receives the original triggering head and the reusable runner revalidates that head immediately before provider invocation. Sequence completion is checked only after five terminal slot outcomes are present.

### Manual reviewer routing
The active manual command is /openrouter-free, with optional slot aliases /free-1 through /free-5 for deliberate later-head review. Authorized workflow dispatch targets the same OpenRouter Free Router. The former reviewer-specific commands remain historical evidence only and are not active routing instructions.

### Reviewer configuration
| Reviewer | Credential alias | Requested route | Cost class | Automatic stage |
| OpenRouter Free Slot 1 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 2 | OPENROUTER_API_KEY_OPENAI | openrouter/free | Free | 1 |
| OpenRouter Free Slot 3 | OPENROUTER_API_KEY_POOLSIDE | openrouter/free | Free | 1 |
| OpenRouter Free Slot 4 | OPENROUTER_API_KEY_DEEPSEEK | openrouter/free | Free | 1 |
| OpenRouter Free Slot 5 | OPENROUTER_API_KEY_GWEN | openrouter/free | Free | 1 |
| OpenRouter Free Slot 4 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 5 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
All five slots use the same OpenRouter Free Router route. The reusable runner must record the actual model returned by the router and the selected provider when exposed by routing metadata. Free does not imply suitable handling for confidential material; provider data-use terms remain a separate governance concern.

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


## 3D world authority enforcement

The Tree Authority XML and four-file Tree Census are subordinate structural records, not a new Skill and not a second Product Law. Their consistency, semantic identity set, and non-authority boundary are machine-checked by `build-system/scripts/repository-canonical-governance-audit.py`, which also executes the existing `scripts/governance/census-sync-contract.mjs` against the full PR diff.

Skills route implementation against these records but cannot override Product Law, define new semantic authority, grant permission, or authorize promotion/merge. Machine semantic projections must consume the canonical Census identities rather than creating a parallel hierarchy.
