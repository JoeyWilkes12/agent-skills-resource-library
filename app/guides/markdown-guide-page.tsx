import { GuideBlocks, type MarkdownGuide } from "./markdown-guide";
import { GuideReadingLayout } from "./guide-reading-layout";
import { SiteHeader } from "../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function MarkdownGuidePage({
  backHref = "/guides",
  backLabel = "Back to guides",
  eyebrow,
  guide,
  highlightExternalLinks = false,
  path,
}: {
  backHref?: string;
  backLabel?: string;
  eyebrow: string;
  guide: MarkdownGuide;
  highlightExternalLinks?: boolean;
  path: string;
}) {
  const articleSections = guide.sections.filter((section) => section.id !== "contents");

  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article prose-guide">
        <header className="guide-hero prose-guide-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{guide.title}</h1>
          {guide.deck ? <p>{guide.deck}</p> : null}
        </header>

        <GuideReadingLayout
          className="prose-guide-reading-layout"
          contents={articleSections.map((section) => ({
            id: section.id,
            label: section.heading,
          }))}
          path={path}
        >
          <div className="prose-guide-reading">
            {guide.intro.length ? (
              <div className="prose-guide-intro">
                <GuideBlocks
                  anchorPrefix={path}
                  basePath={basePath}
                  blocks={guide.intro}
                  highlightExternalLinks={highlightExternalLinks}
                />
              </div>
            ) : null}

            {articleSections.map((section) => (
              <section className="prose-guide-section" id={section.id} key={section.id}>
                <h2>{section.heading}</h2>
                <GuideBlocks
                  anchorPrefix={path}
                  basePath={basePath}
                  blocks={section.blocks}
                  highlightExternalLinks={highlightExternalLinks}
                />
              </section>
            ))}
          </div>

          <a className="guide-back" href={`${basePath}${backHref}`}>
            ← {backLabel}
          </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
