# Product Law Wiring

**Role:** navigation and field-ownership map for `Product_Law/`. This file does not create a second Product Law.

## Canonical Product Law root

`Product_Law/PRODUCT_LAW.md` is the single Product Law document. It contains connected product meaning, protected invariants, service boundaries, development fields, responsibility model, workspace rules, skills boundary, authorization boundary, execution model, and product-wide constraints.

## Current execution routing

PR #398 is the historical 029 structural baseline. PR #404 is the merged historical spatial implementation vehicle; PR #424 on `frontend/029-spatial-world-continuation` is the active 029 spatial continuation vehicle. Frontend & Experience routing for the machine world resolves to the Hero controller plus the canonical machine-world renderer source/runtime pair; legacy mutation scripts are historical or compatibility-only and must not become active renderer authority. Production-data/runtime routing remains with Issue #401 / merged PR #402, without changing the Product Law authority chain.

## 2026-09-28 029 spatial continuation routing

PR #424 is the active bounded spatial implementation vehicle after merged PR #404. It may advance S24 and later world-expression slices without changing the one-current-slice rule in `Masterplan/NEXT_SLICES.md` or absorbing Issue #401 backend/runtime authority.

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

### 2026-10-07 spatial acceptance wiring

For the active 029 continuation, the spatial machine is a product-expression surface, not an independent visual project. Product Law determines product meaning and invariants; Issue #400 determines the canonical frontend feature vocabulary and surface class; #278/#405 govern the 029 spatial execution boundary; S0-S10 own semantic/physical structure; S22-S33 provide cross-cutting expression and final acceptance; the Hailuo MP4 and endorsed PNG storyboard/reference-board provide visual-direction guidance only.

Exact-head Browser evidence is mandatory for browser-visible spatial claims. A CI run that is still executing is an in-progress condition, not a successful proof. After Canonical Browser reaches a terminal state, its exact-head artifact/report must be inspected and the outcome classified. While validation runs, non-conflicting audit work may proceed inside the same #424 vehicle, including repository history/debris/stale-reference analysis, Product Law/feature coverage reconciliation, geometry measurement, and visual-reference comparison. No such audit work may silently alter the proof target or create a competing implementation authority.

## Durable decision capture and cross-session persistence

Chat is transient working context. It is never a sufficient authority surface for a material TeamAi decision.

When a discussion produces a material finding or recommendation, preserve it in the authoritative surface that owns the information:

| Information produced | Durable destination |
|---|---|
| Product invariant or authority boundary | Product_Law/PRODUCT_LAW.md or its governed companion |
| Routing / authority interpretation | Product_Law/WIRING.md |
| Ordered execution gate / acceptance prerequisite | Masterplan/MASTERPLAN.md or the detailed active checklist |
| One global current execution frontier | Masterplan/NEXT_SLICES.md |
| Verified geometry/result/evidence/finding | Masterplan/TEAMAI_3D_WORLD_404_EVIDENCE.md or the relevant evidence ledger |
| Bounded implementation scope and rationale | Owning Issue / PR body |
| Current newcomer/session state | Issue #409 and AI_ASSISTANT_READ_ME.md |
| Structural tree/branch change | Tree Census representations in the same governed change |

Material alternatives that are rejected or deferred should retain a compact reason in the owning durable surface when their absence could later cause re-litigation or a bad implementation. Do not create a second ledger merely to store these decisions.

A checkbox is only a status marker. Claims remain subject to exact-head evidence and the repository's evidence-state progression. Historical records must be date-stamped and explicitly labeled historical so they cannot be mistaken for current truth.

Every materially changed spatial tree/branch/division must reconcile its census, execution checklist, and evidence/handoff surfaces in the same governed change when the change affects those contracts. No important implementation discussion should exist only in chat.

## Live delivery reference

The canonical public live-site validation target is `https://RbrtMrlsIII.github.io/TeamAi/`. This is a delivery/verification reference only and does not create product authority, override Firebase Hosting delivery authority, or change the hosting architecture contract.

## No parallel authority

Do not create another Product Law, current-state ledger, Masterplan, live HandOver manual, Endorsement file, Skill namespace, governance constitution, machine-law document, or `OBSOLETE_FILES.md` registry.

## Reviewer lifecycle boundary
Model-assisted review is part of Verification & CI/Browser only. A model review is evidence of analysis, not a new authority layer or acceptance mechanism. All configured advisory reviewer workflows are downstream of required exact-head substantive validator execution and receive exact-head execution evidence, governing context, and owning Issue state before model invocation.
The controlled automatic advisory procedure permits one automatic provider-consuming review sequence per exact PR head:
OpenRouter Free Router → 5 parallel slots → 2-second launch stagger; terminal slot outcome is explicit; actual routed model/provider recorded on successful review
Execution state is separate from advisory content: each slot records one terminal outcome (`SUCCEEDED`, `PROVIDER_FAILED`, `PROVIDER_WALL_CLOCK_TIMEOUT`, `REVIEW_QUALITY_FAILED`, `REVIEW_POST_FAILED`, or `PRE_PROVIDER_FAILURE`); only a successful slot publishes advisory review content, while a failed slot publishes compact failure evidence. Execution completion does not imply advisory approval or human acceptance.
Five OpenRouter Free Router slots start with a nominal 2-second launch stagger after the substantive exact-head gate, capped at an 8-second spread. Each provider call has a 330-second (5.5-minute) wall-clock fail-closed and each reusable runner job has a 35-minute outer timeout; expiry is terminal slot evidence. The durable sequence claim binds the one-sequence quota to the exact head; ordinary synchronize edits do not launch provider-consuming review, previously claimed exact heads do not restart, and each slot fails closed if the original triggering head changes. Completion is recognized only after five structured terminal slot artifacts are recorded against that exact head.
The requested route is openrouter/free. The actual routed model/provider returned by OpenRouter is runtime evidence and is recorded per successful slot. This operational routing does not create Product Law identities. review-readiness remains the separate human promotion/authorization gate.

