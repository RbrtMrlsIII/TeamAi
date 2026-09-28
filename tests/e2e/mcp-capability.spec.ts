import { expect, test } from '@playwright/test';

test.describe('MCP / Capability facility', () => {
  test('guest can discover the facility without fabricated runtime targets and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'MCP / Capability' }).click();

    const facility = page.locator('#hero-mcp-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-mcp-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-mcp-capability]')).toHaveCount(4);
    await expect(facility.locator('[data-mcp-stage]')).toHaveCount(8);
    await expect(facility.locator('[data-mcp-target]')).toBeDisabled();
    await expect(facility.locator('[data-mcp-branch]')).toHaveText('Branch preview unavailable');

    await facility.locator('[data-mcp-capability="github"]').click();
    await expect(facility.locator('[data-mcp-target]')).toBeDisabled();
    await expect(facility.locator('[data-mcp-path]')).toBeDisabled();
    await expect(facility.locator('[data-mcp-branch]')).toHaveText('Branch preview unavailable');

    await facility.getByRole('button', { name: 'Sign in to configure' }).click();
    await expect(facility).toBeHidden();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });
});
