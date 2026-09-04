/**
 * TEAM-EXPERIENCE-029 — Shell + Navigation presentation scripts
 * May: theme mode/source, density, nav aria-current, stage label copy.
 * Must not: Firestore, PayPal, scheduler actor, entitlements, second theme root.
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
  type Density,
  type ThemeMode,
  watchOsTheme,
} from "./theme-root.js";

const NAV_LABELS: Record<string, string> = {
  deck: "Deck",
  workplace: "Workplace",
  seats: "Seats",
  planning: "Planning",
  working: "Working",
  artifacts: "Artifacts",
  approvals: "Approvals",
  settings: "Settings",
};

function refreshThemeControls(): void {
  const mode = resolveMode(readSource(), readStoredMode());
  const themeBtn = document.querySelector<HTMLButtonElement>('[data-action="toggle-theme"]');
  if (themeBtn) {
    themeBtn.textContent = mode === "dark" ? "Theme: Dark" : "Theme: Light";
    themeBtn.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  }
  const densityBtn = document.querySelector<HTMLButtonElement>('[data-action="toggle-density"]');
  if (densityBtn) {
    const density = readDensity();
    densityBtn.textContent = density === "compact" ? "Density: Compact" : "Density: Default";
    densityBtn.setAttribute("aria-pressed", density === "compact" ? "true" : "false");
  }
}

function setNav(destination: string): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-nav]");
  buttons.forEach((btn) => {
    const id = btn.getAttribute("data-nav") ?? "";
    if (id === destination) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.removeAttribute("aria-current");
    }
  });
  const title = document.querySelector<HTMLElement>("[data-stage-title]");
  const copy = document.querySelector<HTMLElement>("[data-stage-copy]");
  const label = NAV_LABELS[destination] ?? destination;
  if (title) title.textContent = label;
  if (copy) {
    copy.textContent =
      `${label} composition is not implemented yet. Shell and Navigation persist; interior primitives come in later slices. Presentation only — no domain writes.`;
  }
}

function toggleTheme(): void {
  const current = resolveMode(readSource(), readStoredMode());
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  persistTheme({ mode: next, source: "user" });
  applyDocumentTheme({
    mode: next,
    source: "user",
    motion: readMotion(),
    density: readDensity(),
  });
  refreshThemeControls();
}

function toggleDensity(): void {
  const next: Density = readDensity() === "compact" ? "default" : "compact";
  persistTheme({ density: next });
  applyDocumentTheme({
    mode: resolveMode(readSource(), readStoredMode()),
    source: readSource(),
    motion: readMotion(),
    density: next,
  });
  refreshThemeControls();
}

function wire(): void {
  initializeTheme();
  refreshThemeControls();

  document.querySelector('[data-action="toggle-theme"]')?.addEventListener("click", toggleTheme);
  document.querySelector('[data-action="toggle-density"]')?.addEventListener("click", toggleDensity);

  document.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");
      if (id) setNav(id);
    });
  });

  watchOsTheme((mode) => {
    if (readSource() !== "os") return;
    applyDocumentTheme({
      mode,
      source: "os",
      motion: readMotion(),
      density: readDensity(),
    });
    refreshThemeControls();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wire);
} else {
  wire();
}
