# Checkpoint — TEAM-EXPERIENCE-029 P-R2 setup-ring camera-fill

**Date:** 2026-09-09  
**Slice:** P-R2 — R2 setup / config ring camera-fill (login/signup/config)  
**Evidence:** IMPLEMENTED (runtime + hero-flex + source contract tests) · **no 029-released claim**

## Wiring

- `SETUP_RING_FILL_MS` (480) + `SETUP_RING_FOV_FILL` (3) in runtime and baseline §9
- `tickSetupRingFill` / `getSetupRingFillAmount` / `setupRingCameraId`
- Auth/config items dock `DETAIL_ANCHOR`; engine docks `WORKSPACE_CLOSE`
- Narrow FOV uses exported `FOV_BOOST_NARROW` plus fill boost
- Keyboard **L** and **Enter** (when R2 full-area focused) → `APP_UI_HANDOFF`
- R2 plates scale by fill amount
- Reduced motion snaps fill

## Boundaries

Presentation only · not Firebase Auth · not entitlement · not durable configuration  
Real login/signup forms belong to ordinary UI (`teamai:app-ui-handoff`).

## Verify

```bash
node scripts/apply-p-r2-setup-ring-fill.mjs
node --test tests/hero-p-r2-setup-ring-fill.test.mjs tests/hero-setup-config-ring.test.mjs tests/hero-ring-focus.test.mjs
```

## Next

P-R0 WORKSPACE_ZIPSKILLS crown (optional) · Owner endorsement · #89 remaining close-out.
