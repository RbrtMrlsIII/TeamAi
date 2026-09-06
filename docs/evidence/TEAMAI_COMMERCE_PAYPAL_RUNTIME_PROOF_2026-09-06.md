# TeamAi Commerce / PayPal Runtime Evidence — 2026-09-06

**Scope:** isolated `teamai-paypal-webhook-v5c` validation only  
**Environment:** PayPal Sandbox + Supabase Edge Function + Firebase `(default)` Firestore  
**Purpose:** preserve observed runtime evidence without promoting an incomplete gate to full commerce completion.

## Canonical commerce contract

The current commerce hierarchy is:

```text
accounts/{uid}/commerce/{correlationId}
    /events/{providerEventId}
    /entitlements/{entitlementId}

commerceCorrelationIndex/{correlationId}
```

The existing server-owned `correlationId` is the commerce aggregate document identifier and is propagated to PayPal as `purchase_units[].custom_id`.

## Authority and skill routing

Governing chain:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md`

Applicable execution/field skills:

- `skills/execution/orucaveam/SKILL.md`
- `skills/backend/commerce-paypal/SKILL.md`
- `skills/backend/verification-recovery/SKILL.md`
- `skills/backend/task-event-idempotency/SKILL.md`
- `skills/backend/firestore-canonical-state/SKILL.md`

Frontend continuation skill:

- `skills/frontend/spatial/commerce-read-model/SKILL.md`

## Evidence sequence

### 1. Commerce intent / correlation

A live TeamAi commerce-intent request produced a server-owned `correlationId`. The same value was compared with the PayPal `custom_id` and matched.

**State:** `RUNTIME-PROVEN`

### 2. PayPal Sandbox OAuth

A fresh OAuth client-credentials exchange against the PayPal Sandbox REST API succeeded.

**State:** `RUNTIME-PROVEN`

### 3. Real PayPal Sandbox order

A real Sandbox order was created with a `purchase_units[].custom_id` equal to the TeamAi `correlationId`.

The buyer then approved the order.

**State:** `RUNTIME-PROVEN`

### 4. Capture

The approved order was captured successfully and reached PayPal order status `COMPLETED`.

**State:** `RUNTIME-PROVEN`

### 5. Real provider event

PayPal exposed the real event:

- Event type: `PAYMENT.CAPTURE.COMPLETED`
- Event ID: `WH-71666988RB043112X-1WA30416DF8293903`
- Summary: `Payment completed for $ 1.0 USD`
- Resource type: `capture`
- Capture status: `COMPLETED`
- TeamAi correlation: `68b4ef3a-4132-46bf-8a01-43ebe97ba51e`

The event payload's `custom_id` matched the established TeamAi `correlationId`.

**State:** `RUNTIME-PROVEN`

## First webhook runtime finding — v12

The real PayPal event reached `teamai-paypal-webhook-v5c` on deployment **v12** and the Supabase invocation returned HTTP **200** from a PayPal-originated request (`PayPal/AUHD-1.0-1`).

Direct Firestore inspection subsequently showed:

```text
aggregate:   status = pending
account/.../commerce/{correlationId}

child event: type = payment.completed
account/.../commerce/{correlationId}/events/{providerEventId}

entitlement: status = active
account/.../commerce/{correlationId}/entitlements/{correlationId}
```

This established a real state-transition defect: provider event processing and entitlement projection succeeded, but the parent commerce aggregate remained `pending`.

**State:** `LEARNED`

## Correction

The isolated v5c handler was corrected to derive an `aggregateStatus` from supported commerce events and patch the canonical aggregate after event creation. Successful payment events map to `aggregateStatus = completed`.

The aggregate patch is performed before the duplicate-event early return so that safe webhook redelivery can repair an already-persisted event without creating another event document.

The change remains isolated to `teamai-paypal-webhook-v5c`; canonical `paypal-webhook` was not redeployed or cut over.

**Code review boundary:** PR #64, branch `fix/paypal-commerce-aggregate-state-2026-09-06`.

## Post-fix deployment

`teamai-paypal-webhook-v5c` was deployed as **ACTIVE v13**.

Supabase function inventory confirmed:

```text
teamai-paypal-webhook-v5c | ACTIVE | 13
```

**State:** `DEPLOYED`

## Controlled redelivery — v13

The same real PayPal event was resent through PayPal's event delivery path. A new Supabase invocation was recorded with:

- HTTP method: `POST`
- HTTP status: `200`
- User-Agent: `PayPal/AUHD-1.0-1`
- `request.cf.asOrganization`: `PayPal, Inc.`
- deployment ID suffix: `_13`
- version: `13`
- execution time: `3575 ms`
- response content type: `application/json`
- response content length: `62`
- Edge region: `us-west-1`

The invocation ID was `d956c79b-32c2-4496-be44-19ddbb1998a2` and the execution ID was `e2d5e9af-d504-45a6-906c-5d846036195b`.

This proves that the real PayPal redelivery reached **v13** and v13 returned **HTTP 200**.

**State:** `RUNTIME-PROVEN`

## Remaining verification gate

The final post-fix Firestore verification remains open. It must prove all of the following together:

```text
accounts/{uid}/commerce/{correlationId}
    status = completed

accounts/{uid}/commerce/{correlationId}/events/{providerEventId}
    existing event remains singular / no duplicate event created

accounts/{uid}/commerce/{correlationId}/entitlements/{correlationId}
    status = active
    sourceCommerceEventId = {providerEventId}
```

This final read must be performed after the v13 redelivery. Until it is directly recorded, the isolated PayPal commerce lifecycle must **not** be labeled `COMPLETED`.

## Frontend implementation boundary

The visual/frontend slice may now be implemented against the explicit contract in `docs/TEAM-EXPERIENCE-029_COMMERCE_UI_CONTRACT.md`, provided the implementation remains read-only and does not claim live backend behavior from fixtures.

Primary UI authority:

`commerce aggregate status`

History/evidence:

`commerce events`

Access projection:

`entitlement`

The frontend must not read `commerceCorrelationIndex`, write commerce state directly, call PayPal for authoritative state, or equate TeamAi entitlement with provider entitlement.

## Evidence boundary

This record does not claim:

- full `TEAM-BACKEND-001` completion;
- canonical `paypal-webhook` cutover;
- browser-side payment authority;
- production PayPal/live-mode readiness;
- final HandOver/Endorsement for TEAM-BACKEND-001.

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

No state upgrade is implied by documentation alone.
