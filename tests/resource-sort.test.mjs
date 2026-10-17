import assert from "node:assert/strict";
import test from "node:test";

import { parseResourceSort, sortResources } from "../app/resource-sort.js";

const resource = (id, overrides = {}) => ({
  id,
  title: id,
  rating: 4,
  featured: false,
  addedOn: "2026-07-01",
  ...overrides,
});
const ids = (resources) => resources.map(({ id }) => id);

test("accepts the five shareable sort modes and safely defaults invalid URL values", () => {
  for (const sort of ["curated", "rating-asc", "rating-desc", "added-asc", "added-desc"]) {
    assert.equal(parseResourceSort(sort), sort);
  }
  for (const sort of [null, undefined, "", "rating", "added-descending", "__proto__"]) {
    assert.equal(parseResourceSort(sort), "curated");
  }
});

test("sorts numeric ratings in both directions and places missing values last", () => {
  const resources = [
    resource("missing", { rating: null }),
    resource("high", { rating: 5 }),
    resource("low", { rating: 3.5 }),
    resource("invalid", { rating: NaN }),
    resource("zero", { rating: 0 }),
  ];

  assert.deepEqual(ids(sortResources(resources, "rating-asc")), [
    "zero", "low", "high", "invalid", "missing",
  ]);
  assert.deepEqual(ids(sortResources(resources, "rating-desc")), [
    "high", "low", "zero", "invalid", "missing",
  ]);
  assert.deepEqual(ids(resources), ["missing", "high", "low", "invalid", "zero"]);
});

test("sorts by library addition date, independently of verification date", () => {
  const resources = [
    resource("recent", { addedOn: "2026-10-10", verifiedOn: "2026-01-01" }),
    resource("early", { addedOn: "2025-12-31", verifiedOn: "2026-10-10" }),
    resource("middle", { addedOn: "2026-01-01", verifiedOn: "2026-10-11" }),
    resource("missing", { addedOn: "" }),
    resource("impossible", { addedOn: "2026-02-30" }),
    resource("malformed", { addedOn: "10/10/2026" }),
  ];

  assert.deepEqual(ids(sortResources(resources, "added-asc")), [
    "early", "middle", "recent", "impossible", "malformed", "missing",
  ]);
  assert.deepEqual(ids(sortResources(resources, "added-desc")), [
    "recent", "middle", "early", "impossible", "malformed", "missing",
  ]);
});

test("uses title then stable resource ID for ties in every direction", () => {
  const resources = [
    resource("c", { title: "Beta" }),
    resource("b", { title: "Alpha" }),
    resource("a", { title: "Alpha" }),
  ];
  for (const sort of ["curated", "rating-asc", "rating-desc", "added-asc", "added-desc"]) {
    assert.deepEqual(ids(sortResources(resources, sort)), ["a", "b", "c"]);
  }
});

test("preserves curated category priority while explicit sorting overrides it", () => {
  const resources = [
    resource("unranked", { rating: 5 }),
    resource("first", { rating: 3 }),
    resource("second", { rating: 4 }),
  ];
  const rank = ({ id }) => ({ first: 1, second: 2 })[id] ?? Infinity;

  assert.deepEqual(ids(sortResources(resources, "curated", rank)), ["first", "second", "unranked"]);
  assert.deepEqual(ids(sortResources(resources, "rating-desc", rank)), ["unranked", "second", "first"]);
});

test("curated default ranks rating before featured status, with featured breaking rating ties", () => {
  const resources = [
    resource("featured-low", { rating: 3, featured: true }),
    resource("ordinary-high", { rating: 5 }),
    resource("ordinary-tie", { rating: 4 }),
    resource("featured-tie", { rating: 4, featured: true }),
  ];
  assert.deepEqual(ids(sortResources(resources, "curated")), [
    "ordinary-high", "featured-tie", "ordinary-tie", "featured-low",
  ]);
});

test("sorting the full result set brings an item beyond the first page into view", () => {
  const resources = Array.from({ length: 30 }, (_, index) =>
    resource(String(index).padStart(2, "0"), {
      addedOn: `2026-09-${String(index + 1).padStart(2, "0")}`,
    }),
  );
  assert.deepEqual(ids(sortResources(resources, "added-desc").slice(0, 3)), ["29", "28", "27"]);
});
