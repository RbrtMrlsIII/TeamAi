# Backend — Supabase Edge Runtime Skill

## WHEN TO USE
Use when implementing or verifying trusted TeamAi server execution in Supabase Edge Functions.

## INPUT
Authorized backend operation, verified Firebase identity context, canonical Firestore state path, required secrets, and expected durable result.

## AUTHORITY
Supabase Edge Functions provide trusted server execution. They are not the TeamAi domain-state authority.

## ACTION
Verify the request identity at the trusted boundary, execute only the authorized server operation, use required server-side secrets without exposing them, persist TeamAi domain state to canonical Firestore, and preserve idempotency where required.

## DO NOT
Do not move TeamAi durable state into Supabase Postgres. Do not trust browser-attested identity or payment state. Do not expose service-account credentials.

## PASS
Trusted execution occurs within the authorized Edge Function boundary and the expected canonical durable state/result is produced.

## EVIDENCE
Record trusted execution result, canonical Firestore verification, idempotency evidence, and environment limitations.

## SEE ALSO
- `PRODUCT_LAW.md`
- `supabase/functions/`
- `skills/backend/firestore-canonical-state/SKILL.md`
- `skills/execution/orucaveam/canonical-authority/SKILL.md`
