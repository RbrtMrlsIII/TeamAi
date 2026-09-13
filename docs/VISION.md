# TeamAi Product Vision — Entrance, Mechanical 3D Hero, Semantic Machine, and Experience

**Status:** Product intent (living) · **single vision home**  
**Authority order:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → **this document** → camera / hierarchy / DOM / theme / tree contracts → implementation slices  
**Claim:** presentation and experience intent only · **not** a Product Law rewrite · **no 029-released claim**

This is the **single product-experience vision** for the public entrance, the mechanical 3D Hero, the semantic tree/branch/division machine, camera subject and travel, machine chrome, unlock/accessibility language, and presentation behavior. New ideas are amended here rather than published as a second vision.

Related technical contracts (owners of detail, not competing visions):

- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_CAM6_MANDATORY_SELECTED_TREE_LOOKAT.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`
- `docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md`
- `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md`
- `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md`

---

## 0. Governance execution (ORUCAVEAM-aligned)

TeamAi uses **one** execution discipline: ORUCAVEAM. There is no second lifecycle hidden inside the visual work. Every vision-driven change follows the same authority and evidence chain.

| Letter | Applied meaning for this vision |
|--------|----------------------------------|
| **O** Objective | State the human-facing outcome and the exact experience capability being changed. |
| **R** Restrictions | Presentation must not invent entitlement, scheduler choice, durable auth, Firestore truth, payment truth, or 029 release status. |
| **U** User Authority | Owner/user endorsement governs visual quality when the environment is fair; vision changes must not silently rewrite Product Law. |
| **C** Canonical Authority | Identify the existing product/contract/root that owns the behavior before coding. |
| **A** Action | Make the smallest justified adjustment; forbid parallel authorities, duplicate runtimes, and duplicate state stores. |
| **V** Verification | Use the proof appropriate to the change: structural/unit checks, browser smoke, Playwright, accessibility/responsive checks, and runtime evidence where applicable. Green CI is evidence, not endorsement. |
| **E** Efficiency | Prefer reconciliation, mapping, tuning, hiding, or extending the canonical owner over rewriting from zero. |
| **A** Audit | Reconcile the applicable Issue, PR, census, checkpoint, HandOver, and product-knowledge record. |
| **M** Minimal tools | Preserve one Hero runtime, one hierarchy runtime, one primary camera apply path, one theme root, one semantic census. |

### 0.1 Starting from zero is forbidden

**Default:** locate the module or contract that already owns the behavior, then adjust it.

New code is allowed only when all of the following are established in the governed change:

1. No existing owner can honestly carry the behavior without violating Product Law, this vision, or an existing canonical contract.
2. The ownership gap is named.
3. The new module has one responsibility, is wired through existing entry points, and cannot become a second bootstrap or second authority.

“We could write it cleaner from scratch” is not permission to start from zero.

### 0.2 Change isolation

A slice may touch only its declared owner set. Changes must not silently cascade into other product domains.

| If you change… | You must not also… |
|----------------|--------------------|
| World / baseline camera | revive 1–15 camera authority or create a second camera table |
| Cam-3/4 orbit/zoom | fork `setCamera` or create a second navZoom store |
| Cam-5/6 selected-subject behavior | bypass semantic subject identity with coordinate-only camera logic |
| Tree/branch identity | use mesh index, ring position, or camera dock as identity |
| Expansion geometry | hard-code a universal branch size or global scale multiplier |
| Unlock flow | fabricate durable entitlement inside the renderer |
| Back / Next | create a second branch walker or duplicate Seat list |
| Settings / Smoke | create another settings island or navigate to another page to prove a feature |
| Theme / scale | create a second theme root or page-local theme authority |
| Entrance | stand up a second Hero/WebGL runtime |
| Connection effects | imply provider authorization from a decorative wire |

### 0.3 PR declaration

Every executable PR that changes vision-owned experience should state:

`Objective · Canonical owner(s) · Allowed files · Forbidden files · Create new? yes/no + reason · Authority clash test · Verification plan`

### 0.4 Evidence labels

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade by implication. Source presence, deployment presence, green tests, or a visual screenshot alone does not establish a stronger evidence state.

---

## 1. Current context and present product truth

This vision is being rewritten because the current project has crossed from isolated camera experimentation into a **mechanical spatial-machine construction problem**. The immediate camera bug revealed a structural issue: the product had **two camera authorities**. The legacy **1–15 inspection camera spine** and the newer **Cam-5/Cam-6 hierarchy-aware camera path** could both influence the same experience. The 1–15 spine is therefore retired. **Cam-5/Cam-6 plus the existing hierarchy runtime is the sole current spatial camera authority.**

The current repository is an intermediate implementation, not a complete 029 release. It already contains:

- the conventional public entrance and explicit entry toward the 3D world;
- a single mechanical Hero renderer capable of a flexible population up to eight Seat slots;
- a partially proven Seat hierarchy and Seat configuration vocabulary;
- semantic camera relationships, including selected-seat subject behavior;
- Settings / machine chrome and an emerging in-page Smoke diagnostic surface;
- planning and contract material for concentric spatial rings;
- backend contracts and durable state boundaries outside the renderer.

The current repository does **not** yet contain a complete multi-tree machine. The tree census records `TREE-DOMAIN`, `TREE-HERO-SEAT`, and `TREE-SKILL-RESPONSIBILITY` with incomplete/partial states where appropriate. Full tree/branch/division topology, final adaptive geometry, complete expansion choreography, final turn-loop electrical paths, and the full authenticated workspace experience remain future governed work.

The current execution reality must also remain visible:

- the public entrance, world entry, camera reconciliation, and presentation work are still presentation work, not proof of 029 release;
- the backend has separately bounded completion and explicit residual evidence boundaries;
- a green CI result is a validation event, not a release endorsement;
- historical checkpoints remain historical evidence even when newer current-state records supersede their active wording;
- issues own durable problem/execution context while comments record evidence rather than creating a competing roadmap;
- PRs are implementation/review boundaries, not replacement Product Law;
- the structured tree census is an observation/semantic baseline and must stay synchronized as the machine evolves.

### 1.1 Current camera authority

The current spatial camera model is:

```text
LEGACY 1–15 inspection spine
        ↓
      RETIRED
        ↓
