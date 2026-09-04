# Backend — Supabase Edge Runtime Skill

## WHEN TO USE
Use when implementing or verifying trusted server execution on Supabase Edge Functions, including PayPal webhook receipt.

## INPUT
Function name, trusted-boundary contract, secrets/config requirements, and verification target.

## AUTHORITY
Supabase Edge Functions are the trusted server runtime. They are not TeamAi domain-state authority. UI fields are not a trusted runtime.

## ACTION
Keep trusted operations on the Edge Function boundary. Preserve webhook authenticity and idempotency controls.

## DO NOT
Do not move trusted execution into the browser, a Vercel preview, or an F7 Modal handler.

## PASS
Trusted operations remain on the Edge Function and reject unauthorized callers.

## EVIDENCE
Record function path, contract check, and runtime result when available.

## SEE ALSO
- `skills/backend/commerce-paypal/SKILL.md`
- `skills/backend/authority-contract/SKILL.md`
