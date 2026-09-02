# Project Artifact Exchange and External Repository Workflow

## Product boundary

TeamAi web does **not** provide project ZIP upload or a Firebase Storage-backed project-file feature. Project artifacts remain outside the TeamAi web application.

This is intentional: the TeamAi web surface focuses on authentication, workspace/project coordination, conversation, runtime visibility, and controlled links/intents. Large project artifacts are handled through an explicitly authorized external path.

## Canonical user experience

### A. Manual GitHub setup

The canonical guide may instruct the user to:

1. Create or select the user's own GitHub repository.
2. Upload/push the project from the user's local device using the user's GitHub credentials.
3. Connect the repository to the relevant AI/runtime only when the user explicitly authorizes that integration.
4. Keep the repository under the user's ownership and access controls.

TeamAi should provide clear, copyable setup guidance rather than silently uploading the user's repository.

### B. AI-assisted external upload

A user may explicitly ask an AI to upload a project outside the TeamAi web app. The preferred action surface is **Workplace**.

Before execution, record:

- source artifact/project identity;
- destination provider, repository, branch and path when applicable;
- user authorization and scope;
- AI seat/runtime used;
- overwrite/create behavior;
- checksum/version identity;
- result and any human intervention required.

No credential may be copied into TeamAi chat or durable project documents.

### C. Specific AI-app project ZIP retrieval

When a user names a specific AI application in chat and asks for that application's project ZIP, TeamAi may route the user to that AI application's supported artifact/retrieval surface.

The TeamAi web app should not proxy or persist the ZIP merely to make the handoff convenient. The response should preserve project identity and point to the authorized AI application/workplace/artifact reference.

## UX guarantees

- No surprise upload occurs from TeamAi web.
- User remains the explicit authority over the external destination.
- GitHub upload and external AI upload are distinguishable actions.
- Artifact provenance and version identity remain visible/auditable.
- TeamAi does not require Firebase Cloud Storage for project artifacts.
- The workflow remains compatible with Firebase Spark.

## Failure and recovery

If external upload fails, TeamAi records the failure and exact blocker without claiming completion. A retry must be bounded and idempotent where the external destination supports it.

If the destination cannot be reached or authorized, the user receives a human-intervention step rather than an implicit fallback to TeamAi-hosted storage.

## Canonical references

- `PRODUCT_LAW.md`
- `POLICY.md`
- `docs/FIREBASE_MIGRATION_AND_CUTOVER_PLAN.md`
- `docs/FIREBASE_SETUP_CHECKLIST.md`
- Workplace and GitHub integration contracts
