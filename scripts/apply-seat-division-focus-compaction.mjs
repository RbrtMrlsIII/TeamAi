#!/usr/bin/env node
/**
 * Historical compatibility verifier for Seat division focus compaction.
 *
 * The canonical Hero source is authoritative. This command performs no
 * synchronization or runtime mutation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const sourcePath = join(root, "public/_flex_src/hero-flex.base.js");
const publicPath = join(root, "public/hero-flex.js");
const source = readFileSync(sourcePath, "utf8");
const browser = readFileSync(publicPath, "utf8");

if (!source.includes("tickDivisionFocusTransition")) {
  throw new Error("canonical Hero source lacks division focus transition");
}
if (browser !== source) {
  throw new Error("Hero source/public parity failed");
}

console.log("Seat division focus compaction is source-owned; no mutation performed");
