---
name: workspace-ring
description: >-
  Concentric Ring Map R0–R2 presentation (workspace core, backend display,
  setup/config). Use when implementing or reviewing intermediate rings,
  WORKSPACE_* parts, backend threads, or setup/login mechanical faces.
---

# Workspace Ring (R0–R2)

## WHEN TO USE
Implementing or reviewing **R0 workspace**, **R1 backend display**, or **R2 setup/config** rings on the Hero.

Triggers: WORKSPACE_BACKEND_DISPLAY, WORKSPACE_BACKEND_THREAD, WORKSPACE_SETUP_ENGINE, WORKSPACE_AUTH_MECHANISM, WORKSPACE_CONFIG_BRANCH, WORKSPACE_ZIPSKILLS, MECHANISM_ZIPSKILLS (legacy alias), backend threads, setup ring, login/register mechanical.

## INPUT
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- Hierarchy Runtime Baseline R1–R10 + §9
- `public/hero-hierarchy-runtime.js` catalogs (`BACKEND_DISPLAY_V1`, `SETUP_CONFIG_V1`)
- `public/hero-r2-setup-ring.js`, `public/hero-flex.js`
- `public/hero-semantic-camera.js` (WORKSPACE_ZIPSKILLS + MECHANISM_ZIPSKILLS alias)

## AUTHORITY
1. PRODUCT_LAW.md Family J (presentation)
2. Machine Interaction Contract §4.1b
3. Concentric Ring Map
4. hierarchy-runtime skill + baseline §9
5. Presentation-only unless a named backend contract authorizes more

## ACTION
1. Confirm ring index (R0/R1/R2) and part IDs against the map.
2. Keep **radii** named or expressed off `profile().workspace` (e.g. R1 `* 1.18`, R2 `* 1.42`); amend §9 when measured numbers freeze.
3. R1: display faces + animated threads — no live bind.
4. R2: mechanical setup/login/register stubs — **not** auth authority, no password fields.
5. `WORKSPACE_ZIPSKILLS` equips on workspace tree — never Seat children. v1 fixture `WORKSPACE_ZIPSKILLS_V1` (all optional) draws as an inner crown at `RING_R0_ZIP_SCALE`. Keyboard `z`/`x` cycles R0. LAW 109: skill package, not authority.
6. **Legacy alias:** `MECHANISM_ZIPSKILLS` resolves to the same physical camera as `WORKSPACE_ZIPSKILLS` (`DETAIL_ANCHOR`). Prefer WORKSPACE_* in new code/docs; keep MECHANISM_* until e2e selectors migrate. Do not treat either as required setup or entitlement.
7. Evidence: static part IDs + optional browser frame.

## DO NOT
- Do not place ZipSkills on seats as authority.
- Do not write OAuth, API keys, Firestore, or durable session from canvas.
- Do not invent radius tables without map + §9 amendment.
- Do not claim 029 released.
- Do not imply ZipSkills / Toolkit is a required platform config.

## PASS
R1/R2 stubs readable; presentation-only held; tests pass; map and runtime IDs aligned; MECHANISM_ZIPSKILLS ↔ WORKSPACE_ZIPSKILLS alias held when both exist.

## SEE ALSO
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
- `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`