CURRENT AUTHORITATIVE PATH
Cam-5 / Cam-6 + hierarchy runtime
```

Cam-5/Cam-6 owns the selected-seat / selected-tree subject relationship. Physical docks are implementation mechanisms; the semantic tree/branch identity remains the subject authority. No new code may reintroduce the 1–15 spine as navigation, fallback, registry, traversal authority, or compatibility authority unless a separately governed migration boundary explicitly requires a historical adapter.

### 1.2 Current machine truth

The Hero is intended to be **mechanical**, not a flat 3D logo with conventional product settings permanently sitting beside it. It is a nested machine whose gears, rings, tree divisions, and workspace center reveal product meaning.

The current architecture is still partially transitional. Legacy side stacks and floating DOM controls may exist as absorption debt. They must not be mistaken for the final spatial architecture and must not be allowed to become a second product hierarchy.

---

## 2. Product experience: two complementary layers

TeamAi presents two complementary layers. They must stay conceptually distinct so the user knows whether they are on the public website or inside the spatial machine.

### Layer A — Website entrance (public face)

The first impression is a **normal web product entrance**, not yet “inside the machine.”

The human should perceive:

- a calm, branded web page with TeamAi name, logo, short summary, social links, and a clear hero image communicating networked AI / team collaboration;
- a gently rotating 3D Hero may appear as background atmosphere, inviting but not demanding interaction;
- ordinary web actions such as Learn More, Sign In, and Get Started;
- no implication on this layer that API keys, Seats, GitHub, entitlement, scheduler state, or provider authorization have been configured.

This layer is not:

- Seat configuration;
- entitlement or commerce truth;
- durable auth authority;
- a second product authority outside Product Law.

Implementation stance: primarily additive layout on the existing shell (`public/index.html` / spatial shell), with one theme root and one Hero runtime. A passive background is allowed, but a second WebGL application is not.

### Layer B — 3D Hero machine

Once the user gets started, the Hero becomes the primary spatial instrument: a mechanical machine in which semantic trees and divisions carry product structure.

Its core spatial grammar is:

```text
machine wide
    ↓
open parent / tree
    ↓
open child division
    ↓
open leaf / control
    ↓
return to parent
    ↓
return to machine world
```

The machine is not a decorative shell around an ordinary side-panel application. Configuration, status, state, connection explanation, Seat surfaces, and later workspace interaction should progressively become machine-native where their product law permits it.

### 2.1 The minimum useful Hero is first-class

The smallest valid Hero is the **one-Seat configuration**.

A user who has only one unlocked/eligible Seat does not need a multi-seat display compressed into a corner. The machine should naturally become its **smallest useful mechanical configuration**:

```text
1 active Seat
    ↓
compact Seat mechanism
    ↓
only the currently applicable Seat/product payload
    ↓
shared workspace center
    ↓
