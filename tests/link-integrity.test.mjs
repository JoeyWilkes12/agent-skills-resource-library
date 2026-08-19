import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("links", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

async function render(worker, pathname) {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function hrefsFromHtml(html) {
  return [...html.matchAll(/<a\b[^>]*\shref=(?:"([^"]+)"|'([^']+)')/gi)].map(
    (match) => match[1] ?? match[2],
  );
}

function idExists(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\sid=(?:"${escaped}"|'${escaped}')`, "i").test(html);
}

const resourceText = await readFile(
  new URL("../public/data/resources.csv", import.meta.url),
  "utf8",
);
const resources = records(resourceText).filter(
  (resource) =>
    resource.status === "published" &&
    resource.exclude.toLowerCase() !== "true",
);

test("every authored hyperlink is valid and every local destination renders", async () => {
  const worker = await loadWorker();
  const pages = new Map();

  for (const pathname of [
    "/",
    "/about",
    "/guides",
    "/guides/spectrum-of-skill-sophistication",
    "/guides/when-not-to-use-a-skill",
    "/guides/so-you-found-a-skill-checklist",
    "/guides/microsoft-skillopt-third-party-snapshot",
  ]) {
    const response = await render(worker, pathname);
    assert.equal(response.status, 200, `${pathname} must render successfully`);
    pages.set(pathname, await response.text());
  }

  const authoredHrefs = [...pages.values()].flatMap(hrefsFromHtml);
  const resourceHrefs = resources.map((resource) => resource.url);
  const hrefs = [...new Set([...authoredHrefs, ...resourceHrefs])];

  for (const href of hrefs) {
    assert.ok(href.trim(), "Hyperlinks must not be empty");
    assert.doesNotMatch(href, /^(?:javascript:|about:blank$)/i);

    const url = new URL(href, "http://localhost");
    assert.ok(
      ["http:", "https:"].includes(url.protocol),
      `${href} must use HTTP or HTTPS`,
    );

    if (url.origin !== "http://localhost") continue;

    const pathname = url.pathname || "/";
    if (pathname.startsWith("/data/")) {
      assert.doesNotMatch(pathname, /\.\./, `${href} must stay in public data`);
      const asset = await readFile(
        new URL(`../public${pathname}`, import.meta.url),
        "utf8",
      );
      assert.ok(asset.length > 0, `${href} must contain downloadable content`);
      continue;
    }
    if (pathname.startsWith("/guides/") && pathname.endsWith(".md")) {
      assert.doesNotMatch(pathname, /\.\./, `${href} must stay in public guides`);
      const asset = await readFile(
        new URL(`../public${pathname}`, import.meta.url),
        "utf8",
      );
      assert.match(asset, /^#\s+\S/m, `${href} must contain a Markdown heading`);
      continue;
    }

    let html = pages.get(pathname);
    if (!html) {
      const response = await render(worker, pathname);
      assert.equal(response.status, 200, `${href} must render successfully`);
      html = await response.text();
      pages.set(pathname, html);
    }
    if (url.hash) {
      assert.ok(
        idExists(html, decodeURIComponent(url.hash.slice(1))),
        `${href} must target an element that exists`,
      );
    }
  }
});

test(
  "published external hyperlinks respond",
  { skip: process.env.CHECK_EXTERNAL_LINKS !== "true" },
  async () => {
    const worker = await loadWorker();
    const guideResponses = await Promise.all([
      render(worker, "/guides/when-not-to-use-a-skill"),
      render(worker, "/about"),
      render(worker, "/guides/spectrum-of-skill-sophistication"),
      render(worker, "/guides/so-you-found-a-skill-checklist"),
      render(worker, "/guides/microsoft-skillopt-third-party-snapshot"),
    ]);
    const guideHtml = (
      await Promise.all(guideResponses.map((response) => response.text()))
    ).join("\n");
    const hrefs = [
      ...resources.map((resource) => resource.url),
      ...hrefsFromHtml(guideHtml),
    ].filter((href) => /^https?:\/\//i.test(href));

    for (const href of new Set(hrefs)) {
      const response = await fetch(href, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "user-agent": "Agent-Skills-Library-Link-Check/1.0" },
      });
      assert.ok(
        response.status < 400 || [401, 403, 405, 429].includes(response.status),
        `${href} returned HTTP ${response.status}`,
      );
      await response.body?.cancel();
    }
  },
);
