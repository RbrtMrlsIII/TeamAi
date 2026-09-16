import { expect, test } from '@playwright/test';

test('magnificent machine renderer presents the 15-module core and responds to expansion', async ({ page }) => {
  await page.goto('/machine-hero-magnificent.html');
  const canvas = page.locator('canvas[data-machine-magnificent]');
  await expect(canvas).toBeVisible();
  await expect(page.getByText('modular machine / 10 seats / 4 outer branches')).toBeVisible();
  await expect(page.getByText('prototype · not production')).toBeVisible();
  const state = page.locator('[data-state]');
  await expect(state).toHaveText('base geometry');
  await page.getByRole('button', { name: 'Expand machine' }).click();
  await expect(state).toHaveText('semantic divisions expanded');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(state).toHaveText('base geometry');
});
