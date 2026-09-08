# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living baseline (required for hierarchy slices; **not frozen**)  
**Date:** 2026-09-08  
**Authority:** PRODUCT_LAW.md (Family J + hard invariants) → MASTERPLAN.md → Machine Interaction Contract → Project-Wide Census → Seat Shell Hierarchy v1 → **this baseline** → implementation  
**Companion skills:** `skills/frontend/spatial/hierarchy-runtime/SKILL.md` (execution) · `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` (first parent fill)

---

## 0. How to use this document (sessions)

### 0.1 Living, not frozen

This baseline is the **shared root set** every hierarchy/open-machine slice must **account for**. It is intentionally **not** a frozen graphics standard:

- Numeric ranges, mesh altitudes, gesture maps, and transition timings **will be adjusted** as Seat shell v1 and later parents teach us what works.
- Structure (roots, phases, authority boundaries, validation *kinds*) should stay stable unless Product Law or Machine Interaction Contract changes.
- Amendments are expected. **Omitting** a root without recording why is what fails validation — not discovering that a constant needs tuning.

### 0.2 Required for execution slices

Any PR/slice that:

- opens/closes a hierarchical parent, or  
- adds child/leaf faces inside the machine, or  
- changes camera dock / hierarchy motion / in-machine input  

**must**:

1. Name the **part IDs** touched (parent / child / leaf).  
2. State how each **applicable root** below is satisfied or **explicitly deferred** with reason.  
3. Not invent a second theme root, second motion system, or durable authority in the browser.  
4. Include or update **static contract coverage** when new part IDs or phases are introduced.

Slices that only touch materials constants, copy, or non-hierarchy bugfixes may note “N/A — no hierarchy runtime change.”

### 0.3 Validation (fail when not followed)

| Check | Fail if |
|-------|---------|
| Authority | Slice claims entitlement/auth from open/camera/gear motion |
| Theme | New theme tokens or body-level theme authority for Hero materials |
| Hierarchy model | Open UI without part IDs / open state / one-open rule when applicable |
| Motion | Continuous choreography required to understand hierarchy under `data-motion=reduced` |
| Leaf placement | Product leaf controls only as external chrome with no path to in-machine placement (new debt without debt note) |
| Amendment silence | Root behavior changed in code with no note in PR body or this doc / sheet |

Validation is **contract + review + tests**, not a single CI oracle for “beauty.”

### 0.4 Amendment path

1. Prefer **small constant / formula updates** in implementation with PR note (“adjusted seat open altitude 0.62 → X after visual check”).  
2. If a **root is added or removed**, update **this document** in the same PR or a follow-up docs PR before the next parent slice.  
3. Seat-specific trees stay in hierarchy sheets (e.g. Seat Shell v1); this file stays **cross-parent**.

---

## 1. Purpose

Provide one place that lists the **runtime roots** shared by every mechanical hierarchy animation:

lighting/theme · camera/PoV · input · transitions · animation display · layout math · viewport · graphic preferences · wiring/trajectories · altitudes · part↔theme binding.

So sessions do not re-derive a private animation stack per slice.

---

## 2. Product Law boundary (non-negotiable)

- Family **J** presents; engines (C/E/G/H/I/…) own durable truth.  
- Open shells, gears, camera pose, and leaf faces **never** grant entitlement, authorization, or scheduler eligibility.  
- One theme law: Light Spatial Skeuomorphism / Dark Spatial Glassmorphism via **single theme root** (`document.documentElement` attributes written by spatial theme-root).  
- Reduced motion, keyboard, and accessible names remain mandatory.  
- Legal/institutional content stays in **environment** cameras; product hierarchy stays **in-machine** (Machine Interaction Contract).

---

## 3. Runtime roots (R1–R10)

Each root has: **intent**, **current anchors on main**, **must-account-for**, **may-evolve**, **deferred**.

### R1 — Hierarchy state model

**Intent:** Single state language for open machines.

**Suggested shape (evolving):**

```text
HierarchyRuntimeState
  openParentId: null | PartId      // e.g. SEAT_SHELL#3
  focusedChildId: null | PartId
  focusedLeafId: null | PartId
  phase: rest | opening | open | closing
  selectedSeatIndex: number        // when parent is seat-scoped
  motionMode: full | reduced       // synced from data-motion
  cameraId: string
```

**Must-account-for:**

