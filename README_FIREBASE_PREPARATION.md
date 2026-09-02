# Firebase preparation

TeamAi is prepared for a Firebase backend implementation path with the following hard constraints:

- Firebase project: `teamai-7d20f`
- Firestore database: `default`
- Firebase Authentication: in scope
- Firebase Hosting: in scope
- Cloud Firestore: in scope
- Firebase Cloud Storage: **out of scope**
- Cloud Functions: **out of scope**
- Firebase/App billing upgrade to Blaze: **not required by the baseline architecture**

TeamAi intentionally does **not** provide project ZIP upload inside the web app. Project artifacts are exchanged through manual GitHub setup, explicitly authorized AI-assisted external uploads (preferably via Workplace), or retrieval from the specific AI app named by the user in chat.

Start with:

- `docs/FIREBASE_MIGRATION_AND_CUTOVER_PLAN.md`
- `docs/FIREBASE_DOMAIN_MAPPING.md`
- `docs/FIREBASE_SETUP_CHECKLIST.md`
- `docs/PROJECT_ARTIFACT_EXCHANGE_AND_EXTERNAL_REPO_WORKFLOW.md`
- `firebase.json`
- `.firebaserc.example`
- `firestore.rules`
- `firestore.indexes.json`

The existing WoWSQL/PostgreSQL environment remains preserved as a legacy/evidence environment until a separately approved migration/import plan is executed.

Artifact UX contract: `docs/PROJECT_ARTIFACT_EXCHANGE_AND_EXTERNAL_REPO_WORKFLOW.md`
