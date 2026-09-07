# TeamAi 3D Hero — Light-Skeuomorphic Slice Ladder

**Status:** SLICES 1–3 IMPLEMENTED ON `main` (presentation-only). Formal HandOver/Endorsement for Issue #86 may still be recorded.

## Authority and continuity

This document is a continuity record for the Living Web AI Shared Workspace Hero. It does not create product authority and does not release TEAM-EXPERIENCE-029 by itself.

Execution remains:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable spatial skills → GitHub Issue → implementation → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

## Spatial premise

The Hero represents a **Living Web AI Shared Workspace**. The shared workspace is central; distinct Web AI Seats surround it. Lighting is visual language only.

Presentation-only. Canonical orchestration meaning remains:

`AI result/action → durable structured event → task/state transition → scheduler eligibility → next AI/tool/human → new event`

No light effect may imply direct provider-to-provider control.

## Hard rules for any Hero / 3D presentation change

These are already hardened by Product Law + spatial skills + CURRENT_STATE — not a separate “3D Hero skill”:

1. **One theme root only** (`theme-root.css` / theme attributes). No second Hero theme system.
2. **Lighting** maps through `hero-theme-lighting-adapter.js` (or successor pure adapter). Do not invent page-local theme tokens.
3. **Motion / transition / reduced-motion** must honor `reducedMotion` / system preference; traveling choreography must have a static equivalent.
4. **Camera PoV** stays in the semantic camera registry; no orphan free-look that implies domain authority.
5. **Dependencies are code + existing skills** — theme, lighting adapter, spatial motion companions, browser smoke — not a new engine skill and not Three.js unless Masterplan explicitly adopts it.
6. **No domain writes** from the Hero canvas (no Firestore, no scheduler, no entitlement mutation).
7. **Seat count 1–8** is presentation scaling; durable unlock remains domain/entitlement authority.

## Slice order

### Slice 1 — Issue #84: semantic 3D theme-lighting adapter — **IMPLEMENTED on main**

Theme root → deterministic presentation-safe spatial parameters.

### Slice 2 — Issue #85: manufactured environment and workspace light rig — **IMPLEMENTED on main** (#104)

Consumes Slice 1; base illumination for workspace/seats/shells.

### Slice 3 — Issue #86: contribution corridor and workspace absorption — **IMPLEMENTED on main** (#107)

Lifecycle: `FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF`  
Contribution corridor, cumulative traces, reduced-motion path, Playwright lifecycle proof (after `durations()` fix).

**Active visual pass:** light-skeuomorphic (Instrument Space). Dark / glassmorphism is a **paired future mode** via the same theme root — not a second parallel visual system built at the same time.

## Verification ladder (each slice)

1. Static contract assertions  
2. WebGL init without fatal errors  
3. Browser smoke at representative seat counts  
4. Reduced-motion smoke  
5. Theme mode comparison (when both modes are product-active)  
6. Camera/inspection regression  
7. Contribution-corridor visibility  
8. Authority-boundary scan  
9. Evidence before completion claim  

## Issues

Durable work for Hero slices is tracked as GitHub Issues (#84, #85, #86). See `docs/GITHUB_ISSUES.md`. Closing an Issue requires acceptance criteria + verification; a green PR alone does not auto-Endorsement.
