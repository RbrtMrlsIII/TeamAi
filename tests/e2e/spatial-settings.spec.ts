import { expect, test } from '@playwright/test';

test.describe('Settings composition (presentation)', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('wide navigation opens Settings and shows unified visual facts', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await expect(page.locator('[data-settings-root]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.locator('[data-nav="settings"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('[data-setting-mode]')).toContainText(/dark|light/);
    await expect(page.locator('[data-setting-source]')).toContainText(/user|os/);
    await expect(page.locator('[data-setting-authority]')).toContainText('backend/system');
  });

  test('section selection remains presentation-only', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.locator('[data-settings-section="execution"]').click();
    await expect(page.locator('[data-settings-section="execution"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-settings-title]')).toHaveText('Execution boundaries');
    await expect(page.locator('[data-settings-status]')).toHaveText('backend-owned');
    await expect(page.locator('[data-settings-result]')).toContainText('No durable configuration');
  });

  test('preview reports current preferences without durable mutation', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.getByRole('button', { name: 'Preview current settings', exact: true }).click();
    await expect(page.locator('[data-settings-result]')).toContainText('Preview refreshed');
    await expect(page.locator('[data-settings-result]')).toContainText('No durable configuration was changed');
  });

  test('compact navigation reaches Settings without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(page.locator('[data-nav-menu]')).toBeVisible();
    await page.locator('[data-nav-menu]').selectOption('settings');
    await expect(page.locator('[data-settings-root]')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});
