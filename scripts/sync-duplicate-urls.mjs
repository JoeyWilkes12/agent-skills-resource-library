import { readFile, writeFile } from "node:fs/promises";

const resourceFile = new URL("../public/data/resources.csv", import.meta.url);

function parseCsvLine(input) {
  const fields = [];
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
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

function normalizeUrl(value) {
  if (value.startsWith("/")) {
    return new URL(value, "https://library.local").href;
  }
  return new URL(value).href;
}

const input = await readFile(resourceFile, "utf8");
const hasFinalNewline = input.endsWith("\n");
const lines = input.trimEnd().split(/\r?\n/);
const rows = lines.map(parseCsvLine);
const headers = rows[0] ?? [];
const urlIndex = headers.indexOf("url");
const duplicateIndex = headers.indexOf("duplicate_url");

if (urlIndex < 0) {
  throw new Error("resources.csv must contain a url column.");
}
if (duplicateIndex >= 0 && duplicateIndex !== headers.length - 1) {
  throw new Error("duplicate_url must be the final resources.csv column.");
}

const urlCounts = new Map();
for (const row of rows.slice(1)) {
  const url = row[urlIndex]?.trim();
  if (!url) continue;
  const normalized = normalizeUrl(url);
  urlCounts.set(normalized, (urlCounts.get(normalized) ?? 0) + 1);
}

const outputLines = lines.map((line, index) => {
  if (index === 0) {
    return duplicateIndex < 0 ? `${line},duplicate_url` : line;
  }

  const url = rows[index][urlIndex]?.trim();
  const isDuplicate = url
    ? (urlCounts.get(normalizeUrl(url)) ?? 0) > 1
    : false;
  const flag = String(isDuplicate);

  if (duplicateIndex < 0) return `${line},${flag}`;
  if (!/,(?:true|false)$/.test(line)) {
    throw new Error(`Row ${index + 1} has an invalid duplicate_url value.`);
  }
  return line.replace(/,(?:true|false)$/, `,${flag}`);
});

const output = `${outputLines.join("\n")}${hasFinalNewline ? "\n" : ""}`;
if (output !== input) {
  await writeFile(resourceFile, output);
}

const duplicateCount = [...urlCounts.values()].filter((count) => count > 1).length;
console.log(
  `Synchronized duplicate_url for ${rows.length - 1} resources (${duplicateCount} duplicated hyperlinks).`,
);
