import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }, testInfo) => {
    await page.goto('/hero/');
    await expect(page.getByRole('heading', { name: 'Living Web AI Workspace' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    for (const label of ['Wide', 'Low orbit', 'Team', 'Workspace', 'Map', 'Seat', 'Detail']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.locator('.spatial-part')).toHaveCount(3);
    await expect(page.locator('[data-seat-layer]')).toHaveCount(8);
    const path = testInfo.outputPath('hero-wide.png');
    await page.screenshot({ path });
    await testInfo.attach('hero-wide', { path, contentType: 'image/png' });
  });

  test('exercises semantic POV, turn-loop, seat-focus, spatial parts, seat stack, and reduced-motion controls', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');

    await page.getByRole('button', { name: 'Workspace', exact: true }).click();
    await page.getByRole('button', { name: 'Map', exact: true }).click();
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.getByRole('button', { name: 'Surface', exact: true }).click({ force: true });
    await expect(page.getByRole('button', { name: 'Surface', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const activePart = await page.evaluate(() => (window as any).TeamAiHeroSpatial.getActivePart());
    expect(activePart).toBe('surface');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('surface'))).toBe('WORKSPACE_CLOSE');

    await page.getByRole('button', { name: 'Focus', exact: true }).click({ force: true });
    await expect(page.getByRole('button', { name: 'Surface', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'Focus', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => (window as any).TeamAiHeroSpatial.getCameraForPart('focus'))).toBe('SEAT_CLOSE');

    await page.getByRole('button', { name: 'Seat', exact: true }).click();
    await page.getByRole('button', { name: 'Detail', exact: true }).click();

    const stackLayers = await page.evaluate(() => (window as any).TeamAiHeroSeatStack.layers().map((layer: any) => layer.id));
    expect(stackLayers).toEqual(['connection', 'behavior', 'toolkit', 'zipskills', 'capabilities', 'authorization', 'workspace', 'task']);
    const semanticCameras = await page.evaluate(() => (window as any).TeamAiHeroSeatStack.layers().map((layer: any) => layer.semanticCamera));
    expect(semanticCameras).toEqual([
      'MECHANISM_CONNECTION', 'MECHANISM_BEHAVIOR', 'MECHANISM_SKILLS', 'MECHANISM_ZIPSKILLS',
      'MECHANISM_CAPABILITY', 'MECHANISM_AUTHORIZATION', 'MECHANISM_WORKSPACE', 'MECHANISM_TASK'
    ]);

    const inspectionEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-inspection', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('[data-seat-layer="capabilities"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }));
    await expect(page.locator('[data-seat-layer="capabilities"]')).toHaveAttribute('aria-pressed', 'true');
    expect(await inspectionEvent).toMatchObject({
      layer: 'capabilities', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_CAPABILITY', presentationOnly: true
    });

    const equipmentEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-equipment-preview', (event: any) => resolve(event.detail), { once: true });
      (window as any).TeamAiHeroSeatStack.setEquipped('zipskills', true);
    }));
    await expect(page.locator('[data-seat-layer="zipskills"]')).toHaveAttribute('data-equipped', 'true');
    expect(await equipmentEvent).toMatchObject({ layer: 'zipskills', equipped: true, semanticCamera: 'MECHANISM_ZIPSKILLS', presentationOnly: true });

    const handoffEvent = page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('teamai:web-ai-seat-configure-request', (event: any) => resolve(event.detail), { once: true });
      document.querySelector('.seat-stack__handoff')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }));
    expect(await handoffEvent).toMatchObject({ targetSection: 'capabilities', seatContext: 'current', presentationOnly: true, normalUi: true, semanticCamera: 'APP_UI_HANDOFF' });

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
