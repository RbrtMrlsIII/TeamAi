# TEAM-EXPERIENCE-029 — Issue #88 material/depth pass (workspaceRing / seatShell)

**Date:** 2026-09-08  
**Status:** IMPLEMENTED (presentation) / static tests / **browser visual evidence captured**  
**Depends on:** Issue #98 fixture matrix on main (#125)

## Scope

Light-skeuomorphic **material families** and **depth separation** for authored meshes only:

- `workspaceRing` — lower roughness, higher specular; dark lip under ring for contact depth
- `seatShell` — instrument body roughness/reflectance from theme adapter
- `seatShellInset` — darker inset cylinder under shell (shell-to-inset depth)

## Implementation

| File | Role |
|------|------|
| `public/hero-authored-materials.js` | Pure material mapping |
| `public/hero-flex.js` | Draws ring/shell with materials + depth cues |
| `tests/hero-authored-materials.test.mjs` | Bounds, Light≠Dark, renderer consumption |
| `tests/e2e/hero-material-visual-88.spec.ts` | Browser visual capture HERO_WIDE / SEAT_CLOSE / reduced-motion |

Uses `mapHeroThemeLighting` subset via `heroMaterialContext` (no second theme root). Presentation only.

## Browser visual evidence (2026-09-08)

Captured via Playwright against live `/hero/?seats=4` (light theme):

| Frame | Observation |
|-------|-------------|
| **HERO_WIDE light** | Shared workspace ring readable as machined metal; 4 Seats distinct; contribution artifacts on ring; hierarchy (workspace center vs Seat periphery) holds; light-skeuomorphic materials (not generic glass bloom). |
| **SEAT_CLOSE light** | Seat shell body + inset depth separation visible; instrument-body roughness vs ring contrast preserved; no clipping of corridor region at this framing. |
| **HERO_WIDE reduced-motion** | Materials and topology remain stable with continuous choreography suppressed (Issue #89 contract). Semantic lighting state not erased. |

Evidence artifacts (local run): `88-hero-wide-light.png`, `88-seat-close-light.png`, `88-hero-wide-reduced-motion.png` under test-results / HandOver attachments.

## Out of scope

- Full environment lighting rewrite
- Dark-glassmorphism as primary mode
- Backend / provider / auth
- New external mesh assets

## Close criteria progress

| Criterion | Status |
|-----------|--------|
| Static material bounds + theme-adapter usage | Done |
| Browser frames at HERO_WIDE / SEAT_CLOSE | **Done (this checkpoint)** |
| Reduced-motion material stability | **Done (frame + #89 contract)** |
| Endorsement chain / HandOver | Open for product owner |

## Next

Product owner visual confirmation → close Issue #88 when endorsement is recorded. Then #95 cross-root motion/a11y as planned.
