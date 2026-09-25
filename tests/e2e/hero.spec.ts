import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }, testInfo) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    for (const label of ['Open engine', 'Return to entrance', 'Start turn loop']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.locator('.hero-controls__cameras [data-camera]')).toHaveCount(0);
    await expect(page.locator('.hero-inspection')).toHaveCount(0);
    await expect(page.locator('[data-inspection-stage], [data-inspection-prev], [data-inspection-next], [data-inspection-reset]')).toHaveCount(0);
    await expect(page.locator('.world-navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'World', exact: true })).toBeVisible();
    await expect(page.locator('.hero-copy')).toBeHidden();
    await expect(page.locator('.spatial-part')).toHaveCount(3);
    await expect(page.locator('[data-seat-layer]')).toHaveCount(10);
    await expect(page.locator('.seat-stack__dial')).toHaveCount(1);
    const path = testInfo.outputPath('hero-wide.png');
    await page.screenshot({ path });
    await testInfo.attach('hero-wide', { path, contentType: 'image/png' });
  });

  test('S11 locked guest facilities remain inspectable while mutation controls stay locked', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();

    const workspaceMenu = page.locator('#world-menu [data-workspace-open]');
    await expect(workspaceMenu).toHaveAttribute('data-guest-state', 'locked');
    await expect(workspaceMenu).not.toHaveAttribute('aria-disabled', 'true');
    await workspaceMenu.click();

    const facility = page.locator('#hero-workspace-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-workspace-request]')).toBeDisabled();
  });

  test('S11 guest machine auto-orbits and freezes during authentication transition', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-guest-state', 'GUEST_LIMITED');
    await expect(page.locator('.world-navigation__status')).toHaveText('Guest · limited actions');

    await page.evaluate(() => (window as any).TeamAiHero.resetNav());
    const before = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
    await page.waitForTimeout(2200);
    const after = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
    expect(Math.abs(after - before)).toBeGreaterThan(0.001);

    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('#world-menu').getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-guest-state', 'AUTH_TRANSITION');

    const frozenBefore = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
    await page.waitForTimeout(500);
    const frozenAfter = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
    expect(frozenAfter).toBe(frozenBefore);

    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(page.locator('#hero-auth-panel')).toBeHidden();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-guest-state', 'GUEST_LIMITED');
  });

  test('Hero exposes the governed 1-10 Seat capacity', async ({ page }) => {
    await page.goto('/hero/');
    const count = () => page.evaluate(() => (window as any).TeamAiHero.getSeatCount());
    expect(await count()).toBe(10);
    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(0));
    expect(await count()).toBe(1);
    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(99));
    expect(await count()).toBe(10);
  });

  test('world-navigation menu reaches Selected seat, Workspace, and Detail without the old camera wall', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const worldNav = page.locator('.world-navigation');
    for (const label of ['Selected seat', 'Workspace', 'Detail', 'Settings', 'Sign in']) {
      await expect(worldNav.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('C6: zoom-out from a seat close-up returns to the HERO_WIDE world baseline', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell(0);
      hero.resetNav();
    });
    const hierarchy = await page.evaluate(() => (window as any).TeamAiHero.getHierarchyState());
    expect(hierarchy?.openParentId).toBeTruthy();
    const zoomedIn = await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId());
    expect(zoomedIn).not.toBe('HERO_WIDE');
    await page.evaluate(() => {
      const canvas = document.querySelector('#hero-canvas');
      if (!canvas) throw new Error('missing #hero-canvas');
      for (let i = 0; i < 20; i += 1) {
        canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }));
      }
    });
    const navZoom = await page.evaluate(() => (window as any).TeamAiHero.getNavZoom());
    const baseAtFullZoomOut = await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId());
    expect(navZoom).toBeGreaterThanOrEqual(
      await page.evaluate(() => (window as any).TeamAiHero.NAV_ZOOM_MAX) - 1e-6
    );
    expect(baseAtFullZoomOut).toBe('HERO_WIDE');
  });

  test('Settings Smoke applies an exact camera dock in-place without navigation', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('.world-navigation')).toBeVisible();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const settingsBtn = page.locator('#world-menu [data-settings-open]');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();
    await expect(page.locator('[data-smoke-camera]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-smoke-camera]')).toHaveValue('HERO_WIDE');
    await page.locator('[data-smoke-camera]').selectOption('SEAT_CLOSE');
    await page.locator('[data-smoke-camera-apply]').click();
    await expect(page.locator('[data-smoke-camera-status]')).toHaveText('looking at SEAT_CLOSE');
    await expect(page).toHaveURL(/\/hero\/?$/);
    expect(await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('SEAT_CLOSE');
    expect(await page.evaluate(() => Boolean((window as any).TeamAiHeroInspectionSpine))).toBe(false);
  });

  test('exercises semantic POV, turn-loop, seat-focus, spatial parts, seat stack, semantic camera registry, Settings smoke, auth handoff, and reduced-motion controls', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');
    await expect(page.locator('.hero-inspection')).toHaveCount(0);
    await expect(page.locator('[data-inspection-stage], [data-inspection-prev], [data-inspection-next], [data-inspection-reset]')).toHaveCount(0);
    await page.evaluate(() => (window as any).TeamAiHero.setCamera('WORKSPACE_CLOSE'));
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.evaluate(() => (window as any).TeamAiHero.setCamera('OVERHEAD_MAP'));
    await expect(page.locator('#hero-canvas')).toBeVisible();
    expect(await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('OVERHEAD_MAP');
    await page.evaluate(() => (window as any).TeamAiHeroSpatial.setPart('surface'));
    const activePart = await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart());
    expect(activePart).toBe('surface');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('surface'))).toBe('WORKSPACE_CLOSE');
    await page.evaluate(() => (window as any).TeamAiHeroSpatial.setPart('focus'));
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart())).toBe('focus');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('focus'))).toBe('SEAT_CLOSE');
    await page.evaluate(() => (window as any).TeamAiHero.setCamera('SEAT_CLOSE'));
    await page.evaluate(() => (window as any).TeamAiHero.setCamera('DETAIL_ANCHOR'));
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
    const clickBefore = await page.evaluate(() => ({ seat: (window as any).TeamAiHero.getSelectedSeat(), state: (window as any).TeamAiHero.getState() }));
    await page.locator('#hero-canvas').click({ position: { x: 80, y: 420 } });
    const clickAfter = await page.evaluate(() => ({ seat: (window as any).TeamAiHero.getSelectedSeat(), state: (window as any).TeamAiHero.getState() }));
    expect(clickAfter).toEqual(clickBefore);
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

