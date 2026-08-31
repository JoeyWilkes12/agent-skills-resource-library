import type { Metadata } from "next";
import guideSource from "../../generated/personalized-skills-paper";
import { parseMarkdownGuide } from "../../markdown-guide";
import { MarkdownGuidePage } from "../../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skills-plugins-impact/personalized-skills-paper`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ?? "A close reading of the August 2026 personalized coding-agent Skills paper.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function PersonalizedSkillsPaperPage() {
  return (
    <MarkdownGuidePage
      backHref="/guides/skills-plugins-impact"
      backLabel="Back to the research synthesis"
      eyebrow="Research note · Focal paper"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
