import { expect, test } from '@playwright/test';

test.describe('S2-S10 structural embodiment candidate', () => {
  test('composes the structural machine in one Three.js canvas', async ({ page }) => {
    await page.goto('/spatial/machine-structural-embodiment-preview.html');
    const status = page.locator('[data-structural-status]');
    const canvas = page.locator('canvas[aria-label="S2-S10 structural embodiment candidate"]');
    await expect(status).toContainText('READY · WORLD · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'STOWED');
    await expect(canvas).toHaveAttribute('data-three-material-model', 'S24-authored-theme-family');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '10');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '4');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-world.png', fullPage: true });

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
    await expect.poll(
      async () => Number(await canvas.getAttribute('data-structural-choreography-progress')),
      { timeout: 5000 },
    ).toBeGreaterThan(0.25);
    expect(Number(await canvas.getAttribute('data-structural-choreography-progress'))).toBeLessThan(0.95);
    await expect(canvas).toHaveAttribute('data-structural-choreography-from-stage', '0');
    await expect(canvas).toHaveAttribute('data-structural-choreography-to-stage', '1');
    await expect.poll(
      async () => Number(await canvas.getAttribute('data-structural-choreography-transformation')),
      { timeout: 5000 },
    ).toBeGreaterThan(0);
    await page.screenshot({ path: 'test-results/s2-s10-transform-mid.png', fullPage: true });
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'SHELL_DEPLOYING');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'DIVISION_DEPLOYING');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'TOPOLOGY_LINKING');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-connection', '0.82');
    await expect(canvas).toHaveAttribute('data-structural-choreography-electrical', '0.82');
    await expect(canvas).toHaveAttribute('data-structural-choreography-focused-child', 'SEAT_CONNECTION');
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'ELECTRICAL_TRANSFER');
    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'SETTLED');

    await page.getByRole('button', { name: 'Transform', exact: true }).click();
    await expect.poll(
      async () => String(await canvas.getAttribute('data-structural-choreography-returning-to-world')),
      { timeout: 5000 },
    ).toBe('true');
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'RETURN_TO_WORLD');
    await expect.poll(
      async () => Number(await canvas.getAttribute('data-structural-choreography-progress')),
      { timeout: 5000 },
    ).toBeGreaterThan(0.55);
    expect(Number(await canvas.getAttribute('data-structural-choreography-progress'))).toBeLessThan(0.95);
    expect(Number(await canvas.getAttribute('data-structural-choreography-transformation'))).toBeLessThan(1);
    await page.screenshot({ path: 'test-results/s2-s10-return-mid.png', fullPage: true });

    await expect(canvas).toHaveAttribute('data-structural-choreography-phase', 'STOWED');
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-choreography-progress', '1');
    await expect(canvas).toHaveAttribute('data-structural-choreography-returning-to-world', 'false');
    await page.screenshot({ path: 'test-results/s2-s10-return.png', fullPage: true });

    await page.getByRole('button', { name: 'Seat 1 / Divisions', exact: true }).click();
    await expect(status).toContainText('READY · SEAT · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'seat');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'DIVISION_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'POD_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-focused-division', 'SEAT_CONNECTION');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '7');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-seat.png', fullPage: true });

    await page.getByRole('button', { name: 'Facility', exact: true }).click();
    await expect(status).toContainText('READY · FACILITY · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'facility');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    const facilityConduitKinds = await canvas.getAttribute('data-structural-conduit-edge-kinds');
    expect(facilityConduitKinds).toContain('facility-facility');
    expect(facilityConduitKinds).not.toContain('pod-facility');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-facility.png', fullPage: true });
  });
});
