# Backend — Firestore Canonical State Skill

## WHEN TO USE
Use when reading, writing, validating, or reconciling TeamAi durable application/domain state in Cloud Firestore.

## INPUT
Canonical Firestore path, required fields, intended state transition, authenticated UID, and verification target.

## AUTHORITY
Cloud Firestore `(default)` is the TeamAi durable domain/application-state authority. Firebase UID is the domain ownership root.

## ACTION
Use the canonical account/workplace/project hierarchy and exact document paths. Perform only the required read/write. Validate ownership and rule constraints. Confirm important writes with authoritative read-back when the task requires persistence proof.

## DO NOT
Do not use Supabase Postgres as TeamAi domain state. Do not accept client-provided ownership identifiers as proof. Do not create a parallel Firestore root without reconciliation.

## PASS
The intended state exists at the canonical Firestore path under the authenticated UID and required rules/contracts are respected.

## EVIDENCE
Record the canonical path, operation, authenticated owner context, result, and read-back/verification evidence.

## SEE ALSO
- `PRODUCT_LAW.md`
- `src/backend/firestore-paths.ts`
- `firestore.rules`
- `skills/backend/firebase-project-identity/SKILL.md`
- `skills/tools/minimal-tool-usage/SKILL.md`
