<!-- teamai-claim: SPATIAL-V3.5 state=COMPLETE -->
<!-- teamai-claim: BACKEND-001-ENDORSED state=ENDORSED_BOUNDED -->
<!-- teamai-claim: BACKEND-GATE4 state=PARKED_NOT_PROVEN -->
<!-- teamai-claim: BACKEND-PROVIDER state=STUB_ONLY -->
<!-- teamai-claim: CONN3 state=IMPLEMENTED_BROWSER_PROOF_PENDING -->
# TeamAi 029 — Current State & Continuation Map

**Status:** Current active reconciliation map for AI-agent recovery (2026-09-11)  
**Spatial baseline:** PR **#259 merged** (`4b9a74d`) — CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide is **current implementation truth** until deliberately superseded. V3.5 COMPLETE — **no 029-released claim**.  
**Authority:** Product Law → Masterplan → Policy/ORUCAVEAM → `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` → domain contracts → this map → implementation/evidence  
**Purpose:** flatten parallel development clocks so an agent can tell what is implemented, proven, stopped, why it stopped, and what permits continuation.

## 1. The rule

A green commit, a checkpoint, a deployed function, or a staged asset is not by itself the current frontier.

For every slice, distinguish:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

A slice may stop between any two states. The stopping reason must be explicit and must not silently become the next slice.