chat/conversation with the one WebAi
```

The one-Seat state is therefore not a degraded eight-Seat layout. It is a deliberate product state with its own compact geometry and readable hierarchy.

When additional Seats become unlocked and eligible, the same machine gains active Seat instances while preserving the same semantic contracts. The system should not create eight unrelated Hero implementations.

---

## 3. Machine anatomy and concentric spatial model

The Hero is a **mechanical concentric machine**.

### R0 — Workspace core

The middle of the machine is the user's chosen/configured workspace surface.

It hosts, as applicable:

- conversation/chat and contribution;
- absorb / reflect / handoff;
- task and evidence continuity;
- persistent traces/artifacts;
- active work arriving from connected Seats;
- workspace-tier capabilities such as `WORKSPACE_ZIPSKILLS` where governed.

The center is not empty decoration. It is the shared work surface the machine ultimately addresses.

### R1 — Backend display ring

This ring visually explains backend platforms, rules/docs faces, and meaningful connection threads.

It is presentation only unless an explicit backend contract authorizes more. Animated threads represent semantic wiring; they do not create entitlement, credentials, or authorization.

### R2 — Setup / configuration ring

This ring holds major setup/configuration mechanisms, including mechanical presentation of login/register and other setup flows.

Durable authentication, entitlement, and secure credentials remain outside the renderer. The ring presents the flow; it does not become the authority.

### R3 — Seat ring

The outside ring represents Web AI Seats, the participating agents of the machine.

A Seat selected from the normal world view:

- becomes the camera subject;
- opens mechanically;
- reveals its Seat configuration tree;
- remains connected conceptually toward inner rings and the workspace.

The current concrete Seat tree vocabulary is:

```text
TREE-HERO-SEAT / TREE-SEAT
├── SEAT_SHELL
├── SEAT_CONNECTION
├── SEAT_BEHAVIOR
├── SEAT_TOOLKIT
├── SEAT_CAPABILITIES
├── SEAT_AUTHORIZATION
├── SEAT_WORKSPACE_SCOPE
└── SEAT_TASK_EVIDENCE
```

These are semantic divisions of one Seat machine, not eight unrelated trees.

### 3.1 Whole-machine mechanisms

Whole-machine gears may include:

| Mechanism | Product-facing role |
|---|---|
| Subscription gears | present/unlock more Seat capacity; never self-attest entitlement |
| Discussion gear | planning/discussion-first entry |
| Coding gear | start-coding flow |
| General settings gear | cross-cutting machine settings and controls |
| Seat shells | per-Seat configuration trees |
| Workspace core | shared work surface, artifacts, and traces |

The same open-parent → reveal-children grammar applies to these mechanisms, but each has a different semantic contract.

---

## 4. Census-first construction: the primary future planning method

The machine must now be planned **from the census outward**.

Before building expansion animation, camera roots, transition choreography, lighting effects, or electrical effects for a future division, establish what the division actually is.

### 4.1 The census question set

For each spatially relevant product root, determine:

1. **Is it a 3D tree, a tree instance, a division/branch, a cross-tree mechanism, or a non-spatial authority?**
2. **What is the `treeID`?**
3. **What is the semantic purpose and responsibility?**
4. **How many direct branches/divisions does it contain?**
5. **Does each branch contain sub-branches? If so, what are their identities and depth?**
6. **Which parts are demonstrated today, which are partial, and which remain undefined?**
7. **What payload belongs to each branch?**
8. **What backend/domain authority owns durable truth?**
9. **What is the instance population rule?**
10. **What accessibility/state surfaces are required?**

Coordinates, mesh indexes, ring positions, camera docks, or animation names cannot answer these questions because they are implementation details, not semantic identity.

### 4.2 Semantic root registry

The broader product registry currently identifies these major roots. They are an architectural vocabulary, not a statement that every item must become an independent visible 3D tree:

| Root | Meaning |
|---|---|
| `ROOT-MACHINE` | entire spatial machine |
| `TREE-ENTRANCE` | public website entrance |
| `TREE-WORLD` | world / Seat population presentation |
| `TREE-DOMAIN` | Account → Workplace → Project → Seat durable domain hierarchy |
| `TREE-SEAT` | Web AI Seat machine |
| `TREE-CONNECTION` | external provider/application connection |
| `TREE-BEHAVIOR` | Seat-local participation behavior/configuration |
| `TREE-TOOLKIT` | skills/procedural equipment |
| `TREE-CAPABILITY` | capability inventory |
| `TREE-AUTHORIZATION` | permission/readiness state |
| `TREE-WORKSPACE` | workplace/project/repository/runtime scope and center workspace |
| `TREE-ORCHESTRATION` | turns, contribution, scheduler eligibility |
| `TREE-EVIDENCE` | durable task/result/artifact/trace |
| `TREE-SETTINGS` | settings/control taxonomy |
| `TREE-COMMERCE` | subscription/entitlement presentation and aggregate commerce state |

Durable authority remains outside the renderer. The exact visible-tree classification must be established through census work rather than assumed from this registry.

### 4.3 Census synchronization

The four structured census representations remain synchronized in the same governed change whenever a tree/branch/division is added, removed, renamed, materially restructured, or reimplemented:

- `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.json`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`

The census records current demonstrated structure. It does not grant implementation authority.

---

## 5. Population model: 1 → 8 Seats without eight different Heroes

The Hero can present up to eight Seat slots, but **Seat capacity, Seat instance, and active participation are distinct concepts**.

```text
8 visual-capacity slots
≠
8 configured Seats
≠
8 active/eligible Seats
```

A durable Seat instance must come from authorized product state. A rendered slot may exist without being configured, authorized, healthy, or participating.

### 5.1 Population states

We explicitly recognize these useful spatial states:

```text
0 active Seats / no eligible participant
1 active Seat
2 active Seats
3 active Seats
4 active Seats
5 active Seats
6 active Seats
7 active Seats
8 active Seats
```

The one-Seat state is the minimum compressed mechanical Hero. The two-Seat state is the first genuinely multi-participant configuration. The eight-Seat state is the maximum presented population, not the only geometry the system knows.

### 5.2 What changes when Seat count changes

