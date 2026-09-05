# TeamAi — Product Knowledge

**Status:** BASELINE KNOWLEDGE LIBRARY + CONNECTED PRODUCT-LAW MAP
**Purpose:** Preserve validated and deliberately classified learning about how the Product Law works as one connected system. This file is subordinate to `PRODUCT_LAW.md`; it MUST NOT become a second Product Law or silently add authority.

## 0. Product Law picture — numerical law spine + connected conceptual map

The primary picture in this file is the **connection between the numbered hard laws themselves**. The numerical order `LAW 101 → LAW 102 → ... → LAW 110` is the canonical editorial spine for the hard-law register. The arrows in that spine establish the intended reading/implementation progression; the family links beneath it show cross-cutting dependencies and are **not** alternative numbering.

The register is contiguous: **LAW 101 through LAW 110, with no missing number and no second definition for any hard-law number**. Repeated ideas that belong to the same underlying logic are consolidated under the law families in `PRODUCT_LAW.md`; the hard-law entries below are the enforceable cross-cutting invariants and their relationship to those families.

### 0.0 Hard-law numerical spine

```text
LAW 101
Implementation traceability
      ↓
LAW 102
Executable service authority
      ↓
LAW 103
Durable state before trusted execution
      ↓
LAW 104
Firebase UID ownership root
      ↓
LAW 105
Firebase project identity invariant
      ↓
LAW 106
Workspace rulesets as subordinate adapters
      ↓
LAW 107
Skill evolution without authority expansion
      ↓
LAW 108
Team knowledge survives separated AI applications
      ↓
LAW 109
ZipSkills is knowledge packaging, not authority
      ↓
LAW 110
Workspace choice shapes configuration without fragmenting TeamAi
```

### 0.1 Numerical spine wired to the law-family system

```text
101 ──► K/L   proof, verification, handover, completion
 │
102 ──► B/C/K service authority → executable boundary → verified integration
 │
103 ──► C/H/K durable identity → authorization → execution → evidence
 │
104 ──► A/B/C/I identity ownership → UID-rooted domain + commerce correlation
 │
105 ──► B/C/J/K one Firebase project identity across dependent surfaces
 │
106 ──► D/E/G/H responsibility → workspace adapter → native operation
 │
107 ──► E/G/H/I/L learning → skill evolution → verification → promotion
 │
108 ──► A/E/F/G/K/L context continuity → eligible Seat without direct provider control
 │
109 ──► H/I/L validated skill knowledge → package → enablement → separate authorization
 │
110 ──► E/F/G/H/J workspace choice → configured context → skills/capability/auth → UI guidance
```

This is the **numeric-to-family wiring**: each hard law has one numerical position and a deliberate set of family connections. A law may connect to several families without becoming several laws.

### 0.2 Connected family dependency picture

The family graph remains useful, but it is now explicitly subordinate to the numbered spine:

```text
                         HUMAN USER AUTHORITY
                                  │
                                  ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY A               │
                  │ identity + team boundary   │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY B               │
                  │ service/platform authority │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY C               │
                  │ UID + durable state        │
                  │ + trusted execution        │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY D               │
                  │ Development Fields         │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY E               │
                  │ Seats + Responsibility     │
                  │ Profiles + population      │
                  └──────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ LAW FAMILY G         │   │ LAW FAMILY H         │
        │ Workspace + rulesets │   │ Skills + capability  │
        │ native context       │   │ + auth + scheduler   │
        └──────────┬───────────┘   └──────────┬───────────┘
                   └────────────┬─────────────┘
                                ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY F               │
                  │ knowledge continuity +     │
                  │ Web AI orchestration       │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY K               │
                  │ branch + integration +     │
                  │ verification + history     │
                  └──────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ LAW FAMILY J         │   │ LAW FAMILY I         │
        │ Spatial + guides +   │   │ Commerce + ZipSkills │
        │ dictionary           │   │ + provider entitlement│
        └──────────┬───────────┘   └──────────┬─────────────┘
                   └────────────┬─────────────┘
                                ▼
                  ┌────────────────────────────┐
                  │ LAW FAMILY L               │
                  │ evidence → handover →     │
                  │ knowledge → evolution     │
                  └──────────────┬─────────────┘
                                 │
                                 └───────────────↺
                                      improves
                               future skills/rules
                             without changing authority
```

