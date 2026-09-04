# Backend — Firebase Project Identity Skill

## WHEN TO USE
Use when a backend, hosting, authentication, or Firestore task depends on identifying the authoritative Firebase project.

## INPUT
Current Product Law identity invariant, repository Firebase configuration, runtime configuration, and target operation.

## AUTHORITY
The authoritative TeamAi Firebase project is `team-ai-official` under Product Law.

## ACTION
Check the configured Firebase project identity before diagnosis or mutation. Reconcile Firebase Auth, Firestore `(default)`, Hosting, Web SDK projectId, CLI target, and trusted runtime project identity where relevant.

## DO NOT
Do not infer the project from repository/product names, screenshots, historical artifacts, remembered context, or similarly named projects. Do not expose credentials.

## PASS
All affected Firebase surfaces resolve to the same authoritative project, or a documented stop condition is recorded.

## EVIDENCE
Record the resolved project identity and the configuration/runtime checks that support it.

## SEE ALSO
- `PRODUCT_LAW.md`
- `skills/execution/orucaveam/canonical-authority/SKILL.md`
- `skills/execution/orucaveam/verification/SKILL.md`
