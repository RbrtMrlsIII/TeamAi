#!/usr/bin/env node
/**
 * Historical compatibility verifier for the Seat-1 connection path.
 *
 * The canonical machine-spatial sync owns browser delivery. This command
 * performs no file mutation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const pairs = [
  ["frontend/spatial/seat-connection-edge.js", "public/seat-connection-edge.js"],
  ["frontend/spatial/seat-division-geometry.js", "public/seat-division-geometry.js"],
  ["frontend/spatial/machine-core-seat-connection.js", "public/machine-core-seat-connection.js"],
];

for (const [sourcePath, publicPath] of pairs) {
  const source = readFileSync(join(root, sourcePath), "utf8");
  const browser = readFileSync(join(root, publicPath), "utf8");
  if (browser !== source) {
    throw new Error("Seat-1 source/public parity failed: " + publicPath);
  }
}

const hero = readFileSync(join(root, "public/hero-flex.js"), "utf8");
if (!hero.includes("machine-world-renderer.js")) {
  throw new Error("canonical machine-world renderer is not wired into Hero");
}
if (hero.includes("drawSeat1ConnectionEdge(")) {
  throw new Error("retired monolithic Seat-1 injector remains in hero-flex.js");
}

console.log("Seat-1 semantic modules are synchronized; no mutation performed");
