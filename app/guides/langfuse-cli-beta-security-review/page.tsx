import type { Metadata } from "next";
import guideSource from "../generated/langfuse-cli-beta-security-review";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/langfuse-cli-beta-security-review`;
const guide = parseMarkdownGuide(guideSource);
const summary =
  "Review the Langfuse CLI beta’s file, credential, and update controls, with scoped findings, scanner limitations, and evidence for a constrained pilot.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description: summary,
  openGraph: { title: guide.title, description: summary },
  twitter: { card: "summary", title: guide.title, description: summary },
};

export default function LangfuseCliBetaSecurityReviewPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Evidence review · Langfuse CLI beta"
      guide={guide}
      path={path}
      numbered={false}
      trustReceipt={{
        sourceClass: "Primary sources + local code review",
        lastVerified: "October 16, 2026",
        interactionMode: "Review and change settings",
        effects: "Organization opt-out affects all users and projects; optional CLI use writes files and contacts Langfuse",
        outcome: "Decide whether to run a constrained pilot",
      }}
    />
  );
}
