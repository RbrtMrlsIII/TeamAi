import { expect, test } from '@playwright/test';

test.describe('Modular branch connection core', () => {
  test('renders the isolated 15-part ten-seat core and supports expansion', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.getByText('BRANCH CONNECTION CORE')).toBeVisible();
    await expect(page.getByText('15 modules · 10 seats · 4 outer housings · 1 hub')).toBeVisible();
    const canvas = page.locator('canvas[aria-label="3D modular branch connection core"]');
    await expect(canvas).toBeVisible();
    await expect(page.locator('[data-core-state]')).toHaveText('collapsed lattice · 15 independent modules');
    await page.getByRole('button', { name: 'Expand', exact: true }).click();
    await expect(page.locator('[data-core-state]')).toHaveText('expanded lattice · 15 independent modules');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.locator('[data-core-state]')).toHaveText('collapsed lattice · 15 independent modules');
  });

  test('renders eight seats through the same parameterized core', async ({ page }) => {
    await page.goto('/machine-core-preview.html?seats=8');
    await expect(page.locator('[data-core-count]')).toHaveText('13 modules · 8 seats · 4 outer housings · 1 hub');
    await expect(page.locator('[data-core-state]')).toHaveText('collapsed lattice · 13 independent modules');
  });

  test('has no production Hero surface or legacy tree navigation', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.locator('#hero-canvas')).toHaveCount(0);
    await expect(page.locator('[data-camera]')).toHaveCount(0);
    await expect(page.locator('text=BRANCH CONNECTION CORE')).toBeVisible();
  });
});
