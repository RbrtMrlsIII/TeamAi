# TeamAi Backend — Active Edge Function Census

> **Historical snapshot:** This census records the connected Supabase deployment observed on 2026-09-12. It is preserved for provenance and recovery only. The current deployment authority is `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-22.md`. Do not treat this file as the current live inventory.

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

## Historical freeze rule

This eight-function set was the active backend surface observed on 2026-09-12. Future changes must update the current 2026-09-22 census and canonical backend current-state record in the same governed change. This historical snapshot remains immutable evidence for its original observation.
