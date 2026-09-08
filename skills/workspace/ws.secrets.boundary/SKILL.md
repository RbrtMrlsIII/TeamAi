# WORKSPACE_SKILL — ws.secrets.boundary

**Kind:** `WORKSPACE_SKILLS` · `ws.secrets.boundary`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use whenever API keys, OAuth tokens, service accounts, or other secrets could enter chat, commits, client storage, or model context.

## INPUT

- Secret type (provider key, GitHub token, Firebase admin, etc.)
- Proposed storage or transmission path

## AUTHORITY

Secrets are **never** ordinary chat content and **never** client-attested durable authority.

## ACTION

1. Provider API keys: seat bind via trusted Edge + ciphertext; return last-four only to client.
2. GitHub: OAuth/connection inside TeamAi; no PAT paste into TeamChat as the system of record.
3. Model context receives capability handles, not raw credentials.
4. Repos: never commit `.env` secrets; rotate if exposed.
5. Browser local draft keys are transient until server bind succeeds.

## DO NOT

- Do not write secrets to Firestore from the browser.
- Do not log full keys in PR bodies, TeamChat, or analytics.
- Do not treat “user typed a key in chat” as a valid bind.

## PASS

Secret material stayed on an approved path; chat/model saw no raw secret.

## SEE ALSO

- `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`
- `PRODUCT_LAW.md` Family C