Adding a Seat should primarily change **population and semantic participation**, not replace the machine architecture.

The spatial resolver may change:

- Seat-ring spacing;
- available clearance;
- active expansion envelopes;
- connection-corridor allocation;
- workspace visibility budget;
- readable density;
- mechanical placement.

It should not clone the tree architecture or create a second semantic rule set for each population count.

### 5.3 Skill allocation

The same canonical/common skill substrate may be allocated differently as Seat population changes. Fewer Seats may carry broader resolved responsibility/skill bundles; more Seats can partition the same common definitions more finely.

The system must not fork canonical skills merely because the Seat count changes.

### 5.4 Turn-loop participation

The scheduler operates on eligible active Seat instances, not on the number of rendered slots.

Therefore:

```text
rendered slot
→ not necessarily runnable

configured Seat
→ not necessarily authorized

authorized Seat
→ not necessarily healthy

healthy Seat
→ not necessarily participating in this turn
```

These distinctions must remain explicit throughout the visual machine.

---

## 6. Seat-1-first division mapping

The first future structural slice is **Census 01: Seat 1**, not an invented “Tree 1” implementation.

Seat 1 is an **instance** of the canonical Seat tree:

```text
TREE-SEAT / TREE-HERO-SEAT
└── Seat instance: seat-1
    ├── SEAT_SHELL
    ├── SEAT_CONNECTION
    ├── SEAT_BEHAVIOR
    ├── SEAT_TOOLKIT
    ├── SEAT_CAPABILITIES
    ├── SEAT_AUTHORIZATION
    ├── SEAT_WORKSPACE_SCOPE
    └── SEAT_TASK_EVIDENCE
```

Before implementing its geometry, we map the complete semantic census:

```text
Seat 1
├── treeID
├── instance identity
├── direct divisions
├── sub-branches
├── payload
├── state vocabulary
├── accessibility surface
├── expansion envelope
├── connection attachments
├── camera subject relationship
├── responsive constraints
└── reduced-motion behavior
```

Only after that census is stable do we implement its spatial presentation.

### 6.1 Seat 1 reference question

The first reference state answers:

> **What exactly does the smallest useful mechanical Hero look like when the user has only one active Seat?**

For that state, the product should remain compact and readable. The core interaction may be the Seat + its currently applicable configuration/identity + the workspace chat with that one WebAi. We do not fill empty capacity with decorative structure simply because eight slots exist.

### 6.2 Seat 2 and onward

After Seat 1 is mapped and proven, we repeat the instance census for the population transition:

```text
Seat 1
    ↓ unlock/add
Seat 1 + Seat 2
    ↓
Seat 1 + Seat 2 + Seat 3
    ↓
...
    ↓
Seat 1 … Seat 8
```

The goal is to establish how the same semantic machine scales spatially, not to build eight different Hero applications.

---

## 7. Seat unlock experience

Unlocking a new Seat is a cross-layer product event. The renderer presents the state but does not own entitlement truth.

The intended high-level lifecycle is:

```text
entitlement / unlock becomes eligible
        ↓
Seat slot becomes available in authorized state
        ↓
new Seat instance enters the machine
        ↓
mechanical insertion / reveal choreography
        ↓
Seat shell becomes addressable
        ↓
its semantic divisions become available
        ↓
accessibility state becomes understandable
        ↓
machine settles into stable post-unlock state
```

### 7.1 Unlock animation principles

The eventual unlock animation should:

- feel mechanically manufactured rather than a UI fade;
- preserve the existing machine geometry and adjacency;
- reserve real physical space before the Seat settles;
- avoid moving unrelated semantic identities unpredictably;
- maintain connection continuity where applicable;
- respect reduced-motion equivalents;
- expose a readable completion state;
- never claim durable entitlement merely because the animation played.

### 7.2 Accessibility of unlock

When a Seat becomes available, the accessible state must be expressible independently of animation:

```text
available
→ focusable / discoverable
→ labeled Seat identity
→ state announced where needed
→ keyboard activation
→ visible focus treatment
→ deterministic selected/open result
```

Animation is therefore a presentation of the state transition, not the state itself.

---

## 8. Division contract

Every real branch/division is a **product integration**, not merely a mesh or face.

Its minimum contract includes:

```text
branchId
parent identity
tree identity
semantic purpose
responsibility
UI/product payload
configuration payload where applicable
accessibility payload where applicable
child ownership / recursive depth
expansion region
adjacent clearance
connection/path ownership
camera relationship
responsive behavior
reduced-motion behavior
verification evidence
```

A visible face without these semantics is a partial presentation.

### 8.1 Branch naming

Branch identity is derived from meaning and parentage.

Example vocabulary:

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

A branch identifier remains stable when physical placement changes. Renaming a branch is a semantic change and requires census and impact reconciliation.

### 8.2 Recursive depth

Trees may be broad, asymmetric, or recursively nested. No universal rule requires equal child counts or equal branch sizes.

The Census listing order is **not** automatically an execution order. Execution order must be derived from dependency analysis and governed in `MASTERPLAN.md`.

---

## 9. Payload-driven geometry

The machine should be designed from semantic payload outward:

