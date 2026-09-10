# TeamAi Product Vision — Entrance, Machine, and Camera

**Status:** Product intent (living)  
**Authority order:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → this document → camera/hierarchy contracts → implementation slices  
**Claim:** presentation and experience intent only · **not** a Product Law rewrite · **no 029-released claim**

This document records what the product should *feel like* for a human arriving at TeamAi and moving between the public site, the 3D Hero machine, and individual trees/branches. It does not grant entitlement, scheduler authority, or durable backend power.

Related technical contracts (already on main):

- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_CAM6_MANDATORY_SELECTED_TREE_LOOKAT.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`

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

### Layer B — 3D Hero machine (after the user begins)

Once the user **gets started**, the Hero becomes the primary spatial instrument: a readable machine whose trees and branches carry product structure (seats, connection, behavior, toolkit, and so on).

**Baseline pose (home of the machine)**

- Default viewing angle is approximately **45° elevation** toward the machine / workspace — a stable, legible “standing in front of the instrument” view.
- From this baseline the user may **freely drag / orbit** and **zoom** within safe product clamps, as long as the gaze remains coherent with the machine (not a broken free-fly that loses the subject).
- This baseline is the view the product **returns to** when the user leaves a tree or branch inspection.

---

## 2. Camera philosophy (conceptual)

### 2.1 One subject at a time

When nothing is opened, the subject is the **whole Hero / workspace** (Layer B baseline, ~45°).

When a **tree** is selected (for example a seat shell), the subject becomes **that tree**. The camera may move closer and reframe, but **look-at must stay on the selected tree**, not on the empty center of the world while the tree sits off to the side.

When a **branch** of that tree is focused (Connection, Behavior, Toolkit, …), the subject becomes that branch’s readable face. Zoom and gentle orbit remain allowed; gaze still respects the current subject.

### 2.2 Free motion without losing the subject

While a tree or branch is selected:

- **Mouse / touch drag** may slide the viewpoint around the subject (orbit).
- **Scroll / pinch** may zoom in and out.
- Both must keep the selected tree or branch as the facing target.
- Motion respects reduced-motion and product zoom limits (exact numbers live in hierarchy baseline §9 / camera contracts — not frozen in this vision).

This is the opposite of “every click snaps to a dead preset aimed at world origin.” Presets may still define *framing style* (how close, how tall); they must not redefine *what we are looking at* away from the selected subject.

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

**Back** and **Next** (or equivalent) should be understandable controls for walking the branches of the *current* tree — not a second unrelated UI system. Interim on-screen buttons are acceptable while they are being absorbed into machine-native controls; they must not invent a parallel configuration authority outside the machine.

---

## 3. Navigation and settings (chrome)

### 3.1 Structural navigation

After the user is in the machine experience, a **dropdown (or equivalent) navigation** on the right side of the view should list the major parts / trees the product exposes (rings, seats, setup, workspace faces, and so on as the ladder matures). Choosing an item is a request to bring that subject into view under the camera rules above — still presentation, still under Product Law.

### 3.2 General settings (not frozen)

Beside that navigation, a **settings** control should eventually hold cross-cutting preferences, including at least:

- **Theme** — the two product themes (Command Space / Instrument Space semantics per Product Law; one theme root only).
- **Language** — UI language selection (when productized).
- **Overall UI scale** — a slider or equivalent for readability.
- Room for further preferences later.

These preferences are **configuration of presentation**, not durable domain authority. This vision deliberately **does not freeze** the full settings inventory or control layout; implementation may phase them in without inventing a second theme system or a second law family.

---

## 4. Brand and hero image

The public entrance may feature a dedicated **hero image** that communicates networked AI / team collaboration (connected nodes or similar). The attached product reference — three linked isometric cubes with circuit motif on black — is an example of the *kind* of mark and mood: clear, technical, collaborative, not cluttered.

The image supports Layer A identity. It does not replace the live 3D Hero machine in Layer B.

---

## 5. What already exists vs what this vision still asks for

| Intent | Rough status on main |
|--------|----------------------|
| Hierarchy trees and seat faces (P1–P7.1) | Presentation ladder largely landed |
| Camera follow contracts + selected-tree look-at (Cam-1–Cam-6) | Contracts and force look-at landed; operator may still refine *feel* (true 45° baseline, return path, branch walk UI) |
| Website entrance as a full marketing + logo + social shell | **Vision target** — not claimed complete here |
| Right-side tree dropdown + settings (theme / language / scale) | **Vision target** — phased; settings not frozen |
| Back / Next wired through every branch of the open tree | **Vision target** — align with machine interaction / DOM absorption debt |
| 029 production release | **Not claimed** |

---

## 6. Governance boundaries (must stay true)

- Presentation never invents entitlement, scheduler choice, or durable auth.
- One theme root (`document.documentElement` only).
- Hero / canvas does not write Firestore, charge PayPal, or bind secrets.
- GitHub Connection and seat provider keys remain normal-UI / Edge paths — not “live bind inside the 3D plate.”
- Green CI and merged camera slices are necessary evidence, not Endorsement of 029 release.

---

## 7. How work should proceed from this vision

1. Keep this file as the **single product-vision home** for entrance + machine camera experience.
2. Implementation slices remain small and ordered under `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` and MASTERPLAN gates.
3. Camera refinements (true baseline 45°, return-from-tree, branch Back/Next) amend camera contracts and code only when a slice is explicitly started — **this document alone is not a coding order**.
4. Website entrance chrome may land as its own presentation slice after machine baseline feel is honest.
5. Settings expand only under the one theme-root and Product Law constraints.

**Owner endorsement** of visual quality remains separate when environment and outer UI are fair enough to judge.
