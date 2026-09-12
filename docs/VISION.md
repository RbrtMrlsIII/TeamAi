# TeamAi Product Vision — Entrance, Machine, and Camera

**Status:** Product intent (living) · **single vision home**  
**Authority order:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → **this document** → camera / hierarchy / DOM / theme contracts → implementation slices  
**Claim:** presentation and experience intent only · **not** a Product Law rewrite · **no 029-released claim**

This is the **only** product-experience vision for public entrance, 3D Hero machine baseline, tree/branch camera subject, and presentation chrome. New ideas are **amended here**, not published as a second vision.

Related technical contracts (owners of detail, not competing visions):

- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_CAM6_MANDATORY_SELECTED_TREE_LOOKAT.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md`
- `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md`

---

## 0. Governance execution (ORUCAVEAM-aligned)

TeamAi uses **one** execution discipline (ORUCAVEAM). There is no second lifecycle. For every vision-driven change:

| Letter | Applied meaning for this vision |
|--------|----------------------------------|
| **O** Objective | State the human-facing outcome in terms of §1–§3 below |
| **R** Restrictions | Presentation only; no entitlement, scheduler, Firestore writes from Hero, or 029-released claim |
| **U** User Authority | User/owner endorsement for visual quality when environment is fair; no silent product law change |
| **C** Canonical Authority | Name the **existing owning root** (file/contract) before coding |
| **A** Action | **Smallest adjust** of that root; forbid parallel systems |
| **V** Verification | Unit + Playwright at the proof level the change warrants; green CI ≠ Endorsement |
| **E** Efficiency | Prefer hide/map/tune over rewrite |
| **A** Audit | Checkpoint / HandOver when the slice lands |
| **M** Minimal tools | One apply path, one theme root, one hierarchy runtime |

### 0.1 Starting from zero is forbidden

**Default:** locate the module or contract that already owns the behavior, then **adjust** it.

**Create new code only when** all of the following are true and written in the PR:

1. No existing owner can honestly carry the behavior without violating Product Law or this vision.
2. The gap is named against the ownership table (§4).
3. The new module has a single responsibility and is wired through existing entry points (e.g. one `apply-cam2` path, one `theme-root`, one hierarchy runtime)—not a second bootstrap.

“We could write it cleaner from scratch” is **not** permission to start from zero.

### 0.2 Change isolation (do not affect the others)

A slice may touch **only** its declared owner set. Wiring must not cascade:

| If you change… | You must not also… |
|----------------|--------------------|
| World / baseline dock numbers | Invent a second camera table or bypass Cam-5/6 look-at |
| Cam-3/4 orbit-zoom gates | Fork `setCamera` or a parallel navZoom store |
| Close-parent / return path | Redefine seat hierarchy or face order |
| DOM action-map / Back–Next | Add a second branch walker or duplicate seat list |
| theme-root / settings | Add a second theme attribute root or page-local theme |
| Entrance layout | Stand up a second Hero runtime or second settings island |

**PR body required fields:** Objective · Owning root(s) · Files allowed · Files forbidden · “Create new?” yes/no with justification · Clash test (still one apply path / one theme root / one hierarchy runtime).

### 0.3 Evidence labels

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade by implication. Source CI ≠ live product endorsement.

---

## 1. Two layers of experience

TeamAi presents two complementary layers. They must stay conceptually distinct so the user always knows *where they are*.

### Layer A — Website entrance (public face)

The first impression of TeamAi as a **product on the web**, not yet “inside the machine.”

**What the human should perceive**

- A calm, branded **normal web page**: name, logo, short summary of what TeamAi is, social links, and a clear hero image (networked AI / team motif — e.g. connected isometric nodes on a dark field).
- Behind or within that page, the **3D Hero may rotate gently in the background** as atmosphere — inviting, not demanding interaction.
- Primary actions are ordinary web actions: learn more, sign in, get started. Nothing on this layer pretends to configure seats, bind API keys, or open GitHub.

**What this layer is not**

- Not seat configuration.
- Not entitlement or commerce truth.
- Not a second product authority outside Product Law.

**Implementation stance:** primarily **additive layout** on the existing page shell (`public/index.html` / spatial shell). Same theme-root. Same Hero instance or a deliberately passive backdrop—**no second WebGL app**.

### Layer B — 3D Hero machine (after the user begins)

Once the user **gets started**, the Hero becomes the primary spatial instrument: a readable machine whose trees and branches carry product structure (seats, connection, behavior, toolkit, and so on).

**Baseline pose (home of the machine)**

- Default viewing angle is approximately **45° elevation** toward the machine / workspace — a stable, legible “standing in front of the instrument” view.
- From this baseline the user may **freely drag / orbit** and **zoom** within safe product clamps, as long as the gaze remains coherent with the machine.
- This baseline is the view the product **returns to** when the user leaves a tree or branch inspection.

**Implementation stance:** **adjust** existing docks (`HERO_WIDE` / world center), Cam-1–4, and close-parent paths—not a new baseline subsystem.

---

## 2. Camera philosophy (conceptual)

### 2.1 One subject at a time

When nothing is opened, the subject is the **whole Hero / workspace** (Layer B baseline, ~45°).

When a **tree** is selected (for example a seat shell), the subject becomes **that tree**. The camera may move closer and reframe, but **look-at must stay on the selected tree**, not on the empty center of the world while the tree sits off to the side.

When a **branch** of that tree is focused (Connection, Behavior, Toolkit, …), the subject becomes that branch’s readable face. Zoom and gentle orbit remain allowed; gaze still respects the current subject.

**Owner today:** Cam-5 / Cam-6 (`resolveSelectedSeatDock`, force look-at while seat shell open) + hierarchy `openParentId` / focus child.

### 2.2 Free motion without losing the subject

While a tree or branch is selected:

- **Mouse / touch drag** may slide the viewpoint around the subject (orbit).
- **Scroll / pinch** may zoom in and out.
- Both must keep the selected tree or branch as the facing target.
- Motion respects reduced-motion and product zoom limits (exact numbers live in hierarchy baseline §9 / camera contracts—not frozen as product law here).

**Owner today:** Cam-3 (`poseAboutTreeCenter`, `shouldApplyTreeNav`), Cam-4 (edge / swipe), `navZoom` clamps. Adjust gates; do not fork.

### 2.3 Entering and leaving a tree

```text
Baseline (45° machine view)
    → select / open a tree
        → camera adopts that tree as subject (still free zoom/orbit about it)
            → focus a branch
                → closer readable framing of that branch
            ← Back (previous branch or parent)
        ← exit tree / return
    → Baseline again (45° machine view, free drag)
