# CHECKPOINT — TEAM-EXPERIENCE-029 Theme Adapter — 2026-09-07

Status: prepared/held implementation slice. Do not activate as merged 029 runtime work until the Masterplan release-hold conditions are explicitly evidenced.

## Slice
Issue #84 — semantic 3D theme-lighting adapter.

## Contract
- Canonical source remains `frontend/spatial/theme-root.css`.
- Adapter is pure, deterministic, presentation-only, and side-effect free.
- Outputs are bounded for intensity, roughness, reflectance, shadow separation, and emissive treatment.
- Light and Dark map to distinct spatial parameter families.
- Reduced motion disables nonessential spatial choreography.
- No auth, scheduler, Firestore, entitlement, provider invocation, credentials, or orchestration behavior.

## Implementation boundary
The adapter is intentionally not wired into `public/hero-flex.js` in this slice. Renderer choreography, contribution lighting, material replacement, and browser/runtime proof remain downstream slices.
