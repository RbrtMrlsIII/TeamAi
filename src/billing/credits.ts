export interface CreditReservation { id: string; amount: number; status: 'reserved' | 'settled' | 'released'; }

export function reserveCredits(balance: number, requested: number): CreditReservation {
  if (requested <= 0) throw new Error('requested credits must be positive');
  if (requested > balance) throw new Error('INSUFFICIENT_CREDITS');
  return { id: crypto.randomUUID(), amount: requested, status: 'reserved' };
}
