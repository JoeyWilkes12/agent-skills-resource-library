import type { Metadata } from "next";
import guideSource from "../generated/headroom-context-compression-evidence";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/headroom-context-compression-evidence`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ??
  "A sourced guide to Headroom's effectiveness, coding-agent cost benchmarks, and security-review evidence.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function HeadroomContextCompressionEvidencePage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · effectiveness and security evidence"
      guide={guide}
      path={path}
    />
  );
}
