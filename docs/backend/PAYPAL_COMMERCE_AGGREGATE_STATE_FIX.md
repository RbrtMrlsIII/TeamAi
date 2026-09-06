# PayPal Commerce Aggregate State Fix

## Finding

A live PayPal Sandbox `PAYMENT.CAPTURE.COMPLETED` webhook reached `teamai-paypal-webhook-v5c` on deployment v12 and returned HTTP 200. The canonical commerce event was persisted and the entitlement projection became `active`, but the parent commerce aggregate remained `pending`.

## Correction

The isolated v5c handler now derives an `aggregateStatus` from supported commerce events and patches the canonical aggregate document after the event is created. For successful payment events, the aggregate transitions to `completed`.

The aggregate patch is intentionally performed before the duplicate-event early return. This allows a safe webhook redelivery to repair an aggregate whose event record already exists without creating a second event.

## Boundary

This change remains isolated to `teamai-paypal-webhook-v5c`. The canonical `paypal-webhook` function is not redeployed or cut over by this change.

## Verification requirement

A subsequent real PayPal Sandbox payment must prove all of the following together:

- PayPal capture is `COMPLETED`.
- PayPal delivers the signed webhook to v5c with HTTP 200.
- The canonical commerce event is persisted.
- The entitlement is `active`.
- The parent commerce aggregate is `completed`.

No claim of post-fix runtime completion is made until that sequence is observed.