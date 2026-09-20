# TeamAi 3D Hero — R1/R2 readiness boundary (SP-06)

**Status:** Classification complete · Gate S7 / SP-06  
**Date:** 2026-09-10  
**Authority:** Spatial execution basis SP-06 → Concentric Ring Map → hierarchy runtime  
**Claim:** presentation ownership only · **no 029-released claim** · no new meshes invented here

## Rule

> Determine which R1/R2 presentation pieces have a **real owner** in the current code. Anything without an owner stays **planned**. Do not invent modules merely to make the map look complete.

---

## 1. Ring order (center → outer)

```text
R0  WORKSPACE CORE
R1  BACKEND DISPLAY RING
R2  SETUP / CONFIG RING
R3  SEAT RING
```

---

## 2. Classification table

| Ring | Piece | Owner in code | Class | Notes |
|------|--------|---------------|-------|-------|
| **R0** | Workspace surface | `hero-flex` workspace draw (assembled base) | **implemented** | Machine contract + flex |
| **R0** | ZipSkills crown | `public/hero-p-r0-zipskills.js` · `WORKSPACE_ZIPSKILLS_V1` · `RING_R0_ZIP_SCALE` | **implemented** | Optional; not seat child; not entitlement |
| **R1** | Part IDs / catalog | `HIERARCHY_PART.WORKSPACE_BACKEND_*` · `BACKEND_DISPLAY_V1` | **implemented** | Catalog only |
| **R1** | Scale constant | `RING_R1_SCALE` in hierarchy runtime | **implemented** | §9-aligned starting number |
| **R1** | Display ring draw | `frontend/spatial/hero-r1-backend-display.js` → `public/hero-r1-backend-display.js` → `drawBackendDisplayRing` wrapper | **implemented-partial** | Dedicated placement/render owner; full service-thread topology remains bounded |
| **R1** | Animated threads | `WORKSPACE_BACKEND_THREAD` id | **planned** | Spec in ring map; no dedicated thread owner module |
| **R1** | Live platform bind | — | **out of scope** | Presentation must not OAuth/bind from canvas |
| **R2** | Scale constant | `RING_R2_SCALE` | **implemented** | |
| **R2** | Setup/config catalog | `SETUP_CONFIG_V1` · part ids on hierarchy | **implemented** | |
| **R2** | Draw module | `public/hero-r2-setup-ring.js` → `drawSetupConfigRing` | **implemented** | Named owner module |
| **R2** | Camera-fill state | `setupRingFillAmount` / `tickSetupRingFill` / `SETUP_RING_FILL_MS` | **implemented** | Presentation fill only |
| **R2** | Auth mechanism faces | `WORKSPACE_AUTH_MECHANISM#login/register` in catalog + draw kinds | **stubbed** | Mechanical presentation — **not** Firebase auth authority |
| **R2** | Durable auth / credentials | — | **out of scope** | Domain remains outside Hero |
| **R3** | Seat ring + hierarchy | hierarchy runtime · seat shell v1 · Cam-2…6 | **implemented** | SP-05 matrix covers children |

---

## 3. Agent rules

1. R1 has a named Slice-D owner now; do not create duplicate R1 renderers or bypass the canonical Hero wrapper.  
2. **Do not** treat R1/R2 presentation as backend connection completion or Conn-3.  
3. **Do not** pull provider/runtime work into a spatial ring slice.  
4. R1 animated threads remain **planned** until a concrete owner + tests exist.  
5. R2 login/register faces may hand off via `APP_UI_HANDOFF` — never write Firestore from canvas.

---

## 4. Evidence class

| Class | Meaning here |
|-------|----------------|
| implemented | Named export/module/catalog exists and is tested |
| stubbed | Partial draw or catalog without full interaction/browser depth |
| planned | Spec only; no code owner |
| out of scope | Forbidden in spatial presentation |

---

## 5. Test owner

`tests/hero-sp06-r1-r2-readiness.test.mjs`

---


## 6. Current 029 execution reconciliation

The original SP-06 classification predates Issue #396's active Slice D implementation program. The current execution has now established a concrete R1 owner:

- `frontend/spatial/hero-r1-backend-display.js` is the source owner.
- `public/hero-r1-backend-display.js` is the browser runtime copy.
- `drawBackendDisplayRing(t)` remains a compatibility wrapper in the canonical Hero so existing assembly/apply contracts stay valid.
- `scripts/sync-machine-spatial-runtime.mjs` now synchronizes the R1 module.
- R1 placement is derived from the active workspace radius, R1 scale, and catalog rather than hard-coded coordinates.
- R1 remains **presentation-only**. The module contains no OAuth, credential, provider, or durable backend authority.

The older rule saying not to create an R1 module is therefore historical guidance for the pre-Slice-D state and no longer governs current #397 execution. The current requirement is to keep R1 under the same single-renderer architecture and avoid duplicate authority.

The R1 module is still an implementation step, not a 029 completion claim. Animated service-thread topology and complete mechanical R1/R2 meshes remain bounded work under Issue #396.

## SEE ALSO

- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`  
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` SP-06 / Gate S7  
- `frontend/spatial/hero-r1-backend-display.js` · `public/hero-r1-backend-display.js` · `frontend/spatial/hero-r2-setup-ring.js` · `public/hero-r2-setup-ring.js` · `public/hero-p-r0-zipskills.js`  
