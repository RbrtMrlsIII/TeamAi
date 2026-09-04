import { expect, test } from '@playwright/test';

test.describe('Planning composition', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/spatial/');
    expect(response?.ok(), `GET /spatial/ status ${response?.status()}`).toBeTruthy();
    await expect(page.locator('[data-deck-root]')).toBeVisible({ timeout: 15_000 });
  });

  test('opens the full deliberation surface without becoming chat', async ({ page }) => {
    await page.getByRole('button', { name: 'Planning', exact: true }).click();
    const planning = page.locator('[data-planning-root]');
    await expect(planning).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Deliberation', exact: true })).toBeVisible();
    await expect(planning.getByText('Human instruction', { exact: true })).toBeVisible();
    await expect(planning.getByText('Alpha · current speaker', { exact: true })).toBeVisible();
    await expect(planning.getByText('Beta · prior contribution', { exact: true })).toBeVisible();
    await expect(planning.getByRole('heading', { name: 'Turn plan', exact: true })).toBeVisible();
    await expect(planning.getByText('Next turn', { exact: true })).toBeVisible();
    await expect(planning.getByText('Scheduler decides', { exact: true })).toBeVisible();
    await expect(planning.getByRole('heading', { name: 'Planning handoff', exact: true })).toBeVisible();
    await expect(planning.locator('textarea[data-planning-input]')).toBeVisible();
  });

  test('instruction preview updates presentation only', async ({ page }) => {
    await page.getByRole('button', { name: 'Planning', exact: true }).click();
    const planning = page.locator('[data-planning-root]');
    const input = planning.locator('textarea[data-planning-input]');
    await input.fill('Preserve the dependency chain and document unresolved provider capability evidence.');
    await planning.getByRole('button', { name: 'Preview instruction', exact: true }).click();
    await expect(planning.locator('[data-human-message]')).toHaveText('Preserve the dependency chain and document unresolved provider capability evidence.');
    await expect(planning.locator('[data-planning-status]')).toContainText('UI only');
    await expect(planning.getByText('Scheduler decides', { exact: true })).toBeVisible();
  });

  test('uses the shared F7 handoff plate', async ({ page }) => {
    await page.getByRole('button', { name: 'Planning', exact: true }).click();
    const planning = page.locator('[data-planning-root]');
    await planning.getByRole('button', { name: 'Review handoff', exact: true }).click();
    const modal = page.locator('[data-field="F7"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('[data-modal-cluster="handoff"]').or(modal.locator('[data-cluster="handoff"]'))).toBeVisible();
    await expect(modal.getByRole('button', { name: 'REJECT', exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'EDIT', exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'MORE', exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'APPROVE', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('compact Planning has no document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('[data-nav-menu]').selectOption('planning');
    const planning = page.locator('[data-planning-root]');
    await expect(planning).toBeVisible();
    await expect(planning.locator('[data-field="F3"]').nth(1)).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
