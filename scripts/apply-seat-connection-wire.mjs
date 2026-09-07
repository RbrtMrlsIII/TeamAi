#!/usr/bin/env node
/**
 * Phase 5: wire shell-nav testSeatConnection to seat-connection-wire.
 * Requires phase2 bind first. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const phase2 = path.join(root, "scripts/apply-seat-plate-phase2.mjs");
spawnSync(process.execPath, [phase2], { stdio: "inherit" });

const target = path.join(root, "frontend/spatial/shell-nav.js");
let text = fs.readFileSync(target, "utf8");

if (text.includes("runSeatConnectionTest")) {
  console.log("phase5 wire already applied");
  process.exit(0);
}

if (!text.includes('from "./seat-read-model.js"')) {
  throw new Error("phase2 bind missing — cannot apply phase5 wire");
}

// Ensure dynamic import path is available; replace phase2 sync testSeatConnection.
const oldTest = [
  "function testSeatConnection() {",
  "  const seat = projectedSeat(activeSeat);",
  "  if (!seat) return;",
  '  const result = document.querySelector("[data-seat-result]");',
  '  if (seat.connectionHealth === "healthy") {',
  "    if (result) result.textContent = `${seat.name} connection test passed in UI only (health: ${seat.connectionHealth}, source: ${seat.source}); no provider request was made.`;",
  "  } else {",
  "    if (result) result.textContent = `${seat.name} connection remains ${seat.connectionHealth} in UI (source: ${seat.source}); no provider request was made.`;",
  "  }",
  "  applyProjectionToHeroSeatStack(seat);",
  "}",
].join("\n");

const newTest = [
  "async function testSeatConnection() {",
  "  const fixture = projectedSeat(activeSeat);",
  "  if (!fixture) return;",
  '  const result = document.querySelector("[data-seat-result]");',
  "  if (result) result.textContent = `${fixture.name} testing connection…`;",
  "  try {",
  '    const { runSeatConnectionTest, formatConnectionTestMessage } = await import("./seat-connection-wire.js");',
  "    const outcome = await runSeatConnectionTest({ seatId: activeSeat, fixtureProjection: fixture });",
  "    const seat = outcome.projection;",
  "    if (result) result.textContent = formatConnectionTestMessage(seat, outcome);",
  "    applyProjectionToHeroSeatStack(seat);",
  "  } catch (err) {",
  "    const message = err instanceof Error ? err.message : String(err);",
  "    if (result) result.textContent = `${fixture.name} connection test failed in UI (${message}); fixture health unchanged.`;",
  "    applyProjectionToHeroSeatStack(fixture);",
  "  }",
  "}",
].join("\n");

if (!text.includes(oldTest)) {
  throw new Error("phase2 testSeatConnection block not found — cannot wire phase5");
}

text = text.replace(oldTest, newTest);
fs.writeFileSync(target, text);
console.log("applied phase5 seat connection wire to", target);
