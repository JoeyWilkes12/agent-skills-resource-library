import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseCsv, recordsFromCsv } from "./generate-changelog.mjs";

export const CRITERIA = ["relevance", "actionability", "traceability", "verification", "boundaries"];
const ROOT = new URL("../", import.meta.url);
const CSV_FILE = new URL("public/data/resources.csv", ROOT);
const LEDGER_FILE = new URL("public/data/resource-ratings.json", ROOT);
const MARKDOWN_FILE = new URL("public/data/resource-ratings.md", ROOT);

export function catalogFingerprint(resource) {
  return createHash("sha256")
    .update(JSON.stringify([resource.id, resource.title, resource.url, resource.summary]))
    .digest("hex");
}

export function scoreAssessment(assessment) {
  if (Object.keys(assessment.criteria ?? {}).sort().join() !== [...CRITERIA].sort().join()) {
    throw new Error(`${assessment.id}: assessment must contain exactly the five rating criteria.`);
  }
  return CRITERIA.reduce((score, key) => {
    const value = assessment.criteria[key];
    if (![0, 0.5, 1].includes(value)) {
      throw new Error(`${assessment.id}: ${key} must be 0, 0.5, or 1.`);
    }
    return score + value;
  }, 0);
}

export function validateAssessments(resources, ledger) {
  if (ledger.rubricVersion !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(ledger.assessedOn ?? "") || !/^[a-f0-9]{40}$/.test(ledger.catalogCommit ?? "")) {
    throw new Error("Rating ledger needs rubric version 1, an assessment date, and a full catalog commit.");
  }
  const assessments = new Map();
  const resourceIds = new Set(resources.map((resource) => resource.id));
  for (const assessment of ledger.assessments ?? []) {
    if (assessments.has(assessment.id)) throw new Error(`Duplicate rating assessment: ${assessment.id}.`);
    if (!resourceIds.has(assessment.id)) throw new Error(`Rating assessment has no resource: ${assessment.id}.`);
    scoreAssessment(assessment);
    if (!assessment.rationale?.trim()) throw new Error(`${assessment.id}: rating rationale is required.`);
    if (!["catalog-only", "catalog-and-guide"].includes(assessment.basis)) {
      throw new Error(`${assessment.id}: unknown assessment basis.`);
    }
    if (assessment.basis === "catalog-and-guide" && !assessment.evidence?.length) {
      throw new Error(`${assessment.id}: guide evidence is required.`);
    }
    assessments.set(assessment.id, assessment);
  }
  for (const resource of resources) {
    const assessment = assessments.get(resource.id);
    if (!assessment) throw new Error(`${resource.id}: missing rating assessment.`);
    if (assessment.catalogFingerprint !== catalogFingerprint(resource)) {
      throw new Error(`${resource.id}: title, URL, or summary changed; reassess its rating and fingerprint.`);
    }
  }
  return assessments;
}

// Retain raw CSV fields, quoting, column order, and line endings. Only rating
// spans are replaced, including when an unrelated field contains a newline.
export function applyRatings(input, assessments) {
  const rows = parseCsv(input);
  const ratingIndex = rows[0]?.indexOf("rating");
  const idIndex = rows[0]?.indexOf("id");
  if (!Number.isInteger(ratingIndex) || ratingIndex < 0 || !Number.isInteger(idIndex) || idIndex < 0) {
    throw new Error("Resource CSV needs id and rating columns.");
  }
  const spans = [];
  let row = [];
  let start = 0;
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"' && quoted && input[index + 1] === '"') {
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && (character === "," || character === "\r" || character === "\n")) {
      row.push([start, index]);
      if (character !== ",") {
        if (row.some(([left, right]) => input.slice(left, right).trim())) spans.push(row);
        row = [];
        if (character === "\r" && input[index + 1] === "\n") index += 1;
      }
      start = index + 1;
    }
  }
  if (start < input.length || row.length) {
    row.push([start, input.length]);
    if (row.some(([left, right]) => input.slice(left, right).trim())) spans.push(row);
  }
  if (spans.length !== rows.length) throw new Error("Could not align raw CSV rows for rating update.");
  const replacements = rows.slice(1).map((fields, index) => {
    const assessment = assessments.get(fields[idIndex]);
    if (!assessment) throw new Error(`${fields[idIndex]}: missing rating assessment.`);
    return [...spans[index + 1][ratingIndex], scoreAssessment(assessment).toFixed(1)];
  });
  let output = input;
  for (const [left, right, value] of replacements.reverse()) {
    output = output.slice(0, left) + value + output.slice(right);
  }
  return output;
}

