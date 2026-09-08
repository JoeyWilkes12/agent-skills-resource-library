import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSearchText, searchGuides } from "../app/guides/guide-search.js";

const guides = [
  {
    contentTopics: ["Prompt injection triage", "OWASP patterns"],
    href: "/guides/security",
    summary: "A practical guide to reviewing agent skills.",
    title: "Skill review",
  },
  {
    contentTopics: ["Testing and iteration"],
    href: "/guides/testing",
    summary: "A benchmark of coding-agent workflows.",
    title: "Agent tests",
  },
];

test("normalizes case, punctuation, apostrophes, and accents", () => {
  assert.equal(normalizeSearchText("Anthropic’s café — OWASP"), "anthropics cafe owasp");
});

test("requires every query token and matches content topics", () => {
  const results = searchGuides(guides, "OWASP prompt-injection");

  assert.equal(results.length, 1);
  assert.equal(results[0].guide.href, "/guides/security");
  assert.equal(results[0].contentOnly, true);
  assert.deepEqual(results[0].foundInside, ["Prompt injection triage", "OWASP patterns"]);
  assert.equal(searchGuides(guides, "review benchmark").length, 0);
});

test("an empty query returns the catalog in its original order", () => {
  assert.deepEqual(
    searchGuides(guides, "   ").map((result) => result.guide.href),
    ["/guides/security", "/guides/testing"],
  );
  assert.equal(searchGuides(guides, "— !!").length, 0);
});

test("explains the content phrase that completes a mixed-field query", () => {
  const [result] = searchGuides(guides, "review OWASP");

  assert.equal(result.guide.href, "/guides/security");
  assert.equal(result.contentOnly, false);
  assert.deepEqual(result.foundInside, ["OWASP patterns"]);
});

test("matches useful prefixes without matching acronyms inside other words", () => {
  const noisyGuide = {
    contentTopics: ["Linux guidance"],
    href: "/guides/noise",
    summary: "Claims from paired benchmarks.",
    title: "A guide to building skills",
  };

  assert.equal(searchGuides(guides, "test")[0].guide.href, "/guides/testing");
  assert.equal(searchGuides([noisyGuide], "UI").length, 0);
  assert.equal(searchGuides([noisyGuide], "UX").length, 0);
  assert.equal(searchGuides([noisyGuide], "AI").length, 0);
});

test("ranks direct matches before content-only matches without reordering a tier", () => {
  const contentOnlyGuide = {
    contentTopics: ["NVIDIA SkillSpector"],
    href: "/guides/content-only",
    summary: "A practical writing workflow.",
    title: "Writing without the AI sheen",
  };
  const directGuide = {
    contentTopics: [],
    href: "/guides/direct",
    summary: "A security review with NVIDIA tooling.",
    title: "Enterprise scanning",
  };
  const secondDirectGuide = {
    contentTopics: [],
    href: "/guides/second-direct",
    summary: "Another NVIDIA case study.",
    title: "Bundle review",
  };

  assert.deepEqual(
    searchGuides(
      [contentOnlyGuide, directGuide, secondDirectGuide],
      "NVIDIA",
    ).map((result) => result.guide.href),
    ["/guides/direct", "/guides/second-direct", "/guides/content-only"],
  );
});

test("finds Humanizer through a guide's curated internal topics", () => {
  const writingGuide = {
    contentTopics: ["Humanizer by blader", "Humanizer Skill by Aboudjem"],
    href: "/guides/writing-without-the-ai-sheen",
    summary: "An authenticity-first editing workflow.",
    title: "Writing without the AI sheen",
  };

  const [result] = searchGuides([writingGuide], "Humanizer");

  assert.equal(result.guide.href, "/guides/writing-without-the-ai-sheen");
  assert.deepEqual(result.foundInside, [
    "Humanizer by blader",
    "Humanizer Skill by Aboudjem",
  ]);
});
