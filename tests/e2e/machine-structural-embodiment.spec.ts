import { expect, test, type Locator, type Page } from '@playwright/test';


async function screenshotCanvasImmediately(page: Page, canvas: Locator, path?: string) {
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('Structural preview canvas has no visible bounding box');
  // Page screenshot with a clip captures the composited canvas immediately.
  // Locator.screenshot() waits for element stability, which can outlast a
  // choreography midpoint when whole-world rendering is expensive.
  return page.screenshot({ clip: bounds, path });
}

async function canvasPixelDelta(page: Page, baselinePng: Buffer, candidatePng: Buffer) {
  return page.evaluate(async ({ baseline, candidate }) => {
    const decode = async (encoded: string) => {
      const response = await fetch('data:image/png;base64,' + encoded);
      return createImageBitmap(await response.blob());
    };
    const [left, right] = await Promise.all([decode(baseline), decode(candidate)]);
    try {
      if (left.width !== right.width || left.height !== right.height) {
        return {
          width: left.width,
          height: left.height,
          candidateWidth: right.width,
          candidateHeight: right.height,
          changedPixelRatio: 1,
        };
      }
      const scratch = document.createElement('canvas');
      scratch.width = left.width;
      scratch.height = left.height;
      const context = scratch.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas pixel-delta context unavailable');
      context.drawImage(left, 0, 0);
      const leftPixels = context.getImageData(0, 0, left.width, left.height).data;
      context.clearRect(0, 0, right.width, right.height);
      context.drawImage(right, 0, 0);
      const rightPixels = context.getImageData(0, 0, right.width, right.height).data;
      let changed = 0;
      for (let index = 0; index < leftPixels.length; index += 4) {
        const delta = Math.max(
          Math.abs(leftPixels[index] - rightPixels[index]),
          Math.abs(leftPixels[index + 1] - rightPixels[index + 1]),
          Math.abs(leftPixels[index + 2] - rightPixels[index + 2]),
        );
        if (delta > 8) changed += 1;
      }
      return {
        width: left.width,
        height: left.height,
        changedPixels: changed,
        changedPixelRatio: changed / (left.width * left.height),
      };
    } finally {
      left.close();
      right.close();
    }
  }, {
    baseline: baselinePng.toString('base64'),
    candidate: candidatePng.toString('base64'),
  });
}

