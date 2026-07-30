import { readFile } from "node:fs/promises";

function parseCsv(input) {
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
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function records(input) {
  const [headers = [], ...rows] = parseCsv(input);
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
}

function list(value) {
  return value.split("|").map((item) => item.trim()).filter(Boolean);
}

function normalizeUrl(value) {
  if (value.startsWith("/")) {
    return new URL(value, "https://library.local").href;
  }
  return new URL(value).href;
}

const [resourceText, taxonomyText, orderText] = await Promise.all([
  readFile(new URL("../public/data/resources.csv", import.meta.url), "utf8"),
  readFile(new URL("../public/data/taxonomy.csv", import.meta.url), "utf8"),
  readFile(
    new URL("../public/data/resource_category_order.csv", import.meta.url),
    "utf8",
  ),
]);

const resources = records(resourceText);
const taxonomy = records(taxonomyText);
const orders = records(orderText);
const errors = [];
const urlCounts = new Map();

for (const resource of resources) {
  if (!resource.url) continue;
  try {
    const normalized = normalizeUrl(resource.url);
    urlCounts.set(normalized, (urlCounts.get(normalized) ?? 0) + 1);
  } catch {
    // The row-level URL validation below reports the actionable error.
  }
}

const resourceIds = new Set();
for (const resource of resources) {
  if (!resource.id) errors.push("A resource is missing an id.");
  if (resourceIds.has(resource.id)) {
    errors.push(`Duplicate resource id: ${resource.id}`);
  }
  resourceIds.add(resource.id);

  if (!["published", "draft", "needs_review"].includes(resource.status)) {
    errors.push(`${resource.id}: invalid status "${resource.status}".`);
  }
  if (!["true", "false"].includes(resource.exclude.toLowerCase())) {
    errors.push(`${resource.id}: exclude must be "true" or "false".`);
  }
  if (!["true", "false"].includes(resource.duplicate_url.toLowerCase())) {
    errors.push(`${resource.id}: duplicate_url must be "true" or "false".`);
  }
  if (resource.status === "published") {
    for (const field of ["title", "url", "summary", "publisher", "resource_type", "level"]) {
      if (!resource[field]) errors.push(`${resource.id}: missing ${field}.`);
    }
  }
  if (resource.url) {
    try {
      if (resource.url.startsWith("/")) {
        if (resource.url.startsWith("//")) throw new Error();
      } else {
        const url = new URL(resource.url);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      }
    } catch {
      errors.push(`${resource.id}: invalid URL "${resource.url}".`);
    }
  }
  if (resource.url) {
    try {
      const expectedDuplicate =
        (urlCounts.get(normalizeUrl(resource.url)) ?? 0) > 1;
      if ((resource.duplicate_url.toLowerCase() === "true") !== expectedDuplicate) {
        errors.push(
          `${resource.id}: duplicate_url must be "${expectedDuplicate}" for "${resource.url}".`,
        );
      }
    } catch {
      // The URL validation above reports malformed values.
    }
  }
  if (resource.rating) {
    const rating = Number(resource.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      errors.push(`${resource.id}: rating must be between 0.0 and 5.0.`);
    }
  }
}

const taxonomyKeys = new Set(
  taxonomy
    .filter((item) => item.enabled.toLowerCase() === "true")
    .map((item) => `${item.dimension}:${item.value}`),
);

for (const resource of resources) {
  const references = [
    ...list(resource.intents).map((value) => `intent:${value}`),
    ...list(resource.topics).map((value) => `topic:${value}`),
    `resource_type:${resource.resource_type}`,
    `publisher:${resource.publisher}`,
    `level:${resource.level}`,
  ];
  for (const reference of references) {
    if (!taxonomyKeys.has(reference)) {
      errors.push(`${resource.id}: unknown taxonomy value "${reference}".`);
    }
  }
}

const securityTrustResources = resources
  .filter(
    (resource) =>
      resource.status === "published" &&
      resource.exclude.toLowerCase() !== "true" &&
      list(resource.topics).includes("security-trust"),
  )
  .sort((left, right) => left.id.localeCompare(right.id));
const requiredSecurityTrustIds = [
  "cisco-skill-scanner",
  "nvidia-scan-agent-skills",
  "sage-agent-security",
];
const securityTrustIds = new Set(
  securityTrustResources.map((resource) => resource.id),
);
for (const requiredId of requiredSecurityTrustIds) {
  if (!securityTrustIds.has(requiredId)) {
    errors.push(`Security & Trust must contain "${requiredId}".`);
  }
}
for (const resource of securityTrustResources.filter((resource) =>
  requiredSecurityTrustIds.includes(resource.id),
)) {
  if (resource.rating !== "5.0") {
    errors.push(`${resource.id}: core security scanner rating must be 5.0.`);
  }
}

const orderKeys = new Set();
for (const order of orders) {
  if (!resourceIds.has(order.resource_id)) {
    errors.push(`Ordering references missing resource "${order.resource_id}".`);
  }
  if (
    order.dimension !== "all" &&
    !taxonomyKeys.has(`${order.dimension}:${order.category_value}`)
  ) {
    errors.push(
      `Ordering references missing category "${order.dimension}:${order.category_value}".`,
    );
  }
  const key = `${order.dimension}:${order.category_value}:${order.display_order}`;
  if (orderKeys.has(key)) {
    errors.push(`Duplicate category position "${key}".`);
  }
  orderKeys.add(key);
}

for (const [resourceId, displayOrder] of [
  ["nvidia-scan-agent-skills", "10"],
  ["cisco-skill-scanner", "20"],
  ["sage-agent-security", "30"],
]) {
  const hasSecurityTrustOrder = orders.some(
    (order) =>
      order.resource_id === resourceId &&
      order.dimension === "topic" &&
      order.category_value === "security-trust" &&
      order.display_order === displayOrder,
  );
  if (!hasSecurityTrustOrder) {
    errors.push(
      `${resourceId}: expected Security & Trust display order ${displayOrder}.`,
    );
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${resources.length} resources, ${taxonomy.length} taxonomy values, and ${orders.length} category order entries.`,
  );
}
