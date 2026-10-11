import assert from "node:assert/strict";
import test from "node:test";
import { recordsFromCsv } from "../scripts/generate-changelog.mjs";
import {
  applyRatings,
  catalogFingerprint,
  scoreAssessment,
  validateAssessments,
} from "../scripts/sync-resource-ratings.mjs";

const resource = {
  id: "alpha",
  title: "Alpha",
  url: "https://example.com/alpha",
  summary: "A source-linked skill guide.",
};

function assessment(overrides = {}) {
  return {
    id: "alpha",
    criteria: { relevance: 1, actionability: 1, traceability: 1, verification: 0.5, boundaries: 0.5 },
    basis: "catalog-only",
    rationale: "Concrete guidance with partial verification and boundary detail.",
    evidence: [],
    catalogFingerprint: catalogFingerprint(resource),
    ...overrides,
  };
}

function ledger(assessments) {
  return { rubricVersion: 1, assessedOn: "2026-10-10", catalogCommit: "a".repeat(40), assessments };
}

test("rating is the unweighted sum and rejects unsupported precision", () => {
  assert.equal(scoreAssessment(assessment()), 4);
  assert.throws(() => scoreAssessment(assessment({ criteria: { ...assessment().criteria, verification: 0.8 } })), /must be 0, 0.5, or 1/);
  assert.throws(() => scoreAssessment(assessment({ criteria: { relevance: 1 } })), /exactly the five/);
});

test("every stable resource ID has exactly one justified assessment", () => {
  assert.equal(validateAssessments([resource], ledger([assessment()])).size, 1);
  assert.throws(() => validateAssessments([resource], ledger([])), /missing rating assessment/);
  assert.throws(() => validateAssessments([resource], ledger([assessment(), assessment()])), /Duplicate rating/);
  assert.throws(() => validateAssessments([resource], ledger([assessment({ id: "orphan" })])), /has no resource/);
  assert.throws(() => validateAssessments([resource], ledger([assessment({ rationale: " " })])), /rationale is required/);
  assert.throws(() => validateAssessments([resource], ledger([assessment({ basis: "catalog-and-guide" })])), /guide evidence is required/);
});

test("changed catalog claims require reassessment but sorting/history metadata does not", () => {
  assert.throws(() => validateAssessments([{ ...resource, summary: "A changed claim." }], ledger([assessment()])), /reassess its rating/);
  assert.equal(validateAssessments([{ ...resource, rating: "4.0", added_on: "2026-07-28" }], ledger([assessment()])).size, 1);
});

test("rating synchronization preserves quoted multiline content and all unrelated raw CSV bytes", () => {
  const input = 'id,title,summary,rating,added_on,duplicate_url\r\nalpha,"Alpha, \"\"quoted\"\"","Line one\nLine two",,2026-07-28,false\r\n';
  const map = new Map([["alpha", assessment()]]);
  const output = applyRatings(input, map);
  assert.equal(output, input.replace(",,2026-07-28", ",4.0,2026-07-28"));
  const [before] = recordsFromCsv(input);
  const [after] = recordsFromCsv(output);
  assert.deepEqual({ ...after, rating: before.rating }, before);
  assert.equal(applyRatings(output, map), output);
});

test("missing rating columns or assessments cannot silently write incomplete output", () => {
  assert.throws(() => applyRatings("id,title\nalpha,Alpha\n", new Map()), /needs id and rating/);
  assert.throws(() => applyRatings("id,rating\nalpha,\n", new Map()), /missing rating assessment/);
});
