import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("TeamAi has one explicit local Node entrypoint and no duplicate server entrypoint", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(packageJson.scripts?.dev, "npm run build && node dist/src/main.js");
  assert.equal(packageJson.scripts?.start, "npm run build && node dist/src/main.js");
  assert.equal(existsSync("src/main.ts"), true);
  assert.equal(existsSync("src/server.ts"), false);
});
