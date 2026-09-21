# Product Law Field Contract — Frontend Experience

**Status:** ACTIVE FIELD CONTRACT, SUBORDINATE TO `Product_Law/PRODUCT_LAW.md`
**Current experience ledger:** Issue #278
**Structural inventory:** `docs/TEAMAI_3D_HERO_TREE_CENSUS.*`
**No 029-release claim.**

This document is the Frontend & Experience field contract derived from the former normative frontend extension. It defines presentation-facing semantics, sequence, tree vocabulary, guest/authenticated distinction, and machine-facing interaction expectations without becoming a second Product Law authority.

Product meaning, invariants, authority boundaries, and development-field ownership remain governed by `Product_Law/PRODUCT_LAW.md`. `Product_Law/WIRING.md` routes this field. `docs/VISION.md` owns living product-experience intent. The Tree Census owns structural implementation inventory. Technical machine contracts own implementation detail.

## 1. Experience sequence

**Current truth status:** this contract records the current product-facing frontend truth. It is deliberately not final UI lock-in. Governed implementation evidence may add, refine, or replace a rule while preserving Product Law authority.

```text
01 PUBLIC ENTRANCE
   ↓
02 3D WORLD ENTRY
   ↓
03 WORLD DEFAULT / TEN-SEAT PRESENTATION
   ↓
04 AUTHENTICATION
   ↓
05 RESTORE AUTHORIZED USER STATE
   ↓
06 CONFIGURATION ACCESS
   ↓
07 REASON-BEARING READINESS
   ↓
08 USER-STARTED TEAM TURN
   ↓
09 SCHEDULER-BACKED TURN LOOP
   ↓
10 SHARED WORKSPACE / DURABLE EVIDENCE
```

The current frontend is an intermediate implementation baseline. Presentation presence does not establish backend identity, authorization, durable state, scheduler eligibility, provider connectivity, or durable execution.

## 2. Highest-stake frontend invariant

```text
public presentation
    ↓
spatial presentation
    ↓
identity
    ↓
restored durable user state
    ↓
authorized configuration
    ↓
seat readiness
    ↓
scheduler eligibility
    ↓
turn execution
    ↓
durable result / evidence
```

No visible 3D state may imply a stronger backend state than actually exists.

An attractive Seat is not proof of configuration. An expanded branch is not proof of authorization. A connection-looking wire is not proof of a live provider connection. A visible Start Turn control is not proof of scheduler eligibility. A cached restoration is not proof of durable state. An animation is not proof that a durable event was written.

## 3. Semantic product-machine registry

The registry is semantic, not geometric. Numbers are stable identifiers and MUST NOT be interpreted as coordinates, z-order, mesh indices, or implementation file numbers.

| Root No. | Root ID | Product role | Canonical seam |
|---:|---|---|---|
| 000 | `ROOT-MACHINE` | top-level spatial container | presentation shell |
| 010 | `TREE-ENTRANCE` | public website identity and entry | public delivery / auth handoff |
| 020 | `TREE-WORLD` | spatial machine overview and Seat population | authorized read model |
| 030 | `TREE-DOMAIN` | Account → Workplace → Project → Seat | Firestore durable domain |
| 040 | `TREE-SEAT` | Web AI Seat operational machine | Firestore + trusted APIs |
| 050 | `TREE-CONNECTION` | external provider/application relationship | trusted connection surfaces |
| 060 | `TREE-BEHAVIOR` | participation and turn rules | persisted configuration |
| 070 | `TREE-TOOLKIT` | skills and procedural equipment | governed skill resolution |
| 080 | `TREE-CAPABILITY` | available mechanisms | capability/read model |
| 090 | `TREE-AUTHORIZATION` | permitted control and reason-bearing readiness | server authorization |
| 100 | `TREE-WORKSPACE` | workplace/project/repository/runtime scope | Firestore + workspace integration |
| 110 | `TREE-ORCHESTRATION` | active turn and next-eligible Seat | scheduler + durable task/event state |
| 120 | `TREE-EVIDENCE` | results, artifacts, history | durable result/event/artifact state |
| 130 | `TREE-SETTINGS` | cross-cutting presentation/account controls | authorized user/settings state |
| 140 | `TREE-COMMERCE` | billing and entitlement projection | PayPal + Firestore |

A future root requires governed amendment plus Tree Census synchronization.

