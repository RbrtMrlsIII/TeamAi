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
Model-assisted review is part of Verification & CI/Browser only. A model review is evidence of analysis, not a new authority layer or acceptance mechanism. All configured advisory reviewer workflows are downstream of required exact-head substantive validator execution and receive exact-head execution evidence, governing context, and owning Issue state before model invocation.
The controlled automatic advisory procedure permits one automatic review sequence per pull request:
OpenRouter Free Router → 5 parallel slots → no inter-slot interval; each slot uses a distinct credential alias; terminal slot outcome is explicit; actual routed model/provider recorded on successful review
Execution state is separate from advisory content: each slot records one terminal outcome (`SUCCEEDED`, `PROVIDER_FAILED`, `REVIEW_POST_FAILED`, or `PRE_PROVIDER_FAILURE`); only a successful slot publishes advisory review content, while a failed slot publishes compact failure evidence. Execution completion does not imply advisory approval or human acceptance.
Five OpenRouter Free Router slots start concurrently after the substantive exact-head gate. Each slot receives a distinct OpenRouter API key credential. The durable sequence claim freezes the one-sequence quota, synchronize/reopen events do not restart it, and each slot fails closed if the original triggering head changes. Completion is recognized only after all five slot outputs are recorded against that exact head.
The requested route is openrouter/free. The actual routed model/provider returned by OpenRouter is runtime evidence and is recorded per successful slot. This operational routing does not create Product Law identities. review-readiness remains the separate human promotion/authorization gate.

## Reviewer runner repair boundary
Implementation repairs to the reusable advisory-review runner belong to Verification & CI/Browser and do not create new Product Law authority. Runtime proof must distinguish configured routing from actual provider invocation. The fresh runtime vehicles that exposed the historical parser defects remain immutable evidence for those heads. The current runner records the OpenRouter response model and routing metadata so the repository does not mistake a dynamic router request for a fixed reviewer identity.

### Validation parser alignment

The governance audit's `Draft proof target` parser is aligned to the repository's canonical PR-body contract: level-2 or level-3 Markdown headings are accepted, including the established `### Draft proof target` form. This is validation implementation alignment, not a new authority layer.


## 3D world structural authority boundary

The 3D world uses the existing Tree Authority XML and synchronized Tree Census representations as a subordinate structural record. They describe semantic tree identity, branch structure, implementation status, topology, geometry, and verification boundaries. They cannot override Product Law or create backend, scheduler, authorization, entitlement, durable-state, acceptance, or merge authority.

The canonical Governance Integrity audit machine-checks the Tree Authority XML, Census JSON/CSV/Markdown representation set, semantic identity coherence, and the Census synchronization contract. Skills consume these records procedurally and cannot create a second semantic machine hierarchy.