The family graph describes conceptual dependency. The numerical spine remains the authoritative hard-law ordering for this knowledge map.

### 0.3 Why the laws are grouped

The Product Law contains several kinds of statements that previously appeared in different sections but describe the same underlying logic. They are now interpreted as connected law families.

| Consolidated logic | Primary family | Related hard laws |
|---|---|---|
| Human authority, TeamAi vs Web AI, Seat identity | A | 104, 108 |
| Platform/service boundaries | B | 102, 105 |
| UID ownership, durable state, execution, payment correlation | C | 103, 104, 105 |
| Responsibility partitioning and frontend/backend seam | D | 101, 102 |
| Seats, profiles, population, main integration | E | 106, 107, 108, 110 |
| Whole-team context and non-direct orchestration | F | 108 |
| Workspace choice and workspace-specific rules | G | 106, 110 |
| Skills, capabilities, authorization and scheduler | H | 107, 110 |
| ZipSkills and commercial separation | I | 109 |
| Spatial presentation, guides, dictionary | J | 105, 110 |
| Branches, PR flow, verification, history | K | 101, 102, 103 |
| Learning, handover, Product Knowledge, growth | L | 101, 107, 109 |

The purpose of this consolidation is not to delete meaning. It is to make the **same meaning have one conceptual home** and then connect it to the places where it is consumed.

## 1. Law-by-law conceptual dependency map

### LAW 101 — Implementation traceability

**Core idea:** a completion claim is a chain of intent → implementation → proof, not a document or green-check event.

**Flow:**

`Product Law requirement → planned work → execution discipline/skill → implementation → verification → evidence → handover/endorsement`

**Connects:** every family, because every meaningful product claim eventually needs a trustworthy proof path.

**Learning classification:** validated governance rule / implementation completion discipline.

### LAW 102 — Service authority must be executable

**Core idea:** authority boundaries are real only when the system can reject a mismatch.

**Flow:**

`declared authority → executable boundary → authorized operation → reject authority mismatch`

**Connects:** B → C → K, with implications for J and external integrations.

**Learning classification:** validated architectural rule.

### LAW 103 — Durable state precedes trusted execution

**Core idea:** a trusted operation must have durable identity, ownership, lifecycle/idempotency, and appropriate evidence.

**Flow:**

`durable identity → ownership → lifecycle/idempotency → authorization → execution → durable result/event → evidence`

**Connects:** C → H → K and supports I for commerce.

**Learning classification:** validated backend architectural rule.

### LAW 104 — Firebase UID is the domain ownership root

**Core idea:** authenticated Firebase identity establishes the TeamAi ownership root; client-supplied identity claims do not.

**Flow:**

`ID token → verified UID → UID-rooted domain path → authorized server operation → durable state`

**Connects:** A → B → C → I.

**Learning classification:** validated backend identity rule.

### LAW 105 — Firebase project identity is an architecture invariant

**Core idea:** all Firebase-dependent surfaces must point to the same authoritative project identity.

**Flow:**

`Auth + Firestore + Hosting + Web SDK + CLI + Edge runtime → same project identity → safe diagnosis/deployment`

**Connects:** B → C → J → K.

**Learning classification:** validated environment/architecture rule.

### LAW 106 — Workspace rulesets are subordinate adapters

**Core idea:** workspace-native knowledge can vary by platform without creating a competing TeamAi constitution.

**Flow:**

`Product Law → ORUCAVEAM → TeamAi responsibility → workspace ruleset → native workspace operation`

**Connects:** D → E → G → H.

**Learning classification:** reconciled governance design rule; GitHub is first concrete workspace model.

### LAW 107 — Skills must evolve without silently expanding authority

**Core idea:** better knowledge and more permission are different changes.

**Flow:**

`learning → governance reconciliation → skill change → verification → Product Knowledge → versioned promotion`

**Connects:** E → G → H → L, and I for ZipSkills.

**Learning classification:** reconciled skill-governance rule.

