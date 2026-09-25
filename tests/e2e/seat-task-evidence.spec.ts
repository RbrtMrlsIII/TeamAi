import { expect, test } from '@playwright/test';

test.describe('Seat Task / Evidence report', () => {
  test('renders unavailable until backend read-model ingress and then projects the supplied report', async ({ page }) => {
    await page.goto('/spatial/');
    await page.getByRole('button', { name: 'Seats' }).click();

    const runtime = page.locator('[data-seat-runtime-state]');
    await expect(runtime).toHaveText('UNAVAILABLE');
    await expect(page.locator('[data-seat-runtime-empty]')).toBeVisible();

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

    await expect(runtime).toHaveText('COMPLETED');
    await expect(page.locator('[data-seat-runtime-turn]')).toHaveText('turn-e2e-17');
    await expect(page.locator('[data-seat-runtime-result]')).toHaveText('Browser-projected runtime result.');
    await expect(page.locator('[data-seat-runtime-summary]')).toHaveText('S17 browser contract received backend-shaped read model.');
    await expect(page.locator('[data-seat-runtime-findings]')).toHaveText('Read model accepted.');
    await expect(page.locator('[data-seat-runtime-evidence]')).toHaveText('S17 evidence · E404-S17');
    await expect(page.locator('[data-seat-runtime-handoff]')).toHaveText('Continue from exact verified head.');
    await expect(page.locator('[data-seat-transaction-state]')).toHaveText('COMPLETED');
    await expect(page.locator('[data-seat-transaction-kind]')).toHaveText('ai execution');
  });
});
