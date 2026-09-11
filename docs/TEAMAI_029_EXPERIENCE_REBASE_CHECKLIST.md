# TEAM-EXPERIENCE-029 — Experience rebase checklist (2026-09-11)

**Status:** PLANNING / OWNER-DIRECTED · **no 029-released claim** · **no implementation claimed by this document alone**  
**Authority:** Product Law → `MASTERPLAN.md` → this checklist → VISION (amended when DEC-ENT-CLASSIC is endorsed)  
**Purpose:** chronological execution record for product-shape corrections after Vision V0–V3 one-shell work. Owner mobile screenshots and operator feedback are acceptance inputs.

## A. Product decisions (record before code)

| ID | Decision | State |
|----|----------|--------|
| **DEC-ENT-CLASSIC** | Layer A = **classic website** (marketing, links, sign-in). 3D machine is reached only via an **explicit link/control**, not as the default under-title stage. | **PROPOSED** (owner-directed 2026-09-11) |
| **DEC-AUTH-GATE-3D** | Full machine features require **signed-in + server-verified** session; anonymous may get limited look-only if product later allows it. | **PROPOSED** |
| **DEC-CHROME-NAV** | Primary UI (settings, parts/trees, account) lives in a **coherent nav/menu** — not scattered absolute chips across the canvas. | **PROPOSED** |

Until DEC-ENT-CLASSIC is endorsed, do **not** treat one-shell V3 entrance as final product shape.

## B. What failed acceptance (evidence, not blame)

1. **Mobile entrance legibility** — brand + seat-stack + spatial chips + 3D overlap (owner screenshots on deployed site).
2. **Soft-hide ≠ clean** — opacity demotion left readable clutter on narrow viewports.
3. **Machine residual ≠ entrance** — #258 rules cleaned `data-hero-layer=machine`; exploration often stays on entrance.
4. **Camera docks still many** — Wide / Team / Workspace / Map / Seat / Detail remain; operator still perceives dense “low orbit / workspace / etc.” controls. (`HERO_LOW_ORBIT` id is archived; **feel** of low/close presets and dock count remain issues.)
5. **Tree zoom-out** — cannot comfortably zoom out to **normal world / ~45° baseline height** while in tree/subject context.
6. **Orbit direction** — Cam-4 path uses **inverse** swipe (swipe right → orbit left); owner wants **proportional** (natural) direction.
7. **Settings** — settings shell exists in code paths but is **not discoverable** as a clear settings control in a navbar/menu; chrome feels scattered and blurred.
8. **Vision metric miss** — CI/slice merges measured architecture; phone readability was under-weighted.

## C. Chronological execution checklist (order matters)

Do **not** reorder to “quick CSS wins” if they conflict with DEC-ENT-CLASSIC.

- [ ] **C0** Endorsement note: DEC-ENT-CLASSIC + DEC-AUTH-GATE-3D + DEC-CHROME-NAV recorded; VISION §1 Layer A amended by pointer (archive one-shell assumptions that conflict).
- [ ] **C1** MASTERPLAN / CURRENT_STATE_MAP / NEXT_SLICES agree: phone entrance **not acceptable**; V0–V3 one-shell = historical implementation lineage.
- [ ] **C2** **ENT-CLASSIC-1** — Classic entrance structure (no requirement that first paint is live 3D under the title).
- [ ] **C3** **ENT-CLASSIC-2** — Explicit control/route **into** 3D machine shell only.
- [ ] **C4** **CHROME-NAV-1** — Single nav/menu surface: **Settings** entry visible; parts/trees not a floating wall of modules on entrance.
- [ ] **C5** **CAM-DOCK-1** — Rationalize camera docks (which presets remain; reduce operator-confusing density; verify `HERO_LOW_ORBIT` stays absent/archived).
- [ ] **C6** **CAM-ZOOM-1** — Tree/subject context can zoom out to **world baseline height** (~45° / HERO_WIDE family) without dead-end clamp.
- [ ] **C7** **CAM-ORBIT-1** — Change orbit/drag from **inverse** to **proportional** mapping (Cam-4 / nav path); tests updated.
- [ ] **C8** **AUTH-GATE-1** — Full machine features behind verified session (server authz); presentation never grants entitlement.
- [ ] **C9** Mobile acceptance: owner phone screenshot pass (readable entrance **or** clean machine — not soup).
- [ ] **C10** Only then optional V4 polish (reduced-motion, color) **inside** the endorsed shape.

## D. Parallel tracks (do not block C0–C1)

| Track | State |
|-------|--------|
| TEAM-BACKEND-001 residual | Gate 4 parked; provider stub; Conn-3 browser proof pending |
| Security inquiry | Future / pre-production backlog — **not** current execution driver |
| 029 release | **Blocked** until BLOCKS_029 + experience acceptance |

## E. Non-claims

- This checklist does **not** implement UI.
- This checklist does **not** authorize 029 release.
- Merged Vision V0–V3 commits remain historical evidence; product shape may supersede one-shell entrance via DEC-ENT-CLASSIC + archive/redirect.

## F. Agent data tips (recovery drive)

Use these before any implementation slice under this checklist.

1. **Owner phone screenshots beat CI green** for legibility (C9). A green Playwright job does not prove mobile entrance is acceptable.
2. **Soft-hide is not removal.** Opacity 0.35 on seat-stack / chips still fails on narrow viewports. Prefer `display: none` / unmount when the product ask is “stop the soup.”
3. **`HERO_LOW_ORBIT` id archived ≠ docks fixed.** Wide / Team / Workspace / Map / Seat / Detail may still feel like “low orbit / close” density. CAM-DOCK-1 is about **operator-facing set**, not only grep absence.
4. **Orbit is inverse today.** Cam-4 `inverseSwipeDelta` maps swipe right → orbit left. CAM-ORBIT-1 must flip to **proportional** and update tests that encode inverse.
5. **Zoom-out is a real gap.** Tree/subject context must be able to reach **world baseline height** (~45° / HERO_WIDE family). Do not “fix” with only a closer dock.
6. **Settings may exist in code and still fail product.** C4 requires a **visible Settings entry** in coherent nav/menu — not an undiscoverable shell in the absolute stack.
7. **Do not start C5–C7 camera tweaks before C0** if they entrench one-shell entrance as final shape against DEC-ENT-CLASSIC.
8. **Security inquiry (Q-001–Q-008) is backlog** — not the current execution driver while experience rebase is open.
9. **MASTERPLAN pointer:** after this doc is on `main`, keep a short pointer at the end of `MASTERPLAN.md` → this file so recovery sessions find C0–C10.
10. **Presentation never grants entitlement.** AUTH-GATE-1 is server-verified session + authz, not a canvas flag.

**Owner input captured:** classic entrance; auth for full 3D features; camera zoom-out to normal height; proportional rotation; nav/menu + settings; stop scattered/blurred chrome.
