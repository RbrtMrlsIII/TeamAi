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
| **C0–C10 rebaseline / #274** | **IN PR** | classic entrance + explicit 3D entry + coherent nav + camera/auth boundary groundwork | C9 visual acceptance gates product completion; C10 ProMax remains downstream |

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

Follow the C0–C10 experience rebaseline. Do not create isolated camera/chrome polish that re-entrenches the superseded one-shell entrance. C9 requires desktop + phone evidence and owner acceptance before C10 ProMax refinement.

## 11. Related documents

- `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md`
- `docs/TEAMAI_029_EXPERIENCE_REBASE_CHECKLIST.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` · `docs/archive/superseded/INDEX.md`
- `docs/security_inquiry.md` (future/pre-production backlog)
- `docs/TEAMAI_258_LAYER_AB_CHROME_RESIDUAL.md`

## 12. Agent instruction

Do not ask “what feature is next?” until this map answers what is true, proven, stopped, and what evidence permits continuation. For the current experience, use the C0–C10 sequence rather than reopening historical V0–V3 queues.

<!-- residual: #274 C0-C10 experience rebaseline, owner-endorsed 2026-09-11; current implementation PR, C9/C10 not yet accepted -->
