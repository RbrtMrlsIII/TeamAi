import { expect, test } from '@playwright/test';

test.describe('Artifacts composition (presentation)', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('wide navigation opens Artifacts and shows evidence queue', async ({ page }) => {
    await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
    await expect(page.locator('[data-artifacts-root]')).toBeVisible();
    await expect(page.locator('[data-artifact]')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Artifacts' })).toBeVisible();
    await expect(page.locator('[data-nav="artifacts"]')).toHaveAttribute('aria-current', 'page');
  });

  test('artifact selection updates only the presentation detail', async ({ page }) => {
    await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
    await page.locator('[data-artifact="recovery-evidence"]').click();
    await expect(page.locator('[data-artifact="recovery-evidence"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-artifact-title]')).toHaveText('Recovery evidence bundle');
    await expect(page.locator('[data-artifact-status]')).toHaveText('blocked');
    await expect(page.locator('[data-artifact-event]')).toContainText('provider.connection.degraded');
    await expect(page.locator('[data-artifact-provenance]')).toContainText('recovery evidence');
  });

  test('preview record stays presentation-only', async ({ page }) => {
    await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
    await page.getByRole('button', { name: 'Preview record', exact: true }).click();
    await expect(page.locator('[data-artifact-result]')).toContainText('preview opened in UI only');
    await expect(page.locator('[data-artifact-result]')).toContainText('no durable record changed');
  });

  test('compact navigation reaches Artifacts without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(page.locator('[data-nav-menu]')).toBeVisible();
    await page.locator('[data-nav-menu]').selectOption('artifacts');
    await expect(page.locator('[data-artifacts-root]')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});