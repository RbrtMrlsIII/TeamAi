# Product Law Frontend Extension — Highest-Stake Experience Question

**Status:** NORMATIVE PRODUCT-LAW EXTENSION / FRONTEND ARCHITECTURE BASELINE  
**Parent authority:** `PRODUCT_LAW.md`  
**Current experience ledger:** Issue #278  
**Structural inventory:** `docs/TEAMAI_3D_HERO_TREE_CENSUS.*`  
**No 029-release claim.**

This document records the highest-stake unresolved frontend/product question for future diagnosis and development:

> **What exact product experience does a user traverse from the public entrance to an authorized, configured, executable Web AI team, and what semantic 3D trees/branches/divisions represent each stage without becoming a second authority?**

This is a Product Law extension, not a second roadmap and not an implementation shortcut. It exists so future agents do not optimize isolated screens while the product sequence, tree semantics, backend seam, and spatial machine remain undefined.

## 1. Canonical product experience sequence

The intended chronological experience is:

```text
01  PUBLIC ENTRANCE
    conventional website identity, information, and ordinary navigation
        ↓
02  3D WORLD ENTRY
    explicit user action enters the single spatial Hero instance
        ↓
03  WORLD DEFAULT
    readable 3D machine at its normal world baseline
    with the configured population represented as the initial seat ring
        ↓
04  AUTHENTICATION
    user signs in; Firebase establishes authoritative identity
        ↓
05  RESTORE USER STATE
    TeamAi loads the user's authorized durable state and reconstructs
    the user's Workplace / Project / Web AI Seat configuration
        ↓
06  CONFIGURATION ACCESS
    authorized configuration surfaces become available for seats,
    connections, behavior, skills, capabilities, workspace scope, etc.
        ↓
07  READINESS
    each participating Seat is evaluated through the reason-bearing
    readiness chain before it can act
        ↓
08  USER STARTS TEAM TURN
    only when required settings, participants, permissions, and
    readiness conditions are satisfied
        ↓
09  TURN LOOP
    scheduler selects the next eligible Seat; contribution is represented
    through real semantic tree/branch connections and durable events
        ↓
10  SHARED WORKSPACE / HANDOFF
    results, evidence, artifacts, and next eligible work remain durable
    and visible through authorized read models
```

The sequence above is the product-facing target. The current frontend is an **intermediate implementation baseline**: the public classic entrance and explicit world entry exist; an eight-seat-capable Hero renderer exists; seat hierarchy presentation exists; an auth handoff panel exists; and a turn-loop control exists. However, the shipped auth panel explicitly reports that Firebase Authentication is not enabled in the current build, restored user state is not yet a proven frontend path, and the current turn-loop control must not be treated as evidence that the full authorized readiness sequence exists.

The current repository also exposes presentation-only configuration machinery for connection, behavior, toolkit, capabilities, authorization, workspace scope, and task/evidence. These are not equivalent to live authenticated domain integration.

## 2. Highest-stake invariant

The frontend must be understood as a **stateful projection of the TeamAi product state**, not as a collection of pages.

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

In particular:

- an attractive Seat does not prove a configured Seat;
- an expanded branch does not prove authorization;
- a connected-looking wire does not prove a backend connection;
- a visible "Start turn" control does not prove scheduler eligibility;
- a restored UI cache does not prove durable state unless it was re-read from the authorized source;
- a successful animation does not prove an event was persisted.

## 3. Semantic tree registry: numbers and naming

The first architectural gap to close is the lack of one numbered semantic registry for the major frontend roots that future frontend and backend work must share.

The initial canonical registry is:

