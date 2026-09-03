# TeamAi

Canonical source: GitHub `main`.

Product and execution authority: `PRODUCT_LAW.md` → `MASTERPLAN.md` → `AI_ASSISTANT_READ_ME.md`.

Current backend authority:
- Firebase Auth: identity / Firebase UID ownership.
- Firestore `(default)`: TeamAi durable application/domain state.
- Supabase Edge Functions: trusted server execution and PayPal webhook boundary.
- PayPal: external payment-event authority.
- GitHub: engineering/source authority.
- Firebase Hosting: current web delivery.
- Vercel: browser-verification surface only; not TeamAi hosting, backend, or production deployment authority.
- Supabase Postgres: platform infrastructure only, never TeamAi domain state.

Implementation completion must be traceable from governing authority through contract, implementation, verification evidence, and endorsement.
