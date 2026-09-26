import { expect, test } from '@playwright/test';

test.describe('Workspace HQ capability facility', () => {
  test('guest can open Workspace HQ, inspect locked capability state, focus the workspace center, and hand off to auth', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Workspace' }).click();

    const facility = page.locator('#hero-workspace-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-workspace-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-workspace-capability]')).toHaveCount(4);
    await expect(facility.locator('[data-workspace-request]')).toBeDisabled();
    await expect(facility.locator('[data-workspace-name]')).toHaveText('Unavailable until authorized Workspace read model is available');
    await expect(facility.locator('[data-workspace-project-label]')).toHaveText('Unavailable until authorized Workspace read model is available');
    await expect(facility.locator('[data-workspace-branch]')).toHaveText('Branch preview unavailable');
    await expect(facility.locator('[data-workspace-project-id]')).toHaveCount(0);

    await facility.locator('[data-workspace-focus]').click();
    await expect(facility.locator('[data-workspace-result]')).toHaveText('Workspace center focused. Camera state is presentation-only.');

    await facility.getByRole('button', { name: 'Sign in to configure' }).click();
    await expect(facility).toBeHidden();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });
});


test('authorized Workspace read model projects team, Seats, task, evidence, and results without local identities', async ({ page }) => {
  await page.goto('/hero/');

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('teamai:workspace-runtime-read-model', {
      detail: {
        readModel: {
          readiness: {
            authenticated: true,
            workspaceKnown: true,
            projectKnown: true,
            authorized: true,
            entitled: true,
            schedulerEligible: true,
            healthy: true,
          },
          workplace: { id: 'workplace-live', label: 'Studio Workplace' },
          project: { id: 'project-live', label: 'Spatial Console' },
          team: { id: 'team-live', label: 'Spatial Team' },
          seats: [
            { id: 'seat-1', label: 'Seat 1', state: 'READY', kind: 'seat' },
            { id: 'seat-2', label: 'Seat 2', state: 'ACTIVE', kind: 'seat' },
          ],
          activeTask: { id: 'task-live', label: 'World reconstruction task' },
          evidence: [
            { id: 'evidence-1', label: 'Geometry clearance proof', state: 'VERIFIED', kind: 'evidence' },
          ],
          results: [
            { id: 'result-1', label: 'Latest spatial verification', state: 'PASS', kind: 'result' },
          ],
        },
      },
    }));
  });

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('button', { name: 'Workspace' }).click();

  const facility = page.locator('#hero-workspace-facility');
  await expect(facility).toBeVisible();
  await expect(facility.locator('[data-workspace-state]')).toHaveText('Authenticated · Workspace context READY');
  await expect(facility.locator('[data-workspace-name]')).toHaveText('Studio Workplace');
  await expect(facility.locator('[data-workspace-project-label]')).toHaveText('Spatial Console');
  await expect(facility.locator('[data-workspace-team-label]')).toHaveText('Spatial Team');
  await expect(facility.locator('[data-workspace-seat-summary]')).toHaveText('2 Seat projections supplied by the backend read model');
  await expect(facility.locator('[data-workspace-task]')).toHaveText('World reconstruction task');
  await expect(facility.locator('[data-workspace-evidence]')).toContainText('Geometry clearance proof');
  await expect(facility.locator('[data-workspace-results]')).toContainText('Latest spatial verification');
  await expect(facility.locator('[data-workspace-request]')).toBeEnabled();

  await page.evaluate(() => window.TeamAiWorkspaceFacility.setPresentationAuthState(false));
  await expect(facility.locator('[data-workspace-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
  await expect(facility.locator('[data-workspace-name]')).toHaveText('Unavailable until authorized Workspace read model is available');
  await expect(facility.locator('[data-workspace-project-label]')).toHaveText('Unavailable until authorized Workspace read model is available');
  await expect(facility.locator('[data-workspace-team-label]')).toHaveText('Unavailable until authorized Workspace read model is available');
  await expect(facility.locator('[data-workspace-task]')).toHaveText('Active task unavailable');
  await expect(facility.locator('[data-workspace-request]')).toBeDisabled();

  await page.evaluate(() => window.TeamAiWorkspaceFacility.setReadModel({
    readiness: {
      authenticated: true,
      workspaceKnown: true,
      projectKnown: true,
      authorized: true,
      entitled: true,
      schedulerEligible: true,
      healthy: true,
    },
    workplace: { id: 'workplace-live', label: 'Studio Workplace' },
    project: { id: 'project-live', label: 'Spatial Console' },
    team: { id: 'team-live', label: 'Spatial Team' },
    seats: [{ id: 'seat-1', label: 'Seat 1', state: 'READY', kind: 'seat' }],
  }));
  await expect(facility.locator('[data-workspace-state]')).toHaveText('Authenticated · Workspace context READY');
  await expect(facility.locator('[data-workspace-request]')).toBeEnabled();

  await facility.locator('[data-workspace-request]').click();
  await expect(facility.locator('[data-workspace-result]')).toHaveText('Workspace capability intent requested. Authoritative runtime confirmation is still required.');
});
