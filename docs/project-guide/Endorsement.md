# TeamAi Project Guide — Endorsement

**Status:** CANONICAL PROCEDURE

Endorsement is a completion record. It is not a substitute for implementation or verification.

## 1. Required trace

Every completed implementation claim must trace:

`Product Law → Masterplan item → domain contract/skill → actual implementation → verification evidence → endorsement`

A missing link blocks the completion claim.

## 2. Before endorsement

Confirm that:

- the claimed scope is precise;
- the governing authority is identified;
- applicable skills/guards were consulted;
- no competing root or stale implementation path remains;
- implementation exists in the canonical path;
- verification actually exercised the claimed behavior;
- limitations and environmental blockers are recorded;
- planning-only material is not being presented as shipped behavior;
- provider entitlement is not confused with TeamAi entitlement;
- external configuration is not claimed as TeamAi-owned;
- UI behavior is reconciled to backend/domain authority.

## 3. Evidence classes

Use precise state language:

`PLANNED` — discussed or designed only.

`IMPLEMENTED` — source exists in the intended canonical path.

`DEPLOYED` — deployed to a named target, if deployment is part of the claim.

`RUNTIME-PROVEN` — behavior was exercised in the relevant environment.

`COMPLETED` — required implementation and verification gates are satisfied and an authorized completion record exists.

Do not promote one class into another by implication.

## 4. Planning approval is different

For Planning Team discussions:

`discussion → selected summarizer → structured handoff → user review → APPROVE / EDIT / MORE / REJECT`

A summarizer, Team Leader, or other AI cannot endorse its own recommendation as though it were user approval.

## 5. Backend and environment limitations

When hosting, provider access, sandbox availability, credentials, or other environmental limits prevent final runtime proof, record exactly what was exercised and what remains unproven. Do not downgrade a successful local test into a failure, and do not upgrade local/source evidence into hosted production proof.

## 6. Reopening

A prior endorsement does not permanently authorize later changes. A meaningful architecture, provider, security, entitlement, or canonical-root change must reopen the affected trace and obtain fresh evidence.
