/**
 * TEAM-EXPERIENCE-029 — Shell + Navigation placeholder restore in progress
 * Full bind lands in next commit when content upload succeeds.
 * Temporary safe stub so the branch is not broken with PLACEHOLDER-only.
 */
import {
  applyDocumentTheme,
  initializeTheme,
  persistTheme,
  readDensity,
  readMotion,
  readSource,
  readStoredMode,
  resolveMode,
  watchOsTheme,
} from "./theme-root.js";
import { projectSeat, normalizeConnectionHealth } from "./seat-read-model.js";

console.info("[TeamAi] shell-nav stub: use main for full UI until full restore commit");

export { projectSeat, normalizeConnectionHealth };

function wire() {
  try {
    initializeTheme();
    watchOsTheme?.(() => {});
  } catch (e) {
    console.warn(e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wire);
} else {
  wire();
}
