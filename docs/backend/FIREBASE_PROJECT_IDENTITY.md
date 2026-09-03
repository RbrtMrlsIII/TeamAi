# TeamAi Firebase Project Identity Contract

**Status:** CANONICAL / FROZEN for the current TeamAi backend architecture

## Authoritative TeamAi Firebase project

The current TeamAi Firebase project is:

- **Project ID:** `team-ai-official`
- **Auth domain:** `team-ai-official.firebaseapp.com`
- **Storage bucket identifier:** `team-ai-official.firebasestorage.app`
- **Messaging sender ID:** `836576751144`
- **Web App ID:** `1:836576751144:web:ddd9d5d2180ae4fcd84f1d`
- **Measurement ID:** `G-QJJ0JXMEEJ`

The Firebase Web SDK configuration is public client configuration and is useful for identifying the intended Firebase project. It is **not** an Admin SDK credential and must never be substituted for the server-side service-account credential.

## Project identity hard rules

1. **Project identity is an explicit configuration invariant.** Never infer a Firebase project from a product name, repository name, screenshot title, remembered context, or a similarly named project.
2. **`team-ai-official` is the TeamAi Firebase authority.** `homefinder-official` and any other Firebase project are non-authoritative unless a future architecture change explicitly replaces this project and updates this contract first.
3. **Every Firebase environment reference must reconcile to the same project identity.** Firebase Auth, Firestore `(default)`, Hosting, Web SDK configuration, CLI target, service-account `project_id`, and trusted Edge-runtime Firebase configuration must not silently point at different projects.
4. **The service-account `project_id` is a server-side identity check.** The `FIREBASE_SERVICE_ACCOUNT_JSON` secret used by trusted Edge Functions must belong to `team-ai-official`. Never expose its private key or JSON in chat, source, logs, screenshots, or documentation.
5. **The browser must not establish backend authority.** A public Web SDK config identifies the client project but does not authorize privileged Firestore writes, payment ownership, or trusted execution.
6. **Deleted or retired projects are not fallback targets.** If a project is deleted, its historical screenshots, tokens, credentials, or documentation must not be used to infer or restore current authority.
7. **Similarly named projects are treated as distinct identities.** `team-ai-official` and `homefinder-official` must never be merged, treated as aliases, or selected interchangeably.
8. **Ambiguity is a blocker, not a guess.** If project identity conflicts across artifacts, stop the affected deployment/verification and reconcile the authoritative project identity before proceeding.
9. **Identity reconciliation precedes persistence debugging.** Never diagnose a Firebase/Firestore runtime failure until the target Firebase project identity has been explicitly verified.
10. **Project identity changes require architecture-level reconciliation.** A future replacement must update this contract, Product Law, Masterplan, AI recovery guide, deployment configuration, secrets, and verification evidence before the new project can become authoritative.

## Required reconciliation before a live backend test

Verify, without exposing secrets:

- Firebase Console project ID is `team-ai-official`.
- Firebase Auth is enabled in `team-ai-official`.
- Firestore database `(default)` exists in `team-ai-official`.
- Firestore Rules are deployed to `team-ai-official`.
- The Firebase CLI target is `team-ai-official`.
- The Web SDK `projectId` is `team-ai-official`.
- The trusted Edge Function service-account `project_id` belongs to `team-ai-official`.
- The Supabase Edge Function is deployed in the canonical TeamAi Supabase project `srpgzzretfyqdsfclnuo`.

## Evidence interpretation

A screenshot, SDK snippet, CLI session, service-account record, or deployed function is evidence of only the fact it directly demonstrates. It must not be generalized to another Firebase project.

When evidence conflicts:

`current authoritative project configuration → current deployment/secret metadata → current verification evidence → historical artifacts`

Historical artifacts remain useful for provenance but cannot override current authority.

## Recovery instruction for AI participants

Before modifying Firebase-dependent code or asking a human to repeat a Firebase test:

1. Read this contract.
2. Compare the target project ID against the current Firebase configuration.
3. Confirm that no similarly named project has been substituted.
4. Confirm that the trusted service-account identity is intended for the same project without requesting or exposing its secret value.
5. Only then proceed to runtime diagnosis.

**Core rule:** one product may have many historical environments, but only one explicitly designated Firebase project is authoritative at a given architecture checkpoint.