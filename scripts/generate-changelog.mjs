import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const RESOURCE_PATH = "public/data/resources.csv";
const OUTPUT_PATH = "app/about/generated/changelog.json";
const CHANGE_TYPES = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
];

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", options.quiet ? "ignore" : "inherit"],
  }).trim();
}

export function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("The resource CSV contains an unclosed quote.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  return rows;
}

export function recordsFromCsv(input) {
  if (!input.trim()) return [];
  const [headers = [], ...rows] = parseCsv(input);
  const records = rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
  const ids = new Set();

  for (const record of records) {
    if (!record.id) throw new Error("A historical resource row is missing its id.");
    if (ids.has(record.id)) {
      throw new Error(`A historical resource snapshot contains duplicate id "${record.id}".`);
    }
    ids.add(record.id);
  }

  return records;
}

export function detectResourceChanges(previousRecords, currentRecords) {
  const previousById = new Map(previousRecords.map((record) => [record.id, record]));
  const currentById = new Map(currentRecords.map((record) => [record.id, record]));

  return {
    added: currentRecords.filter((record) => !previousById.has(record.id)),
    removed: previousRecords.filter((record) => !currentById.has(record.id)),
  };
}

function snapshot(commit) {
  if (!commit) return [];
  try {
    return recordsFromCsv(
      git(["show", `${commit}:${RESOURCE_PATH}`], { quiet: true }),
    );
  } catch {
    return [];
  }
}

function classifySubject(subject) {
  if (/^(?:Fix|Correct)/i.test(subject)) return "Fixed";
  if (/^(?:Remove|Retire)/i.test(subject)) return "Removed";
  if (/^Deprecat/i.test(subject)) return "Deprecated";
  if (/secur/i.test(subject)) return "Security";
  if (/^(?:Add|Draft|Create)/i.test(subject)) return "Added";
  return "Changed";
}

function normalizeSubject(subject) {
  const clean = subject.replace(/^\[AI\]\s*/i, "").trim();
  const exact = {
    "Add library QR code About page":
      "Added the About page with a QR code for quick access.",
    "Add hamburger navigation menu": "Added the responsive navigation menu.",
    "Title Change - manual": "Clarified the site title.",
  };
  if (exact[clean]) return exact[clean];

  const replacements = [
    [/^Add\b/i, "Added"],
    [/^Align\b/i, "Aligned"],
    [/^Correct\b/i, "Corrected"],
    [/^Create\b/i, "Created"],
    [/^Draft\b/i, "Launched"],
    [/^Expand\b/i, "Expanded"],
    [/^Fix\b/i, "Fixed"],
    [/^Make\b/i, "Made"],
    [/^Refine\b/i, "Refined"],
    [/^Remove\b/i, "Removed"],
    [/^Retire\b/i, "Retired"],
    [/^Show\b/i, "Displayed"],
    [/^Use\b/i, "Used"],
  ];
  const normalized = replacements.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    clean,
  );
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function changedFiles(commit, parent) {
  const output = parent
    ? git(["diff", "--name-only", parent, commit])
    : git(["show", "--pretty=format:", "--name-only", commit]);
  return output.split("\n").filter(Boolean);
}

function isVisitorFacing(files) {
  return files.some((file) => /^(?:app|content|public)\//.test(file));
}

function isMaintenanceSubject(subject) {
  return /(?:deploy|deployment|generated changelog|github pages|workflow|regression test)/i.test(
    subject,
  );
}

function commitMetadata(commit) {
  const [hash, parents, date, ...subjectParts] = git([
    "show",
    "-s",
    "--date=format:%Y-%m-%d",
    "--format=%H%x00%P%x00%ad%x00%s",
    commit,
  ]).split("\0");
  return {
    hash,
    parents: parents ? parents.split(" ") : [],
    date,
    subject: subjectParts.join("\0"),
  };
}

export function buildChangelog() {
  if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
    throw new Error(
      "Changelog generation needs full Git history. Check out the repository with fetch-depth: 0.",
    );
  }

  const head = git(["rev-parse", "HEAD"]);
  const commits = git(["rev-list", "--first-parent", "--reverse", "HEAD"])
    .split("\n")
    .filter(Boolean);
  const releases = new Map();

  function addEntry(date, type, entry) {
    if (!releases.has(date)) {
      releases.set(date, new Map(CHANGE_TYPES.map((changeType) => [changeType, []])));
    }
    releases.get(date).get(type).push(entry);
  }

  for (const commit of commits) {
    const metadata = commitMetadata(commit);
    const parent = metadata.parents[0] ?? "";
    const files = changedFiles(commit, parent);
    const previousRecords = snapshot(parent);
    const currentRecords = snapshot(commit);
    const { added, removed } = detectResourceChanges(previousRecords, currentRecords);

    for (const resource of added) {
      addEntry(metadata.date, "Added", {
        kind: "resource",
        text: `“${resource.title}” resource.`,
        href: resource.url,
        resourceId: resource.id,
        commit: metadata.hash,
      });
    }

    for (const resource of removed) {
      addEntry(metadata.date, "Removed", {
        kind: "resource",
        text: `“${resource.title}” resource.`,
        resourceId: resource.id,
        commit: metadata.hash,
      });
    }

    const isMerge = metadata.parents.length > 1;
    if (
      added.length === 0 &&
      removed.length === 0 &&
      !isMerge &&
      !isMaintenanceSubject(metadata.subject) &&
      isVisitorFacing(files)
    ) {
      addEntry(metadata.date, classifySubject(metadata.subject), {
        kind: "project",
        text: normalizeSubject(metadata.subject),
        commit: metadata.hash,
      });
    }
  }

  return {
    generatedFrom: head,
    releases: [...releases.entries()]
      .sort(([left], [right]) => right.localeCompare(left))
      .map(([date, sections]) => ({
        date,
        sections: CHANGE_TYPES.map((type) => ({
          type,
          items: sections.get(type),
        })).filter((section) => section.items.length > 0),
      })),
  };
}

export async function generateChangelog() {
  const changelog = buildChangelog();
  const outputFile = resolve(process.cwd(), OUTPUT_PATH);
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(changelog, null, 2)}\n`);
  const itemCount = changelog.releases.reduce(
    (total, release) =>
      total + release.sections.reduce((count, section) => count + section.items.length, 0),
    0,
  );
  console.log(
    `Generated ${itemCount} changelog entries across ${changelog.releases.length} dates.`,
  );
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  generateChangelog().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
