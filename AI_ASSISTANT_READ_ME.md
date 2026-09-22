# AI_ASSISTANT_READ_ME — current session boundary

## SESSION SNAPSHOT

- Last given prompt: continue Issue #396 after reviewed PR #398 merged; production-data/runtime evidence is now the active successor vehicle.
- #398 merged as the reviewed structural baseline at merge commit 87f466fb0edac3784280128785a8fd2dc757e749.
- main baseline: 87f466fb0edac3784280128785a8fd2dc757e749
- current slice: production Firestore evidence and runtime/security continuation
- replacement branch: backend/030-production-runtime-evidence
- open implementation vehicle: successor Draft PR for production Firestore evidence/runtime continuation
- validation state: #398 exact-head Governance, Full-System, Security, and Browser validators were green on 08115e507b4999966b753e3e4e3c8e035e9db163 and Tenaj36 approved that exact head.
- live production boundary: Firebase Firestore (default) remains the durable TeamAi domain authority. The successor workflow creates additive run-scoped diagnostic evidence only and does not mutate canonical Seat or Connection documents.
