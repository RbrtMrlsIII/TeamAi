# PR #6 Scope

This branch establishes the backend-first rebaseline required before TEAM-EXPERIENCE-029 production frontend implementation.

## Canonical sequence

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## This branch does

- removes the retired relational backend from the active application path;
- removes its runtime/dependency/migration/test surfaces;
- replaces the old backend guard with a canonical backend-authority audit;
- records Firebase Auth, Firestore `default`, Supabase Edge Functions, PayPal, GitHub, and future Vercel roles;
- adds canonical Firestore, PayPal/UID, Web AI skill inheritance, ToolKit boundary, and synchronization contracts;
- keeps TEAM-BACKEND-001 planning-authorized and TEAM-EXPERIENCE-029 on implementation hold;
- preserves the requirement that exact project-package/GitHub parity be verified rather than assumed.

## Not implemented yet

No Firestore production domain runtime, privileged Edge-to-Firestore bridge, PayPal subscription transaction, commercial button/plan flow, durable worker runtime, or end-to-end backend completion is claimed by this branch.

## Final retirement gate

The clean replacement baseline must be independently preserved and verified before any destructive Git-history purge of the retired implementation.

## Validation

The local clean baseline passes the backend-authority structural audit. Full Node dependency installation/typecheck/test was not completed in the available runtime, so no broader completion claim is made here.
