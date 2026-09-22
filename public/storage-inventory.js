/**
 * TeamAi Storage item-inventory presentation contract for Issue #400.
 *
 * This module is intentionally read-model only:
 * - it does not read Firestore directly;
 * - it does not call Supabase Storage;
 * - it does not upload, mutate, or transfer content;
 * - authoritative authorization, entitlement, health, inventory, and content
 *   ownership remain backend-owned.
 */
export const STORAGE_FEATURE_ID = 'storage';
export const STORAGE_CONTENT_AUTHORITY = 'supabase-storage';
export const STORAGE_BRANCH_PREFIX = 'BRANCH-STORAGE::';

export const STORAGE_INVENTORY_STATES = Object.freeze([
  'DISCOVERABLE_LOCKED',
  'AUTHENTICATED_READ_MODEL_REQUIRED',
  'READY',
  'BLOCKED',
  'ERROR',
]);

function requireNonEmpty(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function optionalString(value) {
  if (typeof value !== 'string') return null;
  const next = value.trim();
  return next || null;
}

export function normalizeStorageItem(value) {
  if (!value || typeof value !== 'object') throw new Error('storage item must be an object');
  const item = value;

  const normalized = {
    id: requireNonEmpty(item.id, 'item.id'),
    label: requireNonEmpty(item.label, 'item.label'),
    kind: optionalString(item.kind) || 'item',
    source: optionalString(item.source) || 'authorized-backend',
    projectId: optionalString(item.projectId),
    workspaceId: optionalString(item.workspaceId),
    updatedAt: optionalString(item.updatedAt),
    sizeLabel: optionalString(item.sizeLabel),
    status: optionalString(item.status) || 'AVAILABLE',
    provenance: optionalString(item.provenance) || 'backend-read-model',
  };

  return Object.freeze(normalized);
}

export function normalizeStorageInventoryReadModel(value = {}) {
  if (!value || typeof value !== 'object') throw new Error('storage read model must be an object');
  const input = value;
  const rawItems = Array.isArray(input.items) ? input.items : [];

  return Object.freeze({
    inventoryKnown: Boolean(input.inventoryKnown),
    authorized: Boolean(input.authorized),
    entitled: Boolean(input.entitled),
    healthy: Boolean(input.healthy),
    source: optionalString(input.source) || 'unavailable',
    items: Object.freeze(rawItems.map(normalizeStorageItem)),
  });
}

export function resolveStorageInventoryReadiness({
  authenticated = false,
  inventoryKnown = false,
  authorized = false,
  entitled = false,
  healthy = false,
} = {}) {
  if (!authenticated) return 'DISCOVERABLE_LOCKED';
  if (!inventoryKnown) return 'AUTHENTICATED_READ_MODEL_REQUIRED';
  if (!healthy) return 'ERROR';
  if (!authorized || !entitled) return 'BLOCKED';
  return 'READY';
}

export function createStorageItemBranch({
  itemId,
  workspaceId = 'workspace-main',
  projectId = 'command-deck',
} = {}) {
  return Object.freeze({
    id: `${STORAGE_BRANCH_PREFIX}item/${requireNonEmpty(itemId, 'itemId')}/workspace/${requireNonEmpty(workspaceId, 'workspaceId')}/project/${requireNonEmpty(projectId, 'projectId')}/inventory`,
    owner: requireNonEmpty(itemId, 'itemId'),
    workspaceId: requireNonEmpty(workspaceId, 'workspaceId'),
    projectId: requireNonEmpty(projectId, 'projectId'),
    purpose: 'inventory',
    presentationOnly: true,
  });
}
