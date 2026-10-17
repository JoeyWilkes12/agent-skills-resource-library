import type { Metadata } from "next";
import guideSource from "../../generated/langfuse-cli-beta-detailed-review";
import { parseMarkdownGuide } from "../../markdown-guide";
import { MarkdownGuidePage } from "../../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/langfuse-cli-beta-security-review/detailed-review`;
const guide = parseMarkdownGuide(guideSource);
const description = "Read the complete local review of Langfuse CLI 1.3.0-beta.2, including five findings, verified defenses, and audit limitations, before downloading.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function LangfuseDetailedReviewPage() {
  return (
    <MarkdownGuidePage
      backHref="/guides/langfuse-cli-beta-security-review"
      backLabel="Back to the security review"
      eyebrow="Supporting evidence · Detailed local review"
      guide={guide}
      path={path}
      numbered={false}
      download={{
        href: "/data/security-reviews/langfuse-cli/2026-10-16/cli-security-review.md",
        filename: "cli-security-review.md",
      }}
      trustReceipt={{
        sourceClass: "Local code review · unchanged source",
        lastVerified: "October 16, 2026",
        interactionMode: "Read; optional download",
        effects: "Download saves a Markdown file; no CLI execution or account changes",
        outcome: "Inspect the complete findings before downloading",
      }}
    />
  );
}
