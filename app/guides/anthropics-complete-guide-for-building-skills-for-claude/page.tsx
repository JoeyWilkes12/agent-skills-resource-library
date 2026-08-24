import type { Metadata } from "next";
import { SiteHeader } from "../../site-header";
import { GuideReadingLayout } from "../guide-reading-layout";
import styles from "./page.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/anthropics-complete-guide-for-building-skills-for-claude`;
const sourceUrl =
  "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf";
const title = "Anthropic’s Complete Guide For Building Skills For Claude [VERBATIM]";
const description =
  "Anthropic’s complete skill-building guide, presented through the publisher-hosted original PDF with clear attribution.";

const contents = [
  { id: "about-this-edition", label: "About this verbatim edition" },
  { id: "read-the-guide", label: "Read the guide" },
  { id: "chapter-map", label: "Chapter map" },
  { id: "source-and-attribution", label: "Source and attribution" },
];

const chapters = [
  ["Introduction", "PDF page 3"],
  ["Fundamentals", "PDF pages 4-6"],
  ["Planning and design", "PDF pages 7-13"],
  ["Testing and iteration", "PDF pages 14-17"],
  ["Distribution and sharing", "PDF pages 18-20"],
  ["Patterns and troubleshooting", "PDF pages 21-27"],
  ["Resources and references", "PDF pages 28-32"],
];

export const metadata: Metadata = {
  title: `${title} | Agent Skills Resource Library`,
  description,
  openGraph: { title, description, images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

export default function AnthropicCompleteGuidePage() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero">
          <p className="eyebrow">Anthropic · Publisher guide · Verbatim</p>
          <h1>{title}</h1>
          <p className="guide-deck">
            Anthropic&apos;s original guide to planning, structuring, testing,
            distributing, and troubleshooting Skills for Claude.
          </p>
          <div className="guide-hero-actions">
            <a href={sourceUrl} rel="noreferrer" target="_blank">
              Read the original source{" "}<span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="guide-meta">
            Published by Anthropic · 33-page PDF · Source dated January 2026
          </p>
        </div>

        <GuideReadingLayout contents={contents} path={path}>
          <section className="guide-section guide-principle" id="about-this-edition">
            <p className="guide-section-number">01</p>
            <div>
              <p className="guide-label">Attribution</p>
              <h2>Anthropic&apos;s work, presented without edits</h2>
              <p>
                This page embeds the original PDF served by Anthropic. Its words,
                examples, illustrations, and branding belong to Anthropic. The
                Agent Skills Resource Library added only this attribution,
                navigation, and source context; it did not rewrite the guide.
              </p>
              <div className="guide-callout">
                <strong>What “verbatim” means here</strong>
                <p>
                  The document shown below is the publisher-hosted original. If
                  this page and Anthropic&apos;s source ever differ, treat the
                  original source as authoritative.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="read-the-guide">
            <p className="guide-section-number">02</p>
            <div>
              <div className={styles.viewerHeader}>
                <h2>Read the original guide</h2>
                <a href={sourceUrl} rel="noreferrer" target="_blank">
                  Open PDF in a new tab{" "}<span aria-hidden="true">↗</span>
                </a>
              </div>
              <iframe
                className={styles.viewer}
                loading="lazy"
                src={sourceUrl}
                title="Anthropic’s Complete Guide to Building Skills for Claude PDF"
              />
            </div>
          </section>

          <section className="guide-section" id="chapter-map">
            <p className="guide-section-number">03</p>
            <div>
              <p className="guide-label">Inside the PDF</p>
              <h2>Chapter map</h2>
              <ul className={`guide-checklist ${styles.chapterList}`}>
                {chapters.map(([chapter, pages]) => (
                  <li key={chapter}>
                    <strong>{chapter}</strong>
                    <span>{pages}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="guide-sources" id="source-and-attribution">
            <h2>Source and attribution</h2>
            <ul>
              <li>
                Publisher: <strong>Anthropic</strong>
              </li>
              <li>
                Original title: <em>The Complete Guide to Building Skills for Claude</em>
              </li>
              <li>
                <a href={sourceUrl} rel="noreferrer" target="_blank">
                  Original publisher-hosted PDF
                </a>
              </li>
            </ul>
            <p className="guide-source-note">
              This library is not affiliated with or endorsed by Anthropic.
              Product instructions can change; consult Anthropic&apos;s current
              documentation before relying on time-sensitive setup or API details.
            </p>
          </section>

          <a className="guide-back" href={`${basePath}/guides`}>
            ← Back to guides
          </a>
        </GuideReadingLayout>
      </article>

      <footer>
        <p>Agent Skills Resource Library</p>
        <p>Original guide published by Anthropic.</p>
      </footer>
    </main>
  );
}