- One fully open parent at a time (v1 rule; may relax later with explicit amendment).  
- Part IDs stable strings (sheets define catalogs).  
- Phase drives motion; camera does not authorize.

**Current anchors:** Seat selection + `cameraId` in `hero-flex.js`; inspection spine stage IDs; **no unified HierarchyRuntimeState yet**.

**May-evolve:** Multi-open rules, deep focus stacks, undo of open.

**Deferred:** Persistence of open state across reload as product feature.

---

### R2 — Layout & pose math (positioning formulas)

**Intent:** Shared formulas for ring placement, altitudes, open offsets, child stack packing.

**Current anchors (`hero-flex.js`):**

- `profile(seatCount)` → `workspace`, `seatRadius`, `seatScale`, `cameraDist`, `ambient`, `artifacts`  
- `seatPos(seat)` → `[cos(a)*seatRadius, 0.62, sin(a)*seatRadius]`  
- Seat yaw from `seat.a` on the ring  

**Must-account-for:**

- Ring radius and seat angle remain functions of **seat count** (1–8 presentation scaling).  
- **Altitude (Y)** of shell rest vs open vs child faces is explicit (named constants or functions), not magic numbers scattered without labels.  
- Child stack offset: depth index → local offset (radial and/or vertical) so faces do not z-fight.  
- Open pose is a **deterministic** function of rest pose + open parameters (time phase optional).

**Initial formula placeholders (tunable, not frozen) — names live in §9:**

```text
seatRestY          = SEAT_REST_Y          // 0.62 measured
seatOpenLiftY      = SEAT_REST_Y + SEAT_OPEN_LIFT
childStackY(i)     = seatOpenLiftY + i * CHILD_STEP_Y
childStackRadial(i)= radialIn + i * CHILD_STEP_R
openAmount(t)      ∈ [0,1]  // 1 = fully open; reduced motion may jump to 1
```

Numeric values: **§9 living numbers table** (documentation is the number home).

**May-evolve:** All numeric placeholders after visual sessions.  
**Deferred:** Full constraint solver / physics.

---

### R3 — Camera & normal PoV angles

**Intent:** Semantic cameras for wide, seat dock, workspace, map; hierarchy dock does not fight free orbit forever.

**Current anchors:**

- `cameras()` catalog: `HERO_WIDE`, `HERO_LOW_ORBIT`, `TEAM_ORBIT`, `SEAT_CLOSE`, `WORKSPACE_CLOSE`, `TURN_FOLLOW`, `OVERHEAD_MAP`, `DETAIL_ANCHOR`  
- `setCamera(id)` with reduced-motion snap  

**Must-account-for:**

- Selecting a hierarchical parent **docks** to a seat-local or part-local camera (Seat sheet: `SEAT_CLOSE` or successor).  
- Close/back returns to a defined wide/team camera.  
- Camera IDs remain presentation identifiers, not backend IDs.  
- Default “normal PoV” for orientation remains wide/team — hierarchy dock is intentional mode change.

**May-evolve:** Per-seat dock eye points; part-local DETAIL_* cameras; swipe-orbit when not in inspection lock.  
**Deferred:** Full 6DOF free camera as primary UX.

---

### R4 — Input (pointer, keyboard, future swipe)

**Intent:** Clear ownership of gestures so hierarchy select does not collide with orbit/demo keys.

**Current anchors:**

- Canvas click cycles seat / focus (simplified)  
- Keys: `d` demo, `m` motion, `1–8` seat count  
- Camera buttons in shell DOM  

**Must-account-for:**

- **Select parent** (seat) vs **select child/leaf** vs **close** are distinct intents.  
- Keyboard path exists for open/close/next child when hierarchy is active (may be minimal in first slice).  
- Pointer hit targets on open faces remain usable on narrow viewports (see R7).

**Modes (evolving):**

```text
NAVIGATE   — wide/team, ring select
INSPECT    — parent open, child/leaf focus
DEMO       — turn loop (existing)
```

**May-evolve:** Swipe to orbit in NAVIGATE; swipe between children in INSPECT.  
**Deferred:** Full gesture system, gamepad.

---

### R5 — Motion phases & transitions

**Intent:** One phase language and duration scale for open/close and camera travel.

**Current anchors:**

- `durations()` scaled by reduced motion (`k = 0.35` when reduced)  
- Camera lerp ~700ms unless reduced (snap)  
- Turn-loop state timings  