## 4. Branch identity

Branches are named from semantic parentage, not placement:

`<TREE-ID>.<DOMAIN>.<RESPONSIBILITY>.<LEAF>`

A branch identifier remains stable when its physical placement changes. Renaming is a semantic change and requires impact review across census, frontend bindings, backend contracts, tests, and evidence.

The first concrete Seat vocabulary remains:

`SEAT_SHELL · SEAT_CONNECTION · SEAT_BEHAVIOR · SEAT_TOOLKIT · SEAT_CAPABILITIES · SEAT_AUTHORIZATION · SEAT_WORKSPACE_SCOPE · SEAT_TASK_EVIDENCE`

These branches are one Seat-oriented tree, not the whole product.

## 5. World population

The Guest World presents the complete ten-seat machine capacity:

```text
WORLD-01 → Seat slot 1
WORLD-02 → Seat slot 2
WORLD-03 → Seat slot 3
WORLD-04 → Seat slot 4
WORLD-05 → Seat slot 5
WORLD-06 → Seat slot 6
WORLD-07 → Seat slot 7
WORLD-08 → Seat slot 8
WORLD-09 → Seat slot 9
WORLD-10 → Seat slot 10
```

This is observational presentation capacity. It does not fabricate ten durable configured Seats.

Authenticated state restores the actual authorized durable Seat population, from 1 through 10, into the available world slots. Entitlement, authorization, and durable-state authority remain outside the renderer.

**Tree 1–8 is a separate Settings/world-tree vocabulary and is not the Seat capacity rule.**

Ten is the presentation capacity. Actual user population remains governed by authorized durable state and entitlement/authorization. A rendered slot is not itself a durable Seat identity.

## 6. Frontend/backend boundary

Each product branch consumes a typed read model or authorized action contract owned by the appropriate backend/service seam. Individual 3D branches must not become ad hoc backend clients.

The canonical conceptual mapping is:

```text
TREE-DOMAIN        → Firestore account/workplace/project/seat hierarchy
TREE-SEAT          → Seat read model + trusted configuration APIs
TREE-CONNECTION    → provider connection/test/bind boundary
TREE-BEHAVIOR      → persisted turn configuration
TREE-TOOLKIT       → governed skill resolution
TREE-CAPABILITY    → capability/read model
TREE-AUTHORIZATION → server-authorized permitted control + reasons
TREE-WORKSPACE     → workspace/project/repository/scope state
TREE-ORCHESTRATION → scheduler eligibility + durable task/event state
TREE-EVIDENCE      → durable result/event/artifact state
TREE-COMMERCE      → aggregate entitlement projection
```

## 7. Guest and authenticated state

Guest presentation is observational. Authenticated presentation is user-owned and authorization-bound.

```text
GUEST
→ demonstrative world
→ gentle automatic world/orbital motion
→ authentication invitation
→ no durable-user configuration implied

AUTHENTICATED
→ user-owned restored world
→ guest motion no longer governs the world
→ authorized configuration available
→ world-map settings available
→ readiness can be evaluated
```

Guests may discover the complete intended feature vocabulary and machine presentation, but all product facilities remain locked for guest use. The only guest-accessible product actions are the designated **Sign Up** and **Login** authentication surfaces. **Sign Out** is available only for authenticated state.

Selecting Login or Sign up begins an authentication transition. The transition may use spatial choreography, but choreography is not proof of successful authentication.

After authentication succeeds:

```text
identity established
→ restore authorized durable state
→ restore Workplace / Project
→ restore actual Seat population
→ map durable identities into world slots
→ expose authorized configuration
→ evaluate readiness
→ permit user-started turn only when required conditions hold
```

## 8. Seat reports and transaction loading

Every Seat exposes a report/handoff section for the latest completed turn. Users and authorized participating agents may read that report as the Seat's continuity/read-model and evidence surface.

Long-running Seat transactions use a dedicated semantic loading/orb family rather than one generic product spinner. The family is selected by transaction type, including configuration, connection test, MCP invocation, AI turn/execution, handoff/continuation, Storage operation, Marketplace transaction/verification, authorization, or recovery. Presentation effects do not prove backend completion.

## 9. Entrance information architecture

The public Entrance is the public information and trust surface. Privacy Policy and Terms remain publicly reachable. A comprehensive Dictionary/User Guide may explain product concepts, but it does not become Product Law.

