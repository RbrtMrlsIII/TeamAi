import { expect, test } from '@playwright/test';

test.describe('F7 shared E4 plate (presentation)', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    // Deck starts with [hidden]; shell-nav.js unhides after module load
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('action cluster: open, Escape closes, no domain claim', async ({ page }) => {
    const modal = page.locator('[data-field="F7"]');
    await expect(modal).toBeHidden();

    await page.getByRole('button', { name: 'Preview approval plate' }).click();
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(modal).toHaveAttribute('data-modal-cluster', 'action');
    await expect(page.getByRole('button', { name: 'DENY' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'APPROVE' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('action cluster: DENY records UI-only result', async ({ page }) => {
    await page.getByRole('button', { name: 'Preview approval plate' }).click();
    await page.getByRole('button', { name: 'DENY' }).click();
    await expect(page.locator('[data-field="F7"]')).toBeHidden();
    await expect(page.locator('[data-modal-result]')).toContainText('DENY');
    await expect(page.locator('[data-modal-result]')).toContainText('no domain');
  });

  test('handoff cluster: REJECT · EDIT · MORE · APPROVE visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Preview planning handoff' }).click();
    const modal = page.locator('[data-field="F7"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('data-modal-cluster', 'handoff');
    await expect(page.getByRole('button', { name: 'REJECT' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'EDIT' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'MORE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'APPROVE' })).toBeVisible();
    await expect(modal.locator('[data-modal-action]:visible')).toHaveCount(5);
  });

  test('handoff: MORE dismisses without approve language', async ({ page }) => {
    await page.getByRole('button', { name: 'Preview planning handoff' }).click();
    await page.getByRole('button', { name: 'MORE' }).click();
    await expect(page.locator('[data-field="F7"]')).toBeHidden();
    await expect(page.locator('[data-modal-result]')).toContainText('MORE');
    await expect(page.locator('[data-modal-result]')).not.toContainText('APPROVE');
  });
});
