/**
 * TEAM-EXPERIENCE-029 — Wire Seats plate Test Connection (phase 5)
 *
 * When TEAMAI_SEAT_CONNECTION_BASE_URL is set, prefer domain projection.
 * Otherwise keep fixture projection. Never writes Firestore from the browser.
 */

import {
  fetchSeatConnectionProjection,
  preferDomainProjection,
} from "./seat-connection-client.js";

/**
 * Read optional runtime config from window (or empty defaults).
 * @returns {{ baseUrl: string, idToken: string, workplaceId: string|null, projectId: string|null }}
 */
export function readSeatConnectionConfig() {
  const w = typeof globalThis !== "undefined" ? globalThis : {};
  const baseUrl = String(w.TEAMAI_SEAT_CONNECTION_BASE_URL || "").trim();
  const idToken = String(w.TEAMAI_FIREBASE_ID_TOKEN || "").trim();
  const workplaceId = w.TEAMAI_WORKPLACE_ID ? String(w.TEAMAI_WORKPLACE_ID).trim() : null;
  const projectId = w.TEAMAI_PROJECT_ID ? String(w.TEAMAI_PROJECT_ID).trim() : null;
  return { baseUrl, idToken, workplaceId, projectId };
}

/**
 * Run Test Connection for a seat: domain when configured, else fixture.
 * @param {{ seatId: string, fixtureProjection: object, fetchImpl?: typeof fetch }} input
 * @returns {Promise<{ projection: object, usedDomain: boolean, configured: boolean }>}
 */
export async function runSeatConnectionTest(input) {
  const { seatId, fixtureProjection, fetchImpl } = input;
  const cfg = readSeatConnectionConfig();
  const configured = Boolean(cfg.baseUrl);

  if (!configured) {
    return {
      projection: fixtureProjection,
      usedDomain: false,
      configured: false,
    };
  }

  const domain = await fetchSeatConnectionProjection({
    baseUrl: cfg.baseUrl,
    idToken: cfg.idToken || undefined,
    seatId,
    workplaceId: cfg.workplaceId,
    projectId: cfg.projectId,
    fetchImpl,
  });

  return {
    projection: preferDomainProjection(domain, fixtureProjection),
    usedDomain: Boolean(domain && domain.source === "domain"),
    configured: true,
  };
}

/**
 * Format a status line for the Seats plate result element.
 * @param {object} projection
 * @param {{ usedDomain: boolean, configured: boolean }}
 */
export function formatConnectionTestMessage(projection, meta = {}) {
  const name = projection?.name || projection?.seatId || "Seat";
  const health = projection?.connectionHealth || "unknown";
  const source = projection?.source || "fixture";
  if (!meta.configured) {
    if (health === "healthy") {
      return `${name} connection test passed in UI only (health: ${health}, source: ${source}); no provider request was made.`;
    }
    return `${name} connection remains ${health} in UI (source: ${source}); no provider request was made.`;
  }
  if (meta.usedDomain) {
    return `${name} connection test via domain (health: ${health}, source: ${source}); no browser provider call.`;
  }
  return `${name} domain endpoint configured but fixture used (health: ${health}, source: ${source}).`;
}
