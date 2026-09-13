# Firebase Setup Checklist

**Status:** HISTORICAL / OPERATOR SETUP EVIDENCE — NOT PROJECT CHRONOLOGY  
**Canonical execution authority:** `MASTERPLAN.md` only  
**Current Firebase project identity:** `team-ai-official` (see Product Law / backend skills)  
**No 029-release claim.**

This file records an earlier human-controlled Firebase setup checklist. It is retained as recovery/operator evidence only.

**Do not use this file as a current project execution checklist or chronological queue.**  
Setup/operator steps that remain relevant must be executed under the applicable Masterplan backend gate and `skills/backend/firebase-project-identity/SKILL.md`. Project ID strings in the body may be stale relative to current Product Law.

---

## Current status

`TARGET PROJECT IDENTIFIED — SPARK-COMPATIBLE / NOT YET CONNECTED`

Target Firebase project: `teamai-7d20f`
Target Firestore database: `default`
Target deployment surface: **Firebase Hosting**

TeamAi intentionally avoids Firebase Cloud Storage and Cloud Functions. The current architecture is constrained to services usable without a Blaze upgrade.

### Human-controlled setup

- [x] Create/select TeamAi Firebase project.
- [x] Record target project ID: `teamai-7d20f`.
- [x] Use Firestore database ID: `default`.
- [ ] Enable Authentication providers required by TeamAi.
