import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  detectResourceChanges,
  parseCsv,
  recordsFromCsv,
} from "../scripts/generate-changelog.mjs";

test("parses quoted commas and newlines in resource rows", () => {
  const rows = parseCsv(
    'id,title,url,summary\nalpha,"Alpha, guide",https://example.com,"Line one\nLine two"\n',
  );
  assert.deepEqual(rows[1], [
    "alpha",
    "Alpha, guide",
    "https://example.com",
    "Line one\nLine two",
  ]);
});

test("detects a one-row-only addition by stable id", () => {
  const previous = recordsFromCsv("id,title\nalpha,Alpha\n");
  const current = recordsFromCsv("id,title\nalpha,Renamed Alpha\nbeta,Beta\n");
  const changes = detectResourceChanges(previous, current);

  assert.deepEqual(changes.added.map((resource) => resource.id), ["beta"]);
  assert.deepEqual(changes.removed, []);
});

test("does not treat edits or row reordering as additions", () => {
  const previous = recordsFromCsv("id,title\nalpha,Alpha\nbeta,Beta\n");
  const current = recordsFromCsv("id,title\nbeta,Beta updated\nalpha,Alpha\n");
  const changes = detectResourceChanges(previous, current);

  assert.deepEqual(changes, { added: [], removed: [] });
});

test("generated history contains one addition event for every current resource id", async () => {
  const [resourceCsv, changelogJson] = await Promise.all([
    readFile(new URL("../public/data/resources.csv", import.meta.url), "utf8"),
    readFile(
      new URL("../app/about/generated/changelog.json", import.meta.url),
      "utf8",
    ),
  ]);
  const resources = recordsFromCsv(resourceCsv);
  const changelog = JSON.parse(changelogJson);
  const additions = changelog.releases.flatMap((release) =>
    release.sections
      .filter((section) => section.type === "Added")
      .flatMap((section) => section.items)
      .filter((item) => item.kind === "resource"),
  );
  const additionCounts = new Map();
  for (const item of additions) {
    additionCounts.set(item.resourceId, (additionCounts.get(item.resourceId) ?? 0) + 1);
  }

  for (const resource of resources) {
    assert.equal(
      additionCounts.get(resource.id),
      1,
      `${resource.id} must have exactly one Added changelog entry`,
    );
  }
});

