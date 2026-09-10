# TeamAi Backend Operator State Checkpoint — 2026-09-10

**Status:** ACTIVE recovery checkpoint  
**Purpose:** preserve operator-visible backend progress and the exact boundary between successful external setup, deployed infrastructure, browser integration defects, and frontend-dependent verification.

## 1. GitHub App installation

### Confirmed operator state

The TeamAi GitHub App installation has been completed successfully through the actual GitHub installation flow, including installation performed by another GitHub user.

The successful installation is supported by the operator's connected Supabase history evidence.

### Important discrepancy

A separate CLI `curl` attempt returned **HTTP 401**. That result is classified as a **CLI/test-path discrepancy**, not as evidence that the GitHub App installation failed.

Do not replace browser/GitHub installation evidence with a raw curl result. The two paths have different request context, authentication, and redirect behavior.

## 2. Current Conn-3 boundary

| Surface | State | Interpretation |
|---|---|---|
| GitHub App install | **OPERATOR_CONFIRMED / SUCCESSFUL** | GitHub accepted the installation; preserve this fact as external operator evidence |
| `teamai-github-oauth-bind` | **DEPLOYED** | trusted Edge infrastructure exists |
| UID ↔ installation persistence | **SERVER-OWNED CONTRACT** | remains a Firestore responsibility; do not move first-write authority into browser |
| Post-install browser return | **OPEN** | user is left viewing callback/worker HTML rather than being returned to the TeamAi website/intended app page |
| Hero live binding | **NOT CLAIMED** | installation success alone does not establish 029 live Hero bind |
| Full Conn-3 acceptance | **OPEN** | requires the real browser flow plus the applicable evidence packet |

## 3. Browser-flow defect

The current product-flow problem is not the GitHub installation itself. The browser reaches the callback/worker surface and exposes the HTML body in a separate worker-browser page instead of completing the user-facing return to the TeamAi website or intended GitHub-connected app destination.

The bounded fix should therefore target **post-install continuation / canonical redirect behavior**, not rewrite the GitHub installation or UID-binding architecture.

Tracked in **Issue #244**:

`BACKEND/CONN-3: preserve successful GitHub App install, fix post-install return flow`

## 4. Evidence rules for Issue #244

The fix may be considered complete only after these are separately demonstrated:

1. A real browser installation succeeds in GitHub.
2. The callback/return path lands on the canonical TeamAi website or intended GitHub-connected page.
3. The raw callback/worker HTML is not the user-facing terminal state.
4. The Firebase UID ↔ GitHub installation mapping remains server-owned and durable.
5. The CLI 401 remains documented as a separate test-path result unless it is independently reproduced as a product-flow failure.

## 5. Seat/provider surfaces

The connected Supabase project currently exposes:

- `teamai-seat-connection-test` v3
- `teamai-seat-provider-bind` v3

These are **deployed surfaces**, but they have not yet been exercised through a frontend path because the corresponding frontend capability surface is not yet available.

Current state: **DEFERRED / WAITING FOR FRONTEND PROOF**.

This is not a defect classification. Do not invent backend failure from the absence of a frontend exercise path.

The frontend track may later consume these surfaces through an explicit capability/read-model contract. The backend track remains responsible for its own contract and runtime guarantees.

## 6. Backend execution boundary after this checkpoint

The backend and frontend can now proceed independently:

```text
BACKEND TRACK
operator evidence → trusted Edge → Firestore authority → provider/runtime verification

                  │
                  │ explicit capability/read-model contract
                  ▼

FRONTEND TRACK
Hero UI / slots / capability presentation / browser interaction
```

Neither track should silently absorb the other's verification work.

### Backend does not block on

- 3D coloring/material polish
- Hero slot visuals
- frontend absence of seat exercise

### Frontend does not own

- Firebase UID authority
- Firestore domain persistence
- GitHub first-write binding authority
- PayPal event authenticity/idempotency
- provider-runtime credentials or trusted execution

## 7. Current open backend slices

| Slice | State | Next evidence boundary |
|---|---|---|
| GitHub post-install return | **OPEN / focused defect** | real browser callback → canonical TeamAi destination |
| Seat connection test | **DEFERRED** | frontend path available, then bounded end-to-end test |
| Seat provider bind | **DEFERRED** | frontend path available, then bounded end-to-end test |
| `teamai-task-execute` provider stage | **STUB RUNTIME** | approved real provider runtime + authorization/task contract |
| PayPal live runtime | **OPEN** | real sandbox transaction/webhook + durable Firestore verification |
| Firebase Rules Gate 4 | **PARKED** | emulator-capable execution and real PASS evidence |
| Security/recovery | **OPEN** | bounded live failure/recovery matrix |
| Traceability | **OPEN** | Product Law → Masterplan → contract/skill → implementation → evidence |
| Final endorsement | **OPEN** | HandOver + Endorsement after remaining gates |

## 8. Recovery instruction

Future agents must preserve the distinction:

`OPERATOR_CONFIRMED ≠ DEPLOYED ≠ RUNTIME-PROVEN ≠ COMPLETED ≠ ENDORSED`

For the GitHub App specifically:

`GitHub install succeeded → callback return is defective → bind architecture remains intact → Conn-3 acceptance remains open`

The CLI 401 must not erase the successful external installation record.

**One next authorized backend action:** implement and verify the canonical post-install browser return for Issue #244 without changing first-write UID/install ownership.
