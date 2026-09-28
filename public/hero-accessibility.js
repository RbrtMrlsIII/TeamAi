/**
 * S22 Accessibility baseline for the live Hero surface.
 *
 * Presentation-only. This layer improves keyboard operability and state
 * communication without changing machine semantics or backend authority.
 */

const DIALOGS = Object.freeze([
  { selector: '#hero-auth-panel', trigger: '[data-auth-open]', close: () => window.TeamAiHeroAuthHandoff?.close?.() },
  { selector: '#hero-settings-panel', trigger: '[data-settings-open]', close: () => document.getElementById('hero-settings-shell')?.click() },
  { selector: '#hero-workspace-facility', trigger: '[data-workspace-open]', close: () => window.TeamAiWorkspaceCapabilityFacility?.close?.() },
  { selector: '#hero-mcp-facility', trigger: '[data-mcp-open]', close: () => window.TeamAiMcpCapabilityFacility?.close?.() },
  { selector: '#hero-team-agents-facility', trigger: '[data-team-agents-open]', close: () => window.TeamAiTeamAgentsFacility?.close?.() },
  { selector: '#hero-storage-facility', trigger: '[data-storage-open]', close: () => window.TeamAiStorageInventoryFacility?.close?.() },
  { selector: '#hero-seat-budget-facility', trigger: '[data-seat-budget-open]', close: () => window.TeamAiSeatBudgetSettings?.close?.() },
  { selector: '#hero-marketplace-facility', trigger: '[data-marketplace-open]', close: () => window.TeamAiMarketplaceFacility?.close?.() },
]);

const MENU_ARROW_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);
const CHROME_ROOT = [
  'button',
  'a[href]',
  '[role="button"]',
  '.world-navigation',
  '.hero-controls',
  '.hero-settings-mount',
  '#hero-auth-panel',
  '#hero-settings-panel',
  '#hero-workspace-facility',
  '#hero-mcp-facility',
  '#hero-team-agents-facility',
  '#hero-storage-facility',
  '#hero-seat-budget-facility',
  '#hero-marketplace-facility',
].join(', ');

const lastTriggers = new Map();
const visibility = new Map();
const registered = new Set();

function isVisible(el) {
  return el instanceof Element && !el.hidden && el.getAttribute('aria-hidden') !== 'true';
}

function isEditableLike(target) {
  return target instanceof HTMLElement
    && (
      target.isContentEditable
      || target.matches('input, textarea, select, [contenteditable="true"], [role="textbox"]')
    );
}

function shouldIsolateSpatialShortcuts(target) {
  if (!(target instanceof HTMLElement) || isEditableLike(target)) return false;
  return Boolean(target.closest(CHROME_ROOT));
}

export function nextMenuIndex(current, length, key) {
  if (!Number.isInteger(length) || length <= 0) return 0;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  if (key !== 'ArrowDown' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowLeft') {
    return current >= 0 && current < length ? current : 0;
  }
  const forward = key === 'ArrowDown' || key === 'ArrowRight';
  if (current < 0 || current >= length) return forward ? 0 : length - 1;
  return (current + (forward ? 1 : -1) + length) % length;
}

function menuItems(popover) {
  if (!(popover instanceof Element)) return [];
  return [...popover.querySelectorAll('button')].filter((item) => (
    item instanceof HTMLButtonElement && !item.disabled && isVisible(item)
  ));
}

function moveMenuFocus(popover, key, from) {
  const items = menuItems(popover);
  if (!items.length) return;
  const current = from instanceof HTMLButtonElement ? items.indexOf(from) : -1;
  items[nextMenuIndex(current, items.length, key)]?.focus({ preventScroll: true });
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

function handleMenuKeys(event, target) {
  if (!MENU_ARROW_KEYS.has(event.key)) return false;
  const toggle = document.querySelector('[data-world-menu-toggle]');
  const popover = document.getElementById('world-menu');
  if (!(toggle instanceof HTMLElement) || !(popover instanceof HTMLElement)) return false;
  const open = popover.classList.contains('is-open') && isVisible(popover);
  if (!open) return false;
  if (!toggle.contains(target) && !popover.contains(target)) return false;
  event.preventDefault();
  event.stopPropagation();
  moveMenuFocus(popover, event.key, target);
  return true;
}

function handleChromeActivation(event, target) {
  if (event.key !== 'Enter' && event.key !== ' ') return false;
  if (!shouldIsolateSpatialShortcuts(target)) return false;
  const activation = target.closest('button, [role="button"]');
  if (!(activation instanceof HTMLButtonElement) || activation.disabled || event.defaultPrevented) {
    return false;
  }
  event.preventDefault();
  event.stopPropagation();
  activation.click();
  if (activation.matches('[data-world-menu-toggle]')) {
    queueMicrotask(() => {
      const popover = document.getElementById('world-menu');
      if (popover?.classList.contains('is-open')) {
        menuItems(popover)[0]?.focus({ preventScroll: true });
      }
    });
  }
  return true;
}

function handleKeydown(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (handleMenuKeys(event, target)) return;
  if (handleChromeActivation(event, target)) return;

  if (shouldIsolateSpatialShortcuts(target) && event.key !== 'Escape' && event.key !== 'Tab') {
    event.stopPropagation();
  }

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

if (typeof window !== 'undefined') {
  window.TeamAiHeroAccessibility = Object.freeze({
    refresh: observeDialogs,
    visibleDialog,
    nextMenuIndex,
  });
}