**Must-account-for:**

- Hierarchy phases: `rest → opening → open → closing → rest`.  
- Reduced motion: prefer **snap** or very short opacity/scale; hierarchy must remain understandable.  
- No requirement for continuous gear spinning to read status.  
- Easing named (e.g. smoothstep) and shared where possible.

**May-evolve:** Duration table per phase; separate open vs camera times.  
**Deferred:** Timeline editor, sequenced multi-part choreography beyond one parent.

---

### R6 — Animation display design

**Intent:** What the eye should read at each phase (silhouette, hierarchy, not noise).

**Must-account-for:**

- Open parent: silhouette change is readable at wide-adjacent and docked PoV.  
- Children: ordered stack matches Product Law order for that parent sheet.  
- Stubs vs interactive layers are visually distinct enough (opacity, scale, or marker) without implying permission.  
- Ambient micro-drift suppressed or reduced while `phase === opening|open|closing` (inspection priority).

**May-evolve:** Gear tooth meshes, collar latches, light shafts.  
**Deferred:** Cinematic-only paths that have no reduced-motion equivalent.

---

### R7 — Viewport & UI size (devices)

**Intent:** Open assemblies remain readable on narrow/mobile and desktop.

**Current anchors:**

- `responsiveFovBoost()` for narrow aspect  
- Canvas resize / DPR clamp  
- Playwright mobile not fully matrixed for hierarchy yet  

**Must-account-for:**

- Open shell + child stack not clipped into illegibility at common mobile widths.  
- Touch/pointer targets for leaves meet a minimum presentation size (exact px TBD; track failures in evidence).  
- FOV/camera distance may adjust when `phase === open` (optional, tunable).

**May-evolve:** Device matrix in e2e; density attribute interaction.  
**Deferred:** Separate mobile-only Hero app shell.

---

### R8 — Graphic / motion preferences (settings)

**Intent:** User-facing preferences that affect hierarchy runtime without becoming a second product authority.

**Current anchors:**

- `data-motion` on `document.documentElement`  
- `setReducedMotion` / sync from document  
- Demo motion toggle  

**Must-account-for:**

- Hierarchy runtime **reads** motion preference from the canonical attribute.  
- Future graphic settings (quality, shadows) live in **General settings gear** (in-machine) or environment — not ad hoc globals per slice.  
- Preference changes do not write durable backend state from the canvas.

**May-evolve:** Quality tiers, shadow toggles, FPS caps.  
**Deferred:** Full settings gear implementation (own slice).

---

### R9 — Wiring, trajectories, connections

**Intent:** Paths that show contribution or parent↔child linkage without claiming network truth.

**Current anchors:**

- Contribution bezier-style path Seat → workspace center in `hero-flex`  
- Trace slots on workspace  

**Must-account-for:**

- Trajectories are **presentation**. Connection health faces do not assert live provider success without read-model.  
- Child faces may use short local “guide” offsets; avoid a second global path system per slice.  
- When wiring to read-models later, map through documented presentation enums (`unknown` / `loading` / `unavailable` / …).

**May-evolve:** Explicit parent–child guide curves; contribution corridor preserved during open.  
**Deferred:** Real-time multiplayer cursor paths.

---

### R10 — Theme & material binding

**Intent:** Open machinery respects the same theme materials as rest poses.

**Current anchors:**

- `heroMaterialContext()` from `data-theme-mode` / `data-density` (+ reduced motion flags)  
- `mapHeroThemeLighting` in spatial adapter (canonical pure function)  
- Authored materials for ring/seat shell  

**Must-account-for:**

- Open/child/leaf materials use the same context pipeline — no page-local palette authority.  
- Light vs dark remain Product Law modes.  
- Density may tighten spacing of child stack (tunable).

**May-evolve:** Open-state material emphasis (slightly higher rim) still from same context.  
**Deferred:** Per-part authored material graphs unrelated to theme.

---

## 4. Cross-root phase diagram

```text
NAVIGATE (wide/team)
  input: select seat/parent
  camera: HERO_WIDE / TEAM_ORBIT / …
  phase: rest
        │
        ▼
INSPECT opening
  camera: dock (SEAT_CLOSE / part-local)
  phase: opening → open
  layout: openAmount 0→1, children reveal
  motion: scaled by R5 / reduced snap
        │
        ▼
INSPECT open
  input: next child / leaf / close
  leaf: in-machine only (product)
        │
        ▼
INSPECT closing → NAVIGATE
  phase: closing → rest
  camera: return wide/team
```