test.describe('Canonical public homepage (classic entrance -> 3D world)', () => {
  test('desktop: classic entrance is the root, and Enter 3D world reaches the coherent world nav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('.classic-entrance')).toBeVisible();
    await expect(page.getByRole('heading', { name: /calmer front door/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter 3D world', exact: true })).toBeVisible();
    await expect(page.locator('.world-navigation')).toBeHidden();
    await expect(page.locator('.hero-copy')).toBeHidden();
    await expect(page.locator('.far-environment')).toBeHidden();
    await expect(page.locator('.classic-entrance__brand img')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: /Living Web AI Workspace/i })).toHaveCount(0);
    await page.getByRole('button', { name: 'Enter 3D world', exact: true }).click();
    await expect(page.locator('.classic-entrance')).toBeHidden();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.world-navigation')).toBeVisible();
    await expect(page.locator('.hero-copy')).toBeHidden();
    await page.getByRole('button', { name: 'Website', exact: true }).click();
    await expect(page.locator('.classic-entrance')).toBeVisible();
    await expect(page.locator('.world-navigation')).toBeHidden();
    await expect(page.locator('.hero-copy')).toBeHidden();
    await expect(page.locator('.far-environment')).toBeHidden();
  });

  test('phone viewport: same entrance -> world -> return flow stays usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.classic-entrance')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter 3D world', exact: true })).toBeVisible();
    await expect(page.locator('.hero-copy')).toBeHidden();
    await expect(page.locator('.far-environment')).toBeHidden();
    await page.getByRole('button', { name: 'Enter 3D world', exact: true }).click();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.world-navigation')).toBeVisible();
    await expect(page.locator('.hero-controls__cameras [data-camera]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Website', exact: true }).click();
    await expect(page.locator('.classic-entrance')).toBeVisible();
    await expect(page.locator('.hero-copy')).toBeHidden();
  });

  test('/hero/ and /spatial/ compatibility routes still resolve to their declared surfaces', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.goto('/spatial/');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('center-of-canvas background click is inert until semantic spatial hit-testing is governed (#304 superseded)', async ({ page }) => {
    await page.goto('/hero/?seats=4');
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();
    await page.waitForFunction(() => Boolean((window as any).TeamAiHero?.selectSeatShell));
    const before = await page.evaluate(() => ({ seat: (window as any).TeamAiHero.getSelectedSeat(), state: (window as any).TeamAiHero.getState() }));
    await page.evaluate(() => {
      const el = document.querySelector('#hero-canvas') as HTMLElement | null;
      if (!el) throw new Error('missing #hero-canvas');
      const r = el.getBoundingClientRect();
      const clientX = r.left + r.width * 0.5;
      const clientY = r.top + r.height * 0.5;
      el.dispatchEvent(new MouseEvent('click', { clientX, clientY, bubbles: true, cancelable: true }));
    });
    const after = await page.evaluate(() => ({ seat: (window as any).TeamAiHero.getSelectedSeat(), state: (window as any).TeamAiHero.getState() }));
    expect(after).toEqual(before);
  });
});
