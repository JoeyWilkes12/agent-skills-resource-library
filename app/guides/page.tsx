import type { Metadata } from "next";
import { SiteHeader } from "../site-header";
import spectrumGuideSource from "./generated/spectrum-of-skill-sophistication";
import { parseMarkdownGuide, publicAssetUrl } from "./markdown-guide";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const spectrumGuide = parseMarkdownGuide(spectrumGuideSource);
const spectrumImage = spectrumGuide.intro.find((block) => block.type === "image");
const libraryGuides = [
  {
    href: "/guides/enterprise-agent-skills-presenter-readiness",
    title: "Enterprise training on skills for AI agents: presenter readiness questions",
    summary:
      "A presenter-facing question bank for preparing a clear, credible 20-minute enterprise introduction to agent skills.",
  },
  {
    href: "/guides/skills-in-the-agentic-performance-system",
    title: "Skills in the agentic performance system",
    summary:
      "A seven-lever framework for seeing Skills alongside models, data, tools, harnesses, software, evaluation, and trust.",
  },
  {
    href: "/guides/agentic-performance-source-library",
    title: "Agentic performance source library",
    summary:
      "An annotated, source-labeled reading map spanning AAIF, major providers, research papers, and O'Reilly Radar.",
  },
  {
    href: "/guides/writing-without-the-ai-sheen",
    title: "Writing without the AI sheen",
    summary:
      "A practical authenticity-first editing workflow, with static safety evidence for four community writing skills.",
  },
  {
    href: "/guides/when-not-to-use-a-skill",
    title: "When not to use a skill",
    summary:
      "A decision guide for choosing primary documentation or a governed internal workflow instead of a third-party agent skill.",
  },
  {
    href: "/guides/so-you-found-a-skill-checklist",
    title: "So you found a skill: pre-install confidence checklist",
    summary:
      "A source-backed checklist for reviewing a skill's provenance, behavior, dependencies, permissions, reliability, and update path before installation.",
  },
  {
    href: "/guides/skillspector-enterprise-training",
    title: "NVIDIA SkillSpector enterprise training guide",
    summary:
      "A practical guide to screening an agent skill before installation and turning scanner output into a defensible human decision.",
  },
  {
    href: "/guides/reviewing-ui-ux-pro-max-with-skillspector",
    title: "Reviewing UI/UX Pro Max with NVIDIA SkillSpector",
    summary:
      "A case study in reviewing a skill bundle with static analysis, OWASP prompt-injection triage, and a scoped semantic second opinion before installation.",
  },
  {
    href: "/guides/skillspector-skill-demo",
    title: "What an agent skill looks like: SkillSpector Review",
    summary:
      "An annotated walkthrough of a real Codex skill that turns a security policy into a discoverable, reusable workflow.",
  },
  {
    href: "/guides/microsoft-skillopt-third-party-snapshot",
    title: "Microsoft SkillOpt: third-party developer snapshot",
    summary:
      "An independent developer review of SkillOpt's maturity, operating costs, security boundaries, and fit for governed self-service skills.",
  },
  {
    href: "/guides/anthropics-complete-guide-for-building-skills-for-claude",
    title: "Anthropic’s Complete Guide For Building Skills For Claude [VERBATIM]",
    summary:
      "Anthropic’s original 33-page guide, presented through the publisher-hosted PDF with clear source attribution and no editorial rewriting.",
  },
];

export const metadata: Metadata = {
  title: "Guides | Agent Skills Resource Library",
  description:
    "Original, practical guides for building and evaluating AI agent skills.",
};

export default function GuidesPage() {
  return (
    <main className="guide-page guides-index-page">
      <SiteHeader currentSection="guides" />

      <article className="guides-index-article">
        <section className="guides-index-hero" aria-labelledby="guides-heading">
          <h1 id="guides-heading">Guides for building skills that hold up.</h1>
          <p>
            Guides and editorial write-ups from the library on the decisions,
            trade-offs, and engineering work behind dependable agent skills.
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

        <section className="guides-list" aria-labelledby="more-guides-heading">
          <div className="guides-list-header">
            <h2 id="more-guides-heading">More guides from the library</h2>
            <p>
              Practical reading for deciding whether to use, install, review,
              or improve an agent skill.
            </p>
          </div>
          <ul>
            {libraryGuides.map((guide) => (
              <li key={guide.href}>
                <a href={`${basePath}${guide.href}`}>
                  <div>
                    <h3>{guide.title}</h3>
                    <p>{guide.summary}</p>
                  </div>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
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
