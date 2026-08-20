import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const contents = [
  { id: "authenticity-first", label: "Use AI as an editor" },
  { id: "editing-loop", label: "A practical editing loop" },
  { id: "what-to-watch", label: "Patterns worth watching" },
  { id: "skill-reviews", label: "Four skills, reviewed" },
  { id: "safe-trial", label: "Test safely" },
  { id: "editor-prompt", label: "A reusable editor brief" },
  { id: "sources", label: "Sources" },
];

const reviews = [
  {
    name: "Avoid AI Writing",
    href: "https://github.com/conorbronsdon/avoid-ai-writing",
    commit: "b504e2086bd3e544615afba7e5c7f31c8eade1d0",
    result: "76 · High · Do not install",
    coverage: "95.7% static coverage",
    summary:
      "It offers detect, rewrite, and in-place edit modes, and explicitly says that AI-writing patterns are not authorship proof.",
    findings:
      "The high score came from a missing tool declaration plus matches in a test, generated comment, and documentation. Those are mostly context-dependent, but edit mode can change a file, so use detect mode first and confirm an exact file scope before any write.",
  },
  {
    name: "Humanizer by blader",
    href: "https://github.com/blader/humanizer",
    commit: "e2e92e7b4b8229253ed5c8e81dc65463fdeddda5",
    result: "37 · Medium · Caution",
    coverage: "100% static coverage",
    summary:
      "A prose-rewriting skill based on Wikipedia’s Signs of AI writing that asks the agent to retain claims, avoid invented facts, and follow a supplied sample’s voice.",
    findings:
      "The scanner flagged no declared tool scope, unpinned npx examples in maintainer documentation, and the phrase “without warning” inside a before-and-after example. The examples are not evidence of an active jailbreak, but the project still needs a semantic review before adoption.",
  },
  {
    name: "Humanizer Skill by Aboudjem",
    href: "https://github.com/Aboudjem/humanizer-skill",
    commit: "9a7f35b7b9ad8c3abd71f10757ec9f91fb8ae165",
    result: "20 · Low · Safe (targeted skill scan)",
    coverage: "83.3% static coverage",
    summary:
      "The focused scan covered the installable humanizer folder rather than the repository’s documentation and site assets. It declares read, write, edit, search, and user-question tools.",
    findings:
      "The one alert is “without warning” in a prose example. More importantly, the skill automatically loads a project-level humanizer-context.md file as voice guidance. Treat that file as untrusted unless the user explicitly selected it; it can otherwise become an indirect instruction source.",
  },
  {
    name: "Ghostwriter",
    href: "https://github.com/angelarose210/ghostwriter",
    commit: "6245570aedebb0a10c6e801c6d4c9ee7fa29484e",
    result: "32 · Medium · Caution",
    coverage: "100% static coverage",
    summary:
      "A four-skill voice-profile collection for analyzing samples, creating or blending profiles, and applying a profile to drafts.",
    findings:
      "The scanner flagged a “no disclaimers” instruction in the apply skill and profile-loading behavior across project and user directories. The latter broadens what can influence a rewrite, while voice samples may be sensitive. Limit reads to a consented profile and never use a writing-style rule to suppress safety-relevant disclosures.",
  },
];

export const metadata: Metadata = {
  title: "Writing without the AI sheen | Agent Skills Resource Library",
  description:
    "An authenticity-first workflow for using AI as an editor, with static SkillSpector evidence for four community writing skills.",
};

