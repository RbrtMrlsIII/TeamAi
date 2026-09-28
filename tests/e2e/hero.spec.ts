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

  test('S21 read-model bridge forwards transaction state into the live Hero presenter', async ({ page }) => {
    await page.goto('/hero/');

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('teamai:seat-task-evidence-runtime-read-model', {
        detail: {
          source: 'backend-read-model',
          available: true,
          authorized: true,
          seatId: 'seat-browser-read-model',
          transaction: {
            transactionId: 'tx-read-model',
            kind: 'mcp-invocation',
            state: 'LOADING',
            progress: 0.6,
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
      window.dispatchEvent(new CustomEvent('teamai:seat-task-evidence-runtime-read-model', {
        detail: {
          source: 'backend-read-model',
          available: true,
          authorized: true,
          seatId: 'seat-browser-read-model',
          transaction: {
            transactionId: 'tx-read-model',
            kind: 'mcp-invocation',
            state: 'COMPLETED',
            authoritative: true,
          },
        },
      }));
    });
    await expect(orb.locator('[data-transaction-orb-state]')).toHaveText('Completed');

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('teamai:seat-task-evidence-runtime-read-model', {
        detail: {
          source: 'backend-read-model',
          available: true,
          authorized: true,
          seatId: 'seat-browser-read-model',
        },
      }));
    });
    await expect(orb).toBeVisible();

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('teamai:seat-task-evidence-runtime-read-model', {
        detail: {
          source: 'backend-read-model',
          available: true,
          authorized: true,
          seatId: 'seat-browser-read-model',
          transaction: null,
        },
      }));
    });
    await expect(orb).toBeHidden();
  });

  test('S21 governed transaction matrix presents all operation families without local execution authority', async ({ page }) => {
    await page.goto('/hero/');

    const expected = [
      ['navigation', 'Navigation'],
      ['retrieval', 'Data retrieval'],
      ['connection-test', 'Connection test'],
      ['mcp-invocation', 'MCP invocation'],
      ['ai-execution', 'AI execution'],
      ['handoff-continuation', 'Handoff / continuation'],
      ['storage-operation', 'Storage operation'],
      ['commerce-verification', 'Commerce verification'],
      ['authorization', 'Authorization'],
      ['recovery', 'Recovery'],
    ];

    for (const [kind, label] of expected) {
      await page.evaluate(({ transactionKind }) => {
        window.TeamAiTransactionPresentation.set({
          seatId: 'seat-browser-matrix',
          transactionId: 'tx-matrix-' + transactionKind,
          kind: transactionKind,
          state: 'LOADING',
          authoritative: true,
        });
      }, { transactionKind: kind });

      const orb = page.locator('[data-transaction-orb]');
      await expect(orb).toBeVisible();
      await expect(orb.locator('[data-transaction-orb-label]')).toHaveText(label);
      await expect(orb.locator('[data-transaction-orb-state]')).toHaveText('Loading');
      await expect(orb).toHaveAttribute('data-kind', kind);
    }

    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
    await expect(page.locator('[data-transaction-orb]')).toBeHidden();
  });

  test('S22 accessibility preserves menu disclosure semantics and native form typing', async ({ page }) => {
    await page.goto('/hero/');

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    const popover = page.locator('#world-menu');

    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(popover).toBeHidden();
    await expect(popover).toHaveAttribute('aria-hidden', 'true');

    await menu.focus();
    await menu.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(popover).toHaveAttribute('aria-hidden', 'true');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();

    await menu.press('Enter');
    const authTrigger = page.locator('#world-menu [data-auth-open]').first();
    await authTrigger.click();

    const email = page.getByLabel('Email').first();
    await expect(email).toBeVisible();

    const before = await page.evaluate(() => ({
      motion: (window as any).TeamAiHero.getReducedMotion(),
      seatCount: (window as any).TeamAiHero.getSeatCount(),
      state: (window as any).TeamAiHero.getState(),
    }));

    await email.fill('');
    await email.press('m');
    await email.press('1');
    await email.press('d');

    await expect(email).toHaveValue('m1d');

    const after = await page.evaluate(() => ({
      motion: (window as any).TeamAiHero.getReducedMotion(),
      seatCount: (window as any).TeamAiHero.getSeatCount(),
      state: (window as any).TeamAiHero.getState(),
    }));
    expect(after).toEqual(before);

    await email.press('Enter');
    const afterEnter = await page.evaluate(() => ({
      motion: (window as any).TeamAiHero.getReducedMotion(),
      seatCount: (window as any).TeamAiHero.getSeatCount(),
      state: (window as any).TeamAiHero.getState(),
    }));
    expect(afterEnter).toEqual(before);
  });

  test('S22 keyboard navigation traverses the world menu without a pointer', async ({ page }) => {
    await page.goto('/hero/');

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.focus();
    await menu.press('Enter');

    const items = page.locator('#world-menu button');
    await expect(items.first()).toBeFocused();
    await expect(items.first()).toHaveText('Sign in');
    await expect(items.first()).toHaveCSS('outline-style', 'solid');
    await expect(items.first()).toHaveCSS('outline-width', '3px');
    await expect.poll(async () => items.first().evaluate((element) => element.matches(':focus-visible'))).toBe(true);

    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
    await expect(items.nth(1)).toHaveText('Selected seat');
    await expect(items.nth(1)).toHaveCSS('outline-style', 'solid');
    await expect(items.nth(1)).toHaveCSS('outline-width', '3px');
    await expect.poll(async () => items.nth(1).evaluate((element) => element.matches(':focus-visible'))).toBe(true);

    await page.keyboard.press('ArrowUp');
    await expect(items.first()).toBeFocused();

    await page.keyboard.press('End');
    await expect(items.last()).toBeFocused();
    await expect(items.last()).toHaveText('Seat Budget');

    await page.keyboard.press('Home');
    await expect(items.first()).toBeFocused();

    const settings = page.locator('#world-menu [data-settings-open]');
    await settings.focus();
    await settings.press('Enter');
    await expect(page.locator('#hero-settings-panel')).toBeVisible();
  });

  test('S22 deterministic accessible names cover the visible Hero interaction surface', async ({ page }) => {
    await page.goto('/hero/');

    await expect(page.locator('#hero-canvas')).toHaveAccessibleName('Interactive 3D Web AI workspace');

    const initialControls = page.locator('button:visible, a[href]:visible, input:visible, select:visible, textarea:visible');
    const initialCount = await initialControls.count();
    expect(initialCount).toBeGreaterThan(0);
    for (let index = 0; index < initialCount; index += 1) {
      await expect(initialControls.nth(index)).toHaveAccessibleName(/\S+/);
    }

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.click();
    const menuItems = page.locator('#world-menu button:visible');
    const menuItemCount = await menuItems.count();
    expect(menuItemCount).toBeGreaterThan(0);
    for (let index = 0; index < menuItemCount; index += 1) {
      await expect(menuItems.nth(index)).toHaveAccessibleName(/\S+/);
    }

    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    const settingsPanel = page.locator('#hero-settings-panel');
    await expect(settingsPanel).toBeVisible();
    const settingsControls = settingsPanel.locator('button:visible, input:visible, select:visible');
    const settingsCount = await settingsControls.count();
    expect(settingsCount).toBeGreaterThan(0);
    for (let index = 0; index < settingsCount; index += 1) {
      await expect(settingsControls.nth(index)).toHaveAccessibleName(/\S+/);
    }
  });

  test('S22 reduced motion preserves semantic hierarchy and turn lifecycle', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero/');

    await page.evaluate(() => (window as any).TeamAiHero.setReducedMotion(true));

    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    const hierarchy = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      const state = hero.getHierarchyState();
      return {
        openParentId: state.openParentId,
        phase: state.phase,
        openAmount: state.openAmount,
        focusedChildId: state.focusedChildId,
        camera: hero.getBaseCameraId(),
        heroState: hero.getState(),
        motion: hero.getReducedMotion(),
      };
    });

    expect(hierarchy.openParentId).toBe('SEAT_SHELL#0');
    expect(hierarchy.phase).toBe('open');
    expect(hierarchy.openAmount).toBe(1);
    expect(hierarchy.focusedChildId).toBeTruthy();
    expect(hierarchy.camera).toBe('SEAT_CLOSE');
    expect(hierarchy.heroState).toBe('FOCUS');
    expect(hierarchy.motion).toBe(true);

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
      (window as any).TeamAiHero.closeHierarchyParent();
      (window as any).TeamAiHero.startLoop();
    }));

    expect(lifecycle.slice(0, 6)).toEqual([
      'IDLE', 'FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB', 'REFLECT'
    ]);
    expect(lifecycle).toContain('HANDOFF');

    await page.evaluate(() => (window as any).TeamAiHero.stopLoop());
    await expect(page.locator('#state-label')).toHaveText('IDLE');
  });

  test('S22 Escape back unwinds hierarchy leaf to parent and returns to world', async ({ page }) => {
    await page.goto('/hero/');

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      const parts = hero.HIERARCHY_PART;
      hero.selectSeatShell(0);
      hero.focusChild(parts.SEAT_CONNECTION);
      hero.focusLeaf(parts.SEAT_CONNECTION_HEALTH_FACE);
    });

    const opened = await page.evaluate(() => (window as any).TeamAiHero.getHierarchyState());
    expect(opened.openParentId).toBeTruthy();
    expect(opened.focusedChildId).toBeTruthy();
    expect(opened.focusedLeafId).toBeTruthy();

    await page.keyboard.press('Escape');
    const parentAfterLeafBack = await page.evaluate(() => (window as any).TeamAiHero.getHierarchyState());
    expect(parentAfterLeafBack.openParentId).toBeTruthy();
    expect(parentAfterLeafBack.focusedChildId).toBeTruthy();
    expect(parentAfterLeafBack.focusedLeafId).toBeFalsy();

    await page.keyboard.press('Escape');
    await expect.poll(async () => page.evaluate(() => Boolean((window as any).TeamAiHero.getHierarchyState().openParentId))).toBe(false);
    const worldAfterParentBack = await page.evaluate(() => ({
      hierarchy: (window as any).TeamAiHero.getHierarchyState(),
      state: (window as any).TeamAiHero.getState(),
      camera: (window as any).TeamAiHero.getBaseCameraId(),
    }));
    expect(worldAfterParentBack.hierarchy.focusedChildId).toBeFalsy();
    expect(worldAfterParentBack.state).toBe('IDLE');
    expect(worldAfterParentBack.camera).toBe('HERO_WIDE');
  });

  test('S22 non-color-only meaning remains available as text and semantic state', async ({ page }) => {
    await page.goto('/hero/');

    await page.evaluate(() => window.TeamAiHeroSpatial.setPart('focus'));
    await expect(page.locator('[data-part="focus"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-part="focus"] .spatial-part__text')).toContainText('Focus');

    const seatStack = page.locator('.seat-stack');
    await expect(seatStack).toBeAttached();

    await page.evaluate(() => {
      window.TeamAiHeroSeatStack.setConnectionHealth('offline');
      window.TeamAiHeroSeatStack.setAuthorizationPresentation({
        state: 'blocked',
        scope: 'project',
        approvalRequired: true,
        entitlement: 'none',
      });
      window.TeamAiHeroSeatStack.setWorkspaceTaskPresentation({
        taskState: 'blocked',
        resultState: 'none',
        evidenceState: 'none',
        provenance: 'no-trace',
      });
    });

    const connection = page.locator('[data-seat-layer="connection"]');
    await expect(connection).toHaveAttribute('data-health', 'offline');
    await expect(connection.locator('.seat-stack__state')).toHaveText('OFF');
    await expect(connection.locator('.seat-stack__state')).toHaveAttribute('title', /Offline/);

    const authorization = page.locator('[data-seat-layer="authorization"]');
    await expect(authorization).toHaveAttribute('data-auth-state', 'blocked');
    await expect(authorization.locator('.seat-stack__state')).toHaveText('BLK');
    await expect(authorization.locator('.seat-stack__state')).toHaveAttribute('title', /Blocked/);
    await expect(authorization).toHaveAttribute('aria-label', /Authorization:.*Blocked/);

    const task = page.locator('[data-seat-layer="task"]');
    await expect(task).toHaveAttribute('data-task-state', 'blocked');
    await expect(task.locator('.seat-stack__state')).toHaveText('BLK');
    await expect(task.locator('.seat-stack__state')).toHaveAttribute('title', /Blocked/);
    await expect(task).toHaveAttribute('aria-label', /Task \/ Evidence:.*Blocked/);

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-browser-non-color',
        transactionId: 'tx-browser-non-color',
        kind: 'recovery',
        state: 'UNAVAILABLE',
        errorCode: 'PROVIDER_UNAVAILABLE',
        authoritative: true,
      });
    });

    const orb = page.locator('[data-transaction-orb]');
    await expect(orb.locator('[data-transaction-orb-state]')).toHaveText('Unavailable');
    await expect(orb.locator('[data-transaction-orb-detail]')).toContainText('PROVIDER_UNAVAILABLE');

    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
  });

  test('S22 blocked feature reasons are exposed without claiming authorization', async ({ page }) => {
    await page.goto('/hero/');

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.click();

    const lockedFeatures = page.locator('#world-menu button[data-feature-id]');
    const count = await lockedFeatures.count();
    expect(count).toBeGreaterThan(0);

    const reasonId = 'hero-guest-feature-blocked-reason';
    for (let index = 0; index < count; index += 1) {
      const control = lockedFeatures.nth(index);
      await expect(control).toHaveAccessibleName(await control.textContent());
      await expect(control).toHaveAttribute('aria-describedby', reasonId);
      await expect(control).toHaveAccessibleDescription(
        'Guest presentation: discoverable, blocked until authenticated runtime context is available.',
      );
      const label = await control.getAttribute('aria-label');
      expect(label || '').not.toContain('Guest presentation:');
      expect(label || '').not.toContain('unauthorized');
      expect(label || '').not.toContain('permission denied');
      await expect(control).toHaveAttribute('data-guest-reason', 'BLOCKED_UNTIL_AUTHENTICATED');
    }

    await expect(page.locator('#world-menu [data-settings-open]')).toHaveAccessibleName('Settings');
  });

  test('S22 state announcements expose the existing Hero state as a live status', async ({ page }) => {
    await page.goto('/hero/');

    const state = page.locator('#state-label');
    await expect(state).toHaveAttribute('role', 'status');
    await expect(state).toHaveAttribute('aria-live', 'polite');
    await expect(state).toHaveAttribute('aria-atomic', 'true');
    await expect(state).toHaveText('IDLE');

    await page.getByRole('button', { name: 'Start turn loop', exact: true }).click();
    await expect(state).toHaveText('FOCUS');

    await page.getByRole('button', { name: 'Stop turn loop', exact: true }).click();
    await expect(state).toHaveText('IDLE');
  });

  test('S22 browser accessibility smoke covers the canonical Hero route', async ({ page }) => {
    await page.goto('/hero/');

    await expect(page.locator('#hero-canvas')).toHaveAccessibleName('Interactive 3D Web AI workspace');
    const visibleControls = page.locator('button:visible, a[href]:visible, input:visible, select:visible, textarea:visible');
    const visibleCount = await visibleControls.count();
    expect(visibleCount).toBeGreaterThan(0);
    for (let index = 0; index < visibleCount; index += 1) {
      await expect(visibleControls.nth(index)).toHaveAccessibleName(/\S+/);
    }

    const state = page.locator('#state-label');
    await expect(state).toHaveAttribute('role', 'status');
    await expect(state).toHaveAttribute('aria-live', 'polite');
    await expect(state).toHaveText('IDLE');

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.focus();
    await expect(menu).toBeFocused();
    await expect.poll(async () => menu.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
    await menu.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');

    const menuItems = page.locator('#world-menu button:visible');
    expect(await menuItems.count()).toBeGreaterThan(0);
    await expect(menuItems.first()).toBeFocused();
    await expect(menuItems.first()).toHaveAccessibleName(/\S+/);

    const lockedFeatures = page.locator('#world-menu button[data-feature-id]:visible');
    const lockedCount = await lockedFeatures.count();
    expect(lockedCount).toBeGreaterThan(0);
    await expect(lockedFeatures.first()).toHaveAttribute('aria-describedby', 'hero-guest-feature-blocked-reason');
    await expect(lockedFeatures.first()).toHaveAccessibleDescription(
      'Guest presentation: discoverable, blocked until authenticated runtime context is available.',
    );

    const settingsTrigger = page.locator('#world-menu [data-settings-open]');
    await settingsTrigger.focus();
    await settingsTrigger.press('Enter');
    const settingsPanel = page.locator('#hero-settings-panel');
    await expect(settingsPanel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(settingsPanel).toBeHidden();
    await expect(settingsTrigger).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      const parts = hero.HIERARCHY_PART;
      hero.selectSeatShell(0);
      hero.focusChild(parts.SEAT_CONNECTION);
      hero.focusLeaf(parts.SEAT_CONNECTION_HEALTH_FACE);
      hero.setReducedMotion(true);
    });
    await page.keyboard.press('Escape');
    const parentState = await page.evaluate(() => (window as any).TeamAiHero.getHierarchyState());
    expect(parentState.openParentId).toBeTruthy();
    expect(parentState.focusedLeafId).toBeFalsy();
    await page.keyboard.press('Escape');
    await expect.poll(async () => page.evaluate(() => Boolean((window as any).TeamAiHero.getHierarchyState().openParentId))).toBe(false);
    await expect(state).toHaveText('IDLE');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getReducedMotion())).toBe(true);
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('HERO_WIDE');

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-accessibility-smoke',
        transactionId: 'tx-accessibility-smoke',
        kind: 'recovery',
        state: 'UNAVAILABLE',
        errorCode: 'PROVIDER_UNAVAILABLE',
        authoritative: true,
      });
    });
    await expect(page.locator('[data-hero-accessibility-announcement]')).toHaveText(
      'Seat transaction recovery is unavailable · PROVIDER_UNAVAILABLE.'
    );
    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
  });

  test('S22 accessibility baseline supports keyboard focus, Escape parent return, and transaction announcements', async ({ page }) => {
    await page.goto('/hero/');

    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement)) return { focused: false, focusVisible: false, outlineWidth: '0px' };
      return {
        focused: true,
        focusVisible: active.matches(':focus-visible'),
        outlineWidth: getComputedStyle(active).outlineWidth,
      };
    });
    expect(focus.focused).toBe(true);
    expect(focus.focusVisible).toBe(true);
    expect(parseFloat(focus.outlineWidth)).toBeGreaterThan(0);

    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.focus();
    await expect(menu).toBeFocused();
    await menu.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');

    const settingsTrigger = page.locator('#world-menu [data-settings-open]');
    await expect(settingsTrigger).toBeVisible();
    await settingsTrigger.click();
    const settingsPanel = page.locator('#hero-settings-panel');
    await expect(settingsPanel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(settingsPanel).toBeHidden();
    await expect(settingsTrigger).toBeFocused();

    const authTrigger = page.locator('#world-menu [data-auth-open]');
    await expect(authTrigger).toBeVisible();
    await authTrigger.focus();
    await expect(authTrigger).toBeFocused();
    await authTrigger.click();
    const authPanel = page.locator('#hero-auth-panel');
    await expect(authPanel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(authPanel).toBeHidden();
    await expect(authTrigger).toBeFocused();

    await page.evaluate(() => {
      window.TeamAiTransactionPresentation.set({
        seatId: 'seat-accessibility',
        transactionId: 'tx-accessibility',
        kind: 'recovery',
        state: 'UNAVAILABLE',
        errorCode: 'PROVIDER_UNAVAILABLE',
        authoritative: true,
      });
    });
    await expect(page.locator('[data-hero-accessibility-announcement]')).toHaveText(
      'Seat transaction recovery is unavailable · PROVIDER_UNAVAILABLE.'
    );

    await page.evaluate(() => window.TeamAiTransactionPresentation.clear());
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

  test('S23 responsive machine preserves semantic workflow across viewport tiers', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 800, tier: 'desktop' },
      { width: 820, height: 1180, tier: 'compact' },
      { width: 390, height: 844, tier: 'phone' },
    ];
    const cameraRadii: number[] = [];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/hero/');
      await expect(page.locator('#hero-canvas')).toBeVisible();
      await expect(page.locator('.world-navigation')).toBeVisible();
      await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(10));
      await expect(page.locator('#seat-label')).toContainText('10 seats presented');

      const state = await page.evaluate(() => {
        const canvas = document.querySelector('#hero-canvas') as HTMLCanvasElement | null;
        const root = document.documentElement;
        return {
          responsive: (window as any).TeamAiResponsive.getState(),
          canvasTier: canvas?.dataset.machineWorldResponsiveTier,
          canvasOrientation: canvas?.dataset.machineWorldResponsiveOrientation,
          touchAction: canvas ? getComputedStyle(canvas).touchAction : '',
          clientWidth: root.clientWidth,
          clientHeight: root.clientHeight,
          scrollWidth: root.scrollWidth,
          scrollHeight: root.scrollHeight,
          bodyScrollWidth: document.body.scrollWidth,
          bodyScrollHeight: document.body.scrollHeight,
          cameraRadius: Number(canvas?.dataset.machineWorldCameraRadius || 0),
          spatialDensity: canvas?.dataset.machineWorldResponsiveDensity || '',
          readability: canvas?.dataset.machineWorldReadability || '',
          seatSpacingPx: Number(canvas?.dataset.machineWorldReadabilitySeatSpacingPx || 0),
          podFeaturePx: Number(canvas?.dataset.machineWorldReadabilityPodFeaturePx || 0),
          facilityFeaturePx: Number(canvas?.dataset.machineWorldReadabilityFacilityFeaturePx || 0),
          seatSpacingThresholdPx: Number(canvas?.dataset.machineWorldReadabilitySeatThresholdPx || 0),
          featureThresholdPx: Number(canvas?.dataset.machineWorldReadabilityFeatureThresholdPx || 0),
        };
      });

      expect(state.responsive.tier).toBe(viewport.tier);
      expect(state.canvasTier).toBe(viewport.tier);
      expect(state.touchAction).toBe('none');
      expect(state.scrollWidth).toBeLessThanOrEqual(state.clientWidth);
      expect(state.scrollHeight).toBeLessThanOrEqual(state.clientHeight);
      expect(state.bodyScrollWidth).toBeLessThanOrEqual(state.clientWidth);
      expect(state.bodyScrollHeight).toBeLessThanOrEqual(state.clientHeight);
      expect(state.cameraRadius).toBeGreaterThan(0);
      expect(state.spatialDensity).toBe(
        viewport.tier === 'desktop' ? 'balanced' : viewport.tier === 'compact' ? 'compressed' : 'compact',
      );
      expect(state.readability).toBe('pass');
      expect(state.seatSpacingPx).toBeGreaterThanOrEqual(state.seatSpacingThresholdPx);
      expect(state.podFeaturePx).toBeGreaterThanOrEqual(state.featureThresholdPx);
      expect(state.facilityFeaturePx).toBeGreaterThanOrEqual(state.featureThresholdPx);
      cameraRadii.push(state.cameraRadius);

      expect(await page.evaluate(() => (window as any).TeamAiHero.getSeatCount())).toBe(10);

      const beforeOrbit = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
      await page.evaluate(() => {
        const canvas = document.querySelector('#hero-canvas');
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('missing hero canvas');
        canvas.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 9901,
          pointerType: 'touch',
          clientX: 100,
          clientY: 180,
        }));
        canvas.dispatchEvent(new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 9901,
          pointerType: 'touch',
          clientX: 180,
          clientY: 200,
        }));
        canvas.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 9901,
          pointerType: 'touch',
          clientX: 180,
          clientY: 200,
        }));
      });
      const afterOrbit = await page.evaluate(() => (window as any).TeamAiHero.getNavOrbitYaw());
      expect(afterOrbit).not.toBe(beforeOrbit);

      if (viewport.tier !== 'desktop') {
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
        const settingsTrigger = page.locator('#world-menu [data-settings-open]');
        await expect(settingsTrigger).toBeVisible();
        await settingsTrigger.click();
        const panelBounds = await page.locator('#hero-settings-panel').evaluate((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
        });
        expect(panelBounds.left).toBeGreaterThanOrEqual(0);
        expect(panelBounds.top).toBeGreaterThanOrEqual(0);
        expect(panelBounds.right).toBeLessThanOrEqual(viewport.width);
        expect(panelBounds.bottom).toBeLessThanOrEqual(viewport.height);
        await page.keyboard.press('Escape');
      }

      await page.evaluate(() => (window as any).TeamAiHero.setReducedMotion(true));
      const reduced = await page.evaluate(() => ({
        tier: (window as any).TeamAiResponsive.getState().tier,
        state: (window as any).TeamAiHero.getState(),
        reducedMotion: (window as any).TeamAiHero.getReducedMotion(),
      }));
      expect(reduced.tier).toBe(viewport.tier);
      expect(reduced.state).toBe('IDLE');
      expect(reduced.reducedMotion).toBe(true);
    }

    expect(cameraRadii[1]).toBeGreaterThanOrEqual(cameraRadii[0]);
    expect(cameraRadii[2]).toBeGreaterThan(cameraRadii[0]);
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