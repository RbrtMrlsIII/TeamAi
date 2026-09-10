# TEAM-BACKEND-001 — Live Service Status

**Date:** 2026-09-10  
**Phase:** TEAM-BACKEND-001  
**Status:** IN IMPLEMENTATION — bounded runtime slices are live; final evidence/endorsement remains open

## Boundary state

| Boundary | Source contract | Live evidence | Status |
|---|---|---|---|
| Firebase Auth | UID ownership contract | Live Edge paths verify Firebase ID tokens and derive UID from verified claims | PASS for exercised slices |
| Firestore `default` | UID-rooted paths + rules baseline | Gate-3 authenticated persistence, independent reads, and idempotency are evidenced | RUNTIME-PROVEN for bounded slices |
| Supabase Edge Functions | Trusted runtime/webhook boundary | TeamAi Supabase project is ACTIVE_HEALTHY and multiple TeamAi Edge Functions are deployed | DEPLOYED; claim-level evidence varies by function |
| PayPal | External event authority | Server-owned correlation + webhook implementation present; live sandbox transaction/webhook proof still open | IMPLEMENTED / RUNTIME EVIDENCE OPEN |
| GitHub | Engineering authority | `main` remains current source authority | PASS |
| Firebase Hosting | TeamAi web delivery | Product Law keeps Firebase Hosting as delivery authority | PASS |
| Vercel | Non-authoritative preview/browser-verification only | Historical cutoff remains non-architectural; GitHub Actions + Playwright remain path | PARKED / NOT A RELEASE BLOCKER |

## Live Supabase cross-check — 2026-09-10

The connected Supabase project **TeamAi** (`srpgzzretfyqdsfclnuo`) is `ACTIVE_HEALTHY`.

Currently deployed Edge Functions include:

- `teamai-domain-bootstrap` v18
- `teamai-commerce-intent` v15
- `paypal-webhook` v15
- `teamai-paypal-webhook-v5c` v17
- `teamai-task-execute` v8
- `teamai-github-webhook` v3
- `teamai-github-oauth-bind` v4
- `teamai-seat-connection-test` v3
- `teamai-seat-provider-bind` v3

Important evidence distinction: deployment inventory proves that these runtimes exist in the live Supabase project. It does **not** by itself prove every function's complete end-to-end behavior, product acceptance, or runtime-proven status.

`teamai-task-execute` is live but its current provider stage is explicitly `stub-edge-runtime`. This confirms the trusted authenticated task → lease → durable-result path is live, while real external provider invocation remains a separate open Masterplan item.

`teamai-github-oauth-bind` is live. Its GET redirect page is intentionally presentation-only; its authenticated POST binds verified Firebase UID to a GitHub installation id in Firestore. This is a deployed Conn-3 infrastructure surface, but not proof of Hero live binding or final 029 acceptance.

The Supabase **public schema currently has no tables**, which matches the TeamAi architecture rule that Firestore `(default)` is the durable application/domain store while Supabase supplies trusted Edge execution and webhook infrastructure.

## Why backend stopped

The backend stopped at a **verification / live-external / final-governance frontier**, not because its foundational implementation disappeared.

1. **Gate 4** remains parked because emulator-capable Firebase rules execution was unavailable in the prior environment. The reproducible harness exists, but no emulator PASS is inferred.
2. **Gate 5B** is source-contract PASS. Live payment evidence is not inferred.
3. **Gate 5C** implementation and available-environment verification are complete. Final authenticated PayPal transaction/webhook runtime and replay evidence remain open.
4. **Provider runtime invocation** is deliberately not the same thing as `teamai-task-execute`: the live function currently uses `stub-edge-runtime` and must not be represented as a real provider integration.
5. **Security/failure/timeout/cancellation/recovery verification** remains open as a broader evidence matrix.
6. **Traceability and final endorsement** remain open.

This boundary is recorded so future agents do not restart completed infrastructure or pull provider/runtime work into the 3D presentation track prematurely.

## Required evidence distinction

`source implementation ≠ deployment ≠ integration ≠ runtime proof ≠ completion ≠ endorsement`

The current repository and live Supabase deployment therefore support a layered state model rather than a single “backend done/not done” flag.

## Operator / manual setup visibility

Some backend progress is intentionally completed through the human operator because it crosses external provider dashboards, secrets, account authorization, sandbox payment interaction, or other user-owned boundaries. These actions may not be visible to an ordinary repository-only Agent.

The durable bridge for this hidden-state problem is `docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md`, which records the relationship between repository intent, operator action, connected-runtime observation, evidence class, owner, stopping boundary, and the next authorized evidence action.

Before performing a major backend refactor or cleanup that could obscure a live/manual setup, preserve the observed state in that ledger first.

## Next backend continuation

The current backend continuation should follow the existing Masterplan and evidence constraints:

- obtain the remaining live PayPal sandbox transaction/webhook evidence;
- directly verify the resulting Firestore commerce state and replay/idempotency expectations;
- complete the remaining security/recovery matrix that requires live proof;
- reconcile Product Law → Masterplan → skill → implementation → evidence;
- record HandOver / Endorsement only when the corresponding completion criteria are actually met.

Do not start real provider invocation merely because `teamai-task-execute` is deployed. That function remains a bounded stub-runtime proof until the provider/runtime contract and authorization/task foundations are explicitly closed.

## Relation to 029 spatial work

3D Hero presentation may continue on its own bounded spatial gates. It must consume backend capability/read-model contracts without becoming backend authority.

Conversely, backend verification may advance without waiting for 3D color/material polish.

The shared boundary is explicit:

```text
3D representation
      │
      │ presentation/read-model contract
      ▼
trusted backend authority
      │
      ├─ identity
      ├─ authorization
      ├─ durable state
      ├─ scheduler/task control
      └─ provider/commercial runtime
```

No release claim should be drawn across this boundary from a green test, deployed function, or visual result alone.