## Reviewer runner repair boundary
Implementation repairs to the reusable advisory-review runner belong to Verification & CI/Browser and do not create new Product Law authority. Runtime proof must distinguish configured routing from actual provider invocation. The fresh runtime vehicles that exposed the historical parser defects remain immutable evidence for those heads. The current runner records the OpenRouter response model and routing metadata so the repository does not mistake a dynamic router request for a fixed reviewer identity.
The reusable runner path is `.github/workflows/ai-advisory-review-runner.yml`. It is `workflow_call`-only. Provider work is entered only through the automatic sequence and manual workflows.

### Validation parser alignment

The governance audit's `Draft proof target` parser is aligned to the repository's canonical PR-body contract: level-2 or level-3 Markdown headings are accepted, including the established `### Draft proof target` form. This is validation implementation alignment, not a new authority layer.


### Review-readiness semantic routing

Issue #415 routes review-readiness procedure guidance to the AI Advisory Review Skill and PR template. The governing semantic unit is the PR's declared proof target and claimed scope; owning Issue state remains context unless it materially prevents that proof. This Wiring entry does not create acceptance or merge authority.

## Program-order and bounded parallel execution

Product Law §15's chronological sequence is a program/release-gate ordering statement. It does not by itself prohibit bounded execution in separately owned development fields where Product Law already permits parallel work. Parallel work remains isolated by responsibility and does not create a second authority, bypass a release gate, or authorize promotion/completion claims outside the applicable Product Law, Masterplan, Issue, and human governance boundaries.

This clarification is a non-authoritative Wiring interpretation only; it does not resolve, amend, reorder, or override `Product_Law/PRODUCT_LAW.md` §15.

## Current-slice authority consumption

`Masterplan/NEXT_SLICES.md` is the single current-slice authority. Downstream field wiring, validation, and procedural tooling should derive the current slice from that source rather than duplicating an Issue number or creating a parallel current-state pointer. Historical Issue/PR references remain provenance only.


## 2026-09-26 production verification routing

Current canonical `main` is `76da305f0ec3efb3d368b22fb70748f0051f4d15` after PR #419, PR #417, PR #421, and PR #422 merged. The remaining Issue #401 Gate 3 responsibility is live Seat-shape evidence. The default-branch `firestore-production-evidence.yml` already provides the generalized protected Team/Seat selector path; this Wiring entry does not authorize a selector or create production data.

Firestore index deploy/readback is RUNTIME-PROVEN by default-branch run `36146692843` after PR #413 merged. This Wiring entry only routes the remaining Issue #401 verification responsibility to Gate 3 Seat-shape evidence. A `teamDocumentCount=0` result with a successful team list is classified as `operator_hierarchy_absent` and does not authorize Seat creation, Rules closure, or runtime promotion.

## 2026-09-25 production verification routing

The live Firestore production index was confirmed present by sanitized readback run `36141481871`; the historical verification defect belonged to the repository verifier and was repaired by merged PR #413. This Wiring entry only routed that verification responsibility to Issue #401 / PR #413. It did not create production authority, change the checked-in index definition, or authorize live runtime promotion.

### 2026-09-24 029 spatial acceptance routing

PR #404 is merged historical spatial provenance. PR #424 is the active bounded 029 Frontend & Experience implementation/evidence vehicle while `Masterplan/NEXT_SLICES.md` continues to own the single current slice. Its spatial construction path remains Product Law → Wiring → current slice/Issue → machine-builder and applicable spatial Skills → canonical source/runtime → Verification & CI/Browser. The current branch head `ba0d7dc7d057b9e778fd58cfd67d4d1b880402b4` preserves S4 authored division grammar, places the structural Seat/outer safety envelope in the shared world-profile authority, and lets S5 enforce clearance against the authored machine obstacles. These facts do not promote 029 to complete, create a second current slice, or authorize merge.

### 030 successor routing

The current implementation frontier is resolved from `Masterplan/NEXT_SLICES.md`: TEAM-BACKEND-030 production Firestore authority, security, and runtime evidence. This Wiring file only routes the field; it does not create new production/runtime authority.

### Advisory control-plane wiring note
Repository Governance Integrity lifecycle concurrency is keyed to the PR identity (or protected ref for push), so a newer PR event supersedes stale governance executions. Exact-head validation remains enforced inside each run and stale runs do not become current-state evidence.

The advisory review mechanism is repository governance infrastructure only. PR metadata is parsed for routing context before provider fan-out; no advisory result becomes Product Law authority, runtime authority, or merge authorization. Explicit no-issue declarations remain valid for repository changes without an owning Issue.
