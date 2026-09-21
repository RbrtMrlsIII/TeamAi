import { expect, test } from '@playwright/test';

test.describe('MCP / Capability facility', () => {
  test('guest can discover the facility, inspect capabilities, preview a dynamic branch, and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Enter 3D world' }).click();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'MCP / Capability' }).click();

    const facility = page.locator('#hero-mcp-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-mcp-state]')).toHaveText('Guest · INSTALLABLE · locked');
    await expect(facility.locator('[data-mcp-capability]')).toHaveCount(4);
    await expect(facility.locator('[data-mcp-stage]')).toHaveCount(8);

    await facility.locator('[data-mcp-capability="github"]').click();
    await facility.locator('[data-mcp-target]').selectOption('WORKSPACE:workspace-main');
    await facility.locator('[data-mcp-path]').selectOption('configuration,authorization');
    await expect(facility.locator('[data-mcp-branch]')).toHaveText('BRANCH-MCP::github/WORKSPACE/workspace-main/configuration/authorization');

    await facility.getByRole('button', { name: 'Sign in to configure' }).click();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });
});
