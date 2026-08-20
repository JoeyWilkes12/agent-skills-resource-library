import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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

async function renderPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

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

test("server-renders the resource library shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Agent Skills Resource Library<\/title>/i);
  assert.match(html, /Find the right guidance for(?:<!-- -->|\s|&nbsp;)+.*AI agent skills.*\./);
  assert.match(html, /Skills library/);
  assert.match(html, /href="#library">Links<\/a><a[^>]+href="\/guides">Guides<\/a>/);
  assert.match(html, /href="\/data\/resources\.csv"/);
  assert.match(html, /Download all resources \(CSV\)/);
  assert.match(html, /aria-label="Filter resources"/);
  assert.match(html, /troubleshoot/i);
  assert.doesNotMatch(html, /Explore the library/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the About page and its QR code", async () => {
  const response = await renderPath("/about");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /About the library/);
  assert.match(html, /Take the library with you/);
  assert.match(html, /qr\/agent-skills-resource-library\.svg/);
});

test("server-renders the internal when-not-to-use-a-skill guide", async () => {
  const response = await renderPath("/guides/when-not-to-use-a-skill");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /When not to use a skill/);
  assert.match(html, /Agent-assisted requests/);
  assert.match(html, /Primary documentation is often the safer shortcut/);
});

test("server-renders the Markdown-powered skill sophistication guide", async () => {
  const response = await renderPath("/guides/spectrum-of-skill-sophistication");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Spectrum of skill sophistication/);
  assert.match(html, /A first draft is a sketch/);
  assert.match(html, /Rigor should match the promise/);
  assert.match(html, /guides\/spectrum-of-skill-sophistication\.jpeg/);
  assert.match(html, /id="the-baton-changes-hands"/);
});

test("server-renders the Guides index and its Spectrum entry", async () => {
  const response = await renderPath("/guides");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Guides for building skills that hold up/);
  assert.match(html, /href="\/guides\/spectrum-of-skill-sophistication"/);
  assert.match(html, /Spectrum of skill sophistication/);
  assert.match(html, /More guides from the library/);
  assert.match(html, /href="\/guides\/when-not-to-use-a-skill"/);
  assert.match(html, /href="\/guides\/so-you-found-a-skill-checklist"/);
  assert.match(html, /href="\/guides\/skillspector-enterprise-training"/);
  assert.match(html, /href="\/guides\/skillspector-skill-demo"/);
  assert.match(html, /href="\/guides\/microsoft-skillopt-third-party-snapshot"/);
});

test("server-renders the pre-install confidence checklist", async () => {
  const response = await renderPath("/guides/so-you-found-a-skill-checklist");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /So you found a skill/);
  assert.match(html, /Will it update automatically/);
  assert.match(html, /Download the Markdown checklist/);
  assert.match(html, /so-you-found-a-skill_checklist\.md/);
});

test("server-renders the independent Microsoft SkillOpt snapshot", async () => {
  const response = await renderPath("/guides/microsoft-skillopt-third-party-snapshot");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /SkillOpt: a developer snapshot/);
  assert.match(html, /Pilot-capable, not ready for unattended self-evolution/);
  assert.match(html, /526\.7M/);
  assert.match(html, /independent Resource Library assessment/i);
});
