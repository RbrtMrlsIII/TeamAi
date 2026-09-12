# Product Law Frontend Extension — Highest-Stake Experience Question

**Status:** NORMATIVE PRODUCT-LAW EXTENSION / FRONTEND ARCHITECTURE BASELINE  
**Parent authority:** `PRODUCT_LAW.md`  
**Current experience ledger:** Issue #278  
**Structural inventory:** `docs/TEAMAI_3D_HERO_TREE_CENSUS.*`  
**No 029-release claim.**

This document records the highest-stake unresolved frontend/product question for future diagnosis and development:

> **What exact product experience does a user traverse from the public entrance to an authorized, configured, executable Web AI team, and what semantic 3D trees/branches/divisions represent each stage without becoming a second authority?**

This is a Product Law extension, not a second roadmap and not an implementation shortcut. It exists so future agents do not optimize isolated screens while the product sequence, tree semantics, backend seam, spatial machine, interaction language, and public information architecture remain undefined.

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

## 10. Spatial interaction-state law

Every tree, branch, division, and Seat MUST have an explicit interaction-state model. A visual treatment cannot be invented independently by each component.

The minimum state vocabulary is:

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

Not every node needs every state visually, but every implemented state must have a defined semantic meaning and a defined presentation response. `CLICKED` is an input transition, not a durable state; it normally resolves into `SELECTED`, `OPENING`, an authorized action state, or an explicit blocked/error state.

### State-to-presentation contract

| State | Semantic meaning | Animation / transition | Camera | Lighting / ambient | Effects | Interaction |
|---|---|---|---|---|---|---|
| Inactive | present but not participating | low-frequency ambient motion only; no attention-seeking expansion | world/default framing | baseline ambient field | restrained particles/glow | hover/focus allowed where accessible |
| Active | participating in current configured world state | continuous but bounded active motion | may remain in world framing or follow active subject | increased local activity | semantic status effects permitted | normal interaction |
| Hover | pointer/focus is over an actionable or inspectable node | short reversible emphasis; never changes durable state | no automatic camera jump | local emphasis only | outline/glow/label lift as appropriate | pointer/keyboard affordance |
| Selected | user chose the semantic node | persistent selected treatment; no flicker | camera may travel to the selected subject | selected division receives stronger local field | connection previews and payload affordances allowed | branch/division controls available |
| Focus | keyboard/accessibility navigation target | visible focus treatment independent of pointer hover | camera movement only if needed for visibility | accessible contrast/field | no effect may be the sole focus indicator | Enter/Space/action semantics |
| Pressed / Clicked | input was accepted | tactile micro-transition, then resolve to resulting state | no arbitrary camera movement | transient response | brief feedback only | invokes authorized presentation/action transition |
| Opening | expansion is being staged | smooth stateful choreography, not instant coordinate swap | camera subject interpolates with expansion | ambient field follows opening region | wiring corridors/effects establish in sequence | interaction may be bounded until stable |
| Open | payload is exposed | stable resting state with subtle living motion | subject framing accommodates full payload | full local field | semantic connections/effects visible | controls/configuration accessible |
| Closing | payload is being retracted | smooth reversal preserving identity | camera returns or transitions to parent subject | local field contracts | connections retract semantically | interaction bounded during transition |
| Disabled / Unavailable | known but not currently controllable | no misleading active animation | camera does not imply actionability | muted but still readable | no false-success effects | explain reason where authorized |
| Error / Blocked | action/state cannot proceed | restrained diagnostic transition | camera remains on relevant subject | diagnostic emphasis | explicit state indicator | reason-bearing recovery/help path |

### Interaction precedence

The presentation state must resolve deterministically when states overlap:

```text
blocked/error reason
    > disabled/unavailable
    > pressed transition
    > selected/opening/open/closing
    > focus
    > hover
    > active
    > inactive
```

This is a presentation precedence rule only. It does not change backend authorization or task state.

### Effects law

Effects must communicate semantics, not merely decoration. A pulse may represent activity, a connection flow may represent an actual semantic edge, an error field may represent a blocked state, and an expansion effect may represent the opening of a real payload. Decorative effects MUST NOT be used as evidence of backend execution.

No effect may obscure text, controls, accessibility focus, connection topology, or the user's understanding of state.

## 11. Camera capability law

Camera behavior is a product capability of the spatial machine, not an incidental renderer function.

The camera must conceptually support:

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

Camera subject identity follows semantic identity, never a hard-coded coordinate. Camera travel must be continuous where the interaction calls for travel. A fixed prototype lerp duration is an implementation baseline, not Product Law.

When a division expands, the camera must reserve sufficient framing for its actual payload and adjacent connection corridors. It must not zoom to an arbitrary universal distance.

Camera movement MUST NOT be the only way to understand a state change. Keyboard focus, labels, semantic status, and accessible controls remain available independently.

## 12. Settings surface and categorical map

The top settings dropdown is **not yet the final structure**. Product Law therefore defines its semantic responsibility without freezing a premature visual layout.

Its purpose is to provide a categorical map of the user's 3D world and account-level controls. The canonical conceptual categories are:

| Category | Smaller contents / purpose |
|---|---|
| **Seats** | Overall Seats belonging to the user's authorized durable data |
| **Tree 1–8** | The eight major world/tree slots and their semantic branches |
| **Branches** | Smaller branches/divisions exposed by the selected trees |
| **Privacy Policy** | Legal/privacy contents; accessible from the public entrance as well as appropriate signed-in surfaces |
| **Terms** | Terms and conditions contents; accessible from the public entrance as well as appropriate signed-in surfaces |
| **Logout** | Sign-out action for an authenticated session |
| **Return** | Return to the public entrance |

