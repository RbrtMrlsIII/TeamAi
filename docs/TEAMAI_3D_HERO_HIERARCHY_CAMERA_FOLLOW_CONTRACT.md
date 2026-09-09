# TeamAi 3D Hero — Hierarchy Camera Follow Contract (Cam-1)

**Status:** Living presentation contract (Cam-1 documentation slice)  
**Authority:** PRODUCT_LAW Family J → Machine Interaction Contract → Hierarchy Runtime Baseline → this contract  
**Claim:** presentation only · **no 029-released claim**  
**Skills:** teamai-project → hierarchy-runtime → workspace-ring · companion motion/responsive

---

## 1. Purpose

Locks the product camera + hierarchy behavior that was under-specified across sessions, using live evidence (mobile Hero screenshots 2026-09-09) and user authority:

1. Camera **follows** mechanical tree growth (not only fixed docks).
2. Nested parents grow branches; camera can enter each subtree’s center target.
3. Free zoom stays aimed at the **current tree center**.
4. Whole-web PoV supports edge-drag and inverse-swipe.
5. On-canvas faces stay **readable** at depth (general tree faces, not only login/config).
6. Floating “normal web” chrome is **interim debt** — product controls belong **inside** the machine tree.

---

## 2. Evidence from live Hero (interim debt)

Observed on GitHub Pages (mobile Chrome):

| On-screen element | Location today | Product law |
|-------------------|----------------|-------------|
| Seat / Configuration stack (Identity…Task/Evidence) | DOM panel right of canvas | **Interim debt** — must absorb into seat shell / machine tree |
| INSPECT Seat / Detail / Back / Next | DOM overlay | **Interim debt** — become camera/tree controls inside machine or environment |
| Wide / Low orbit / Team / Workspace / Map | DOM camera presets | **Retire lock-only modes** that do not follow hierarchy; keep only docks that serve a tree center |
| Open engine / Start turn loop | DOM chrome | Product actions → machine tree faces or workspace ring |
| Hero orient (1/15) / status strip | DOM | Presentation status may stay minimal chrome; prefer in-machine readout |
| Title “Living Web AI Workspace” | Page shell | Page identity OK; not a product-config surface |

**Canonical rule (Machine Interaction Contract §5):**  
There is **no parallel “UI outside the Hero”** for product configuration. Legacy side stacks / floating panels are interim presentation debt to be absorbed into the machine tree over time.

**Allowed outside the machine (far environment only):** terms, privacy, contact, about — camera-angle tabs in the environment, not product gears.

---

## 3. Camera follow law (product)

```text
Whole-web PoV
  center target = machine / workspace origin
  free zoom toward that center
  edge-drag (mouse) · inverse-swipe (touch)

Open parent node
  mechanical tree grows at that node (structure first; skins optional later)
  camera docks to that node’s pre-made PoV
  center target = that parent’s origin

Open child that is also a parent
  new branch grows from that node
  camera follows to that child’s pre-made PoV
  center target = that subtree origin
  free zoom still allowed, always at current center

Leaf / dense face
  stay readable (scale + FOV + dock) OR APP_UI_HANDOFF
```

### 3.1 Pre-made cameras

Each hierarchy depth / node family may own a **named dock** with:

- eye position `p`
- **center target** `t` (look-at; zoom never breaks this lock)
- base FOV `f`

User may zoom in/out **as long as look-at remains the current center target**.

Applies to **all** complex parent/child trees (seat shell, workspace rings, setup engines, future gears).

### 3.2 Retire lock-only cameras

Camera modes that **do not follow** any hierarchy node and only “lock” a free view are **debt**:

- Prefer: hierarchy-follow docks + whole-web center-target orbit/zoom.
- Preset buttons (Wide / Low orbit / Team / …) that ignore open tree state should be removed or rewritten as **named docks bound to a center target**, not independent lock modes.

Existing physical docks (`HERO_WIDE`, `SEAT_CLOSE`, `DETAIL_ANCHOR`, `WORKSPACE_CLOSE`, …) remain valid **only** when they serve a defined center target and hierarchy follow path.

### 3.3 NAVIGATE vs INSPECT (unchanged boundary)

| Mode | Allowed |
|------|---------|
| **NAVIGATE** | Free orbit/zoom about **current** center target; edge-drag; inverse-swipe |
| **INSPECT** | Semantic dock wins; free orbit may pause or stay constrained until Back/close |
| **DEMO** | Scripted path; reduced-motion snaps |

Opening a parent may enter INSPECT for that dock; user can return to NAVIGATE about that tree’s center (not forced back only to global HERO_WIDE).

---

## 4. Whole-web PoV input

| Input | Product behavior |
|-------|------------------|
| Wheel / pinch | Zoom toward current center target (clamped §9 `NAV_ZOOM_*`) |
| Mouse at **screen edge** | Continuous orbit in that direction (edge zones) |
| Touch **swipe** | Camera moves **inversely** proportional to swipe path |
| Reduced motion | Snap docks; no continuous edge drift; tighter zoom clamps |

**Gap today:** orbit/zoom is blocked while `openParentId` is set; edge-drag is unwired; swipe is direct, not inverse. Cam-2–Cam-4 implement the gaps.

---

## 5. Depth readability (general tree faces)

Camera-fill / FOV boost already aim at full-area login/config (P-R2).

**Product extension:** when camera goes deeper into **any** hierarchy face (connection, behavior, toolkit, …), on-canvas faces must **stay readable** — not shrink into noise. Prefer dock + FOV + plate scale; hand off only when WebGL cannot host the control honestly (`APP_UI_HANDOFF`).

---

## 6. Overall UI scale (settings tree)

**Not** a forced viewport shrink of product chrome as the primary rule.

Overall UI scale is a **user preference** under the **overall settings** hierarchy tree:

- Range **50% – 100%** (manual drag / control)
- Lives **inside** the machine settings tree (not a page-local CSS authority forever)
- Interim CSS `transform: scale(...)` on seat-stack is debt until absorbed

Viewport responsive rules still exist for legibility; they must not invent a second theme or permission system.

---

## 7. Structure-first (no skins required)

Mechanical tree **may grow without skins** (geometry / parts only). Materials and lighting polish (Owner / M) layer on after structure and camera follow hold.

---

## 8. Execution ladder (Cam slices)

| Slice | Intent | Status |
|-------|--------|--------|
| **Cam-1** | This contract (docs + skill pointers) | **This PR** |
| **Cam-2** | Camera follows open parent/child (center target per node) | Next |
| **Cam-3** | Free zoom on **current** tree center even when parent open | After Cam-2 |
| **Cam-4** | Edge-drag + inverse-swipe whole-web PoV | After Cam-3 |
| **Cam-5** | Absorb interim DOM chrome into machine trees; settings UI scale 50–100% | Parallel / after follow works |
| **Cam-6** | Retire lock-only preset cameras; keep hierarchy-bound docks only | With Cam-2/5 |

Green CI ≠ Endorsement. **no 029-released claim**.

---

## 9. Related

- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` §5 nested depth / no parallel outside UI  
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` R3–R5, §9 zoom numbers  
- `docs/TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md` click/zoom contract  
- `public/hero-flex.js` `cameras()` · `applyNavCamera()` (current gaps)  
- `public/hero-seat-stack.js` (interim DOM debt)

---

## 10. Design principle

**The camera follows the growing tree. The tree holds the product. Outside the machine is only the far environment. Lock-only cameras that follow nothing are debt.**
