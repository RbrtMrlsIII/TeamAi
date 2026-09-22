import {
  loadSeatBudgetSettings,
  saveSeatBudgetSettings,
  readSeatBudgetRuntimeConfig,
} from './seat-budget-settings-client.js';

function dispatch(name, detail = {}) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function toReadModel(body = {}) {
  return {
    available: body.available === true,
    authorized: body.authorized === true,
    configurable: body.configurable === true,
    healthy: body.healthy !== false,
    seatId: body.seatId,
    provider: body.provider,
    model: body.model,
    configured: body.configured,
    usage: body.usage || null,
    state: body.usage ? 'READY' : 'READY',
    completionState: body.completionState || null,
    continuationAvailable: body.continuationAvailable === true,
    reason: body.reason,
    source: body.source || 'runtime',
  };
}

function runtimeConfigured() {
  const cfg = readSeatBudgetRuntimeConfig();
  return Boolean(cfg.baseUrl && cfg.idToken && cfg.workplaceId && cfg.projectId);
}

function status(message, state = 'LOADING') {
  dispatch('teamai:seat-budget-runtime-status', { message, state });
}

async function handleLoad(event) {
  const seatId = String(event.detail?.seatId || '').trim();
  if (!seatId || !runtimeConfigured()) return;
  status('Loading canonical Seat budget…');
  try {
    const body = await loadSeatBudgetSettings({ seatId });
    dispatch('teamai:seat-budget-runtime-read-model', { readModel: toReadModel(body) });
    status('Loaded from canonical Seat budget.', 'READY');
  } catch (error) {
    dispatch('teamai:seat-budget-runtime-read-model', {
      readModel: {
        available: true,
        authorized: false,
        configurable: false,
        healthy: false,
        seatId,
        configured: {},
        usage: null,
        state: 'BLOCKED',
        reason: error instanceof Error ? error.message : String(error),
      },
    });
    status(`Load failed: ${error instanceof Error ? error.message : String(error)}`, 'ERROR');
  }
}

async function handleSave(event) {
  const intent = event.detail || {};
  const seatId = String(intent.seatId || '').trim();
  if (!seatId || !runtimeConfigured()) return;
  status('Saving Seat budget configuration…');
  try {
    const body = await saveSeatBudgetSettings({ seatId, patch: intent.patch || {} });
    dispatch('teamai:seat-budget-runtime-read-model', { readModel: toReadModel(body) });
    status('Seat budget saved to canonical Firestore.', 'READY');
  } catch (error) {
    status(`Save failed: ${error instanceof Error ? error.message : String(error)}`, 'ERROR');
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('teamai:seat-budget-load-intent', handleLoad);
  window.addEventListener('teamai:seat-budget-save-intent', handleSave);
}
