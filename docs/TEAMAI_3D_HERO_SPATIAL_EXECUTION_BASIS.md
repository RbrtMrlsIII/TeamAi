# TeamAi 3D Hero — Spatial Execution Basis

**Status:** Working execution basis for the pre-backend / pre-coloring spatial pass  
**Authority:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → `docs/VISION.md` → machine / camera contracts → this execution basis → concrete skills / implementation / verification  
**Scope:** hierarchy structure, camera truth, tree interaction, readability, machine topology, execution evidence  
**Explicitly out of scope for this pass:** backend runtime work, commerce/auth/domain integration, 3D color/material art-direction polishing

## 1. Why this document exists

ORUCAVEAM remains the governing execution discipline, but it is not by itself an implementation plan. This document converts the spatial portion of the current plan into concrete gates that an agent can execute and verify without guessing.

The rule is:

`Product intent → spatial contract → owned root → bounded change → deterministic check → browser proof when required → evidence label → next gate`

No spatial slice is considered complete merely because code exists or CI is green.

## 2. Current baseline

The historical Cam ladder is already fulfilled as an architecture sequence. The current experience ladder is the Vision V-series. `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` is the recovery map between them.

Current known state:

- P1–P7.1 seat hierarchy structure: merged.
- P-R2 / P-R0 / health presentation extensions: merged.
- Cam-1–Cam-4 architecture modules: merged.
- Cam-5/Cam-6 behaviors: substantially landed through DOM/V-series work; lock-only retirement remains debt.
- V0.1–V0.5: merged.
- V1.1–V1.2: merged.
- V1.3: basic leave-tree → baseline is satisfied by V0.2 unless a distinct nested-unwind contract is introduced.
- V1.4: deferred.
- V2.1–V2.6: merged.
- V3.1: open and must be reconciled against current `main` before becoming current canonical work.
- V3.2 asset presence: staged asset exists, but this is not proof of completed or accepted V3.2 behavior.
- R1/R2 concentric intermediate rings: specified but not fully implemented in meshes.

## 3. Spatial execution model

### Gate S0 — Reconcile before editing

**Input:** current `main`, current execution ledger, applicable contract, baseline numbers, existing owner modules.

**Pass conditions:**

1. Identify the current Masterplan item / Vision slice.
2. Identify the existing owner module(s).
3. Classify previous work as `merged`, `superseded`, `partial`, `deferred`, or `not implemented`.
4. Confirm the proposed change does not duplicate a fulfilled Cam/V slice.
5. Confirm backend and 3D color/material work are not being pulled into the slice.

**Output:** a one-paragraph slice statement naming the exact owner set and exclusions.

### Gate S1 — Structural contract

Before changing camera feel, prove the tree structure is the one intended by the machine contract.

For each node being touched, record:

`partId → parent → child order → open/close owner → camera owner → interaction owner → leaf/readability state`

The canonical v1 seat grammar remains:

`Seat Shell → Connection → Behavior → Toolkit → Capabilities → Authorization → Workspace Scope → Task/Evidence`

The hierarchy runtime remains one-open-parent, presentation-only, with explicit state for parent, child, leaf, phase, selected seat, motion mode, camera, and input mode.

### Gate S2 — Spatial numbers

All motion / pose / radius / camera values must resolve to the hierarchy baseline §9.

No new private number table is permitted.

For every changed number:

`old value → reason → browser observation → new value → baseline update`

A value remains `starting` when there is no representative browser evidence. CI alone cannot promote `starting` to `measured`.

### Gate S3 — Camera precedence

The camera must follow one explicit precedence model:

1. reduced-motion constraint
2. semantic inspection dock for the current subject
3. current subject look-at / tree-center lock
4. free NAVIGATE orbit / zoom about that current center
5. responsive readability adjustment
6. presentation-only DOM request where still permitted by the current contract

This order must not permit a stale global preset to steal the subject while a tree is open.

Required state matrix:

| State | Subject | Winning camera authority | Free orbit/zoom |
|---|---|---|---|
| Closed | whole machine/workspace | `HERO_WIDE` / world baseline | yes |
| Seat open | seat shell | selected-tree dock + look-at | after dock, about seat center |
| Child focused | child branch | child/detail dock + look-at | after dock, about child center |
| Leaf/detail | readable face | detail dock / camera-fill | constrained as required for readability |
| Setup fill | setup/auth content | setup fill dock | no competing inspect orbit |
| Reduced motion | current subject | snap to semantic dock | continuous drift suppressed |
| Back/close | parent / world | semantic return path | reset according to current subject |

Any implementation that cannot state which row wins is not ready for merge.

### Gate S4 — Tree movement

A parent opens by mechanical growth first. Camera movement follows the resulting subject; it does not merely switch to a convenient static view.

For nested trees:

`open parent → branch grows → camera targets parent center`

`open child-parent → new branch grows → camera targets child subtree center`

`leaf → readable face OR APP_UI_HANDOFF`

Do not introduce a second branch walker. Use the existing hierarchy focus APIs and action-map path.

### Gate S5 — Interaction contract

Every active hierarchy slice must define the input path for:

`select parent → open → select child/leaf → Back → Next → close`

Keyboard accessibility is required where the hierarchy is interactive. NAVIGATE and INSPECT ownership must remain distinct. Demo movement must not steal inspect interactions.

### Gate S6 — Readability

Before any visual polish, prove geometry and content remain readable at the intended depth.

Required checks:

- wide baseline is legible;
- open parent remains identifiable;
- focused child remains identifiable;
- dense leaves do not collapse into noise;
- narrow viewport does not clip the active assembly;
- reduced-motion mode remains understandable;
- `APP_UI_HANDOFF` is used only when WebGL cannot honestly host the control.

This gate is deliberately about geometry, scale, camera and usability, not color grading.

