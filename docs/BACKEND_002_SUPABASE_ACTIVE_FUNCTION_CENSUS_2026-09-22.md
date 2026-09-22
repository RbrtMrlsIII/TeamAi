# TeamAi Backend — Active Edge Function Census

Observed from the connected Supabase project on 2026-09-22.

This file is infrastructure evidence, not product roadmap or completion proof.

## Active surface

Supabase project: `TeamAi` (`srpgzzretfyqdsfclnuo`)

| Function | Status | Version | verify_jwt |
|---|---|---:|---|
| `teamai-commerce-intent` | ACTIVE | 19 | false |
| `teamai-domain-bootstrap` | ACTIVE | 22 | false |
| `teamai-github-oauth-bind` | ACTIVE | 9 | false |
| `teamai-github-webhook` | ACTIVE | 7 | false |
| `teamai-paypal-webhook-v5c` | ACTIVE | 21 | false |
| `teamai-seat-connection-test` | ACTIVE | 8 | false |
| `teamai-seat-provider-bind` | ACTIVE | 8 | false |
| `teamai-seat-budget-settings` | ACTIVE | 1 | false |
| `teamai-task-continuation-request` | ACTIVE | 2 | false |
| `teamai-task-execute` | ACTIVE | 12 | false |

The obsolete `paypal-webhook` surface is absent from the connected Supabase inventory.

The repository `verify_jwt: false` setting is not itself an authentication bypass. Each TeamAi Edge surface supplies its applicable Firebase ID-token, PayPal signature, or GitHub HMAC boundary.

The connected deployment metadata still contains inconsistent local checkout path shapes for some functions, including `TeamAi/TeamAi/`. This remains deployment-provenance evidence and is not independently treated as a runtime defect.

## Non-deployed repository surfaces

- `teamai-seat-budget-runtime` exists in the repository but is not present in the live Supabase inventory as of this observation.
- The repository real-provider implementation of `teamai-task-execute` is not the live v12 runtime. Production still exposes the historical v12 stub until the controlled promotion gate is satisfied.

## Freeze rule

This 2026-09-22 set is the current connected deployment observation. Future additions, removals, renames, material restructurings, or reimplementations of Edge Functions must update this current census and the canonical backend current-state record in the same governed change, while keeping implementation, deployment, runtime-proof, completion, and endorsement claims distinct.

The prior `BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md` remains preserved as a historical infrastructure snapshot and is not a current inventory authority.
