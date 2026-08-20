import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const markdownGuides = [
  {
    source: "content/drafts/spectrum-of-skill-sophistication.md",
    target: "app/guides/generated/spectrum-of-skill-sophistication.ts",
  },
  {
    source: "content/drafts/skills-in-the-agentic-performance-system.md",
    target: "app/guides/generated/skills-in-the-agentic-performance-system.ts",
  },
  {
    source: "content/research/agentic-performance-source-library.md",
    target: "app/guides/generated/agentic-performance-source-library.ts",
  },
];

for (const guide of markdownGuides) {
  const sourceFile = resolve(process.cwd(), guide.source);
  const targetFile = resolve(process.cwd(), guide.target);
  const source = await readFile(sourceFile, "utf8");
  const generatedModule = `// Generated from ${guide.source}.\n// Edit the Markdown source, not this file.\n\nconst guideSource = ${JSON.stringify(source)};\n\nexport default guideSource;\n`;

  await mkdir(dirname(targetFile), { recursive: true });
  await writeFile(targetFile, generatedModule);
}

console.log("Generated Markdown guide content.");

const checklistSourceFile = resolve(
  process.cwd(),
  "content/guides/so-you-found-a-skill-checklist.json",
);
const checklistTargetFile = resolve(
  process.cwd(),
  "public/guides/so-you-found-a-skill_checklist.md",
);
const checklist = JSON.parse(await readFile(checklistSourceFile, "utf8"));

const checklistLines = [
  `# ${checklist.title}`,
  "",
  checklist.summary,
  "",
  `Last reviewed: ${checklist.lastReviewed}`,
  "",
  "## Safety rule",
  "",
  ...checklist.safetyItems.map((item) => `- [ ] ${item}`),
];

checklist.sections.forEach((section, index) => {
  checklistLines.push(
    "",
    `## ${index + 1}. ${section.title}`,
    "",
    section.intro,
    "",
    ...section.items.map((item) => `- [ ] ${item}`),
  );
});

checklistLines.push(
  "",
  "## Higher-risk use",
  "",
  checklist.highRiskNote,
  "",
  "## Decision outcomes",
  "",
  ...checklist.outcomes.map((outcome) => `- **${outcome.title}:** ${outcome.body}`),
  "",
  "## Evidence record",
  "",
  "```text",
  ...checklist.evidenceFields,
  "```",
  "",
  "## Primary references",
  "",
  ...checklist.references.map((reference) => `- [${reference.label}](${reference.href})`),
  "",
);

await mkdir(dirname(checklistTargetFile), { recursive: true });
await writeFile(checklistTargetFile, checklistLines.join("\n"));

console.log("Generated portable pre-install checklist Markdown.");
