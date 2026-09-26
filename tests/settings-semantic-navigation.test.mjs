import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("../frontend/spatial/settings.js", import.meta.url), "utf8");
const css = await readFile(new URL("../frontend/spatial/settings.css", import.meta.url), "utf8");

test("S20 Settings exposes existing semantic tree references", () => {
  for (const id of [
    "TREE-SETTINGS",
    "TREE-DOMAIN",
    "TREE-SEAT",
    "TREE-WORKSPACE",
    "TREE-ORCHESTRATION",
    "TREE-EVIDENCE",
    "TREE-COMMERCE",
  ]) assert.ok(js.includes(id), id);
  assert.ok(js.includes("SETTINGS_SEMANTIC_REFERENCES"));
  assert.ok(js.includes("renderSemanticReference"));
});

test("S20 Settings semantic navigation is presentation-only", () => {
  assert.ok(js.includes("data-settings-semantic-ref"));
  assert.ok(js.includes("reference only"));
  assert.ok(js.includes("Selecting a reference changes presentation only."));
  assert.equal(js.includes("Firestore"), false);
  assert.equal(js.includes("provider runtime"), false);
});

test("S20 Settings semantic navigation is responsive", () => {
  assert.ok(css.includes(".ta-settings__semantic-grid"));
  assert.ok(css.includes("@media (max-width: 56rem)"));
});
