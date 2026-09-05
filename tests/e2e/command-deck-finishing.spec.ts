import { expect, test, type Page } from '@playwright/test';

async function openDeck(page: Page) {
  const response = await page.goto('/spatial/');
  expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
  await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
}

test.describe('029 Command Deck finishing contract', () => {
  test('deck exposes the intended presentation hierarchy', async ({ page }) => {
    await openDeck(page);
    await expect(page.locator('[data-field="F3"][aria-label="Seat rail"]')).toBeVisible();
    await expect(page.getByLabel('Active')).toBeVisible();
    await expect(page.getByLabel('Why next')).toBeVisible();
    await expect(page.locator('[data-field="F6"][aria-label="System status"]')).toBeVisible();
  });

  test('current 029 navigation destinations expose their inhabited composition without stale placeholder copy', async ({ page }) => {
    await openDeck(page);
    const destinations = [
      ['Workplace', '[data-workplace-root]'],
      ['Seats', '[data-seats-root]'],
      ['Planning', '[data-planning-root]'],
      ['Working', '[data-working-root]'],
      ['Artifacts', '[data-artifacts-root]'],
      ['Approvals', '[data-approvals-root]'],
      ['Settings', '[data-settings-root]'],
    ] as const;

    for (const [destination, rootSelector] of destinations) {
      await page.getByRole('button', { name: destination, exact: true }).click();
      const root = page.locator(rootSelector);
      await expect(root).toBeVisible();
      await expect(root).toContainText(destination);
      await expect(page.locator('body')).not.toContainText('Composition not implemented yet');
    }

    await page.getByRole('button', { name: 'Deck', exact: true }).click();
    await expect(page.locator('[data-deck-root]')).toBeVisible();
    await expect(page.locator('[data-offdeck-root]')).toBeHidden();
  });

  test('F7 remains a single surface with one visible cluster', async ({ page }) => {
    await openDeck(page);
    const modal = page.locator('[data-field="F7"]');
    await page.getByLabel('Active').getByRole('button', { name: 'Preview approval plate', exact: true }).click();
    await expect(modal).toBeVisible();
    await expect(modal.locator('[data-cluster]:visible')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('compact mode preserves the deck without document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openDeck(page);
    await page.getByRole('button', { name: 'Toggle compact density' }).click();
    await expect(page.locator('[data-deck-root]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBeFalsy();
  });
});
