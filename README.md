# TeamAi

## Durable Engineering Anchor

This repository is the **GitHub engineering source/review surface for TeamAi**. The canonical project package remains the synchronized project artifact; GitHub must not drift from it.

### Current gate

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

- 028 = frontend implementation blueprint.
- TEAM-BACKEND-001 = required backend foundation; implementation begins here before 029.
- 029 = production frontend implementation and remains on hold until the backend foundation passes.

Read `docs/BACKEND_FIRST_REBASELINE_GUARD.md` before changing backend architecture or 029.

### Backend authority

- Firebase Auth = identity authority.
- Firestore `default` = TeamAi durable domain/application state.
- Supabase Edge Functions = trusted server runtime and webhook boundary.
- PayPal = payment-provider authority.
- GitHub = engineering source/review surface.
- Vercel = future optional browser/deployment surface.
- Supabase Postgres = platform infrastructure only; not TeamAi domain state.

The retired relational backend implementation is not a supported TeamAi implementation path and is scheduled for final history purge after clean-baseline verification.

### Repository boundary

Only the TeamAi project belongs here. `HomeFinder-Official` is unrelated and must never be used as a TeamAi mirror or restoration target.

Canonical CI workflow: `.github/workflows/TeamAi.yml`

### Evidence rule

Planning, documentation, deployment, and isolated tests are not by themselves implementation proof. Completion requires the project's implementation-completion evidence protocol.

### Synchronization rule

The project package/rebaseline artifact and GitHub engineering tree are synchronization surfaces. Any divergence must be recorded and reconciled before the next implementation phase advances.
