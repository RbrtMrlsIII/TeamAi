import { createHmac, timingSafeEqual } from 'node:crypto';

function requireNonEmpty(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value;
}

/** Server-only lookup: GitHub installation_id → Firebase UID. Not an ownership root. */
export function githubInstallationIndexPath(installationId: string): string {
  return `githubInstallationIndex/${requireNonEmpty(installationId, 'installationId')}`;
}

/** UID-rooted Connection record. Client write is forbidden. */
export function githubInstallationPath(firebaseUid: string, installationId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/githubInstallations/${requireNonEmpty(installationId, 'installationId')}`;
}

export type GitHubWebhookSignatureResult =
  | { ok: true }
  | { ok: false; reason: 'missing_secret' | 'missing_signature' | 'mismatch' };

/**
 * GitHub App webhook HMAC (`X-Hub-Signature-256`).
 * Missing secret is a server-config failure (HTTP 503), not a client error.
 */
export function verifyGitHubWebhookSignature(input: {
  secret: string | null | undefined;
  rawBody: string;
  signatureHeader: string | null | undefined;
}): GitHubWebhookSignatureResult {
  const secret = input.secret?.trim() ?? '';
  if (!secret) return { ok: false, reason: 'missing_secret' };
  const header = input.signatureHeader?.trim() ?? '';
  if (!header.startsWith('sha256=')) return { ok: false, reason: 'missing_signature' };
  const expectedHex = createHmac('sha256', secret).update(input.rawBody, 'utf8').digest('hex');
  const actualHex = header.slice('sha256='.length);
  try {
    const actual = Buffer.from(actualHex, 'hex');
    const expected = Buffer.from(expectedHex, 'hex');
    if (actual.length === 0 || actual.length !== expected.length) return { ok: false, reason: 'mismatch' };
    if (!timingSafeEqual(actual, expected)) return { ok: false, reason: 'mismatch' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'mismatch' };
  }
}

export function httpStatusForGitHubWebhookSignature(result: GitHubWebhookSignatureResult): number {
  if (result.ok) return 200;
  if (result.reason === 'missing_secret') return 503;
  return 401;
}

export function extractGitHubInstallationId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  const installation = obj.installation;
  if (installation && typeof installation === 'object') {
    const id = (installation as Record<string, unknown>).id;
    if (typeof id === 'number' && Number.isFinite(id)) return String(Math.trunc(id));
    if (typeof id === 'string' && id.trim()) return id.trim();
  }
  const top = obj.installation_id;
  if (typeof top === 'number' && Number.isFinite(top)) return String(Math.trunc(top));
  if (typeof top === 'string' && top.trim()) return top.trim();
  return null;
}

export type GitHubInstallationIndex = {
  installationId: string;
  firebaseUid: string;
  installationPath: string;
  createdAt: string;
  status: 'bound';
};

/**
 * Server-owned bind shape. Minted only by a trusted Edge path after user OAuth
 * (Conn-3 — not this slice). Webhook receipt must never invent a UID map.
 */
export function bindGitHubInstallation(input: {
  firebaseUid: string;
  installationId: string;
  createdAt: string;
}): GitHubInstallationIndex {
  const firebaseUid = requireNonEmpty(input.firebaseUid, 'firebaseUid');
  const installationId = requireNonEmpty(input.installationId, 'installationId');
  return {
    installationId,
    firebaseUid,
    installationPath: githubInstallationPath(firebaseUid, installationId),
    createdAt: requireNonEmpty(input.createdAt, 'createdAt'),
    status: 'bound',
  };
}

export type GitHubWebhookAck = {
  accepted: true;
  mapping: 'bound' | 'unbound';
  installationId: string | null;
};

export function githubWebhookAck(input: {
  installationId: string | null;
  mapped: boolean;
}): GitHubWebhookAck {
  return {
    accepted: true,
    mapping: input.mapped ? 'bound' : 'unbound',
    installationId: input.installationId,
  };
}
