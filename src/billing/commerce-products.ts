export type CommerceProductFamily = 'team-quality' | 'team-population';
export type MonthlyBillingCycle = 'monthly';
export type CommerceTransition =
  | 'BASELINE'
  | 'ELIGIBLE'
  | 'ACTIVE'
  | 'RENEWAL'
  | 'HIGHER_TIER_REPLACES_ACTIVE'
  | 'LOWER_TIER_LOCKED'
  | 'INVALID_REQUEST';

export const BASELINE_TEAM_QUALITY_TIER = 0;
export const BASELINE_TEAM_POPULATION_MAX_SEATS = 1;
export const TEAM_QUALITY_MAX_TIER = 5;
export const TEAM_POPULATION_MAX_TIER = 9;

export type CommerceOffer = Readonly<{
  id: string;
  family: CommerceProductFamily;
  tier: number;
  title: string;
  summary: string;
  guide: string;
  billingCycle: MonthlyBillingCycle;
  billingMode: 'external-hosted-page';
  cardStorage: 'none';
  maxPersistentSeats?: number;
}>;

const qualityOffers: CommerceOffer[] = Array.from({ length: TEAM_QUALITY_MAX_TIER }, (_, index) => {
  const tier = index + 1;
  return Object.freeze({
    id: `team-quality-tier-${tier}`,
    family: 'team-quality' as const,
    tier,
    title: `Team Quality Tier ${tier}`,
    summary: `TeamAi Quality allocation tier ${tier}.`,
    guide: `Tier ${tier} has its own Team Quality guide and entitlement projection. Exact capability limits are supplied by authoritative backend state, not calculated by the Marketplace.`,
    billingCycle: 'monthly' as const,
    billingMode: 'external-hosted-page' as const,
    cardStorage: 'none' as const,
  });
});

const populationOffers: CommerceOffer[] = Array.from({ length: TEAM_POPULATION_MAX_TIER }, (_, index) => {
  const tier = index + 1;
  const maxPersistentSeats = tier + 1;
  return Object.freeze({
    id: `team-population-tier-${tier}`,
    family: 'team-population' as const,
    tier,
    title: `Team Population Tier ${tier}`,
    summary: `Unlocks persistent Seat ${maxPersistentSeats}.`,
    guide: `Unlocks persistent TeamAi Seat ${maxPersistentSeats}. This subscription renews monthly; exact account usability remains subject to authoritative entitlement and authorization state.`,
    billingCycle: 'monthly' as const,
    billingMode: 'external-hosted-page' as const,
    cardStorage: 'none' as const,
    maxPersistentSeats,
  });
});

const OFFERS = Object.freeze([...qualityOffers, ...populationOffers]);
const OFFERS_BY_KEY = new Map(OFFERS.map((offer) => [offer.family + ':' + offer.tier, offer]));

function normalizeTier(value: number): number {
  if (!Number.isInteger(value)) return -1;
  return value;
}

function maxTier(family: CommerceProductFamily): number {
  return family === 'team-quality' ? TEAM_QUALITY_MAX_TIER : TEAM_POPULATION_MAX_TIER;
}

export function getCommerceOffer(family: CommerceProductFamily, tier: number): CommerceOffer | null {
  return OFFERS_BY_KEY.get(family + ':' + normalizeTier(tier)) ?? null;
}

export function listCommerceOffers(family?: CommerceProductFamily): CommerceOffer[] {
  if (!family) return OFFERS.slice();
  return OFFERS.filter((offer) => offer.family === family);
}

export function commerceBillingGuidance(): Readonly<{
  mode: 'external-hosted-page';
  cardStorage: 'none';
  text: string;
}> {
  return Object.freeze({
    mode: 'external-hosted-page',
    cardStorage: 'none',
    text: 'TeamAi does not store card credentials. Payment is completed on the external hosted billing page.',
  });
}

export function resolveCommerceTierChange(
  family: CommerceProductFamily,
  activeTier: number | null | undefined,
  requestedTier: number,
): Readonly<{
  family: CommerceProductFamily;
  activeTier: number;
  requestedTier: number;
  transition: CommerceTransition;
  canPurchase: boolean;
  warning: string | null;
}> {
  const requested = normalizeTier(requestedTier);
  const active = Math.max(0, Number.isInteger(activeTier) ? Number(activeTier) : 0);
  if (requested < 1 || requested > maxTier(family)) {
    return Object.freeze({
      family,
      activeTier: active,
      requestedTier: requested,
      transition: 'INVALID_REQUEST',
      canPurchase: false,
      warning: 'The requested tier is not part of the current TeamAi commerce catalog.',
    });
  }

  if (active === 0) {
    return Object.freeze({
      family,
      activeTier: active,
      requestedTier: requested,
      transition: 'ELIGIBLE',
      canPurchase: true,
      warning: null,
    });
  }

  if (requested === active) {
    return Object.freeze({
      family,
      activeTier: active,
      requestedTier: requested,
      transition: 'RENEWAL',
      canPurchase: true,
      warning: 'This is the currently active tier. Renewal continues its monthly subscription period.',
    });
  }

  if (requested < active) {
    return Object.freeze({
      family,
      activeTier: active,
      requestedTier: requested,
      transition: 'LOWER_TIER_LOCKED',
      canPurchase: false,
      warning: `Tier ${active} is active. Lower tiers remain locked for the current subscription period and cannot be purchased during that period.`,
    });
  }

  return Object.freeze({
    family,
    activeTier: active,
    requestedTier: requested,
    transition: 'HIGHER_TIER_REPLACES_ACTIVE',
    canPurchase: true,
    warning: `Tier ${requested} is higher than the active Tier ${active}. The lower tier's effect will disappear when Tier ${requested} takes effect. Review the change on the hosted billing page before completing the transaction.`,
  });
}
