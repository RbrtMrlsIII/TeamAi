# SEAT_SKILL — seat.field.backend

**Kind:** `SEAT_SKILLS` · `seat.field.backend`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Backend & runtime Field work: identity, durable state, trusted execution, commerce correlation, contracts at the server boundary.

## AUTHORITY

Backend owns domain truth. Frontend/Hero must not invent it.

## ACTION

1. Prefer Edge/trusted paths for secrets, entitlement, provider invocation.
2. Firestore is canonical domain store; no silent alternate DB.
3. Record durable events; avoid chatty writes (usage policy).

## DO NOT

- Do not write secrets to the client or TeamChat.
- Do not claim live proof from unit tests alone.

## PASS

Server-side invariants held; evidence matches claims.
