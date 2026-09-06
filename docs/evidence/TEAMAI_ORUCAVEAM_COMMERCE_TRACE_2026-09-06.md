# TeamAi Commerce — ORUCAVEAM Trace / 2026-09-06

**Scope:** bounded PayPal commerce correction plus preparation for canonical 029 commerce UI development.
**Status:** `RUNTIME-PROVEN` bounded runtime evidence; final backend completion remains gated on direct Firestore post-fix verification.

## O — Objective

Preserve the real PayPal Sandbox evidence already obtained, correct the discovered stale-parent-commerce-state defect, wire the correction to the existing ORUCAVEAM and field skills, and establish an implementation-ready frontend commerce read-model boundary without moving backend authority into the browser.

## R — Restrictions

- Keep `teamai-paypal-webhook-v5c` isolated from canonical `paypal-webhook` cutover.
- Do not create another PayPal payment merely to increase confidence.
- Do not manually patch Firestore to manufacture proof.
- Do not expose PayPal client secrets, access tokens, or provider credentials.
- Do not let browser code write commerce aggregate, event, or entitlement state.
- Do not turn planning documents into Product Law.
- Do not create a second theme root, modal system, status authority, or frontend commerce authority.
- Do not label the commerce lifecycle `COMPLETED` until aggregate/event/entitlement state is directly verified after v13 redelivery.

## U — User Authority

The user explicitly authorized implementation of the document/skill reconciliation needed to proceed to real frontend code development. This trace records execution within that authorized scope. It does not constitute authorization to change Product Law, merge PR #64, or activate Vercel.

## C — Canonical Authority

Primary authority remains:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md`

Current commerce/domain contract:

`accounts/{uid}/commerce/{correlationId}`

`accounts/{uid}/commerce/{correlationId}/events/{providerEventId}`

`accounts/{uid}/commerce/{correlationId}/entitlements/{entitlementId}`

`commerceCorrelationIndex/{correlationId}` is server-only lookup state.

The frontend consumes trusted read models rather than direct PayPal authority.

## A — Action

Implemented on the PayPal correction branch:

- reconciled `skills/backend/commerce-paypal/SKILL.md` with aggregate-state synchronization and direct state verification;
- wired a new `skills/frontend/spatial/commerce-read-model/SKILL.md` into `docs/SKILL_WIRING.md`;
- created `docs/TEAM-EXPERIENCE-029_COMMERCE_UI_CONTRACT.md` for the frontend/backend commerce seam;
- recorded the current backend continuation state in `docs/project-guide/HandOver.md`;
- preserved the runtime evidence in `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`;
- retained PR #64 as the implementation/code-review boundary.

## V — Verification

Already proven:

1. TeamAi commerce intent created a server-owned correlation ID.
2. The same value became PayPal `custom_id`.
3. PayPal Sandbox OAuth succeeded.
4. A real Sandbox order was created and approved.
5. Capture reached `COMPLETED`.
6. A real `PAYMENT.CAPTURE.COMPLETED` event was observed.
7. The original v12 delivery returned HTTP 200 and persisted the event/entitlement.
8. Firestore inspection exposed the stale aggregate `pending` state.
9. v13 was deployed ACTIVE.
10. The existing event was resent and reached v13 with PayPal-originated `POST` and HTTP 200.

Still open:

- direct post-v13 Firestore verification of aggregate `completed`;
- proof that the existing event remains singular after redelivery;
- confirmation entitlement remains `active` with the original provider event ID.

## E — Efficiency

Reuse the real provider event instead of creating another transaction. Reuse existing canonical paths and skills instead of creating duplicate architecture. Keep the frontend contract read-only and typed so UI work can progress without opening browser write authority.

## A — Audit

The change is intentionally bounded to PR #64 branch `fix/paypal-commerce-aggregate-state-2026-09-06`. Canonical `paypal-webhook` remains untouched. Vercel remains cut off. The final completion state is not claimed.

## M — Minimalistic Efficiency / Resource Use

The lowest sufficient verification path is:

`PayPal redelivery → v13 invocation → direct Firestore read → browser/UI contract`

No additional payment, webhook subscription mutation, provider configuration, or broad frontend rewrite is required for the next gate.

## Next authorized state

Once the direct Firestore read proves the expected post-fix state, proceed to the 029 commerce frontend implementation using `docs/TEAM-EXPERIENCE-029_COMMERCE_UI_CONTRACT.md` and `skills/frontend/spatial/commerce-read-model/SKILL.md`.
