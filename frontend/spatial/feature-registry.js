/**
 * TeamAi frontend feature registry.
 *
 * This is a presentation/navigation census for Issue #400.
 * It does not grant authorization, entitlement, scheduler eligibility, or
 * durable-state ownership. Feature ids here are product-feature ids, not
 * semantic tree ids.
 */
const freezeFeature = (feature) => Object.freeze({ ...feature });

export const TEAMAI_FRONTEND_FEATURES = Object.freeze([
  freezeFeature({ id: 'workspace-hq', label: 'Workspace HQ', surface: 'spatial+normal-ui', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'dynamic-target-owned' }),
  freezeFeature({ id: 'projects-library', label: 'Projects Library', surface: 'normal-ui', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'project-owned' }),
  freezeFeature({ id: 'artifacts-inventory', label: 'Artifacts / Inventory', surface: 'normal-ui+spatial-read-model', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'item-owned' }),
  freezeFeature({ id: 'storage', label: 'Storage', surface: 'normal-ui+spatial-read-model', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'item-owned' }),
  freezeFeature({ id: 'seats', label: 'Seats 1–10', surface: 'spatial+normal-ui', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'seat-owned' }),
  freezeFeature({ id: 'team-agents', label: 'Team / Agents', surface: 'normal-ui+spatial-handoff', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'role-owned' }),
  freezeFeature({ id: 'mcp-capability', label: 'MCP / Capability', surface: 'normal-ui+spatial-handoff', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'target-owned-recursive' }),
  freezeFeature({ id: 'skills-responsibility', label: 'Skills / Responsibility', surface: 'normal-ui+spatial-configuration', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'responsibility-owned' }),
  freezeFeature({ id: 'orchestration', label: 'Orchestration / Scheduler', surface: 'normal-ui+read-model', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'task-owned' }),
  freezeFeature({ id: 'marketplace', label: 'Marketplace / Commerce', surface: 'normal-ui+spatial-handoff', guest: 'discoverable-locked', authority: 'backend/commerce', branchModel: 'offer-owned' }),
  freezeFeature({ id: 'settings', label: 'Settings / Control', surface: 'normal-ui+spatial-handoff', guest: 'discoverable-locked', authority: 'backend/runtime', branchModel: 'category-owned' }),
  freezeFeature({ id: 'auth-gateway', label: 'Authentication Gateway', surface: 'normal-ui+spatial-handoff', guest: 'guest-action', authority: 'firebase-auth+backend/runtime', branchModel: 'gateway-owned' }),
]);

const FEATURE_BY_ID = new Map(TEAMAI_FRONTEND_FEATURES.map((feature) => [feature.id, feature]));

export function getFrontendFeature(id) {
  return FEATURE_BY_ID.get(String(id || '')) || null;
}

export function listFrontendFeatures() {
  return TEAMAI_FRONTEND_FEATURES.slice();
}

/**
 * Guest presentation is intentionally narrower than product authorization.
 * The frontend may show a complete feature vocabulary while keeping all
 * restricted facilities visibly locked until authoritative runtime state says otherwise.
 */
export function getGuestPresentationState(featureOrId) {
  const feature = typeof featureOrId === 'string'
    ? getFrontendFeature(featureOrId)
    : featureOrId;
  if (!feature) return null;
  return Object.freeze({
    featureId: feature.id,
    presentation: feature.guest === 'guest-action' ? 'GUEST_ACTION' : 'DISCOVERABLE_LOCKED',
    presentationOnly: true,
  });
}
