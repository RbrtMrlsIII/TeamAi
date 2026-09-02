# Legacy PostgreSQL Backend — Quarantined

This directory documents the retired PostgreSQL application-backend path.

## Hard rule
PostgreSQL is **not** a TeamAi application system of record and must not be reintroduced as runtime authority.

Do not add `pg`, PostgreSQL pools, SQL repositories, `DATABASE_URL`, or PostgreSQL migrations to active runtime code; extend or resurrect the retired task scheduler/database repositories; treat WoWSQL as the current TeamAi backend; or copy legacy database code into new 029 implementation branches.

The retired implementation remains recoverable through Git history and canonical project archives for provenance and behavioral reference only.

## Current backend authority
Firebase Auth + Firestore (`default`) + Hosting, Supabase Edge Functions, optional entitlement-qualified Supabase Storage, GitHub, and PayPal.

## Re-entry gate
Any proposal to restore PostgreSQL requires an explicit product-architecture decision and a new endorsed backend-composition change. Normal implementation work must not bypass this gate.
