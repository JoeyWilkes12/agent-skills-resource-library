import type { Metadata } from "next";
import spectrumGuideSource from "./generated/spectrum-of-skill-sophistication";
import { parseMarkdownGuide, publicAssetUrl } from "./markdown-guide";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const spectrumGuide = parseMarkdownGuide(spectrumGuideSource);
const spectrumImage = spectrumGuide.intro.find((block) => block.type === "image");

export const metadata: Metadata = {
  title: "Guides | Agent Skills Resource Library",
  description:
    "Original, practical guides for building and evaluating AI agent skills.",
};

export default function GuidesPage() {
  return (
    <main className="guide-page guides-index-page">
      <header className="guide-header">
        <a className="wordmark" href={`${basePath}/`} aria-label="Back to the library">
          <span className="wordmark-mark" aria-hidden="true">
            AS
          </span>
          <span>Agent Skills Library</span>
        </a>
        <nav className="header-nav" aria-label="Primary navigation">
          <a className="header-link" href={`${basePath}/guides`} aria-current="page">
            Guides
          </a>
          <a className="header-link" href={`${basePath}/#library`}>
            Browse resources
          </a>
          <a className="header-link" href={`${basePath}/about`}>
            About
          </a>
        </nav>
      </header>

      <article className="guides-index-article">
        <section className="guides-index-hero" aria-labelledby="guides-heading">
          <h1 id="guides-heading">Guides for building skills that hold up.</h1>
          <p>
            Original write-ups from the library on the decisions, trade-offs,
            and engineering work behind dependable agent skills.
          </p>
        </section>

        <section aria-label="Published guides">
          <a
            className="guides-feature"
            href={`${basePath}/guides/spectrum-of-skill-sophistication`}
          >
            {spectrumImage?.type === "image" ? (
              // The guide image is a Markdown-authored static asset, served without an image optimizer.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={spectrumImage.alt}
                className="guides-feature-image"
                src={publicAssetUrl(spectrumImage.source, basePath)}
              />
            ) : null}
            <div className="guides-feature-copy">
              <h2>{spectrumGuide.title}</h2>
              {spectrumGuide.deck ? <p>{spectrumGuide.deck}</p> : null}
              <span className="guides-feature-link">
                Read the guide <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        </section>
      </article>

      <footer>
        <p>Agent Skills Resource Library</p>
        <p>
          Resource links lead to their original publishers. Verify third-party
          skills before installing or running them.
        </p>
      </footer>
    </main>
  );
}
