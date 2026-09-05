import { expect, test } from '@playwright/test';

test.describe('Approvals composition (presentation)', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('wide navigation opens Approvals and shows request queue', async ({ page }) => {
    await page.getByRole('button', { name: 'Approvals', exact: true }).click();
    await expect(page.locator('[data-approvals-root]')).toBeVisible();
    await expect(page.locator('[data-approval]')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'Approvals' })).toBeVisible();
    await expect(page.locator('[data-nav="approvals"]')).toHaveAttribute('aria-current', 'page');
  });

  test('queue selection updates the presentation detail only', async ({ page }) => {
    await page.getByRole('button', { name: 'Approvals', exact: true }).click();
    await page.locator('[data-approval="review-export"]').click();
    await expect(page.locator('[data-approval="review-export"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-approval-title]')).toHaveText('Export review package');
    await expect(page.locator('[data-approval-status]')).toHaveText('blocked');
    await expect(page.locator('[data-approval-not-runs]')).toContainText('No export');
  });

  test('Open decision plate reuses shared F7 and DENY remains UI-only', async ({ page }) => {
    await page.getByRole('button', { name: 'Approvals', exact: true }).click();
    await page.getByRole('button', { name: 'Open decision plate', exact: true }).click();

    const modal = page.locator('[data-field="F7"]');
    const actionCluster = modal.locator('[data-cluster="action"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(modal).toHaveAttribute('data-modal-cluster', 'action');
    await expect(actionCluster.getByRole('button', { name: 'DENY' })).toBeVisible();
    await expect(actionCluster.getByRole('button', { name: 'APPROVE' })).toBeVisible();

    await actionCluster.getByRole('button', { name: 'DENY' }).click();
    await expect(modal).toBeHidden();
    await expect(page.locator('[data-approval-result]')).toContainText('DENY');
    await expect(page.locator('[data-approval-result]')).toContainText('no domain');
    await expect(page.locator('[data-approval-result]')).toContainText('backend-owned');
  });

  test('compact navigation reaches Approvals without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(page.locator('[data-nav-menu]')).toBeVisible();
    await page.locator('[data-nav-menu]').selectOption('approvals');
    await expect(page.locator('[data-approvals-root]')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});
