import type { Metadata } from "next";
import guideSource from "../generated/spectrum-of-skill-sophistication";
import { GuideReadingLayout } from "../guide-reading-layout";
import { GuideBlocks, parseMarkdownGuide } from "../markdown-guide";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const guidePath = `${basePath}/guides/spectrum-of-skill-sophistication`;
const guide = parseMarkdownGuide(guideSource);
const articleSections = guide.sections.filter((section) => section.id !== "contents");
const primaryImage = guide.intro.find((block) => block.type === "image");
const introBlocks = guide.intro.filter((block) => block.type !== "image");
const description =
  guide.deck ?? "A short guide to choosing the right level of rigor for an agentic AI skill.";

export const metadata: Metadata = {
  title: `${guide.title} | Agent Skills Resource Library`,
  description,
  openGraph: {
    title: guide.title,
    description,
    images: primaryImage ? [`${basePath}/guides/spectrum-of-skill-sophistication.jpeg`] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: guide.title,
    description,
    images: primaryImage ? [`${basePath}/guides/spectrum-of-skill-sophistication.jpeg`] : [],
  },
};

export default function SpectrumOfSkillSophistication() {
  return (
    <main className="guide-page spectrum-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article spectrum-guide">
        <div className="spectrum-feature">
          <header className="guide-hero spectrum-hero">
            <p className="eyebrow">Guide · Skill engineering</p>
            <h1>{guide.title}</h1>
          </header>

          {primaryImage?.type === "image" ? (
            <figure className="spectrum-visual">
              <GuideBlocks anchorPrefix={guidePath} basePath={basePath} blocks={[primaryImage]} />
              {guide.deck ? <figcaption>{guide.deck}</figcaption> : null}
            </figure>
          ) : null}

        </div>

        <GuideReadingLayout
          className="spectrum-reading-layout"
          contents={articleSections.map((section) => ({
            id: section.id,
            label: section.heading,
          }))}
          path={guidePath}
        >
          <div className="spectrum-reading">
            <div className="spectrum-intro">
              <GuideBlocks anchorPrefix={guidePath} basePath={basePath} blocks={introBlocks} />
            </div>

            {articleSections.map((section) => (
              <section className="spectrum-section" id={section.id} key={section.id}>
                <h2>{section.heading}</h2>
                <GuideBlocks anchorPrefix={guidePath} basePath={basePath} blocks={section.blocks} />
              </section>
            ))}
          </div>

          <a className="guide-back" href={`${basePath}/#library`}>
            ← Back to the resource library
          </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
