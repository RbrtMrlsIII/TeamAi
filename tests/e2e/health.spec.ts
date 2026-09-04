import { expect, test } from '@playwright/test';

test('TeamAi browser verification foundation reaches the health endpoint', async ({ page }) => {
  const response = await page.goto('/health');

  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toContainText('"ok":true');
});
