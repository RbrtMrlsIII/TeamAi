/**
 * TEAM-EXPERIENCE-029 — Shell + Navigation + Deck + F7 presentation scripts
 * May: theme, density, nav, stage, seat highlight, F7 clusters (action | handoff).
 * Must not: Firestore, PayPal, scheduler actor, entitlements, execute approved actions.
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

let lastFocus = null;
let focusTrapHandler = null;
let activeCluster = "action";

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
}

function focusableIn(root) {
  return [...root.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
}

function applyCluster(cluster) {
  activeCluster = cluster === "handoff" ? "handoff" : "action";
  const modal = document.querySelector('[data-field="F7"]');
  if (modal) modal.setAttribute("data-modal-cluster", activeCluster);

  document.querySelectorAll("[data-cluster]").forEach((el) => {
    el.hidden = el.getAttribute("data-cluster") !== activeCluster;
  });

  const title = document.querySelector("[data-modal-title]");
  const impact = document.querySelector("[data-modal-impact]");
  if (activeCluster === "handoff") {
    if (title) title.textContent = "Planning handoff";
    if (impact) {
      impact.textContent =
        "Review the planning packet. APPROVE is review only — not task execution. EDIT returns to the well; MORE keeps Planning running. Presentation only.";
    }
  } else {
    if (title) title.textContent = "Action request";
    if (impact) {
      impact.textContent =
        "Presentation preview only. Approving does not run tools, write Firestore, or charge PayPal.";
    }
  }
}

function openModal(cluster) {
  const modal = document.querySelector('[data-field="F7"]');
  const plate = modal?.querySelector(".ta-modal__plate");
  if (!modal || !plate) return;

  applyCluster(cluster ?? "action");

  lastFocus = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");

  const focusables = focusableIn(plate);
  const primary =
    plate.querySelector(`[data-cluster="${activeCluster}"] [data-modal-action="approve"]`) ||
    focusables[0];
  (primary || plate).focus();

  focusTrapHandler = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      // Cluster B: Escape behaves as MORE (dismiss, leave packet). Cluster A: dismiss without approve.
      if (activeCluster === "handoff") onModalAction("more");
      else closeModal();
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

function closeModal() {
  const modal = document.querySelector('[data-field="F7"]');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (focusTrapHandler) {
    document.removeEventListener("keydown", focusTrapHandler);
    focusTrapHandler = null;
  }
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
}

function onModalAction(action) {
  const note = document.querySelector("[data-modal-result]");
  const labels = {
    approve: "APPROVE recorded in UI only — no domain execution.",
    deny: "DENY recorded in UI only — no domain execution.",
    reject: "REJECT recorded in UI only — packet not accepted; no domain write.",
    edit: "EDIT recorded in UI only — would return to planning well (not wired).",
    more: "MORE recorded in UI only — plate dismissed; Planning continues (display).",
  };
  if (note) note.textContent = labels[action] ?? `${String(action).toUpperCase()} — UI only.`;
  closeModal();
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
  document.querySelector('[data-action="open-approval"]')?.addEventListener("click", () => openModal("action"));
  document.querySelector('[data-action="open-handoff"]')?.addEventListener("click", () => openModal("handoff"));
  document.querySelector('[data-modal-action="dismiss"]')?.addEventListener("click", closeModal);

  document.querySelectorAll("[data-modal-action]").forEach((btn) => {
    const action = btn.getAttribute("data-modal-action");
    if (!action || action === "dismiss") return;
    btn.addEventListener("click", () => onModalAction(action));
  });

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
