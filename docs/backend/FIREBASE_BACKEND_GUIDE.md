# TeamAi Firebase Backend Guide

## Canonical role
Firebase provides TeamAi identity, durable application state, and current web delivery.

- Firebase Authentication: account identity and sign-in.
- Firestore database `default`: TeamAi application/domain state and durable state.
- Firebase Hosting: web delivery.

## In scope
Authentication, Firestore, Hosting, Security Rules, local Auth/Firestore emulation, and deployment configuration.

## Out of scope for this phase
Firebase Cloud Functions and Firebase-hosted application storage. The trusted server boundary remains Supabase Edge Functions; a future cloud-runtime migration may be considered only through a new architecture decision.

## Security baseline
Keep Firestore rules locked down by default. Open only explicitly modeled authenticated user/workplace paths. Server-side privilege must never be simulated by opening client rules.

## Setup sequence
1. Confirm the TeamAi Firebase project identity.
2. Configure the authentication providers required by the product.
3. Keep Firestore database `default` and its rules/indexes under canonical project control.
4. Validate rules using the emulator before production deployment.
5. Configure Firebase Hosting for the intended web output.
6. Record environment/project identity, never credentials.

## Verification gate
Auth works, Firestore rules pass, Hosting serves the intended build, and no accidental second authority has been introduced.
