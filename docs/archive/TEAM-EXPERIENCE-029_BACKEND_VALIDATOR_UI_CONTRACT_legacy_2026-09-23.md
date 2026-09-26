# TEAM-EXPERIENCE-029 — Backend Validator UI Contract

**Field:** `field/frontend-backend-validator-ui-v1`  
**Status:** PRESENTATION CONTRACT  
**Boundary:** frontend validation/presentation only

## Purpose

Bind the approved backend execution-fact validator to a deterministic spatial-compatible UI surface before integrating those facts into the main Command Deck composition.

## UI contract

The surface presents these backend-owned facts without taking ownership of them:

- task identity;
- task status;
- approval state;
- assigned seat;
- provider identity;
- connection readiness;
- fact provenance (`backend` or `fixture`);
- validation result.

Validation state is expressed with text and the existing semantic status treatment; color is not the only signal.

## Authority boundary

The frontend does not:

- select the next task or seat;
- invoke a provider or tool;
- mutate task or scheduler state;
- write Firestore;
- grant or mutate entitlements;
- perform PayPal actions.

A fixture remains test/presentation input and is never treated as backend authority.

## Publication

The contract surface is static and compatible with the GitHub Pages spatial publication tree:

`/TeamAi/spatial/backend-validator-contract.html`

It is intentionally separate from `frontend/spatial/index.html` in this slice so the canonical Command Deck remains unchanged while the UI contract is verified independently.

## Next boundary

After browser verification, the contract may be bound into the existing Command Deck Working/F6 presentation surfaces. That integration must consume backend-owned facts read-only and retain the canonical F0–F7 composition rules.
