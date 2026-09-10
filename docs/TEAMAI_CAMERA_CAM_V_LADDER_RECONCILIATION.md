# TeamAi Camera — Cam ladder ↔ Vision V-series reconciliation

**Status:** CURRENT EXECUTION LEDGER (Issue #232 partial)  
**Date:** 2026-09-10  
**Authority:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → `docs/VISION.md` → this ledger → Cam contracts / NEXT_SLICES  
**Claim:** presentation continuity only · **no 029-released claim**  
**Does not:** rewrite Product Law, redesign the Hero, or close TEAM-BACKEND-001

This document is the **single recovery map** so agents do not choose a stale Cam-2 path when the living frontier is Vision V3.

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
  V3.1 Entrance IA/layout — PR #230 open (reconcile vs main before merge)
  NOT Cam-2
```

---

## 2. Cam ladder status (architecture)

| Slice | Intent | Module / owner | PR | Status |
|-------|--------|----------------|-----|--------|
| **Cam-1** | Hierarchy camera follow **contract** (docs) | This family of contracts | #191 | **MERGED — historical** |
| **Cam-2** | Semantic tree dock on every open parent/child | `public/hero-cam2-tree-follow.js` · `resolveTreeCamera` · apply-cam2 flex | #192 | **MERGED — historical** |
| **Cam-3** | Free zoom/orbit about **current tree center** while parent open | `public/hero-cam3-tree-center-zoom.js` | #193 | **MERGED — historical** |
| **Cam-4** | Edge-drag + inverse-swipe whole-web PoV | `public/hero-cam4-edge-swipe.js` | #194 | **MERGED — historical** (unit/module strong; browser depth still open per #232) |
| **Cam-5** | Absorb interim DOM chrome; settings UI scale path | DOM absorption + settings shell (also Vision V2) | #196–#199 + V2.* | **Partially fulfilled by later DOM/V2 work** — not a separate “next Cam” |
| **Cam-6** | Selected-tree look-at; retire pure lock-only presets | `resolveSelectedSeatDock` + Cam-6 docs; V0.3 regression | docs + #219 | **Behavior landed; lock-only retirement continues as debt** |

**Do not resume “Cam-2 next”.** If a Cam contract section still says Cam-2 is next, treat that section as **historical** and prefer this ledger + `docs/VISION.md` §6.

---

## 3. Vision V ladder status (experience)

Parent: Issue **#214** (closed) · docs PR **#215** · living ladder `docs/VISION.md` §6.

### Phase V0 — Camera truth

| ID | Intent | Cam owner adjusted | PR | Status |
|----|--------|--------------------|-----|--------|
| V0.1 | ~45° world baseline via `HERO_WIDE` | Cam-1/2 docks | #217 | **Merged** |
| V0.2 | Close/return restores baseline dock | Close-parent / return path | #218 | **Merged** |
| V0.3 | Subject-lock regression | Cam-5/6 look-at | #219 | **Merged** |
| V0.4 | Free orbit/zoom about subject while open | Cam-3/4 gates | #220 | **Merged** |
| V0.5 | Zoom ceiling (`NAV_ZOOM_MAX` 2.0) | Hierarchy §9 | #221 | **Merged** |

### Phase V1 — Branch walk

| ID | Intent | Owner | PR | Status |
|----|--------|-------|-----|--------|
| V1.1 | Back/Next seat branch walk API | `hero-seat-branch-walk.js` | #222 | **Merged** |
| V1.2 | Arrow Left/Right → `cycleSeatShellBranchFocus` | apply-v1.2 + hierarchy | #223 | **Merged** |
| V1.3 | Explicit leave-tree → baseline | See §5 | — | **Classify: largely satisfied by V0.2** unless nested unwind is specified |
| V1.4 | Optional per-face dock offset | Cam-2 docks after V0 | — | **Deferred** |

### Phase V2 — Machine chrome

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| V2.1 | Parts/trees nav map data | #224 | **Merged** |
| V2.2 | Bind map to seat-stack chrome | #225 | **Merged** |
| V2.3 | Settings shell | #226 | **Merged** |
| V2.4 | Theme polish on theme-root | #227 | **Merged** |
| V2.5 | UI scale scaffold | #228 | **Merged** |
| V2.6 | Language scaffold (`en` only) | #229 | **Merged** |

### Phase V3 — Entrance (Layer A)

| ID | Intent | PR | Status |
|----|--------|-----|--------|
| **V3.1** | Entrance IA / layout contract | **#230** | **OPEN** — reconcile vs current `main`, re-verify, then merge |
| V3.2 | Brand hero image | asset may exist (#231) | **Asset ≠ slice complete** |
| V3.3 | Gentle Hero atmosphere | — | **Planned** |
| V3.4 | Get-started → machine baseline | — | **Planned** |
| V3.5 | Far-environment links clarify | — | **Planned** |

### Phase V4 — Polish (optional)

Tree color language, full seat smoke, reduced-motion path, mobile parity — always via existing owners first.

---

## 4. Cam ↔ V crosswalk (agent recovery)

| If you need… | Use Cam owner | Current V status |
|--------------|---------------|------------------|
| Follow open tree dock | Cam-2 `resolveTreeCamera` | Landed; V0.1 tunes baseline dock |
| Free zoom about subject | Cam-3 | Landed; V0.4/V0.5 refine gates/clamps |
| Edge / inverse swipe | Cam-4 | Landed module; browser proof still deeper per #232 |
| Selected-tree look-at | Cam-6 / `resolveSelectedSeatDock` | Landed; V0.3 regression |
| Return home on leave | Close-parent + `HERO_WIDE` | **V0.2 merged**; do not reimplement as blank V1.3 without new nested-unwind spec |
| Branch Back/Next | Hierarchy focus + V1.1/V1.2 | **Merged** |
| Right-side parts list | DOM chrome + V2.1/V2.2 | **Merged** |
| Settings / theme / scale / lang | theme-root + V2.3–V2.6 | **Merged** |
| Public entrance layout | `public/index.html` / shell | **V3.1 open (#230)** |

**Wrong recovery path:** open Cam follow contract §8 → implement Cam-2.  
**Right recovery path:** this ledger §3 → current frontier V3.1 / #230 (or remaining #232 checklist items).

---

## 5. V1.3 vs V0.2 (Issue #232 finding §2)

| Item | Statement |
|------|-----------|
| **V0.2** | Close / Escape / leave open parent restores `WORLD_BASELINE_DOCK_ID` (`HERO_WIDE`) and resets free-nav home |
| **V1.3** (Vision text) | Explicit leave-tree → baseline |
| **Reconciliation** | Treat **basic leave-tree → baseline as SATISFIED by V0.2** |
| **Only reopen V1.3 if** a **nested** branch/tree unwind (multi-level close without losing subject incorrectly) is specified with tests |
| **Agent rule** | Do not schedule a full second “return baseline” implementation slice without that narrower spec |

---

## 6. Document authority split

| Document | Role after this reconciliation |
|----------|--------------------------------|
| `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md` | **Historical architecture + still-valid product laws** (follow tree, center target, retire lock-only). §8 ladder marked **fulfilled / historical**. |
| `docs/VISION.md` | **Current experience intent** + ordered V ladder |
| **This file** | **Current execution ledger** Cam↔V + frontier |
| `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` | Living continuity pointer; defers camera chronology here |
| `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9 | Living numbers only |

---

## 7. Evidence classes (do not upgrade by implication)

```text
PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED
```

| Claim | Evidence class on main (typical) |
|-------|----------------------------------|
| Cam-2 module dock | IMPLEMENTED + unit tests |
| Cam-4 edge/swipe | IMPLEMENTED + module tests; browser interaction depth still #232 open |
| V0.2 return baseline | IMPLEMENTED + tests |
| V3.1 entrance IA | PR #230 IMPLEMENTED on branch; not COMPLETED until merged on reconciled main |
| #231 hero icon asset | Asset staged ≠ V3.2 COMPLETED |
| 029 product release | **Not claimed** — TEAM-BACKEND-001 remains the release gate |

---

## 8. Next authorized commands (after this docs slice)

Ordered for agents (Issue #232 remaining work is broader; this slice only closes the **Cam↔V map** finding):

1. Reconcile **PR #230** against current `main`, re-run checks, merge when green → **V3.1**.  
2. Continue **#232** residual items (precedence matrix, Cam-4 browser proof, apply-patch integrity, Conn-3 state, HandOver convention) as separate bounded slices.  
3. **V3.2** brand hero only after V3.1; distinguish asset present vs visually accepted.  
4. Parallel **Conn-3** stays Edge/OAuth — never Hero live bind.

---

## 9. Skill routing

| Concern | Skill |
|---------|--------|
| Any change | `skills/execution/orucaveam/SKILL.md` |
| Hierarchy open/camera numbers | `skills/frontend/spatial/hierarchy-runtime/SKILL.md` |
| Recover which ladder is current | `skills/frontend/spatial/camera-ladder-recovery/SKILL.md` |
| Spatial presentation | `skills/frontend/spatial/UI_UX-Promax-Skill.md` |
| Grok host | `docs/GROK_SKILLS_ALIGNMENT.md` |

---

## SEE ALSO

- Issue #232  
- Issue #214 / PR #215  
- `docs/VISION.md`  
- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`  
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`  
- `docs/SKILL_WIRING.md`  
