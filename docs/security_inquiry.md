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

**Context:** What if a client (or compromised token) sends a very large number of requests in a tight loop against TeamAi APIs?

**Question:** How should TeamAi fail closed under high request volume?

**Working answer (bounded):** Assume hostile volume. Layered limits: Edge per-IP/per-principal rate limits (`429` + `Retry-After`); authn-bound finite quotas; idempotency; async for expensive work; Firestore project quota is not an app throttle (`docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`); entitlement short-circuits before provider spend. No claim that every route is fully limited yet.

**Open follow-ups:** [ ] Route inventory [ ] Limit classes [ ] Entitlement alignment [ ] Optional `429` probe test

**Related:** Firestore usage policy · entitlement architecture

**Status:** INQUIRY

---

### Q-002 — Malicious code in an upload section (if we ever ship one)

**Context:** Future file uploads (attachments, artifacts, zip/skill packages).

**Question:** What if a user uploads malicious code (malware, scripts, polyglots, zip bombs)?

**Working answer (bounded):** Uploads are untrusted — never execute as server code. Store outside executable roots; non-executable content types; size/type allowlists (sniff + extension); malware scan where available; archive caps; least-privilege handlers; uploaded “skills” never grant entitlement (Product Law). No claim upload is shipped or fully hardened.

**Open follow-ups:** [ ] Product decision on uploads for 029 [ ] Upload contract [ ] Reject tests

**Status:** INQUIRY

---

### Q-003 — Crafted strings in a search field

**Context:** Search/filter UI on workspace, seats, tasks, etc.

**Question:** How should TeamAi handle crafted search input (injection, XSS, query abuse)?

**Working answer (bounded):** Search is data, not code — no eval, no string-built queries, no unsanitized innerHTML. Server-side allowlisted filters only. Encode output safely. Rate-limit search (Q-001). No exploit payloads listed here.

**Open follow-ups:** [ ] Search endpoint inventory [ ] Parameterized filters [ ] XSS regression tests

**Status:** INQUIRY

---

### Q-004 — Self-promotion to admin by editing a JWT field

**Context:** Firebase (or similar) ID tokens / JWTs on API calls.

**Question:** What if someone edits a JWT field to claim admin?

**Working answer (bounded):** Clients cannot mint trusted identity — signature verification fails on tamper. Never trust client-only role claims; re-check admin/membership server-side against durable Firestore/rules (UID → role). Admin is server-owned, not a browser edit. Reject bad/expired/wrong-audience tokens at the edge.

**Open follow-ups:** [ ] Verify all Edge functions validate tokens [ ] Admin paths use durable role docs

**Status:** INQUIRY

---

### Q-005 — Attacker login using “our Google auth code”

**Context:** Google Sign-In / OAuth for TeamAi identity.

**Question:** What if an attacker uses our Google auth client config or intercepted auth codes?

**Working answer (bounded):** Auth codes are one-time and bound to client_id + redirect_uri — not a reusable password. Client IDs are public; secrets must not ship in the SPA. Protect via redirect allowlists, trusted code exchange / Firebase flow, PKCE where applicable, short TTL. Authorize by UID on durable data. No abuse recipes here.

**Open follow-ups:** [ ] Redirect URI lock [ ] No client secret in frontend [ ] Revocation runbook

**Status:** INQUIRY

---

### Q-006 — Row-level security (RLS) on?

**Context:** Durable domain is Firestore; some stacks also use Postgres/Supabase with RLS.

**Question:** Do we have row-level security on?

**Working answer (bounded):**

1. **Canonical TeamAi durable domain is Cloud Firestore**, not Postgres-as-domain. Domain security is primarily **Firestore Security Rules** (+ trusted Admin/Edge paths), not Postgres RLS on a TeamAi domain DB.
2. **Supabase Postgres** (if present) is **not** the TeamAi domain store — “RLS on” there does not cover Seat/Workplace/task authority.
3. **Rules must enforce UID ownership/membership** for client paths; service-credential Edge must still apply application authorization.
4. Not a claim that every collection is fully audited.

**Open follow-ups:** [ ] Map client-readable vs Edge-only paths [ ] Cross-UID deny evidence [ ] Clarify any non-domain Supabase tables

**Related:** Firestore rules · Firestore usage policy · backend authority

**Status:** INQUIRY

---

### Q-007 — API body includes `isAdmin: true`

**Context:** JSON bodies on Edge/app APIs may include many fields.

**Question:** What if the API accepts arbitrary body fields and a user sends `isAdmin: true`?

**Working answer (bounded):**

1. **Never take privilege from the request body.** Roles/admin/entitlements/UID come from **verified auth + durable server state**, not client JSON.
2. **Allowlist / schema validation** on mutating routes; strip or reject unknown keys.
3. **Ignore or hard-reject** client `isAdmin`, `role`, `uid`, `entitlements`, `permissions` when not grounded in server truth.
4. **Mass-assignment defense** — do not spread full body into privileged Firestore writes.
5. Same untrusted-client rule as Q-004 (JWT).

**Open follow-ups:** [ ] Schema validation on mutating Edge functions [ ] Deny-list tests for body privilege fields [ ] Review body→write spreads

**Related:** Q-004 · backend authority · Edge contracts

**Status:** INQUIRY

---

<!-- Agents: append Q-008+ below this line. Keep numbering monotonic. -->
