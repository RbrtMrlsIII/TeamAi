import { expect, test } from '@playwright/test';

test.describe('Command Deck inhabited skeleton', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('shows the persistent shell, navigation, and inhabited deck regions', async ({ page }) => {
    await expect(page.locator('[data-field="F1"]')).toBeVisible();
    await expect(page.locator('[data-field="F2"]')).toBeVisible();
    await expect(page.locator('[data-field="F3"][aria-label="Seat rail"]')).toBeVisible();
    await expect(page.locator('[data-field="F3"][aria-labelledby="active-title"]')).toBeVisible();
    const whyNext = page.locator('[data-field="F3"][aria-label="Why next"]');
    await expect(whyNext).toBeVisible();
    await expect(page.locator('[data-field="F6"][aria-label="System status"]')).toBeVisible();

    await expect(whyNext.getByText('Dependency', { exact: true })).toBeVisible();
    await expect(whyNext.getByText('Event', { exact: true })).toBeVisible();
    await expect(whyNext.getByText('Readiness', { exact: true })).toBeVisible();
    await expect(whyNext.getByText('Scheduler', { exact: true })).toBeVisible();
    await expect(whyNext.getByText('Capability gate', { exact: true })).toBeVisible();
  });

  test('keeps Planning and Working as one E3 stage', async ({ page }) => {
    const active = page.locator('[aria-labelledby="active-title"]');
    const stageToggle = active.getByRole('group', { name: 'Planning or Working stage' });
    const planning = page.locator('[data-stage-panel="planning"]');
    const working = page.locator('[data-stage-panel="working"]');

    await expect(planning).toBeVisible();
    await expect(working).toBeHidden();

    await stageToggle.getByRole('button', { name: 'Working' }).click();
    await expect(planning).toBeHidden();
    await expect(working).toBeVisible();
    await expect(stageToggle.getByRole('button', { name: 'Working' })).toHaveAttribute('aria-pressed', 'true');
    await expect(stageToggle.getByRole('button', { name: 'Planning' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('seat selection changes display state without claiming scheduler authority', async ({ page }) => {
    const deck = page.locator('[data-deck-root]');
    const beta = deck.locator('[data-seat="beta"]');
    const alpha = deck.locator('[data-seat="alpha"]');
    await beta.click();
    await expect(beta).toHaveAttribute('aria-pressed', 'true');
    await expect(beta).toHaveAttribute('data-state', 'selected');
    await expect(page.getByText('Scheduler owns next-actor selection', { exact: true })).toBeVisible();
  });

  test('compact viewport has no horizontal overflow and exposes compact navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });

    await expect(page.locator('[data-nav-wide]')).toBeHidden();
    await expect(page.locator('[data-nav-compact]')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
