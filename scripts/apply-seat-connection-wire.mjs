#!/usr/bin/env node
/**
 * Historical compatibility verifier for Seat connection wiring.
 *
 * The runtime is now explicitly imported by frontend/spatial/shell-nav.js.
 * This command intentionally performs no source mutation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const target = join(root, "frontend/spatial/shell-nav.js");
const text = readFileSync(target, "utf8");

for (const marker of [
  'from "./seat-connection-wire.js"',
  "async function testSeatConnection()",
  "runSeatConnectionTest({ seatId: activeSeat, fixtureProjection: fixture })",
  "formatConnectionTestMessage(seat, outcome)",
]) {
  if (!text.includes(marker)) {
    throw new Error("Seat connection source contract missing: " + marker);
  }
}

console.log("Seat connection wire is source-owned; no mutation performed");