function cell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function renderRatingMarkdown(resources, ledger, assessments) {
  const snapshot = `https://github.com/joeywilkes12/agent-skills-resource-library/blob/${ledger.catalogCommit}/`;
  const counts = new Map();
  for (const resource of resources) {
    const score = scoreAssessment(assessments.get(resource.id)).toFixed(1);
    counts.set(score, (counts.get(score) ?? 0) + 1);
  }
  const distribution = [...counts].sort(([left], [right]) => Number(right) - Number(left))
    .map(([score, count]) => `${score}: ${count}`).join("; ");
  return `# Resource library rating methodology

*Understand the five rating criteria, the evidence behind each resource's score, and how to reassess it.*

Assessed ${ledger.assessedOn} (America/Denver). Rubric version ${ledger.rubricVersion}. Covers all ${resources.length} catalog rows, including hidden drafts and excluded resources.

## What the number means

The rating is an editorial assessment of how useful the recorded resource is for learning, deciding, or evaluating an agent-skills workflow. It measures the information available in this library's catalog and the existing guides identified below. It is not an installation recommendation, a security score, a popularity measure, or a tested performance guarantee. A high score can accompany unresolved risks when the resource helps a reader understand those risks.

These assessments use the [catalog snapshot](${snapshot}public/data/resources.csv) at commit \`${ledger.catalogCommit}\` and existing repository guides. External catalog targets were not freshly audited for this rating pass. No catalog package was installed or executed, no benchmark was rerun, and no current availability, maintenance, or safety claim is implied. A catalog-only assessment is an inference from its recorded title, URL, summary, and scope. A catalog-and-guide assessment also uses the linked guide content; any prior scan or benchmark retains that guide's original date, artifact, and limitations. The assessment date is separate from \`verified_on\` and from the date the row was added.

## Five equally weighted criteria

Each criterion receives **0, 0.5, or 1 point**. The rating is their sum, from **0.0 to 5.0**, displayed to one decimal. Half-point steps avoid suggesting fine precision that this editorial review cannot support. Missing evidence earns no points for that criterion; it does not prove that the underlying resource is poor.

| Criterion | 0 points | 0.5 points | 1 point |
| --- | --- | --- | --- |
| R: relevance | No established relation to the library's purpose | A plausible but unreviewed lead or adjacent topic | A direct skill, agent-workflow, evaluation, or governance use case |
| A: actionability | No reviewed guidance or usable description | Orientation, a feature list, discovery aid, or a bounded discussion | Concrete procedures, technical constraints, examples, or a reusable decision method |
| P: source traceability | No identifiable source | Secondary discovery index, shared conversation, or sources limited to related reading | Identifiable originating document/repository, or a guide tracing substantive claims to named sources |
| V: verification support | No recorded way to assess claims or outcomes | Diagnostic concepts or a limited check, with no complete evaluation method in the assessed material | Explicit tests, validation rules, reproducible evaluation steps, or scoped findings with their limits |
| B: boundaries and limitations | Scope or limits are absent/unreviewed | Intended scope is clear but limitations are lightly developed | Explicit compatibility, uncertainty, failure, data/action, or adoption boundaries |

Publisher identity, stars, installs, price, publication age, \`featured\`, and existing scores do not add points. A third-party index can be useful for discovery while earning fewer traceability or verification points than a source-linked procedure. Internal guides receive the same criteria as external resources; being authored by this library adds no points.

## How to interpret and change a rating

Scores of 4.5–5.0 indicate strong documented usefulness across most criteria. Scores of 3.0–4.0 indicate a useful resource with specific evidence or scope gaps. Scores below 3.0 indicate a limited lead or sparse assessed information. These are descriptions of the information assessed, not quality certifications. An unreviewed draft can score 1.0 from its plausible topic and identifiable link only and remain hidden. A rating does not publish a draft or imply that its contents were reviewed.

The new rubric replaces the previous unexplained values, including existing nonblank scores. The original October 10, 2026 snapshot linked above contained 15 blank ratings. Current distribution: ${distribution}. All ${resources.length} rows now have a documented score.

To change a score, edit the five criterion values, rationale, evidence references, and catalog fingerprint in [resource-ratings.json](resource-ratings.json), then run \`npm run ratings:sync\`. Use \`npm run ratings:check\` to reject missing or duplicate assessments, invalid points, stale catalog metadata, a CSV score that differs from its assessment, or Markdown that differs from the ledger. Reassess a title, URL, or summary change rather than copying the old rating forward. New IDs require their own assessment, including drafts. Review the underlying guide and update its dated evidence before treating a changed external claim as verified. The script reproduces the arithmetic and publication files; editorial judgment remains explicit in the ledger.

## Per-resource assessment ledger

R, A, P, V, and B use the criteria above. Every row uses its recorded catalog description. Additional evidence links point to the exact existing repository snapshot used for this pass. Catalog targets are listed in the CSV and are not fresh source-review receipts.

| Resource ID | Rating | R | A | P | V | B | Basis | Rationale and additional evidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
${resources.map((resource) => {
    const assessment = assessments.get(resource.id);
    const evidence = (assessment.evidence ?? []).map((path, index) => `[guide ${index + 1}](${snapshot}${path})`).join(", ");
    return `| ${cell(resource.id)} | ${scoreAssessment(assessment).toFixed(1)} | ${CRITERIA.map((key) => assessment.criteria[key]).join(" | ")} | ${assessment.basis} | ${cell(assessment.rationale)}${evidence ? ` Evidence: ${evidence}.` : ""} |`;
  }).join("\n")}
`;
}

export async function syncResourceRatings({ check = false } = {}) {
  const [input, ledgerText] = await Promise.all([readFile(CSV_FILE, "utf8"), readFile(LEDGER_FILE, "utf8")]);
  const resources = recordsFromCsv(input);
  const ledger = JSON.parse(ledgerText);
  const assessments = validateAssessments(resources, ledger);
  for (const assessment of assessments.values()) {
    for (const path of assessment.evidence ?? []) await readFile(new URL(path, ROOT));
  }
  const output = applyRatings(input, assessments);
  const markdown = renderRatingMarkdown(resources, ledger, assessments);
  if (check) {
    if (input !== output) throw new Error("CSV ratings differ from the assessment ledger; run npm run ratings:sync.");
    const currentMarkdown = await readFile(MARKDOWN_FILE, "utf8");
    if (markdown !== currentMarkdown) throw new Error("Rating Markdown differs from the ledger; run npm run ratings:sync.");
  } else {
    if (input !== output) await writeFile(CSV_FILE, output);
    await writeFile(MARKDOWN_FILE, markdown);
  }
  console.log(`${check ? "Checked" : "Synchronized"} ${resources.length} complete editorial ratings and their Markdown ledger.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  syncResourceRatings({ check: process.argv.includes("--check") }).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