The category labels are a conceptual map, not a promise that the final dropdown will literally contain these exact UI rows. The final structure must remain discoverable, accessible, responsive, and consistent with the semantic tree registry.

The dropdown MUST NOT become a second navigation authority. It is a control surface over the same canonical world/tree/branch identities.

### Settings-to-world relationship

```text
Settings category
      ↓
semantic tree / branch identity
      ↓
selected/focused world subject
      ↓
authorized read model or presentation preference
```

Selecting a category may focus or expand a corresponding division, but it must not fabricate durable state or bypass the normal authorization boundary.

## 13. Public entrance information architecture

Privacy Policy and Terms are public legal information and therefore belong in the **Entrance information architecture**, not exclusively inside the authenticated 3D world.

The public entrance must conceptually provide:

```text
PUBLIC ENTRANCE
├── Hero / TeamAi entrance presentation
├── About TeamAi
├── Complex Dictionary / User Guide
│   ├── how TeamAi works
│   ├── account and identity
│   ├── Workplaces / Projects / Seats
│   ├── 3D world / trees / branches / divisions
│   ├── configuration and settings
│   ├── Skills / Toolkit / Capabilities
│   ├── Connections / providers
│   ├── authorization / readiness
│   ├── commerce / billing / entitlements
│   ├── turns / scheduler / turn loop
│   ├── evidence / tasks / results / handover
│   ├── Privacy Policy guidance
│   └── Terms guidance
├── Contact Us
├── Credits
│   ├── Agents / AI contributors
│   ├── Anthropic / Claude
│   ├── xAI / Grok
│   ├── OpenAI
│   ├── GitHub
│   ├── Supabase
│   ├── Firebase
│   ├── PayPal
│   ├── Vercel
│   ├── Composio
│   └── Termux
└── Footer
```

The **Complex Dictionary** is a first-class user-guidance surface. It must be searchable and organized by the same conceptual vocabulary used by the product: account, commerce, Seats, trees, branches, configuration, connections, Skills, capabilities, authorization, turns, evidence, and other user-facing features. Its purpose is to let a user encounter a feature and then find a clear explanation of what it means, why it exists, and how it behaves.

The Dictionary MUST NOT become a second Product Law authority. It translates canonical product concepts into user guidance. Legal documents remain the authoritative legal texts; the Dictionary may explain and link to them but must not silently rewrite them.

### Entrance-to-world boundary

The entrance is the public information and trust surface. The 3D world is the interactive product machine. They may share visual language and selected atmospheric elements, but their responsibilities remain distinct:

```text
PUBLIC ENTRANCE
  → understand TeamAi
  → learn how it works
  → read legal/privacy information
  → contact / credits
  → choose to enter the 3D world

3D WORLD
  → inspect / restore / configure authorized team state
  → prepare Seats
  → establish readiness
  → start and observe authorized team turns
```

The public entrance MUST remain usable without requiring an authenticated 3D session for public information, legal documents, contact, or credits.

## 14. Entrance-to-world visual continuity

The entrance may use Hero imagery, atmospheric motion, 3D previews, or a restrained world motif, but those effects must not imply that the live authenticated machine is already running.

The transition into the world should communicate a deliberate change of mode:

```text
public information space
        ↓
user chooses 3D entry
        ↓
world initializes
        ↓
default eight-seat spatial machine
```

The world may begin with gentle rotation/ambient activity. User input takes precedence and should establish direct control without fighting the user. Exact rotation speed, camera distance, easing, lighting, particle density, and effect timing remain implementation parameters until validated against the spatial contracts and browser/device evidence.

## 15. 3D division and expansion model

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

## 16. Expansion state machine

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

## 17. Turn-loop spatial contract

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

## 18. Current frontend reality versus target

| Concern | Current repository reality | Product Law target |
|---|---|---|
| Public entrance | classic entrance exists at `/` | remains canonical front door |
| Entrance information | core website exists; full dictionary/contact/credits IA is not yet the complete shipped surface | public information architecture defined above |
| Legal access | legal surfaces are not yet frozen into final entrance IA | Privacy Policy and Terms publicly reachable from entrance |
| Explicit world entry | exists | explicit, deliberate transition |
| Default world | Hero renderer exists and supports flexible 1–8 seats | eight-seat semantic default population |
| 3D rotation | current Hero presentation remains implementation-specific | default world may gently rotate until user takes control; exact timing requires owned runtime evidence before freeze |
| Settings dropdown | exists but is not final | categorical map over Seats, trees, branches, legal/account controls and return |
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

## 19. Freeze / evolution rule

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
What animation/transition/effect represents each relevant interaction state?
What does inactive/active/selected/hover/focus/pressed/open/blocked mean here?
What is the responsive/reduced-motion equivalent?
What evidence proves the claimed state?
```

A change that cannot answer those questions stops for reconciliation instead of inventing a geometry-first implementation.

The numbered registry, branch naming grammar, interaction-state contract, camera capability law, settings categorical map, entrance information architecture, current frontend reality table, and chronological experience sequence must remain synchronized with the Tree Census and Issue #278. This extension does not authorize durable frontend writes, payment execution, provider secrets, or scheduler bypass.
