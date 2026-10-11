import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const resourceFile = new URL("../public/data/resources.csv", import.meta.url);

function parseCsvWithPositions(input) {
  const rows = [];
  let fields = [];
  let value = "";
  let fieldStart = 0;
  let quoted = false;

  function finishRow(end) {
    fields.push({ value, start: fieldStart, end });
    if (fields.some((field) => field.value.trim() !== "")) {
      rows.push({ fields, end });
    }
    fields = [];
    value = "";
  }

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      fields.push({ value, start: fieldStart, end: index });
      value = "";
      fieldStart = index + 1;
    } else if ((character === "\n" || character === "\r") && !quoted) {
      finishRow(index);
      if (character === "\r" && next === "\n") index += 1;
      fieldStart = index + 1;
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error("resources.csv contains an unterminated quoted field.");
  if (value.length > 0 || fields.length > 0) finishRow(input.length);
  return rows;
}

function normalizeUrl(value) {
  if (value.startsWith("/")) {
    return new URL(value, "https://library.local").href;
  }
  return new URL(value).href;
}

export function synchronizeDuplicateUrls(input) {
  const [headerRow, ...rows] = parseCsvWithPositions(input);
  const headers = headerRow?.fields.map(({ value }) => value.replace(/^\uFEFF/, "")) ?? [];
  const urlIndex = headers.indexOf("url");
  const duplicateIndex = headers.indexOf("duplicate_url");
  if (urlIndex < 0) throw new Error("resources.csv must contain a url column.");
  if (headers.filter((header) => header === "duplicate_url").length > 1) {
    throw new Error("resources.csv must contain at most one duplicate_url column.");
  }

  const urlCounts = new Map();
  for (const [index, row] of rows.entries()) {
    if (row.fields.length !== headers.length) {
      throw new Error(`Resource row ${index + 1} has ${row.fields.length} fields; expected ${headers.length}.`);
    }
    const url = row.fields[urlIndex].value.trim();
    if (!url) continue;
    const normalized = normalizeUrl(url);
    urlCounts.set(normalized, (urlCounts.get(normalized) ?? 0) + 1);
  }

  // Edit field spans instead of reserializing rows: dates, quoting, multiline
  // descriptions, BOMs, blank lines, and original line endings stay untouched.
  const edits = duplicateIndex < 0
    ? [{ start: headerRow.end, end: headerRow.end, value: ",duplicate_url" }]
    : [];
  for (const row of rows) {
    const url = row.fields[urlIndex].value.trim();
    const flag = String(url ? (urlCounts.get(normalizeUrl(url)) ?? 0) > 1 : false);
    if (duplicateIndex < 0) {
      edits.push({ start: row.end, end: row.end, value: `,${flag}` });
    } else if (row.fields[duplicateIndex].value !== flag) {
      edits.push({ ...row.fields[duplicateIndex], value: flag });
    }
  }

  let output = input;
  for (const edit of edits.sort((left, right) => right.start - left.start)) {
    output = `${output.slice(0, edit.start)}${edit.value}${output.slice(edit.end)}`;
  }
  return {
    output,
    resourceCount: rows.length,
    duplicateCount: [...urlCounts.values()].filter((count) => count > 1).length,
  };
}

async function main() {
  const input = await readFile(resourceFile, "utf8");
  const { output, resourceCount, duplicateCount } = synchronizeDuplicateUrls(input);
  if (output !== input) await writeFile(resourceFile, output);
  console.log(
    `Synchronized duplicate_url for ${resourceCount} resources (${duplicateCount} duplicated hyperlinks).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
