# PRODUCT LAW — TeamAi

`Product_Law/PRODUCT_LAW.md` is the single Product Law authority. It defines what TeamAi is, what must remain true, which responsibilities are distinct, how development fields connect, and which boundaries cannot be crossed silently.

## 0. Whole-system invariant

```text
Human authority
  ↓
Product Law
  ↓
Development Field
  ↓
Responsibility / Seat
  ↓
Workspace + Skills + Capabilities
  ↓
Authorization
  ↓
Task state + Scheduler eligibility
  ↓
Trusted execution
  ↓
Durable result / event / artifact
  ↓
Verification + reconciliation
  ↓
Session knowledge evolution
```

Human/User Authority is the highest operational authority. AI output is never authority merely because it is newer or persuasive. Lower layers may implement or verify the law but cannot silently redefine it.

## 1. Product identity and team boundary

TeamAi has a TeamAi Development Team and a user-configured Web AI Team. Web AI providers and applications remain external. TeamAi owns the participation, authorization, durable state, orchestration, verification, and product boundaries it provides.

These identities remain distinct:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ capability/tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

A Web AI Seat is a TeamAi participation identity/configuration for an externally operated AI application/runtime. A Seat may use a Connection but the two remain distinct.

## 2. Canonical service and platform authority

| Surface | Canonical responsibility |
|---|---|
| Firebase Authentication | Sign-in and Firebase UID identity |
| Cloud Firestore `(default)` | Canonical durable TeamAi application/domain state |
| Supabase Edge Functions | Trusted server execution and protected operations |
| PayPal | External payment-event authority |
| GitHub | Engineering/source/change authority |
| GitHub Actions | Engineering verification and repository automation |
| Firebase Hosting | Current TeamAi web delivery |
| Vercel | Optional non-authoritative preview/verification surface; never a silent authority |
| Supabase Postgres | Platform infrastructure only, never TeamAi domain state |
| External AI applications/providers | External runtime/model ownership |
| MCP/tools/plugins/integrations | Bounded capabilities only |
| Universal ToolKit | Upstream generalized knowledge only |

A platform connection never grants additional TeamAi authority.

## 3. Identity, durable state, and trusted execution

Durable TeamAi ownership is rooted in the authenticated Firebase UID. Client-provided identifiers do not prove ownership. External provider events must be correlated server-side to the authenticated TeamAi identity.

Canonical flow:

```text
Firebase token → verified UID → UID-rooted state → task/event identity → authorization → trusted operation → durable result
```

Firestore remains the durable application/domain source of truth. No alternate durable domain store may be introduced without explicit Product Law reconciliation.

The canonical Firebase project remains `team-ai-official` unless Product Law is explicitly changed. Conflicting project identities stop deployment/verification until reconciled.

## 4. Development fields

Development Fields partition responsibility without partitioning product authority. The canonical field set is:

1. **Product & Governance**: product meaning, invariants, authority boundaries, governance contracts.
2. **Backend & Runtime**: identity, durable state, trusted execution, scheduler boundaries, provider/runtime integration.
3. **Frontend & Experience**: presentation, interaction, accessibility, responsive behavior, spatial machine rendering.
4. **Application Integration & Contracts**: typed seams, adapters, read models, payload/status/error contracts.
5. **Verification & CI/Browser**: tests, validators, browser evidence, CI gates, promotion evidence.
6. **Documentation, Knowledge & Handover**: current session state, validated learning, routing, continuity.
7. **Recovery, History & Reconciliation**: archive, historical provenance, recovery and migration safety.
8. **Delivery & Operations**: deployment configuration and operational delivery surfaces.

A Field owns a responsibility, never product authority.

## 5. Responsibility profiles and Seats

A Seat configuration may include provider/application, runtime/model, role, Field assignment, Skill bundle, tools/plugins, workstation/scope, permissions, approvals, limits, entitlement, and health.

The following distinctions must remain explicit:

`can read ≠ can propose ≠ can implement ≠ can commit ≠ can create PR ≠ can approve ≠ can merge ≠ can modify Product Law ≠ can coordinate ≠ can summarise`

