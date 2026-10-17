import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parseCsv, recordsFromCsv } from "./generate-changelog.mjs";

export const RESOURCE_PATH = "public/data/resources.csv";
export const PROVENANCE_PATH = "public/data/resource-added-on.json";

function git(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
}

// Read every parent, rather than a path-limited log or first-parent history:
// a resource introduced on a branch keeps its introduction when merged.
export function buildDateProvenance({
  cwd = process.cwd(),
  ref = "HEAD",
  resourcePath = RESOURCE_PATH,
  historyPaths = [resourcePath],
  currentRecords,
} = {}) {
  if (git(cwd, ["rev-parse", "--is-shallow-repository"]) === "true") {
    throw new Error("Resource dates require full Git history; fetch with --unshallow or fetch-depth: 0.");
  }

  const historyRef = git(cwd, ["rev-parse", "--verify", `${ref}^{commit}`]);
  const paths = [...new Set(historyPaths)].sort();
  if (!paths.length) throw new Error("At least one historical resource CSV path is required.");

  const metadata = git(cwd, [
    "log", "--reverse", "--topo-order", "--format=%H%x00%P%x00%cI", historyRef,
  ]).split("\n").filter(Boolean).map((line) => {
    const [commit, parents, committedAt] = line.split("\0");
    if (!/^\d{4}-\d{2}-\d{2}T/.test(committedAt) || !Number.isFinite(Date.parse(committedAt))) {
      throw new Error(`Invalid recorded commit date for ${commit}.`);
    }
    return { commit, parents: parents ? parents.split(" ") : [], committedAt };
  });

  const blobCache = new Map();
  const seenByCommit = new Map();
  const introductions = new Map();
  let headRecords;

  for (const { commit, parents, committedAt } of metadata) {
    const inheritedIds = new Set();
    for (const parent of parents) {
      const parentIds = seenByCommit.get(parent);
      if (!parentIds) throw new Error(`Incomplete parent history for ${commit}.`);
      for (const id of parentIds) inheritedIds.add(id);
    }

    const snapshot = new Map();
    for (const path of paths) {
      const blob = git(cwd, ["ls-tree", "--format=%(objectname)", commit, "--", path]);
      if (!blob) continue;
      if (!blobCache.has(blob)) {
        blobCache.set(blob, recordsFromCsv(git(cwd, ["show", blob])));
      }
      for (const record of blobCache.get(blob)) {
        const existing = snapshot.get(record.id);
        if (existing && existing.record.url !== record.url) {
          throw new Error(`Conflicting historical resource id ${record.id} in ${commit}.`);
        }
        snapshot.set(record.id, { record, path });
      }
    }

    for (const [id, { path }] of snapshot) {
      if (!inheritedIds.has(id)) {
        if (!introductions.has(id)) introductions.set(id, []);
        introductions.get(id).push({
          added_on: committedAt.slice(0, 10),
          commit,
          committed_at: committedAt,
          path,
          matched_id: id,
        });
      }
      inheritedIds.add(id);
    }
    seenByCommit.set(commit, inheritedIds);
    if (commit === historyRef) headRecords = [...snapshot.values()].map(({ record }) => record);
  }

  const records = currentRecords ?? headRecords ?? [];
  const resources = {};
  for (const record of [...records].sort((left, right) => left.id.localeCompare(right.id))) {
    const candidates = introductions.get(record.id);
    if (!candidates?.length) {
      throw new Error(`No committed introduction found for ${record.id}; commit the new row before backfilling its date.`);
    }
    // Independent branches can introduce the same id. Ancestor reintroductions
    // are already excluded above; break independent ties by commit clock/hash.
    candidates.sort((left, right) =>
      Date.parse(left.committed_at) - Date.parse(right.committed_at) || left.commit.localeCompare(right.commit),
    );
    const [first] = candidates;
    resources[record.id] = candidates.length === 1
      ? first
      : { ...first, independent_introduction_commits: candidates.map(({ commit }) => commit) };
  }

  return {
    schema_version: 1,
    generated_from: historyRef,
    date_basis: "First stable-ID introduction in reachable Git history; committer date in its recorded offset.",
    history_paths: paths,
    resources,
  };
}