| Root No. | Root ID | Tree name | Product role | Primary backend seam | 3D presentation role |
|---:|---|---|---|---|---|
| 000 | `ROOT-MACHINE` | TeamAi Spatial Machine | top-level spatial container | none; presentation shell | owns world coordinate frame, navigation, expansion budget |
| 010 | `TREE-ENTRANCE` | Public Entrance | public website identity and entry | public delivery + future auth handoff | non-machine/public surface; may host passive Hero atmosphere |
| 020 | `TREE-WORLD` | World / Seat Ring | spatial machine overview | read model of active team population | default rotating world and initial seat population |
| 030 | `TREE-DOMAIN` | Domain Structure | Account → Workplace → Project → Seat | Firestore durable domain model | semantic projection of durable hierarchy; never authoritative |
| 040 | `TREE-SEAT` | Web AI Seat Machine | Seat Shell → operational divisions | Firestore + trusted Edge APIs | primary expandable Seat machine |
| 050 | `TREE-CONNECTION` | Connection | external provider/application relationship | trusted connection/bind/test surfaces | provider connection/health branch |
| 060 | `TREE-BEHAVIOR` | Behavior / Turn Configuration | participation and turn rules | persisted Seat/project settings | turn-behavior division |
| 070 | `TREE-TOOLKIT` | Toolkit / Skills | procedural equipment and skill bundle | skill-resolution/read-model seam | optional equip division |
| 080 | `TREE-CAPABILITY` | Capabilities | what mechanisms can run | capability/read-model seam | capability inventory division |
| 090 | `TREE-AUTHORIZATION` | Authorization | permitted control and current reason | server authorization boundary | authorization/readiness division, never a grant authority |
| 100 | `TREE-WORKSPACE` | Workspace Scope | workplace/project/repository/runtime context | Firestore + workspace integration | workspace/scope division |
| 110 | `TREE-ORCHESTRATION` | Turn / Orchestration | active contribution and next-eligible Seat | scheduler + durable task/event state | active-turn/contribution graph |
| 120 | `TREE-EVIDENCE` | Task / Evidence | durable result, artifact, history | Firestore durable results/events/artifacts | evidence/trace division |
| 130 | `TREE-SETTINGS` | Settings | cross-cutting user presentation preferences | user/profile/settings state as authorized | settings surface; not a seat child |
| 140 | `TREE-COMMERCE` | Commerce / Entitlement | billing and entitlement state | PayPal + Firestore | normal UI/commerce surface; not a mandatory Seat branch |

Root numbers are semantic registry identifiers, not coordinates, z-order, mesh indices, or implementation file numbers. A future root may be introduced only by a governed amendment to this registry and the synchronized tree census.

## 4. Branch naming grammar

Every branch is named from meaning and parentage rather than geometry:

`<TREE-ID>.<DOMAIN>.<RESPONSIBILITY>.<LEAF>`

Examples:

```text
TREE-ENTRANCE.PUBLIC.IDENTITY
TREE-WORLD.POPULATION.SEATS
TREE-DOMAIN.ACCOUNT.WORKPLACE
TREE-DOMAIN.WORKPLACE.PROJECT
TREE-DOMAIN.PROJECT.SEAT
TREE-SEAT.SHELL.OVERVIEW
TREE-SEAT.CONNECTION.HEALTH
TREE-SEAT.BEHAVIOR.TURNS
TREE-SEAT.TOOLKIT.SKILLS
TREE-SEAT.CAPABILITY.INVENTORY
TREE-SEAT.AUTHORIZATION.READINESS
TREE-SEAT.WORKSPACE.SCOPE
TREE-SEAT.TASK.EVIDENCE
TREE-ORCHESTRATION.TURN.ACTIVE-SEAT
TREE-ORCHESTRATION.TURN.HANDOFF
TREE-EVIDENCE.RESULT.DURABLE
```

A branch identifier must remain stable when its physical placement changes. Renaming a branch is a semantic change and therefore requires census reconciliation and impact review across backend contracts, frontend bindings, tests, and evidence.

## 5. Seat machine: canonical branch roles

The existing `TREE-HERO-SEAT` vocabulary is retained as the first concrete Seat tree. Its branches become:

