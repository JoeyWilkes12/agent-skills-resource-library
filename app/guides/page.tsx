import type { Metadata } from "next";
import { SiteHeader } from "../site-header";
import { GuidesSearch } from "./guides-search";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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

        <GuidesSearch basePath={basePath} />
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