// Preserve existing CSV quoting and field text while adding/replacing the date.
export function applyAddedOn(input, provenance) {
  const parsedRows = parseCsv(input);
  const records = recordsFromCsv(input);
  const headers = parsedRows[0] ?? [];
  if (!headers.includes("id")) throw new Error("The resource CSV needs an id column.");
  const dateIndex = headers.indexOf("added_on");
  const rawRows = [];
  let fields = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      field += '""';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
      field += character;
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      fields.push(field);
      if (fields.some((value) => value.trim())) rawRows.push(fields);
      fields = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field.length || fields.length) {
    fields.push(field);
    if (fields.some((value) => value.trim())) rawRows.push(fields);
  }

  for (let index = 0; index < rawRows.length; index += 1) {
    if (parsedRows[index].length !== headers.length) {
      throw new Error(`CSV row ${index + 1} has a different field count from the header.`);
    }
    const value = index === 0 ? "added_on" : provenance.resources[records[index - 1].id]?.added_on;
    if (!value) throw new Error(`Missing introduction date for ${records[index - 1].id}.`);
    if (dateIndex < 0) rawRows[index].push(value);
    else rawRows[index][dateIndex] = value;
  }
  return `${rawRows.map((row) => row.join(",")).join("\n")}\n`;
}

export async function backfillResourceDates({
  cwd = process.cwd(),
  ref = "HEAD",
  resourcePath = RESOURCE_PATH,
  outputPath = resourcePath,
  provenancePath = PROVENANCE_PATH,
  historyPaths = [resourcePath],
  write = false,
} = {}) {
  const input = await readFile(resolve(cwd, resourcePath), "utf8");
  const provenance = buildDateProvenance({
    cwd, ref, resourcePath, historyPaths, currentRecords: recordsFromCsv(input),
  });
  const csv = applyAddedOn(input, provenance);
  const ledger = `${JSON.stringify(provenance, null, 2)}\n`;
  if (write) {
    for (const [path, content] of [[outputPath, csv], [provenancePath, ledger]]) {
      const absolutePath = resolve(cwd, path);
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, content);
    }
  } else {
    if (csv !== input) throw new Error("Resource added_on values are missing or differ from Git history. Run with --write.");
    const existing = JSON.parse(await readFile(resolve(cwd, provenancePath), "utf8"));
    // generated_from can remain the previous commit when no resource changed.
    try {
      if (!/^[a-f0-9]{40,64}$/.test(existing.generated_from ?? "")) throw new Error();
      git(cwd, ["merge-base", "--is-ancestor", existing.generated_from, provenance.generated_from]);
    } catch {
      throw new Error("Resource date provenance must reference a reachable generation commit. Run with --write.");
    }
    if (JSON.stringify(existing.resources) !== JSON.stringify(provenance.resources)
      || JSON.stringify(existing.history_paths) !== JSON.stringify(provenance.history_paths)
      || existing.schema_version !== provenance.schema_version
      || existing.date_basis !== provenance.date_basis) {
      throw new Error("Resource date provenance differs from Git history. Run with --write.");
    }
  }
  return { csv, provenance };
}

async function main() {
  const args = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--write") options.write = true;
    else if (argument === "--check") options.write = false;
    else if (["--output", "--ledger-output", "--ref", "--history-path"].includes(argument)) {
      const value = args[++index];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}.`);
      if (argument === "--output") options.outputPath = value;
      if (argument === "--ledger-output") options.provenancePath = value;
      if (argument === "--ref") options.ref = value;
      if (argument === "--history-path") {
        options.historyPaths = [...(options.historyPaths ?? [RESOURCE_PATH]), value];
      }
    } else throw new Error(`Unknown argument ${argument}.`);
  }
  const { provenance } = await backfillResourceDates(options);
  console.log(`${options.write ? "Backfilled" : "Verified"} Git introduction dates for ${Object.keys(provenance.resources).length} resources.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
