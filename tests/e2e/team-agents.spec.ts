import { expect, test } from '@playwright/test';

test.describe('Team / Agents facility', () => {
  test('guest can discover the team, preview role and Seat assignment, and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Team / Agents' }).click();

    const facility = page.locator('#hero-team-agents-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-agent-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-agent-id]')).toHaveCount(3);
    await expect(facility.locator('[data-agent-request]')).toBeDisabled();
    await expect(facility.locator('[data-agent-branch]')).toHaveText(
      'BRANCH-TEAM::agent/agent-alpha/seat/seat-01/role/planner/configuration',
    );

    await facility.locator('[data-agent-id="agent-gamma"]').click();
    await facility.locator('[data-agent-seat]').selectOption('seat-02');
    await facility.locator('[data-agent-role]').selectOption('coordinator');
    await expect(facility.locator('[data-agent-profile]')).toHaveText(/Review + verification/);
    await expect(facility.locator('[data-agent-branch]')).toHaveText(
      'BRANCH-TEAM::agent/agent-gamma/seat/seat-02/role/coordinator/configuration',
    );

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
