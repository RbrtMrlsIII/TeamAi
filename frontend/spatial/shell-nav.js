/**
 * TEAM-EXPERIENCE-029 — Shell + Navigation + Deck presentation scripts
 * May: theme, density, nav, Planning/Working stage skin, seat selected highlight.
 * Must not: Firestore, PayPal, scheduler actor selection, entitlements, second theme root.
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

const NAV_LABELS = {
  deck: "Deck",
  workplace: "Workplace",
  seats: "Seats",
  planning: "Planning",
  working: "Working",
  artifacts: "Artifacts",
  approvals: "Approvals",
  settings: "Settings",
};

function refreshThemeControls() {
  const mode = resolveMode(readSource(), readStoredMode());
  const themeBtn = document.querySelector('[data-action="toggle-theme"]');
  if (themeBtn) {
    themeBtn.textContent = mode === "dark" ? "Theme: Dark" : "Theme: Light";
    themeBtn.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  }
  const densityBtn = document.querySelector('[data-action="toggle-density"]');
  if (densityBtn) {
    const density = readDensity();
    densityBtn.textContent = density === "compact" ? "Density: Compact" : "Density: Default";
    densityBtn.setAttribute("aria-pressed", density === "compact" ? "true" : "false");
  }
}

function showComposition(destination) {
  const deck = document.querySelector("[data-deck-root]");
  const off = document.querySelector("[data-offdeck-root]");
  const isDeck = destination === "deck";
  if (deck) deck.hidden = !isDeck;
  if (off) off.hidden = isDeck;

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    const id = btn.getAttribute("data-nav") ?? "";
    if (id === destination) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });

  if (!isDeck) {
    const title = document.querySelector("[data-stage-title]");
    const copy = document.querySelector("[data-stage-copy]");
    const label = NAV_LABELS[destination] ?? destination;
    if (title) title.textContent = label;
    if (copy) {
      copy.textContent =
        label +
        " composition is not implemented yet. Shell and Navigation persist; Deck interior is the only inhabited body. Presentation only — no domain writes.";
    }
  }
}

function setStage(stage) {
  document.querySelectorAll("[data-stage]").forEach((btn) => {
    const id = btn.getAttribute("data-stage");
    btn.setAttribute("aria-pressed", id === stage ? "true" : "false");
  });
  document.querySelectorAll("[data-stage-panel]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-stage-panel") !== stage;
  });
}

function selectSeat(seatId) {
  document.querySelectorAll("[data-seat]").forEach((card) => {
    const id = card.getAttribute("data-seat");
    const selected = id === seatId;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
    if (selected) card.setAttribute("data-state", "selected");
    else card.removeAttribute("data-state");
  });
  /* Intentionally does not touch scheduler eligibility or domain state */
}

function toggleTheme() {
  const current = resolveMode(readSource(), readStoredMode());
  const next = current === "dark" ? "light" : "dark";
  persistTheme({ mode: next, source: "user" });
  applyDocumentTheme({
    mode: next,
    source: "user",
    motion: readMotion(),
    density: readDensity(),
  });
  refreshThemeControls();
}

function toggleDensity() {
  const next = readDensity() === "compact" ? "default" : "compact";
  persistTheme({ density: next });
  applyDocumentTheme({
    mode: resolveMode(readSource(), readStoredMode()),
    source: readSource(),
    motion: readMotion(),
    density: next,
  });
  refreshThemeControls();
}

function wire() {
  initializeTheme();
  refreshThemeControls();
  showComposition("deck");
  setStage("planning");

  document.querySelector('[data-action="toggle-theme"]')?.addEventListener("click", toggleTheme);
  document.querySelector('[data-action="toggle-density"]')?.addEventListener("click", toggleDensity);

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");
      if (id) showComposition(id);
    });
  });

  document.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = btn.getAttribute("data-stage");
      if (stage) setStage(stage);
    });
  });

  document.querySelectorAll("[data-seat]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-seat");
      if (id) selectSeat(id);
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
