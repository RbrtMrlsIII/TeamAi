# PR #6 Scope

This branch establishes the backend-first rebaseline required before TEAM-EXPERIENCE-029 production frontend implementation.

Canonical sequence: `TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`.

It removes the retired relational backend from the active application path, installs the backend authority guard, adds Firestore/PayPal UID/Web AI skill/ToolKit/synchronization contracts, and keeps 029 on implementation hold.

No Firestore production runtime, privileged Edge-to-Firestore bridge, PayPal subscription transaction, commercial Button/Product/Plan flow, durable worker runtime, or end-to-end backend completion is claimed.

The final repository-history purge remains a separate destructive gate after clean-baseline preservation and verification.
