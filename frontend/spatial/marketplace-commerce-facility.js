import {
  createMarketplaceOfferBranch,
  getMarketplaceModule,
  getMarketplaceTier,
  listMarketplaceModules,
  listMarketplaceTiers,
  MARKETPLACE_ROOT_ID,
  resolveMarketplaceTierPresentation,
} from './marketplace-commerce.js';

let panel = null;
let activeFamily = 'team-quality';
let activeTier = 1;
let authenticated = false;
let readModel = {
  commerceStatus: 'unauthorized/read-blocked',
  teamAiEntitlement: 'unknown',
  providerEntitlement: 'separate',
  activeTeamQualityTier: 0,
  activeTeamPopulationTier: 0,
  billingUrl: null,
};

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function selectedTier() {
  return getMarketplaceTier(activeFamily, activeTier);
}

function activeTierForFamily() {
  return activeFamily === 'team-quality'
    ? readModel.activeTeamQualityTier
    : readModel.activeTeamPopulationTier;
}

function closeMarketplaceFacility() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-marketplace-open');
}

function requestAuth() {
  closeMarketplaceFacility();
  dispatch('teamai:app-ui-handoff', {
    appUiHandoff: true,
    normalUi: true,
    targetSection: 'auth',
    itemId: 'marketplace#login',
    source: 'marketplace-facility',
    notAuthority: true,
  });
}

function focusMarketplace() {
  const hero = window.TeamAiHero;
  if (hero && typeof hero.setCamera === 'function') hero.setCamera('DETAIL_ANCHOR');
  const status = panel?.querySelector('[data-marketplace-result]');
  if (status) status.textContent = 'Marketplace detail focused. Camera state is presentation-only.';
}

