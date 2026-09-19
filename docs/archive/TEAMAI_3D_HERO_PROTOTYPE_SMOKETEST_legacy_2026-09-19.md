# TeamAi — 3D Hero Prototype Smoke Test

1. Open the static Hero at `/` after `npm run build`.
2. Confirm the canvas initializes and no fatal browser exception blocks rendering.
3. Confirm four Web AI Seats surround the shared workspace.
4. Switch through Wide, Low orbit, Team, Workspace, and Map POVs.
5. Start the turn loop and observe `IDLE → FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF`.
6. Confirm the contribution carrier moves toward the shared workspace and does not travel Seat-to-Seat.
7. Confirm a new persistent workspace trace appears after handoff.
8. Toggle reduced motion and confirm meaning remains visible without continuous motion.
9. Resize to a narrow viewport and confirm the light-theme hierarchy remains intact.
10. Run the repository test command to verify static wiring and runtime syntax.

This is a presentation/runtime smoke test, not a substitute for backend authority, scheduler, provider, integration, or Firebase verification.
