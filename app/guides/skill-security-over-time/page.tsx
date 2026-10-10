import type { Metadata } from "next";
import guideSource from "../generated/skill-security-over-time";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skill-security-over-time`;
const guide = parseMarkdownGuide(guideSource);
const description = guide.deck ?? "Evaluate MCP-loaded skills, version-bound audits, reviewed commits, updates, and rollback.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function SkillSecurityOverTimePage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · skill security lifecycle"
      guide={guide}
      path={path}
      numbered={false}
      trustReceipt={{
        sourceClass: "Primary sources + registry + focused local review",
        lastVerified: "October 10, 2026",
        interactionMode: "Read and assess",
        effects: "Reading only; linked loaders may write files and execute code",
        outcome: "Keep a version-specific security evidence record",
      }}
    />
  );
}
