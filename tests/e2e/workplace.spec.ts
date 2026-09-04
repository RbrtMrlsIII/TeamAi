import { expect, test } from '@playwright/test';

test.describe('Workplace composition', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('navigation opens Workplace as an inhabited composition', async ({ page }) => {
    await page.getByRole('button', { name: 'Workplace', exact: true }).click();
    const workplace = page.locator('[data-workplace-root]');
    await expect(workplace).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Northstar Workplace' })).toBeVisible();
    await expect(workplace.locator('[data-project="command-deck"]')).toBeVisible();
    await expect(workplace.locator('[data-project="atlas"]')).toBeVisible();
    await expect(workplace.locator('[data-project="recovery"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Command Deck', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter Project', exact: true })).toBeVisible();
  });

  test('project selection changes Workplace detail without domain writes', async ({ page }) => {
    await page.getByRole('button', { name: 'Workplace', exact: true }).click();
    const atlas = page.locator('[data-project="atlas"]');
    await atlas.click();
    await expect(atlas).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('heading', { name: 'Atlas Migration', exact: true })).toBeVisible();
    await expect(page.locator('[data-project-result]')).toContainText('Atlas Migration selected in UI only');
  });

  test('Enter Project returns to Deck presentation', async ({ page }) => {
    await page.getByRole('button', { name: 'Workplace', exact: true }).click();
    await page.getByRole('button', { name: 'Enter Project', exact: true }).click();
    await expect(page.locator('[data-deck-root]')).toBeVisible();
    await expect(page.locator('[data-workplace-root]')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Deck', exact: true })).toHaveAttribute('aria-current', 'page');
  });

  test('compact Workplace fits without document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.getByRole('button', { name: 'Workplace', exact: true }).or(page.locator('[data-nav-menu]'))).toBeVisible();
    const menu = page.locator('[data-nav-menu]');
    await menu.selectOption('workplace');
    await expect(page.locator('[data-workplace-root]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
