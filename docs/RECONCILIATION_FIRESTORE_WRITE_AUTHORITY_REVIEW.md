# Firestore Write Authority Review

**Status:** REVIEW REQUIRED — NO RULE CHANGE IN THIS SLICE

## Observed implementation

Current Firestore rules permit a signed-in Firebase UID to read/write its own `accounts/{uid}` root and nested Workplace/Project/Team/Seat documents. Task and event documents are browser read-only.

## Why this is a brittleness item

The Product Law distinguishes user authority from TeamAi-managed durable state and requires browser surfaces not to become an alternative authority. Before frontend integration introduces browser persistence, each writable field must be classified.

## Required classification

For every writable document field, record one of:

- **User-owned configuration** — browser write may be appropriate under authenticated ownership and validation rules.
- **TeamAi-managed authoritative state** — browser must not self-attest; write through trusted backend/service path.
- **Derived/read model** — browser should not write; regenerate from canonical state.
- **External-provider state** — provider/external system remains source authority; TeamAi stores correlated state through trusted paths.

## Pass condition for a future rule change

A future Firestore-rules or persistence change may proceed only after the field-level ownership contract is explicit, the relevant canonical service/skill routing is updated, and verification demonstrates both permitted user configuration and blocked self-attestation of protected state.

This document deliberately does not weaken or broaden the current rules.