---

## 5. Relationship to Seat Shell v1

Seat Shell Hierarchy v1 **fills** this baseline:

| Baseline | Seat v1 fill |
|----------|----------------|
| R1 | `SEAT_SHELL#i`, children, `SEAT_CONNECTION_HEALTH_FACE` |
| R2 | Ring seat + open lift + stub stack offsets |
| R3 | Dock `SEAT_CLOSE` |
| R4 | Select seat / close; minimal keyboard |
| R5 | Open/close phases |
| R6 | Shell silhouette + stub vs connection layer |
| R7 | Readable open on narrow |
| R8 | Respect `data-motion` |
| R9 | No false connection trajectory claims |
| R10 | Existing seat shell materials |

Seat v1 implementation PRs must map to these rows (short table in PR body is enough).

---

## 6. Implementation guidance (when coding starts)

1. Prefer **extending** `hero-flex.js` state and helpers over a parallel animation framework.  
2. Name constants for altitudes and open amounts.  
3. Keep public/ isolation unless a deliberate Option 3 import is authorized.  
4. Add static tests for part IDs and phase/one-open rules as they land.  
5. Record visual evidence when open silhouette is first readable.  
6. **Do not** expand DOM seat-stack as the permanent hierarchy home.

---

## 7. Explicit non-goals of this baseline document

- Freezing numeric art direction  
- Replacing Product Law or Machine Interaction Contract  
- Implementing Seat open in this PR  
- Full graphic settings product  
- Declaring 029 experience released  

---

## 8. Skills (execution help; docs still hold numbers)

| Concern | Skill |
|---------|--------|
| Shared R1–R10 procedure + how to consume/amend §9 | `skills/frontend/spatial/hierarchy-runtime/SKILL.md` |
| First parent fill (Seat shell v1) | `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` |
| Theme / legal boxes / F0–F7 | `skills/frontend/spatial/UI_UX-Promax-Skill.md` |
| Timing tokens | `skills/frontend/spatial/motion/SKILL.md` |
| Viewport | `skills/frontend/spatial/responsive/SKILL.md` |
| Keyboard / reduced-motion a11y | `skills/frontend/spatial/accessibility/SKILL.md` |

A session that implements hierarchy **without** loading the hierarchy-runtime skill **fails validation** (same class as omitting R1–R10). Grok mirrors of these skills are procedural caches only (`docs/SKILL_WIRING.md` §8b).

---

## 9. Living numbers table (documentation holds numbers)

**Rule:** This table is the **number home**. Skills (`skills/frontend/spatial/hierarchy-runtime/SKILL.md`) tell sessions how to consume and amend it. Implementation uses these **names** (or identical literals with the name in a comment). Chat memory is not a number authority.

**Living, not frozen:** visual sessions may change values. Amendment silence (code changes a number with no table/PR note) **fails validation**. Discovering that a constant needs tuning does **not** fail.

**Status key:** `measured` = currently on `main` in `public/hero-flex.js` (or theme adapter MODE_PROFILE). `starting` = named guess for Seat shell v1 open stack — free to learn.

