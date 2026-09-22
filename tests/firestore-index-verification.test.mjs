import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { verifyRequiredIndexes } from "../scripts/verify-firestore-indexes.mjs";

test("Firestore index verifier accepts required indexes plus unrelated live indexes", () => {
  const expected = JSON.parse(readFileSync("firestore.indexes.json", "utf8"));
  const deployed = {
    indexes: [
      ...expected.indexes,
      {
        collectionGroup: "historical-posts",
        queryScope: "COLLECTION",
        fields: [{ fieldPath: "createdAt", order: "DESCENDING" }],
      },
    ],
  };

  const result = verifyRequiredIndexes(expected, deployed);
  assert.equal(result.ok, true);
  assert.equal(result.requiredCount, expected.indexes.length);
  assert.equal(result.deployedCount, expected.indexes.length + 1);
  assert.deepEqual(result.missing, []);
});

test("Firestore index verifier identifies a missing required composite index", () => {
  const expected = JSON.parse(readFileSync("firestore.indexes.json", "utf8"));
  const deployed = {
    indexes: expected.indexes.filter((index) => index.collectionGroup !== "connections"),
  };

  const result = verifyRequiredIndexes(expected, deployed);
  assert.equal(result.ok, false);
  assert.equal(result.missing.length, 1);
  assert.equal(result.missing[0].collectionGroup, "connections");
});

test("Firestore index deployment workflow performs deploy then readback verification", () => {
  const workflow = readFileSync(".github/workflows/firestore-index-deploy.yml", "utf8");
  assert.match(workflow, /firebase deploy --only firestore:indexes/);
  assert.match(workflow, /firebase firestore:indexes --project team-ai-official --database="\(default\)" --json/);
  assert.match(workflow, /node scripts\/verify-firestore-indexes\.mjs firestore\.indexes\.json/);
  assert.ok(workflow.indexOf("Deploy Firestore indexes only") < workflow.indexOf("Read back deployed Firestore indexes"));
});
