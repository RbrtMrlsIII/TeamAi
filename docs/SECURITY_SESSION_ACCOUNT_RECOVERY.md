# SEC-S1 — Session & account recovery posture

**Status:** IMPLEMENTATION (documentation posture) · **not** a claim that every UI control is shipped  
**Authority:** Product Law → Firebase/IdP auth → backend authority → `docs/security_inquiry.md` Q-008  
**Scope:** How TeamAi should behave when a session may be old or a device was lost. Presentation/Hero surfaces do not own auth truth.

## 1. Threat (Q-008)

User lost control of a device (or shared a browser). An attacker signed in **months ago**. Long-lived refresh tokens or a still-open browser may still call TeamAi as that UID.

## 2. Required posture

| Control | Expectation |
|---------|-------------|
| **IdP session authority** | Firebase Auth (or current provider) issues and revokes tokens. TeamAi does not mint durable identity offline. |
| **Revoke all sessions** | After suspected compromise, operator/user path must support provider-level refresh-token revocation / sign-out-all. |
| **No parallel remember-me** | SPA must not store forever-valid secrets that bypass IdP verification. |
| **Server authz** | Every privileged Edge/API call re-validates token; roles from durable server state (Q-004, Q-007). |
| **Step-up (future product)** | Billing, admin, connection secrets should require recent authentication when those surfaces ship. |
| **Rotate bound secrets** | After compromise, rotate server-stored connection credentials and revoke OAuth grants where applicable. |

## 3. Explicit non-claims

- This doc does **not** claim a full in-app “devices” UI exists yet.
- This doc does **not** set a specific max session age without a later product decision.
- Hero / 3D presentation never grants durable access after logout.

## 4. Evidence / next implementation

1. Document operator steps against current Firebase project (revoke tokens).
2. When product prioritizes it: session list UI, forced re-auth on sensitive routes, idle timeout.
3. Static test: this file + Q-008 linkage remain in `docs/security_inquiry.md`.

## 5. Related

- `docs/security_inquiry.md` Q-004, Q-005, Q-008
- Firebase Auth token lifecycle
- Commerce / connection bind (no silent re-use of stolen session for new binds without step-up when shipped)

**no 029-released claim** · **no entitlement grant from this doc**
