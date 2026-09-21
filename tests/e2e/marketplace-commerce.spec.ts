import { expect, test } from '@playwright/test';

test('Marketplace reveals Team Quality and nine-tier Team Population catalog for guests', async ({ page }) => {
  await page.goto('/hero/');
  await page.locator('[data-world-menu-toggle]').click();
  await page.locator('[data-marketplace-open]').click();

  const facility = page.locator('#hero-marketplace-facility');
  await expect(facility).toBeVisible();
  await expect(facility.locator('[data-marketplace-module="team-quality"]')).toContainText('Team Quality');
  await expect(facility.locator('[data-marketplace-module="team-population"]')).toContainText('Team Population');

  await facility.locator('[data-marketplace-module="team-population"]').click();
  await expect(facility.locator('[data-marketplace-tier]')).toHaveCount(9);
  await expect(facility.locator('[data-marketplace-tier="1"]').locator('xpath=..')).toContainText('Seat 2');
  await expect(facility.locator('[data-marketplace-tier="9"]').locator('xpath=..')).toContainText('Seat 10');
  await expect(facility.locator('[data-marketplace-billing]')).toContainText('no card credentials');
  await expect(facility.locator('[data-marketplace-commerce-status]')).toHaveText('unauthorized/read-blocked');
  await expect(facility.locator('[data-marketplace-checkout]')).toBeDisabled();
});

test('Marketplace shows higher-tier replacement warning inline and locks lower tiers', async ({ page }) => {
  await page.goto('/hero/');
  await page.locator('[data-world-menu-toggle]').click();
  await page.locator('[data-marketplace-open]').click();

  await page.evaluate(() => {
    window.TeamAiMarketplaceFacility?.setPresentationAuthState(true);
    window.TeamAiMarketplaceFacility?.setPresentationReadModel({
      activeTeamPopulationTier: 2,
      commerceStatus: 'pending',
      teamAiEntitlement: 'active',
      providerEntitlement: 'separate / externally evaluated',
      billingUrl: 'https://billing.example.test/portal',
    });
  });

  const facility = page.locator('#hero-marketplace-facility');
  await facility.locator('[data-marketplace-module="team-population"]').click();
  await facility.locator('[data-marketplace-tier="4"]').click();
  await expect(facility.locator('[data-marketplace-warning]')).toContainText('lower tier');
  await expect(facility.locator('[data-marketplace-warning]')).toContainText('will disappear');
  await expect(facility.locator('[data-marketplace-checkout]')).toBeEnabled();

  await expect(facility.locator('[data-marketplace-tier="1"]')).toBeDisabled();
  await expect(facility.locator('[data-marketplace-tier="4"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(facility.locator('[data-marketplace-commerce-status]')).toHaveText('pending');
  await expect(facility.locator('[data-marketplace-teamai-entitlement]')).toContainText('active');
  await expect(facility.locator('[data-marketplace-provider-entitlement]')).toContainText('separate');
});

test('Marketplace auth handoff closes facility and shows authentication panel', async ({ page }) => {
  await page.goto('/hero/');
  await page.locator('[data-world-menu-toggle]').click();
  await page.locator('[data-marketplace-open]').click();

  await page.locator('[data-marketplace-auth]').click();
  await expect(page.locator('#hero-marketplace-facility')).toBeHidden();
  await expect(page.locator('#hero-auth-panel')).toBeVisible();
});
