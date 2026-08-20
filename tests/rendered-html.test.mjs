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
  assert.match(html, /<div class="header-menu">/);
  assert.match(html, /aria-label="Open primary navigation"/);
  assert.match(
    html,
    /href="#library">Links<\/a><a[^>]+href="\/guides">Guides<\/a><a[^>]+href="\/about">About<\/a>/,
  );
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
  assert.match(html, /A quick win is a beginning/);
  assert.match(html, /Rigor should match the promise/);
  assert.match(html, /guides\/spectrum-of-skill-sophistication\.jpeg/);
  assert.match(html, /id="professional-use-creates-more-handoffs"/);
});

test("server-renders the new agentic performance guides", async () => {
  const performanceResponse = await renderPath("/guides/skills-in-the-agentic-performance-system");
  assert.equal(performanceResponse.status, 200);
  const performanceHtml = await performanceResponse.text();
  assert.match(performanceHtml, /Skills in the agentic performance system/);
  assert.match(performanceHtml, /The seven levers of agentic performance/);
  assert.match(performanceHtml, /Discover → select → load → execute → verify/);

  const sourceLibraryResponse = await renderPath("/guides/agentic-performance-source-library");
  assert.equal(sourceLibraryResponse.status, 200);
  const sourceLibraryHtml = await sourceLibraryResponse.text();
  assert.match(sourceLibraryHtml, /Agentic performance source library/);
  assert.match(sourceLibraryHtml, /A twelve-resource starting shelf/);
  assert.match(sourceLibraryHtml, /Agentic AI Foundation and the Linux Foundation/);
  assert.match(sourceLibraryHtml, /class="guide-resource-link"/);
  assert.match(sourceLibraryHtml, /guide-resource-link-icon/);
  assert.match(sourceLibraryHtml, /target="_blank"/);
});

test("server-renders the Guides index and its published entries", async () => {
  const response = await renderPath("/guides");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Guides for building skills that hold up/);
  assert.match(html, /href="\/guides\/spectrum-of-skill-sophistication"/);
  assert.match(html, /Spectrum of skill sophistication/);
  assert.match(html, /More guides from the library/);
  assert.match(html, /href="\/guides\/skills-in-the-agentic-performance-system"/);
  assert.match(html, /href="\/guides\/agentic-performance-source-library"/);
  assert.match(html, /href="\/guides\/writing-without-the-ai-sheen"/);
  assert.match(html, /href="\/guides\/when-not-to-use-a-skill"/);
  assert.match(html, /href="\/guides\/so-you-found-a-skill-checklist"/);
  assert.match(html, /href="\/guides\/skillspector-enterprise-training"/);
  assert.match(html, /href="\/guides\/skillspector-skill-demo"/);
  assert.match(html, /href="\/guides\/microsoft-skillopt-third-party-snapshot"/);
});

test("server-renders the writing authenticity guide and review disclosures", async () => {
  const response = await renderPath("/guides/writing-without-the-ai-sheen");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Writing without the AI sheen/);
  assert.match(html, /Four skills, reviewed before installation/);
  assert.match(html, /Avoid AI Writing(?:<!-- -->)?\s*:\s*static evidence and human read/);
  assert.match(html, /Humanizer Skill by Aboudjem/);
  assert.match(html, /None installed/);
});

test("server-renders the pre-install confidence checklist", async () => {
  const response = await renderPath("/guides/so-you-found-a-skill-checklist");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /So you found a skill/);
  assert.match(html, /Will it update automatically/);
  assert.match(html, /Download the Markdown checklist/);
  assert.match(html, /so-you-found-a-skill_checklist\.md/);
  assert.match(html, /id="use-the-checklist"/);
  assert.match(html, /32(?:<!-- -->)? checks/);
  assert.match(html, /Capture the exact candidate/);
  assert.match(html, /Copy the evidence record/);
  assert.match(html, /Last reviewed (?:<!-- -->)?August 19, 2026/);
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