```text
root truth
→ tree / branch semantics
→ responsibility
→ UI/product payload
→ expansion requirements
→ connection topology
→ adaptive geometry
→ camera/travel
→ interaction
→ contribution visualization
```

Different trees and divisions may legitimately require different:

- heights;
- widths;
- radii;
- branch counts;
- recursion depths;
- angular spreads;
- content density;
- expansion footprints.

A universal fixed branch size is therefore not the product model.

### 9.1 Expansion footprint

A division's physical footprint is derived from:

```text
base geometry
+ payload size
+ control/readability area
+ neighboring clearance
+ connection corridor width
+ camera travel envelope
+ viewport constraints
```

The maximum expanded Hero footprint is the combined footprint of the active participating divisions and required corridors, not a universal global scale multiplier.

### 9.2 Adjacency

Before a division is declared spatially complete, answer:

- what is adjacent to it when closed?
- what is adjacent to it when open?
- what neighboring division must move or stay clear?
- where does its connection corridor run?
- how does the camera preserve readability?
- what happens if another active Seat expands simultaneously?

These are machine-geometry questions, not polish questions.

---

## 10. Interaction and state language

All trees, branches, divisions, Seats, and applicable machine mechanisms use explicit semantic interaction states.

Minimum shared vocabulary:

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

Not every node must expose every state visually, but every implemented state must have a defined semantic meaning and presentation response.

`CLICKED` is an input transition, not a durable state. It should resolve into the applicable result such as selection, opening, authorized action, or explicit blocked/error state.

### 10.1 State precedence

When state treatments overlap, presentation resolves deterministically:

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

This is a presentation precedence rule only. It does not grant backend permission or alter durable domain state.

---

## 11. Expansion and mechanical motion

Opening/closing is a **stateful mechanical transition**, not an instant DOM visibility swap.

The generic lifecycle is:

```text
CLOSED
  ↓
PREPARING
  ↓
OPENING
  ↓
ACTIVE / OPEN
  ↓
CLOSING
  ↓
CLOSED
```

The final timing language is intentionally not frozen yet. Existing timing values are implementation measurements/starting points until browser evidence establishes better motion.

### 11.1 Opening requirements

Opening must preserve:

- semantic identity;
- spatial continuity;
- readable intermediate states;
- adjacency clearance;
- connection continuity;
- camera subject relationship;
- responsive coherence;
- reduced-motion meaning.

A payload that has no semantic reason to occupy more space must not be enlarged merely for visual drama.

---

## 12. Camera philosophy and authority

The camera is a product capability of the spatial machine, but camera coordinates and physical docks are never semantic identity.

### 12.1 One subject at a time

When nothing is opened, the subject is the whole Hero / workspace.

When a tree is selected, the subject becomes that tree.

When a division is focused, the subject becomes the readable face/subtree belonging to that division.

Look-at must remain on the semantic subject. The system must not move the selected tree off to one side while continuing to look at an unrelated world center.

### 12.2 Current authoritative camera path

The legacy 1–15 inspection spine is retired.

Current ownership is:

```text
Cam-5 / Cam-6
+
hierarchy runtime
+
semantic subject identity
```

No second camera authority is permitted.

### 12.3 Free motion

While a tree or division is selected:

- mouse/touch drag may orbit;
- scroll/pinch may zoom;
- subject gaze must remain coherent;
- product clamps remain active;
- reduced-motion behavior must remain understandable.

### 12.4 Camera capability vocabulary

Conceptually the machine should support:

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

The exact implementation vocabulary may evolve under the owning camera contracts.

### 12.5 Enter/leave grammar

```text
World baseline
    → select/open tree
        → camera adopts semantic tree subject
            → focus division
                → closer readable framing
            ← Back / parent
        ← exit tree
    → World baseline
```

Back and Next walk the branches of the **current** tree only. They must never create another hierarchy authority.

---

## 13. Machine navigation and settings

### 13.1 Structural navigation

The machine may expose dropdown/equivalent navigation listing major product-visible trees or mechanisms. Selecting an entry requests that semantic subject under the camera rules.

The navigation is a presentation/control taxonomy, not a second machine census.

### 13.2 Settings

General Settings is a cross-cutting machine control surface. At minimum it may include:

- Theme;
- Language when productized;
- Overall UI scale;
- turn-management controls when governed there;
- machine-specific diagnostics such as Smoke.

There must remain one settings authority and one theme root.

### 13.3 In-page Smoke Harness

Smoke testing is evolving from a camera-specific idea into a **general in-page diagnostic system**.

A Smoke probe should be accessible from the current page's settings/control surface and must prove a feature **without navigating away from the current page**.

Examples:

| Smoke | For what? | Desired output |
|---|---|---|
| Camera Test | exact camera/semantic target | show/look at exact ID |
| Animation Test | exact animation/trigger | toggle ON/OFF and visibly expose effect/state |
| Mesh / Asset Test | exact mesh/model/asset | expose exact asset ID and render/load state |
| Interaction Test | exact control/interaction | perform interaction and show result |
| State Test | exact UI/machine state | force state, expose ID, then restore/report |
| Connection / Topology Test | exact semantic edge | expose source → target and connection state |
| Data / Binding Test | exact data/entity binding | expose resolved identifier/value |
| Responsive Test | exact viewport/surface | expose expected responsive state |
| Reduced Motion Test | exact motion-equivalent state | show semantic result without relying on motion |
| Performance Test | exact render/update path | show bounded diagnostic metric |