| Branch ID | Human meaning | Primary responsibility | Backend authority | Expansion payload |
|---|---|---|---|---|
| `SEAT_SHELL` | Seat identity/overview | identify the participating Web AI Seat | Firestore Seat record + authorized read model | identity, status, summary |
| `SEAT_CONNECTION` | Connection/provider state | bind/test/inspect external relationship | trusted Edge connection surfaces | provider, runtime, health, connection actions |
| `SEAT_BEHAVIOR` | Participation behavior | define how this Seat participates in turns | persisted configuration + policy | turn mode, participation defaults, constraints |
| `SEAT_TOOLKIT` | Procedural equipment | equip skill bundles and procedures | governed skill resolution | selected skills, field procedures, tool bindings |
| `SEAT_CAPABILITIES` | Mechanism inventory | expose what is available | capability/read model | tools, plugins, MCP, model/runtime capability |
| `SEAT_AUTHORIZATION` | Permission/readiness | present reason-bearing authorization state | server authorization | allowed scope, blockers, approval state |
| `SEAT_WORKSPACE_SCOPE` | Operating context | connect Seat to workplace/project/repo scope | Firestore + workspace integration | workspace, repo/path/ref, scope boundaries |
| `SEAT_TASK_EVIDENCE` | Work/evidence continuity | show current task/result/evidence | Firestore durable task/event/result state | task state, event trace, artifacts, handoff |

These branches are **not** the entire product. They are one Seat-oriented tree inside the larger multi-tree machine.

## 6. World tree and eight-seat default

The default world presentation must have a deterministic, semantic population model rather than anonymous decorative cubes.

The current renderer already supports a flexible population from 1 through 8 and builds identifiers such as `seat-1` through `seat-N`. The Product Law target is stronger:

```text
WORLD-01 → Seat slot 1
WORLD-02 → Seat slot 2
WORLD-03 → Seat slot 3
WORLD-04 → Seat slot 4
WORLD-05 → Seat slot 5
WORLD-06 → Seat slot 6
WORLD-07 → Seat slot 7
WORLD-08 → Seat slot 8
```

The default product population is **eight seats** for the world baseline, while actual user population remains governed by configured durable state and entitlement/authorization. Empty or inactive slots must be semantically distinguishable from configured active Seats.

A rendered slot is not a durable Seat identity. A durable Seat identity must be restored from authorized user/project state and mapped into the spatial registry.

## 7. Configuration and backend seam

The frontend/backend mapping must be explicit:

```text
TREE-DOMAIN
  → Firestore account/workplace/project/seat hierarchy

TREE-SEAT
  → Seat read model + trusted configuration APIs

TREE-CONNECTION
  → connection test / provider bind / OAuth or provider handoff

TREE-BEHAVIOR
  → persisted turn configuration

TREE-TOOLKIT
  → effective skill bundle resolution

TREE-CAPABILITY
  → available mechanism read model

TREE-AUTHORIZATION
  → server-authorized permitted control + reasons

TREE-WORKSPACE
  → workspace/project/repository/scope state

TREE-ORCHESTRATION
  → scheduler eligibility + durable task/event state

TREE-EVIDENCE
  → durable result/event/artifact state

TREE-COMMERCE
  → aggregate status + entitlement projection
```

The bridge between frontend and backend is the **Integration/Contracts Field**, not ad hoc fetches from individual 3D branches. Each branch should consume a typed read model or authorized action contract whose owner is explicit.

## 8. 3D division and expansion model

The machine has three spatial scales:

### Level 0 — World

Whole machine, seat population, major navigation, workspace center, and global connection corridors.

### Level 1 — Tree

A selected semantic tree becomes the camera subject and gains its own expansion budget.

### Level 2 — Division / Branch

A selected division opens to expose its actual UI/product payload.

A division's footprint is derived from:

