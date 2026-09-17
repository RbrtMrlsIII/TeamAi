# Product Law Wiring

**Role:** navigation and field-ownership map for `Product_Law/`. This file does not create a second Product Law.

## Canonical Product Law root

`Product_Law/PRODUCT_LAW.md` is the single Product Law document. It contains connected product meaning, protected invariants, service boundaries, development fields, responsibility model, workspace rules, skills boundary, authorization boundary, execution model, and product-wide constraints.

## Development fields

| Field | Purpose |
|---|---|
| Product & Governance | Product meaning, protected invariants, authority boundaries, governance contracts |
| Backend & Runtime | Identity, durable state, trusted execution, scheduler boundaries, provider/runtime integration |
| Frontend & Experience | Presentation, interaction, accessibility, responsive behavior, semantic machine rendering |
| Application Integration & Contracts | Typed seams, adapters, read models, payload/status/error contracts |
| Verification & CI/Browser | Tests, validators, browser evidence, CI gates, promotion evidence |
| Documentation, Knowledge & Session | Session state, validated learning, routing, continuity and handover |
| Recovery, History & Reconciliation | Archives, historical provenance, restoration, migration safety |
| Delivery & Operations | Deployment configuration and operational delivery surfaces |

## Canonical field companions

| Companion | Ownership | Rule |
|---|---|---|
| `Product_Law/FRONTEND_EXPERIENCE.md` | Frontend & Experience | Subordinate field contract; may elaborate Product Law but cannot override it. |
| `Product_Law/CONNECTED_PLATFORM.md` | Backend & Runtime / Delivery & Operations | Connected-platform roles, evidence boundaries, and non-authority boundaries; subordinate to Product Law. |
| `Product_Law/WIRING.md` | Product & Governance | Routes fields and companions only; cannot create new authority. |

## Authority boundaries

Product Law owns meaning. Policy owns ORUCAVEAM. Masterplan owns ordered checklist execution. `Masterplan/NEXT_SLICES.md` owns one current slice. Skills own reusable procedures. Issues own bounded workstream context. PRs own implementation/review boundaries. Verification proves claims. `AI_ASSISTANT_READ_ME.md` owns current session state, handover, endorsement decisions, and validation-change records. `PRODUCT-KNOWLEDGE.md` owns durable validated concepts. `docs/archive/` and `handover/` are historical storage only.

## Live delivery reference

The canonical public live-site validation target is `https://RbrtMrlsIII.github.io/TeamAi/`. This is a delivery/verification reference only and does not create product authority, override Firebase Hosting delivery authority, or change the hosting architecture contract.

## No parallel authority

Do not create another Product Law, current-state ledger, Masterplan, live HandOver manual, Endorsement file, Skill namespace, governance constitution, machine-law document, or `OBSOLETE_FILES.md` registry.

Model-assisted review is part of Verification & CI/Browser only. A model review is evidence of analysis, not a new authority layer or acceptance mechanism. All configured advisory reviewer workflows are downstream of required exact-head substantive validator execution and must receive exact-head execution evidence, governing context, and owning Issue state before model invocation.

## Reviewer lifecycle boundary

The controlled advisory reviewer procedure permits one automatic review sequence per pull request across the configured reviewer roster. The sequence begins only on the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event after substantive exact-head validators pass. The sequence is staged as:

`Nemotron → 2 minutes 30 seconds → OpenAI + Poolside → 2 minutes 30 seconds → DeepSeek + Qwen`

There is no automatic interval before Nemotron. OpenAI and Poolside are peers in the second stage and execute concurrently. DeepSeek and Qwen are peers in the third stage and execute concurrently. `synchronize` never restarts the automatic sequence. Later-head review is an explicit verification action through the reviewer-specific command or authorized workflow dispatch.

A reviewer/provider failure is recorded as execution evidence and does not authorize secret substitution, stage reordering, or a retry through another provider. A PR-head change fails the current stage and prevents the sequence from proceeding with stale code.

The current configured reviewer aliases are `nemotron` → `OPENROUTER_API_KEY`, `openai` → `OPENROUTER_API_KEY_OPENAI`, `poolside` → `OPENROUTER_API_KEY_POOLSIDE`, `deepseek` → `OPENROUTER_API_KEY_DEEPSEEK`, and `qwen` → `OPENROUTER_API_KEY_GWEN`. These aliases and provider bindings are verification/runtime configuration, not new Product Law identities.

<!-- #361 reconciliation: semantic topology/adaptive clearance is merged; runtime proof remains governed by the active 029 frontier. -->