### LAW 108 — Team knowledge must survive separated AI applications

**Core idea:** provider separation is acceptable; project-knowledge fragmentation is not.

**Flow:**

`user authority + project context + discussion + durable state + workspace state + evidence/handover → authorized context packet → eligible Seat`

**Connects:** A → E → F → G → K → L.

**Learning classification:** reconciled Web AI coordination rule.

### LAW 109 — ZipSkills is a skill package, not an authority package

**Core idea:** commercial packaging can sell validated skill knowledge without creating undeclared permission paths.

**Flow:**

`validated skills → versioned package → compatibility/verification metadata → purchase/enablement → separately evaluated authorization`

**Connects:** H → I → L.

**Learning classification:** planning/commercial design rule, not completed commerce implementation.

### LAW 110 — Workspace choice shapes configuration without fragmenting TeamAi

**Core idea:** user workspace choice changes native operating context, recommendations, guidance, and validation while retaining one TeamAi-wide authority model.

**Flow:**

`workspace choice → ruleset → Responsibility Profile → skill resolution → capability/authorization → task eligibility → native workspace operation`

**Connects:** E → G → H → J.

**Learning classification:** reconciled workspace/configuration rule.

## 2. The law-system operating picture

The laws are not independent. The central reasoning is aligned with the canonical Product Law resolution order:

```text
WHO?
Human authority + Seat identity
        ↓
WHAT RESPONSIBILITY?
Development Field + Responsibility Profile
        ↓
WHERE / IN WHAT CONTEXT?
Workspace + workspace ruleset
        ↓
HOW?
Skills + workspace-native procedure
        ↓
WITH WHAT?
Capabilities / tools
        ↓
MAY IT?
Authorization
        ↓
MAY IT NOW?
Task state + scheduler eligibility
        ↓
DOES IT LEAVE PROOF?
Durable execution + event/result + verification
        ↓
HOW DOES THE TEAM CONTINUE?
Integration + handover + knowledge continuity
        ↓
WHAT DID WE LEARN?
Product Knowledge
        ↓
WHAT IMPROVES?
Future skill/workspace knowledge
```

The loop is deliberately **closed without making learning authoritative**. Learning may propose or justify future changes, but a change to authority returns to the Product Law/governance layer first.

## 3. Validated Patterns [DO]

| ID | Pattern | Evidence / basis | Status |
|---|---|---|---|
| PK-BASE-001 | Canonical work traces Product Law → Masterplan → Policy/ORUCAVEAM → skill(s) → implementation → verification → handover/endorsement. | TeamAi governance baseline and implementation traceability rule. | BASELINE |
| PK-BASE-002 | Skill references should point to complete executable paths and link deeper context explicitly. | Skill wiring baseline. | BASELINE |
| PK-BASE-003 | Deterministic browser verification belongs in Playwright when real browser behavior is required; deployment surfaces remain non-authoritative. | Browser verification baseline. | BASELINE |
| PK-BASE-004 | ORUCAVEAM letters should resolve to direct execution skills; domain/field skills compose with them rather than duplicating the execution constitution. | ORUCAVEAM skill reconciliation. | BASELINE |
| PK-BASE-011 | F0–F7 is field identity only; legal boxes remain Shell, Panel, Card, Control, Navigation; F6/F7 are system surfaces. | 029 reconciliation and theme foundation. | BASELINE |
| PK-BASE-012 | Backend-owned execution facts cross into spatial UI through explicit typed contracts and read-only presentation/validation, while backend runtime retains authority. | PR #46/#47 validator work and backend runtime gate. | VALIDATED |
| PK-WF-001 | Web AI responsibility is modeled by Responsibility Profile, not provider/model alone. | Product Law workforce model. | VALIDATED |
| PK-WF-002 | Application Integration & Contracts is the frontend/backend seam without becoming a second authority. | Product Law field model + validator contracts. | VALIDATED |
| PK-WF-003 | Population size changes responsibility breadth/specialization, not authority hierarchy. | Product Law 2–8 Seat model. | VALIDATED |
| PK-WF-004 | A skill is guided operational capability, not authorization. | Product Law responsibility and scheduler model. | VALIDATED |
| PK-WF-005 | Main Integration / Team Lead is coordination responsibility, not automatic ownership of all Fields. | Product Law integration model. | VALIDATED |
| PK-WF-006 | Team summarisation is coordination evidence and must preserve material decisions, disagreements, constraints, warnings, unresolved questions, and evidence. | Product Law team-lead model. | VALIDATED |
| PK-WF-007 | Branches are work/reconciliation surfaces; history is preserved by multiple evidence-bearing artifacts, not branch count alone. | Product Law branch/history model. | VALIDATED |
| PK-WF-008 | User-facing team configuration must expose responsibility, skills, capabilities, scope, operations, approvals, and integration role. | Product Law configuration requirements. | VALIDATED |
| PK-WF-009 | Web AI Seats cooperate through durable state transitions and scheduler eligibility, not direct provider-to-provider control. | Product Law orchestration boundary. | VALIDATED |
| PK-WF-010 | GitHub is the first concrete coding workspace model. | Product Law workspace model. | VALIDATED |
| PK-WF-011 | A four-seat coding pattern can use three specialists plus one Main Integration/Team Lead Seat. | Product Law explicit topology. | VALIDATED |
| PK-WF-012 | Responsibility coverage, branch inventory, and historical provenance are separate reconciliation dimensions. | Product Law branch/history model. | VALIDATED |

