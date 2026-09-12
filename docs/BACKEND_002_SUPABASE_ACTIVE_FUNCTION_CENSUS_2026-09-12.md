# TEAM-BACKEND-002 — Supabase Active Edge Function Census

**Observed:** 2026-09-12

This file records the connected Supabase project inventory as an infrastructure evidence snapshot. It is not a product roadmap and does not establish end-to-end completion.

## Project

- Supabase project: `TeamAi`
- Project ref: `srpgzzretfyqdsfclnuo`
- Active TeamAi Edge Functions observed: **8**

## Active functions

| Function | Supabase status | Version observed | `verify_jwt` | Purpose |
|---|---:|---:|---:|---|
| `teamai-commerce-intent` | ACTIVE | 19 | false | Creates server-owned commerce intents from verified Firebase identity |
| `teamai-domain-bootstrap` | ACTIVE | 22 | false | Idempotent account/workplace/project/team/seat bootstrap |
| `teamai-github-oauth-bind` | ACTIVE | 8 | false | GitHub install/OAuth binding to Firebase UID |
| `teamai-github-webhook` | ACTIVE | 7 | false | GitHub App webhook receipt and UID lookup |
| `teamai-paypal-webhook-v5c` | ACTIVE | 21 | false | Canonical PayPal webhook and commerce-event projection |
| `teamai-seat-connection-test` | ACTIVE | 7 | false | Provider connection/health testing |
| `teamai-seat-provider-bind` | ACTIVE | 7 | false | Provider credential binding/storage |
| `teamai-task-execute` | ACTIVE | 12 | false | Authenticated task lease/execution path; provider stage remains `stub-edge-runtime` |

## Retirement observation

The legacy `paypal-webhook` surface is no longer present in the connected Supabase Edge Function inventory after operator deletion. The canonical PayPal endpoint is `teamai-paypal-webhook-v5c`.

## Security interpretation

`verify_jwt: false` is intentional for the current functions because authentication/signature verification is implemented by the function itself according to its boundary (Firebase ID token, PayPal signature, or GitHub HMAC). This census does not by itself prove every downstream security property.

## Entrypoint-path observation

The live inventory still reports doubled local checkout paths such as `TeamAi/TeamAi/` for `teamai-task-execute` and the GitHub/seat functions, while other functions report a single repository path or a temporary source path. This is deployment provenance data. It is not by itself proof of runtime failure.

## Freeze boundary

This is the current eight-function active surface observed on 2026-09-12. Any future add, remove, rename, material restructuring, or reimplementation of a deployed Edge Function must update the appropriate backend current-state record and this census in the same governed change, with verification matched to the exact claim.
