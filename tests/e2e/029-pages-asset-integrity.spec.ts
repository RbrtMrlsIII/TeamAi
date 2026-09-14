import { expect, test } from '@playwright/test';

test('029 published spatial ESM dependencies resolve without 404s', async ({ page, request }) => {
  const response = await request.get('/frontend/spatial/theme-root.js');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('javascript');

  const lightingResponse = await request.get('/frontend/spatial/hero-theme-lighting-adapter.js');
  expect(lightingResponse.status()).toBe(200);
  expect(lightingResponse.headers()['content-type']).toContain('javascript');

  const failures: string[] = [];
  page.on('response', (observed) => {
    if (observed.url().includes('/frontend/spatial/') && observed.status() >= 400) {
      failures.push(`${observed.status()} ${observed.url()}`);
    }
  });

  await page.goto('/hero/');
  await expect(page.locator('#hero-canvas')).toBeVisible();
  expect(failures).toEqual([]);
});
