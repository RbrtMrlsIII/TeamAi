/**
 * Typed mirror of shell-nav.js — not loaded by static HTML.
 * Keep in lockstep with .js. Browser entry remains shell-nav.js.
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

const APPROVAL_DATA: Record<string, {
  request: string;
  task: string;
  seat: string;
  provider: string;
  impact: string;
  scope: string;
  waiting: string;
  status: string;
  gate: string;
  runs: string;
  notRuns: string;
}> = {
  "runtime-alpha": {
    request: "Provider runtime invocation",
    task: "TASK-042 · Working task",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    impact: "Invoke the already-bound provider runtime for the eligible task using the project's execution capability.",
    scope: "Northstar Workplace / Command Deck project",
    waiting: "2 min ago",
    status: "waiting approval",
    gate: "Approval pending · runtime gate not yet opened",
    runs: "Provider runtime invocation for TASK-042, after authoritative approval and runtime checks.",
    notRuns: "No browser-side provider call, Firestore write, scheduler selection, entitlement mutation, or PayPal activity.",
  },
  "workspace-write": {
    request: "Workspace artifact write",
    task: "TASK-044 · Artifact preparation",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    impact: "Write the prepared artifact into the project-scoped workspace through the authorized tool path.",
    scope: "Northstar Workplace / Command Deck project workspace",
    waiting: "6 min ago",
    status: "waiting approval",
    gate: "Approval pending · tool policy and task state remain backend-owned",
    runs: "A project-scoped workspace tool invocation, only after the authoritative approval path permits it.",
    notRuns: "No direct filesystem write from this browser, no provider-to-provider control, and no entitlement or PayPal mutation.",
  },
  "review-export": {
    request: "Export review package",
    task: "TASK-046 · Review handoff",
    seat: "Gamma · reviewer",
    provider: "Provider Three · Model C",
    impact: "Prepare a bounded review package for export after the reviewer connection is revalidated.",
    scope: "Northstar Workplace / Command Deck review scope",
    waiting: "11 min ago",
    status: "blocked",
    gate: "Blocked · Gamma connection is degraded and requires recovery before execution",
    runs: "Nothing yet; recovery and capability revalidation must precede any execution eligibility.",
    notRuns: "No export, no provider request, no task transition, and no browser-side recovery bypass.",
  },
};

let lastFocus: Element | null = null;
let focusTrapHandler: ((event: KeyboardEvent) => void) | null = null;
let activeApproval = "runtime-alpha";

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
  const approvals = document.querySelector<HTMLElement>("[data-approvals-root]");
  const isDeck = destination === "deck";
  const isApprovals = destination === "approvals";
  if (deck) deck.hidden = !isDeck;
  if (approvals) approvals.hidden = !isApprovals;
  if (off) off.hidden = isDeck || isApprovals;

  document.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    const id = btn.getAttribute("data-nav") ?? "";
    if (id === destination) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  const menu = document.querySelector<HTMLSelectElement>("[data-nav-menu]");
  if (menu && menu.value !== destination) menu.value = destination;

  if (!isDeck && !isApprovals) {
    const title = document.querySelector<HTMLElement>("[data-stage-title]");
    const copy = document.querySelector<HTMLElement>("[data-stage-copy]");
    const label = NAV_LABELS[destination] ?? destination;
    if (title) title.textContent = label;
    if (copy) copy.textContent = `${label} composition is not implemented yet. Shell and Navigation persist; Deck, Workplace, Seats, and Approvals are the inhabited bodies. Presentation only — no domain writes.`;
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

function selectApproval(approvalId: string): void {
  const id = APPROVAL_DATA[approvalId] ? approvalId : "runtime-alpha";
  activeApproval = id;
  document.querySelectorAll<HTMLElement>("[data-approval]").forEach((card) => {
    const selected = card.getAttribute("data-approval") === id;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  const approval = APPROVAL_DATA[id];
  if (!approval) return;
  const set = (selector: string, value: string): void => {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) el.textContent = value;
  };
  set("[data-approval-title]", approval.request);
  set("[data-approval-task]", approval.task);
  set("[data-approval-status]", approval.status);
  set("[data-approval-seat]", approval.seat);
  set("[data-approval-provider]", approval.provider);
  set("[data-approval-scope]", approval.scope);
  set("[data-approval-waiting]", approval.waiting);
  set("[data-approval-gate]", approval.gate);
  set("[data-approval-impact]", approval.impact);
  set("[data-approval-runs]", approval.runs);
  set("[data-approval-not-runs]", approval.notRuns);
}

function focusableIn(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute("hidden"));
}

function openModal(): void {
  const modal = document.querySelector<HTMLElement>('[data-field="F7"]');
  const plate = modal?.querySelector<HTMLElement>(".ta-modal__plate");
  if (!modal || !plate) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  const focusables = focusableIn(plate);
  const primary = plate.querySelector<HTMLElement>('[data-cluster="action"] [data-modal-action="approve"]') ?? focusables[0];
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
  const approvalNote = document.querySelector<HTMLElement>("[data-approval-result]");
  const message = action === "approve"
    ? "APPROVE recorded in UI only — no domain execution."
    : "DENY recorded in UI only — no domain execution.";
  if (note) note.textContent = message;
  if (approvalNote) approvalNote.textContent = `${message} Authoritative approval state remains backend-owned.`;
  closeModal();
}

function openSelectedApproval(): void {
  const approval = APPROVAL_DATA[activeApproval];
  if (!approval) return;
  openModal();
  const title = document.querySelector<HTMLElement>("[data-modal-title]");
  const actor = document.querySelector<HTMLElement>("[data-modal-actor]");
  const impact = document.querySelector<HTMLElement>("[data-modal-impact]");
  if (title) title.textContent = approval.request;
  if (actor) actor.textContent = `${approval.seat} · ${approval.provider} · ${approval.task}`;
  if (impact) impact.textContent = `${approval.impact} ${approval.notRuns}`;
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
  document.querySelector('[data-action="open-selected-approval"]')?.addEventListener("click", openSelectedApproval);
  document.querySelector('[data-modal-action="deny"]')?.addEventListener("click", () => onModalAction("deny"));
  document.querySelector('[data-modal-action="approve"]')?.addEventListener("click", () => onModalAction("approve"));
  document.querySelector('[data-modal-action="dismiss"]')?.addEventListener("click", closeModal);
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");
      if (id) showComposition(id);
    });
  });
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    const destination = (event.target as HTMLSelectElement).value;
    if (destination) showComposition(destination);
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
  document.querySelectorAll("[data-approval]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-approval");
      if (id) selectApproval(id);
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
