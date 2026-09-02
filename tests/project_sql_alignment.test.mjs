import assert from "node:assert/strict";
import fs from "node:fs";

const sql = fs.readFileSync("migrations/005_toolkit_alignment.sql", "utf8");

assert.match(sql, /CREATE TABLE IF NOT EXISTS project_phases/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS knowledge_entries/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS census_snapshots/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS workspace_tabs/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS integration_catalog/);
assert.match(sql, /REFERENCES projects\(id\)/);
assert.doesNotMatch(sql, /CREATE TABLE IF NOT EXISTS projects\s*\(/);

console.log("project SQL alignment checks passed");
