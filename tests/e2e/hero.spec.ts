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

  test('S12 restores authoritative context and durable Seat population through the presentation seam', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('#world-menu').getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-guest-state', 'AUTH_TRANSITION');

    const snapshot = await page.evaluate(() => {
      const restoration = (window as any).TeamAiAuthenticatedRestoration;
      if (!restoration) throw new Error('S12 restoration runtime is unavailable');
      const result = restoration.setPresentationReadModel({
        identity: { provider: 'firebase', subjectId: 'uid-s12-browser' },
        authenticated: true,
        workplace: { id: 'workplace-browser', label: 'Operator Workplace' },
        project: { id: 'project-browser', label: 'Project Browser' },
        team: { id: 'team-browser', label: 'Team Browser' },
        readiness: {
          authenticated: true,
          workspaceKnown: true,
          projectKnown: true,
          authorized: true,
          entitled: true,
          schedulerEligible: true,
          healthy: true,
        },
        seats: [
          { id: 'seat-browser-1', label: 'Web AI Seat 1', durable: true, state: 'READY' },
          { id: 'seat-browser-2', label: 'Web AI Seat 2', durable: true, state: 'READY' },
        ],
      });
      return {
        state: result.state,
        reason: result.reason,
        available: result.available,
        durableSeatCount: result.durableSeatCount,
        durableSeatIds: result.durableSeats.map((seat: any) => seat.id),
        heroState: (window as any).TeamAiHero.getGuestMachineState().state,
        heroSeatCount: (window as any).TeamAiHero.getSeatCount(),
        workspace: (window as any).TeamAiWorkspaceFacility.getState(),
        layer: document.querySelector('.hero-shell')?.getAttribute('data-hero-layer'),
        authOpen: (window as any).TeamAiHeroAuthHandoff.getState().open,
      };
    });

    expect(snapshot.state).toBe('AUTHENTICATED_READY');
    expect(snapshot.reason).toBeNull();
    expect(snapshot.available).toBe(true);
    expect(snapshot.durableSeatCount).toBe(2);
    expect(snapshot.durableSeatIds).toEqual(['seat-browser-1', 'seat-browser-2']);
    expect(snapshot.heroState).toBe('AUTHENTICATED');
    expect(snapshot.heroSeatCount).toBe(2);
    expect(snapshot.workspace).toMatchObject({
      authenticated: true,
      contextAvailable: true,
      workplaceId: 'workplace-browser',
      projectId: 'project-browser',
    });
    expect(snapshot.layer).toBe('machine');
    expect(snapshot.authOpen).toBe(false);
    await expect(page.locator('#seat-label')).toContainText('2 durable seats restored');
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-authenticated-restoration-state'))).toBe('AUTHENTICATED_READY');
  });

  test('S12 fails closed with a reason when authenticated context cannot be restored', async ({ page }) => {
    await page.goto('/hero/');
    const snapshot = await page.evaluate(() => {
      const restoration = (window as any).TeamAiAuthenticatedRestoration;
      const before = (window as any).TeamAiHero.getSeatCount();
      const result = restoration.setPresentationReadModel({
        identity: { provider: 'firebase', subjectId: 'uid-s12-unavailable' },
        authenticated: true,
        workplace: { id: 'workplace-browser', label: 'Operator Workplace' },
        project: null,
        team: { id: 'team-browser', label: 'Team Browser' },
        readiness: {
          authenticated: true,
          workspaceKnown: true,
          projectKnown: false,
          authorized: true,
          entitled: true,
          schedulerEligible: true,
          healthy: true,
        },
        seats: [
          { id: 'seat-presented', label: 'Presented Seat', durable: false },
        ],
      });
      return {
        result: { state: result.state, reason: result.reason, available: result.available, durableSeatCount: result.durableSeatCount },
        seatCountBefore: before,
        seatCountAfter: (window as any).TeamAiHero.getSeatCount(),
        workspace: (window as any).TeamAiWorkspaceFacility.getState(),
        domState: document.documentElement.getAttribute('data-authenticated-restoration-state'),
        domReason: document.documentElement.getAttribute('data-authenticated-restoration-reason'),
      };
    });

    expect(snapshot.result).toEqual({
      state: 'AUTHENTICATED_UNAVAILABLE',
      reason: 'PROJECT_UNAVAILABLE',
      available: false,
      durableSeatCount: 0,
    });
    expect(snapshot.seatCountAfter).toBe(snapshot.seatCountBefore);
    expect(snapshot.workspace.contextAvailable).toBe(false);
    expect(snapshot.domState).toBe('AUTHENTICATED_UNAVAILABLE');
    expect(snapshot.domReason).toBe('PROJECT_UNAVAILABLE');
    await expect(page.locator('#seat-label')).toContainText('Authenticated · PROJECT_UNAVAILABLE');
  });


  test('S12 keeps restored Seat population visible while readiness remains unavailable', async ({ page }) => {
    await page.goto('/hero/');
    const snapshot = await page.evaluate(() => {
      const restoration = (window as any).TeamAiAuthenticatedRestoration;
      const result = restoration.setPresentationReadModel({
        identity: { provider: 'firebase', subjectId: 'uid-s12-readiness' },
        authenticated: true,
        workplace: { id: 'workplace-browser', label: 'Operator Workplace' },
        project: { id: 'project-browser', label: 'Project Browser' },
        team: { id: 'team-browser', label: 'Team Browser' },
        readiness: {
          authenticated: true,
          workspaceKnown: true,
          projectKnown: true,
          authorized: true,
          entitled: true,
          schedulerEligible: false,
          healthy: true,
        },
        seats: [
          { id: 'seat-browser-1', label: 'Web AI Seat 1', durable: true, state: 'READY' },
          { id: 'seat-browser-2', label: 'Web AI Seat 2', durable: true, state: 'READY' },
        ],
      });
      return {
        state: result.state,
        reason: result.reason,
        available: result.available,
        durableSeatCount: result.durableSeatCount,
        heroSeatCount: (window as any).TeamAiHero.getSeatCount(),
      };
    });

    expect(snapshot.state).toBe('AUTHENTICATED_UNAVAILABLE');
    expect(snapshot.reason).toBe('SCHEDULER_UNAVAILABLE');
    expect(snapshot.available).toBe(false);
    expect(snapshot.durableSeatCount).toBe(2);
    expect(snapshot.heroSeatCount).toBe(2);
    await expect(page.locator('#seat-label')).toContainText('Authenticated · SCHEDULER_UNAVAILABLE');
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

  test('S20 Settings semantic navigation stays on the Hero surface and changes only the reference presentation', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('#world-menu [data-settings-open]').click();

    const settings = page.locator('#hero-settings-panel');
    await expect(settings).toBeVisible();
    await expect(settings.locator('[data-settings-semantic-ref]')).toHaveCount(9);
    await expect(settings.locator('[data-settings-semantic-title]')).toHaveText('TREE-SETTINGS · Settings');

    await settings.locator('[data-settings-semantic-ref="TREE-WORKSPACE"]').click();
    await expect(settings.locator('[data-settings-semantic-title]')).toHaveText('TREE-WORKSPACE · Workspace');
    await expect(settings.locator('[data-settings-semantic-responsibility]')).toHaveText('Workplace/project/repository/runtime scope');
    await expect(settings.locator('[data-settings-semantic-branches]')).toContainText('project');
    await expect(settings.locator('[data-settings-semantic-ref="TREE-WORKSPACE"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/\/hero\/?$/);
  });

  test('S21 transaction presentation uses semantic operation families without claiming execution authority', async ({ page }) => {
    await page.goto('/hero/');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('teamai:seat-transaction-presentation', {
        detail: {
          transaction: {
            seatId: 'seat-browser-1',
            transactionId: 'tx-browser-1',
            kind: 'mcp-invocation',
            state: 'LOADING',
            progress: 0.4,
            authoritative: true,
          },
        },
      }));
    });

    const orb = page.locator('[data-transaction-orb]');
    await expect(orb).toBeVisible();
    await expect(orb.locator('[data-transaction-orb-label]')).toHaveText('MCP invocation');
    await expect(orb.locator('[data-transaction-orb-state]')).toHaveText('Loading');

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-browser-1',
        transactionId: 'tx-browser-1',
        kind: 'handoff-continuation',
        state: 'WAITING_FOR_CONTINUATION',
        authoritative: true,
      });
    });
    await expect(orb.locator('[data-transaction-orb-label]')).toHaveText('Handoff / continuation');
    await expect(orb.locator('[data-transaction-orb-state]')).toHaveText('Waiting for continuation');
    await expect(orb).toHaveAttribute('data-kind', 'handoff-continuation');
    await expect(orb).toHaveAttribute('data-state', 'WAITING_FOR_CONTINUATION');

    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
    await expect(orb).toBeHidden();
  });

  test('S21 recovery actions expose authoritative Retry/Cancel intents without claiming execution', async ({ page }) => {
    await page.goto('/hero/');

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-browser-1',
        transactionId: 'tx-browser-recovery',
        kind: 'recovery',
        state: 'UNAVAILABLE',
        errorCode: 'PROVIDER_UNAVAILABLE',
        retryable: true,
        cancelable: false,
        authoritative: true,
      });
    });

    const orb = page.locator('[data-transaction-orb]');
    await expect(orb).toBeVisible();
    await expect(orb.locator('[data-transaction-orb-detail]')).toHaveText(
      'Transaction tx-browser-recovery · PROVIDER_UNAVAILABLE'
    );
    await expect(orb.locator('[data-transaction-orb-retry]')).toBeVisible();
    await expect(orb.locator('[data-transaction-orb-cancel]')).toBeHidden();

    const retryIntent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:seat-transaction-retry-request', (event: any) => resolve(event.detail), { once: true });
    }));
    await orb.locator('[data-transaction-orb-retry]').click();
    await expect(retryIntent).resolves.toMatchObject({
      seatId: 'seat-browser-1',
      transactionId: 'tx-browser-recovery',
      kind: 'recovery',
      state: 'UNAVAILABLE',
      errorCode: 'PROVIDER_UNAVAILABLE',
      presentationOnly: true,
      notAuthority: true,
      authoritativeConfirmationRequired: true,
    });

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-browser-1',
        transactionId: 'tx-browser-active',
        kind: 'ai-execution',
        state: 'ACTIVE',
        retryable: false,
        cancelable: true,
        authoritative: true,
      });
    });
    await expect(orb.locator('[data-transaction-orb-retry]')).toBeHidden();
    await expect(orb.locator('[data-transaction-orb-cancel]')).toBeVisible();

    const cancelIntent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:seat-transaction-cancel-request', (event: any) => resolve(event.detail), { once: true });
    }));
    await orb.locator('[data-transaction-orb-cancel]').click();
    await expect(cancelIntent).resolves.toMatchObject({
      seatId: 'seat-browser-1',
      transactionId: 'tx-browser-active',
      kind: 'ai-execution',
      state: 'ACTIVE',
      presentationOnly: true,
      notAuthority: true,
      authoritativeConfirmationRequired: true,
    });

    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
    await expect(orb).toBeHidden();
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

  test('scales the same presentation from one to ten Seat slots', async ({ page }) => {
    await page.goto('/hero/?seats=1');
    const count = () => page.evaluate(() => (window as any).TeamAiHero.getSeatCount());
    await expect(page.locator('#seat-label')).toContainText('1 seat presented');
    await expect(page.locator('#state-label')).toHaveText('IDLE');
    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(10));
    await expect(page.locator('#seat-label')).toContainText('10 seats presented');
    expect(await count()).toBe(10);
    await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(6));
    await expect(page.locator('#seat-label')).toContainText('6 seats presented');
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
