# TeamAi 029 — Current State & Continuation Map

**Status:** Working reconciliation map for AI-agent recovery
**Authority:** Product Law → Masterplan → Policy/ORUCAVEAM → domain contracts → this map → implementation/evidence
**Purpose:** flatten parallel development clocks into one incremental slice view so an agent can tell what is implemented, what is proven, what stopped, why it stopped, and what condition permits continuation.

## 1. The rule

A green commit, a checkpoint, a deployed function, or a staged asset is not by itself the current frontier.

For every slice, distinguish:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

A slice may stop between any two states. The stopping reason must be explicit and must not silently become the next slice.

## 2. Two development clocks

TeamAi currently advances on two related but bounded clocks:

```text
029 SPATIAL CLOCK
Product Law
  → structure
  → hierarchy state
  → camera truth
  → interaction
  → readability
  → topology presentation
  → browser proof
  → visual polish

BACKEND CLOCK
Backend contracts
  → identity
  → durable Firestore state
  → trusted Edge runtime
  → commerce correlation
  → webhook/runtime proof
  → provider/runtime invocation
  → security/recovery verification
  → traceability
  → endorsement
```

They meet at the **presentation boundary**. A 3D face may represent a backend capability, but the face does not become the backend authority. Backend implementation may proceed on its own approved gate, while the Hero consumes only the resulting presentation/read-model contract.

## 3. Current spatial frontier

| Slice family | Current state | What is true | Why not automatically next |
|---|---|---|---|
| P1–P7.1 | COMPLETED implementation lineage | Seat hierarchy structure exists | Do not reopen structure without a new discrepancy |
| P-R0 / P-R2 / F | COMPLETED implementation lineage | workspace/setup/health presentation extensions exist | Treat as roots, not a fresh ladder |
| Cam-1–Cam-4 | COMPLETED architecture lineage | follow / center zoom / edge-swipe modules merged | Historical architecture, not a new queue |
| Cam-5–Cam-6 | IMPLEMENTED + verification boundary | selected-seat look-at strengthened | Browser proof and integration state still determine completion quality |
| V0–V2 | MERGED | baseline, subject lock, branch walk, machine chrome | Current experience history |
| V3.1 | RECONCILE | PR lineage exists but may diverge from moving `main` | Rebase/review against current `main` before continuing |
| V3.2+ | PLANNED / STAGED | asset may exist | Asset presence ≠ implemented/accepted slice |
| R1/R2 mesh topology | SPECIFIED / PARTIAL | topology contract exists | Do not invent geometry without a named owner |

## 4. Current backend frontier

| Gate / item | State | Evidence boundary | Continuation condition |
|---|---|---|---|
| Gate 3 identity + Firestore bootstrap | RUNTIME-PROVEN | authenticated live execution + independent Firestore read + idempotency | Stable, not reopened unless regression appears |
| Gate 4 Firebase emulator/rules | PARKED | reproducible harness exists; emulator execution unavailable in prior environment | Operator runs emulator-capable verification and records real PASS |
| Gate 5B commerce correlation | VERIFIED / PASS | direct source-contract validation | Do not imply live payment evidence |
| Gate 5C commerce implementation | IMPLEMENTED / AVAILABLE-ENV VERIFIED | webhook authenticity/idempotency/durable event/entitlement projection source boundary | Remaining live PayPal transaction/webhook evidence |
| Provider/runtime invocation | NOT STARTED | intentionally deferred by Masterplan | Authorization/task contracts plus approved provider runtime owner |
| Security/failure/recovery verification | OPEN | mixed source/CI/live evidence | Complete bounded matrix including live recovery where required |
| Traceability | OPEN | not yet final | Reconcile Product Law → plan → skill → implementation → evidence → endorsement |
| Final endorsement | OPEN | none yet | HandOver + Endorsement after remaining gates |

## 5. Why backend stopped

The backend did not stop because its source architecture was absent. The repository records several implemented and runtime-proven bounded slices. It stopped at **external/runtime evidence boundaries** and final governance completion:

- Firebase emulator/rules execution was environment-constrained and explicitly parked.
- Gate 5B source contract passed, but live PayPal evidence was not inferred.
- Gate 5C implementation and available-environment verification are complete, but final live PayPal transaction/webhook evidence remains open.
- Provider/runtime invocation is deliberately deferred until authorization/task contracts and ownership are ready.
- Security/recovery, traceability, and completion endorsement remain open.

This is a stopped **verification/authorization frontier**, not a reason to restart already-completed backend implementation.

## 6. Spatial ↔ backend connection rule

A spatial slice may advance when it needs only presentation behavior whose backend authority already exists or is explicitly represented as a presentation-only stub/read-model contract.

A backend slice may advance without waiting for cosmetic coloring when its backend contract, owner, authorization, and verification path are independently ready.

Do not use either track to smuggle the other one across the boundary:

`3D mesh ≠ backend capability`

`backend endpoint ≠ Hero interaction proof`

`CI green ≠ browser proof`

`deployed ≠ end-to-end complete`

## 7. Minimum numbers needed for incremental spatial slices

Before a spatial slice can be considered mechanically bounded, record these numbers/identifiers in the hierarchy baseline or owning contract:

1. **Node identity:** `partId`, parent, child order, semantic depth.
2. **Pose:** rest position, open lift/offset, child step, radial/ring position when applicable.
3. **Motion:** open/close duration, frame/branch boost, reduced-motion bounds.
4. **Camera:** dock id, eye position, center target/look-at, base FOV.
5. **Navigation:** zoom min/max, orbit/yaw/pitch rates, edge-zone fraction, inverse-swipe gain/clamp.
6. **Readability:** expected readable face/plate, minimum scale/fit condition, narrow-viewport/FOV adjustment.
7. **Interaction:** trigger, focus owner, Back/Next behavior, close/return behavior.
8. **Evidence:** deterministic test, browser proof, and evidence label.

If one of these is missing, the slice is **reconcile-first**, not code-first.

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

Continue the backend clock only when the next open Masterplan item has:

- a named authority/contract owner;
- a permitted implementation path;
- a verification method appropriate to its claim;
- a live/operator dependency explicitly identified when applicable;
- no dependency on a falsely completed earlier gate.

For the current backend frontier, this means the next meaningful operator-facing progress is live PayPal sandbox transaction/webhook evidence, followed by direct Firestore verification and final traceability/endorsement work. Provider runtime should remain parked until its own authorization/task foundation is genuinely ready.

## 10. When to continue spatial work

Continue the spatial clock only after the current state is reconciled against moving `main`, and only when the proposed slice has one owner set and one measurable expected output.

The next spatial work should be selected from **verified gaps**, not historical Cam labels.

## 11. Relationship to other documents

- `PRODUCT_LAW.md` — product/architecture authority.
- `MASTERPLAN.md` — chronological execution authority.
- `POLICY.md` — execution constitution.
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` — executable spatial gates SP-01…SP-07.
- `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` — Cam↔V chronology.
- `docs/VISION.md` — current experience intent.
- `backend/BACKEND_LIVE_SERVICE_STATUS.md` — current backend evidence boundary.
- `docs/project-guide/HandOver.md` + `Endorsement.md` — durable completion/acceptance loop.

## 12. Agent instruction

**Do not ask “what feature is next?” until this map and the owning contract can answer “what is already true, what is only specified, what is proven, what stopped, why it stopped, and what exact evidence permits continuation?”**