export default function WritingWithoutTheAiSheenGuide() {
  return (
    <main className="guide-page">
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

      <article className="guide-article">
        <div className="guide-hero">
          <p className="eyebrow">Writing · Voice · Safety</p>
          <h1>Writing without the AI sheen.</h1>
          <p className="guide-deck">
            The goal is not to disguise machine-written text. It is to help a
            person express their own observation, uncertainty, vocabulary, and
            point of view more clearly—then keep ownership of the final pass.
          </p>
          <p className="guide-meta">
            Last reviewed August 19, 2026 · Four repositories statically reviewed · None installed
          </p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/writing-without-the-ai-sheen`}
        >
          <section className="guide-section guide-principle" id="authenticity-first">
            <p className="guide-section-number">01</p>
            <div>
              <h2>Use AI as an editor, not a ghostwriter</h2>
              <p>
                Start with the thing you actually think: an observation, a
                tension, an example, or an unfinished argument. Ask for a
                clearer structure, not a generic “engaging post.” A useful
                editor preserves the writer’s vocabulary and uncertainty rather
                than replacing them with polished, interchangeable prose.
              </p>
              <div className="guide-callout">
                <strong>Authenticity beats elegance.</strong>
                <p>
                  An awkward but real phrase can be better than a smoother line
                  that could have been written by anyone.
                </p>
              </div>
              <p>
                This matters especially for professional social writing. The
                reader should encounter a person’s actual judgment—not a
                manufactured lesson, grand claim, or engagement hook.
              </p>
            </div>
          </section>

          <section className="guide-section" id="editing-loop">
            <p className="guide-section-number">02</p>
            <div>
              <h2>A practical editing loop</h2>
              <ol className="guide-checklist">
                <li><strong>Write the raw idea.</strong> Include the example, qualifier, and opinion that make it yours.</li>
                <li><strong>Build a voice reference.</strong> Use your own past posts, emails, or notes—not a generic personality label.</li>
                <li><strong>Draft with constraints.</strong> Ask the model to keep your claims, avoid invented details, and leave out a call to engagement unless you supplied one.</li>
                <li><strong>Run a separate AI-ism audit.</strong> Identify patterns first; make only the changes you agree improve the piece.</li>
                <li><strong>Read it aloud and own it.</strong> Restore phrases, rhythm, or uncertainty that sound like you. Do not publish a sentence you would not say.</li>
              </ol>
              <p>
                This separation matters. A linter can help spot repetitive
                rhetorical moves; it should not decide what the writer means.
              </p>
            </div>
          </section>

          <section className="guide-section" id="what-to-watch">
            <p className="guide-section-number">03</p>
            <div>
              <h2>Patterns worth watching</h2>
              <p>
                Look for clusters and context, not a detector score. Many of
                these habits occur in ordinary human writing too.
              </p>
              <ul className="guide-checklist">
                <li>Inflated importance, generic praise, or a conclusion that simply restates the point.</li>
                <li>Repeated “not X, but Y” turns, tidy rules of three, or identical sentence and paragraph lengths.</li>
                <li>Generic hooks, artificial suspense, fake quotes, or a rhetorical question added only to invite comments.</li>
                <li>Corporate filler, unexplained jargon, and adjectives that announce significance instead of supplying evidence.</li>
                <li>Artificial imperfection—typos, slang, or fragments inserted solely to fool a classifier.</li>
              </ul>
              <p>
                Avoid optimizing for “passing” an AI detector. No such checklist
                establishes authorship, and detector-driven edits can erase a
                writer’s real style.
              </p>
            </div>
          </section>

          <section className="guide-section" id="skill-reviews">
            <p className="guide-section-number">04</p>
            <div>
              <h2>Four skills, reviewed before installation</h2>
              <p>
                NVIDIA SkillSpector v2.9.6 ran in static-only mode against the
                exact commits below. We also ran OWASP’s high-signal direct
                prompt-injection patterns; none of the four targets matched
                those narrow expressions. That is triage evidence, not a safety
                certificate.
              </p>
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Project</th>
                      <th scope="col">Static result</th>
                      <th scope="col">Review status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.name}>
                        <td><a href={review.href}>{review.name}</a></td>
                        <td>{review.result}</td>
                        <td>Not installed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {reviews.map((review) => (
                <details className="guide-callout" key={`${review.name}-details`}>
                  <summary><strong>{review.name}: static evidence and human read</strong></summary>
                  <p>{review.summary}</p>
                  <p><strong>Exact commit:</strong> <code>{review.commit}</code></p>
                  <p><strong>Scan:</strong> {review.result} · {review.coverage}</p>
                  <p><strong>What needs attention:</strong> {review.findings}</p>
                </details>
              ))}
              <p>
                A static scan does not verify a publisher, execute every path,
                establish runtime behavior, or remove false positives and false
                negatives. The Humanizer Skill’s repository-wide preliminary
                scan was critical because of documentation and bundled assets;
                its focused installable folder scanned low. Scope changes the
                result, so adoption must be tied to an exact artifact.
              </p>
            </div>
          </section>

          <section className="guide-section" id="safe-trial">
            <p className="guide-section-number">05</p>
            <div>
              <h2>Test safely before you trust it</h2>
              <p>
                Keep a first trial narrow: use non-sensitive text, block network
                access unless the workflow needs it, and start in detect-only or
                copy-out mode. Do not give a writing skill access to a project,
                profile directory, or sample corpus until you know exactly what
                it reads and writes.
              </p>
              <div className="guide-callout">
                <strong>Decision today: no installation.</strong>
                <p>
                  The static pass identified areas that need a local semantic
                  review. Any later approval should pin the exact commit, define
                  allowed tools and files, preserve a rollback copy, and require
                  a fresh review for updates.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="editor-prompt">
            <p className="guide-section-number">06</p>
            <div>
              <h2>A reusable editor brief</h2>
              <p>
                Use this as a starting point, then replace the generic terms
                with your own preferences and examples.
              </p>
              <div className="guide-callout">
                <p>
                  Act as my editor, not my ghostwriter. Preserve my ideas,
                  opinions, anecdotes, uncertainty, vocabulary, and point of
                  view. Improve clarity and structure without adding a lesson,
                  engagement question, or made-up detail. Prefer specific
                  observations over generalized insights. Flag familiar AI
                  writing patterns, but make minimal edits and leave passages
                  that already sound like me alone.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-sources" id="sources" aria-labelledby="guide-sources-heading">
            <h2 id="guide-sources-heading">Sources</h2>
            <ul>
              <li><a href="https://github.com/conorbronsdon/avoid-ai-writing">Avoid AI Writing</a></li>
              <li><a href="https://github.com/blader/humanizer">Humanizer by blader</a></li>
              <li><a href="https://github.com/Aboudjem/humanizer-skill">Humanizer Skill by Aboudjem</a></li>
              <li><a href="https://github.com/angelarose210/ghostwriter">Ghostwriter</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing">Wikipedia: Signs of AI writing</a></li>
              <li><a href="https://docs.nvidia.com/skills/scanning-agent-skills">NVIDIA: Scan Agent Skills Before Installation</a></li>
              <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html">OWASP LLM Prompt Injection Prevention Cheat Sheet</a></li>
            </ul>
          </section>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
