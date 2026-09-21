export const MARKETPLACE_FEATURE_ID = 'marketplace';
export const MARKETPLACE_ROOT_ID = 'hero-marketplace-facility';

export const MARKETPLACE_MODULES = Object.freeze([
  Object.freeze({
    id: 'team-quality',
    label: 'Team Quality',
    summary: 'TeamAi teamwork quality and capacity subscription.',
    guide: 'Five paid Team Quality tiers are presented here. Exact capability limits come from the authorized entitlement read model.',
    tierCount: 5,
  }),
  Object.freeze({
    id: 'team-population',
    label: 'Team Population',
    summary: 'Persistent Seat capacity unlocked one Seat at a time.',
    guide: 'Nine paid population tiers unlock Seats 2 through 10. Each tier renews monthly.',
    tierCount: 9,
  }),
]);

const MODULE_BY_ID = new Map(MARKETPLACE_MODULES.map((module) => [module.id, module]));

const qualityTiers = Object.freeze(Array.from({ length: 5 }, (_, index) => {
  const tier = index + 1;
  return Object.freeze({
    family: 'team-quality',
    tier,
    id: 'team-quality-tier-' + tier,
    label: 'Team Quality Tier ' + tier,
    summary: 'TeamAi Quality allocation tier ' + tier + '.',
    guide: 'This tier has its own Team Quality guide. Exact capability limits are supplied by authoritative entitlement state.',
  });
}));

const populationTiers = Object.freeze(Array.from({ length: 9 }, (_, index) => {
  const tier = index + 1;
  const seat = tier + 1;
  return Object.freeze({
    family: 'team-population',
    tier,
    id: 'team-population-tier-' + tier,
    label: 'Team Population Tier ' + tier,
    summary: 'Unlocks persistent Seat ' + seat + '.',
    guide: 'This monthly tier unlocks persistent Seat ' + seat + '.',
    seat,
  });
}));

export const MARKETPLACE_TIERS = Object.freeze({
  'team-quality': qualityTiers,
  'team-population': populationTiers,
});

export function getMarketplaceModule(id) {
  return MODULE_BY_ID.get(String(id || '')) || null;
}

export function listMarketplaceModules() {
  return MARKETPLACE_MODULES.slice();
}

export function listMarketplaceTiers(family) {
  return MARKETPLACE_TIERS[family] ? MARKETPLACE_TIERS[family].slice() : [];
}

export function getMarketplaceTier(family, tier) {
  return listMarketplaceTiers(family).find((item) => item.tier === Number(tier)) || null;
}

export function createMarketplaceOfferBranch({ family = 'team-quality', tier = 1, path = ['guide'] } = {}) {
  const offer = getMarketplaceTier(family, tier);
  if (!offer) throw new Error('unknown marketplace offer');
  const segments = Array.isArray(path)
    ? path.map((value) => String(value || '').trim()).filter(Boolean)
    : [];
  return Object.freeze({
    id: 'BRANCH-MARKETPLACE::' + offer.id + '/' + segments.join('/'),
    featureId: MARKETPLACE_FEATURE_ID,
    family: offer.family,
    tier: offer.tier,
    offerId: offer.id,
    path: Object.freeze(segments),
    semanticOwner: 'MARKETPLACE',
    presentationOnly: true,
    notEntitlementAuthority: true,
    notCommerceAuthority: true,
    notPaymentAuthority: true,
  });
}

export function resolveMarketplaceTierPresentation({ family, activeTier = 0, requestedTier } = {}) {
  const offer = getMarketplaceTier(family, requestedTier);
  const active = Math.max(0, Number.isInteger(activeTier) ? activeTier : 0);
  if (!offer) return Object.freeze({
    state: 'INVALID_REQUEST',
    canPurchase: false,
    warning: 'Offer unavailable in the current presentation catalog.',
  });
  if (active === 0) return Object.freeze({
    state: 'ELIGIBLE',
    canPurchase: true,
    warning: null,
  });
  if (offer.tier === active) return Object.freeze({
    state: 'RENEWAL',
    canPurchase: true,
    warning: 'This is the currently active tier. Renewal continues the monthly subscription period.',
  });
  if (offer.tier < active) return Object.freeze({
    state: 'LOWER_TIER_LOCKED',
    canPurchase: false,
    warning: 'Lower tiers remain locked for the current subscription period while a higher tier is active.',
  });
  return Object.freeze({
    state: 'HIGHER_TIER_REPLACES_ACTIVE',
    canPurchase: true,
    warning: 'The current lower tier effect will disappear when the higher tier takes effect. Review the change on the hosted billing page before completing the transaction.',
  });
}
