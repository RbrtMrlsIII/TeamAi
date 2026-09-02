# Firebase Setup Checklist

## Current status

`NOT YET CONNECTED`

### Human-controlled setup

- [ ] Create/select TeamAi Firebase project.
- [ ] Record Firebase project ID locally in `.firebaserc`.
- [ ] Enable required Authentication providers.
- [ ] Create Firestore database in the intended region.
- [ ] Create Cloud Storage bucket.
- [ ] Enable Cloud Functions / required Google Cloud APIs.
- [ ] Confirm billing/plan implications before scheduled functions or production deployment.
- [ ] Establish the production security/contact ownership path.

### Development validation

- [ ] Install/use Firebase CLI locally.
- [ ] Start Auth / Firestore / Functions / Storage emulators as applicable.
- [ ] Verify `.firebaserc` and `firebase.json` resolve correctly.
- [ ] Run rules tests.
- [ ] Run repository contract tests.
- [ ] Run TeamAi build/typecheck/tests.

### Cutover gates

- [ ] Firebase adapter implemented.
- [ ] Security Rules reviewed.
- [ ] Audit/event durability verified.
- [ ] Scheduler idempotency verified.
- [ ] Storage/retention policy verified.
- [ ] Provider-compliance checks pass for each relevant integration.
- [ ] Existing WoWSQL records disposition approved.
- [ ] Rollback procedure tested/documented.
- [ ] Cutover checkpoint endorsed.
