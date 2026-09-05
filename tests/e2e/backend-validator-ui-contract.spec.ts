import { test, expect } from '@playwright/test';

test('backend validator presentation contract exposes backend-owned facts without side effects', async ({ page }) => {
  await page.goto('/spatial/backend-validator-contract.html');

  await expect(page.locator('[data-validator-status]')).toHaveText('VALID');
  await expect(page.locator('[data-fact-task]')).toHaveText('task-1');
  await expect(page.locator('[data-fact-status]')).toHaveText('running');
  await expect(page.locator('[data-fact-approved]')).toHaveText('approved');
  await expect(page.locator('[data-fact-seat]')).toHaveText('seat-a');
  await expect(page.locator('[data-fact-provider]')).toHaveText('provider-a');
  await expect(page.locator('[data-fact-connection]')).toHaveText('ready');
  await expect(page.locator('[data-fact-source]')).toHaveText('fixture');
  await expect(page.locator('[data-validator-message]')).toContainText('passes the presentation contract');
  await expect(page.locator('[data-field="F6"]')).toContainText('Execution state remains backend-owned');
  await expect(page.locator('[data-field="F6"]')).toContainText('No scheduler selection, provider invocation, Firestore write');
});
