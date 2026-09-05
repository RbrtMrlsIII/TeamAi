# Skill — Firebase Read/Write Economy

**WHEN TO USE:** changing settings, conversation persistence, Firestore reads/writes, or explaining how TeamAi avoids burning quota.

**INPUT:** a proposed UI or backend mutation that might touch Firestore.

**AUTHORITY:** Product Law (Firebase is durable domain authority). Cache is never authority. Browser must not become Firestore write authority for scheduler/execution.

**ACTION:**
1. Classify the change: hot / durable / derived.
2. If it is a settings edit, keep it in `ConfigurationDraft` until Save.
3. If it is typing or streaming, keep it local until Submit/complete.
4. Persist one `WebAiConversationTurn` per completed human or Web AI turn.
5. Load a conversation once, then reuse the working-set snapshot for the run.
6. Do not preflight-read a create-only document.

**DO NOT:**
- write Firestore on every keystroke, slider, or theme preview
- replace Firestore with another database for quota reasons
- treat local cache or a Settings preview as durable truth
- write execution/lease/approval state from the browser

**PASS:** many local edits produce at most one durable write at the commit point; conversation turns are one document per completed turn; source tests cover Save-no-op and turn-table load-once.

**EVIDENCE:** `tests/read-write-economy.test.mjs`, `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`, `docs/START_HERE_FOR_NEW_SESSIONS.md`

**SEE ALSO:** `src/backend/configuration-draft.ts`, `src/backend/conversation-turn.ts`, `docs/TEAMAI_CURRENT_STATE.md`
