# TeamAi Camera — Cam ladder ↔ Vision V-series reconciliation

**Status:** CURRENT EXECUTION LEDGER (Issue #232 partial)  
**Date:** 2026-09-10  
**Authority:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → `docs/VISION.md` → this ledger → Cam contracts / NEXT_SLICES  
**Claim:** presentation continuity only · **no 029-released claim**  
**Does not:** rewrite Product Law, redesign the Hero, or close TEAM-BACKEND-001

This document is the **single recovery map** so agents do not choose a stale Cam-2 path when the living frontier is Vision V3 / spatial SP sequence.

---

## 1. Two ladders, one product

| Ladder | What it owns | Authority doc |
|--------|--------------|---------------|
| **Cam-1 … Cam-6** | Camera **architecture / modules** (follow, dock, center-zoom, edge-swipe, subject look-at, lock-only retirement) | `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md` (+ Cam-6 look-at doc) |
| **Vision V0 … V4** | Camera / chrome / entrance **feel** under product vision (45° baseline, return home, branch walk, machine nav, settings, Layer A) | `docs/VISION.md` §6 · Issue #214 |

**Rule:** Cam slices built the machinery. V slices **adjust** that machinery toward Vision intent. Never implement a second camera subsystem.

```text
HISTORICAL architecture path (done as slices):
  Cam-1 → Cam-2 → Cam-3 → Cam-4  (+ Cam-5/6 behaviors in runtime/docs)

CURRENT experience path (Vision #214):
  V0 camera truth → V1 branch walk → V2 machine chrome → V3 entrance → V4 polish

CURRENT FRONTIER (2026-09-10):
  SP-03 Cam-4 browser proof (edge / inverse / reduced-motion / look-at coexistence)
  NOT Cam-2
```

---

## 2. Cam ladder status (architecture)

| Slice | Intent | Module / owner | PR | Status |
|-------|--------|----------------|-----|--------|
| **Cam-1** | Hierarchy camera follow **contract** (docs) | This family of contracts | #191 | **MERGED — historical** |
| **Cam-2** | Semantic tree dock on every open parent/child | `public/hero-cam2-tree-follow.js` · `resolveTreeCamera` · apply-cam2 flex | #192 | **MERGED — historical** |
| **Cam-3** | Free zoom/orbit about **current tree center** while parent open | `public/hero-cam3-tree-center-zoom.js` | #193 | **MERGED — historical** |
| **Cam-4** | Edge-drag + inverse-swipe whole-web PoV | `public/hero-cam4-edge-swipe.js` | #194 | **MERGED — historical** (browser depth: SP-03) |
| **Cam-5** | Absorb interim DOM chrome; settings UI scale path | DOM absorption + settings shell (also Vision V2) | #196–#199 + V2.* | **Partially fulfilled by later DOM/V2 work** — not a separate “next Cam” |
| **Cam-6** | Selected-tree look-at; retire pure lock-only presets | `resolveSelectedSeatDock` + Cam-6 docs; V0.3 regression | docs + #219 | **Behavior landed; lock-only retirement continues as debt** |

**Do not resume “Cam-2 next”.** Prefer this ledger + `docs/VISION.md` §6 + spatial SP sequence.

---

## 3. Vision V ladder status (experience)

Parent: Issue **#214** (closed) · docs PR **#215** · living ladder `docs/VISION.md` §6.

### Phase V0 — Camera truth

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| V0.1–V0.5 | Baseline, return, look-at, free nav, zoom ceiling | #217–#221 | **Merged** |

### Phase V1 — Branch walk

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| V1.1–V1.2 | Back/Next + arrows | #222–#223 | **Merged** |
| V1.3 | leave-tree → baseline | — | **Satisfied by V0.2** |
| V1.4 | per-face dock offset | — | **Deferred** |

### Phase V2 — Machine chrome

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| V2.1–V2.6 | Nav map, bind, settings, theme, scale, language | #224–#229 | **Merged** |

### Phase V3 — Entrance (Layer A)

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| **V3.1** | Entrance IA / layout contract | **#230** | **Merged** |
| **V3.2** | Brand hero image | **#235** | **Merged** |
| V3.3 | Gentle Hero atmosphere | — | **Planned** |
| V3.4 | Get-started → machine baseline | — | **Planned** |
| V3.5 | Far-environment links clarify | — | **Planned** |

---

## 4. Spatial SP sequence (pre-backend / pre-coloring)

| ID | Intent | Status |
|----|--------|--------|
| SP-01 | Canonical spatial state snapshot | **Partial** (Cam↔V ledger) |
| **SP-02** | Camera precedence matrix (Gate S3) | **Merged** (#236) |
| **SP-03** | Cam-4 browser proof | **This slice** |
| SP-04 | Apply-path integrity | **Next** |
| SP-05–SP-07 | Tree readability / R1-R2 / frontier decision | Planned |

---

## 5. V1.3 vs V0.2

Basic leave-tree → baseline is **SATISFIED by V0.2**. Do not reopen without a nested-unwind spec.

---

## 6. Document authority split

| Document | Role |
|----------|------|
| Cam follow contract | Historical architecture + still-valid product laws |
| `docs/VISION.md` | Current experience intent |
| **This file** | Current execution ledger |
| Spatial execution basis | Gates S0–S8 + SP-01–SP-07 |
| NEXT_SLICES | Living continuity pointer |

---

## 7. Evidence classes

```text
PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED
```

| Claim | Evidence class |
|-------|----------------|
| V3.1 / V3.2 | **Merged** |
| SP-02 precedence | **Merged** (#236) unit matrix |
| SP-03 Cam-4 browser | IMPLEMENTED + Playwright when this PR merges |
| 029 product release | **Not claimed** |

---

## 8. Next authorized commands

1. **SP-03** Cam-4 browser proof (this slice) → merge when CI green.  
2. **SP-04** apply-path integrity **or** **V3.3** gentle Hero atmosphere.  
3. Parallel **Conn-3** stays Edge/OAuth — never Hero live bind.

---

## 9. Skill routing

| Concern | Skill |
|---------|--------|
| Any change | `skills/execution/orucaveam/SKILL.md` |
| Hierarchy / camera | `skills/frontend/spatial/hierarchy-runtime/SKILL.md` |
| Ladder recovery | `skills/frontend/spatial/camera-ladder-recovery/SKILL.md` |
| Spatial presentation | `skills/frontend/spatial/UI_UX-Promax-Skill.md` |

---

## SEE ALSO

- Issue #232 · Issue #214  
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`  
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`  
- `docs/SKILL_WIRING.md`  