## 4. Reconciled workforce learning

| ID | Learning | Evidence basis | Status |
|---|---|---|---|
| PK-WF-013 | Whole-team knowledge continuity is a first-class coordination requirement. | LAW 108 / workspace continuity design. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-014 | Workspace ruleset repositories act as subordinate adapters mapping platform-native behavior into TeamAi responsibility concepts. | LAW 106. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-015 | Workspace selection should alter native configuration and skill recommendation without creating another constitution. | LAW 110. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-016 | Skill growth should be evidence-backed, versioned, traceable, and separated from authority expansion. | LAW 107. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-017 | ZipSkills should package validated skill knowledge/workspace mappings without becoming a permission grant. | LAW 109. | PLANNING / GOVERNANCE-DESIGN |
| PK-WF-018 | Spatial Theme, guides, and dictionary should derive from the same canonical workforce vocabulary. | LAW 110 + 029 design baseline. | GOVERNANCE-DESIGN / VALIDATED MODEL |

## 5. Responsibility-to-skill map

| Development Field | Responsibility | Typical skill families | Hard boundary |
|---|---|---|---|
| Product & Governance | Authority, Product Law, policy, decision boundaries | product-law, governance, ORUCAVEAM | Does not silently grant permission through documentation. |
| Backend & Runtime | Identity, durable state, task lifecycle, provider/execution, commerce | backend/runtime, state, execution, commerce | Does not become visual authority. |
| Frontend & Experience | Presentation, interaction, accessibility, responsive behavior | frontend, spatial, accessibility, browser | Does not invent backend truth or scheduler authority. |
| Application Integration & Contracts | Typed contracts, adapters, mappings, semantic reconciliation | contract, integration, adapter | Does not become second backend, scheduler, or frontend authority. |
| Verification & CI/Browser | Deterministic proof | CI, Playwright, verification | Passing proof does not create authority or prove untested external runtime. |
| Documentation, Knowledge & Handover | Traceability, handover, endorsement, validated learning | documentation, learning/handover | Does not invent implementation truth. |
| Recovery, History & Reconciliation | Recovery, provenance, safe reconciliation | recovery, minimal-tool, reconciliation | Does not rewrite history or create parallel authority. |
| Delivery & Operations | Bounded release, hosting, observation | release, hosting, operations | Does not replace Product Law, backend, or scheduler authority. |

## 6. Seat and scheduler learning

The durable Seat concept is:

`Seat → Fields → skills → capabilities → authorization → workspace/ref scope → task requirements → scheduler eligibility`

And permission levels remain distinct:

`read ≠ propose ≠ implement ≠ commit ≠ PR ≠ approve ≠ merge ≠ canonical-document mutation ≠ coordinate ≠ summarise`

The scheduler must evaluate the complete intersection, not branch names, recency, or model prestige.

## 7. Workspace learning

GitHub's current coding model is:

