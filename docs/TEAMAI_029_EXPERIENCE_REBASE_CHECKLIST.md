# TEAM-EXPERIENCE-029 — Experience rebase checklist (2026-09-11)

**Status:** PLANNING / OWNER-DIRECTED · **no 029-released claim** · **no implementation claimed by this document alone**  
**Authority:** Product Law → `MASTERPLAN.md` → `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` → this checklist → VISION (amended only when decisions are endorsed)  
**Purpose:** chronological execution record for product-shape corrections after Vision V0–V3 one-shell work. Owner mobile/desktop observations are acceptance inputs.

## A. Product decisions (record before code)

| ID | Decision | State |
|----|----------|-------|
| **DEC-ENT-CLASSIC** | Layer A = **classic website** (marketing, links, sign-in). 3D machine is reached only via an **explicit link/control**, not as the default under-title stage. | **PROPOSED** (owner-directed 2026-09-11) |
| **DEC-AUTH-GATE-3D** | Full machine features require **signed-in + server-verified** session and authorization; anonymous look-only remains a separate future decision. | **PROPOSED** |
| **DEC-CHROME-NAV** | Primary UI (settings, parts/trees, account) lives in a **coherent nav/menu**, not scattered absolute chips across the canvas. | **PROPOSED** |
| **DEC-CAMERA-LANGUAGE** | Keep a small camera vocabulary: `HERO_WIDE` world baseline + selected-seat subject-lock; retire Low Orbit / Turn Follow; allow world-baseline zoom-out; proportional orbit. | **PROPOSED** |

Until the decisions above are endorsed, do **not** treat the one-shell V3 entrance as the final product shape.

Canonical rebaseline: `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` (Issue #271).

## B. What failed acceptance (evidence, not blame)

1. **Mobile entrance legibility** — brand + seat-stack + spatial chips + 3D overlap (owner observations).
2. **Soft-hide ≠ clean** — opacity demotion left readable clutter on narrow viewports.
3. **Machine residual ≠ entrance** — #258 rules cleaned `data-hero-layer=machine`; exploration often remained on entrance.
4. **Camera docks still many** — Wide / Team / Workspace / Map / Seat / Detail remain; operator still perceives dense “low orbit / workspace / etc.” controls. (`HERO_LOW_ORBIT` id is archived; **operator-facing density remains an issue**.)
5. **Tree zoom-out** — cannot comfortably zoom out to **normal world / ~45° baseline height** in tree/subject context.
6. **Orbit direction** — Cam-4 path uses **inverse** swipe; owner wants **proportional** natural direction.
7. **Settings** — settings exists in implementation paths but is **not discoverable** as a clear settings destination in a navbar/menu; chrome feels scattered and blurred.
8. **Vision metric miss** — CI/slice merges measured architecture while phone/desktop product acceptance was under-weighted.

## C. Canonical chronological execution checklist

The product-shape work now follows the rebaseline document. Do **not** advance by stacking isolated polish slices against the old one-shell model.

- [ ] **C0** Endorsement: DEC-ENT-CLASSIC + DEC-AUTH-GATE-3D + DEC-CHROME-NAV + DEC-CAMERA-LANGUAGE recorded. Superseded one-shell assumptions receive archive/redirect treatment.
- [ ] **C1** Canonical reconciliation: `MASTERPLAN.md` / current-state / next-slices / skill wiring / execution state all agree on the same product shape and historical baseline.
- [ ] **C2** **ENT-CLASSIC-1** — classic entrance structure. First paint is a website and does not depend on live 3D chrome.
- [ ] **C3** **ENT-CLASSIC-2** — explicit control/route into the 3D machine/world plus reliable return path.
- [ ] **C4** **CHROME-NAV-1** — one coherent nav/menu surface with visible Settings and contextual workspace controls.
- [ ] **C5** **CAM-DOCK-1** — rationalize operator-facing camera controls; remove confusing/duplicate docks without resurrecting retired concepts.
- [ ] **C6** **CAM-ZOOM-1** — tree/subject context can zoom out to the normal world baseline without a dead-end clamp.
- [ ] **C7** **CAM-ORBIT-1** — change inverse orbit input to proportional/natural mapping and update tests/browser evidence.
- [ ] **C8** **AUTH-GATE-1** — full machine/workspace features require verified session + server authorization; presentation never grants entitlement.
- [ ] **C9** **EXPERIENCE-ACCEPT-1** — desktop + phone user acceptance of the complete shape and transitions.
- [ ] **C10** **PROMAX-1** — only after C9: deliberate 3D animation, transition choreography, ambient/effects/material/depth refinement and reduced-motion parity.

## D. Parallel tracks

| Track | State |
|-------|-------|
| TEAM-BACKEND-001 residual | Gate 4 parked; provider stub; Conn-3 browser proof pending |
| Security inquiry | Future / pre-production backlog — not current execution driver |
| ToolKit / Echo learning | Generalizable lessons only after TeamAi evidence + validation + endorsement |
| 029 release | **Blocked** until independent BLOCKS_029 + experience acceptance |

## E. Non-claims

- This checklist does **not** implement UI by itself.
- This checklist does **not** authorize 029 release.
- Historical V0–V3 and #259/CAM/ENT/CHR work remains valid evidence and implementation lineage even where the product shape is now superseded.
- Green CI or browser tests alone do not constitute product acceptance.

## F. Agent data tips / recovery drive

1. **Owner phone/desktop evidence beats CI green** for visual claims. Use CI to prove contracts and behavior; use visual evidence to prove experience quality.
2. **Soft-hide is not removal.** Do not leave readable clutter when the requirement is to remove a competing surface.
3. **Retired identifier ≠ resolved UX density.** Absence of `HERO_LOW_ORBIT` does not mean the camera dock is understandable.
4. **Orbit direction is a product requirement.** The current inverse mapping must be treated as superseded when C7 is authorized.
5. **Zoom-out is an actual acceptance target.** Do not mask it with another dock or closer camera.
6. **Settings must be discoverable.** A hidden implementation shell does not satisfy C4.
7. **Do not begin C5–C7 before C0** if the work would entrench the old one-shell entrance.
8. **Security inquiry Q-001+ is backlog** and should not hijack this experience sequence.
9. **Archive instead of warning spam.** Superseded concepts get compact active redirects plus durable archive records.
10. **Presentation never grants entitlement.** AUTH-GATE-1 is server authorization, not a canvas/UI flag.
11. **Do not treat a merged technical slice as a product acceptance event.** The product gate is C9.
12. **Do not start ProMax as decoration-first work.** First stabilize product shape, navigation, camera vocabulary, and acceptance.

**Owner input captured:** classic entrance; explicit 3D destination; authenticated full features; rational camera docks; tree zoom-out to world baseline; proportional rotation; coherent nav + Settings; stop scattered/blurred UI; use visual acceptance as a product gate.

## G. Rebaseline anchor

`docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` is the canonical product-shape sequence for C0–C10. This checklist remains the compact execution index and recovery surface.