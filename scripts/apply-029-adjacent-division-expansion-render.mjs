#!/usr/bin/env node
/**
 * Historical compatibility verifier for the 029 adjacent-division expansion path.
 *
 * The runtime is source-owned. This command intentionally performs no mutation.
 * The reusable expansion contract is tested directly from frontend/spatial.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const sourcePath = join(root, "frontend/spatial/seat-adjacent-division-expansion.js");
const rendererPath = join(root, "frontend/spatial/machine-world-renderer.js");

const source = readFileSync(sourcePath, "utf8");
const renderer = readFileSync(rendererPath, "utf8");

for (const marker of [
  "export function buildAdjacentDivisionExpansionEnvelope",
  "export function adjacentExpansionCollidesWithCorridor",
  "export function advanceAdjacentDivisionExpansion",
]) {
  if (!source.includes(marker)) throw new Error("adjacent expansion source contract missing: " + marker);
}

if (!renderer.includes("renderAdjacentDivisionWiring")) {
  throw new Error("canonical machine-world renderer lacks generalized adjacency ownership");
}

if (renderer.includes("advanceAdjacentDivisionExpansion")) {
  throw new Error("adjacent expansion must not be source-string injected into the renderer");
}

console.log("Adjacent expansion contract is source-owned; no mutation performed");
