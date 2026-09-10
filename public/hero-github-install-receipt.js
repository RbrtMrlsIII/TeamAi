/**
 * Conn-3.1 — presentation-only GitHub install receipt on the Hero return path.
 * Does NOT write Firestore, mint UID, or treat this as a Hero live bind.
 */
const RECEIPT_PARAMS = ["github", "installation_id", "setup_action", "github_error", "code", "error", "error_description"];

function readInstallQuery() {
  const params = new URLSearchParams(window.location.search);
  const github = params.get("github");
  if (github !== "installed" && github !== "error") return null;
  return {
    github,
    installationId: (params.get("installation_id") || "").trim(),
    setupAction: (params.get("setup_action") || "").trim(),
    error: (params.get("github_error") || params.get("error_description") || params.get("error") || "").trim(),
  };
}

function stripReceiptParams() {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of RECEIPT_PARAMS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    const next = url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : "") + url.hash;
    window.history.replaceState({}, "", next);
  }
}

function renderReceipt(detail) {
  const host = document.querySelector("[data-github-install-receipt]");
  if (!host) return;
  const failed = detail.github === "error" || Boolean(detail.error);
  host.hidden = false;
  host.setAttribute("aria-hidden", "false");
  host.dataset.githubInstallReceipt = failed ? "error" : "shown";
  host.dataset.conn3Bind = "deferred";
  const title = host.querySelector("[data-receipt-title]");
  const status = host.querySelector("[data-receipt-status]");
  const meta = host.querySelector("[data-receipt-meta]");
  if (title) title.textContent = failed ? "GitHub connection needs attention" : "GitHub install received";
  if (status) {
    status.textContent = failed
      ? (detail.error || "GitHub returned an error. No TeamAi bind was written.")
      : "Install reached TeamAi. Bind still requires a signed-in POST with a Firebase ID token.";
  }
  if (meta) {
    const parts = [];
    if (detail.installationId) parts.push(`Installation ${detail.installationId}`);
    if (detail.setupAction) parts.push(`Setup ${detail.setupAction}`);
    parts.push("Not a Hero live bind");
    parts.push("No 029 production-release claim");
    meta.textContent = parts.join(" · ");
  }
}

function closeReceipt() {
  const host = document.querySelector("[data-github-install-receipt]");
  if (!host) return;
  host.hidden = true;
  host.setAttribute("aria-hidden", "true");
  host.dataset.githubInstallReceipt = "idle";
}

const detail = readInstallQuery();
if (detail) {
  renderReceipt(detail);
  stripReceiptParams();
}

document.querySelector("[data-receipt-close]")?.addEventListener("click", closeReceipt);

window.TeamAiGitHubInstallReceipt = {
  getState: () => {
    const host = document.querySelector("[data-github-install-receipt]");
    return {
      visible: host?.dataset.githubInstallReceipt === "shown" || host?.dataset.githubInstallReceipt === "error",
      bind: host?.dataset.conn3Bind || "none",
      presentationOnly: true,
      heroLiveBind: false,
    };
  },
  close: closeReceipt,
};