function openBilling() {
  const url = typeof readModel.billingUrl === 'string' ? readModel.billingUrl.trim() : '';
  if (!url || !/^https?:\/\//i.test(url)) {
    const status = panel?.querySelector('[data-marketplace-result]');
    if (status) status.textContent = 'Hosted billing link is not available in this read model.';
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function requestCheckoutIntent() {
  const offer = selectedTier();
  if (!offer) return;
  const decision = resolveMarketplaceTierPresentation({
    family: offer.family,
    activeTier: activeTierForFamily(),
    requestedTier: offer.tier,
  });
  if (!authenticated || !decision.canPurchase) return;
  dispatch('teamai:commerce-intent', {
    commerceIntent: true,
    featureId: 'marketplace',
    offerId: offer.id,
    productFamily: offer.family,
    tier: offer.tier,
    billingCycle: 'monthly',
    billingMode: 'external-hosted-page',
    cardStorage: 'none',
    transition: decision.state,
    branchId: createMarketplaceOfferBranch({ family: offer.family, tier: offer.tier }).id,
    source: 'marketplace-facility',
    notPaymentAuthority: true,
    notEntitlementAuthority: true,
    notDurableState: true,
  });
  const status = panel?.querySelector('[data-marketplace-result]');
  if (status) status.textContent = 'Commerce intent requested. Payment and entitlement remain backend/provider-controlled.';
}

function renderTierList() {
  const inventory = panel?.querySelector('[data-marketplace-tiers]');
  if (!inventory) return;
  const entitlementTier = activeTierForFamily();
  inventory.innerHTML = listMarketplaceTiers(activeFamily).map((tier) => {
    const selected = tier.tier === activeTier;
    const entitled = tier.tier === entitlementTier;
    const decision = resolveMarketplaceTierPresentation({
      family: activeFamily,
      activeTier: entitlementTier,
      requestedTier: tier.tier,
    });
    const state = entitled ? 'ACTIVE' : decision.state;
    const disabled = decision.canPurchase === false && !selected;
    return '<article class="marketplace-facility__tier' + (selected ? ' is-active' : '') + '">' +
      '<div class="marketplace-facility__tier-heading">' +
        '<div><strong>' + tier.label + '</strong><span>' + tier.summary + '</span></div>' +
        '<span class="marketplace-facility__tier-state" data-state="' + state + '">' + state + '</span>' +
      '</div>' +
      '<p>' + tier.guide + '</p>' +
      (tier.seat ? '<p class="marketplace-facility__effect">Persistent capacity effect: Seat ' + tier.seat + '</p>' : '') +
      '<button type="button" data-marketplace-tier="' + tier.tier + '"' +
        (disabled ? ' disabled' : '') +
        (selected ? ' aria-pressed="true"' : ' aria-pressed="false"') +
        '>Select tier</button>' +
    '</article>';
  }).join('');
}

function render() {
  const state = panel?.querySelector('[data-marketplace-state]');
  const modules = panel?.querySelector('[data-marketplace-modules]');
  const result = panel?.querySelector('[data-marketplace-result]');
  const checkout = panel?.querySelector('[data-marketplace-checkout]');
  const warning = panel?.querySelector('[data-marketplace-warning]');
  const teamAi = panel?.querySelector('[data-marketplace-teamai-entitlement]');
  const provider = panel?.querySelector('[data-marketplace-provider-entitlement]');
  const billing = panel?.querySelector('[data-marketplace-billing]');
  if (!state || !modules || !result || !checkout || !warning || !teamAi || !provider || !billing) return;

  state.textContent = authenticated
    ? 'Authenticated context · backend commerce read model required'
    : 'Guest · DISCOVERABLE LOCKED';
  state.dataset.state = authenticated ? 'BACKEND_STATE_REQUIRED' : 'DISCOVERABLE_LOCKED';

  modules.innerHTML = listMarketplaceModules().map((module) => {
    const selected = module.id === activeFamily;
    return '<button type="button" class="marketplace-facility__module' +
      (selected ? ' is-selected' : '') +
      '" data-marketplace-module="' + module.id + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
        '<strong>' + module.label + '</strong><span>' + module.summary + '</span>' +
    '</button>';
  }).join('');

  const offer = selectedTier();
  const branch = offer ? createMarketplaceOfferBranch({ family: activeFamily, tier: offer.tier }) : null;
  const decision = offer
    ? resolveMarketplaceTierPresentation({
        family: activeFamily,
        activeTier: activeTierForFamily(),
        requestedTier: offer.tier,
      })
    : null;

  warning.hidden = !decision?.warning;
  warning.textContent = decision?.warning || '';
  checkout.disabled = !authenticated || !offer || !decision?.canPurchase;
  billing.textContent = readModel.billingUrl
    ? 'Hosted billing is available. TeamAi stores no card credentials.'
    : 'Hosted billing link is supplied by authorized backend state when available.';
  teamAi.textContent = authenticated ? String(readModel.teamAiEntitlement) : 'not verified in guest context';
  provider.textContent = String(readModel.providerEntitlement || 'separate external entitlement');
  if (offer && branch) {
    panel.querySelector('[data-marketplace-branch]').textContent = branch.id;
    panel.querySelector('[data-marketplace-guide]').textContent = offer.guide;
  }
  result.textContent = authenticated
    ? 'Commerce and entitlement are read-model state. This facility cannot self-authorize them.'
    : 'Browse the catalog without receiving commerce capability.';
  renderTierList();
}

function build() {
  const el = document.createElement('section');
  el.id = MARKETPLACE_ROOT_ID;
  el.className = 'marketplace-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-labelledby', 'marketplace-facility-title');
  el.innerHTML =
    '<div class="marketplace-facility__header">' +
      '<div><p class="marketplace-facility__eyebrow">TeamAi Marketplace</p><h2 id="marketplace-facility-title">Commerce & Entitlement</h2></div>' +
      '<button type="button" data-marketplace-close aria-label="Close Marketplace">Close</button>' +
    '</div>' +
    '<p class="marketplace-facility__note">Marketplace reveals two commercial modules. Subscription state, entitlement, authorization, and payment authority remain outside the browser presentation.</p>' +
    '<div class="marketplace-facility__state-row"><span data-marketplace-state data-state="DISCOVERABLE_LOCKED">Guest · DISCOVERABLE LOCKED</span><span>Presentation only</span></div>' +
    '<div class="marketplace-facility__modules" data-marketplace-modules role="list"></div>' +
    '<section class="marketplace-facility__section" aria-labelledby="marketplace-tiers-title">' +
      '<div class="marketplace-facility__section-heading"><div><p class="marketplace-facility__eyebrow">Subscription tiers</p><h3 id="marketplace-tiers-title">Choose a tier to inspect its guide</h3></div><span data-marketplace-result role="status">Browse the catalog without receiving commerce capability.</span></div>' +
      '<div class="marketplace-facility__tiers" data-marketplace-tiers></div>' +
      '<aside class="marketplace-facility__warning" data-marketplace-warning hidden role="alert"></aside>' +
    '</section>' +
    '<section class="marketplace-facility__section" aria-labelledby="marketplace-entitlement-title">' +
      '<div class="marketplace-facility__section-heading"><div><p class="marketplace-facility__eyebrow">Authority separation</p><h3 id="marketplace-entitlement-title">Entitlement read model</h3></div></div>' +
      '<div class="marketplace-facility__entitlements">' +
        '<div><span>TeamAi entitlement</span><strong data-marketplace-teamai-entitlement>not verified in guest context</strong></div>' +
        '<div><span>Provider entitlement</span><strong data-marketplace-provider-entitlement>separate external entitlement</strong></div>' +
      '</div>' +
    '</section>' +
    '<section class="marketplace-facility__section" aria-labelledby="marketplace-offer-title">' +
      '<div class="marketplace-facility__section-heading"><div><p class="marketplace-facility__eyebrow">Offer-owned branch</p><h3 id="marketplace-offer-title">Guide / scope</h3></div><span>Dynamic offer-owned</span></div>' +
      '<code class="marketplace-facility__branch" data-marketplace-branch>BRANCH-MARKETPLACE::team-quality-tier-1/guide</code>' +
      '<p data-marketplace-guide>Tier guide is presentation-only.</p>' +
    '</section>' +
    '<section class="marketplace-facility__billing" aria-labelledby="marketplace-billing-title">' +
      '<h3 id="marketplace-billing-title">Hosted billing</h3>' +
      '<p data-marketplace-billing>Hosted billing link is supplied by authorized backend state when available.</p>' +
      '<p>No card number, security code, or card credential is collected or stored by this facility.</p>' +
    '</section>' +
    '<div class="marketplace-facility__actions">' +
      '<button type="button" data-marketplace-focus>Focus marketplace</button>' +
      '<button type="button" data-marketplace-auth class="primary">Sign in to continue</button>' +
      '<button type="button" data-marketplace-checkout class="primary">Request checkout intent</button>' +
      '<button type="button" data-marketplace-billing-open>Open billing page</button>' +
      '<button type="button" data-marketplace-close>Back to world</button>' +
    '</div>';
  return el;
}

function openMarketplaceFacility() {
  mountMarketplaceFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-marketplace-open', '1');
  render();
  panel.querySelector('[data-marketplace-close]')?.focus();
}

function mountMarketplaceFacility(rootNode = document) {
  if (panel) return panel;
  const host = rootNode.querySelector('.hero-shell');
  if (!host) return null;
  panel = build();
  host.append(panel);
  panel.querySelectorAll('[data-marketplace-close]').forEach((button) => button.addEventListener('click', closeMarketplaceFacility));
  panel.querySelector('[data-marketplace-focus]')?.addEventListener('click', focusMarketplace);
  panel.querySelector('[data-marketplace-auth]')?.addEventListener('click', requestAuth);
  panel.querySelector('[data-marketplace-checkout]')?.addEventListener('click', requestCheckoutIntent);
  panel.querySelector('[data-marketplace-billing-open]')?.addEventListener('click', openBilling);
  panel.querySelector('[data-marketplace-modules]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const family = target.closest('[data-marketplace-module]')?.getAttribute('data-marketplace-module');
    if (!getMarketplaceModule(family)) return;
    activeFamily = family;
    activeTier = 1;
    render();
  });
  panel.querySelector('[data-marketplace-tiers]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const next = Number(target.closest('[data-marketplace-tier]')?.getAttribute('data-marketplace-tier'));
    if (!Number.isInteger(next) || !getMarketplaceTier(activeFamily, next)) return;
    const decision = resolveMarketplaceTierPresentation({
      family: activeFamily,
      activeTier: activeTierForFamily(),
      requestedTier: next,
    });
    if (!decision.canPurchase && next !== activeTierForFamily()) return;
    activeTier = next;
    render();
  });
  render();
  return panel;
}

