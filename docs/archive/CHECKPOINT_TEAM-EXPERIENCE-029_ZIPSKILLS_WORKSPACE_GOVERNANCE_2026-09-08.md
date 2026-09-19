# Checkpoint — WORKSPACE_ZIPSKILLS (workspace tree)

**Date:** 2026-09-08  
**Branch:** `docs/029-zipskills-workspace-governance-home`  
**After:** #145 merged (Seat Shell v1)  
**PR:** #146  
**Skills:** teamai-project → seat-shell-hierarchy  

## Change

| Item | Before | After |
|------|--------|--------|
| `SEAT_TOOLKIT` | Deferred seat child | **Deferred seat-scoped** — skill bundles from seat preferences / responsibilities |
| `SEAT_ZIPSKILLS` | Deferred seat child | **`WORKSPACE_ZIPSKILLS`** — equips on **workspace tree** (not Seat) |

## WORKSPACE_ZIPSKILLS placement

- Workplace governance / execution discipline
- Team-lead updates, shared team continuity, or branch ownership before main
- Presentation lives at **workspace** tier (with services ring), not in-shell Seat children

## Validation fix (#146 CI)

- Restored skill phrase required by baseline test: `Numbers come from the baseline doc`
- Headings WHEN TO USE → … → SEE ALSO retained

## Non-goals this slice

- No runtime equip code
- No Toolkit implementation
- No ZipSkills UI mesh yet
- No 029-released claim

## Next

Slice 2 — Workspace services ring sheet + baseline note (`WORKSPACE_*` namespace).
