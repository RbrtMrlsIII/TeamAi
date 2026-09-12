<!-- teamai-claim: SPATIAL-V3.5 state=COMPLETE -->
<!-- teamai-claim: BACKEND-001-ENDORSED state=ENDORSED_BOUNDED -->
<!-- teamai-claim: BACKEND-GATE4 state=PARKED_NOT_PROVEN -->
<!-- teamai-claim: BACKEND-PROVIDER state=STUB_ONLY -->
<!-- teamai-claim: CONN3 state=IMPLEMENTED_BROWSER_PROOF_PENDING -->
# TeamAi 029 — Current State & Continuation Map

**Status:** Current active reconciliation map for AI-agent recovery (2026-09-11)  
**Spatial baseline:** PR **#259 merged** — CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide is **historical implementation lineage**, now superseded for final product shape by the owner-directed experience rebaseline. **No 029-released claim.**  
**Experience baseline:** Owner-endorsed C0–C10 rebaseline: **classic website entrance → explicit 3D-world entry → authenticated/authorized full workspace**, with coherent navigation/Settings, reduced camera vocabulary, world-baseline zoom-out, proportional orbit, desktop/phone acceptance, then ProMax refinement.  
**Authority:** Product Law → Masterplan → Policy/ORUCAVEAM → `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` → `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` → domain contracts → this map → implementation/evidence  
**Purpose:** flatten parallel development clocks so an agent can tell what is implemented, proven, stopped, why it stopped, and what permits continuation.

## 1. The rule

A green commit, a checkpoint, a deployed function, or a staged asset is not by itself the current frontier.

For every slice, distinguish:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

A slice may stop between any two states. The stopping reason must be explicit and must not silently become the next slice.