export function setMarketplacePresentationAuthState(value) {
  authenticated = Boolean(value);
  render();
}

export function setMarketplacePresentationReadModel(value = {}) {
  readModel = {
    commerceStatus: String(value.commerceStatus || 'unauthorized/read-blocked'),
    teamAiEntitlement: String(value.teamAiEntitlement || 'unknown'),
    providerEntitlement: String(value.providerEntitlement || 'separate external entitlement'),
    activeTeamQualityTier: Number.isInteger(value.activeTeamQualityTier) ? value.activeTeamQualityTier : 0,
    activeTeamPopulationTier: Number.isInteger(value.activeTeamPopulationTier) ? value.activeTeamPopulationTier : 0,
    billingUrl: typeof value.billingUrl === 'string' ? value.billingUrl : null,
  };
  render();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountMarketplaceFacility(document);
    document.querySelector('[data-marketplace-open]')?.addEventListener('click', openMarketplaceFacility);
    if (mounted) render();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiMarketplaceFacility = Object.freeze({
    open: openMarketplaceFacility,
    close: closeMarketplaceFacility,
    mount: mountMarketplaceFacility,
    setPresentationAuthState: setMarketplacePresentationAuthState,
    setPresentationReadModel: setMarketplacePresentationReadModel,
    focusMarketplace,
    getState: () => Object.freeze({ authenticated, activeFamily, activeTier, readModel: { ...readModel } }),
  });
}
