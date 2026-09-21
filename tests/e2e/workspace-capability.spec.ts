import { expect, test } from '@playwright/test';

test.describe('Workspace HQ capability facility', () => {
  test('guest can open Workspace HQ, inspect capability state, focus the workspace center, preview scope, and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Workspace' }).click();

    const facility = page.locator('#hero-workspace-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-workspace-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-workspace-capability]')).toHaveCount(4);
    await expect(facility.locator('[data-workspace-request]')).toBeDisabled();
    await expect(facility.locator('[data-workspace-branch]')).toHaveText('BRANCH-WORKSPACE::workspace-main/workspace-context/command-deck/context');

    await facility.locator('[data-workspace-capability="workspace-projects"]').click();
    await facility.locator('[data-workspace-project-id]').selectOption('atlas');
    await expect(facility.locator('[data-workspace-project-label]')).toHaveText('Atlas Migration');
    await expect(facility.locator('[data-workspace-branch]')).toHaveText('BRANCH-WORKSPACE::workspace-main/workspace-projects/atlas/context');

    await facility.locator('[data-workspace-focus]').click();
    await expect(facility.locator('[data-workspace-result]')).toHaveText('Workspace center focused. Camera state is presentation-only.');

    await facility.getByRole('button', { name: 'Sign in to configure' }).click();
    await expect(facility).toBeHidden();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });
});
