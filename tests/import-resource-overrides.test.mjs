import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildOverridePlan,
  CANONICAL_HEADERS,
  stringifyCsv,
} from "../.agents/skills/import-resource-overrides/scripts/import-resource-overrides.mjs";

function resource(overrides = {}) {
  return {
    id: "sample-resource",
    title: "Sample resource",
    url: "https://example.com/resource",
    summary: "A sample resource.",
    publisher: "Example",
    resource_type: "article",
    level: "beginner",
    rating: "4.0",
    featured: "false",
    status: "published",
    intents: "learn",
    topics: "authoring",
    tags: "sample",
    verified_on: "2026-07-28",
    exclude: "false",
    duplicate_url: "false",
    ...overrides,
  };
}

test("selects the newest export and ignores helper columns", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "resource-overrides-"));
  const sourceDirectory = path.join(root, "manual");
  const targetPath = path.join(root, "public", "data", "resources.csv");
  await mkdir(sourceDirectory, { recursive: true });
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(
    targetPath,
    stringifyCsv(CANONICAL_HEADERS, [resource()]),
  );

  const helperHeaders = [...CANONICAL_HEADERS, "JW Notes", "featured_JW"];
  await writeFile(
    path.join(sourceDirectory, "resources - 2026-07-28_10-00-00.csv"),
    stringifyCsv(helperHeaders, [
      resource({
        rating: "3",
        featured: "false",
        featured_JW: "TRUE",
        "JW Notes": "",
      }),
    ]),
  );
  await writeFile(
    path.join(sourceDirectory, "resources - 2026-07-28_11-00-00.csv"),
    stringifyCsv(helperHeaders, [
      resource({
        rating: "5",
        featured: "true",
        featured_JW: "FALSE",
        "JW Notes": "reviewed",
      }),
    ]),
  );

  const plan = await buildOverridePlan({ sourceDirectory, targetPath });
  assert.equal(plan.timestamp, "2026-07-28_11-00-00");
  assert.deepEqual(plan.ignoredColumns, ["JW Notes", "featured_JW"]);
  assert.deepEqual(
    plan.changes.map(({ field, before, after }) => ({ field, before, after })),
    [
      { field: "rating", before: "4.0", after: "5.0" },
      { field: "featured", before: "false", after: "true" },
    ],
  );
});

test("rejects an override that changes the resource ID set", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "resource-overrides-"));
  const sourceDirectory = path.join(root, "manual");
  const targetPath = path.join(root, "resources.csv");
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(
    targetPath,
    stringifyCsv(CANONICAL_HEADERS, [resource()]),
  );
  await writeFile(
    path.join(sourceDirectory, "resources - 2026-07-28_12-00-00.csv"),
    stringifyCsv(CANONICAL_HEADERS, [
      resource({ id: "different-resource" }),
    ]),
  );

  await assert.rejects(
    buildOverridePlan({ sourceDirectory, targetPath }),
    /must preserve the target resource ID set/,
  );
});
