# TeamAi Product Vision — Entrance, Machine, and Camera

**Status:** Product intent (living) · **single vision home**  
**Authority order:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → **this document** → camera / hierarchy / DOM / theme contracts → implementation  
**Claim:** presentation and experience intent only · **not** a Product Law rewrite · **no 029-released claim**

This is the **only** product-experience vision for public entrance, 3D Hero machine baseline, tree/branch camera subject, and presentation chrome. New ideas are **amended here**, not published as a second vision.

Related technical contracts (owners of detail, not competing visions):

- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_CAM6_MANDATORY_SELECTED_TREE_LOOKAT.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md`
- `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md`

---

## 0. Governance execution (ORUCAVEAM-aligned)

TeamAi uses **one** execution discipline (ORUCAVEAM). There is no second lifecycle. For every vision-driven change:

| Letter | Applied meaning for this vision |
|--------|----------------------------------|
| **O** Objective | State the human-facing outcome in terms of §1–§5 below |
| **R** Restrictions | Presentation only; no entitlement, scheduler, Firestore writes from Hero, or 029-released claim |
| **U** User Authority | User/owner endorsement for visual quality when environment is fair; no silent product law change |
| **C** Canonical Authority | Name the **existing owning root** (file/contract) before coding |
| **A** Action | **Smallest adjust** of that root; forbid parallel systems |
| **V** Verification | Unit + Playwright at the proof level the change warrants; green CI ≠ Endorsement |
| **E** Efficiency | Prefer census-aware extension of existing roots over rewrite |
| **A** Audit | Checkpoint / HandOver when the slice lands |
| **M** Minimal tools | One apply path, one theme root, one hierarchy runtime, one census authority set |

### 0.1 Starting from zero is forbidden

**Default:** locate the module or contract that already owns the behavior, then **adjust** it.

**Create new code only when** all of the following are true and written in the PR:

1. No existing owner can honestly carry the behavior without violating Product Law or this vision.
2. The gap is named against the ownership table (§6).
3. The new module has a single responsibility and is wired through existing entry points—not a second bootstrap.

“We could write it cleaner from scratch” is **not** permission to start from zero.

### 0.2 Change isolation

A change may touch only its declared owner set. Avoid parallel systems, duplicate roots, second hierarchy walkers, second camera registries, second theme authorities, or detached animation graphs.

### 0.3 Evidence labels

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade by implication. Source CI ≠ live product endorsement.

---

## 1. Two layers of experience

TeamAi presents two complementary layers. They must stay conceptually distinct so the user always knows *where they are*.

### Layer A — Website entrance (public face)

The first impression of TeamAi as a **product on the web**, not yet “inside the machine.”

**What the human should perceive**

- A calm, branded **normal web page**: name, logo, short summary of what TeamAi is, social links, and a clear hero image.
- Behind or within that page, the **3D Hero may rotate gently in the background** as atmosphere — inviting, not demanding interaction.
- Primary actions are ordinary web actions: learn more, sign in, get started. Nothing on this layer pretends to configure seats, bind API keys, or open GitHub.

### Layer B — 3D Hero machine (after the user begins)

Once the user **gets started**, the Hero becomes the primary spatial instrument: a readable machine whose trees and branches carry product structure.

**Baseline pose (home of the machine)**

- Default viewing angle is approximately **45° elevation** toward the machine / workspace — stable and legible.
- From this baseline the user may freely drag/orbit and zoom within safe product clamps.
- This baseline is the view the product returns to when the user leaves a tree or branch inspection.

---

## 2. Machine vision: the Hero is an expandable system, not a static scene

The 3D Hero is intended to read as a **manufactured technological machine** whose divisions, trees, branches, and workspace are spatially connected.

The machine is not merely a decorative 3D representation of a menu. A visible tree or branch represents a real product integration with a purpose, a semantic identity, a UI/product payload, an expansion region, and an actual relationship to adjacent machine divisions.

A tree may be broad, deep, recursive, asymmetric, or denser than another tree. A branch may contain its own branches. There is no universal assumption that every tree has the same height, width, number of children, radial position, or expansion footprint.

The machine therefore grows from **semantic structure into geometry**:

```text
root truth
→ tree / branch semantics
→ responsibility
→ UI / feature / configuration / accessibility payload
→ expansion requirements
→ connection topology
→ adaptive geometry
→ camera relationship
→ interaction
→ visual signal / contribution
```

The reverse direction is forbidden as a design rule: coordinates must not invent product meaning.

### 2.1 Tree identity

Every intended tree has a semantic `treeID`. Every branch has a semantic `branchId` derived from parentage and meaning.

`treeID` / `branchId` are not mesh IDs and are not inferred from coordinates.

### 2.2 Branches are integrations

A branch exists to represent something meaningful. Its implementation is incomplete when it is only a display object.

A real branch owns or exposes some combination of:

- semantic purpose;
- child relationships;
- product/UI payload;
- configuration and accessibility surfaces;
- machine expansion behavior;
- connection/path ownership;
- camera subject relationship;
- responsive behavior;
- reduced-motion behavior.

### 2.3 Adaptive geometry

Geometry follows the payload. A large feature family may require a larger physical division than a compact one. Branch height, depth, width, spacing, angular spread, and expansion size are living design results, not universal constants.

The current hierarchy runtime numbers remain valuable starting/measured values, but they are not permission to copy one prototype's geometry into every future tree.

### 2.4 Expansion as architecture

Opening a division is itself part of the product interaction contract. The system must know the volume required by the expanding content, the clearance to adjacent divisions, the space required by wiring paths, and the camera path before final motion is authored.

The expanded Hero footprint is therefore a property of the currently participating machine divisions, not a fixed global scale.

### 2.5 Smooth mechanical choreography

Expansion and collapse should feel like a physical machine changing state, with continuous spatial continuity and readable intermediate states.

An instantaneous `display:block`, teleport, or abrupt coordinate replacement is not the intended final interaction.

Existing duration values remain living implementation baselines until better browser evidence establishes final motion language.

---

## 3. Tree families and current truth

Three conceptual tree families must remain distinct:

### Domain tree

`Account → Workplace → Project → Seat`

This represents durable domain structure. The renderer may present it, but the renderer does not own its durable authority.

### Hero Seat hierarchy

`Seat Shell → Connection → Behavior → Toolkit → Capabilities → Authorization → Workspace Scope → Task/Evidence`

This is the currently proven presentation hierarchy portion. It is **partial**, not proof that the complete machine is complete.

### Skill / responsibility tree

`ToolKit upstream → WebAi Seat responsibility → skill bundle → governance / adaptation / capacity`

This represents capability/responsibility structure. Skills instruct; policy and authorized contracts govern.

The complete multi-tree Hero is achieved only when the intended tree families have their semantic contracts, implementation, geometry, expansion behavior, connection relationships, and verification evidence.

---

## 4. Camera and spatial-travel philosophy

### 4.1 One subject at a time

When nothing is opened, the subject is the whole Hero/workspace.

When a tree is selected, the subject becomes that tree.

When a branch is focused, the subject becomes that branch's readable surface.

The camera must follow semantic subject identity rather than treat a fixed dock ID as identity.

### 4.2 Current implementation is a baseline, not the final travel language

The repository currently uses named camera docks and a measured `700 ms` lerp. That is an implementation baseline and evidence point. It is not equivalent to traveling through the hierarchy.

Meaningful tree-to-tree travel requires actual spatial movement between distinct subject identities.

Wheel/pinch zoom must eventually move continuously through the machine rather than only switch a thresholded camera state.

### 4.3 Retired camera concepts remain retired

`HERO_LOW_ORBIT` and `TURN_FOLLOW` remain retired. Active low-feeling poses should be diagnosed through their actual current path rather than by resurrecting old identifiers.

---

## 5. Turn-loop and contribution vision

The final turn-loop is intended to visualize **real contribution flow through the machine**.

During an active turn:

```text
active WebAi turn
→ active tree / branch
→ participating divisions become active/open
→ connection points form a traversable visual network
→ electricity travels through real wiring paths
→ adjacent participating trees/branches are traversed
→ signal reaches the middle workspace
```

The electrical effect is therefore a visualization of a semantic connection graph, not a decorative animation drawn independently of the machine structure.

For that reason, the connection graph must exist before the final electrical choreography can be considered complete.

Reduced-motion must preserve semantic signal meaning while suppressing or simplifying continuous travel.

The final animation language remains open. Existing turn-loop/camera timings are not frozen visual law.

---

## 6. Expandable machine and product payload

Selecting a tree or branch may cause its corresponding machine division to expand and expose the product surfaces belonging to that semantic unit, including relevant features, configuration, controls, and accessibility surfaces.

The product payload determines the physical requirements of the division. This is why the tree census tracks content and why geometry is not frozen into one universal branch layout.

The expansion system should support:

```text
closed
→ preparing
→ opening
→ expanded / active
→ closing
→ closed
```

and should preserve semantic continuity, connection continuity, camera readability, responsive behavior, and reduced-motion equivalence.

During a final turn-loop, participating divisions are expected to be in an active/open presentation state so their intended wiring paths are spatially available.

---

## 7. Ownership table (extend these first)

| Vision desire | Existing owner (use first) | Class |
|---------------|----------------------------|-------|
| ~45° machine baseline | `HERO_WIDE` / world dock, Cam-1–3, camera follow contract, §9 numbers | **Adjust** |
| Look-at selected tree | Cam-5/6, `resolveSelectedSeatDock`, apply-cam2 flex wire | **Adjust** / regression |
| Free orbit + zoom on subject | Cam-3, Cam-4, `navZoom` clamps | **Adjust** |
| Return when leaving tree | Close-parent / `returnFromSeatShell` / `setCamera` path | **Adjust** |
| Back / Next branches | DOM INSPECT controls, `hero-dom-action-map.js`, hierarchy focus child | **Adjust + map** |
| Right-side parts list | shell-nav, seat-stack, DOM chrome absorption plan | **Adjust** |
| Theme switch | `theme-root`, settings | **Adjust** |
| UI scale / language | settings surface | **Adjust** |
| Entrance layout, logo, social, hero image | `public/index.html` / spatial shell, far-environment | **Additive layout** |
| Gentle Hero on entrance | Existing Hero bootstrap as atmosphere | **Adjust** wiring, no second runtime |
| Tree census | `docs/TEAMAI_3D_HERO_TREE_CENSUS.*` | **Synchronize on tree/branch change** |
| Tree construction / adaptive geometry | Tree census + Machine Interaction Contract + hierarchy runtime | **Derive; do not copy** |
| Turn-loop electrical flow | Tree census + contribution/connection owner(s) | **Later integration over completed topology** |
| Machine-opening choreography | Tree census + machine interaction contract + hierarchy motion owner | **Later polish over completed structure** |

If a future need is missing from this table, add a row here before creating a module.

---

## 8. Brand and hero image

The public entrance may feature a dedicated hero image that communicates networked AI / team collaboration. The image supports Layer A identity; it does not replace the live 3D Hero machine in Layer B.

---

## 9. Existing slice context

The repository retains a V0–V4 implementation ladder for historical continuity and recovery. Those slices are **not a second product authority and not a replacement for the current #278 execution ledger**.

Current implementation ordering, acceptance, and phase sequencing belong to `MASTERPLAN.md` and #278. This vision explains **what the experience means**, not which implementation slice an agent should execute next.

---

## 10. What already exists vs what still asks for feel

| Intent | Rough status on main |
|--------|----------------------|
| Seat hierarchy faces (P1–P7.1) | **Partial mechanism**, not complete multi-tree machine |
| Camera follow + selected-tree look-at | Landed baseline; final spatial-travel feel remains open |
| DOM soft-hide + action map | Landed; absorption continues |
| Theme root + settings | Landed; one root only |
| Website entrance | Implemented foundation; final deployed acceptance remains under #278 |
| Full tree/branch machine network | **Not complete** |
| Final turn-loop electrical choreography | **Not complete** |
| Final machine-opening choreography | **Not complete** |
| 029 production release | **Not claimed** |

---

## 11. Standing product boundaries

- Presentation never invents entitlement, scheduler choice, or durable auth.
- One theme root (`document.documentElement` only).
- One hierarchy runtime; one primary Hero flex apply path.
- Hero / canvas does not write Firestore, charge PayPal, or bind secrets.
- GitHub Connection and seat provider keys remain normal-UI / Edge paths—not live bind inside the 3D plate.
- Green CI and merged camera slices are necessary evidence, not Endorsement of 029 release.
- Historical camera concepts and retired interaction models must not be revived merely to make a test or animation path convenient.

---

## 12. How work proceeds

1. Amend **this file** when experience intent changes; this remains the single vision home.
2. Keep semantic tree truth synchronized in the tree census whenever a tree/branch/division is added, removed, renamed, or reimplemented.
3. Name the existing owner before adding code.
4. Implement under ORUCAVEAM and the current #278 execution ledger.
5. Verify at the proof level the behavior warrants.
6. Record checkpoint / HandOver; update current-state and next-slice documentation as the implementation state changes.

**Owner endorsement** of visual quality remains separate when environment and outer UI are fair enough to judge.
