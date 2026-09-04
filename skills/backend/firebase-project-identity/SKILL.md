# Backend — Firebase Project Identity Skill

## WHEN TO USE
Use when confirming or changing which Firebase project, app, or hosting target TeamAi is bound to.

## INPUT
Current Firebase project identity documents, environment configuration, and the intended backend/Masterplan item.

## AUTHORITY
The authoritative Firebase project is `team-ai-official` unless Product Law is explicitly amended. UI theme roots and F0–F7 fields do not select the Firebase project.

## ACTION
Confirm project identity before changing Auth, Firestore, Hosting, or related configuration. Reject silent fallback to another Firebase project.

## DO NOT
Do not infer project identity from a Vercel preview, a local `.firebaserc` guess, or a UI field number.

## PASS
The intended Firebase project is named and used.

## EVIDENCE
Record project id, config path, and verification.

## SEE ALSO
- `docs/backend/FIREBASE_PROJECT_IDENTITY.md`
- `PRODUCT_LAW.md`
- `skills/backend/authority-contract/SKILL.md`
