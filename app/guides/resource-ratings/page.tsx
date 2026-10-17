import type { Metadata } from "next";
import ratingLedger from "../../../public/data/resource-ratings.json";
import guideSource from "../generated/resource-ratings";
import { parseMarkdownGuide } from "../markdown-guide";
import { MarkdownGuidePage } from "../markdown-guide-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/resource-ratings`;
// Keep the downloadable Markdown's sibling link portable, while serving the
// same ledger from /data in the HTML guide (including a GitHub Pages base path).
const guide = parseMarkdownGuide(
  guideSource.replaceAll(
    "](resource-ratings.json)",
    "](/data/resource-ratings.json)",
  ),
);
const description = guide.deck;
const assessedOn = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${ratingLedger.assessedOn}T00:00:00Z`));

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: { title: guide.title, description },
  twitter: { card: "summary", title: guide.title, description },
};

export default function ResourceRatingsPage() {
  return (
    <MarkdownGuidePage
      eyebrow="Guide · rating reference"
      guide={guide}
      path={path}
      numbered={false}
      trustReceipt={{
        sourceClass: "Editorial assessment of catalog and existing guides",
        lastVerified: assessedOn,
        interactionMode: "Read or maintain local ratings",
        effects: "Maintenance commands update local CSV and Markdown files",
        outcome: "Understand and reassess a resource's usefulness score",
      }}
    />
  );
}
