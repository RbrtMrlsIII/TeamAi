  applyDocumentTheme({ mode: resolveMode(readSource(), readStoredMode()), source: readSource(), motion: readMotion(), density: next });
  refreshThemeControls();
}

function wire() {
  initializeTheme();
  refreshThemeControls();
  buildWorkplace();
  buildSeats();
  buildApprovals();
  showComposition("deck");
  setStage("planning");

  window.addEventListener("teamai:seat-runtime-report", (event) => {
    const detail = event.detail || {};
    if (detail.authoritative !== true) return;
    activeSeatReport = createSeatReportPresentation(detail);
    renderSeatRuntime();
  });

  window.addEventListener("teamai:seat-transaction-state", (event) => {
    const detail = event.detail || {};
    if (detail.authoritative !== true) return;
    activeSeatTransaction = createSeatTransactionPresentation(detail);
    renderSeatRuntime();
  });

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
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    const destination = event.target.value;
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
  watchOsTheme((mode) => {
    if (readSource() !== "os") return;
    applyDocumentTheme({ mode, source: "os", motion: readMotion(), density: readDensity() });
    refreshThemeControls();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
else wire();