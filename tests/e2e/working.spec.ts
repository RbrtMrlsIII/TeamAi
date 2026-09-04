import { expect, test } from '@playwright/test';

test.describe('Working composition', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('opens execution workspace without becoming scheduler authority', async ({ page }) => {
    await page.getByLabel('Primary').getByRole('button', { name: 'Working', exact: true }).click();
    const working = page.locator('[data-working-root]');
    await expect(working).toBeVisible();
    await expect(working.getByRole('heading', { name: 'Execution workspace', exact: true })).toBeVisible();
    await expect(working.getByText('Approved planning handoff carried into Working.', { exact: false })).toBeVisible();
    await expect(working.getByText('Scheduler owns task eligibility and next-actor selection', { exact: true })).toBeVisible();
    await expect(working.getByText('Scheduler decides; not selected by this UI', { exact: true })).toBeVisible();
  });

  test('uses shared F7 action plate without executing the proposal', async ({ page }) => {
    await page.getByLabel('Primary').getByRole('button', { name: 'Working', exact: true }).click();
    const working = page.locator('[data-working-root]');
    await working.getByRole('button', { name: 'Preview approval plate', exact: true }).click();
    const modal = page.locator('[data-field="F7"]');
    await expect(modal).toBeVisible();
    const actionCluster = modal.locator('[data-cluster="action"]');
    await expect(actionCluster.getByRole('button', { name: 'DENY', exact: true })).toBeVisible();
    await expect(actionCluster.getByRole('button', { name: 'APPROVE', exact: true })).toBeVisible();
    await expect(modal.getByText('Beta · worker · Provider Two · Model B', { exact: false })).toBeVisible();
    await expect(modal.getByText('Approving does not run tools, write Firestore, or charge PayPal.', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('compact Working has no document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('[data-nav-menu]').selectOption('working');
    const working = page.locator('[data-working-root]');
    await expect(working).toBeVisible();
    await expect(working.locator('[data-field="F3"]').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
