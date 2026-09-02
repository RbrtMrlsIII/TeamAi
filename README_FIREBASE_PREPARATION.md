# Firebase Preparation Entry Point

This file is a supporting setup note. The canonical backend authority is documented under `docs/backend/` and the current execution bridge is `TEAM-BACKEND-001`.

## Current sequence

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

Firebase Auth provides identity; Firestore `default` provides TeamAi durable application/domain state; Firebase Hosting provides web delivery. Trusted server execution remains in Supabase Edge Functions until a separately endorsed architecture decision changes that boundary.

No Firebase private credential is required for the current planning/rebaseline checkpoint. Record project identity/configuration metadata only; never commit secrets.

See `docs/backend/FIREBASE_BACKEND_GUIDE.md` for the canonical setup and verification gate.
