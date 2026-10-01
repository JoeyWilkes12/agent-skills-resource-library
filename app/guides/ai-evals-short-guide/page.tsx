import type { Metadata } from "next";
import guideSource from "../generated/ai-evals-short-guide";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/ai-evals-short-guide`;
const guide = parseMarkdownGuide(guideSource);
const description =
  "Start with human trace review, choose practical evaluation checks, and inspect scoped security results for all nine evals-skills packages.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function AiEvalsShortGuidePage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · AI evaluations"
      guide={guide}
      path={path}
      numbered={false}
      trustReceipt={{
        sourceClass: "Primary sources + independent review",
        lastVerified: "September 30, 2026",
        interactionMode: "Read and learn",
        effects: "Linked skills can read traces, generate files, and use network services",
        outcome: "Choose an eval step and interpret the security evidence",
      }}
    />
  );
}
