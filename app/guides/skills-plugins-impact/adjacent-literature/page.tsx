import type { Metadata } from "next";
import guideSource from "../../generated/adjacent-literature";
import { parseMarkdownGuide } from "../../markdown-guide";
import { MarkdownGuidePage } from "../../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skills-plugins-impact/adjacent-literature`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ?? "A primary-source review of Skills, procedural memory, retrieval, and coding-agent adaptation.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function AdjacentLiteraturePage() {
  return (
    <MarkdownGuidePage
      backHref="/guides/skills-plugins-impact"
      backLabel="Back to the research synthesis"
      eyebrow="Research note · Adjacent literature"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
