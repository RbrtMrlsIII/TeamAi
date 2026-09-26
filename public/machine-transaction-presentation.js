import {
  createSeatTransactionPresentation,
  SEAT_TRANSACTION_KINDS,
} from './seat-runtime-presentation.js';
import { featureStateMetadata } from './feature-state.js';
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const TRANSACTION_ORB_CONTEXT = Object.freeze(
  createSpatialConstructionContext({
    slice: 'S21',
    owner: 'frontend/spatial/machine-transaction-presentation.js',
    semanticId: 'SEAT_TRANSACTION_LOADING',
    semanticBoundary: 'presentation-only',
  }),
);

const KIND_LABELS = Object.freeze({
  navigation: 'Navigation',
  retrieval: 'Data retrieval',
  'connection-test': 'Connection test',
  'mcp-invocation': 'MCP invocation',
  'ai-execution': 'AI execution',
  'handoff-continuation': 'Handoff / continuation',
  'storage-operation': 'Storage operation',
  'commerce-verification': 'Commerce verification',
  authorization: 'Authorization',
  recovery: 'Recovery',
});

const STATE_LABELS = Object.freeze({
  LOADING: 'Loading',
  ACTIVE: 'Active',
  READY: 'Ready',
  COMPLETED: 'Completed',
  HANDOFF: 'Handoff required',
  WAITING_FOR_CONTINUATION: 'Waiting for continuation',
  BLOCKED: 'Blocked',
  ERROR: 'Error',
  UNAVAILABLE: 'Unavailable',
});

function labelForKind(kind) {
  return KIND_LABELS[kind] || kind.replaceAll('-', ' ');
}

function normalize(value) {
  return createSeatTransactionPresentation(value || {});
}

function render(model) {
  const root = document.querySelector('[data-transaction-orb]');
  if (!root) return;

  if (!model) {
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    return;
  }

  const state = STATE_LABELS[model.state] || model.state;
  const meta = featureStateMetadata(model.state);

  root.hidden = false;
  root.setAttribute('aria-hidden', 'false');
  root.dataset.kind = model.kind;
  root.dataset.state = model.state;
  root.dataset.motion = meta.continuousMotionAllowed ? 'motion-allowed' : 'static';
  root.querySelector('[data-transaction-orb-label]').textContent = labelForKind(model.kind);
  root.querySelector('[data-transaction-orb-state]').textContent = state;
  root.querySelector('[data-transaction-orb-detail]').textContent = model.transactionId
    ? 'Transaction ' + model.transactionId
    : 'Presentation state supplied by the runtime read model';
  const progress = root.querySelector('[data-transaction-orb-progress]');
  if (model.progress == null) {
    progress.hidden = true;
    progress.style.setProperty('--transaction-progress', '0');
  } else {
    progress.hidden = false;
    progress.style.setProperty('--transaction-progress', String(model.progress));
  }
}

function mount(rootNode = document) {
  let root = rootNode.querySelector('[data-transaction-orb]');
  if (root) return root;

  root = document.createElement('section');
  root.className = 'hero-transaction-orb';
  root.setAttribute('data-transaction-orb', '');
  root.hidden = true;
  root.setAttribute('aria-hidden', 'true');
  root.setAttribute('aria-live', 'polite');
  root.setAttribute('aria-label', 'Seat transaction status');
  root.innerHTML =
    '<span class="hero-transaction-orb__glow" aria-hidden="true"></span>' +
    '<div class="hero-transaction-orb__copy">' +
      '<strong data-transaction-orb-label>Transaction</strong>' +
      '<span data-transaction-orb-state>Unavailable</span>' +
      '<small data-transaction-orb-detail>Presentation state supplied by the runtime read model</small>' +
    '</div>' +
    '<span class="hero-transaction-orb__progress" data-transaction-orb-progress hidden aria-hidden="true"></span>';

  rootNode.querySelector('.hero-shell')?.append(root);
  return root;
}

let current = null;

export function setSeatTransactionPresentation(input = {}) {
  current = normalize(input);
  render(current);
  return current;
}

export function getSeatTransactionPresentation() {
  return current;
}

export function clearSeatTransactionPresentation() {
  current = null;
  render(null);
}

export function mountSeatTransactionPresentation(rootNode = document) {
  return mount(rootNode);
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => mount(document));
}

if (typeof window !== 'undefined') {
  window.addEventListener('teamai:seat-transaction-presentation', (event) => {
    setSeatTransactionPresentation(event.detail?.transaction || event.detail || {});
  });

  window.TeamAiTransactionPresentation = Object.freeze({
    mount: mountSeatTransactionPresentation,
    set: setSeatTransactionPresentation,
    get: getSeatTransactionPresentation,
    clear: clearSeatTransactionPresentation,
    kinds: SEAT_TRANSACTION_KINDS.slice(),
  });
}
