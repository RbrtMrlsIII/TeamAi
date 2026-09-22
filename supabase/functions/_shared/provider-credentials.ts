import { firestoreFindSeat, firestoreGet, getFirestoreAccessToken } from './firestore.ts';
import { decryptSeatApiKey } from './seat-secret.ts';

export type EdgeProviderCredential = Readonly<{
  providerKind: 'openai' | 'anthropic';
  apiKey: string;
}>;

function normalizeProviderKind(value: unknown): 'openai' | 'anthropic' {
  const kind = String(value ?? '').trim().toLowerCase();
  if (kind === 'openai' || kind.includes('gpt')) return 'openai';
  if (kind === 'anthropic' || kind.includes('claude')) return 'anthropic';
  throw new Error('unsupported_provider');
}

export async function loadSeatProviderCredential(input: {
  uid: string;
  workplaceId: string;
  projectId: string;
  seatId: string;
  providerKind: unknown;
}): Promise<EdgeProviderCredential> {
  const providerKind = normalizeProviderKind(input.providerKind);
  const token = await getFirestoreAccessToken();
  const seat = await firestoreFindSeat({
    uid: input.uid,
    workplaceId: input.workplaceId,
    projectId: input.projectId,
    seatId: input.seatId,
    accessToken: token,
  });
  if (!seat) throw new Error('seat_not_found');
  if (String(seat.fields.providerKeyBound ?? '').toLowerCase() !== 'true') {
    throw new Error('provider_key_not_bound');
  }

  const path = seat.path + '/secrets/providerApiKey';
  const document = await firestoreGet(path, token);
  if (!document.exists) throw new Error('provider_key_not_bound');

  const fields = document.fields as Record<string, unknown>;
  const ciphertext = fields.ciphertext && typeof fields.ciphertext === 'object'
    ? (fields.ciphertext as Record<string, unknown>).stringValue
    : undefined;
  const iv = fields.iv && typeof fields.iv === 'object'
    ? (fields.iv as Record<string, unknown>).stringValue
    : undefined;
  const storedKind = fields.providerKind && typeof fields.providerKind === 'object'
    ? (fields.providerKind as Record<string, unknown>).stringValue
    : undefined;

  if (typeof ciphertext !== 'string' || typeof iv !== 'string') {
    throw new Error('provider_key_corrupt');
  }
  if (storedKind && normalizeProviderKind(storedKind) !== providerKind) {
    throw new Error('provider_key_provider_mismatch');
  }

  const apiKey = await decryptSeatApiKey(ciphertext, iv);
  if (!apiKey.trim()) throw new Error('provider_key_empty');

  return Object.freeze({ providerKind, apiKey });
}
