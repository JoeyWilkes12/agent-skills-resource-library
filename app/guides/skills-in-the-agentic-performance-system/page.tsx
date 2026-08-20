import type { Metadata } from "next";
import guideSource from "../generated/skills-in-the-agentic-performance-system";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/skills-in-the-agentic-performance-system`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ?? "A framework for understanding what shapes professional agentic workflow performance.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function SkillsInTheAgenticPerformanceSystemPage() {
  return <MarkdownGuidePage eyebrow="Guide · Agentic systems" guide={guide} path={path} />;
}
