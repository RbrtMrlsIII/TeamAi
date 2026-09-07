/**
 * TEAM-EXPERIENCE-029 — Per-seat provider API key bind client
 *
 * Draft stays local until Save. Save POSTs to Edge; response never includes full key.
 * Browser must not write Firestore secrets directly.
 */

/**
 * @typedef {object} SeatProviderKeyDraft
 * @property {string} seatId
 * @property {string} providerKind
 * @property {string} apiKey
 * @property {boolean} dirty
 */

/**
 * Create an empty local draft (not durable).
 * @param {Partial<SeatProviderKeyDraft>} [init]
 * @returns {SeatProviderKeyDraft}
 */
export function createProviderKeyDraft(init = {}) {
  return {
    seatId: String(init.seatId || ""),
    providerKind: String(init.providerKind || "openai"),
    apiKey: "",
    dirty: false,
  };
}

/**
 * Apply a local edit without persisting.
 * @param {SeatProviderKeyDraft} draft
 * @param {Partial<SeatProviderKeyDraft>} patch
 */
export function updateProviderKeyDraft(draft, patch) {
  const next = { ...draft, ...patch };
  if (patch.apiKey !== undefined || patch.providerKind !== undefined) next.dirty = true;
  return next;
}

/**
 * Discard draft key material.
 * @param {SeatProviderKeyDraft} draft
 */
export function discardProviderKeyDraft(draft) {
  return { ...draft, apiKey: "", dirty: false };
}

/**
 * Save draft to Edge bind endpoint. Clears local apiKey on success.
 * @param {object} input
 * @param {string} input.baseUrl
 * @param {string} input.idToken
 * @param {string} input.workplaceId
 * @param {string} input.projectId
 * @param {SeatProviderKeyDraft} input.draft
 * @param {typeof fetch} [input.fetchImpl]
 * @param {boolean} [input.clear]
 */
export async function saveProviderKeyBinding(input) {
  const baseUrl = String(input.baseUrl || "").replace(/\/$/, "");
  if (!baseUrl) throw new Error("baseUrl_required");
  if (!input.idToken) throw new Error("idToken_required");
  if (!input.workplaceId || !input.projectId) throw new Error("workplace_project_required");
  if (!input.clear && (!input.draft?.apiKey || input.draft.apiKey.trim().length < 8)) {
    throw new Error("apiKey_required");
  }

  const fetchImpl = input.fetchImpl || fetch;
  const response = await fetchImpl(`${baseUrl}/teamai-seat-provider-bind`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${input.idToken}`,
    },
    body: JSON.stringify({
      workplaceId: input.workplaceId,
      projectId: input.projectId,
      seatId: input.draft.seatId,
      providerKind: input.draft.providerKind,
      apiKey: input.clear ? "" : input.draft.apiKey,
      clear: Boolean(input.clear),
    }),
  });

  if (!response.ok) {
    const err = new Error(`seat_provider_bind_http_${response.status}`);
    err.status = response.status;
    try {
      err.body = await response.json();
    } catch {
      /* ignore */
    }
    throw err;
  }

  const body = await response.json();
  return {
    response: body,
    draft: discardProviderKeyDraft(input.draft),
  };
}
