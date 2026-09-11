<!-- teamai-claim: SPATIAL-V3.5 state=COMPLETE -->
<!-- teamai-claim: BACKEND-001-ENDORSED state=ENDORSED_BOUNDED -->
<!-- teamai-claim: BACKEND-GATE4 state=PARKED_NOT_PROVEN -->
<!-- teamai-claim: BACKEND-PROVIDER state=STUB_ONLY -->
<!-- teamai-claim: CONN3 state=IMPLEMENTED_BROWSER_PROOF_PENDING -->
# TeamAi 029 — Current State & Continuation Map

**Status:** Current active reconciliation map for AI-agent recovery (2026-09-11)  
**Spatial baseline:** PR **#259 merged** — CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide is **current implementation truth** until deliberately superseded. V3.5 COMPLETE — **no 029-released claim**.  
**Authority:** Product Law → Masterplan → Policy/ORUCAVEAM → `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` → domain contracts → this map → implementation/evidence  
**Purpose:** flatten parallel development clocks so an agent can tell what is implemented, proven, stopped, why it stopped, and what permits continuation.

## 1. The rule

A green commit, a checkpoint, a deployed function, or a staged asset is not by itself the current frontier.

For every slice, distinguish:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

A slice may stop between any two states. The stopping reason must be explicit and must not silently become the next slice.

**Post-merge rule (#260):** once a user-authorized change is merged to `main`, it is **current truth**. Prior baselines are historical (archive + redirect), not competing authorities.

## 2. Two development clocks

```text
029 SPATIAL CLOCK
Product Law → structure → hierarchy → camera → interaction → readability → browser proof

BACKEND CLOCK
Backend contracts → identity → Firestore → Edge → commerce → provider → security → endorsement
```

They meet at the **presentation boundary**. A 3D face may represent a backend capability, but the face does not become the backend authority.

## 3. Current spatial frontier

| Slice family | Current state | What is true | Why not automatically next |
|---|---|---|---|
| P1–P7.1 | COMPLETED | Seat hierarchy structure exists | Do not reopen without discrepancy |
| Cam-1–Cam-4 | COMPLETED | follow / center zoom / edge-swipe | Historical |
| Cam-5–Cam-6 / CAM-R1–R3 | MERGED baseline | Subject-lock + browser proof | Polish only |
| V3.1–V3.5 | COMPLETE | Entrance ladder closed | Parallel: Conn-3 |
| **#258 residual / #259** | **MERGED baseline** | ENT-T1; CAM-R-RETIRE; Return; CHR soft-hide | CHR-R3+; ENT-T3–T5 |
| **#266 CHR-R3** | IN PR | Settings beside machine-nav; squash-merge skill | Merge when validated |

**Retired cameras:** `HERO_LOW_ORBIT` / `TURN_FOLLOW` → `docs/archive/superseded/`

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

See hierarchy baseline §9, spatial execution basis, and `backend/BACKEND_LIVE_SERVICE_STATUS.md`. Do not truncate recovery material without redirect.

## 10. When to continue spatial work

Authorized residuals only; no archived camera revival. CI green ≠ endorsement.

## 11. Related documents

- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` · `docs/archive/superseded/INDEX.md`
- `docs/security_inquiry.md` (living security questions)
- `docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md`

## 12. Agent instruction

Do not ask “what feature is next?” until this map answers what is true, proven, stopped, and what evidence permits continuation.

<!-- residual-chr-r3 index freshness 2026-09-11T07:52Z: settings beside machine-nav + squash-merge skill + security_inquiry -->
