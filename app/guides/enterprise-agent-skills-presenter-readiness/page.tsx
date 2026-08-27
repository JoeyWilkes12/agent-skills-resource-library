import type { Metadata } from "next";
import guideSource from "../generated/enterprise-agent-skills-presenter-readiness";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/enterprise-agent-skills-presenter-readiness`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ??
  "A presenter-facing question bank for a clear, credible enterprise introduction to agent skills.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function EnterpriseAgentSkillsPresenterReadinessPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · Enterprise training"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
