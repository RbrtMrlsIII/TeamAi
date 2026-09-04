# Backend — Firestore Canonical State Skill

## WHEN TO USE
Use when reading or writing TeamAi durable application/domain state.

## INPUT
Authenticated Firebase UID, canonical collection/document path, intended mutation, and evidence boundary.

## AUTHORITY
Firestore `(default)` is TeamAi durable domain-state authority. Presentation fields F0–F7 cannot become a second store.

## ACTION
Read and write only canonical domain paths. Preserve UID ownership. Do not persist theme-root or field-identity presentation state as domain truth.

## DO NOT
Do not store TeamAi domain state in Supabase Postgres, browser storage, or Vercel. Do not let F6 Status or F7 Modal write Firestore on mount.

## PASS
The mutation or read uses the canonical Firestore path and ownership rule.

## EVIDENCE
Record path, UID boundary, and read-back when required.

## SEE ALSO
- `docs/backend/FIRESTORE_DOMAIN_MODEL_V2.md`
- `skills/backend/authority-contract/SKILL.md`
