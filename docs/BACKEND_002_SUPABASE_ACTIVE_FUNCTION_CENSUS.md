# TeamAi Backend — Active Supabase Edge Function Census

**Observed:** 2026-09-12 21:45 +08:00  
**Supabase project:** `TeamAi` (`srpgzzretfyqdsfclnuo`)  
**Active function count:** **8**

This document is the current infrastructure census for the TeamAi Supabase Edge Function surface. It is a live-state record, not a product roadmap, completion claim, or release approval.

## Frozen active surface

| Function | Status | Version | `verify_jwt` | Primary responsibility | Current maturity boundary |
|---|---|---:|---|---|---|
| `teamai-commerce-intent` | ACTIVE | 19 | false | server-owned pending commerce intent | live function; bounded commerce contract |
| `teamai-domain-bootstrap` | ACTIVE | 22 | false | idempotent account/workplace/project/team/seat bootstrap | live authenticated domain bootstrap |
| `teamai-github-oauth-bind` | ACTIVE | 8 | false | GitHub OAuth/install binding | live binding infrastructure; not Hero live bind proof |
| `teamai-github-webhook` | ACTIVE | 7 | false | GitHub App webhook receipt and UID lookup | live webhook infrastructure; not Hero live bind proof |
| `teamai-paypal-webhook-v5c` | ACTIVE | 21 | false | canonical PayPal webhook verification and commerce projection | live webhook; 16 event mappings currently implemented |
| `teamai-seat-connection-test` | ACTIVE | 7 | false | provider connectivity/health test for a seat | deployed connection surface; frontend exercise/proof remains bounded |
| `teamai-seat-provider-bind` | ACTIVE | 7 | false | encrypted provider-key binding for a seat | deployed credential-binding surface; product completion remains bounded |
| `teamai-task-execute` | ACTIVE | 12 | false | authenticated task lease and execution boundary | provider stage remains `stub-edge-runtime` |

## Removed legacy surface

`paypal-webhook` was manually removed from the connected Supabase project before this census was captured. It is therefore **not part of the frozen active surface**.

Its historical source and prior deployment references remain preserved only where required for forensic continuity. Historical references must not be interpreted as a current deployed function.

## Backend topology

```text
Firebase Auth
      ↓
TeamAi Edge Functions
      ↓
Firestore (default) ← durable TeamAi domain state
      ↕
PayPal / GitHub / configured AI-provider boundaries
```

Supabase Postgres is infrastructure for the platform and is not TeamAi's durable application/domain datastore.

## Claim boundaries

`source implementation ≠ deployed function ≠ runtime proof ≠ completed capability ≠ endorsement`

The active status above is direct connected-Supabase infrastructure evidence. It does not prove every endpoint has complete product integration, that every provider lifecycle is implemented, or that the 029 product release is ready.

The deployed `verify_jwt: false` setting is intentional for this surface. Each active function is responsible for its applicable authentication or authenticity boundary, including Firebase ID-token verification, PayPal webhook signature verification, or GitHub webhook authenticity checks.

## Freeze/update rule

Any future Edge Function **addition, removal, rename, material restructuring, reimplementation, deployment replacement, or responsibility change** must reconcile this census in the same governed change as the relevant backend current-state documentation. A connected-runtime change must be recorded as observed infrastructure evidence before repository claims are advanced.

Version numbers and deployment metadata are snapshots. A later live inspection may supersede them. Historical snapshots must be preserved rather than rewritten to appear current.
