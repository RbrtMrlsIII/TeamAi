/**
 * Typed mirror of shell-nav.js — not loaded by static HTML.
 * Keep in lockstep with shell-nav.js. Browser entry remains shell-nav.js.
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
  type Density,
  type ThemeMode,
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

let lastFocus: Element | null = null;
let focusTrapHandler: ((event: KeyboardEvent) => void) | null = null;

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

function showComposition(destination: string): void {
  const deck = document.querySelector<HTMLElement>("[data-deck-root]");
  const off = document.querySelector<HTMLElement>("[data-offdeck-root]");
  const isDeck = destination === "deck";
  if (deck) deck.hidden = !isDeck;
  if (off) off.hidden = isDeck;

  document.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    const id = btn.getAttribute("data-nav") ?? "";
    if (id === destination) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });

  if (!isDeck) {
    const title = document.querySelector<HTMLElement>("[data-stage-title]");
    const copy = document.querySelector<HTMLElement>("[data-stage-copy]");
    const label = NAV_LABELS[destination] ?? destination;
    if (title) title.textContent = label;
    if (copy) {
      copy.textContent =
        `${label} composition is not implemented yet. Shell and Navigation persist; Deck interior is the only inhabited body. Presentation only — no domain writes.`;
    }
  }
}

function setStage(stage: string): void {
  document.querySelectorAll<HTMLButtonElement>("[data-stage]").forEach((btn) => {
    const id = btn.getAttribute("data-stage");
    btn.setAttribute("aria-pressed", id === stage ? "true" : "false");
  });
  document.querySelectorAll<HTMLElement>("[data-stage-panel]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-stage-panel") !== stage;
  });
}

function selectSeat(seatId: string): void {
  document.querySelectorAll<HTMLElement>("[data-seat]").forEach((card) => {
    const id = card.getAttribute("data-seat");
    const selected = id === seatId;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
    if (selected) card.setAttribute("data-state", "selected");
    else card.removeAttribute("data-state");
  });
}

function focusableIn(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.hasAttribute("hidden"));
}

function openModal(): void {
  const modal = document.querySelector<HTMLElement>('[data-field="F7"]');
  const plate = modal?.querySelector<HTMLElement>(".ta-modal__plate");
  if (!modal || !plate) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  const focusables = focusableIn(plate);
  const primary = plate.querySelector<HTMLElement>('[data-modal-action="approve"]') ?? focusables[0];
  (primary ?? plate).focus();
  focusTrapHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab" || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", focusTrapHandler);
}

function closeModal(): void {
  const modal = document.querySelector<HTMLElement>('[data-field="F7"]');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (focusTrapHandler) {
    document.removeEventListener("keydown", focusTrapHandler);
    focusTrapHandler = null;
  }
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
  lastFocus = null;
}

function onModalAction(action: "approve" | "deny"): void {
  const note = document.querySelector<HTMLElement>("[data-modal-result]");
  if (note) {
    note.textContent =
      action === "approve"
        ? "APPROVE recorded in UI only — no domain execution."
        : "DENY recorded in UI only — no domain execution.";
  }
  closeModal();
}

function toggleTheme(): void {
  const current = resolveMode(readSource(), readStoredMode());
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  persistTheme({ mode: next, source: "user" });
  applyDocumentTheme({ mode: next, source: "user", motion: readMotion(), density: readDensity() });
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
  showComposition("deck");
  setStage("planning");
  document.querySelector('[data-action="toggle-theme"]')?.addEventListener("click", toggleTheme);
  document.querySelector('[data-action="toggle-density"]')?.addEventListener("click", toggleDensity);
  document.querySelector('[data-action="open-approval"]')?.addEventListener("click", openModal);
  document.querySelector('[data-modal-action="deny"]')?.addEventListener("click", () => onModalAction("deny"));
  document.querySelector('[data-modal-action="approve"]')?.addEventListener("click", () => onModalAction("approve"));
  document.querySelector('[data-modal-action="dismiss"]')?.addEventListener("click", closeModal);
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
    applyDocumentTheme({ mode, source: "os", motion: readMotion(), density: readDensity() });
    refreshThemeControls();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
else wire();
