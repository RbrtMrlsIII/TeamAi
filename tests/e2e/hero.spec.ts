import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }, testInfo) => {
    await page.goto('/hero/');
    await expect(page.getByRole('heading', { name: 'Living Web AI Workspace' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    for (const label of ['Wide', 'Low orbit', 'Team', 'Workspace', 'Map', 'Open engine', 'Seat', 'Detail', 'Back', 'Next', 'Reset']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.locator('.spatial-part')).toHaveCount(3);
    await expect(page.locator('[data-seat-layer]')).toHaveCount(10);
    await expect(page.locator('.seat-stack__dial')).toHaveCount(1);
    const path = testInfo.outputPath('hero-wide.png');
    await page.screenshot({ path });
    await testInfo.attach('hero-wide', { path, contentType: 'image/png' });
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
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('focus'))).toBe('SEAT_CLOSE');

    await page.getByRole('button', { name: 'Seat', exact: true }).click();
    await page.getByRole('button', { name: 'Detail', exact: true }).click();

    const stackLayers = await page.evaluate(() => (window as any).TeamAiHeroSeatStack.layers().map((layer: any) => layer.id));
    expect(stackLayers).toEqual([
      'identity', 'responsibility', 'connection', 'behavior', 'toolkit', 'zipskills',
      'capabilities', 'authorization', 'workspace', 'task'
    ]);
    const semanticCameras = await page.evaluate(() => (window as any).TeamAiHeroSeatStack.layers().map((layer: any) => layer.semanticCamera));
    expect(semanticCameras).toEqual([
      'MECHANISM_IDENTITY', 'MECHANISM_RESPONSIBILITY', 'MECHANISM_CONNECTION', 'MECHANISM_BEHAVIOR', 'MECHANISM_SKILLS',
      'MECHANISM_ZIPSKILLS', 'MECHANISM_CAPABILITY', 'MECHANISM_AUTHORIZATION', 'MECHANISM_WORKSPACE', 'MECHANISM_TASK'
    ]);
    // Slice H: zipskills layer exposes canonical WORKSPACE_ZIPSKILLS while keeping legacy MECHANISM_* for continuity
    expect(await page.evaluate(() => {
      const z = (window as any).TeamAiHeroSeatStack.layers().find((l: any) => l.id === 'zipskills');
      return z?.canonicalSemanticCamera;
    })).toBe('WORKSPACE_ZIPSKILLS');

    const registryIds = await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.ids());
    expect(registryIds).toEqual([
      'MECHANISM_IDENTITY', 'MECHANISM_RESPONSIBILITY', 'MECHANISM_CONNECTION', 'MECHANISM_BEHAVIOR', 'MECHANISM_SKILLS',
      'MECHANISM_ZIPSKILLS', 'WORKSPACE_ZIPSKILLS', 'MECHANISM_CAPABILITY', 'MECHANISM_AUTHORIZATION', 'MECHANISM_AUTHENTICATION',
      'MECHANISM_WORKSPACE', 'MECHANISM_TASK', 'APP_UI_HANDOFF'
    ]);
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.resolve('MECHANISM_ZIPSKILLS'))).toBe('DETAIL_ANCHOR');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.resolve('WORKSPACE_ZIPSKILLS'))).toBe('DETAIL_ANCHOR');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.canonical('MECHANISM_ZIPSKILLS'))).toBe('WORKSPACE_ZIPSKILLS');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.resolve('MECHANISM_CAPABILITY'))).toBe('DETAIL_ANCHOR');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.resolve('MECHANISM_AUTHENTICATION'))).toBe('DETAIL_ANCHOR');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSemanticCamera.resolve('APP_UI_HANDOFF'))).toBeNull();

    const healthEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-connection-health', (event: any) => resolve(event.detail), { once: true });
      (window as any).TeamAiHeroSeatStack.setConnectionHealth('healthy');
    }));
    await expect(page.locator('[data-seat-layer="connection"]')).toHaveAttribute('data-health', 'healthy');
    expect(await healthEvent).toMatchObject({ health: 'healthy', presentationOnly: true, durable: false });
    expect(await page.evaluate(() => (window as any).TeamAiHeroSeatStack.getConnectionHealth())).toBe('healthy');

    const dialEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-responsibility-dial', (event: any) => resolve(event.detail), { once: true });
      (window as any).TeamAiHeroSeatStack.setResponsibilityDial(0.72);
    }));
    expect(await dialEvent).toMatchObject({ dial: 0.72, presentationOnly: true, durable: false });
    expect(await page.evaluate(() => (window as any).TeamAiHeroSeatStack.getResponsibilityDial())).toBe(0.72);

    const inspectionEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-semantic-camera', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('[data-seat-layer="capabilities"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }));
    await expect(page.locator('[data-seat-layer="capabilities"]')).toHaveAttribute('aria-pressed', 'true');
    expect(await inspectionEvent).toMatchObject({
      semanticCamera: 'MECHANISM_CAPABILITY', physicalCamera: 'DETAIL_ANCHOR', source: 'seat-inspection', layer: 'capabilities', presentationOnly: true
    });

    const equipmentEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-equipment-preview', (event: any) => resolve(event.detail), { once: true });
      (window as any).TeamAiHeroSeatStack.setEquipped('zipskills', true);
    }));
    await expect(page.locator('[data-seat-layer="zipskills"]')).toHaveAttribute('data-equipped', 'true');
    expect(await equipmentEvent).toMatchObject({
      layer: 'zipskills',
      equipped: true,
      semanticCamera: 'MECHANISM_ZIPSKILLS',
      canonicalSemanticCamera: 'WORKSPACE_ZIPSKILLS',
      presentationOnly: true
    });

    const handoffEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-semantic-camera', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('.seat-stack__handoff')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }));
    expect(await handoffEvent).toMatchObject({ semanticCamera: 'APP_UI_HANDOFF', physicalCamera: null, source: 'seat-normal-ui-handoff', normalUi: true, presentationOnly: true });

    const authEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-hero-engine-open', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('[data-hero-engine-open]')?.click();
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
    await expect(page.locator('#seat-label')).toContainText('Web AI Seat 2');

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
    expect(lifecycle.slice(0, 6)).toEqual(['FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB', 'REFLECT', 'HANDOFF']);
    expect(lifecycle.at(-1)).toBe('FOCUS');
    expect(await page.evaluate(() => (window as any).TeamAiHero.getTraceCount())).toBe(1);
    expect(await page.evaluate(() => (window as any).TeamAiHero.getSelectedSeat())).toBe(1);
    await page.evaluate(() => (window as any).TeamAiHero.stopLoop());
    await expect(page.locator('#state-label')).toHaveText('IDLE');
  });

  test('scales the same stage from one seat to eight unlocked seats', async ({ page }) => {
    await page.goto('/hero/?seats=1');
    await expect(page.locator('#seat-label')).toContainText('1 seat unlocked');
    await expect(page.locator('#state-label')).toHaveText('IDLE');

    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(8));
    await expect(page.locator('#seat-label')).toContainText('8 seats unlocked');

    const count = await page.evaluate(() => (window as any).TeamAiHero.getSeatCount());
    expect(count).toBe(8);

    await page.evaluate(() => window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-unlocked', { detail: { seatCount: 6 } })));
    await expect(page.locator('#seat-label')).toContainText('6 seats unlocked');
  });
});
