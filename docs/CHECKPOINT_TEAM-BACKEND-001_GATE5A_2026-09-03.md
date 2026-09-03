# CHECKPOINT — TEAM-BACKEND-001 GATE 5A

Date: 2026-09-03
Status: `GATE 5A — CANONICAL COMMERCE CONTRACT RECORDED; LIVE COMMERCE NOT YET VERIFIED`

## Purpose
Establish the smallest durable commerce contract before PayPal webhook execution or commercial UI activation.

## Authority
- PayPal remains the external payment-event authority.
- Supabase Edge Functions remain the trusted server execution/webhook boundary.
- Firebase Auth supplies the authenticated Firebase UID ownership root.
- Firestore `(default)` remains the TeamAi durable application/domain system of record.
- Browser UI, Firebase Hosting, and Vercel verification are non-authoritative for payment, entitlement, or durable commerce state.

## Contract implemented
`src/backend/commerce.ts` defines:
- PayPal as the current commerce provider;
- stable provider event identity;
- idempotency identity;
- server-owned Firebase UID correlation;
- durable commerce event shape;
- entitlement projection shape;
- UID-rooted Firestore commerce paths.

`tests/commerce-contract.test.mjs` covers the correlation and UID-root invariants.

## Explicit boundary
This gate does NOT claim:
- live PayPal Sandbox configuration;
- webhook signature verification;
- PayPal event ingestion;
- replay protection against real provider deliveries;
- durable Firestore commerce mutation in production;
- entitlement activation from a real payment;
- commercial button/plan activation.

Those remain later Gate-5 commerce execution gates.

## Gate 4 disposition
Firebase Emulator / Security Rules execution remains `BLOCKED/PARKED` because the current execution environment cannot run/install the Firebase CLI. The reproducible Gate-4 harness remains preserved.

## Handover rule
This checkpoint is accompanied by the target-project Gate-5A handover packet. ToolKit is not the handover owner.
