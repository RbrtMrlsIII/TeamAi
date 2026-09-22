import {
  createSeatBudgetSaveIntent,
  normalizeSeatBudgetReadModel,
  seatBudgetEnergySegments,
} from './seat-budget-settings.js';

export const SEAT_BUDGET_FACILITY_ROOT_ID = 'hero-seat-budget-facility';

let panel = null;
let readModel = normalizeSeatBudgetReadModel();

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function stateLabel() {
  if (!readModel.available || !readModel.authorized) return 'Locked · backend read model required';
  if (readModel.state === 'HANDOFF') return 'Handoff · continuation reserve protected';
  if (readModel.state === 'EXHAUSTED') return 'Exhausted · waiting for continuation';
  if (readModel.state === 'COMPLETED') return 'Completed';
  if (readModel.state === 'BLOCKED') return 'Blocked';
  if (readModel.healthy) return 'Ready · server-authoritative accounting';
  return 'Unavailable · backend health degraded';
}

function currentPercent(value, total) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function selectedSeatId() {
  if (readModel.seatId) return readModel.seatId;
  const index = Number(globalThis.window?.TeamAiHero?.getSelectedSeat?.());
  return Number.isInteger(index) && index >= 0 ? `seat-${index + 1}` : null;
}

function editorValue(name) {
  return panel?.querySelector(`[data-seat-budget-input="${name}"]`)?.value ?? '';
}

function render() {
  if (!panel) return;
  const state = panel.querySelector('[data-seat-budget-state]');
  const title = panel.querySelector('[data-seat-budget-title]');
  const seat = panel.querySelector('[data-seat-budget-seat]');
  const responsibility = panel.querySelector('[data-seat-budget-responsibility]');
  const provider = panel.querySelector('[data-seat-budget-provider]');
  const budget = panel.querySelector('[data-seat-budget-total]');
  const output = panel.querySelector('[data-seat-budget-output]');
  const reasoning = panel.querySelector('[data-seat-budget-reasoning]');
  const reserve = panel.querySelector('[data-seat-budget-reserve]');
  const consumed = panel.querySelector('[data-seat-budget-consumed]');
  const remaining = panel.querySelector('[data-seat-budget-remaining]');
  const completion = panel.querySelector('[data-seat-budget-completion]');
  const continuation = panel.querySelector('[data-seat-budget-continuation]');
  const meter = panel.querySelector('[data-seat-budget-meter]');
  const note = panel.querySelector('[data-seat-budget-note]');
  const save = panel.querySelector('[data-seat-budget-save]');
  const turnBudgetInput = panel.querySelector('[data-seat-budget-input="turnBudgetTokens"]');
  const outputBudgetInput = panel.querySelector('[data-seat-budget-input="outputBudgetTokens"]');
  const reasoningBudgetInput = panel.querySelector('[data-seat-budget-input="reasoningBudgetTokens"]');
  const reserveInput = panel.querySelector('[data-seat-budget-input="handoffReserveTokens"]');
  const warningInput = panel.querySelector('[data-seat-budget-input="warningThresholdPercent"]');
  const hardStopInput = panel.querySelector('[data-seat-budget-input="hardStopPolicy"]');
  if (!state || !title || !seat || !responsibility || !provider || !budget || !output || !reasoning || !reserve || !consumed || !remaining || !completion || !continuation || !meter || !note || !save || !turnBudgetInput || !outputBudgetInput || !reasoningBudgetInput || !reserveInput || !warningInput || !hardStopInput) return;

  const locked = !readModel.available || !readModel.authorized;
  const editingDisabled = locked || !readModel.configurable;
  const segments = seatBudgetEnergySegments(readModel);
  const consumedPercent = currentPercent(readModel.consumedTokens, readModel.turnBudgetTokens);

  state.textContent = stateLabel();
  state.dataset.state = readModel.state;
  title.textContent = readModel.seatId ? `Seat Budget · ${readModel.seatId}` : 'Seat Budget';
  seat.textContent = readModel.seatId || 'Unavailable';
  responsibility.textContent = readModel.responsibilityProfile || 'Not configured';
  provider.textContent = [readModel.provider, readModel.model].filter(Boolean).join(' / ') || 'Provider route unavailable';
  budget.textContent = `${readModel.turnBudgetTokens.toLocaleString()} tokens`;
  output.textContent = `${readModel.outputBudgetTokens.toLocaleString()} tokens`;
  reasoning.textContent = `${readModel.reasoningBudgetTokens.toLocaleString()} tokens${readModel.reasoningUsedTokens ? ` · used ${readModel.reasoningUsedTokens.toLocaleString()}` : ''}`;
  reserve.textContent = `${readModel.handoffReserveTokens.toLocaleString()} tokens`;
  consumed.textContent = `${readModel.consumedTokens.toLocaleString()} tokens · ${consumedPercent}%`;
  remaining.textContent = `${readModel.remainingTokens.toLocaleString()} tokens`;
  completion.textContent = readModel.completionState || 'No terminal state recorded';
  continuation.textContent = readModel.continuationAvailable ? 'Available' : 'Not available';
  turnBudgetInput.value = String(readModel.turnBudgetTokens || '');
  outputBudgetInput.value = String(readModel.outputBudgetTokens || '');
  reasoningBudgetInput.value = String(readModel.reasoningBudgetTokens || '');
  reserveInput.value = String(readModel.handoffReserveTokens || '');
  warningInput.value = String(Math.round(readModel.warningThresholdPercent * 100));
  hardStopInput.value = readModel.hardStopPolicy;
  note.textContent = locked
    ? 'This surface does not infer or grant Seat configuration authority. An authenticated backend read model must provide the settings before they are shown as active.'
    : (readModel.reason || 'Server-authoritative budget accounting. Larger budgets do not guarantee completion.');

  meter.style.setProperty('--seat-budget-consumed', String(segments.consumedFraction));
  meter.style.setProperty('--seat-budget-reserve', String(segments.handoffReserveFraction));
  meter.style.setProperty('--seat-budget-remaining', String(segments.remainingFraction));
  save.disabled = editingDisabled;
  for (const input of [turnBudgetInput, outputBudgetInput, reasoningBudgetInput, reserveInput, warningInput, hardStopInput]) input.disabled = editingDisabled;
}

