# TEAM-EXPERIENCE-029 Status

## Current foundation gate

TEAM-EXPERIENCE-029 is the implementation phase following the 014–028 experience/design checkpoints.

## Backend foundation decision

The active application backend is Firebase Auth + Firestore (`default`) + Firebase Hosting, with Supabase Edge Functions as the trusted server runtime, optional entitlement-qualified Supabase Storage for user content, GitHub as the engineering repository/workstation surface, and PayPal as the external payment rail.

Supabase Postgres is platform infrastructure only and is not the TeamAi domain system of record.

## PostgreSQL quarantine

The retired PostgreSQL application runtime has been removed from the active source surface on this feature branch: database pool/repositories, migration runner and active migrations, PostgreSQL conversation store, PostgreSQL task scheduler, PostgreSQL integration tests, and compatibility shims.

Historical PostgreSQL/WoWSQL material remains recoverable from Git history and canonical archives. It must not be copied back into active runtime without an explicit backend-composition decision and endorsed re-entry gate.

A CI audit now fails when PostgreSQL runtime markers are found in active source/package/migration surfaces.

## Next implementation gate

The next 029 implementation work may build a storage-neutral task/event contract and Firestore-backed persistence, followed by Supabase Edge Function worker execution. It must not reintroduce PostgreSQL as a shortcut.
