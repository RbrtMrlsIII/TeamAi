import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }, testInfo) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'world');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'machine');
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
    await page.getByRole('button', { name: 'Surface shared state', exact: true }).click({ force: true });
    await expect(page.getByRole('button', { name: 'Surface shared state', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const activePart = await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart());
    expect(activePart).toBe('surface');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('surface'))).toBe('WORKSPACE_CLOSE');
