import { expect, test } from '@playwright/test';

test.use({
  video: 'on',
  viewport: { width: 1440, height: 900 },
});

test.describe('029 real-product video evidence', () => {
  test('captures the actual Hero machine through focus, division, return, and turn-loop states', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.goto('/hero/');
    const canvas = page.locator('#hero-canvas');
    const worldMenu = page.locator('#world-menu');
    const worldMenuToggle = page.locator('[data-world-menu-toggle]');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(1200);

    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-shell-count', '20');
    await expect(canvas).toHaveAttribute('data-machine-world-legacy-outer-housing-fallback-count', '0');
    await expect(canvas).toHaveAttribute('data-machine-world-authored-outer-housing-replacement-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-main-shell-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-shell-version', 'S7-OUTER-BODY-V4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-service-bay-count', '2');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-core-primitive-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-core-shapes', 'BRANCH-OUTER-ALPHA:CYL|BRANCH-OUTER-BETA:BOX|BRANCH-OUTER-GAMMA:CYL|BRANCH-OUTER-DELTA:CYL');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-core-primitive-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-docking-embodiment', 'S8-ENDPOINT-V3');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-docking-count', '19');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-docking-connector-span', 'visible');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-docking-endpoint-count', '8');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-docking-facility-count', '11');
    await expect(canvas).toHaveAttribute('data-machine-world-service-manifold-junction-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-service-manifold-junction-rendered-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-service-manifold-junction-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-version', 'S8-FACILITY-CARRIER-V2');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-count', '20');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-stage-count', '12');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-hinge-count', '8');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-rendered', '20');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-carrier-scope', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-presentation-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-profile', 'position-approx');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-shell-count', '0');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shell-alpha-profile', 'base');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-main-shell-alpha', '');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shoulder-plate-alpha', '');
    await expect(canvas).toHaveAttribute('data-machine-world-pod-assembly-version', 'S3-V8');
    await expect(canvas).toHaveAttribute('data-machine-world-pod-face-brace-attachment', 'panel-local-matrix-v2');
    
    // A facility focus must interrupt the demo turn loop instead of being overwritten by it.
    await page.evaluate(() => (window as any).TeamAiHero.startLoop());
    // Exercise facility focus through the real production navigation, not the QA preview.
    await worldMenuToggle.click();
    await expect(worldMenu).toHaveClass(/is-open/);
    await page.locator('[data-facility-focus="BRANCH-OUTER-ALPHA"]').click();
    await expect(worldMenu).not.toHaveClass(/is-open/);
    await expect(worldMenu).toBeHidden();
    await expect(worldMenuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas).toHaveAttribute('data-machine-world-camera-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-machine-world-presentation-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-branch', 'BRANCH-OUTER-ALPHA');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-profile', 's7-face-normal-v1');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-shell-count', '5');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shell-alpha-profile', 'selected-core-reveal-v1');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-main-shell-alpha', '0.32');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shoulder-plate-alpha', '0.42');
    await expect(page.locator('[data-facility-focus="BRANCH-OUTER-ALPHA"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#facility-focus-status')).toContainText('Analysis · Telescope');
    const focusedSubject = await page.evaluate(() => ({
      center: document.querySelector('#hero-canvas')?.getAttribute('data-machine-world-facility-focus-subject-center'),
      span: document.querySelector('#hero-canvas')?.getAttribute('data-machine-world-facility-focus-subject-span'),
      focusState: (window as any).TeamAiHero.getFacilityFocusState(),
      seats: (window as any).TeamAiHero.getSeatCount(),
      selectedSeat: (window as any).TeamAiHero.getSelectedSeat(),
    }));
    expect(focusedSubject.center?.split(',')).toHaveLength(3);
    expect(focusedSubject.span?.split(',').map(Number).every((value) => Number.isFinite(value) && value > 0)).toBe(true);
    expect(focusedSubject.focusState).toMatchObject({
      active: true,
      branchId: 'BRANCH-OUTER-ALPHA',
      mode: 'FACILITY_FOCUS',
      presentationOnly: true,
    });
    expect(focusedSubject.focusState.cameraId).toBe('HERO_WIDE');
    expect(await page.evaluate(() => (window as any).TeamAiHero.getState())).toBe('IDLE');
    await page.screenshot({ path: testInfo.outputPath('facility-focus-analysis.png') });

    for (const branchId of [
      'BRANCH-OUTER-BETA',
      'BRANCH-OUTER-GAMMA',
      'BRANCH-OUTER-DELTA',
    ]) {
      await worldMenuToggle.click();
      await expect(worldMenu).toHaveClass(/is-open/);
      await page.locator(`[data-facility-focus="${branchId}"]`).click();
      await expect(worldMenu).not.toHaveClass(/is-open/);
      await expect(worldMenu).toBeHidden();
      await expect(worldMenuToggle).toHaveAttribute('aria-expanded', 'false');
      await expect(canvas).toHaveAttribute('data-machine-world-camera-mode', 'FACILITY_FOCUS');
      await expect(canvas).toHaveAttribute('data-machine-world-presentation-mode', 'FACILITY_FOCUS');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-branch', branchId);
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-validation', 'pass');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-profile', 's7-face-normal-v1');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-shell-count', '5');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shell-alpha-profile', 'selected-core-reveal-v1');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-main-shell-alpha', '0.32');
      await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shoulder-plate-alpha', '0.42');
      const span = await canvas.getAttribute('data-machine-world-facility-focus-subject-span');
      expect(span?.split(',').map(Number).every((value) => Number.isFinite(value) && value > 0)).toBe(true);
      if (branchId === 'BRANCH-OUTER-BETA') {
        await page.screenshot({ path: testInfo.outputPath('facility-focus-operations.png') });
      }
    }

    expect(focusedSubject.seats).toBe(10);
    expect(focusedSubject.selectedSeat).toBe(0);

    const rejected = await page.evaluate(() => (window as any).TeamAiHero.focusFacility('BRANCH-OUTER-UNKNOWN'));
    expect(rejected).toMatchObject({ ok: false, reason: 'UNKNOWN_FACILITY_BRANCH', presentationOnly: true });
    await expect(canvas).toHaveAttribute('data-machine-world-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-presentation-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-branch', '');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-validation', 'pass');

    // The return affordance must also work as an ordinary browser interaction.
    await worldMenuToggle.click();
    await expect(worldMenu).toHaveClass(/is-open/);
    await page.locator('[data-facility-focus="BRANCH-OUTER-BETA"]').click();
    await expect(worldMenu).toBeHidden();
    await expect(canvas).toHaveAttribute('data-machine-world-camera-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-branch', 'BRANCH-OUTER-BETA');
    await worldMenuToggle.click();
    await expect(worldMenu).toHaveClass(/is-open/);
    await page.locator('[data-facility-focus-return]').click();
    await expect(worldMenu).toBeHidden();
    await expect(worldMenuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas).toHaveAttribute('data-machine-world-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-presentation-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-branch', '');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-profile', 'position-approx');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-normal-shell-count', '0');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shell-alpha-profile', 'base');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-main-shell-alpha', '');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-focus-shoulder-plate-alpha', '');
    await expect(page.locator('#facility-focus-status')).toHaveText('World overview');
    await expect(canvas).toHaveAttribute('data-machine-world-topology-validation', 'pass');
    await expect(worldMenu).toBeHidden();
    await expect(worldMenuToggle).toHaveAttribute('aria-expanded', 'false');


    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    await page.waitForTimeout(1100);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_CONNECTION'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_BEHAVIOR'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_TASK_EVIDENCE'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.closeHierarchyParent());
    await page.waitForTimeout(1100);

    await page.evaluate(() => (window as any).TeamAiHero.startLoop());
    await page.waitForTimeout(3000);
    await page.evaluate(() => (window as any).TeamAiHero.stopLoop());
    await page.waitForTimeout(500);

    const snapshot = await page.evaluate(() => ({
      seatCount: (window as any).TeamAiHero.getSeatCount(),
      selectedSeat: (window as any).TeamAiHero.getSelectedSeat(),
      state: (window as any).TeamAiHero.getState(),
      cameraId: (window as any).TeamAiHero.getBaseCameraId(),
      reducedMotion: (window as any).TeamAiHero.getReducedMotion(),
      hierarchyOpen: (window as any).TeamAiHero.getHierarchyState().openParentId,
    }));

    expect(snapshot.seatCount).toBe(10);
    expect(snapshot.selectedSeat).toBe(0);
    expect(snapshot.cameraId).toBe('HERO_WIDE');
    expect(snapshot.reducedMotion).toBe(false);
    expect(snapshot.hierarchyOpen).toBeFalsy();
  });
});