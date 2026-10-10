import { expect, test } from '@playwright/test';

test.use({
  video: 'on',
  viewport: { width: 1440, height: 900 },
});

test.describe('029 real-product video evidence', () => {
  test('captures the actual Hero machine through focus, division, return, and turn-loop states', async ({ page }) => {
    await page.goto('/hero/');
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(1200);

    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-shell-count', '20');
    await expect(canvas).toHaveAttribute('data-machine-world-legacy-outer-housing-fallback-count', '0');
    await expect(canvas).toHaveAttribute('data-machine-world-authored-outer-housing-replacement-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-main-shell-count', '4');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-shell-version', 'S7-OUTER-BODY-V3');
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
    await expect(canvas).toHaveAttribute('data-machine-world-pod-assembly-version', 'S3-V8');
    await expect(canvas).toHaveAttribute('data-machine-world-pod-face-brace-attachment', 'panel-local-matrix-v2');

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