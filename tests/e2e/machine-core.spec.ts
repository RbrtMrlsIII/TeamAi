import { expect, test } from '@playwright/test';

test.describe('Modular branch connection core', () => {
  test('renders the isolated 13-part core and supports expansion', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.getByText('BRANCH CONNECTION CORE')).toBeVisible();
    const canvas = page.locator('canvas[aria-label="3D modular branch connection core"]');
    await expect(canvas).toBeVisible();
    await expect(page.locator('[data-core-state]')).toHaveText('collapsed lattice · 13 independent modules');
    await page.getByRole('button', { name: 'Expand', exact: true }).click();
    await expect(page.locator('[data-core-state]')).toHaveText('expanded lattice · 13 independent modules');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.locator('[data-core-state]')).toHaveText('collapsed lattice · 13 independent modules');
  });

  test('has no production Hero surface or legacy tree navigation', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.locator('#hero-canvas')).toHaveCount(0);
    await expect(page.locator('[data-camera]')).toHaveCount(0);
    await expect(page.locator('text=BRANCH CONNECTION CORE')).toBeVisible();
  });
});
