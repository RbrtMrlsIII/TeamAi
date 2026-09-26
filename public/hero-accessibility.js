/**
 * S22 Accessibility baseline for the live Hero surface.
 *
 * Presentation-only. This layer improves keyboard operability and state
 * communication without changing machine semantics or backend authority.
 */

const DIALOGS = Object.freeze([
  { selector: '#hero-auth-panel', trigger: '[data-auth-open]', close: () => window.TeamAiHeroAuthHandoff?.close?.() },
  { selector: '#hero-settings-panel', trigger: '[data-settings-open], #hero-settings-shell', close: () => document.getElementById('hero-settings-shell')?.click() },
  { selector: '#hero-workspace-facility', trigger: '[data-workspace-open]', close: () => window.TeamAiWorkspaceCapabilityFacility?.close?.() },
  { selector: '#hero-mcp-facility', trigger: '[data-mcp-open]', close: () => window.TeamAiMcpCapabilityFacility?.close?.() },
  { selector: '#hero-team-agents-facility', trigger: '[data-team-agents-open]', close: () => window.TeamAiTeamAgentsFacility?.close?.() },
  { selector: '#hero-storage-facility', trigger: '[data-storage-open]', close: () => window.TeamAiStorageInventoryFacility?.close?.() },
  { selector: '#hero-seat-budget-facility', trigger: '[data-seat-budget-open]', close: () => window.TeamAiSeatBudgetSettings?.close?.() },
  { selector: '#hero-marketplace-facility', trigger: '[data-marketplace-open]', close: () => window.TeamAiMarketplaceFacility?.close?.() },
]);

const lastTriggers = new Map();
const visibility = new Map();
const registered = new Set();

function isVisible(el) {
  return el instanceof Element && !el.hidden && el.getAttribute('aria-hidden') !== 'true';
}

function visibleDialog() {
  for (let index = DIALOGS.length - 1; index >= 0; index -= 1) {
    const dialog = document.querySelector(DIALOGS[index].selector);
    if (isVisible(dialog)) return { dialog, controller: DIALOGS[index] };
  }
  return null;
}

function rememberTrigger(dialog) {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body && !dialog.contains(active)) {
    lastTriggers.set(dialog, active);
  }
}

function restoreTrigger(dialog) {
  const trigger = lastTriggers.get(dialog);
  lastTriggers.delete(dialog);
  if (trigger instanceof HTMLElement && trigger.isConnected && !trigger.hidden) {
    queueMicrotask(() => trigger.focus({ preventScroll: true }));
  }
}

function watchDialog(dialog) {
  if (registered.has(dialog)) return;
  registered.add(dialog);
  visibility.set(dialog, isVisible(dialog));
  const observer = new MutationObserver(() => {
    const previous = visibility.get(dialog) === true;
    const current = isVisible(dialog);
    if (previous === current) return;
    visibility.set(dialog, current);
    if (current) rememberTrigger(dialog);
    else restoreTrigger(dialog);
  });
  observer.observe(dialog, { attributes: true, attributeFilter: ['hidden', 'aria-hidden'] });
}

function observeDialogs() {
  DIALOGS.forEach(({ selector }) => {
    const dialog = document.querySelector(selector);
    if (dialog) watchDialog(dialog);
  });
}

function rememberTriggerFromClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  for (const entry of DIALOGS) {
    const trigger = target.closest(entry.trigger);
    if (!trigger) continue;
    const dialog = document.querySelector(entry.selector);
    if (dialog) lastTriggers.set(dialog, trigger);
  }
}

function handleKeydown(event) {
  if (event.key !== 'Escape') return;
  const active = visibleDialog();
  if (!active) return;
  event.preventDefault();
  event.stopPropagation();
  active.controller.close();
}

function publishTransactionState(detail = {}) {
  const state = String(detail.state || '').trim();
  const kind = String(detail.kind || '').trim();
  if (!state || !kind) return;

  const announcer = document.querySelector('[data-hero-accessibility-announcement]');
  if (!announcer) return;

  const label = kind.replaceAll('-', ' ');
  const reason = detail.errorCode ? ' · ' + String(detail.errorCode) : '';
  announcer.textContent = 'Seat transaction ' + label + ' is ' + state.replaceAll('_', ' ').toLowerCase() + reason + '.';
}

function ensureAnnouncementNode() {
  if (document.querySelector('[data-hero-accessibility-announcement]')) return;
  const node = document.createElement('div');
  node.dataset.heroAccessibilityAnnouncement = '';
  node.className = 'hero-accessibility-announcement';
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', 'polite');
  node.setAttribute('aria-atomic', 'true');
  node.textContent = '';
  document.body.append(node);
}

function boot() {
  ensureAnnouncementNode();
  observeDialogs();

  const dialogDiscovery = new MutationObserver(() => observeDialogs());
  dialogDiscovery.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', rememberTriggerFromClick, true);
  document.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('teamai:seat-transaction-presentation', (event) => {
    publishTransactionState(event.detail?.transaction || event.detail || {});
  });
  window.addEventListener('teamai:seat-transaction-state-change', (event) => {
    if (event.detail?.transaction) publishTransactionState(event.detail.transaction);
  });
  window.addEventListener('teamai:seat-task-evidence-runtime-read-model', (event) => {
    if (event.detail?.transaction) publishTransactionState(event.detail.transaction);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

window.TeamAiHeroAccessibility = Object.freeze({
  refresh: observeDialogs,
  visibleDialog,
});