#!/usr/bin/env node
/**
 * Apply phase-2 seat-read-model bind to frontend/spatial/shell-nav.js
 * Idempotent. Run from repo root: node scripts/apply-seat-plate-phase2.mjs
 */
import fs from "node:fs";
import path from "node:path";

const target = path.join(process.cwd(), "frontend/spatial/shell-nav.js");
let text = fs.readFileSync(target, "utf8");
if (text.includes('from "./seat-read-model.js"')) {
  console.log("phase2 already applied");
  process.exit(0);
}

const oldImport = `import {
  applyDocumentTheme,
  initializeTheme,
  persistTheme,
  readDensity,
  readMotion,
  readSource,
  readStoredMode,
  resolveMode,
  watchOsTheme,
} from "./theme-root.js";
`;
const newImport = `import {
  applyDocumentTheme,
  initializeTheme,
  persistTheme,
  readDensity,
  readMotion,
  readSource,
  readStoredMode,
  resolveMode,
  watchOsTheme,
} from "./theme-root.js";
import {
  projectSeat,
  normalizeConnectionHealth,
  applyProjectionToHeroSeatStack,
} from "./seat-read-model.js";
`;
if (!text.includes(oldImport)) throw new Error("import block not found");
text = text.replace(oldImport, newImport);

const oldAct = `function seatActivationAllowed(seat) {
  return seat.connection === "ready" && seat.teamEntitlement === "allowed" && seat.providerEntitlement === "allowed";
}
`;
const newAct = `function projectedSeat(seatId = activeSeat) {
  const raw = SEAT_DATA[seatId] || SEAT_DATA.alpha;
  return projectSeat(raw, { seatId: SEAT_DATA[seatId] ? seatId : "alpha", source: "fixture" });
}

function seatActivationAllowed(seat) {
  if (seat && seat.connectionHealth) {
    return Boolean(seat.activationAllowedPresentation);
  }
  const health = normalizeConnectionHealth(seat?.health ?? seat?.connection);
  return health === "healthy" && seat.teamEntitlement === "allowed" && seat.providerEntitlement === "allowed";
}
`;
if (!text.includes(oldAct)) throw new Error("seatActivationAllowed not found");
text = text.replace(oldAct, newAct);

if (!text.includes("health.textContent = seat.health;")) throw new Error("health assign not found");
text = text.replace(
  "health.textContent = seat.health;",
  "health.textContent = projectedSeat(activeSeat).connectionHealth;",
);

const oldTest = `function testSeatConnection() {
  const seat = SEAT_DATA[activeSeat];
  if (!seat) return;
  const result = document.querySelector("[data-seat-result]");
  if (seat.connection === "ready") {
    if (result) result.textContent = \`\${seat.name} connection test passed in UI only; no provider request was made.\`;
  } else {
    if (result) result.textContent = \`\${seat.name} connection remains degraded in UI; no provider request was made.\`;
  }
}
`;
const newTest = `function testSeatConnection() {
  const seat = projectedSeat(activeSeat);
  if (!seat) return;
  const result = document.querySelector("[data-seat-result]");
  if (seat.connectionHealth === "healthy") {
    if (result) result.textContent = \`\${seat.name} connection test passed in UI only (health: \${seat.connectionHealth}, source: \${seat.source}); no provider request was made.\`;
  } else {
    if (result) result.textContent = \`\${seat.name} connection remains \${seat.connectionHealth} in UI (source: \${seat.source}); no provider request was made.\`;
  }
  applyProjectionToHeroSeatStack(seat);
}
`;
if (!text.includes(oldTest)) throw new Error("testSeatConnection not found");
text = text.replace(oldTest, newTest);

const oldAct2 = `function activateSeat() {
  const seat = SEAT_DATA[activeSeat];
  if (!seat || !seatActivationAllowed(seat)) return;
`;
const newAct2 = `function activateSeat() {
  const seat = projectedSeat(activeSeat);
  if (!seat || !seat.activationAllowedPresentation) return;
`;
if (!text.includes(oldAct2)) throw new Error("activateSeat not found");
text = text.replace(oldAct2, newAct2);

if (!text.includes("applyProjectionToHeroSeatStack(projectedSeat(activeSeat))")) {
  text = text.replace(
    "health.textContent = projectedSeat(activeSeat).connectionHealth;",
    "health.textContent = projectedSeat(activeSeat).connectionHealth;\n  applyProjectionToHeroSeatStack(projectedSeat(activeSeat));",
  );
}

fs.writeFileSync(target, text);
console.log("applied phase2 bind to", target);