Each probe should declare, conceptually:

```text
id
exact target
requested action
observable expected result
cleanup / restore behavior
navigation = false
```

Camera is only one probe class. Agents are expected to ask what deterministic in-page Smoke probe is applicable whenever they change a feature.

Smoke is a diagnostic instrument, not a product authority. It must not invent durable backend state and must not become a second hierarchy, camera registry, or configuration system.

---

## 14. Accessibility, responsive behavior, and reduced motion

Accessibility is not a later polish pass. It is part of the machine contract.

For every Seat or division that is interactive, we must be able to express:

```text
semantic label
focusability
focus state
action semantics
availability / blocked reason where appropriate
state change
post-action destination/state
```

3D animation may communicate the transition, but the semantic state must remain understandable without animation.

### 14.1 Responsive behavior

The same semantic machine should remain usable across desktop, tablet, and phone contexts. Geometry may change, but identity and product meaning must not.

A small viewport is not permission to collapse the system into unrelated DOM panels.

### 14.2 Reduced motion

Every meaningful mechanical movement needs a semantic equivalent for reduced motion. Reduced motion may shorten, remove, or simplify movement, but it must preserve:

`what changed · what is selected · what is open · where the user is · what action succeeded/blocked`

---

## 15. Connection, topology, and effects

Visible wires and effects must correspond to semantic meaning.

### 15.1 Topology before electricity

The order is:

```text
semantic nodes
→ connection points
→ edges
→ corridors
→ active/open participating divisions
→ electrical effect
```

Decorative disconnected electricity is not acceptable evidence of connectivity.

The eventual turn-loop should represent:

```text
active WebAi turn
→ active tree / branch
→ active/open participating divisions
→ real connected wiring path
→ inward electrical travel
→ workspace center
```

### 15.2 Effects law

Effects should communicate state or semantic events. Examples include:

- activity pulse;
- selected/focus emphasis;
- actual connection flow;
- error/blocked field;
- expansion choreography.

Effects must never be the only source of state truth, must not obscure text or focus, and must not imply backend execution merely because an animation played.

---

## 16. Construction order: one division at a time, then inward

The future machine is not built as eight giant parallel features. It is built **one governed semantic division at a time**.

### Stage A — Census

```text
identify spatially relevant roots
→ classify tree / instance / division / mechanism
→ define treeID
→ define branchId
→ count direct branches
→ map sub-branches
→ identify payload
→ identify authority
```

### Stage B — Population map

```text
1 Seat
2 Seats
3 Seats
4 Seats
5 Seats
6 Seats
7 Seats
8 Seats
```

Determine how the mechanical Hero compacts/expands while preserving semantic meaning.

### Stage C — First Seat division

Start with **Seat 1**, the first active Seat instance.

Complete its census before adding its choreography.

### Stage D — Division mechanics

For the selected division, establish in this order:

```text
payload
→ state model
→ expansion root
→ adjacency
→ connection root
→ accessibility
→ responsive behavior
→ reduced-motion behavior
→ camera root
→ transition root
→ effect root
→ verification / Smoke
```

### Stage E — Freeze and continue

Once the division is proven and its census is reconciled, freeze its current truth and move to the next division of the same Seat.

### Stage F — Complete Seat ring

Continue through the Seat instances/divisions until the outer Seat ring is structurally coherent.

### Stage G — Move inward

Then progress toward the closer rings:

```text
R3 Seat ring
    ↓
R2 Setup / configuration ring
    ↓
R1 Backend display / connection ring
    ↓
R0 Workspace center
```

The workspace center eventually becomes the semantic middle of the machine, with contribution, task/evidence, traces, and orchestration arrival connected to it.

This is the intended spatial construction direction: **outer participation → inner configuration/context → center workspace**.

---

## 17. “1-seat / 2-seat / … / 8-seat” visual planning matrix

Before broad expansion work begins, the planning baseline should be capable of describing the actual visible machine for these states:

| Population | Spatial intent | Core user experience |
|---|---|---|
| 0 | no active participant; truthful empty/blocked state | machine remains readable without pretending a Seat can run |
| **1** | **most compressed useful machine** | one Seat + applicable divisions + one-WebAi chat/workspace interaction |
| **2** | compact multi-seat machine | two independent Seat instances + shared workspace interaction |
| 3 | more populated outer ring | three Seat instances + preserved center readability |
| 4 | balanced mid population | four participating Seat instances |
| 5 | denser machine | five participating Seat instances with adjusted clearance |
| 6 | denser machine | six participating Seat instances with preserved division readability |
| 7 | near-maximum machine | seven participating Seat instances |
| 8 | maximum presented Seat population | eight active-capacity instances with full ring behavior |

