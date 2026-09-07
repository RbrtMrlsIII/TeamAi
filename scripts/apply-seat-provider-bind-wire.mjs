#!/usr/bin/env node
/**
 * After phase2 + connection wire, mount provider bind panel on Seats detail
 * and sync seat id on select. Idempotent.
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

// After seatsBuilt = true; selectSeat(activeSeat); inject ensure
const marker = "  seatsBuilt = true;\n  selectSeat(activeSeat);\n}";
if (!text.includes(marker)) throw new Error("buildSeats end marker not found");
text = text.replace(
  marker,
  `  seatsBuilt = true;\n  selectSeat(activeSeat);\n  import(\./seat-provider-bind-wire.js\).then((m) => m.ensureProviderBindOnSeatsPage()).catch(() => {});\n}\n`.replace(
    "\\./",
    "./",
  ),
);

// Fix accidental escape — write correct version
text = text.replace(
  "import(\\./seat-provider-bind-wire.js\\)",
  'import("./seat-provider-bind-wire.js")',
);

// Also try clean replace if still wrong
if (!text.includes('import("./seat-provider-bind-wire.js")')) {
  text = fs.readFileSync(target, "utf8");
  text = text.replace(
    marker,
    `  seatsBuilt = true;
  selectSeat(activeSeat);
  import("./seat-provider-bind-wire.js").then((m) => m.ensureProviderBindOnSeatsPage()).catch(() => {});
}
`,
  );
}

// Sync on selectSeat after renderSeatDetail();
const selMarker = "  renderSeatDetail();\n}";
if (text.includes(selMarker) && !text.includes("syncProviderBindSeat")) {
  text = text.replace(
    selMarker,
    `  renderSeatDetail();
  import("./seat-provider-bind-wire.js").then((m) => m.syncProviderBindSeat(id)).catch(() => {});
}
`,
  );
}

fs.writeFileSync(target, text);
console.log("applied provider bind wire to", target);