### Gate S7 — R1/R2 topology boundary

The full machine topology is not complete yet.

Current map:

`R0 Workspace Core → R1 Backend Display → R2 Setup/Config → R3 Seat Ring`

For this pass:

- R0 and R3 existing structure may be verified/refined.
- R1/R2 must be treated as **planned/spec-defined unless their concrete owner exists**.
- No backend implementation is pulled in merely because R1 visually represents backend platforms.
- R2 auth/setup remains mechanical presentation; durable auth remains outside this spatial slice.

A slice may add R1/R2 presentation stubs only when it has a named existing owner and keeps presentation-only boundaries.

### Gate S8 — Integration proof

Evidence must increase with the claim.

| Claim level | Required proof |
|---|---|
| Structural contract | static/unit tests |
| Camera module math | deterministic module tests |
| Wiring / apply path | assembly test proving intended patch/wire is present |
| User interaction | Playwright browser behavior |
| Responsive / reduced motion | Playwright or equivalent browser proof |
| Learned spatial number | browser observation + baseline amendment |
| Completed slice | merged implementation + matching evidence + recorded completion/endorsement |

`Green CI` is not a substitute for browser proof where the claim is visual or interactive.

## 4. Concrete execution sequence before backend / coloring

### SP-01 — Canonical spatial state snapshot

Reconcile the following into one table before any new feature work:

`P1–P7.1 / P-R0 / P-R2 / F / Cam-1–Cam-6 / V0.1–V3.5 / R0–R3`

Each entry gets:

`implemented | verified | runtime-proven | deferred | debt | next owner`

### SP-02 — Camera precedence verification

Add the smallest deterministic test matrix for the precedence rules in Gate S3.

No feature expansion is needed. The goal is to make competing camera authorities explicit.

### SP-03 — Cam-4 browser proof

Trace:

`hero-cam4-edge-swipe.js → apply wiring → real Hero input`

Prove edge pressure, inverse touch, reduced motion suppression, and coexistence with selected-tree look-at.

### SP-04 — Apply-path integrity

Make the `hero-flex.js` reconstruction path fail loudly when an expected replacement does not apply.

Minimum integrity requirements:

- every expected patch reports applied;
- patch count/order is deterministic;
- pinned source compatibility is checked;
- silent no-op is impossible;
- a newer canonical change cannot be silently overwritten.

Do not replace the architecture wholesale. Harden the existing reconstruction mechanism first.

### SP-05 — Tree depth/readability matrix

For each existing Seat child, record:

`node → depth → dock → target → expected readable output → browser evidence`

This separates actual structural completion from later visual polish.

### SP-06 — R1/R2 readiness boundary

Determine which R1/R2 presentation pieces have a real owner in the current code. Anything without an owner stays planned. Do not invent modules merely to make the map look complete.

### SP-07 — Current frontier decision

After SP-01 through SP-06:

- close/reclassify any already-satisfied duplicate V item;
- identify the one current spatial slice;
- record one next authorized command;
- leave backend and color/material polishing untouched.

## 5. Definition of done for this pass

The pre-backend / pre-coloring spatial pass is complete only when all are true:

- Cam↔V chronology is unambiguous.
- No fulfilled slice is scheduled again under a different name.
- Camera precedence is explicit and testable.
- Cam-4 has browser-level evidence for the claimed interaction.
- Apply-patch assembly fails loudly on no-op/mismatch.
- Existing tree nodes have explicit structure/camera/interaction/readability state.
- R1/R2 are classified as implemented, stubbed, or planned without guessing.
- Spatial numbers have explicit `starting` versus `measured` evidence.
- No backend contract/runtime work was touched.
- No 3D coloring/material art-direction pass was introduced.
- No 029 release claim is made.

## 6. Stop conditions

Stop the slice and reconcile rather than coding when:

- a proposed behavior already exists under another V/Cam/P slice;
- a contract claims broader support than the runtime proves;
- a change requires a new authority root instead of adjusting an existing one;
- a number has no documented owner;
- a browser-visible claim has no appropriate browser proof;
- the change crosses into backend/domain authority;
- the only justification is “cleaner from scratch.”

## 7. Minimal evidence packet

Every completed spatial slice should leave this evidence bundle:

```text
1. Governing intent / slice ID
2. Existing owner root(s)
3. Files changed and files deliberately untouched
4. Baseline numbers used
5. Static/unit result
6. Browser result when behavior is user-visible
7. Known limitations
8. Evidence label
9. One next authorized command
```

## 8. What this basis deliberately does NOT do

This document does not:

- redefine Product Law;
- replace the Masterplan;
- create a second ORUCAVEAM lifecycle;
- authorize backend implementation;
- authorize provider/runtime integration;
- authorize 3D coloring, materials, lighting art direction, or a second visual system;
- declare TEAM-EXPERIENCE-029 released.

It is the execution bridge between the existing spatial contracts and an agent's actual work sequence.

## 9. Primary owners

- Hierarchy state / numbers: `public/hero-hierarchy-runtime.js` + `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`
- Camera follow: `public/hero-cam2-tree-follow.js`
- Center-locked navigation: `public/hero-cam3-tree-center-zoom.js`
- Edge / swipe: `public/hero-cam4-edge-swipe.js`
- Assembly / compatibility path: `public/hero-flex.js` + `scripts/apply-cam2-tree-follow-flex.mjs`
- Branch focus / Back/Next: hierarchy focus APIs + `hero-dom-action-map.js`
- Machine topology: `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- Product interaction law: `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- Current Cam↔V chronology: `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md`
- Current experience intent: `docs/VISION.md`

## 10. Operating principle

**Do not ask “what should we build next?” until we can answer “what is already true, what is only specified, what is proven, and which existing owner carries the next change?”**