| Name | Value | Status | Root | Anchor |
|------|-------|--------|------|--------|
| `SEAT_COUNT_MIN` | `1` | measured | R2 | `clamp(count,1,8)` |
| `SEAT_COUNT_MAX` | `8` | measured | R2 | `clamp(count,1,8)` |
| `WORKSPACE_R_MIN` | `4.35` | measured | R2 | `profile().workspace` lerp start |
| `WORKSPACE_R_MAX` | `5.95` | measured | R2 | `profile().workspace` lerp end |
| `SEAT_R_MIN` | `4.25` | measured | R2 | `profile().seatRadius` |
| `SEAT_R_MAX` | `6.45` | measured | R2 | `profile().seatRadius` |
| `SEAT_SCALE_MAX` | `1` | measured | R2 | 1-seat scale |
| `SEAT_SCALE_MIN` | `0.78` | measured | R2 | 8-seat scale |
| `CAM_DIST_MIN` | `9.6` | measured | R2/R3 | `profile().cameraDist` |
| `CAM_DIST_MAX` | `12.2` | measured | R2/R3 | `profile().cameraDist` |
| `AMBIENT_MIN` | `0.35` | measured | R6 | `profile().ambient` |
| `AMBIENT_MAX` | `0.78` | measured | R6 | `profile().ambient` |
| `ARTIFACTS_MIN` | `3` | measured | R9 | `profile().artifacts` |
| `ARTIFACTS_MAX` | `8` | measured | R9 | `profile().artifacts` |
| `SEAT_REST_Y` | `0.62` | measured | R2 | `seatPos()` Y |
| `SEAT_OPEN_LIFT` | `0.28` | starting | R2 | Seat v1 open lift (learn) |
| `CHILD_STEP_Y` | `0.22` | starting | R2 | child stack altitude (learn) |
| `CHILD_STEP_R` | `-0.14` | starting | R2 | child stack inward radial (learn) |
| `CAMERA_LERP_MS` | `700` | measured | R3/R5 | `frame()` camera lerp |
| `EASE` | `t*t*(3-2*t)` | measured | R5 | `ease` smoothstep |
| `REDUCED_MOTION_K` | `0.35` | measured | R5/R8 | `durations()` scale |
| `HIERARCHY_REDUCED_SNAP` | `true` | contract | R5 | open/close snap under `data-motion=reduced` |
| `DURATION_FOCUS_MS` | `700` | measured | R5 | turn `focus` |
| `DURATION_ACTIVE_MS` | `900` | measured | R5 | turn `active` |
| `DURATION_CONTRIBUTE_MS` | `1100` | measured | R5 | turn `contribute` |
| `DURATION_ABSORB_MS` | `520` | measured | R5 | turn `absorb` |
| `DURATION_REFLECT_MS` | `520` | measured | R5 | turn `reflect` |
| `DURATION_HANDOFF_MS` | `800` | measured | R5 | turn `handoff` |
| `OPEN_DURATION_MS` | `520` | starting | R5 | hierarchy open (align absorb; learn) |
| `CLOSE_DURATION_MS` | `420` | starting | R5 | hierarchy close (learn) |
| `FOV_WIDE` | `39` | measured | R3 | `HERO_WIDE` |
| `FOV_SEAT_CLOSE` | `36` | measured | R3 | `SEAT_CLOSE` |
| `SEAT_CLOSE_EYE_Y` | `2.3` | measured | R3 | `SEAT_CLOSE.p[1]` |
| `FOV_BOOST_NARROW` | `+4` | measured | R7 | aspect `< 0.85` |
| `FOV_BOOST_MID` | `+2` | measured | R7 | aspect `< 1.1` |
| `FOV_BOOST_WIDE` | `0` | measured | R7 | else |
| `DPR_CLAMP` | `2` | measured | R7 | `resize()` |
| `ROUGH_LIGHT` | `0.48` | measured | R10 | MODE_PROFILE light |
| `ROUGH_DARK` | `0.62` | measured | R10 | MODE_PROFILE dark |
| `REFL_LIGHT` | `0.72` | measured | R10 | MODE_PROFILE light |
| `REFL_DARK` | `0.54` | measured | R10 | MODE_PROFILE dark |
| `GRAZE_LIGHT` | `0.62` | measured | R10 | MODE_PROFILE light |
| `GRAZE_DARK` | `0.44` | measured | R10 | MODE_PROFILE dark |
| `SHADOW_LIGHT` | `0.56` | measured | R10 | MODE_PROFILE light |
| `SHADOW_DARK` | `0.72` | measured | R10 | MODE_PROFILE dark |
| `EMISSIVE_LIGHT` | `0.08` | measured | R10 | MODE_PROFILE light |
| `EMISSIVE_DARK` | `0.16` | measured | R10 | MODE_PROFILE dark |

Theme attributes (not numbers, but the read contract): `data-theme-mode`, `data-density`, `data-motion` on **`document.documentElement` only**.

### 9.1 How a session amends a number

1. Load this table via the hierarchy-runtime skill.  
2. Tune in implementation after visual/a11y check.  
3. Update **this row** in the same PR (`old → new` in PR body).  
4. Keep the **name**. Do not silently rename.  
5. `starting` may become `measured` once Seat v1 open lands and a frame is recorded.

---

## 10. Design principle

**Shared roots, living numbers. Docs hold the numbers. Skills execute them. Every hierarchy slice accounts for R1–R10 or records why not. Authority never rides the camera. Leaves stay inside the machine.**