**Post-merge rule (#260):** once a user-authorized change is merged to `main`, it is **current truth**. Prior baselines are historical (archive + redirect), not competing authorities.

## 2. Two development clocks

```text
029 EXPERIENCE / SPATIAL CLOCK
Product Law → product shape → structure → hierarchy → camera → interaction → readability → browser proof → user acceptance

BACKEND CLOCK
Backend contracts → identity → Firestore → Edge → commerce → provider → security → endorsement
```

They meet at the **presentation boundary**. A 3D face may represent a backend capability, but the face does not become the backend authority.

## 3. Current experience / spatial frontier

| Slice family | Current state | What is true | Why not automatically next |
|---|---|---|---|
| P1–P7.1 | COMPLETED | Seat hierarchy structure exists | Do not reopen without discrepancy |
| P-R0/P-R2/F | COMPLETED | workspace/seat presentation mechanics exist | Historical implementation strata |
| Cam-1–Cam-4 | COMPLETED | tree follow / center zoom / edge interaction | Cam-4 semantics now superseded by C7 proportional direction |
| Cam-5–Cam-6 / CAM-R1–R3 | MERGED | selected-seat subject-lock + browser proof | Retain as current 3D-world focus mechanism unless superseded |
| V0–V3.5 | COMPLETE | one-shell Vision lineage | Historical product-shape baseline, not final acceptance |
| #258 residual / #259 | MERGED | ENT-T1; CAM-R-RETIRE; Return; CHR soft-hide | Historical current-truth baseline; product shape superseded by C0–C10 |
| #265 / #266 | MERGED | entrance↔machine browser proof; CHR-R3 | Retained as implementation evidence, re-owned by C2–C4 |
| **C0–C10 rebaseline / #274** | **MERGED** | classic entrance + explicit 3D entry + coherent nav + camera/auth boundary groundwork | C9 visual acceptance gates product completion; C10 ProMax remains downstream |
| **Hero runtime delivery hardening / #275** | **MERGED** | repository-owned Hero runtime is now committed and normal browser/build execution no longer depends on remote runtime source | Preserve delivery hardening; do not reintroduce remote runtime loading |
| **#278 surface reconciliation** | **ACTIVE** | GitHub Pages public root is being aligned to the owner-directed classic entrance; Command Deck is retained under `/spatial/` as workspace/transition surface; `/hero/` remains compatibility route. PR **#281** holds C5/D nav-wall removal + C6/E zoom-out baseline; C6 e2e proof requires an open seat tree (`selectSeatShell`), not `setCamera('SEAT_CLOSE')` alone. | Acceptance requires deployed-root browser proof before C9; C6 fallback is `NAV_ZOOM_MAX`-gated, not unconditional. No 029-released claim. |

**Retired cameras:** `HERO_LOW_ORBIT` / `TURN_FOLLOW` → `docs/archive/superseded/` and must not be silently revived.

## 4. Current backend frontier

| Gate / item | State | Evidence boundary |
|---|---|---|
| Gate 3 identity + Firestore | RUNTIME-PROVEN | live auth + Firestore re-read |
| Gate 4 emulator/rules | PARKED | no real emulator PASS |
| Gate 5B/5C commerce | ENDORSED (bounded) | PayPal Sandbox + Firestore |
| Provider/runtime | STUB ONLY | stub-edge-runtime |
| Conn-3 | IMPLEMENTED; browser proof pending | not Hero live bind |

## 5. Live service cross-check

**Canonical inventory:** `backend/BACKEND_LIVE_SERVICE_STATUS.md` (do not duplicate full tables here).

## 6. Spatial ↔ backend connection rule

`3D mesh ≠ backend capability` · `CI green ≠ browser proof` · `deployed ≠ end-to-end complete`

## 7–9. Recovery / numeric / backend continuation

See hierarchy baseline §9, spatial execution basis, `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md`, and `backend/BACKEND_LIVE_SERVICE_STATUS.md`. Do not truncate recovery material without redirect.

## 10. When to continue spatial work

Follow the C0–C10 experience rebaseline and #278 surface reconciliation. Do not create isolated camera/chrome polish that re-entrenches the superseded one-shell entrance. C9 requires desktop + phone evidence and owner acceptance before C10 ProMax refinement.

## 11. Related documents

- `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md`
- `docs/TEAMAI_029_EXPERIENCE_REBASE_CHECKLIST.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` · `docs/archive/superseded/INDEX.md`
- `docs/security_inquiry.md` (future/pre-production backlog)
- `docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md`
- `docs/TEAMAI_029_DEPLOYMENT_SURFACE_MAP.md`
- `public/_flex_src/hero-flex.base.js` · repository-owned Hero base
- `scripts/apply-cam2-tree-follow-flex.mjs` → repository-owned wrapper for local assembly

## 12. Agent instruction

Do not ask “what feature is next?” until this map answers what is true, proven, stopped, and what evidence permits continuation. For the current experience, use the C0–C10 sequence plus #278 surface ownership rather than reopening historical V0–V3 queues.

<!-- residual: #275 repository-owned Hero runtime hardening; raw remote source removed from normal runtime/build entry path; internal legacy engine fallback remains slated for explicit cleanup -->

## #275 final runtime synchronization

Implementation baseline: `f4547116c1df840ff56f40907e39b154765c535c`.

`public/hero-flex.js` is the committed repository-owned assembled runtime. The normal browser/build path no longer depends on a remote runtime source. Local verification: SP-04 11/11, syntax check passed, `hero-flex-local-runtime.test.mjs` 1/1.

#275 is merged. No 029 release claim.

## #278 surface reconciliation baseline

The canonical public product surface is the classic website entrance. The Command Deck in `frontend/spatial/` is retained as the workspace/transition surface at `/spatial/`, not as the public front door. `public/` remains the canonical classic entrance + 3D-world source and is published both at the public root and at `/hero/` for compatibility until a later routing decision retires that duplicate path.

This route ownership is a deployment/product-shape decision only. It does not grant authentication, entitlement, or server authorization. C8 remains separately gated by server-verified identity and authorization.

## #281 (C5/D, C6/E, G follow-up to #278)

Nav-wall duplicate camera buttons removed from the DOM; `.world-navigation` is the sole world nav. `applyNavCamera()` zoom-out now falls back to `HERO_WIDE` at `NAV_ZOOM_MAX` regardless of an open tree/seat branch. Playwright coverage added for the canonical public homepage (desktop + phone) and the C6 zoom-out regression. Pending CI green and owner browser acceptance; does not itself constitute C9. No 029-released claim.

## #282 (C2/Phase C first-paint reconciliation, governance synchronization)

PR **#282** carries the first-paint presentation fix for the owner-observed duplicate classic entrance chrome. The change is limited to presentation-layer hiding in classic mode: `.hero-copy` is hidden so the legacy Layer-A brand does not duplicate the canonical classic brand, and the sibling `.far-environment` footer is hidden so its duplicate links do not stack over the classic entrance. The DOM/runtime world surfaces remain available for world-mode behavior; this is not a C5-style DOM removal.

The associated browser/unit coverage verifies the classic root surface rather than claiming full 029 acceptance. This slice addresses the duplicate first-paint observation under #278 Phase C only. It does not decide `/hero/` auto-world behavior, remove remaining world chrome, alter `TEAM_ORBIT`, implement continuous zoom/tree-to-tree travel, complete C8, or advance C9/C10.

PR #282 also synchronizes this state map as required by Active Index Coupling. CI/governance status remains the authority for whether the PR is merge-ready; this note records the intended current state and does not infer a green gate from documentation alone.

No 029-released claim.

---

## 15. Current tree-machine baseline extension

The complete 3D Hero tree system is **not complete**. The currently proven Seat hierarchy is a partial mechanism, not proof of a finished multi-tree machine.

```text
TREE-DOMAIN
  Account → Workplace → Project → Seat

TREE-HERO-SEAT
  Seat Shell → Connection → Behavior → Toolkit → Capabilities
  → Authorization → Workspace Scope → Task/Evidence

TREE-SKILL-RESPONSIBILITY
  ToolKit upstream → WebAi Seat responsibility
  → skill bundle → governance/adaptation/capacity
```

`treeID` and `branchId` are semantic identities. Coordinates, mesh positions, and camera docks never define identity. A branch is a real integration with purpose, responsibility, UI/product payload, expansion volume, adjacency clearance, connection/path ownership, camera relationship, responsive/reduced-motion behavior, and evidence.

Trees may be broad, asymmetric, recursive, and differently sized. Branches may contain branches. Geometry follows semantic/UI payload, not copied prototype coordinates.

The Hero is an expandable technological machine. A selected tree/branch may open its division to reveal the product surfaces belonging to that semantic unit. Maximum machine expansion is derived from the active division footprints and payloads.

During final turn-loop presentation, participating divisions are active/open so their semantic wiring corridors are spatially available. Electricity follows the real connection topology inward toward the workspace. Disconnected decorative paths are not an acceptable substitute.

Expansion/collapse is a smooth stateful spatial transition. Current timing values are living implementation baselines, not final visual law.

The synchronized structured inventory is the four-file tree census set. Whenever a tree/branch/division is added, removed, renamed, materially restructured, or reimplemented, the same governed PR must reconcile all four census representations and keep the state truthful.
