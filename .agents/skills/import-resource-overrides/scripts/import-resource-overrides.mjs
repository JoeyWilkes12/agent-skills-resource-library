#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const CANONICAL_HEADERS = [
  "id",
  "title",
  "url",
  "summary",
  "publisher",
  "resource_type",
  "level",
  "rating",
  "featured",
  "status",
  "intents",
  "topics",
  "tags",
  "verified_on",
  "exclude",
  "duplicate_url",
];

const ALLOWED_HELPER_COLUMNS = new Set(["JW Notes", "featured_JW"]);
const MAX_FILE_BYTES = 1_000_000;
const MAX_ROWS = 2_000;
const TIMESTAMP_PATTERN =
  /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})\.csv$/;

export function parseCsv(input, sourceName = "CSV") {
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
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error(`${sourceName}: unterminated quoted field.`);
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
  }
  if (rows.length === 0) throw new Error(`${sourceName}: CSV is empty.`);

  const [headers, ...values] = rows;
  const duplicateHeaders = headers.filter(
    (header, index) => headers.indexOf(header) !== index,
  );
  if (duplicateHeaders.length > 0) {
    throw new Error(
      `${sourceName}: duplicate columns: ${[...new Set(duplicateHeaders)].join(", ")}.`,
    );
  }

  const records = values.map((cells, index) => {
    if (cells.length !== headers.length) {
      throw new Error(
        `${sourceName}: row ${index + 2} has ${cells.length} cells; expected ${headers.length}.`,
      );
    }
    return Object.fromEntries(
      headers.map((header, cellIndex) => [header, cells[cellIndex]]),
    );
  });
  return { headers, records };
}

function csvCell(value, forceQuote = false) {
  const text = String(value ?? "");
  return forceQuote || /[",\r\n]/.test(text)
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

export function stringifyCsv(headers, records) {
  const alwaysQuoted = new Set(["summary", "tags"]);
  return `${[
    headers.map((header) => csvCell(header)).join(","),
    ...records.map((record) =>
      headers
        .map((header) => csvCell(record[header], alwaysQuoted.has(header)))
        .join(","),
    ),
  ].join("\n")}\n`;
}

function timestampFromFilename(filename) {
  const match = filename.match(TIMESTAMP_PATTERN);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const parts = [year, month, day, hour, minute, second].map(Number);
  const parsed = new Date(
    Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]),
  );
  const actual = [
    parsed.getUTCFullYear(),
    parsed.getUTCMonth() + 1,
    parsed.getUTCDate(),
    parsed.getUTCHours(),
    parsed.getUTCMinutes(),
    parsed.getUTCSeconds(),
  ];
  if (parts.some((value, index) => value !== actual[index])) {
    throw new Error(`${filename}: timestamp suffix is not a valid date and time.`);
  }
  return match[0].slice(0, -4);
}

function normalizeBoolean(value, field, id) {
  const normalized = String(value).trim().toLowerCase();
  if (!["true", "false"].includes(normalized)) {
    throw new Error(`${id || "Unknown row"}: ${field} must be true or false.`);
  }
  return normalized;
}

function normalizeRating(value, id) {
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  const rating = Number(trimmed);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new Error(`${id}: rating must be a number from 0.0 to 5.0.`);
  }
  return rating.toFixed(1);
}

function normalizeUrl(value) {
  if (value.startsWith("/")) {
    if (value.startsWith("//")) throw new Error("Protocol-relative URL");
    return new URL(value, "https://library.local").href;
  }
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Unsupported URL protocol");
  }
  return url.href;
}

function isValidIsoDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
}

