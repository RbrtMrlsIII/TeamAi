import { createSpatialConstructionContext, validateSpatialConstructionNode } from './machine-spatial-root-contract.js';
import {
  createStorageItemBranch,
  normalizeStorageInventoryReadModel,
  resolveStorageInventoryReadiness,
} from './storage-inventory.js';

export const STORAGE_FACILITY_ROOT_ID = 'hero-storage-inventory-facility';

export const STORAGE_FACILITY_SPATIAL_CONTEXT = Object.freeze(
  createSpatialConstructionContext({
    slice: 'S18',
    owner: 'frontend/spatial/storage-inventory-facility.js',
    semanticId: STORAGE_FACILITY_ROOT_ID,
    semanticBoundary: 'presentation-only',
  }),
);

if (!validateSpatialConstructionNode(STORAGE_FACILITY_SPATIAL_CONTEXT).valid) {
  throw new Error('invalid S18 Storage spatial root contract');
}

let panel = null;
let activeItemId = null;
let workspaceId = 'workspace-main';
let projectId = 'command-deck';
let authenticated = false;

let readModel = normalizeStorageInventoryReadModel({
  inventoryKnown: false,
  authorized: false,
  entitled: false,
  healthy: false,
  source: 'unavailable',
  items: [],
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function currentItem() {
  const readiness = resolveStorageInventoryReadiness({
    authenticated,
    inventoryKnown: readModel.inventoryKnown,
    authorized: readModel.authorized,
    entitled: readModel.entitled,
    healthy: readModel.healthy,
  });
  if (readiness !== 'READY') return null;
  return readModel.items.find((item) => item.id === activeItemId) || readModel.items[0] || null;
}

function updateBranchPreview() {
  const field = panel?.querySelector('[data-storage-branch]');
  const note = panel?.querySelector('[data-storage-branch-note]');
  const item = currentItem();
  if (!field || !note) return;

  if (!item) {
    field.textContent = 'No inventory item selected';
    note.textContent = 'An authorized backend read model must provide an item before a semantic branch can be proposed.';
    return;
  }

  try {
    const branch = createStorageItemBranch({
      itemId: item.id,
      workspaceId: item.workspaceId || workspaceId,
      projectId: item.projectId || projectId,
    });
    field.textContent = branch.id;
    note.textContent = 'Item-owned inventory branch preview. Content authority and mutation remain backend-owned.';
  } catch {
    field.textContent = 'Item branch unavailable';
    note.textContent = 'A valid backend inventory item is required before a branch can be proposed.';
  }
}

function render() {
  const state = panel?.querySelector('[data-storage-state]');
  const inventory = panel?.querySelector('[data-storage-inventory]');
  const source = panel?.querySelector('[data-storage-source]');
  const auth = panel?.querySelector('[data-storage-auth]');
  const inspect = panel?.querySelector('[data-storage-inspect]');
  const result = panel?.querySelector('[data-storage-result]');
  if (!state || !inventory || !source || !auth || !inspect || !result) return;

  const readiness = resolveStorageInventoryReadiness({
    authenticated,
    inventoryKnown: readModel.inventoryKnown,
    authorized: readModel.authorized,
    entitled: readModel.entitled,
    healthy: readModel.healthy,
  });

  const stateLabels = {
    DISCOVERABLE_LOCKED: 'Guest · DISCOVERABLE LOCKED',
    AUTHENTICATED_READ_MODEL_REQUIRED: 'Authenticated · inventory read model required',
    READY: 'Authenticated · inventory ready',
    BLOCKED: 'Authenticated · inventory blocked',
    ERROR: 'Authenticated · inventory unavailable',
  };

  state.textContent = stateLabels[readiness];
  state.dataset.state = readiness;
  source.textContent = authenticated
    ? `Source: ${readModel.source}`
    : 'Source: hidden until authenticated read model is available';

  const visibleItems = readiness === 'READY' ? readModel.items : [];
  inventory.innerHTML = visibleItems.length
    ? visibleItems.map((item) => {
        const selected = item.id === activeItemId;
        const metadata = [
          item.kind,
          item.status,
          `artifact=${item.artifactState}`,
          item.sizeLabel,
        ].filter(Boolean).join(' · ');
        return '<button type="button" class="storage-inventory-facility__item' +
          (selected ? ' is-selected' : '') +
          '" data-storage-item="' + escapeHtml(item.id) +
          '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
          '<span class="storage-inventory-facility__item-name">' + escapeHtml(item.label) + '</span>' +
          '<span class="storage-inventory-facility__item-meta">' + escapeHtml(metadata || 'Inventory item') + '</span>' +
          '<span class="storage-inventory-facility__item-source">' + escapeHtml(item.source) + '</span>' +
          '</button>';
      }).join('')
    : '<div class="storage-inventory-facility__empty">No inventory items are available in the current authorized read model.</div>';

  auth.disabled = authenticated;
  inspect.disabled = !authenticated || readiness !== 'READY' || !currentItem();

  const item = currentItem();
  const details = panel?.querySelector('[data-storage-selected-item]');
  if (details) details.textContent = item ? item.label : 'None selected';

  updateBranchPreview();
}

function focusStorage() {
  const hero = window.TeamAiHero;
  if (hero && typeof hero.setCamera === 'function') hero.setCamera('DETAIL_ANCHOR');
  const result = panel?.querySelector('[data-storage-result]');
  if (result) result.textContent = 'Storage inventory focused. Camera state is presentation-only.';
}

function requestAuth() {
  closeStorageFacility();
  dispatch('teamai:app-ui-handoff', {
    appUiHandoff: true,
    normalUi: true,
    notAuthority: true,
    targetSection: 'auth',
    itemId: STORAGE_FACILITY_ROOT_ID + '#login',
    source: 'storage-inventory-facility',
  });
}

function requestInspect() {
  const item = currentItem();
  if (!item) return;

  dispatch('teamai:storage-item-intent', {
    intent: 'inspect',
    itemId: item.id,
    workspaceId: item.workspaceId || workspaceId,
    projectId: item.projectId || projectId,
    source: 'storage-inventory-facility',
  });

  const result = panel?.querySelector('[data-storage-result]');
  if (result) result.textContent = 'Storage item inspection intent requested. No content write or transfer occurs in this slice.';
}

function closeStorageFacility() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-storage-facility-open');
}

function openStorageFacility() {
  mountStorageFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-storage-facility-open', '1');
  render();
  panel.querySelector('[data-storage-close]')?.focus();
}

function build() {
  const el = document.createElement('section');
  el.id = STORAGE_FACILITY_ROOT_ID;
  el.className = 'storage-inventory-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'storage-inventory-title');
  el.innerHTML =
    '<div class="storage-inventory-facility__header">' +
      '<div><p class="storage-inventory-facility__eyebrow">Storage</p><h2 id="storage-inventory-title">Item inventory</h2></div>' +
      '<button type="button" data-storage-close aria-label="Close Storage item inventory">Close</button>' +
    '</div>' +
    '<p class="storage-inventory-facility__note">A first-class TeamAi inventory surface for entitled user content. This slice is read-only presentation: it does not read Firestore directly, call provider storage, upload files, transfer binaries, or write content.</p>' +
    '<div class="storage-inventory-facility__state-row"><span data-storage-state data-state="DISCOVERABLE_LOCKED">Guest · DISCOVERABLE LOCKED</span><span data-storage-source>Source: hidden until authenticated read model is available</span></div>' +
    '<section class="storage-inventory-facility__section" aria-labelledby="storage-inventory-list-title">' +
      '<div class="storage-inventory-facility__section-heading"><div><p class="storage-inventory-facility__eyebrow">Authorized inventory</p><h3 id="storage-inventory-list-title">Stored items</h3></div><span data-storage-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="storage-inventory-facility__inventory" data-storage-inventory role="list"></div>' +
    '</section>' +
    '<section class="storage-inventory-facility__section" aria-labelledby="storage-item-context-title">' +
      '<div class="storage-inventory-facility__section-heading"><div><p class="storage-inventory-facility__eyebrow">Item context</p><h3 id="storage-item-context-title">Selected item</h3></div><span data-storage-selected-item>None selected</span></div>' +
      '<code class="storage-inventory-facility__branch" data-storage-branch>No inventory item selected</code>' +
      '<p class="storage-inventory-facility__branch-note" data-storage-branch-note>An authorized backend read model must provide an item before a semantic branch can be proposed.</p>' +
    '</section>' +
    '<section class="storage-inventory-facility__boundary" aria-labelledby="storage-boundary-title">' +
      '<p class="storage-inventory-facility__eyebrow">Boundary</p>' +
      '<h3 id="storage-boundary-title">Content transfer is not part of this slice</h3>' +
      '<p>Upload, binary transfer, content writes, retention policy, quotas, and provider credentials remain separately governed backend concerns.</p>' +
    '</section>' +
    '<div class="storage-inventory-facility__actions">' +
      '<button type="button" data-storage-focus>Focus inventory</button>' +
      '<button type="button" data-storage-auth class="primary">Sign in to inspect</button>' +
      '<button type="button" data-storage-inspect class="primary" disabled>Inspect item</button>' +
      '<button type="button" data-storage-close>Back to world</button>' +
    '</div>';

  return el;
}

export function mountStorageFacility(rootNode = document) {
  if (panel) return panel;
  const host = rootNode.querySelector('.hero-shell');
  if (!host) return null;

  panel = build();
  host.append(panel);

  panel.querySelectorAll('[data-storage-close]').forEach((button) => button.addEventListener('click', closeStorageFacility));
  panel.querySelector('[data-storage-focus]')?.addEventListener('click', focusStorage);
  panel.querySelector('[data-storage-auth]')?.addEventListener('click', requestAuth);
  panel.querySelector('[data-storage-inspect]')?.addEventListener('click', requestInspect);

  panel.querySelector('[data-storage-inventory]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const id = target.closest('[data-storage-item]')?.getAttribute('data-storage-item');
    if (!id || !readModel.items.some((item) => item.id === id)) return;
    activeItemId = id;
    render();
  });

  render();
  return panel;
}

export function setStoragePresentationAuthState(value) {
  authenticated = Boolean(value);
  render();
}

export function setStoragePresentationReadModel(value = {}) {
  readModel = normalizeStorageInventoryReadModel(value);
  activeItemId = readModel.items[0]?.id || null;
  workspaceId = readModel.items[0]?.workspaceId || 'workspace-main';
  projectId = readModel.items[0]?.projectId || 'command-deck';
  render();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountStorageFacility(document);
    document.querySelector('[data-storage-open]')?.addEventListener('click', openStorageFacility);
    if (mounted) render();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiStorageInventoryFacility = Object.freeze({
    open: openStorageFacility,
    close: closeStorageFacility,
    mount: mountStorageFacility,
    setPresentationAuthState: setStoragePresentationAuthState,
    setPresentationReadModel: setStoragePresentationReadModel,
    focusStorage,
    getState: () => Object.freeze({
      authenticated,
      activeItemId,
      workspaceId,
      projectId,
      readModel: {
        ...readModel,
        items: readModel.items.slice(),
      },
    }),
  });
}
