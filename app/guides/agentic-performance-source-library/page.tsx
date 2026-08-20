import type { Metadata } from "next";
import guideSource from "../generated/agentic-performance-source-library";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/agentic-performance-source-library`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ?? "An annotated reading map for the systems that shape agentic performance.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function AgenticPerformanceSourceLibraryPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · Research library"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
