# TeamAi Firebase Backend Guide

## Role
Firebase is the TeamAi identity, application-state, and web-delivery foundation.

- Firebase Authentication: account identity and sign-in.
- Firestore database `default`: TeamAi application/domain state and durable state.
- Firebase Hosting: current primary static web host.

## In scope
Authentication, Firestore, Hosting, Security Rules, local Auth/Firestore emulation, and deployment configuration.

## Out of scope
Firebase Cloud Functions, Firebase Cloud Storage, and project-ZIP storage inside TeamAi web.

## Security baseline
Keep Firestore rules locked down by default. Expand access only for an explicitly modeled authenticated user/project/workspace boundary. Server-side privileged access must not be simulated by opening client rules. Durable task/event writes remain server-owned.

## Development flow
1. Keep `firebase.json`, `.firebaserc.example`, Firestore rules, and indexes in Git.
2. Develop and test Auth/Firestore behavior locally with the emulator.
3. Validate rules before deployment.
4. Deploy Hosting and Firestore configuration only from the authorized engineering path.
5. Record the project/environment identity without storing credentials in source.

## Artifact boundary
TeamAi web does not upload project ZIPs to Firebase. Project artifacts remain external and user-authorized.

## Current TEAM-BACKEND-001 status
The Firebase source configuration baseline is now wired. `firestore.rules` authenticates ownership by Firebase UID for the modeled account/workplace/project/team/seat hierarchy, permits observation of owned task/event state, and denies client writes to durable task/event evidence. `firestore.indexes.json` is intentionally empty until an observed query requires an index.

Live project identity, Auth/Firestore integration, emulator execution, rules verification, and deployment remain open evidence gates. No live deployment is implied by source configuration.