```

**Back** and **Next** walk the branches of the *current* tree. Interim on-screen controls are acceptable while absorbed into machine-native controls; they must not invent a parallel configuration authority outside the machine.

**Owner today:** hierarchy focus-child APIs + DOM INSPECT Back/Next + `hero-dom-action-map.js`. Map and tune; do not add a second walker.

---

## 3. Navigation and settings (chrome)

### 3.1 Structural navigation

After the user is in the machine experience, a **dropdown (or equivalent) navigation** on the right should list major parts / trees the product exposes. Choosing an item requests that subject under the camera rules above—still presentation, still under Product Law.

**Owner today:** shell-nav / seat-stack / DOM config list (interim debt under DOM chrome absorption). Evolve the existing list; soft-hide duplicates; do not clone a second rail that also lists seats.

### 3.2 General settings (not frozen)

Beside that navigation, a **settings** control holds cross-cutting preferences, including at least:

- **Theme** — two product themes (Command Space / Instrument Space); **one theme root only** (`document.documentElement`).
- **Language** — UI language selection when productized (scaffold only until copy catalog exists).
- **Overall UI scale** — readability preference (presentation state only).
- Room for further preferences later.

Inventory is **deliberately not frozen** in this vision.

**Owner today:** `frontend/spatial/theme-root.*`, `frontend/spatial/settings.*`, theme lighting adapter. Extend the same panel; no second settings island on the Hero canvas.

---

## 4. Ownership table (extend these first)

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
| Far links (terms, privacy, …) | `aside.far-environment` | **Keep** outside machine |

If a future need is missing from this table, **add a row here** before creating a module.

---

## 5. Brand and hero image

The public entrance may feature a dedicated **hero image** that communicates networked AI / team collaboration (connected nodes or similar). The product reference mark—linked isometric cubes with circuit motif on black—is an example of mood: clear, technical, collaborative, not cluttered.

The image supports Layer A identity. It does not replace the live 3D Hero machine in Layer B.

---

## 6. Slice ladder (under this vision only)

Ordered for honest depth-first feel. Prefer adjust slices before additive entrance work.

### Phase V0 — Camera truth

| ID | Intent | Class |
|----|--------|-------|
| V0.1 | ~45° world baseline via existing dock numbers | Adjust |
| V0.2 | Close/return restores baseline dock | Adjust |
| V0.3 | Subject-lock regression (Cam-6) | Test / adjust |
| V0.4 | Free orbit/scroll about subject while open | Adjust gates |
| V0.5 | Zoom ceiling (e.g. toward 200%) still subject-locked | Adjust clamps |

### Phase V1 — Branch walk

| ID | Intent | Class |
|----|--------|-------|
| V1.1 | Back/Next contract on open parent | Document + map |
| V1.2 | Wire existing controls to child cycle | Adjust |
| V1.3 | Explicit leave-tree → baseline | Adjust |
| V1.4 | Optional per-face dock offset | Adjust after V0 |

### Phase V2 — Machine chrome

| ID | Intent | Class |
|----|--------|-------|
| V2.1 | Parts/trees nav map data | Adjust existing lists |
| V2.2 | Right dropdown using that map | Adjust shell-nav |
| V2.3–V2.6 | Settings shell, theme, scale, language scaffold | Adjust settings |

### Phase V3 — Entrance (Layer A)

**Contract:** `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md` (V3.1) — regions, owners, forbidden clashes.

| ID | Intent | Class |
|----|--------|-------|
| V3.1 | Entrance IA / layout contract | Docs then additive layout |
| V3.2 | Brand hero image | Additive asset/region |
| V3.3 | Gentle Hero atmosphere | Adjust wiring |
| V3.4 | Get-started → machine baseline | Adjust handoff |
| V3.5 | Far-environment links | Keep / clarify |

### Phase V4 — Polish (optional)

Tree color language, full seat smoke, reduced-motion path, mobile parity, vision checkpoint refresh—always via existing owners first.

**Parallel tracks** (Conn, provider keys, backend BLOCKS_029) stay on their contracts; they do not fork this vision or the Hero runtime.

---

## 7. What already exists vs what still asks for feel

| Intent | Rough status on main |
|--------|----------------------|
| Hierarchy trees and seat faces (P1–P7.1) | Presentation ladder largely landed |
| Camera follow + selected-tree look-at (Cam-1–Cam-6) | Landed; operator may still refine *feel* (true 45° baseline, return path, branch walk) |
| DOM soft-hide + action map | Landed; absorption continues |
| Theme root + settings surface | Landed; extend, don’t fork |
| Website entrance as full marketing shell | **Vision target** — additive on existing shell |
| Right-side tree dropdown + full settings UX | **Vision target** — adjust existing chrome |
| 029 production release | **Not claimed** |

---

## 8. Standing product boundaries

- Presentation never invents entitlement, scheduler choice, or durable auth.
- One theme root (`document.documentElement` only).
- One hierarchy runtime; one primary Hero flex apply path.
- Hero / canvas does not write Firestore, charge PayPal, or bind secrets.
- GitHub Connection and seat provider keys remain normal-UI / Edge paths—not live bind inside the 3D plate.
- Green CI and merged camera slices are necessary evidence, not Endorsement of 029 release.

---

## 9. How work proceeds

1. Amend **this file** when intent changes (single vision).
2. Name owner from §4; if none, add a row, then create **one** module only if §0.1 is satisfied.
3. Implement the smallest adjust under ORUCAVEAM (O→M).
4. Verify without claiming 029 release.
5. Record checkpoint / HandOver; update NEXT_SLICES status as slices land.

**Owner endorsement** of visual quality remains separate when environment and outer UI are fair enough to judge.

---

# 10. Tree-machine vision extension — structural baseline, not a new roadmap

The current Seat hierarchy is a proven mechanism, but it is **not the completed 3D Hero machine**. The final machine is intended to contain multiple semantic tree families and can contain broad, asymmetric, and recursively nested branches. A `treeID` identifies a semantic tree; a `branchId` identifies a semantic branch by parentage and meaning. Coordinates never define identity.

A branch is a real product integration, not a decorative display. Its meaning includes purpose/responsibility, product/UI payload, configuration/accessibility payload where applicable, expansion volume, adjacency clearance, connection/path ownership, camera relationship, responsive/reduced-motion behavior, and verification state.

The machine should therefore be designed from semantic payload outward:

`root truth → tree/branch semantics → responsibility → UI/product payload → expansion requirements → connection topology → adaptive geometry → camera/travel → interaction → contribution visualization`

Different trees may legitimately require different branch counts, depths, heights, widths, radii, spacing, density, and expansion footprints. The machine must reserve physical space for the expanded payload, neighboring divisions, wiring corridors, camera travel, readability, and responsive constraints.

### Turn-loop visualization

The eventual turn-loop is not final animation yet. Its intended meaning is a connected electrical contribution flow: an active WebAi turn activates the relevant tree/branch divisions, their wiring becomes spatially available, and the signal travels through actual connected paths toward the central workspace. Participating expansions are expected to be active/open during this visual state so the wiring can be continuous.

The effect must describe the machine's real connection topology, not a disconnected decorative path.

### Expandable machine behavior

Selecting a tree or branch may cause its corresponding machine division to open and reveal the product surfaces owned by that semantic unit. Opening and closing should feel like a manufactured technological mechanism changing state, with smooth stateful choreography and readable intermediate states. Instant visibility toggles, teleports, or abrupt coordinate swaps are not the intended final language.

The Hero's maximum expanded footprint is derived from the active division payloads and required clearance; it is not a universal global multiplier.

### Relationship to existing vision slices

The historical V0–V4 ladder remains valuable continuity and recovery context. It is not a second roadmap authority. Current implementation order belongs to `MASTERPLAN.md` and the active #278 execution ledger. This section explains the intended experience meaning that future structural and visual work must preserve.

### Current truth boundary

- `TREE-DOMAIN` is not complete.
- `TREE-HERO-SEAT` is partial and currently provides the strongest runtime evidence.
- `TREE-SKILL-RESPONSIBILITY` is not complete as a rendered machine tree.
- Full tree/branch/division connection topology is not complete.
- Final turn-loop electrical choreography is not complete.
- Final machine-opening animation language is not complete.
- Current hierarchy/camera timings are living baselines, not final visual law.
- `HERO_LOW_ORBIT` and `TURN_FOLLOW` remain retired.

The structured census is maintained in `docs/TEAMAI_3D_HERO_TREE_CENSUS.*`. Changes to tree/branch/division semantics or implementation must keep that census synchronized through the governed workflow.