function projectRecords(source, sourceName) {
  const ids = new Set();
  const projected = source.records.map((record, index) => {
    const id = record.id.trim();
    if (!id) throw new Error(`${sourceName}: row ${index + 2} is missing id.`);
    if (ids.has(id)) throw new Error(`${sourceName}: duplicate resource id "${id}".`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`${id}: id must use lowercase kebab-case.`);
    }
    ids.add(id);

    for (const field of [
      "title",
      "url",
      "summary",
      "publisher",
      "resource_type",
      "level",
      "status",
    ]) {
      if (!record[field].trim()) throw new Error(`${id}: missing ${field}.`);
    }
    if (!["published", "draft", "needs_review"].includes(record.status.trim())) {
      throw new Error(`${id}: invalid status "${record.status}".`);
    }
    try {
      normalizeUrl(record.url.trim());
    } catch {
      throw new Error(`${id}: invalid URL "${record.url}".`);
    }
    const canonicalFeatured = normalizeBoolean(record.featured, "featured", id);
    normalizeBoolean(record.duplicate_url, "duplicate_url", id);
    const verifiedOn = record.verified_on.trim();
    if (verifiedOn && !isValidIsoDate(verifiedOn)) {
      throw new Error(`${id}: verified_on must be blank or YYYY-MM-DD.`);
    }

    const output = Object.fromEntries(
      CANONICAL_HEADERS.map((header) => [header, record[header]]),
    );
    output.id = id;
    output.rating = normalizeRating(record.rating, id);
    output.featured = normalizeBoolean(
      record.featured_JW?.trim() ? record.featured_JW : canonicalFeatured,
      "featured",
      id,
    );
    output.exclude = normalizeBoolean(record.exclude, "exclude", id);
    output.duplicate_url = "false";
    return output;
  });

  const urlCounts = new Map();
  for (const record of projected) {
    const normalized = normalizeUrl(record.url.trim());
    urlCounts.set(normalized, (urlCounts.get(normalized) ?? 0) + 1);
  }
  for (const record of projected) {
    record.duplicate_url = String(
      (urlCounts.get(normalizeUrl(record.url.trim())) ?? 0) > 1,
    );
  }
  return projected;
}