Conceptual public structure:

```text
PUBLIC ENTRANCE
├── Hero / TeamAi identity
├── About TeamAi
├── Dictionary / User Guide
├── Privacy Policy
├── Terms & Conditions
├── Contact
├── Credits
└── Footer
```

The transition into the 3D world is explicit. Entrance presentation and live authenticated machine presentation remain distinct responsibilities while sharing visual language where appropriate.

## 10. Settings semantic map

The authenticated Settings surface is a world/category map over canonical semantic identities, not a second hierarchy.

| Category | Purpose |
|---|---|
| Seats | authorized durable Seats |
| Tree 1–8 | major world/tree slots and semantic branches |
| Branches | divisions exposed by the selected trees |
| Privacy Policy | public legal/privacy content |
| Terms | public terms content |
| Logout | authenticated sign-out |
| Return | return to public Entrance |

Selecting a category may focus or expand a corresponding node, but it cannot fabricate durable state or bypass authorization.

## 11. Spatial levels and expansion

The machine uses three conceptual scales:

```text
Level 0 → World
Level 1 → Tree
Level 2 → Division / Branch
```

A division footprint is derived from payload, controls, labels/readability, clearance, connection corridors, camera travel, and responsive constraints. There is no universal branch radius or fixed payload size.

Every expandable division uses the semantic lifecycle:

```text
CLOSED → PREPARING → OPENING → ACTIVE → CLOSING → CLOSED
```

Geometry may differ. Semantic identity, adjacency, connection continuity, camera subject, responsive readability, and reduced-motion equivalence must remain intact.

## 12. Interaction-state law

The minimum presentation state vocabulary is:

```text
INACTIVE
ACTIVE
HOVER
SELECTED
FOCUS
PRESSED / CLICKED
OPENING
OPEN
CLOSING
DISABLED / UNAVAILABLE
ERROR / BLOCKED
```

`CLICKED` is an input transition, not a durable state. Presentation precedence is:

```text
blocked/error
  > disabled/unavailable
  > pressed
  > selected/opening/open/closing
  > focus
  > hover
  > active
  > inactive
```

Effects communicate semantics only. Decorative effects MUST NOT be treated as backend evidence.

## 13. Camera capability law

The semantic camera capability set is:

```text
WORLD_OVERVIEW
TREE_FOCUS
DIVISION_FOCUS
EXPANSION_FOLLOW
RETURN_TO_PARENT
RETURN_TO_WORLD
CONTINUOUS_TREE_TRAVEL
RESPONSIVE_FRAMING
REDUCED_MOTION_EQUIVALENT
```

Camera subject identity follows semantic identity, never hard-coded coordinates. Exact timing and distance remain implementation parameters until justified by runtime evidence.

## 14. Turn-loop presentation boundary

The active turn is a graph operation, not decoration:

```text
approved turn configuration
→ scheduler eligibility
→ active Seat
→ active tree/branch/division
→ semantic connection path
→ contribution
→ next eligible Seat/tool/human
→ durable event/result
```

The renderer may visualize this path. It cannot select the scheduler actor, establish authorization, mutate provider secrets, or invent durable evidence.

For every visualized active wire, the system must be able to identify:

`source → target → semantic reason → durable/event relationship → visual path`

A wire without a semantic edge is decorative and not proof of orchestration.

## 15. Freeze and evolution rule

Before implementation changes the frontend machine, the agent must identify:

```text
root/tree
branch/division owner
stable semantic ID
product responsibility
backend fact/action consumed
typed integration contract
payload footprint
required connections
camera subject/travel relationship
interaction states
a11y/responsive/reduced-motion equivalent
evidence required
```

A geometry-first change without a semantic owner stops for reconciliation.

## 16. Census synchronization

The Tree Census remains the structural inventory. Product-Law-derived semantic roots and branches MUST remain synchronized with it.

A governed implementation change that adds, removes, renames, materially restructures, or reimplements a tree/branch/division MUST reconcile the applicable registry and census entries in the same change. Runtime implementation status must remain truthful and must not be inferred merely from source presence.

## 17. Authority statement

This file is a subordinate Frontend & Experience field contract. It does not override `Product_Law/PRODUCT_LAW.md`, create permissions, redefine backend authority, replace the Masterplan, replace the current slice, or act as a merge authority.
