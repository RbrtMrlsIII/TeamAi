#!/usr/bin/env node
/**
 * Historical compatibility verifier for Seat provider binding.
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
  'from "./seat-provider-bind-wire.js"',
  "ensureProviderBindOnSeatsPage();",
  "syncProviderBindSeat(id);",
]) {
  if (!text.includes(marker)) {
    throw new Error("Seat provider bind source contract missing: " + marker);
  }
}

console.log("Seat provider binding is source-owned; no mutation performed");
