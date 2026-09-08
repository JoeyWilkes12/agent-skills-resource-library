import type { Metadata } from "next";
import guideSource from "../generated/controlled-variation-agent-nondeterminism";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/controlled-variation-agent-nondeterminism`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ??
  "A guide to balancing the adaptive value of AI agents with reproducibility, consistency, and enterprise control.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function ControlledVariationAgentNondeterminismGuidePage() {
  return <MarkdownGuidePage eyebrow="Guide · Agentic systems" guide={guide} path={path} />;
}
