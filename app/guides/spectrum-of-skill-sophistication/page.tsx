import type { Metadata } from "next";
import guideSource from "../generated/spectrum-of-skill-sophistication";
import { GuideBlocks, parseMarkdownGuide } from "../markdown-guide";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const guidePath = `${basePath}/guides/spectrum-of-skill-sophistication`;
const guide = parseMarkdownGuide(guideSource);
const contents = guide.sections.find((section) => section.id === "contents");
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
      <header className="guide-header">
        <a className="wordmark" href={`${basePath}/`} aria-label="Back to the library">
          <span className="wordmark-mark" aria-hidden="true">
            AS
          </span>
          <span>Agent Skills Library</span>
        </a>
        <nav className="header-nav" aria-label="Primary navigation">
          <a className="header-link" href={`${basePath}/#library`}>
            Links
          </a>
          <a className="header-link" href={`${basePath}/guides`}>
            Guides
          </a>
        </nav>
      </header>

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

        <div className="spectrum-reading">
          <div className="spectrum-intro">
            <GuideBlocks anchorPrefix={guidePath} basePath={basePath} blocks={introBlocks} />
          </div>

          {contents ? (
            <nav className="spectrum-contents" id="contents" aria-labelledby="contents-heading">
              <p id="contents-heading">On this page</p>
              <GuideBlocks anchorPrefix={guidePath} basePath={basePath} blocks={contents.blocks} />
            </nav>
          ) : null}

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
      </article>
    </main>
  );
}
