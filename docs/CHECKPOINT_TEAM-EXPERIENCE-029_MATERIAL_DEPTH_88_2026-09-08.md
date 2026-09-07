# TEAM-EXPERIENCE-029 — Issue #88 material/depth pass (workspaceRing / seatShell)

**Date:** 2026-09-08  
**Status:** IMPLEMENTED (presentation) / static tests  
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

Uses `mapHeroThemeLighting` (no second theme root). Presentation only.

## Out of scope

- Full environment lighting rewrite
- Dark-glassmorphism as primary mode
- Backend / provider / auth
- New external mesh assets

## Next

Optional: browser visual review at HERO_WIDE / SEAT_CLOSE; dictionary anchors already on main.
