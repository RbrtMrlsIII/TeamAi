# TeamAi Backend — Live Reality Ledger

**Date:** 2026-09-12  
**Status:** ACTIVE recovery / evidence ledger  
**Purpose:** preserve connected backend state that may exist outside ordinary repository-visible evidence, especially manually configured Firebase/Supabase/provider state, so later agents do not erase or misclassify progress.

## 1. Why this ledger exists

TeamAi advances on two bounded clocks:

- the **backend clock** may advance through manual operator setup, provider configuration, live Edge deployment, and runtime verification;
- the **029 spatial clock** may advance through Hero structure, camera, interaction, browser proof, and visual polish.

These clocks are intentionally independent. A repository-only agent can therefore see less than the connected runtime, while a live deployment can exist without satisfying repository completion criteria.

This ledger records the bridge:

`repository intent → manual/operator action → connected runtime state → claim-level evidence → documented status`

It is not a replacement for Product Law, Masterplan, backend contracts, or evidence checkpoints.

## 2. Visibility model

### Repository-visible evidence
Firebase project identity, Firestore paths, rules/configuration, Gate-3 evidence, Gate-4 parking conditions, backend checkpoints, and source contracts live in the repository.

### Connected-runtime evidence
The connected Supabase project exposes live Edge Function inventory and deployment state that repository-only agents cannot infer.

### Operator-only/manual actions
Provider dashboards, credentials/secrets, external account authorization, live/sandbox transactions, and similar actions may require the operator. They are not automatically visible to every agent and must be preserved in an evidence record when material.

### Claim rule

`manual setup ≠ implementation proof`  
`deployment ≠ runtime proof`  
`runtime proof ≠ completion`  
`completion ≠ endorsement`

## 3. Current connected Supabase state — 2026-09-12

Connected project: `TeamAi` (`srpgzzretfyqdsfclnuo`).

The live inventory currently contains **exactly eight ACTIVE TeamAi Edge Functions**:

| Runtime surface | Status | Version | Current interpretation |
|---|---|---:|---|
| `teamai-commerce-intent` | ACTIVE | 19 | pending commerce intent surface |
| `teamai-domain-bootstrap` | ACTIVE | 22 | idempotent domain bootstrap |
| `teamai-github-oauth-bind` | ACTIVE | 8 | GitHub installation/OAuth binding; not Hero live bind proof |
| `teamai-github-webhook` | ACTIVE | 7 | GitHub webhook receipt; not Hero live bind proof |
| `teamai-paypal-webhook-v5c` | ACTIVE | 21 | canonical live PayPal webhook |
| `teamai-seat-connection-test` | ACTIVE | 7 | provider connectivity/health test |
| `teamai-seat-provider-bind` | ACTIVE | 7 | encrypted provider-key binding |
| `teamai-task-execute` | ACTIVE | 12 | authenticated task lease/execution boundary; provider remains `stub-edge-runtime` |

The obsolete `paypal-webhook` deployment was manually removed by the operator before this observation. It is not part of the current active surface.

The precise live deployment inventory is the canonical snapshot in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`. This ledger carries the wider claim/evidence context around that inventory.

The connected Supabase public schema contains no TeamAi application tables. Firestore `(default)` remains the durable TeamAi application/domain authority.

## 4. Current backend frontier

| Item | Current truth | Evidence boundary | Do not infer |
|---|---|---|---|
| Firebase identity / Firestore bootstrap | runtime-proven bounded slices | repository checkpoints + exercised live paths | full backend completion |
| Firebase Rules Gate 4 | parked | reproducible harness exists; emulator PASS absent | emulator/hosted/production PASS |
| PayPal commerce gate | bounded runtime-proven evidence exists | recorded provider sandbox/live configuration + Firestore evidence | all subscribed events semantically supported |
| `teamai-task-execute` | authenticated bounded stub path | live execution evidence | real provider runtime |
| GitHub OAuth/installation | deployed binding infrastructure | live function + repository evidence | Hero live bind / 029 acceptance |
| Seat connection/provider | deployed infrastructure | live inventory | end-to-end product completion |
| Security/recovery | open where claim-level evidence is incomplete | remaining verification matrix | completion |
| Traceability / endorsement | separate from deployment | HandOver + Endorsement evidence | release readiness |

## 5. PayPal live configuration boundary

The operator reports the live PayPal webhook target as:

`https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-paypal-webhook-v5c`

Environment: `live`.

The provider configuration census contains 67 subscribed event labels, preserved in Issue #284 §6. The live v5c source currently maps 16 event types. Verified but unmapped events are acknowledged as `processed: false` / `unsupported_event_type`; provider subscription does not itself establish TeamAi semantic support.

## 6. Manual setup responsibility

The correct boundary remains:

```text
Agent identifies missing manual boundary
        ↓
Agent records exact operator dependency
        ↓
User performs / authorizes external action
        ↓
Agent inspects connected runtime where available
        ↓
Agent records observed state + evidence class
        ↓
Repository state is reconciled
```

## 7. Frontend / backend independence

Frontend agents may advance bounded spatial work without backend completion when they consume only explicit presentation/read-model contracts or clearly labeled stubs.

Backend agents may advance approved infrastructure/evidence work without waiting for Hero polish.

Neither track may silently absorb the other's authority.

## 8. Preservation protocol

Before a major backend refactor, provider integration, frontend/backend merge, cleanup, or deployment change that could obscure existing state, preserve:

- observed live state;
- repository state;
- operator dependency;
- evidence class;
- owner;
- stopping boundary;
- next authorized evidence action.

The preferred sequence is:

`inspect → compare → classify → document → improve`

Never:

`improve → infer → overwrite history`

## 9. Deployment/source boundary

GitHub `main` is source authority. Supabase is deployed Edge infrastructure. Firebase Firestore is durable domain state. Deployment inventory is evidence of what is live, not evidence that the corresponding product behavior is complete.

Several current Supabase deployment records still contain inconsistent local checkout path shapes such as `TeamAi/TeamAi/`. This is deployment provenance evidence and remains an open reconciliation item until the deploy source/path is governed; it is not by itself proof of runtime failure.

## 10. Historical continuity

Older deployment tables that contain `paypal-webhook` or earlier function versions remain historical snapshots where preserved. They must not be edited into false current state. The current 2026-09-12 eight-function snapshot supersedes them for live inventory purposes.

Likewise:

`source implementation ≠ deployment ≠ integration ≠ runtime proof ≠ completion ≠ endorsement`

## 11. Canonical references

- `PRODUCT_LAW.md` — product / architecture authority.
- `MASTERPLAN.md` — chronological execution authority and release gate.
- `POLICY.md` / ORUCAVEAM — execution constitution.
- `docs/SKILL_WIRING.md` — capability/skill routing.
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md` — cross-track state map.
- `backend/BACKEND_LIVE_SERVICE_STATUS.md` — backend claim-level status.
- `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md` — current live eight-function inventory.
- `docs/CHECKPOINT_BACKEND_EVIDENCE_RECONCILIATION_2026-09-10.md` — evidence reconciliation.

When sources disagree, reconcile the authority chain and preserve the discrepancy rather than selecting the most optimistic interpretation.

## 12. Agent recovery instruction

> Preserve live truth before improving implementation. Repository history tells what was committed. Connected runtime inspection tells what is deployed. Operator actions can exist outside agent visibility. Completion requires the appropriate evidence boundary.

Before changing backend or frontend architecture, reconcile those three views.