**Post-merge rule (#260):** once a user-authorized change is merged to `main`, it is **current truth**. Prior baselines are historical (archive + redirect), not competing authorities.

## 2. Two development clocks

TeamAi currently advances on two related but bounded clocks:

```text
029 SPATIAL CLOCK
Product Law
  → structure → hierarchy state → camera truth → interaction
  → readability → topology presentation → browser proof → visual polish

BACKEND CLOCK
Backend contracts
  → identity → durable Firestore state → trusted Edge runtime
  → commerce correlation → webhook/runtime proof → provider/runtime invocation
  → security/recovery verification → traceability → endorsement
```

They meet at the **presentation boundary**. A 3D face may represent a backend capability, but the face does not become the backend authority.

## 3. Current spatial frontier

| Slice family | Current state | What is true | Why not automatically next |
|---|---|---|---|
| P1–P7.1 | COMPLETED implementation lineage | Seat hierarchy structure exists | Do not reopen without a new discrepancy |
| Cam-1–Cam-4 | COMPLETED architecture lineage | follow / center zoom / edge-swipe merged | Historical module ladder, not a new queue |
| Cam-5–Cam-6 | IMPLEMENTED + verification boundary | selected-seat look-at strengthened | Browser proof still determines quality |
| V3.1–V3.5 | MERGED / COMPLETE | Entrance ladder closed on main | Parallel: Conn-3 browser proof |
| **#258 residual / #259** | **MERGED baseline** | ENT-T1 entrance brand **gone** on machine; CAM-R-RETIRE (`HERO_LOW_ORBIT` / `TURN_FOLLOW` **absent**); Return-to-entrance present; Layer A/B + chrome soft-hide | CAM subject-lock / ENT-T3–T5 still open where authorized |

**Retired cameras (do not resurrect):**

- `HERO_LOW_ORBIT` → `docs/archive/superseded/HERO_LOW_ORBIT.md`
- `TURN_FOLLOW` → `docs/archive/superseded/TURN_FOLLOW.md`

Replacement baseline: **HERO_WIDE**. Future seat-relative framing uses **selected-seat subject-lock**, not TURN_FOLLOW under a new name.

## 4. Current backend frontier

| Gate / item | State | Evidence boundary |
|---|---|---|
| Gate 3 identity + Firestore | RUNTIME-PROVEN | live auth + Firestore re-read |
| Gate 4 emulator/rules | PARKED | no real emulator PASS recorded |
| Gate 5B/5C commerce | VERIFIED / ENDORSED (bounded) | PayPal Sandbox + Firestore aggregate |
| Provider/runtime | OPEN / STUB ONLY | stub-edge-runtime only |
| Conn-3 | IMPLEMENTED; browser proof pending | not Hero live bind |

**Live service inventory (canonical owner, not duplicated here):**  
→ `backend/BACKEND_LIVE_SERVICE_STATUS.md`  
→ `docs/CHECKPOINT_BACKEND_EVIDENCE_RECONCILIATION_2026-09-10.md`

## 5. Why backend stopped

The backend did not stop because source architecture was absent. It stopped at **verification, external-runtime, and final-governance boundaries**:

- Firebase emulator/rules execution was environment-constrained and explicitly **parked** (Gate 4).
- Gate 5B/5C bounded PayPal Sandbox + Firestore evidence is runtime-proven and **endorsed for recorded scope only**.
- `teamai-task-execute` is live/authenticated but still invokes **stub-edge-runtime** (not a real external provider).
- Conn-3 is implemented in source; **live deployment/browser proof** remains pending (install ≠ Firebase UID bind ≠ Hero live bind).
- Seat connection/provider Edge surfaces may be deployed without a frontend exercise path yet.

Do not infer product-complete backend from deployment alone.

## 6. Spatial ↔ backend connection rule

`3D mesh ≠ backend capability` · `CI green ≠ browser proof` · `deployed ≠ end-to-end complete`

#259 was **presentation only** — no durable domain / backend authority change.

## 7. Minimum numbers needed for incremental spatial slices

Before a spatial slice is mechanically bounded, record these in the **hierarchy baseline** or owning contract (not only in chat):

1. **Node identity:** `partId`, parent, child order, semantic depth.
2. **Pose:** rest position, open lift/offset, child step, radial/ring position when applicable.
3. **Motion:** open/close duration, frame/branch boost, reduced-motion bounds.
4. **Camera:** dock id, eye position, center target/look-at, base FOV.
5. **Navigation:** zoom min/max, orbit rates, edge-zone fraction, inverse-swipe gain/clamp.
6. **Readability:** expected readable face/plate, minimum scale/fit, narrow-viewport/FOV adjustment.
7. **Interaction:** trigger, focus owner, Back/Next, close/handoff, a11y name.
8. **Evidence:** unit/static proof, browser proof label, explicit exclusions.

**Canonical numeric home:** `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` (§9 living numbers) · `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`

## 8. Slice completion record

Each incremental spatial slice should leave one compact record:

```text
Slice ID:
Current main SHA:
Parent/previous slice:
Owning roots:
Numbers used:
Trigger/input:
Expected camera subject:
Expected readable output:
Static/unit proof:
Browser proof:
Backend dependency:
Explicit exclusions:
Known limitation:
Evidence label:
Why stopped or why complete:
One next authorized command:
```

## 9. When to continue backend work

Continue the backend clock only when the next open Masterplan item has a named authority/contract owner, permitted implementation path, verification method appropriate to its claim, live/operator dependency identified when applicable, and no dependency on a falsely completed earlier gate.

Current remaining backend themes: Gate 4 emulator PASS, real provider beyond stub, Conn-3 live/browser proof, deferred seat surfaces. See `backend/BACKEND_LIVE_SERVICE_STATUS.md`.

## 10. When to continue spatial work

After **#259 baseline**, spatial feel work continues only under authorized residuals (e.g. selected-seat subject-lock, ENT-T3–T5) without resurrecting archived cameras. Visual endorsement still requires owner/browser evaluation — CI green ≠ endorsement.

## 11. Relationship to other documents

- `PRODUCT_LAW.md` · `MASTERPLAN.md` · `POLICY.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` · `docs/GOVERNANCE_FAIL_CLOSED.md`
- `docs/archive/superseded/INDEX.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` · hierarchy baseline §9
- `docs/VISION.md` · `docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`

## 12. Agent instruction

**Do not ask “what feature is next?” until this map and the owning contract can answer “what is already true, what is only specified, what is proven, what stopped, why it stopped, and what exact evidence permits continuation?”**

Do not treat archived cameras as a queue. Do not truncate this map or MASTERPLAN to pass governance freshness.

<!-- residual-260 index freshness 2026-09-11: #259 baseline + archive redirects + restored recovery sections -->
