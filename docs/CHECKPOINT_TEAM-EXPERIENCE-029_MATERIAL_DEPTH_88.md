# CHECKPOINT — Issue #88 machined material + depth pass

**Date:** 2026-09-08  
**Status:** IMPLEMENTED (authored materials + static tests + hero-flex consume) / visual endorsement optional  
**Issue:** #88

## Hierarchy

```text
workspaceRing   low rough, high specular   (machined metal)
seatShell       mid rough                  (instrument body)
seatShellInset  higher rough, darker       (depth / contact)
```

## What is proven

| Claim | Evidence |
|-------|----------|
| Materials consume adapter-shaped lighting bounds | `authored*Material(mapHeroThemeLighting(...))` |
| Depth hierarchy holds on all #98 fixtures | `assertMaterialDepthHierarchy` |
| Light/Dark families distinguishable | unit tests |
| Status deepens inset without role drift | unit tests |
| `hero-flex.js` draws authored ring + shell + inset | source match tests |
| No backend / provider authority | pure functions only |

## Out of scope (unchanged)

- Dark-glassmorphism as primary mode  
- New paid assets  
- Seat Identity Inspection  
- Backend state binding  

## Files

- `public/hero-authored-materials.js`
- `public/hero-flex.js` (consumer)
- `tests/hero-authored-materials.test.mjs`
