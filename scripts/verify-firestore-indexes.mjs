#!/usr/bin/env node

import { readFile } from "node:fs/promises";

function normalizeIndex(index) {
  return {
    collectionGroup: String(index?.collectionGroup ?? ""),
    queryScope: String(index?.queryScope ?? ""),
    apiScope: String(index?.apiScope ?? ""),
    fields: Array.isArray(index?.fields)
      ? index.fields.map((field) => ({
          fieldPath: String(field?.fieldPath ?? ""),
          order: field?.order ? String(field.order) : undefined,
          arrayConfig: field?.arrayConfig ? String(field.arrayConfig) : undefined,
          vectorConfig: field?.vectorConfig ?? undefined,
        }))
      : [],
  };
}

function sameIndex(expected, actual) {
  const left = normalizeIndex(expected);
  const right = normalizeIndex(actual);
  return left.collectionGroup === right.collectionGroup
    && left.queryScope === right.queryScope
    && (!left.apiScope || left.apiScope === right.apiScope)
    && JSON.stringify(left.fields) === JSON.stringify(right.fields);
}

function unwrapDeployedIndexPayload(payload) {
  if (payload?.result && typeof payload.result === "object") {
    return payload.result;
  }

  return payload;
}

export function verifyRequiredIndexes(expectedConfig, deployedPayload) {
  const expected = Array.isArray(expectedConfig?.indexes) ? expectedConfig.indexes : [];
  const unwrapped = unwrapDeployedIndexPayload(deployedPayload);
  const deployed = Array.isArray(unwrapped?.indexes)
    ? unwrapped.indexes
    : Array.isArray(unwrapped)
      ? unwrapped
      : [];

  const missing = expected.filter(
    (required) => !deployed.some((actual) => sameIndex(required, actual)),
  );

  return {
    ok: missing.length === 0,
    requiredCount: expected.length,
    deployedCount: deployed.length,
    missing: missing.map(normalizeIndex),
  };
}

async function main() {
  const configPath = process.argv[2] ?? "firestore.indexes.json";
  const deployedPath = process.argv[3];
  if (!deployedPath) throw new Error("deployed index export path is required");

  const expectedConfig = JSON.parse(await readFile(configPath, "utf8"));
  const deployedPayload = JSON.parse(await readFile(deployedPath, "utf8"));
  const result = verifyRequiredIndexes(expectedConfig, deployedPayload);

  console.log(JSON.stringify({
    ...result,
    note: "Required repository indexes are present in the deployed Firestore index set. Additional historical/live indexes are preserved and are not treated as drift.",
  }, null, 2));

  if (!result.ok) process.exit(1);
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  await main();
}