These are **population states, not eight code paths**. The final geometry is resolved from semantic payload, active population, expansion state, topology, and viewport.

---

## 18. Ownership table

| Vision desire | Existing owner / contract to use first | Class |
|---|---|---|
| Public entrance | `public/index.html`, entrance contracts | Adjust / additive |
| Gentle Hero entrance atmosphere | existing Hero bootstrap | Adjust wiring, no second runtime |
| 3D machine anatomy | Machine Interaction Contract + concentric ring map | Extend under contract |
| Tree / branch identity | Tree Census + tree authority | Census first |
| Seat hierarchy | existing Seat hierarchy runtime | Adjust / extend |
| Seat population | world/Seat population resolver + durable state contract | Adjust |
| Seat unlock presentation | subscription / machine mechanism + accessibility owner | Additive under canonical flow |
| ~45° world baseline | `HERO_WIDE` / world dock / camera follow contract | Adjust |
| Selected-tree look-at | **Cam-5/Cam-6 + hierarchy runtime** | Sole camera authority |
| Legacy 1–15 spine | historical inspection system | **Retired** |
| Free orbit + zoom | existing hierarchy camera gates / navZoom | Adjust |
| Return path | close-parent / return path | Adjust |
| Branch Back / Next | hierarchy focus-child APIs + existing DOM action map | Adjust + map |
| Machine navigation | existing world/shell navigation | Adjust |
| Settings | existing settings shell / theme-root | Extend, do not fork |
| In-page Smoke | existing Settings Smoke surface / browser-smoke skill | Extend into reusable diagnostic classes |
| Theme | `frontend/spatial/theme-root.*` | One root only |
| UI scale / language | existing settings surface | Adjust |
| Expansion choreography | tree-machine / hierarchy expansion contracts | Add under census |
| Accessibility state | existing accessibility/runtime owners + machine interaction contract | Integrate |
| Responsive geometry | spatial/responsive contracts | Integrate |
| Reduced motion | motion preference + machine motion contract | Integrate |
| Connection topology | tree topology / connection contracts | Build before electricity |
| Turn-loop electricity | orchestration + topology contracts | Later, after topology |
| Workspace center | workspace machine / evidence/orchestration contracts | Inner-ring work |
| Far links | `aside.far-environment` | Keep outside machine |

If a future need is missing from the ownership table, add the row before creating a new module.

---

## 19. Historical continuity: earlier V0–V4 slices remain evidence

The previous vision ladder remains useful as historical continuity and recovery context. It is not a second roadmap authority.

### Phase V0 — Camera truth

| ID | Intent | Class |
|---|---|---|
| V0.1 | ~45° world baseline via existing dock numbers | Adjust |
| V0.2 | Close/return restores baseline dock | Adjust |
| V0.3 | Subject-lock regression | Test / adjust |
| V0.4 | Free orbit/scroll about subject while open | Adjust gates |
| V0.5 | Zoom ceiling while remaining subject-locked | Adjust clamps |

### Phase V1 — Branch walk

| ID | Intent | Class |
|---|---|---|
| V1.1 | Back/Next contract on open parent | Document + map |
| V1.2 | Existing controls to child cycle | Adjust |
| V1.3 | Leave-tree → baseline | Adjust |
| V1.4 | Optional per-face dock offset | Adjust after camera truth |

### Phase V2 — Machine chrome

| ID | Intent | Class |
|---|---|---|
| V2.1 | Parts/trees nav map data | Adjust existing lists |
| V2.2 | Right dropdown using that map | Adjust shell navigation |
| V2.3–V2.6 | Settings shell, theme, scale, language scaffold | Adjust settings |

### Phase V3 — Entrance (Layer A)

**Contract:** `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md`

| ID | Intent | Class |
|---|---|---|
| V3.1 | Entrance IA / layout contract | Docs then additive layout |
| V3.2 | Brand hero image | Additive asset/region |
| V3.3 | Gentle Hero atmosphere | Adjust wiring |
| V3.4 | Get-started → machine baseline | Adjust handoff |
| V3.5 | Far-environment links | Keep / clarify |

### Phase V4 — Polish

Tree color language, full Seat Smoke, reduced-motion path, mobile parity, and vision checkpoint refresh remain useful continuity items. They must use canonical owners and must not become an alternative roadmap.

Parallel tracks such as Conn, provider keys, backend BLOCKS_029, and authenticated runtime work stay on their own contracts and do not fork the Hero runtime.

---

## 20. Current implementation truth vs future feel