Scheduler eligibility is not inferred from conversation recency or branch names. A Team Lead may coordinate and recommend; it cannot bypass repository, backend, Product Law, authorization, or merge controls.

## 6. Planning and Working orchestration

Planning is user-controlled deliberation. Working execution begins only after the approved plan/handoff is converted into authorized tasks.

Canonical Web AI orchestration is event-driven:

`AI result/action → durable structured event → task/state transition → scheduler eligibility → next Seat/tool/human → new event`

Direct provider-to-provider control is prohibited. The latest AI response is never the latest authority.

Summaries and handovers preserve materially relevant objective, decisions, disagreements, constraints, warnings, unresolved questions, artifacts, and evidence, but do not silently become authorization.

## 7. Workspace and repository flow

A Workspace is an operating context. GitHub is the first concrete coding workspace model.

```text
repository → branch/ref → commit → pull request → review → verification → merge → main
```

New durable branches use purpose-specific prefixes such as `frontend/`, `backend/`, `governance/`, `verification/`, `docs/`, `recovery/`, or `delivery/`. Temporary work may use `tmp/`.

Substantive changes start as Draft PRs. One slice is not required to equal one PR or merge.

## 8. Skills and capability boundary

Skills are reusable procedures and knowledge for an authorized responsibility. Skills never grant permission and never amend Product Law.

There is one active Skill system:

`skills/**/SKILL.md`

`docs/SKILL_WIRING.md` routes work to Skills. Missing Skill coverage is an execution gap, not permission to create another authority document.

## 9. Frontend and Machine Hero boundary

Frontend/Experience owns presentation, interaction, accessibility, responsive behavior, and rendering of authorized backend facts. It must not become backend, scheduler, authorization, commerce, entitlement, or durable-state authority.

The Machine Hero replacement direction is:

```text
semantic identity
→ product/UI payload
→ expansion footprint
→ connection topology
→ adaptive geometry
→ transition
→ semantic subject
→ camera relationship
→ rendering
```

Semantic identity is never defined by coordinates, mesh indexes, camera preset IDs, animation timing, or decorative effects. The current prototype is implementation evidence, not future machine law.

PR #344 is the current replacement candidate and remains isolated until its governed verification and promotion conditions are satisfied.

## 10. Verification, evidence, and promotion

Verification proves the behavior actually exercised. CI, browser output, deployment state, screenshots, or a passing PR do not independently change product authority.

State distinctions remain explicit:

`specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted`

A validation conflict is handled as:

`identify old invariant → identify authorized new rule → warn with risk/cost/output → reconcile authority → update dependent validation → run validation → record evidence`

No validator may be weakened merely to obtain green CI.

## 11. Canonical documentation system

| Surface | Single responsibility |
|---|---|
| `Product_Law/PRODUCT_LAW.md` | Product meaning and protected invariants |
| `Product_Law/WIRING.md` | Field purposes and Product Law navigation |
| `Masterplan/MASTERPLAN.md` | Ordered execution checklist |
| `Masterplan/NEXT_SLICES.md` | One current slice only |
| `POLICY.md` | ORUCAVEAM execution discipline |
| `docs/SKILL_WIRING.md` | Skill routing only |
| `skills/**/SKILL.md` | Reusable procedures |
| `AI_ASSISTANT_READ_ME.md` | Current session, recovery, handover, endorsement decisions, validation-change records |
| `PRODUCT-KNOWLEDGE.md` | Validated reusable concepts only |
| `docs/archive/` | Historical material |
| `handover/` | Historical handover evidence |

No active `HandOver.md`, `Endorsement.md`, root Product Law, root Masterplan, root Next Slices, parallel Skill namespace, governance constitution, machine-law document, or `OBSOLETE_FILES.md` registry is permitted.

## 12. Cross-field rule

Every development field may contribute to one canonical TeamAi system, but responsibility must flow through explicit contracts. A downstream presentation surface cannot become an upstream authority. A documentation surface cannot silently change runtime truth. A Skill cannot grant authorization. A validator cannot redefine the product merely because its assertion is convenient.
