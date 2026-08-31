import type { Metadata } from "next";
import guideSource from "../../generated/ecosystem-evidence";
import { parseMarkdownGuide } from "../../markdown-guide";
import { MarkdownGuidePage } from "../../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skills-plugins-impact/ecosystem-evidence`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ?? "Evidence and evaluation standards for Skills, plugins, tools, connectors, and MCP.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function EcosystemEvidencePage() {
  return (
    <MarkdownGuidePage
      backHref="/guides/skills-plugins-impact"
      backLabel="Back to the research synthesis"
      eyebrow="Research note · Ecosystem evidence"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
