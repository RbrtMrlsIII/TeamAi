import { expect, test } from '@playwright/test';

test.describe('Seat Task / Evidence report', () => {
  test('projects backend-shaped task/evidence state into the live Hero Seat stack', async ({ page }) => {
    await page.goto('/hero/');

    const taskLayer = page.getByRole('button', { name: /Task \/ Evidence: inspect SEAT_TASK_EVIDENCE/ });
    await expect(taskLayer).toBeVisible();
    await taskLayer.click();

    await expect(taskLayer).toHaveAttribute('data-task-state', 'idle');
    await expect(taskLayer).toHaveAttribute('data-result-state', 'none');
    await expect(taskLayer).toHaveAttribute('data-evidence-state', 'none');

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

    await expect(taskLayer).toHaveAttribute('data-task-state', 'complete');
    await expect(taskLayer).toHaveAttribute('data-result-state', 'attached');
    await expect(taskLayer).toHaveAttribute('data-evidence-state', 'recorded');
    await expect(taskLayer).toHaveAttribute('data-provenance', 'E404-S17');

    const bridge = await page.evaluate(() => Boolean(window.TeamAiHeroSeatTaskEvidence?.projectReadModel));
    expect(bridge).toBe(true);
  });
});
