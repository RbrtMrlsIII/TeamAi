/**
 * Wire Seats plate provider key draft UI (Save / Clear).
 * Presentation + Edge Save only. No browser Firestore secret writes.
 */

import {
  createProviderKeyDraft,
  updateProviderKeyDraft,
  discardProviderKeyDraft,
  saveProviderKeyBinding,
} from "./seat-provider-bind-client.js";

let draft = createProviderKeyDraft({ seatId: "alpha", providerKind: "openai" });

function readBindConfig() {
  const w = globalThis;
  return {
    baseUrl: String(w.TEAMAI_SEAT_CONNECTION_BASE_URL || "").replace(/\/$/, ""),
    idToken: String(w.TEAMAI_FIREBASE_ID_TOKEN || "").trim(),
    workplaceId: w.TEAMAI_WORKPLACE_ID ? String(w.TEAMAI_WORKPLACE_ID).trim() : "",
    projectId: w.TEAMAI_PROJECT_ID ? String(w.TEAMAI_PROJECT_ID).trim() : "",
  };
}

function setStatus(text) {
  const el = document.querySelector("[data-seat-provider-bind-status]");
  if (el) el.textContent = text;
}

export function syncProviderBindSeat(seatId) {
  draft = updateProviderKeyDraft(draft, { seatId: seatId || draft.seatId });
  const seatInput = document.querySelector("[data-seat-provider-seat-id]");
  if (seatInput && seatId) seatInput.value = seatId;
}

export function mountProviderBindPanel(root) {
  if (!root || root.querySelector("[data-seat-provider-bind]")) return;

  const panel = document.createElement("section");
  panel.className = "ta-card";
  panel.dataset.seatProviderBind = "";
  panel.setAttribute("data-field", "F4");
  panel.innerHTML = `
    <h3 class="ta-type-label">Provider API key (this seat)</h3>
    <p class="ta-type-meta">Local draft until Save. Server stores encrypted key only. Not ChatGPT/Claude app login. Stub Test Connection needs no provider billing.</p>
    <label class="ta-type-meta" for="seat-provider-kind">Provider kind</label>
    <select id="seat-provider-kind" class="ta-control" data-seat-provider-kind>
      <option value="openai">openai</option>
      <option value="anthropic">anthropic</option>
      <option value="generic">generic</option>
    </select>
    <label class="ta-type-meta" for="seat-provider-key">API key (draft)</label>
    <input id="seat-provider-key" class="ta-control" type="password" autocomplete="off" data-seat-provider-key placeholder="sk-… (not saved until Save)" />
    <input type="hidden" data-seat-provider-seat-id value="alpha" />
    <div class="ta-seat-actions" style="margin-top:0.75rem">
      <button type="button" class="ta-control" data-field="F5" data-kind="primary" data-action="save-seat-provider-key">Save key</button>
      <button type="button" class="ta-control" data-field="F5" data-action="clear-seat-provider-key">Clear bound key</button>
      <button type="button" class="ta-control" data-field="F5" data-action="discard-seat-provider-draft">Discard draft</button>
    </div>
    <p class="ta-type-meta" data-seat-provider-bind-status role="status"></p>
  `;
  root.appendChild(panel);

  panel.querySelector("[data-seat-provider-kind]")?.addEventListener("change", (e) => {
    draft = updateProviderKeyDraft(draft, { providerKind: e.target.value });
  });
  panel.querySelector("[data-seat-provider-key]")?.addEventListener("input", (e) => {
    draft = updateProviderKeyDraft(draft, { apiKey: e.target.value });
  });
  panel.querySelector('[data-action="save-seat-provider-key"]')?.addEventListener("click", onSave);
  panel.querySelector('[data-action="clear-seat-provider-key"]')?.addEventListener("click", onClear);
  panel.querySelector('[data-action="discard-seat-provider-draft"]')?.addEventListener("click", onDiscard);
}

async function onSave() {
  const cfg = readBindConfig();
  const seatId =
    document.querySelector("[data-seat-provider-seat-id]")?.value ||
    draft.seatId ||
    "alpha";
  draft = updateProviderKeyDraft(draft, { seatId });
  if (!cfg.baseUrl || !cfg.idToken) {
    setStatus("Save needs TEAMAI_SEAT_CONNECTION_BASE_URL and TEAMAI_FIREBASE_ID_TOKEN (demo/operator config).");
    return;
  }
  if (!cfg.workplaceId || !cfg.projectId) {
    setStatus("Save needs TEAMAI_WORKPLACE_ID and TEAMAI_PROJECT_ID.");
    return;
  }
  setStatus("Saving key server-side…");
  try {
    const { response, draft: next } = await saveProviderKeyBinding({
      baseUrl: cfg.baseUrl,
      idToken: cfg.idToken,
      workplaceId: cfg.workplaceId,
      projectId: cfg.projectId,
      draft,
    });
    draft = next;
    const input = document.querySelector("[data-seat-provider-key]");
    if (input) input.value = "";
    setStatus(
      `Bound · kind ${response.providerKind || draft.providerKind} · last four …${response.providerKeyLastFour || "****"}. Full key not kept in browser.`,
    );
  } catch (err) {
    setStatus(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function onClear() {
  const cfg = readBindConfig();
  const seatId =
    document.querySelector("[data-seat-provider-seat-id]")?.value || draft.seatId || "alpha";
  draft = updateProviderKeyDraft(draft, { seatId });
  if (!cfg.baseUrl || !cfg.idToken || !cfg.workplaceId || !cfg.projectId) {
    setStatus("Clear needs base URL, token, workplaceId, projectId.");
    return;
  }
  setStatus("Clearing bound key…");
  try {
    await saveProviderKeyBinding({
      baseUrl: cfg.baseUrl,
      idToken: cfg.idToken,
      workplaceId: cfg.workplaceId,
      projectId: cfg.projectId,
      draft,
      clear: true,
    });
    draft = discardProviderKeyDraft(draft);
    const input = document.querySelector("[data-seat-provider-key]");
    if (input) input.value = "";
    setStatus("Bound key cleared on server (metadata). Draft emptied.");
  } catch (err) {
    setStatus(`Clear failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function onDiscard() {
  draft = discardProviderKeyDraft(draft);
  const input = document.querySelector("[data-seat-provider-key]");
  if (input) input.value = "";
  setStatus("Draft discarded (no server write).");
}

/** Call after Seats detail exists. */
export function ensureProviderBindOnSeatsPage() {
  const detail = document.querySelector(".ta-seats__detail");
  if (!detail) return;
  mountProviderBindPanel(detail);
  const active =
    document.querySelector('[data-seat-page][aria-pressed="true"]')?.getAttribute("data-seat-page") ||
    "alpha";
  syncProviderBindSeat(active);
}
