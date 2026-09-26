import { expect, test } from '@playwright/test';

test.describe('Seat Task / Evidence report', () => {
  test('projects backend-shaped task/evidence state into the live Hero Seat hierarchy', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean((window as any).TeamAiHero?.selectSeatShell));

    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    await expect.poll(
      async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.().phase),
      { timeout: 5000 },
    ).toBe('open');

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_TASK_EVIDENCE'));

    await expect.poll(
      async () => page.evaluate(() => {
        const hero = (window as any).TeamAiHero;
        return {
          hierarchy: hero.getHierarchyState?.(),
          taskBranchAmount: hero.getTaskEvidenceBranchAmount?.(),
        };
      }),
      { timeout: 5000 },
    ).toMatchObject({
      hierarchy: {
        openParentId: 'SEAT_SHELL#0',
        focusedChildId: 'SEAT_TASK_EVIDENCE',
        phase: 'open',
      },
      taskBranchAmount: 1,
    });

    await expect(page.locator('#seat-label')).toContainText(/Task evidence face \(expanded\)/i);

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('teamai:seat-task-evidence-runtime-read-model', {
        detail: {
          source: 'backend-read-model',
          available: true,
          authorized: true,
          seatId: 'runtime-seat-7',
          turnId: 'turn-e2e-17',
          responsibility: 'coder',
          completionState: 'COMPLETED',
          result: 'Browser-projected runtime result.',
          summary: 'S17 browser contract received backend-shaped read model.',
          findings: ['Read model accepted.'],
          completed: ['Task', 'Verification'],
          unresolved: ['Live runtime remains separately gated.'],
          decisions: ['Keep presentation non-authoritative.'],
          evidenceRefs: [{ ref: 'E404-S17', label: 'S17 evidence' }],
          nextAction: 'Review next governed slice.',
          nextHandoffContext: 'Continue from exact verified head.',
          remainingBudget: 4200,
          transaction: {
            seatId: 'runtime-seat-7',
            transactionId: 'txn-e2e-17',
            kind: 'ai-execution',
            state: 'COMPLETED',
            progress: 1,
            authoritative: true,
          },
        },
      }));
    });

    await expect.poll(
      async () => page.evaluate(() => (window as any).TeamAiHeroSeatStack?.getWorkspaceTaskPresentation?.()),
      { timeout: 5000 },
    ).toMatchObject({
      taskState: 'complete',
      resultState: 'attached',
      evidenceState: 'recorded',
      provenance: 'E404-S17',
      presentationOnly: true,
      durable: false,
    });

    const bridge = await page.evaluate(() => Boolean((window as any).TeamAiHeroSeatTaskEvidence?.projectReadModel));
    expect(bridge).toBe(true);
  });
});