function open() {
  mountSeatBudgetFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-seat-budget-open', '1');
  render();
  dispatch('teamai:seat-budget-load-intent', { seatId: selectedSeatId() });
  panel.querySelector('[data-seat-budget-close]')?.focus();
}

function close() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-seat-budget-open');
}

function saveIntent() {
  const seatId = selectedSeatId();
  if (!seatId || !readModel.configurable) return;

  const numericFields = {
    turnBudgetTokens: Number(editorValue('turnBudgetTokens')),
    outputBudgetTokens: Number(editorValue('outputBudgetTokens')),
    reasoningBudgetTokens: Number(editorValue('reasoningBudgetTokens')),
    handoffReserveTokens: Number(editorValue('handoffReserveTokens')),
  };
  if (Object.values(numericFields).some((value) => !Number.isInteger(value) || value < 0)) {
    const result = panel?.querySelector('[data-seat-budget-result]');
    if (result) result.textContent = 'Enter non-negative whole-token values before saving.';
    return;
  }

  const warningPercent = Number(editorValue('warningThresholdPercent'));
  if (!Number.isFinite(warningPercent) || warningPercent < 0 || warningPercent > 100) {
    const result = panel?.querySelector('[data-seat-budget-result]');
    if (result) result.textContent = 'Warning threshold must be between 0 and 100 percent.';
    return;
  }

  const intent = createSeatBudgetSaveIntent({
    seatId,
    patch: {
      ...numericFields,
      warningThresholdPercent: warningPercent / 100,
      hardStopPolicy: editorValue('hardStopPolicy'),
      responsibilityProfile: readModel.responsibilityProfile,
      contextInputPolicy: readModel.contextInputPolicy,
    },
  });
  dispatch('teamai:seat-budget-save-intent', intent);
  const result = panel?.querySelector('[data-seat-budget-result]');
  if (result) result.textContent = 'Configuration intent dispatched. Durable persistence requires the trusted runtime configuration.';
}