| Intent | Current truth |
|---|---|
| Public website entrance | Exists as an intermediate implementation baseline |
| Explicit entry to 3D world | Exists |
| Mechanical Hero renderer | Exists, incomplete as a complete machine |
| Seat hierarchy | Partial but strongest current tree evidence |
| Seat count 1–8 renderer capability | Existing flexible population support; semantic population integration remains governed work |
| Cam-5/6 selected-tree path | Current camera authority |
| Legacy 1–15 spine | Retired; remaining executable dependencies must be reconciled |
| DOM chrome absorption | Ongoing debt reduction |
| Settings | Exists; evolving toward in-page diagnostic control |
| Generalized Smoke Harness | Emerging concept; camera test is first concrete probe class |
| Tree Census | Active structural baseline; not implementation-complete proof |
| TREE-DOMAIN | Incomplete |
| TREE-HERO-SEAT / TREE-SEAT | Partial |
| TREE-SKILL-RESPONSIBILITY | Incomplete as a rendered machine tree |
| Full adaptive tree geometry | Incomplete |
| Full expansion / adjacency model | Incomplete |
| Full connection topology | Incomplete |
| Final turn-loop electrical choreography | Incomplete |
| Authenticated workspace as fully restored/proven spatial state | Incomplete |
| 029 production release | **Not claimed** |

---

## 21. Standing product boundaries

- Presentation never invents entitlement, scheduler choice, durable auth, backend state, or payment state.
- A rendered Seat is not automatically a durable/configured/authorized Seat.
- One Hero runtime only.
- One hierarchy runtime only.
- One current camera authority: **Cam-5/Cam-6 + hierarchy runtime**.
- Legacy 1–15 camera traversal is retired and must not return as fallback authority.
- One primary camera apply path.
- One theme root (`document.documentElement`).
- Hero/canvas does not write Firestore, charge PayPal, bind provider secrets, or self-attest authorization.
- Connection/electrical effects correspond to actual semantic topology and never substitute for topology.
- Smoke tests remain in-page diagnostics and do not navigate merely to prove behavior.
- Historical evidence is preserved; current truth is reconciled in active indexes and governed records.
- Green CI is necessary evidence for the relevant change but is not by itself release endorsement.
- 029 remains unclaimed until all governing release conditions are actually evidenced.

---

## 22. How work proceeds and how Issues / PRs / comments relate

### Vision

This document holds **experience intent**. Amend it when the intended experience meaning changes.

### Masterplan

`MASTERPLAN.md` owns chronological execution order. It is where the census-first division sequence, dependencies, and executable checklist belong.

### Issue

The governing Issue owns the durable problem statement, acceptance boundaries, dependencies, and current execution context for a problem/slice. For the current 029 structural machine work, **Issue #278 is the active execution ledger**.

### Issue comment

Issue comments are an evidence ledger. They should report things such as:

`DIAGNOSIS:` what was found  
`REAL DATA:` what was observed  
`WARNINGS:` what remains bounded or unproven  
`EXECUTED:` what was actually changed or run

A comment must not silently become a second Masterplan or Product Law.

### Pull request

A PR is the implementation/review boundary. It must declare its authority and verification plan and must not use its description to override Product Law or the Masterplan.

### CI / browser / Smoke

Verification systems establish evidence for the scope they actually exercise. They do not become the source of semantic identity or product authority.

---

## 23. Final construction principle

The future 3D Hero should be treated as a **mechanical semantic machine** whose geometry is the visible consequence of product meaning.

The construction order therefore remains:

```text
CENSUS
  ↓
TREE / INSTANCE / DIVISION MAP
  ↓
1–8 POPULATION STATES
  ↓
SEAT 1 REFERENCE INSTANCE
  ↓
DIVISION 1
  ↓
DIVISION STATE / PAYLOAD / ACCESSIBILITY
  ↓
EXPANSION / ADJACENCY
  ↓
CONNECTION TOPOLOGY
  ↓
CAMERA SUBJECT / TRAVEL
  ↓
TRANSITIONS
  ↓
EFFECTS
  ↓
SMOKE / BROWSER / RESPONSIVE / REDUCED-MOTION PROOF
  ↓
FREEZE CURRENT TRUTH
  ↓
NEXT DIVISION
  ↓
NEXT SEAT
  ↓
INNER RINGS
  ↓
WORKSPACE CENTER
```

The machine should feel assembled, not painted on. Every visible movement should have a semantic reason. Every semantic branch should have a product responsibility. Every product responsibility should have a truthful authority boundary. Every completed slice should leave evidence strong enough for the next slice to build on without guessing.

**The goal is not eight beautiful seats. The goal is one coherent machine in which one Seat, two Seats, and eventually eight Seats are truthful states of the same product.**

---

## 24. Final vision acceptance language

The vision is coherent when all of the following remain true:

```text
public entrance is distinct from the machine
+
there is one mechanical Hero runtime
+
there is one semantic census
+
there is one camera authority
+
Seat capacity is distinct from active Seat population
+
1 Seat is a valid compressed machine state
+
2 Seats is a valid multi-seat machine state
+
1–8 are population states, not eight unrelated implementations
+
Seat divisions are mapped before their animations are authored
+
expansion consumes payload and clearance
+
topology exists before electricity
+
accessibility survives without animation
+
Smoke proves exact in-page behavior without navigation
+
Issues provide execution context
+
comments provide evidence
+
PRs provide implementation boundaries
+
CI provides verification evidence
+
Masterplan provides chronological execution order
+
Vision provides coherent experience intent
+
Product Law remains the highest authority
```

This is the living target. It may be refined as implementation reveals new evidence, but refinements must preserve semantic identity, authority separation, mechanical continuity, accessibility, and the single governed execution chain.
