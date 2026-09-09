# WORKSPACE_SKILL — ws.github.oauth-uid-bind

**Kind:** `WORKSPACE_SKILLS` · `ws.github.oauth-uid-bind`  
**Status:** PLANNING PROCEDURE / NOT PRODUCT LAW · **runtime not shipped**

## WHEN TO USE

Use when implementing or reviewing **Conn-3**: trusted Edge mint of `firebaseUid ↔ installation_id` after GitHub App install + user OAuth. Not for webhook receipt (Conn-2). Not for Hero presentation.

## INPUT

- `docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md`
- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md`
- `src/backend/github-installation.ts` (`bindGitHubInstallation`)
- `docs/USER_MANUAL_DEPLOY_AND_SEATS.md` §12

## AUTHORITY

Firebase UID is ownership root. GitHub grants install/OAuth consent. Edge writes Firestore. Skills ≠ authorization. **Not a Hero live bind.**

## ACTION (when implementing)

1. Require Firebase ID token on Edge; reject anonymous/browser-only writes.
2. Exchange OAuth code server-side; never expose client_secret to the browser.
3. Call `bindGitHubInstallation` and persist index + UID-rooted record.
4. Leave seat equip / tool invoke as separate steps after bind.
5. Log any real callback URL only in the user manual after deploy — do not invent URLs in skills.

## DO NOT

- Do not mint UID from webhook `sender.login` (that is Conn-2 anti-pattern AP-GH-007).
- Do not treat keyboard **C** / `SEAT_CONNECTION` as OAuth.
- Do not store PEM or client_secret in TeamChat, Hero, or client Firestore.
- Do not claim 029 production release from bind alone.

## PASS

Bind is server-owned; client cannot write index; tests prove webhook cannot mint; manual documents human App + secret steps.

## EVIDENCE

Unit/contract tests + Edge source review. Live OAuth is external evidence after deploy.

## SEE ALSO

- `skills/workspace/ws.github.webhook-uid-map/SKILL.md`
- `skills/workspace/ws.github.app-least-privilege/SKILL.md`
- `skills/workspace/ws.secrets.boundary/SKILL.md`
