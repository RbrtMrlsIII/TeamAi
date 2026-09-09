# WORKSPACE_SKILL — ws.github.app-least-privilege

**Kind:** `WORKSPACE_SKILLS` · `ws.github.app-least-privilege`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when creating or updating the TeamAi **GitHub App** (Developer Settings → Create GitHub App), or when reviewing App permissions before a Connection is treated as usable.

## INPUT

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md`
- `public/github-app-permission-matrix.json`
- Current GitHub App form values

## AUTHORITY

GitHub is engineering/source authority. This skill does not grant merge, entitlement, or scheduler rights. Human user must install/authorize. Skills ≠ authorization.

## ACTION

1. Grant only the v1 matrix: Metadata read; Contents write; Pull requests write; Issues write; Checks read; Statuses read; Actions **read**.
2. Keep Organization, Account, and Enterprise permissions at **No access**.
3. Turn **Request user authorization (OAuth) during installation** **on** (bind human ↔ Firebase UID). Keep token expiry on.
4. Leave Webhook **inactive** until a trusted HTTPS Edge URL exists. Do not submit an empty Active webhook.
5. Restrict install to **this account** until public launch.
6. Store PEM + webhook secret in trusted store only. Never TeamChat, Hero, or browser Firestore writes.
7. After install: map `firebaseUid ↔ installation_id` in **Firestore**, not Postgres domain tables.
8. All AI writes go through feature branch + PR. Do not push `main`.

## DO NOT

- Do not grant Administration, Secrets, Variables, Environments, Codespaces, Dependabot secrets, Copilot, Workflows write, Merge queues, or org/enterprise scopes.
- Do not treat Actions write as required for v1.
- Do not treat Hero `SEAT_CONNECTION` as a live bind.
- Do not paste PATs into TeamChat.
- Do not use GitHub Actions as the Web AI scheduler.
- Do not put `github_installation_id` on Supabase Postgres as TeamAi domain state.

## PASS

Form matches the v1 matrix; never-list remains No access; webhook dark until HTTPS; OAuth-on-install is on; secrets off the client path.

## EVIDENCE

Screenshot of the saved App permissions (repo / org / account) plus this matrix version. Not Endorsement.

## SEE ALSO

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md`
- `skills/workspace/ws.tools.github/SKILL.md`
- `skills/workspace/ws.secrets.boundary/SKILL.md`
- `PRODUCT_LAW.md` Family B
