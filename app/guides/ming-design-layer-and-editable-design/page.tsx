import type { Metadata } from "next";
import guideSource from "../generated/ming-design-layer-and-editable-design";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/ming-design-layer-and-editable-design`;
const guide = parseMarkdownGuide(guideSource);
const description =
  guide.deck ??
  "Compare Ming layers, Ling UI, and editable PowerPoint workflows with scoped security evidence and practical design considerations.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function MingDesignLayerAndEditableDesignPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · editable design and security evidence"
      guide={guide}
      path={path}
      numbered={false}
      trustReceipt={{
        sourceClass: "Primary sources + independent review",
        lastVerified: "September 30, 2026",
        interactionMode: "Read and compare",
        effects: "Optional use uploads images, uses API credentials, and writes files",
        outcome: "Choose an editable output and review adoption risks",
      }}
    />
  );
}
