import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourceFile = resolve(
  process.cwd(),
  "content/drafts/spectrum-of-skill-sophistication.md",
);
const targetFile = resolve(
  process.cwd(),
  "app/guides/generated/spectrum-of-skill-sophistication.ts",
);

const source = await readFile(sourceFile, "utf8");
const generatedModule = `// Generated from content/drafts/spectrum-of-skill-sophistication.md.\n// Edit the Markdown source, not this file.\n\nconst guideSource = ${JSON.stringify(source)};\n\nexport default guideSource;\n`;

await mkdir(dirname(targetFile), { recursive: true });
await writeFile(targetFile, generatedModule);

console.log("Generated spectrum-of-skill-sophistication guide content.");

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
