export type ConfigurationStore<T> = {
  load(): Promise<T>;
  save(value: T): Promise<void>;
};

export type ConfigurationDraftState = {
  dirty: boolean;
};

/**
 * Settings may change many times locally but become durable only when the
 * user explicitly saves. Cache/draft state is never authority.
 */
export class ConfigurationDraft<T> {
  private saved: T;
  private draft: T;

  constructor(initial: T) {
    this.saved = structuredClone(initial);
    this.draft = structuredClone(initial);
  }

  get value(): T {
    return structuredClone(this.draft);
  }

  get state(): ConfigurationDraftState {
    return { dirty: !sameValue(this.saved, this.draft) };
  }

  update(patch: Partial<T>): T {
    if (typeof this.draft !== 'object' || this.draft === null || Array.isArray(this.draft)) {
      throw new Error('ConfigurationDraft.update requires an object configuration');
    }
    this.draft = { ...(this.draft as Record<string, unknown>), ...patch } as T;
    return this.value;
  }

  replace(value: T): void {
    this.draft = structuredClone(value);
  }

  discard(): T {
    this.draft = structuredClone(this.saved);
    return this.value;
  }

  async save(store: ConfigurationStore<T>): Promise<{ saved: boolean; value: T }> {
    const current = this.value;
    if (!this.state.dirty) return { saved: false, value: current };
    await store.save(current);
    this.saved = structuredClone(current);
    return { saved: true, value: current };
  }
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