test.describe('S2-S10 structural embodiment candidate', () => {
  test('composes the structural machine in one Three.js canvas', async ({ page }) => {
    await page.goto('/spatial/machine-structural-embodiment-preview.html?testMode=1');
    const status = page.locator('[data-structural-status]');
    const canvas = page.locator('canvas[aria-label="S2-S10 structural embodiment candidate"]');
    await expect(status).toContainText('READY · WORLD · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-visible-topology-edges', '10');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'STOWED');
    await expect(canvas).toHaveAttribute('data-three-material-model', 'S24-authored-theme-family');
    await expect(canvas).toHaveAttribute('data-structural-facility-focus-lighting', 'base');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '10');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '4');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-shell-version', 'S7-OUTER-BODY-V4');
    await expect(canvas).toHaveAttribute('data-structural-facility-shell-descriptor-count', '20');
    await expect(canvas).toHaveAttribute('data-structural-facility-service-bay-descriptor-count', '2');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-descriptor-count', '20');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-scope', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-descriptor-count', '19');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-render-part-count', '38');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-scope', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-count', '4');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-scope', 'WORLD_OVERVIEW');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-world.png', fullPage: true });
    const worldCanvasPng = await screenshotCanvasImmediately(page, canvas, 'test-results/s2-s10-world-canvas.png');

    const browserChoreography = await page.evaluate(async () => {
      const module = await import('/machine-structural-choreography-sequence.js');
      const sample = module.deriveStructuralPreviewChoreographySample(3, 4, 1);
      return {
        phase: sample.choreography.phase,
        connectionAmount: sample.connectionAmount,
        electrical: sample.choreography.electrical,
        focusedChildId: sample.focusedChildId,
      };
    });
    expect(browserChoreography).toEqual({
      phase: 'ELECTRICAL_TRANSFER',
      connectionAmount: 0.82,
      electrical: 0.82,
      focusedChildId: 'SEAT_CONNECTION',
    });

    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    const transformMid = await page.waitForFunction(
      () => {
        const progress = Number(document.querySelector('canvas')?.getAttribute('data-structural-choreography-progress'));
        if (!(progress > 0.25 && progress < 0.95)) return false;
        const canvas = document.querySelector('canvas');
        return {
          progress,
          fromStage: canvas?.getAttribute('data-structural-choreography-from-stage'),
          toStage: canvas?.getAttribute('data-structural-choreography-to-stage'),
          transformation: Number(canvas?.getAttribute('data-structural-choreography-transformation')),
        };
      },
      undefined,
      { timeout: 10000, polling: 'raf' },
    ).then((handle) => handle.jsonValue());
    expect(transformMid.fromStage).toBe('0');
    expect(transformMid.toStage).toBe('1');
    expect(transformMid.progress).toBeGreaterThan(0.25);
    expect(transformMid.progress).toBeLessThan(0.95);
    expect(transformMid.transformation).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-three-assembly-mesh-reuse-count')))
      .toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-three-topology-object-reuse-count')))
      .toBeGreaterThan(0);
    const transformMidCanvasPng = await screenshotCanvasImmediately(
      page,
      canvas,
      'test-results/s2-s10-transform-mid-canvas.png',
    );
    const transformMidPixelDelta = await canvasPixelDelta(page, worldCanvasPng, transformMidCanvasPng);
    console.log(
      '[structural-transform-mid] progress=' + transformMid.progress.toFixed(3)
      + ' transformation=' + transformMid.transformation.toFixed(3)
      + ' changedCanvasPixels=' + Math.round(transformMidPixelDelta.changedPixelRatio * 10000) / 100
      + '% (' + transformMidPixelDelta.changedPixels + '/' + (transformMidPixelDelta.width * transformMidPixelDelta.height) + ')',
    );
    expect(transformMidPixelDelta.changedPixelRatio, 'transform midpoint must visibly differ from settled World')
      .toBeGreaterThan(0.005);
    await page.screenshot({ path: 'test-results/s2-s10-transform-mid.png', fullPage: true });
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'SHELL_DEPLOYING');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'DIVISION_DEPLOYING');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'TOPOLOGY_LINKING');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-connection', '0.82');
    await expect(canvas).toHaveAttribute('data-structural-choreography-electrical', '0.82');
    await expect(canvas).toHaveAttribute('data-structural-choreography-focused-child', 'SEAT_CONNECTION');
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'ELECTRICAL_TRANSFER');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'SETTLED');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');

    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    const returnMid = await page.waitForFunction(
      () => {
        const canvas = document.querySelector('canvas');
        const progress = Number(canvas?.getAttribute('data-structural-choreography-progress'));
        if (!(canvas?.getAttribute('data-structural-choreography-returning-to-world') === 'true')) return false;
        if (!(progress > 0.50 && progress < 0.70)) return false;
        const hooks = (window as any).__TEAMAI_STRUCTURAL_PREVIEW_TEST_HOOKS__;
        if (!hooks) throw new Error('Structural preview test hooks were not installed');
        const pause = hooks.pauseChoreography();
        if (pause?.paused !== true) return false;
        return {
          progress,
          view: canvas?.getAttribute('data-structural-view'),
          topologyMode: canvas?.getAttribute('data-structural-topology-mode'),
          cameraMode: canvas?.getAttribute('data-structural-camera-mode'),
          transformation: Number(canvas?.getAttribute('data-structural-choreography-transformation')),
          paused: pause.paused,
          pausedProgress: pause.progress,
          pauseFromStage: pause.fromStage,
          pauseToStage: pause.toStage,
        };
      },
      undefined,
      { timeout: 10000, polling: 'raf' },
    ).then((handle) => handle.jsonValue());
    expect(returnMid.view).toBe('world');
    expect(returnMid.topologyMode).toBe('WORLD_OVERVIEW');
    expect(returnMid.cameraMode).toBe('RETURN_TO_WORLD');
    expect(returnMid.progress).toBeGreaterThan(0.50);
    expect(returnMid.progress).toBeLessThan(0.70);
    expect(returnMid.transformation).toBeGreaterThan(0);
    expect(returnMid.transformation).toBeLessThan(1);
    expect(returnMid.paused).toBe(true);
    expect(returnMid.pauseFromStage).toBe(5);
    expect(returnMid.pauseToStage).toBe(0);
    expect(returnMid.pausedProgress).toBe(returnMid.progress);
    // Freeze the real RAF-driven midpoint during capture, then resume below.
    const returnMidCanvasPng = await screenshotCanvasImmediately(
      page,
      canvas,
      'test-results/s2-s10-return-mid-canvas.png',
    );
    const returnMidPixelDelta = await canvasPixelDelta(page, worldCanvasPng, returnMidCanvasPng);
    console.log(
      '[structural-return-mid] progress=' + returnMid.progress.toFixed(3)
      + ' transformation=' + returnMid.transformation.toFixed(3)
      + ' changedCanvasPixels=' + Math.round(returnMidPixelDelta.changedPixelRatio * 10000) / 100
      + '% (' + returnMidPixelDelta.changedPixels + '/' + (returnMidPixelDelta.width * returnMidPixelDelta.height) + ')',
    );
    expect(
      returnMidPixelDelta.changedPixelRatio,
      'return midpoint must visibly differ from the settled World canvas, not just its DOM telemetry',
    ).toBeGreaterThan(0.005);

    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'STOWED');
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await page.evaluate(() => {
      (window as any).__TEAMAI_STRUCTURAL_PREVIEW_TEST_HOOKS__.resumeChoreography();
    });
    await expect(canvas).toHaveAttribute('data-structural-choreography-returning-to-world', 'false');
    const settledReturnCanvasPng = await screenshotCanvasImmediately(
      page,
      canvas,
      'test-results/s2-s10-return-settled-canvas.png',
    );
    await page.screenshot({ path: 'test-results/s2-s10-return.png', fullPage: true });
    const midVsSettledPixelDelta = await canvasPixelDelta(page, returnMidCanvasPng, settledReturnCanvasPng);
    console.log(
      '[structural-return-settled] changedCanvasPixels='
      + Math.round(midVsSettledPixelDelta.changedPixelRatio * 10000) / 100
      + '% (' + midVsSettledPixelDelta.changedPixels + '/' + (midVsSettledPixelDelta.width * midVsSettledPixelDelta.height) + ')',
    );
    expect(
      midVsSettledPixelDelta.changedPixelRatio,
      'return midpoint must visibly differ from the settled return canvas',
    ).toBeGreaterThan(0.005);

    await page.getByRole('button', { name: 'Seat 1 / Divisions', exact: true }).click();
    await expect(status).toContainText('READY · SEAT · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'seat');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'DIVISION_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'POD_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-focused-division', 'SEAT_CONNECTION');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '7');
    await expect(canvas).toHaveAttribute('data-structural-facility-service-bay-descriptor-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-descriptor-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-scope', 'DIVISION_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-descriptor-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-render-part-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-validation', 'scoped-out');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-scope', 'DIVISION_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-validation', 'scoped-out');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-seat.png', fullPage: true });

    await page.getByRole('button', { name: 'Facility', exact: true }).click();
    await expect(status).toContainText('READY · FACILITY · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'facility');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-facility-focus-lighting', 'enhanced');
    await expect(canvas).toHaveAttribute('data-three-facility-focus-lighting', 'enhanced');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-service-bay-descriptor-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-descriptor-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-facility-carrier-scope', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-descriptor-count', '5');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-render-part-count', '10');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-validation', 'pass');
    await expect(canvas).toHaveAttribute('data-structural-facility-docking-scope', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-count', '0');
    await expect(canvas).toHaveAttribute('data-structural-service-manifold-junction-validation', 'scoped-out');
    const facilityConduitKinds = await canvas.getAttribute('data-structural-conduit-edge-kinds');
    expect(facilityConduitKinds).toContain('facility-facility');
    expect(facilityConduitKinds).not.toContain('pod-facility');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-facility.png', fullPage: true });
  });
});