`repository → branch/ref → commit → pull request → review → Issue/task → verification → merge → main`

This is a **workspace-specific flow**, not a universal law for every future platform.

A future workspace ruleset should preserve the same TeamAi conceptual layers while translating native primitives honestly rather than pretending every platform is GitHub.

## 8. Knowledge continuity learning

For separated external AI applications, the useful unit of handoff is an **authorized context packet**, not merely a copied previous answer.

```text
authority
+ purpose/current state
+ relevant discussion
+ durable state
+ workspace state
+ restrictions/decisions
+ evidence
+ handover
        ↓
context packet
        ↓
next eligible Seat
```

This preserves team coherence while maintaining the prohibition on direct provider-to-provider orchestration.

## 9. Spatial and human-facing learning

The Spatial Theme is a map of the workforce:

`Seat → responsibility → skills → capability → authorization → workspace → task → status → evidence → integration`

The UI can make these relationships understandable, but durable backend state, authorization, scheduler eligibility, repository state, and external entitlements remain authoritative in their respective boundaries.

## 10. Commerce and ZipSkills learning

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

ZipSkills belongs inside the skill-evolution loop, not above it:

`validated knowledge → skill version → workspace mapping → package → user enablement → separate authorization evaluation`

Commercial names, packages, prices, limits, and exact catalogs remain planning-only until explicitly approved and runtime-supported.

## 11. Anti-Patterns & Dead Ends [DONT]

| ID | Anti-Pattern | Consequence | Resolution |
|---|---|---|---|
| AP-BASE-001 | Duplicate execution-discipline documents. | Rule drift. | Keep Policy/ORUCAVEAM canonical and route through skills. |
| AP-BASE-002 | Skill index treated as wiring authority. | Ambiguous resolution. | Use explicit skill wiring. |
| AP-BASE-003 | Screenshots treated as backend/persistence/authorization/payment proof. | Visual evidence misstates durable truth. | Use authoritative runtime/source evidence. |
| AP-BASE-004 | Deployment suppression used to hide a verification problem. | Failures disappear instead of being diagnosed. | Diagnose and record the bounded limitation. |
| AP-BASE-005 | Duplicate minimal-tool skill created unnecessarily. | Procedure drift. | Reuse the existing minimal-tool-use procedure. |
| AP-BASE-006 | Vercel limitation treated as architecture failure or merge blocker. | Non-authoritative surface becomes a false gate. | Keep authoritative verification model; record cutoff. |
| AP-BASE-012 | Frontend validation treated as backend authorization, scheduler authority, execution completion, or entitlement truth. | Presentation layer becomes shadow authority. | Preserve backend runtime and typed read-only fact contracts. |
| AP-WF-001 | Give every Seat every skill. | Responsibility becomes meaningless. | Equip by Responsibility Profile. |
| AP-WF-002 | Branch name defines Seat authority. | Permission is confused with workspace identity. | Use Seat profile + authorization + task state. |
| AP-WF-003 | Main Integration Seat becomes unrestricted writer to main. | Integration bypass. | Use PR/review/verification/authorization gates. |
| AP-WF-004 | Population size equals permanent branch count. | Branch accumulation. | Separate population, Fields, active branches, provenance. |
| AP-WF-005 | Team summary treated as automatic implementation/approval authority. | Coordination becomes false product truth. | Preserve explicit approval boundaries. |
| AP-WF-006 | GitHub semantics copied directly into every future workspace. | Native semantics are distorted. | Create platform-specific ruleset adapters. |
| AP-WF-007 | Workspace selection replaces Product Law/ORUCAVEAM. | Competing constitutions. | Keep one project-wide authority model. |
| AP-WF-008 | Skill upgrade silently adds permissions. | Knowledge change becomes undeclared control. | Separate knowledge and authority changes. |
| AP-WF-009 | Local AI conversation treated as sufficient whole-team context. | Partial/stale reasoning. | Build an authorized context packet. |
| AP-WF-010 | ZipSkills purchase treated as automatic technical authorization. | Commerce becomes hidden permission path. | Keep entitlement and authorization separate. |

## 12. Contract & dependency gotchas

