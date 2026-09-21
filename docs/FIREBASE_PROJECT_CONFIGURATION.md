# Firebase Project Configuration

## Non-secret canonical configuration

- Firebase project ID: `teamai-7d20f`
- Firestore database ID: `default`
- Target plan posture: Spark-compatible
- Authentication: in scope
- Cloud Firestore: in scope
- Firebase Hosting: in scope
- Firebase Cloud Storage: out of scope for the current Spark-compatible Firebase baseline
- Cloud Functions: out of scope

The Firebase web configuration contains a client API key. It is not treated as a server credential, but TeamAi should keep environment-specific client configuration in the appropriate frontend configuration surface rather than duplicating it across documentation. Server credentials must never be committed.

## Artifact boundary

TeamAi web does not use Firebase Cloud Storage for project-ZIP upload/download. A separate planned TeamAi Storage facility may provide entitled user-content storage through the governed storage architecture; project-ZIP/artifact exchange remains on explicitly authorized external repository or AI-app paths unless a future product contract states otherwise.