function assertSameIds(sourceRecords, targetRecords) {
  const sourceIds = new Set(sourceRecords.map((record) => record.id));
  const targetIds = new Set(targetRecords.map((record) => record.id));
  const added = [...sourceIds].filter((id) => !targetIds.has(id)).sort();
  const removed = [...targetIds].filter((id) => !sourceIds.has(id)).sort();
  if (added.length > 0 || removed.length > 0) {
    throw new Error(
      [
        "Override files must preserve the target resource ID set.",
        added.length ? `Added IDs: ${added.join(", ")}.` : "",
        removed.length ? `Removed IDs: ${removed.join(", ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
  return { added, removed };
}

function diffRecords(sourceRecords, targetRecords) {
  const targetById = new Map(targetRecords.map((record) => [record.id, record]));
  const changes = [];
  for (const source of sourceRecords) {
    const target = targetById.get(source.id);
    for (const field of CANONICAL_HEADERS) {
      if (source[field] !== target[field]) {
        changes.push({
          id: source.id,
          field,
          before: target[field],
          after: source[field],
        });
      }
    }
  }
  return changes;
}

async function loadTarget(targetPath) {
  const input = await readFile(targetPath, "utf8");
  const parsed = parseCsv(input, targetPath);
  if (parsed.headers.join("\0") !== CANONICAL_HEADERS.join("\0")) {
    throw new Error(
      `${targetPath}: target columns must match the canonical resources schema.`,
    );
  }
  return { parsed, projected: projectRecords(parsed, targetPath) };
}

export async function buildOverridePlan({
  sourceDirectory,
  targetPath,
} = {}) {
  const resolvedTarget = path.resolve(
    targetPath ?? "public/data/resources.csv",
  );
  const resolvedSourceDirectory = path.resolve(
    sourceDirectory ?? "../manual data overrides for resource library",
  );
  const entries = await readdir(resolvedSourceDirectory, { withFileTypes: true });
  const discoveries = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".csv")) continue;
    const timestamp = timestampFromFilename(entry.name);
    if (!timestamp) continue;
    const sourcePath = path.join(resolvedSourceDirectory, entry.name);
    const [input, metadata] = await Promise.all([
      readFile(sourcePath, "utf8"),
      stat(sourcePath),
    ]);
    const parsed = parseCsv(input, entry.name);
    const missing = CANONICAL_HEADERS.filter(
      (header) => !parsed.headers.includes(header),
    );
    discoveries.push({
      filename: entry.name,
      sourcePath,
      timestamp,
      metadata,
      parsed,
      missing,
      compatible: missing.length === 0,
    });
  }

  const compatible = discoveries
    .filter((item) => item.compatible)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  if (compatible.length === 0) {
    throw new Error(
      `No timestamped CSV in ${resolvedSourceDirectory} contains the canonical resources schema.`,
    );
  }

  const selected = compatible[0];
  if (selected.metadata.size > MAX_FILE_BYTES) {
    throw new Error(
      `${selected.filename}: ${selected.metadata.size} bytes exceeds the ${MAX_FILE_BYTES}-byte limit.`,
    );
  }
  if (
    selected.parsed.records.length === 0 ||
    selected.parsed.records.length > MAX_ROWS
  ) {
    throw new Error(
      `${selected.filename}: row count must be between 1 and ${MAX_ROWS}.`,
    );
  }

  const unknownColumns = selected.parsed.headers.filter(
    (header) =>
      !CANONICAL_HEADERS.includes(header) && !ALLOWED_HELPER_COLUMNS.has(header),
  );
  if (unknownColumns.length > 0) {
    throw new Error(
      `${selected.filename}: unknown columns: ${unknownColumns.join(", ")}.`,
    );
  }

  const sourceRecords = projectRecords(selected.parsed, selected.filename);
  const target = await loadTarget(resolvedTarget);
  const idChanges = assertSameIds(sourceRecords, target.projected);
  const changes = diffRecords(sourceRecords, target.projected);
  const skipped = discoveries
    .filter((item) => !item.compatible)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .map((item) => ({
      filename: item.filename,
      timestamp: item.timestamp,
      missingColumns: item.missing,
    }));

  return {
    sourcePath: selected.sourcePath,
    sourceFilename: selected.filename,
    timestamp: selected.timestamp,
    sourceBytes: selected.metadata.size,
    rowCount: sourceRecords.length,
    targetPath: resolvedTarget,
    ignoredColumns: selected.parsed.headers.filter((header) =>
      ALLOWED_HELPER_COLUMNS.has(header),
    ),
    skipped,
    idChanges,
    changes,
    records: sourceRecords,
  };
}

function planForOutput(plan) {
  const output = { ...plan };
  delete output.records;
  return output;
}

function printPlan(plan) {
  console.log(`Source: ${plan.sourceFilename}`);
  console.log(`Timestamp: ${plan.timestamp}`);
  console.log(`Rows: ${plan.rowCount}`);
  console.log(`Size: ${plan.sourceBytes} bytes`);
  console.log(
    `Ignored helper columns: ${plan.ignoredColumns.join(", ") || "none"}`,
  );
  for (const item of plan.skipped) {
    console.log(
      `Skipped ${item.filename}: missing ${item.missingColumns.join(", ")}`,
    );
  }
  console.log(`Meaningful changes: ${plan.changes.length}`);
  for (const change of plan.changes) {
    console.log(
      `- ${change.id}.${change.field}: ${JSON.stringify(change.before)} -> ${JSON.stringify(change.after)}`,
    );
  }
}

function parseArguments(argv) {
  const options = { apply: false, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--apply") options.apply = true;
    else if (argument === "--json") options.json = true;
    else if (argument === "--source-dir") options.sourceDirectory = argv[++index];
    else if (argument === "--target") options.targetPath = argv[++index];
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (options.sourceDirectory === undefined && argv.includes("--source-dir")) {
    throw new Error("--source-dir requires a path.");
  }
  if (options.targetPath === undefined && argv.includes("--target")) {
    throw new Error("--target requires a path.");
  }
  return options;
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  const plan = await buildOverridePlan(options);
  if (options.json) console.log(JSON.stringify(planForOutput(plan), null, 2));
  else printPlan(plan);

  if (options.apply) {
    await writeFile(
      plan.targetPath,
      stringifyCsv(CANONICAL_HEADERS, plan.records),
      "utf8",
    );
    if (!options.json) console.log(`Applied override to ${plan.targetPath}.`);
  } else if (!options.json) {
    console.log("Preview only; pass --apply to update the site data.");
  }
}

if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
