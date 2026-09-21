import {
  createSeatTurnBudgetConfig,
  type SeatResponsibilityProfile,
  type SeatTurnBudgetConfig,
} from './seat-turn-budget.js';

export type SeatBudgetSettingsIdentity = {
  uid: string;
  projectId: string;
  seatId: string;
  actorId: string;
};

export type SeatBudgetSettingsStore = {
  getSeatBudget(uid: string, projectId: string, seatId: string): Promise<SeatTurnBudgetConfig | null>;
  saveSeatBudget(
    uid: string,
    projectId: string,
    seatId: string,
    config: SeatTurnBudgetConfig,
  ): Promise<void>;
};

export type SeatConfigurationAuthorizer = {
  assertCanConfigureSeat(input: SeatBudgetSettingsIdentity): Promise<void>;
};

export type SeatBudgetSettingsPatch = Partial<Omit<SeatTurnBudgetConfig, 'responsibilityProfile'>>
  & { responsibilityProfile?: SeatResponsibilityProfile };

export class SeatTurnBudgetSettingsService {
  constructor(
    private readonly store: SeatBudgetSettingsStore,
    private readonly authorizer: SeatConfigurationAuthorizer,
  ) {}

  async load(identity: SeatBudgetSettingsIdentity): Promise<SeatTurnBudgetConfig | null> {
    validateIdentity(identity);
    await this.authorizer.assertCanConfigureSeat(identity);
    return this.store.getSeatBudget(identity.uid, identity.projectId, identity.seatId);
  }

  async save(
    identity: SeatBudgetSettingsIdentity,
    patch: SeatBudgetSettingsPatch,
  ): Promise<SeatTurnBudgetConfig> {
    validateIdentity(identity);
    await this.authorizer.assertCanConfigureSeat(identity);

    const current = await this.store.getSeatBudget(identity.uid, identity.projectId, identity.seatId);
    if (!current && patch.turnBudgetTokens === undefined) {
      throw new Error('turnBudgetTokens is required when a Seat budget does not exist');
    }

    const next = createSeatTurnBudgetConfig({
      ...(current ?? { turnBudgetTokens: patch.turnBudgetTokens as number }),
      ...patch,
      responsibilityProfile:
        patch.responsibilityProfile
        ?? current?.responsibilityProfile
        ?? 'reviewer',
    });

    await this.store.saveSeatBudget(identity.uid, identity.projectId, identity.seatId, next);
    return next;
  }
}

function validateIdentity(identity: SeatBudgetSettingsIdentity): void {
  for (const [key, value] of Object.entries(identity)) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(key + ' is required');
  }
}
