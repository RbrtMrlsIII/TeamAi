# TeamAi Backend — Live Reality Ledger

**Date:** 2026-09-10  
**Status:** ACTIVE recovery / evidence ledger  
**Purpose:** preserve backend developments that may exist outside ordinary agent-visible repository evidence, especially manually configured Firebase/Supabase state, so later frontend work does not erase or misclassify backend progress.

## 1. Why this ledger exists

TeamAi is intentionally being developed on two bounded clocks:

- the **backend clock** may advance through manual operator setup, connected provider configuration, live Edge deployment, and runtime verification;
- the **029 spatial clock** may advance through Hero structure, camera, interaction, readability, browser proof, and visual polish.

These clocks do not require the same Agent to carry both responsibilities at the same time.

A repository-only agent can therefore see an apparently conservative backend checklist while the actual connected infrastructure has already advanced. Conversely, live deployment can exist without satisfying the repository's claim-level completion criteria.

This ledger records the bridge:

`repository intent → manual/operator action → connected runtime state → claim-level evidence → documented status`

The ledger is **not** a replacement for Product Law, Masterplan, backend contracts, or evidence checkpoints. It exists to prevent live progress from disappearing between handoffs.

## 2. Visibility model

### Repository-visible evidence

Firebase work already has substantial durable evidence in the repository, including project identity, Firestore paths, rules/configuration, Gate-3 runtime evidence, Gate-4 parking conditions, and backend checkpoints. Agents should use those records as the canonical repo-side evidence rather than reopening completed Firebase architecture without a new discrepancy.

### Connected-runtime evidence

Supabase contains live TeamAi Edge Functions and deployment state that are not discoverable from repository text alone. A connected GPT session with access to the TeamAi Supabase project can inspect this layer directly.

### Operator-only/manual actions

Some setup is intentionally performed by the human operator rather than delegated to an Agent. Examples include provider dashboards, credentials/secrets, external account authorization, sandbox transactions, and other actions requiring the user's authority or interaction.

**Operator actions are not automatically visible to every Agent.** They must be reflected in this ledger or an appropriate evidence checkpoint before the repository can accurately describe the current state.

### Claim rule

`manual setup ≠ implementation proof`  
`deployment ≠ runtime proof`  
`runtime proof ≠ completion`  
`completion ≠ endorsement`

The purpose of the ledger is to preserve the facts without collapsing those distinctions.

## 3. Current known live backend state

The 2026-09-10 connected Supabase cross-check recorded TeamAi project `srpgzzretfyqdsfclnuo` as **ACTIVE_HEALTHY**.

Observed deployed Edge Functions at that checkpoint included:

| Runtime surface | Observed state | Current interpretation |
|---|---|---|
| `teamai-domain-bootstrap` v18 | ACTIVE | deployed domain bootstrap surface; claim level remains evidence-bound |
| `teamai-commerce-intent` v15 | ACTIVE | deployed commerce-intent surface; live commerce completion is not inferred |
| `paypal-webhook` v15 | **HISTORICAL / RETIRED FROM REPOSITORY** | superseded by `teamai-paypal-webhook-v5c`; repository cleanup must remove it from active guidance; historical deployment evidence is preserved elsewhere |
| `teamai-paypal-webhook-v5c` v17 | ACTIVE | canonical Gate-5C-related surface; deployment does not close live evidence |
| `teamai-task-execute` v8 | ACTIVE | authenticated task → lease → durable result path is live; provider stage is explicitly `stub-edge-runtime` |
| `teamai-github-webhook` v3 | ACTIVE | deployed GitHub webhook surface; product-level completion remains evidence-bound |
| `teamai-github-oauth-bind` v4 | ACTIVE | authenticated Firebase UID ↔ GitHub installation binding exists in Firestore; not Hero live binding proof |
| `teamai-seat-connection-test` v3 | ACTIVE | deployed connection-test surface; product acceptance remains evidence-bound |
| `teamai-seat-provider-bind` v3 | ACTIVE | deployed seat/provider binding surface; product acceptance remains evidence-bound |

The same cross-check found **no public-schema tables** in the connected TeamAi Supabase database. This is consistent with the current architecture: Firestore `(default)` is the durable TeamAi domain store, while Supabase provides trusted Edge execution and webhook infrastructure.

## 4. Backend frontier preserved for Agent recovery

| Item | Current truth | Evidence boundary | Do not infer |
|---|---|---|---|
| Firebase identity / Firestore bootstrap | runtime-proven bounded slices | repository checkpoints + live exercised paths | full backend completion |
| Firebase Rules emulator Gate 4 | parked | reproducible harness; emulator execution unavailable in prior environment | emulator/hosted/production PASS |
| Gate 5B | source-contract PASS | direct validation evidence | live payment or entitlement completion |
| Gate 5C | implementation + available-environment verification | source + available-env evidence | live PayPal transaction/webhook completion |
| `teamai-task-execute` | runtime-proven bounded stub path | live authenticated execution | real provider runtime |
| GitHub OAuth/installation bind | deployed infrastructure | live function inspection + repository contract | Hero live bind / 029 acceptance |
| Seat connection/provider surfaces | deployed infrastructure | live inventory + contract evidence | end-to-end seat product completion |
| Security/recovery | open | remaining claim-level matrix | completion |
| Traceability | open | Product Law → Masterplan → contract/skill → implementation → evidence | completion |
| Final endorsement | open | HandOver + Endorsement | release claim |

