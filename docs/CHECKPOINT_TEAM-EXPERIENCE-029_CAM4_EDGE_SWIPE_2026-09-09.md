# Checkpoint — Cam-4 Edge-Drag + Inverse-Swipe (2026-09-09)

**Slice:** Cam-4  
**Prior:** Cam-3 #193 merged  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `public/hero-cam4-edge-swipe.js` — edge zones, continuous drift, inverse-swipe deltas
- Pointer at screen edge → continuous orbit, suppressed under reduced motion
- Drag/swipe path → inverse orbit about the current tree center
- Apply path wires the Cam-2 + Cam-3 + Cam-4 behavior

## Historical status

Cam-4 is **fulfilled historical camera architecture**. The later V-series and Cam-5/6 work refined subject centering, branch interaction, and machine chrome.

The remaining Cam-4 concern is **verification depth**, not a new Cam-5/6-style feature queue: browser-level proof still belongs to the spatial reconciliation gates in Issue #232 / `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`.

Agents must not use this checkpoint as a future-feature queue. Remaining work must be named as a current verification or Vision slice.
