/**
 * TEAM-EXPERIENCE-029 — Seat connection Test client (phase 3)
 *
 * Fetches a trusted seat projection for the Seats plate.
 * Does not write Firestore. Does not call providers from the browser.
 * When endpoint is unset, returns null so the plate stays fixture-backed.
 */

import { projectSeat, normalizeConnectionHealth } from "./seat-read-model.js";

/**
 * @typedef {object} SeatConnectionTestRequest
 * @property {string} [baseUrl] Edge/API origin (e.g. https://….supabase.co/functions/v1)
 * @property {string} [idToken] Firebase ID token
 * @property {string} seatId
 * @property {string} [workplaceId]
 * @property {string} [projectId]
 * @property {string} [path] default /teamai-seat-connection-test
 * @property {typeof fetch} [fetchImpl]
 */

/**
 * @param {SeatConnectionTestRequest} req
 * @returns {Promise<object|null>} SeatReadModel with source: 'domain', or null if not configured
 */
export async function fetchSeatConnectionProjection(req) {
  const baseUrl = String(req.baseUrl || "").replace(/\/$/, "");
  if (!baseUrl) return null;

  const path = req.path || "/teamai-seat-connection-test";
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const fetchImpl = req.fetchImpl || fetch;

  const headers = {
    "content-type": "application/json",
    accept: "application/json",
  };
  if (req.idToken) headers.authorization = `Bearer ${req.idToken}`;

  const response = await fetchImpl(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      seatId: req.seatId,
      workplaceId: req.workplaceId || null,
      projectId: req.projectId || null,
    }),
  });

  if (!response.ok) {
    const err = new Error(`seat_connection_test_http_${response.status}`);
    err.status = response.status;
    throw err;
  }

  const body = await response.json();
  return mapServerSeatPayload(body, req.seatId);
}

/**
 * Map trusted server JSON into the shared SeatReadModel (source: domain).
 * @param {Record<string, unknown>} body
 * @param {string} fallbackSeatId
 */
export function mapServerSeatPayload(body = {}, fallbackSeatId = "unknown") {
  const seatId = String(body.seatId || body.id || fallbackSeatId);
  return projectSeat(
    {
      seatId,
      name: body.name,
      role: body.role,
      provider: body.provider,
      model: body.model,
      connectionHealth: normalizeConnectionHealth(
        body.connectionHealth ?? body.health ?? body.connection,
      ),
      connection: body.connection,
      teamQuality: body.teamQuality,
      toolQuality: body.toolQuality,
      limits: body.limits,
      teamEntitlement: body.teamEntitlement,
      providerEntitlement: body.providerEntitlement,
      capability: body.capability,
      eligible: body.eligible,
    },
    { seatId, source: "domain" },
  );
}

/**
 * Wire helper: if domain projection is available, prefer it; else keep fixture projection.
 * @param {object|null} domainProjection
 * @param {object} fixtureProjection
 */
export function preferDomainProjection(domainProjection, fixtureProjection) {
  if (domainProjection && domainProjection.source === "domain") return domainProjection;
  return fixtureProjection;
}
