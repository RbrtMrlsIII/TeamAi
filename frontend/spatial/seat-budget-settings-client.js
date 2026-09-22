/**
 * Trusted Seat Budget Settings runtime client.
 * Browser sends an authenticated intent to Supabase Edge; it never writes Firestore.
 */

function config() {
  const w = typeof globalThis !== 'undefined' ? globalThis : {};
  return {
    baseUrl: String(w.TEAMAI_SEAT_CONNECTION_BASE_URL || '').replace(/\/$/, ''),
    idToken: String(w.TEAMAI_FIREBASE_ID_TOKEN || '').trim(),
    workplaceId: String(w.TEAMAI_WORKPLACE_ID || '').trim(),
    projectId: String(w.TEAMAI_PROJECT_ID || '').trim(),
  };
}

async function request(input = {}, fetchImpl = fetch) {
  const cfg = config();
  if (!cfg.baseUrl) throw new Error('runtime_base_url_required');
  if (!cfg.idToken) throw new Error('firebase_id_token_required');
  if (!cfg.workplaceId || !cfg.projectId) throw new Error('workplace_project_required');
  if (!input.seatId) throw new Error('seatId_required');

  const response = await fetchImpl(`${cfg.baseUrl}/teamai-seat-budget-settings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${cfg.idToken}`,
    },
    body: JSON.stringify({
      action: input.action || 'get',
      workplaceId: cfg.workplaceId,
      projectId: cfg.projectId,
      seatId: input.seatId,
      patch: input.patch || undefined,
    }),
  });

  if (!response.ok) {
    const error = new Error(`seat_budget_settings_http_${response.status}`);
    error.status = response.status;
    try { error.body = await response.json(); } catch {}
    throw error;
  }

  return response.json();
}

export async function loadSeatBudgetSettings(input, fetchImpl = fetch) {
  return request({ ...input, action: 'get' }, fetchImpl);
}

export async function loadSeatBudgetRuntime(input, fetchImpl = fetch) {
  const cfg = config();
  if (!cfg.baseUrl) throw new Error('runtime_base_url_required');
  if (!cfg.idToken) throw new Error('firebase_id_token_required');
  if (!cfg.workplaceId || !cfg.projectId) throw new Error('workplace_project_required');
  if (!input?.seatId) throw new Error('seatId_required');

  const response = await fetchImpl(`${cfg.baseUrl}/teamai-seat-budget-runtime`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${cfg.idToken}`,
    },
    body: JSON.stringify({
      workplaceId: cfg.workplaceId,
      projectId: cfg.projectId,
      seatId: input.seatId,
    }),
  });

  if (!response.ok) {
    const error = new Error(`seat_budget_runtime_http_${response.status}`);
    error.status = response.status;
    try { error.body = await response.json(); } catch {}
    throw error;
  }
  return response.json();
}

export async function saveSeatBudgetSettings(input, fetchImpl = fetch) {
  if (!input?.patch || typeof input.patch !== 'object') throw new Error('patch_required');
  return request({ ...input, action: 'save' }, fetchImpl);
}

export function readSeatBudgetRuntimeConfig() {
  return Object.freeze(config());
}
