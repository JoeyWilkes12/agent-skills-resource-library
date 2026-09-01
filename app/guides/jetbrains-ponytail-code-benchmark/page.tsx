import type { Metadata } from "next";
import guideSource from "../generated/jetbrains-ponytail-code-benchmark";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/jetbrains-ponytail-code-benchmark`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ??
  "A reading guide to JetBrains' paired benchmark of Ponytail minimal-code guidance for Claude Code.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function JetBrainsPonytailCodeBenchmarkPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · JetBrains benchmark"
      guide={guide}
      highlightExternalLinks
      path={path}
    />
  );
}