function build() {
  const el = document.createElement('section');
  el.id = SEAT_BUDGET_FACILITY_ROOT_ID;
  el.className = 'seat-budget-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'seat-budget-title');
  el.innerHTML =
    '<div class="seat-budget-facility__header">' +
      '<div><p class="seat-budget-facility__eyebrow">Seat Settings</p><h2 id="seat-budget-title" data-seat-budget-title>Seat Budget</h2></div>' +
      '<button type="button" data-seat-budget-close aria-label="Close Seat Budget settings">Close</button>' +
    '</div>' +
    '<div class="seat-budget-facility__state" data-seat-budget-state data-state="UNAVAILABLE">Locked · backend read model required</div>' +
    '<p class="seat-budget-facility__note" data-seat-budget-note>Presentation only. No budget configuration is inferred from the browser.</p>' +
    '<dl class="seat-budget-facility__facts">' +
      '<div><dt>Seat</dt><dd data-seat-budget-seat>Unavailable</dd></div>' +
      '<div><dt>Responsibility</dt><dd data-seat-budget-responsibility>Not configured</dd></div>' +
      '<div><dt>Provider / model</dt><dd data-seat-budget-provider>Provider route unavailable</dd></div>' +
      '<div><dt>Turn Budget</dt><dd data-seat-budget-total>0 tokens</dd></div>' +
      '<div><dt>Work / Output Budget</dt><dd data-seat-budget-output>0 tokens</dd></div>' +
      '<div><dt>Reasoning Budget</dt><dd data-seat-budget-reasoning>0 tokens</dd></div>' +
      '<div><dt>Handoff Reserve</dt><dd data-seat-budget-reserve>0 tokens</dd></div>' +
      '<div><dt>Consumed</dt><dd data-seat-budget-consumed>0 tokens</dd></div>' +
      '<div><dt>Remaining usable</dt><dd data-seat-budget-remaining>0 tokens</dd></div>' +
      '<div><dt>Last completion state</dt><dd data-seat-budget-completion>No terminal state recorded</dd></div>' +
      '<div><dt>Continuation</dt><dd data-seat-budget-continuation>Not available</dd></div>' +
    '</dl>' +
    '<div class="seat-budget-facility__meter" data-seat-budget-meter role="img" aria-label="Seat budget energy bar">' +
      '<span class="seat-budget-facility__meter-consumed"></span><span class="seat-budget-facility__meter-reserve"></span><span class="seat-budget-facility__meter-remaining"></span>' +
    '</div>' +
    '<p class="seat-budget-facility__meter-caption">Consumed · protected handoff reserve · usable remaining. Live usage is reported separately by the active-turn runtime.</p>' +
    '<div class="seat-budget-facility__editor" aria-label="Edit Seat Budget configuration">' +
      '<label class="seat-budget-facility__field">Turn Budget (tokens)<input class="ta-control" data-seat-budget-input="turnBudgetTokens" type="number" min="1" step="1" value="0" /></label>' +
      '<label class="seat-budget-facility__field">Work / Output Budget<input class="ta-control" data-seat-budget-input="outputBudgetTokens" type="number" min="0" step="1" value="0" /></label>' +
      '<label class="seat-budget-facility__field">Reasoning Budget<input class="ta-control" data-seat-budget-input="reasoningBudgetTokens" type="number" min="0" step="1" value="0" /></label>' +
      '<label class="seat-budget-facility__field">Handoff Reserve<input class="ta-control" data-seat-budget-input="handoffReserveTokens" type="number" min="0" step="1" value="0" /></label>' +
      '<label class="seat-budget-facility__field">Warning Threshold (%)<input class="ta-control" data-seat-budget-input="warningThresholdPercent" type="number" min="0" max="100" step="1" value="80" /></label>' +
      '<label class="seat-budget-facility__field">Hard Stop Policy<select class="ta-control" data-seat-budget-input="hardStopPolicy"><option value="handoff-before-exhaustion">Handoff before exhaustion</option><option value="stop-at-limit">Stop at limit</option></select></label>' +
    '</div>' +
    '<div class="seat-budget-facility__actions">' +
      '<button type="button" data-seat-budget-save disabled>Request configuration save</button>' +
      '<button type="button" data-seat-budget-close>Back to world</button>' +
    '</div>' +
    '<p class="seat-budget-facility__result" data-seat-budget-result role="status">No durable configuration was changed.</p>';
  return el;
}

export function mountSeatBudgetFacility(root = document) {
  if (panel) return panel;
  const host = root.querySelector('.hero-shell');
  if (!host) return null;
  panel = build();
  host.append(panel);
  panel.querySelectorAll('[data-seat-budget-close]').forEach((button) => button.addEventListener('click', close));
  panel.querySelector('[data-seat-budget-save]')?.addEventListener('click', saveIntent);
  render();
  return panel;
}

export function setSeatBudgetReadModel(value = {}) {
  readModel = normalizeSeatBudgetReadModel(value);
  render();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    mountSeatBudgetFacility(document);
    document.querySelector('[data-seat-budget-open]')?.addEventListener('click', open);
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiSeatBudgetSettings = Object.freeze({
    open,
    close,
    mount: mountSeatBudgetFacility,
    setReadModel: setSeatBudgetReadModel,
    getReadModel: () => readModel,
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('teamai:seat-budget-runtime-read-model', (event) => {
    if (event.detail?.readModel) setSeatBudgetReadModel(event.detail.readModel);
  });
  window.addEventListener('teamai:seat-budget-runtime-status', (event) => {
    const result = document.querySelector('[data-seat-budget-result]');
    if (result && event.detail?.message) result.textContent = String(event.detail.message);
  });
}
