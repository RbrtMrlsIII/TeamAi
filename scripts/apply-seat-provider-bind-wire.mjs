#!/usr/bin/env node
/**
 * After phase2 + connection wire, mount provider bind panel on Seats detail.
 * Idempotent.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
spawnSync(process.execPath, [path.join(root, "scripts/apply-seat-connection-wire.mjs")], {
  stdio: "inherit",
});

const target = path.join(root, "frontend/spatial/shell-nav.js");
let text = fs.readFileSync(target, "utf8");

if (text.includes("ensureProviderBindOnSeatsPage")) {
  console.log("provider bind wire already applied");
  process.exit(0);
}

if (!text.includes("runSeatConnectionTest")) {
  throw new Error("connection wire missing — run apply-seat-connection-wire first");
}

const marker = "  seatsBuilt = true;\n  selectSeat(activeSeat);\n}";
if (!text.includes(marker)) throw new Error("buildSeats end marker not found");
text = text.replace(
  marker,
  `  seatsBuilt = true;\n  selectSeat(activeSeat);\n  import(\./seat-provider-bind-wire.js\).then((m) => m.ensureProviderBindOnSeatsPage()).catch(() => {});\n}`,
);
// Fix the escaped import from template — write intended form:
text = text.replace(
  "import(\\./seat-provider-bind-wire.js\\)",
  'import("./seat-provider-bind-wire.js")',
);
if (!text.includes('import("./seat-provider-bind-wire.js")')) {
  text = fs.readFileSync(target, "utf8");
  if (text.includes("ensureProviderBindOnSeatsPage")) {
    console.log("provider bind wire already applied");
    process.exit(0);
  }
  text = text.replace(
    marker,
    "  seatsBuilt = true;\n  selectSeat(activeSeat);\n  import(\"./seat-provider-bind-wire.js\").then((m) => m.ensureProviderBindOnSeatsPage()).catch(() => {});\n}",
  );
}

const selMarker = "  renderSeatDetail();\n}";
const idx = text.indexOf("function selectSeat");
if (idx < 0) throw new Error("selectSeat not found");
const after = text.indexOf(selMarker, idx);
if (after < 0) throw new Error("selectSeat render marker not found");
if (!text.includes("syncProviderBindSeat")) {
  text =
    text.slice(0, after) +
    "  renderSeatDetail();\n  import(\"./seat-provider-bind-wire.js\").then((m) => m.syncProviderBindSeat(id)).catch(() => {});\n}" +
    text.slice(after + selMarker.length);
}

fs.writeFileSync(target, text);
console.log("applied provider bind wire to", target);