| Authority / concept | Depends on / affects | Gotcha | Resolution |
|---|---|---|---|
| LAW 101 traceability | all families | Completion becomes claim-only without proof chain. | Require evidence path. |
| LAW 102 service authority | services + backend | Documentation alone cannot prevent authority migration. | Enforce boundaries in code. |
| LAW 103 durable state | execution + commerce | Transient success cannot establish replay/audit/recovery. | Persist identity/state/evidence. |
| LAW 104 Firebase UID | domain + commerce | Client IDs do not prove ownership. | Verify UID server-side. |
| LAW 105 Firebase project | all Firebase surfaces | Similar project names can create false diagnosis. | Reconcile exact authoritative project identity first. |
| LAW 106 workspace ruleset | workspace + skills | Native rules can become competing constitutional rules. | Keep ruleset subordinate and mapped. |
| LAW 107 skill evolution | skills + authorization | Better skill wording can accidentally imply more power. | Reconcile authority separately. |
| LAW 108 knowledge continuity | Seats + orchestration | Local context is insufficient for team cooperation. | Build context packet from authoritative state/evidence. |
| LAW 109 ZipSkills | commerce + skills | Package possession can be mistaken for permission. | Separate commerce entitlement from authorization. |
| LAW 110 workspace choice | settings + skills + guidance | Different workspace could fragment TeamAi. | Change operating context, not constitution. |

## 13. Environment & tool quirks

| Quirk | Impact | Workaround |
|---|---|---|
| Vercel is externally constrained/paused for TeamAi verification. | External hosted browser verification may be unavailable. | Use authoritative GitHub/Playwright routes; do not resume Vercel without explicit approval. |
| Firebase and external services have finite resources. | Wasteful probing can increase cost/limits. | Apply ORUCAVEAM-M minimalistic tool/resource use while preserving evidence quality. |

## 14. Evidence rules

- Evidence must state exactly what was exercised and where.
- Reproducible textual/source evidence is preferred.
- Screenshots are not canonical proof of backend, persistence, authorization, payment, scheduler, or entitlement state.
- Green CI proves only the checks actually executed.
- Deployment artifacts do not by themselves prove architecture completion.
- Live external-service completion requires evidence from the relevant external environment.
- Product Law design projections must not be mislabeled as completed runtime implementation.
- Workspace ruleset design, Team Settings concepts, ZipSkills concepts, and future connectors remain design/planning unless implementation/runtime evidence exists.

## 15. Learning promotion

A lesson enters Product Knowledge only after adequate evidence or an explicitly classified governance/design decision. Promotion must preserve the law relationship:

```text
Law family / hard law
        ↓
observed implementation or evidence
        ↓
validated lesson
        ↓
Product Knowledge
        ↓
future skill/workspace improvement
```

A learning that changes authority cannot bypass Product Law reconciliation.

For generalization to Universal ToolKit:

`TeamAi-specific validated learning → generalized lesson → ToolKit candidate`

ToolKit remains upstream knowledge, not TeamAi authority.

## 16. Secondary document traceability map

The project-file relationship exists, but it is intentionally **secondary to the law-to-law picture above**:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/**/SKILL.md → implementation → verification/evidence → docs/project-guide/HandOver.md → docs/project-guide/Endorsement.md → PRODUCT-KNOWLEDGE.md`

This chain explains where the law is operationalized and evidenced; it does not define the law itself.

## Rules

- Never use Product Knowledge to redefine Product Law.
- Never treat the law picture as a license to collapse distinct authorities.
- Never store raw session logs or speculative ideas as knowledge.
- Never silently delete a validated knowledge row; supersede it with an explicit relationship when needed.
- Preserve the evidence path for every validated lesson.
- Keep future workspace implementations, Team Settings UI, ZipSkills commerce, and unimplemented cross-application connectors clearly labeled as design/planning until runtime evidence exists.
- Keep law-family consolidation semantic: merge duplicated meaning, not merely similar wording.
- Keep the hard-law register contiguous and numerically ordered from LAW 101 through LAW 110.
- Keep the numerical spine and family dependency graph together: the spine gives one canonical sequence; family links explain cross-cutting relationships without creating duplicate laws.
