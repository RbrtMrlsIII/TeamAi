import { expect, test } from '@playwright/test';

test.describe('Seats / Provider composition', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('navigation opens the Seat Plate with binding, quality, limits, and entitlement split', async ({ page }) => {
    await page.getByRole('button', { name: 'Seats', exact: true }).click();
    const seats = page.locator('[data-seats-root]');
    await expect(seats).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Seats / Provider', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Alpha/ }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Alpha', exact: true })).toBeVisible();
    await expect(page.getByText('Team Quality', { exact: true })).toBeVisible();
    await expect(page.getByText('Tool Quality', { exact: true })).toBeVisible();
    await expect(page.getByText('Limits', { exact: true })).toBeVisible();
    await expect(page.getByText('Entitlement split', { exact: true })).toBeVisible();
    await expect(page.getByText('TeamAi entitlement', { exact: true })).toBeVisible();
    await expect(page.getByText('Provider entitlement', { exact: true })).toBeVisible();
  });

  test('seat selection changes the presentation detail without claiming scheduler authority', async ({ page }) => {
    await page.getByRole('button', { name: 'Seats', exact: true }).click();
    const gamma = page.locator('[data-seat-page="gamma"]');
    await gamma.click();
    await expect(gamma).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('heading', { name: 'Gamma', exact: true })).toBeVisible();
    await expect(page.locator('[data-seat-detail-connection]')).toHaveText('degraded');
    await expect(page.locator('[data-seat-provider-entitlement]')).toHaveText('review');
    await expect(page.locator('[data-seat-result]')).toHaveText('');
  });

  test('Activate is enabled only when displayed connection and both entitlements allow it', async ({ page }) => {
    await page.getByRole('button', { name: 'Seats', exact: true }).click();
    const activate = page.getByRole('button', { name: 'Activate Seat', exact: true });
    await expect(activate).toBeEnabled();

    await page.locator('[data-seat-page="gamma"]').click();
    await expect(activate).toBeDisabled();

    await page.locator('[data-seat-page="alpha"]').click();
    await expect(activate).toBeEnabled();
    await activate.click();
    await expect(page.locator('[data-field="F7"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Activate Alpha', exact: true })).toBeVisible();
    await expect(page.locator('[data-modal-impact]')).toContainText('No provider connection is changed');
  });

  test('Test Connection is UI-only and compact Seats has no document overflow', async ({ page }) => {
    await page.getByRole('button', { name: 'Seats', exact: true }).click();
    await page.getByRole('button', { name: 'Test Connection', exact: true }).click();
    await expect(page.locator('[data-seat-result]')).toContainText('connection test passed in UI only');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('[data-nav-menu]').selectOption('seats');
    await expect(page.locator('[data-seats-root]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
