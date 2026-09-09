import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');
    await expect(page.locator('#state-label')).toHaveText('IDLE');
    await expect(page.locator('#seat-label')).toContainText('Web AI Seat');
    await page.screenshot({ path: 'test-results/hero-frame.png', fullPage: true });
  });

  test('exercises semantic POV, turn-loop, seat-focus, spatial parts, seat stack, semantic camera registry, inspection spine, auth handoff, and reduced-motion controls', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');
    await expect(page.locator('[data-inspection-stage]')).toHaveText('Hero orientation (1/15)');

    const stageEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-hero-inspection-stage', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('[data-inspection-next]')?.click();
    }));
    await expect(page.locator('[data-inspection-stage]')).toHaveText('Shared surface (2/15)');
    expect(await stageEvent).toMatchObject({ stage: 'SURFACE', semanticCamera: 'WORKSPACE_CLOSE', presentationOnly: true });

    await page.evaluate(() => (window as any).TeamAiHeroInspectionSpine.next());
    await expect(page.locator('[data-inspection-stage]')).toHaveText('Active Seat (3/15)');
    await page.evaluate(() => (window as any).TeamAiHeroInspectionSpine.previous());
    await expect(page.locator('[data-inspection-stage]')).toHaveText('Shared surface (2/15)');
    await page.evaluate(() => (window as any).TeamAiHeroInspectionSpine.reset());
    await expect(page.locator('[data-inspection-stage]')).toHaveText('Hero orientation (1/15)');

    await page.getByRole('button', { name: 'Workspace', exact: true }).click();
    await page.getByRole('button', { name: 'Map', exact: true }).click();
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.getByRole('button', { name: 'Surface shared state', exact: true }).click({ force: true });
    await expect(page.getByRole('button', { name: 'Surface shared state', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const activePart = await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart());
    expect(activePart).toBe('surface');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('surface'))).toBe('WORKSPACE_CLOSE');

    await page.locator('[data-part="focus"]').dispatchEvent('click');
    await expect(page.getByRole('button', { name: 'Surface shared state', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'Focus active Seat', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart())).toBe('focus');

    await page.getByRole('button', { name: 'Seat stack', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Seat stack', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const stack = await page.evaluate(() => (window as any).TeamAiHeroSeatStack.getState());
    expect(stack).toMatchObject({ open: true, presentationOnly: true });

    await page.getByRole('button', { name: 'Close seat stack', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Seat stack', exact: true })).toHaveAttribute('aria-pressed', 'false');

    const authEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-hero-auth-open', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('[data-auth-open]')?.click();
    }));
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Login', exact: true })).toHaveAttribute('aria-selected', 'true');
    const loginForm = page.locator('form[data-auth-form="login"]');
    await expect(loginForm.getByLabel('Email')).toBeVisible();
    expect(await authEvent).toMatchObject({ semanticCamera: 'MECHANISM_AUTHENTICATION', presentationOnly: true });
    expect(await page.evaluate(() => (window as any).TeamAiHeroAuthHandoff.getState())).toMatchObject({ open: true, mode: 'login' });
    expect(await page.evaluate(() => (window as any).TeamAiHeroInspectionSpine.current().id)).toBe('HERO_ORIENTATION');

    await page.getByRole('tab', { name: 'Sign up', exact: true }).click();
    const signupForm = page.locator('form[data-auth-form="signup"]');
    await expect(signupForm.getByLabel('Name')).toBeVisible();
    await expect(signupForm.getByLabel('Password')).toHaveAttribute('autocomplete', 'new-password');
    await signupForm.getByLabel('Name').fill('Example User');
    await signupForm.getByLabel('Email').fill('example@example.com');
    await signupForm.getByLabel('Password').fill('not-sent-password');
    await signupForm.getByRole('button', { name: 'Create account', exact: true }).click();
    await expect(page.locator('#auth-status')).toContainText('Authentication is not connected yet');

    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(page.locator('#hero-auth-panel')).toBeHidden();

    await page.getByRole('button', { name: 'Start turn loop', exact: true }).click();
    await expect(page.locator('#state-label')).toHaveText(/FOCUS|ACTIVE|CONTRIBUTE/);

    await page.getByRole('button', { name: 'Stop turn loop', exact: true }).click();
    await expect(page.locator('#state-label')).toHaveText('IDLE');

    await page.locator('#hero-canvas').click({ position: { x: 80, y: 420 } });
    await expect(page.locator('#state-label')).toHaveText('FOCUS');
    // P1.1: seat-shell open focuses SEAT_CONNECTION — status label is connection-face a11y copy
    await expect(page.locator('#seat-label')).toContainText('Seat connection face');
    await expect(page.locator('#seat-label')).toContainText('Presentation only');
    const hierarchy = await page.evaluate(() => (window as any).TeamAiHero?.getHierarchyState?.());
    expect(hierarchy?.openParentId || hierarchy?.focusedChildId).toBeTruthy();

    await page.getByRole('button', { name: 'Reduced motion: off', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Reduced motion: on', exact: true })).toBeVisible();
  });

  test('completes contribution, workspace absorption, persistent trace, and next-seat handoff', async ({ page }) => {
    await page.goto('/hero/?seats=2');
    const lifecycle = await page.evaluate(() => new Promise<string[]>((resolve) => {
      const seen: string[] = [];
      const onState = (event: any) => {
        seen.push(event.detail.state);
        if (event.detail.state === 'FOCUS' && seen.includes('HANDOFF')) {
          window.removeEventListener('teamai:hero-state-change', onState);
          resolve(seen);
        }
      };
      window.addEventListener('teamai:hero-state-change', onState);
      (window as any).TeamAiHero.startLoop();
    }));
    expect(lifecycle).toEqual(expect.arrayContaining(['FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB', 'REFLECT', 'HANDOFF']));
    await expect(page.locator('#state-label')).toHaveText('FOCUS');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-trace-count', /[1-8]/);
  });

  test('scales the same stage from one seat to eight unlocked seats', async ({ page }) => {
    await page.goto('/hero/?seats=1');
    await expect(page.locator('#seat-label')).toContainText('1 seat unlocked');
    await expect(page.locator('#state-label')).toHaveText('IDLE');

    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(8));
    await expect(page.locator('#seat-label')).toContainText('8 seats unlocked');
  });
});
