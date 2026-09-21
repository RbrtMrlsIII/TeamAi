#!/usr/bin/env node
/**
 * Historical compatibility verifier for the Seat plate phase-2 read-model bind.
 *
 * The runtime is now source-owned by frontend/spatial/shell-nav.js.
 * This command intentionally performs no source mutation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const target = join(root, "frontend/spatial/shell-nav.js");
const text = readFileSync(target, "utf8");

for (const marker of [
  'from "./seat-read-model.js"',
  "function projectedSeat(seatId = activeSeat)",
  "function seatActivationAllowed(seat)",
  "projectedSeat(activeSeat).connectionHealth",
  "applyProjectionToHeroSeatStack(projectedSeat(activeSeat))",
]) {
  if (!text.includes(marker)) {
    throw new Error("Seat phase2 source contract missing: " + marker);
  }
}

console.log("Seat phase2 read-model bind is source-owned; no mutation performed");
