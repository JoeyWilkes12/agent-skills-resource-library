import { GuideBlocks, type MarkdownGuide } from "./markdown-guide";
import { GuideReadingLayout } from "./guide-reading-layout";
import { SiteHeader } from "../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type GuideTrustReceipt = {
  sourceClass: string;
  lastVerified: string;
  interactionMode: string;
  effects: string;
  outcome: string;
};

export function MarkdownGuidePage({
  backHref = "/guides",
  backLabel = "Back to guides",
  eyebrow,
  guide,
  path,
  trustReceipt,
  numbered = true,
}: {
  backHref?: string;
  backLabel?: string;
  eyebrow: string;
  guide: MarkdownGuide;
  path: string;
  trustReceipt?: GuideTrustReceipt;
  numbered?: boolean;
}) {
  const articleSections = guide.sections.filter((section) => section.id !== "contents");
  const deckLines = guide.deck
    ?.split(/\\\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article
        className={`guide-article prose-guide${trustReceipt ? " prose-guide-with-receipt" : ""}`}
      >
        <header className="guide-hero prose-guide-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{guide.title}</h1>
          {deckLines?.length ? (
            <div className="prose-guide-deck">
              {deckLines.map((line) => <p key={line}>{line}</p>)}
            </div>
          ) : null}
        </header>

        {trustReceipt ? (
          <section className="guide-trust-receipt" aria-label="Guide trust receipt">
            <dl>
              <div>
                <dt>Source</dt>
                <dd>{trustReceipt.sourceClass}</dd>
              </div>
              <div>
                <dt>Last verified</dt>
                <dd>{trustReceipt.lastVerified}</dd>
              </div>
              <div>
                <dt>Reading mode</dt>
                <dd>{trustReceipt.interactionMode}</dd>
              </div>
              <div className="guide-trust-receipt-effects">
                <dt>Linked workflow effects</dt>
                <dd>{trustReceipt.effects}</dd>
              </div>
              <div>
                <dt>Outcome</dt>
                <dd>{trustReceipt.outcome}</dd>
              </div>
            </dl>
          </section>
        ) : null}

        <GuideReadingLayout
          className="prose-guide-reading-layout"
          contents={articleSections.map((section) => ({
            id: section.id,
            label: section.heading,
          }))}
          path={path}
          numbered={numbered}
        >
          <div className="prose-guide-reading">
            {guide.intro.length ? (
              <div className="prose-guide-intro">
                <GuideBlocks
                  anchorPrefix={path}
                  basePath={basePath}
                  blocks={guide.intro}
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
