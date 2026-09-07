/**
 * TEAM-EXPERIENCE-029 — Seat plate read model (presentation)
 *
 * Maps backend-owned or fixture seat facts into a stable UI projection.
 * Does not write Firestore, call providers, or grant Activate authority.
 *
 * Health vocabulary is shared with Hero seat-stack presentation:
 *   unknown | offline | degraded | healthy
 */

export const SEAT_CONNECTION_HEALTH = Object.freeze([
  'unknown',
  'offline',
  'degraded',
  'healthy',
]);

/**
 * Normalize legacy / fixture labels into the canonical health enum.
 * @param {string | null | undefined} raw
 * @returns {'unknown'|'offline'|'degraded'|'healthy'}
 */
export function normalizeConnectionHealth(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  if (v === 'healthy' || v === 'ok' || v === 'ready' || v === 'pass' || v === 'passed') return 'healthy';
  if (v === 'degraded' || v === 'warn' || v === 'warning' || v === 'partial') return 'degraded';
  if (v === 'offline' || v === 'down' || v === 'fail' || v === 'failed' || v === 'error') return 'offline';
  if (v === 'unknown' || v === '' || v === 'pending' || v === 'untested') return 'unknown';
  return 'unknown';
}

/**
 * Project raw seat facts into a read-only UI model.
 * @param {Record<string, unknown>} raw
 * @param {{ seatId?: string, source?: 'fixture'|'domain' }} [opts]
 * @returns {object}
 */
export function projectSeat(raw = {}, opts = {}) {
  const seatId = String(opts.seatId || raw.seatId || raw.id || 'unknown');
  const teamEntitlement = String(raw.teamEntitlement ?? 'unknown');
  const providerEntitlement = String(raw.providerEntitlement ?? 'unknown');
  const connectionHealth = normalizeConnectionHealth(
    raw.connectionHealth ?? raw.health ?? raw.connection,
  );
  const source = opts.source === 'domain' ? 'domain' : 'fixture';

  const activationAllowedPresentation =
    connectionHealth === 'healthy' &&
    teamEntitlement === 'allowed' &&
    providerEntitlement === 'allowed';

  return Object.freeze({
    seatId,
    name: String(raw.name ?? seatId),
    role: String(raw.role ?? ''),
    provider: String(raw.provider ?? ''),
    model: String(raw.model ?? ''),
    connectionHealth,
    connectionLabel: String(raw.connection ?? connectionHealth),
    teamQuality: String(raw.teamQuality ?? ''),
    toolQuality: String(raw.toolQuality ?? ''),
    limits: String(raw.limits ?? ''),
    teamEntitlement,
    providerEntitlement,
    capability: String(raw.capability ?? ''),
    eligibleDisplay: Boolean(raw.eligible),
    activationAllowedPresentation,
    source,
    presentationOnly: true,
    durable: false,
  });
}

/**
 * Project a map of fixture seats.
 * @param {Record<string, Record<string, unknown>>} map
 * @returns {Record<string, object>}
 */
export function projectSeatMap(map = {}) {
  const out = {};
  for (const [id, raw] of Object.entries(map)) {
    out[id] = projectSeat(raw, { seatId: id, source: 'fixture' });
  }
  return Object.freeze(out);
}

/**
 * Optional Hero bridge: apply projected health to TeamAiHeroSeatStack when present.
 * @param {object} projection
 * @param {{ applyDial?: boolean }} [opts]
 */
export function applyProjectionToHeroSeatStack(projection, opts = {}) {
  const stack = typeof window !== 'undefined' ? window.TeamAiHeroSeatStack : null;
  if (!stack || !projection) return false;
  if (typeof stack.setConnectionHealth === 'function') {
    stack.setConnectionHealth(projection.connectionHealth);
  }
  if (opts.applyDial && typeof stack.setResponsibilityDial === 'function' && projection.activationAllowedPresentation) {
    stack.setResponsibilityDial(0.85);
  }
  return true;
}
