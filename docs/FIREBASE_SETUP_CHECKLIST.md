# Firebase Setup Checklist

## Current status

`TARGET PROJECT IDENTIFIED — SPARK-COMPATIBLE / NOT YET CONNECTED`

Target Firebase project: `teamai-7d20f`
Target Firestore database: `default`
Target deployment surface: **Firebase Hosting**

TeamAi intentionally avoids Firebase Cloud Storage and Cloud Functions. The current architecture is constrained to services usable without a Blaze upgrade.

### Human-controlled setup

- [x] Create/select TeamAi Firebase project.
- [x] Record target project ID: `teamai-7d20f`.
- [x] Use Firestore database ID: `default`.
- [ ] Enable Authentication providers required by TeamAi.
- [ ] Confirm Firestore database/region and production ownership path.
- [ ] Configure Firebase Hosting for the web application.
- [x] Keep Firebase Cloud Storage out of the TeamAi product architecture.
- [x] Keep Cloud Functions out of the TeamAi product architecture.
- [x] Do not require a Blaze upgrade for the baseline TeamAi architecture.

### Project/artifact workflow

- [ ] Add canonical manual GitHub setup guide for users who want their projects in GitHub.
- [ ] Add AI-assisted external repository upload flow, preferably through Workplace, with explicit destination authorization.
- [ ] Add per-AI-app project ZIP retrieval path when a user names/commands the relevant AI app in chat.
- [ ] Keep project ZIP upload/download out of the TeamAi web application.
- [ ] Define artifact provenance, ownership, permission, retention, and checksum rules for externally handled project ZIPs.

### Development validation

- [ ] Install/use Firebase CLI locally.
- [ ] Start Auth / Firestore emulators.
- [ ] Verify `.firebaserc` and `firebase.json` resolve correctly.
- [ ] Run Security Rules tests.
- [ ] Run repository/domain contract tests.
- [ ] Run TeamAi build/typecheck/tests.

### Cutover gates

- [ ] Firebase Auth integration implemented.
- [ ] Firestore domain adapter implemented.
- [ ] Security Rules reviewed.
- [ ] External TeamAi runtime boundary implemented without Cloud Functions.
- [ ] Durable task/turn/event behavior verified.
- [ ] Artifact exchange workflow verified outside the web app.
- [ ] Provider-compliance checks pass for each relevant integration.
- [ ] Existing WoWSQL records disposition approved.
- [ ] Rollback procedure tested/documented.
- [ ] Cutover checkpoint endorsed.
