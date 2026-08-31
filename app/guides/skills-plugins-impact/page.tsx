import type { Metadata } from "next";
import guideSource from "../generated/skills-plugins-impact-synthesis";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skills-plugins-impact`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck?.replace(/\\\n/g, " ") ??
  "A research synthesis on personalized Skills, task-matched guidance, retrieval, plugin packaging, cost, and security.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function SkillsPluginsImpactPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · Research synthesis"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
