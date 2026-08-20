import type { Metadata } from "next";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const libraryUrl =
  "https://joeywilkes12.github.io/agent-skills-resource-library/.";

export const metadata: Metadata = {
  title: "About | Agent Skills Resource Library",
  description:
    "Learn how the Agent Skills Resource Library helps people find reliable guidance for AI agent skills.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
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
          <a className="header-link" href={`${basePath}/about`} aria-current="page">
            About
          </a>
        </nav>
      </header>

      <article className="about-article">
        <section className="about-hero" aria-labelledby="about-heading">
          <div className="about-intro">
            <p className="eyebrow">About the library</p>
            <h1 id="about-heading">A clearer starting point for agent skills.</h1>
            <p>
              The Agent Skills Resource Library collects practical, source-led
              guidance for people learning to find, build, troubleshoot, and
              evaluate AI agent skills.
            </p>
            <a className="about-primary-link" href={`${basePath}/#library`}>
              Browse the library <span aria-hidden="true">→</span>
            </a>
          </div>

          <aside className="about-qr-card" aria-labelledby="qr-heading">
            <div className="about-qr-copy">
              <p className="eyebrow">Quick access</p>
              <h2 id="qr-heading">Take the library with you.</h2>
              <p>Scan to open the Agent Skills Resource Library on your phone.</p>
            </div>
            <a
              className="about-qr-link"
              href={libraryUrl}
              aria-label="Open the Agent Skills Resource Library"
            >
              <Image
                src={`${basePath}/qr/agent-skills-resource-library.svg`}
                alt="QR code that opens the Agent Skills Resource Library"
                width={360}
                height={360}
                unoptimized
              />
            </a>
            <a className="about-qr-url" href={libraryUrl}>
              Open the library <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </section>

        <section className="about-section" aria-labelledby="what-heading">
          <div>
            <p className="guide-label">What it is for</p>
            <h2 id="what-heading">A useful library is more than a list of links.</h2>
            <p>
              Each resource is organized around the practical question it helps
              answer, so visitors can narrow the collection by intent, topic,
              source type, publisher, or experience level. The goal is to help
              people reach the right guidance without needing to know the
              vocabulary in advance.
            </p>
            <div className="about-principles">
              <div>
                <span>01</span>
                <strong>Learn the foundations</strong>
                <p>Start with explanations and documentation that make skills easier to understand.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Build with confidence</strong>
                <p>Find hands-on guidance for shaping reliable, repeatable workflows.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Make sound judgments</strong>
                <p>Use practical evaluation and safety guidance before adopting a third-party skill.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" aria-labelledby="editorial-heading">
          <div>
            <p className="guide-label">Editorial approach</p>
            <h2 id="editorial-heading">Source-led, clearly labeled, and practical.</h2>
            <p>
              The library prioritizes primary documentation where it is
              available, labels platform-specific advice, and points readers
              back to the original publisher. A curated resource is a starting
              point for informed work, not a replacement for verifying a
              third-party skill before installing or running it.
            </p>
          </div>
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
