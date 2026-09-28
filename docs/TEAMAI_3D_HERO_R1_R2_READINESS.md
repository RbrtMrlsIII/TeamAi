# TeamAi 3D Hero — R1/R2 readiness boundary (SP-06)

**Status:** Active boundary reconciliation · Gate S7 / SP-06 · 029 not released  
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
| **R0** | Workspace surface | `frontend/spatial/hero-workspace-core.js` → canonical `machine-world-renderer.js` | **implemented** | Shared receiving-core geometry; controller owns intent/state only |
| **R0** | ZipSkills crown | `public/hero-p-r0-zipskills.js` · `WORKSPACE_ZIPSKILLS_V1` · `RING_R0_ZIP_SCALE` | **implemented** | Optional; not seat child; not entitlement |
| **R1** | Part IDs / catalog | `HIERARCHY_PART.WORKSPACE_BACKEND_*` · `BACKEND_DISPLAY_V1` | **implemented** | Catalog only |
| **R1** | Scale constant | `frontend/spatial/hero-world-contract.js` (`RING_R1_SCALE`) | **implemented** | Shared render contract |
| **R1** | Display ring draw | `frontend/spatial/hero-r1-backend-display.js` → `public/hero-r1-backend-display.js` → `drawBackendDisplayRing` wrapper | **implemented-partial** | Dedicated placement/render owner; full service-thread topology remains bounded |
| **R1** | Animated threads | `frontend/spatial/hero-r1-backend-threads.js` → `public/hero-r1-backend-threads.js` | **implemented-partial** | Deterministic presentation relationships between declared R1 display faces; final service-thread/backend topology remains bounded |
| **R1** | Live platform bind | — | **out of scope** | Presentation must not OAuth/bind from canvas |
| **R2** | Scale constant | `RING_R2_SCALE` | **implemented** | |
| **R2** | Setup/config catalog | `SETUP_CONFIG_V1` · part ids on hierarchy | **implemented** | |
| **R2** | Draw module | `public/hero-r2-setup-ring.js` → `drawSetupConfigRing` | **implemented** | Named owner module |
| **R2** | Camera-fill state | `setupRingFillAmount` / `tickSetupRingFill` / `SETUP_RING_FILL_MS` | **implemented** | Presentation fill only |
| **R2** | Auth mechanism faces | `WORKSPACE_AUTH_MECHANISM#login/register` in catalog + draw kinds | **stubbed** | Mechanical presentation — **not** Firebase auth authority |
| **R2** | Durable auth / credentials | — | **out of scope** | Domain remains outside Hero |
| **R3** | Seat ring + hierarchy | `machine-core-layout-runtime.js` + hierarchy runtime + canonical renderer | **implemented** | Physical Seat envelope and semantic child hierarchy stay distinct |

---

## 3. Agent rules

1. R1 has a named Slice-D owner now; do not create duplicate R1 renderers or bypass the canonical Hero wrapper.  
2. **Do not** treat R1/R2 presentation as backend connection completion or Conn-3.  
3. **Do not** pull provider/runtime work into a spatial ring slice.  
4. R1 animated threads are **implemented-partial** under a dedicated presentation owner, with stable source/target display IDs and regression tests. They remain presentation-only and do not establish final service/backend topology.  
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

The original SP-06 classification predates the later #396 implementation program. The current execution has now established a concrete R1 owner:

- `frontend/spatial/hero-r1-backend-display.js` is the source owner.
- `public/hero-r1-backend-display.js` is the browser runtime copy.
- `drawBackendDisplayRing(t)` remains a ring-module draw owner consumed by the canonical machine-world renderer; it is not a controller WebGL owner.
- `scripts/sync-machine-spatial-runtime.mjs` now synchronizes the R1 module.
- R1 placement is derived from the active workspace radius, R1 scale, and catalog rather than hard-coded coordinates.
- R1 remains **presentation-only**. The module contains no OAuth, credential, provider, or durable backend authority.

The older rule saying not to create an R1 module is historical guidance for the pre-Slice-D state. Current execution keeps R1 under one canonical machine-world renderer and avoids duplicate geometry authority.

The R1 display and thread modules are implementation steps, not a 029 completion claim. The current threads are deterministic presentation relationships only. Final service/backend topology, richer mechanical R1 articulation, complete R2 mechanical choreography, and final physical machine construction continue through PR #404 / Issue #405 under Issue #396 authority.

## 7. Current structural reconciliation

R1/R2 are now mechanically source-owned and consume the shared hero-ring-envelope.js geometry. The envelope clamps the requested inter-ring clearance to the available physical span instead of expanding the real R3 machine envelope.

The Seat machine now has a generic focused-division presentation path driven by hierarchy-owned child identity/index and branch amount. The renderer remains the presentation layer; the controller remains the semantic state owner.

Machine-core edges now expose stable semanticEdgeId values and are validated independently for endpoint branch identity, port continuity, finite routes, unique edges, and expected edge classes.

The current electrical layer follows declared edge routes only. It is not a new topology authority, provider integration, or durable state system.

R2 login/register and setup actions cross the APP_UI_HANDOFF boundary into normal UI controllers. The Hero remains presentation-only. The receiver path exists in public/hero-auth-handoff.js; browser exact-head proof is still a verification gate.

This section supersedes older planned wording where current code now has a named implementation owner, but it does not convert implemented-partial work into a 029 completion claim.

## SEE ALSO

- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`  
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` SP-06 / Gate S7  
- `frontend/spatial/hero-r1-backend-display.js` · `public/hero-r1-backend-display.js` · `frontend/spatial/hero-r1-backend-threads.js` · `public/hero-r1-backend-threads.js` · `frontend/spatial/hero-r2-setup-ring.js` · `public/hero-r2-setup-ring.js` · `public/hero-p-r0-zipskills.js`  
