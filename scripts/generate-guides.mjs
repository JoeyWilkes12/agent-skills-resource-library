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
