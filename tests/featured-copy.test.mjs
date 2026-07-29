import assert from "node:assert/strict";
import test from "node:test";

import { featuredIntro } from "../app/featured-copy.js";

test("spells featured counts through five and uses numerals above five", () => {
  assert.equal(
    featuredIntro(0),
    "Zero high-value starting points before you explore the full catalog.",
  );
  assert.equal(
    featuredIntro(1),
    "One high-value starting point before you explore the full catalog.",
  );
  assert.equal(
    featuredIntro(2),
    "Two high-value starting points before you explore the full catalog.",
  );
  assert.equal(
    featuredIntro(4),
    "Four high-value starting points before you explore the full catalog.",
  );
  assert.equal(
    featuredIntro(5),
    "Five high-value starting points before you explore the full catalog.",
  );
  assert.equal(
    featuredIntro(6),
    "6 high-value starting points before you explore the full catalog.",
  );
});
