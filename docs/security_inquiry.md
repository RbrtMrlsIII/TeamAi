# TeamAi — Security inquiry register

**Status:** Living question log (agents and humans may append)  
**Purpose:** Capture security / abuse / resilience questions before they become silent assumptions.  
**Not:** Product Law, entitlement grants, or a how-to for abuse.  
**Authority:** Product Law → backend contracts → this register (inquiry only).

## How to add a question

1. Append a new `### Q-NNN` section (next free number).
2. State **Context**, **Question**, **Working answer (bounded)**, **Open follow-ups**, **Related docs**.
3. Prefer defensive controls and evidence boundaries — do **not** document step-by-step attack recipes.
4. Link implementation PRs when a control lands.

---

### Q-001 — Burst / loop API load (e.g. ~10,000 requests)

**Context:** What if a client (or compromised token) sends a very large number of requests in a tight loop against TeamAi APIs (Edge Functions, app HTTP surface, or provider-facing endpoints)?

**Question:** How should TeamAi fail closed under high request volume without collapsing Firestore quota, provider cost, or shared infrastructure?

**Working answer (bounded):**

1. **Assume volume is hostile until proven otherwise.** Legitimate product flows are interactive or scheduled with backoff — not unconstrained tight loops from a single principal.
2. **Layered limits (defense in depth):**
   - **Edge / API gateway:** per-IP and per-principal rate limits (token bucket / sliding window) with `429` + `Retry-After`.
   - **Authn-bound quotas:** authenticated callers get a higher but still finite budget; anonymous / public routes stay stricter.
   - **Idempotency + dedupe:** mutating endpoints should not multiply work for identical retries.
   - **Queue / async:** expensive work (provider invoke, bulk reads) must not run synchronously 1:1 with every HTTP hit.
   - **Firestore awareness:** project-level Spark/Blaze quotas are not a substitute for app-level throttles — see `docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`.
3. **Cost and entitlement:** usage against Seat / subscription / provider budgets should short-circuit before provider spend; presentation UI never grants durable capacity.
4. **Observability:** log rate-limit hits, principal id (where lawful), route class, and reject reason for recovery — without logging secrets.
5. **Explicit non-goals of this answer:** no concrete bypass techniques; no commitment that limits are already fully implemented on every route.

**Open follow-ups:**

- [ ] Inventory which Edge routes currently enforce rate limits vs which are still open.
- [ ] Choose canonical limit classes (public / authenticated / seat-scoped / admin).
- [ ] Align with entitlement + usage architecture (`docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md`).
- [ ] CI or contract test that documents expected `429` behavior on a designated probe route (when implemented).

**Related docs:**

- `docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`
- `docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` (when controls change validation)

**Status:** INQUIRY — not yet claimed as fully implemented across all surfaces.

---

<!-- Agents: append Q-002+ below this line. Keep numbering monotonic. -->