## 5. Manual setup responsibility model

TeamAi deliberately keeps human-required external setup with the user/operator when the action requires direct account authority, provider UI interaction, secret entry, payment interaction, or another boundary the Agent should not silently perform.

The correct handoff pattern is:

```text
Agent identifies missing manual boundary
        ↓
Agent records exact required operator action
        ↓
User performs / authorizes external setup
        ↓
Agent inspects connected runtime where available
        ↓
Agent records observed state + evidence label
        ↓
Repository checkpoint / ledger updated
        ↓
Next bounded slice becomes eligible
```

The user is therefore a **manual setup dependency and evidence source**, not a hidden implementation team that an Agent may safely assume completed every undocumented step.

## 6. Frontend / backend independence rule

Frontend Agents should be allowed to continue making bounded spatial progress while backend work is independently advanced, provided the frontend consumes only an explicit presentation/read-model contract or a clearly labeled stub.

Backend Agents should be allowed to continue approved infrastructure/evidence work without waiting for 3D coloring, materials, or final Hero polish.

Neither track should silently absorb the other's responsibility.

```text
                 PRESENTATION BOUNDARY
                        │
          3D representation / read-model
                        │
                        ▼
              trusted backend authority
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       identity    durable state    runtime
```

## 7. Update protocol: preserve progress before it moves

Before an Agent performs a major backend refactor, provider integration, frontend/backend merge, or cleanup that could obscure historical state, it should first record:

1. **Observed live state** — what the connected runtime actually reports.
2. **Repository state** — what source/contracts/checkpoints currently claim.
3. **Operator dependency** — which facts or actions came from manual setup.
4. **Evidence class** — source-only, deployed, runtime-proven, external-live, completed, or endorsed.
5. **Owner** — Agent, user/operator, provider, or explicit subsystem owner.
6. **Stopping boundary** — why work stopped at that state.
7. **Next authorized evidence action** — one bounded action, not a speculative feature queue.

This should happen **before cleanup**, because a later "improvement" can erase the breadcrumb that explains why a deployed function, credential, binding, or manual provider state exists.

## 8. GPT-only / connected inspection rule

When connected backend access is available, GPT should treat live inspection as an evidence source that complements repository evidence.

A connected inspection must be translated into a durable repository record when it materially changes the interpretation of an open Masterplan item. Otherwise, the knowledge dies with the session.

The preferred sequence is:

`inspect → compare → classify → document → only then improve`

Never:

`improve → infer → overwrite history`

## 9. Current preserved discrepancy set

The following are intentionally preserved until claim-level reconciliation completes:

- the historical `paypal-webhook` deployment was superseded by `teamai-paypal-webhook-v5c` and is now treated as retired repository surface;
- `teamai-task-execute` is deployed and authenticated but remains a stub provider runtime;
- GitHub OAuth/installation bind is deployed but is not equivalent to Hero live binding;
- seat connection/provider functions are deployed but deployment alone does not establish 029 product completion;
- Gate 5C implementation is closed at the source/available-environment boundary while live PayPal evidence remains separately classified;
- Gate 4 remains explicitly parked rather than falsely upgraded from source/configuration evidence;
- Firestore remains the durable application/domain authority despite the empty Supabase public schema;
- final security/recovery, traceability, and endorsement are still distinct from implementation/deployment progress.

These discrepancies are **evidence distinctions, not necessarily defects**. They should remain visible until the corresponding claim is advanced or formally closed.

## 10. Relationship to canonical documents

- `PRODUCT_LAW.md` — product and architecture authority.
- `MASTERPLAN.md` — chronological execution authority and release gate.
- `POLICY.md` / ORUCAVEAM — action authority and execution constitution.
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md` — cross-track state model.
- `backend/BACKEND_LIVE_SERVICE_STATUS.md` — current backend evidence boundary.
- `docs/BACKEND_FIRST_REBASELINE_GUARD.md` — backend-first sequence and authority bridge.
- `docs/project-guide/HandOver.md` / `Endorsement.md` — durable completion/acceptance loop.

When these disagree, do not silently choose the most optimistic status. Reconcile the authority chain and record the discrepancy.

## 11. Agent recovery instruction

> **Preserve the live truth before improving the implementation.**
>
> Repository history tells the story of what was committed. Connected runtime inspection tells what is actually deployed. Manual operator actions tell what may exist outside Agent visibility. Completion claims require the appropriate evidence boundary.
>
> Before changing backend or frontend architecture, reconcile all three.

**One next authorized action:** inspect the live backend, compare it with the current Masterplan and backend status, and document any material delta before making the next improvement.
