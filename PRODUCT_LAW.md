# PRODUCT LAW — TeamAi Canonical Front Door

`PRODUCT_LAW.md` is the product authority and MUST NOT be overridden by implementation, UI, deployment, provider, or tool conventions. The synchronized project package contains the complete Product Law text during this reconciliation window; this repository file is the engineering-visible authority front door for agent recovery.

## Current execution authority
The current sequence is:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Core authority invariants
- Human user authority remains above AI authority.
- Firebase Auth owns identity and Firebase UID ownership.
- Firestore `default` owns TeamAi durable domain/application state.
- Supabase Edge Functions own trusted server execution and PayPal webhook receipt.
- PayPal is the external payment-event authority.
- GitHub is the engineering/source authority.
- Vercel is optional future browser/deployment infrastructure, not current TeamAi backend authority.
- Supabase Postgres is platform infrastructure only and is not the TeamAi domain/application database.
- Retired PostgreSQL implementation is historical-only and must not remain an active/recoverable TeamAi backend path.
- Web AI and Development AI are separate operational domains.
- Universal ToolKit is upstream-only: validated/generalized TeamAi lessons may flow upstream; ToolKit does not become TeamAi authority.

## LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE
Every implementation claim MUST be traceable from its governing Product Law and Masterplan execution item through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone MUST NOT be treated as implementation completion. A missing traceability link blocks the affected completion claim until an explicit, evidence-backed exception is recorded by the authorized human.

## LAW 102 — BACKEND AUTHORITY MUST BE EXECUTABLE
TeamAi backend implementation MUST encode its authority boundaries in executable contracts and verified transitions. Firebase Auth owns identity; Firestore `default` owns TeamAi domain/application state; Supabase Edge Functions own trusted server execution; PayPal owns payment-provider events. Frontend, cache, visual state, provider UI, and browser callbacks MUST NOT become alternate authorities.

## LAW 103 — DURABLE STATE PRECEDES TRUSTED EXECUTION
A privileged execution path MUST begin from durable, server-authorized TeamAi state and MUST produce durable result/event evidence. In-memory state, browser claims, transient callbacks, or an HTTP success response MUST NOT be treated as authoritative completion.

## LAW 104 — DOMAIN OWNERSHIP MUST BE TRACEABLE BY PATH
Every durable TeamAi record MUST resolve to its Firebase UID ownership boundary and, where applicable, Workplace and Project context. Backend path construction and authorization MUST prevent cross-Workplace access by construction rather than relying on UI discipline.

## Phase 0 disposition
Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the current execution gate before TEAM-BACKEND-001 implementation.

## TEAM-BACKEND-001 disposition
TEAM-BACKEND-001 is now IN IMPLEMENTATION. The first executable contract slice establishes service authority ownership, Firebase-UID-scoped Firestore path construction, deterministic effective-skill resolution, and durable task-state transitions. These are implementation evidence for their specific contracts only; they do not imply full backend completion.

The remaining foundation gates are live Firebase Auth/Firestore behavior, Workplace/seat persistence, Firestore rules/index validation, trusted Supabase Edge execution, PayPal correlation and webhook verification, durable commerce state, provider/runtime invocation, recovery/security verification, and complete traceability evidence.

## Canonical note
The complete Product Law remains in the synchronized project package and is not intentionally duplicated here during this reconciliation window. This front door MUST remain synchronized with any active authority changes.