```text
base geometry
+ content payload size
+ controls / configuration surface
+ label/readability area
+ neighboring clearance
+ connection corridor width
+ camera travel envelope
+ responsive/mobile constraints
```

Therefore:

`footprint(tree) ≠ fixed radius`

and

`footprint(division) ≠ universal branch size`.

The maximum expanded world state is the union of the active division footprints plus required connection corridors and workspace visibility margin.

## 9. Expansion state machine

Every expandable division uses the same semantic lifecycle while allowing different geometry:

```text
CLOSED
  ↓
PREPARING
  ↓
OPENING
  ↓
ACTIVE
  ↓
CLOSING
  ↓
CLOSED
```

The lifecycle is reusable; the geometry is not.

`OPENING` and `CLOSING` must preserve identity, adjacency, connection continuity, camera subject, responsive readability, and reduced-motion equivalence.

A branch that has no semantic payload must not be enlarged merely to create visual drama.

## 10. Turn-loop spatial contract

The active turn is a graph operation, not a decorative animation:

```text
current user-approved turn configuration
        ↓
Scheduler eligibility
        ↓
active Web AI Seat
        ↓
active tree / branch / division
        ↓
connection graph expands along participating path
        ↓
contribution / electricity travels through actual edges
        ↓
next eligible Seat or human/tool
        ↓
durable event/result
        ↓
workspace center / shared evidence
```

The renderer may visualize this path, but the backend owns eligibility, authorization, task state, execution, and durable evidence.

The spatial machine must therefore be able to answer, for every active wire:

`source node → target node → semantic reason → durable/event relationship → visual path`

A wire without a semantic edge is decorative and cannot be used as proof of orchestration.

## 11. Current frontend reality versus target

| Concern | Current repository reality | Product Law target |
|---|---|---|
| Public entrance | classic entrance exists at `/` | remains canonical front door |
| Explicit world entry | exists | explicit, deliberate transition |
| Default world | Hero renderer exists and supports flexible 1–8 seats | eight-seat semantic default population |
| 3D rotation | current Hero presentation remains implementation-specific | default world may gently rotate until user takes control; exact timing requires owned runtime evidence before freeze |
| Authentication | UI handoff exists; current copy says Firebase Auth is not enabled in this build | real Firebase identity handoff |
| Restore user seats | not proven as a shipped frontend path | authorized durable restore before live configuration |
| Configuration | presentation shells/branches exist | consume typed authorized read models/actions |
| Authorization | currently presentation-oriented in Hero | server-owned reason-bearing readiness |
| Start turn | visible control exists | unavailable until readiness conditions are satisfied |
| Turn loop | presentation behavior exists in bounded prototypes | scheduler-backed semantic contribution graph |
| Backend integration | bounded backend surfaces exist separately | explicit Integration/Contracts seam |
| Mobile | browser coverage exists for portions | complete entrance → world → auth → restore → configure → turn acceptance |
| C9 | blocked | integrated owner acceptance |

The current frontend must therefore be diagnosed as a **partially built machine sitting between presentation foundation and authenticated product operation**. Future work must preserve what is already correct while closing the missing semantic and integration layers.

## 12. Freeze / evolution rule

Before implementation changes the frontend machine, the agent must answer:

```text
Which root/tree does this change belong to?
Which branch/division owns the behavior?
What is the stable semantic ID?
What role does it perform?
What backend fact or action does it consume?
What typed contract owns that seam?
What expansion footprint does the real payload require?
What connections must exist before visualization is legal?
What camera subject/travel relationship is required?
What is the responsive/reduced-motion equivalent?
What evidence proves the claimed state?
```

A change that cannot answer those questions stops for reconciliation instead of inventing a geometry-first implementation.

The numbered registry, branch naming grammar, current frontend reality table, and chronological experience sequence must remain synchronized with the Tree Census and Issue #278. This extension does not authorize durable frontend writes, payment execution, provider secrets, or scheduler bypass.
