import { expect, test } from '@playwright/test';

test.describe('Team / Agents facility', () => {
  test('guest can discover Team / Agents, see locked runtime state, and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Team / Agents' }).click();

    const facility = page.locator('#hero-team-agents-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-agent-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-agent-id]')).toHaveCount(0);
    await expect(facility.locator('[data-agent-request]')).toBeDisabled();
    await expect(facility.locator('[data-agent-branch]')).toHaveText('Assignment preview unavailable');
    await expect(facility.locator('[data-agent-profile]')).toHaveText('Capability profile unavailable');
    await expect(facility.locator('[data-agent-skills]')).toHaveText('Skill bundle unavailable');

    await facility.locator('[data-agent-focus]').click();
    await expect(facility.locator('[data-agent-result]')).toHaveText(
      'Team / Agent relationship focused. Camera state is presentation-only.',
    );

    await facility.getByRole('button', { name: 'Sign in to manage team' }).click();
    await expect(facility).toBeHidden();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });
});
