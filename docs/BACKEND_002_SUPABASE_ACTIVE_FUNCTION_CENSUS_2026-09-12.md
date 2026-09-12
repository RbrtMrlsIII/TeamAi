# TeamAi Backend — Active Edge Function Census

Observed from the connected Supabase project on 2026-09-12.

This file is infrastructure evidence, not product roadmap or completion proof.

## Active surface

Supabase project: `TeamAi` (`srpgzzretfyqdsfclnuo`)

| Function | Status | Version | verify_jwt |
|---|---|---:|---|
| `teamai-commerce-intent` | ACTIVE | 19 | false |
| `teamai-domain-bootstrap` | ACTIVE | 22 | false |
| `teamai-github-oauth-bind` | ACTIVE | 8 | false |
| `teamai-github-webhook` | ACTIVE | 7 | false |
| `teamai-paypal-webhook-v5c` | ACTIVE | 21 | false |
| `teamai-seat-connection-test` | ACTIVE | 7 | false |
| `teamai-seat-provider-bind` | ACTIVE | 7 | false |
| `teamai-task-execute` | ACTIVE | 12 | false |

The obsolete `paypal-webhook` surface is no longer present in the connected Supabase inventory after operator deletion.

The `verify_jwt: false` setting is intentional for the active functions because each implements its own applicable Firebase ID-token, PayPal signature, or GitHub HMAC boundary.

The observed Supabase deployment metadata still contains inconsistent local checkout path shapes, including `TeamAi/TeamAi/` for several functions. This is deployment provenance evidence, not by itself proof of a runtime defect.

## Freeze rule

This eight-function set is the current active backend surface observed on 2026-09-12. Future additions, removals, renames, material restructurings, or reimplementations of Edge Functions must update this census and the canonical backend current-state record in the same governed change, while keeping implementation, deployment, runtime-proof, completion, and endorsement claims distinct.
