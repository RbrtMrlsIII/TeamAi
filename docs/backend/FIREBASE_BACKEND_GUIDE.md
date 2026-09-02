# TeamAi Firebase Backend Guide

## Canonical role
Firebase provides TeamAi identity, durable application state, and web delivery.

- Firebase Authentication: account identity and sign-in.
- Firestore database `default`: TeamAi application/domain state and durable state.
- Firebase Hosting: current primary static web host.

## In scope
Authentication, Firestore, Hosting, Security Rules, local Auth/Firestore emulation, and deployment configuration.

## Out of scope
Firebase Cloud Functions, Firebase Cloud Storage, and project-ZIP storage inside TeamAi web.

## Security baseline
Keep Firestore rules locked down by default. Open only explicitly modeled authenticated user/project/workspace paths. Server-side privilege must never be simulated by opening client rules.

## Setup sequence
1. Confirm the TeamAi Firebase project identity.
2. Configure Authentication providers required by the product.
3. Keep Firestore database `default` and its rules/indexes under canonical project control.
4. Validate rules using the emulator before production deployment.
5. Configure Firebase Hosting for the intended web output.
6. Record environment/project identity, never credentials.

## Artifact boundary
TeamAi web does not upload project ZIPs to Firebase. Large project artifacts remain external and explicitly authorized.

## Verification gate
Auth works, Firestore rules pass, Hosting serves the intended build, and no Storage/Cloud Functions dependency has been introduced accidentally.
