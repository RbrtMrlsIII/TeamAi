# Firebase Project Configuration

## Non-secret canonical configuration

- Firebase project ID: `teamai-7d20f`
- Firestore database ID: `default`
- Target plan posture: Spark-compatible
- Authentication: in scope
- Cloud Firestore: in scope
- Firebase Hosting: in scope
- Cloud Storage: out of scope
- Cloud Functions: out of scope

The Firebase web configuration contains a client API key. It is not treated as a server credential, but TeamAi should keep environment-specific client configuration in the appropriate frontend configuration surface rather than duplicating it across documentation. Server credentials must never be committed.

## Artifact boundary

TeamAi web does not host project-ZIP upload/download as a product feature. Artifact exchange occurs through manual GitHub setup, explicitly authorized external AI/Workplace execution, or the specific AI app's own retrieval mechanism.
