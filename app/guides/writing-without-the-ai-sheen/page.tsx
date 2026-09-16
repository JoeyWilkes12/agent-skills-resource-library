import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { GuideResourceLink } from "../guide-resource-link";
import { GuideTableViewport } from "../guide-table-viewport";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const contents = [
  { id: "authenticity-first", label: "Use AI as an editor" },
  { id: "editing-loop", label: "A practical editing loop" },
  { id: "what-to-watch", label: "Patterns worth watching" },
  { id: "skill-reviews", label: "Four skills, reviewed" },
  { id: "registry-check", label: "Published registry audits" },
  { id: "safe-trial", label: "Test safely" },
  { id: "editor-prompt", label: "A reusable editor brief" },
  { id: "sources", label: "Sources" },
];

const reviews = [
  {
    name: "Avoid AI Writing",
    href: "https://github.com/conorbronsdon/avoid-ai-writing",
    commit: "64b2de64239e09d87267234edb4589ef0b5aff5d",
    result: "99 · Critical · Do not install",
    coverage: "58.3% static coverage · partial",
    summary:
      "It offers detect, rewrite, and in-place edit modes, and explicitly says that AI-writing patterns are not authorship proof.",
    findings:
      "The score is dominated by incomplete reference analysis and contextual matches: visible HTML boundary comments, the phrase “output rules” in documentation, and Unicode normalization used by the detector. The missing tool declaration is real, and bundled Node.js helpers still need code review. Edit mode can change a file, so use detect mode first and confirm an exact file scope before any write.",
  },
  {
    name: "Humanizer by blader",
    href: "https://github.com/blader/humanizer",
    commit: "9862685f575c65a8247f90369951df1b3416e3d6",
    result: "47 · Medium · Caution",
    coverage: "100% static coverage",
    summary:
      "A prose-rewriting skill based on Wikipedia’s Signs of AI writing that asks the agent to retain claims, avoid invented facts, and follow a supplied sample’s voice.",
    findings:
      "The scanner flagged no declared tool scope, unpinned npx examples in maintainer documentation, and the phrase “without warning” inside a before-and-after example. The examples are not evidence of an active jailbreak, but the project still needs a semantic review before adoption.",
  },
  {
    name: "Humanizer Skill by Aboudjem",
    href: "https://github.com/Aboudjem/humanizer-skill",
    commit: "a58df065367550b6ce40ff3f648335018d8e0589",
    result: "45 · Medium · Caution (targeted skill scan)",
    coverage: "83.3% static coverage · partial",
    summary:
      "The focused scan covered the installable humanizer folder rather than the repository’s documentation and site assets. It declares read, write, edit, search, and user-question tools.",
    findings:
      "The scanner treated “without warning” and “do not judge” in prose examples as anti-refusal language, and misread a documented copy command as snooping and persistence. Those are contextual false positives. More importantly, the skill automatically loads a project-level humanizer-context.md file as voice guidance. Treat that file as untrusted unless the user explicitly selected it; it can otherwise become an indirect instruction source.",
  },
  {
    name: "Ghostwriter",
    href: "https://github.com/angelarose210/ghostwriter",
    commit: "6245570aedebb0a10c6e801c6d4c9ee7fa29484e",
    result: "39 · Medium · Caution",
    coverage: "100% static coverage",
    summary:
      "A four-skill voice-profile collection for analyzing samples, creating or blending profiles, and applying a profile to drafts.",
    findings:
      "The scanner flagged the real “no disclaimers” instruction in the apply skill; two other persistence findings were false positives on the ordinary word “create.” Profile loading across project and user directories still broadens what can influence a rewrite, while voice samples may be sensitive. Limit reads to a consented profile and never use a writing-style rule to suppress safety-relevant disclosures.",
  },
];

const registryChecks = [
  {
    name: "Avoid AI Writing",
    href: "https://skills.sh/conorbronsdon/avoid-ai-writing/avoid-ai-writing",
    auditDate: "Sep 15, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Humanizer by blader",
    href: "https://skills.sh/blader/humanizer/humanizer",
    auditDate: "Sep 7, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Humanizer by Aboudjem",
    href: "https://skills.sh/aboudjem/humanizer-skill/humanizer",
    auditDate: "Sep 14, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Ghostwriter · voice-apply",
    href: "https://skills.sh/angelarose210/ghostwriter/voice-apply",
    auditDate: "Jun 26, 2026",
    agentTrustHub: "Warn · Medium",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Ghostwriter · voice-analyze",
    href: "https://skills.sh/angelarose210/ghostwriter/voice-analyze",
    auditDate: "Jun 26, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Ghostwriter · voice-create",
    href: "https://skills.sh/angelarose210/ghostwriter/voice-create",
    auditDate: "Jun 26, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
  {
    name: "Ghostwriter · voice-blend",
    href: "https://skills.sh/angelarose210/ghostwriter/voice-blend",
    auditDate: "Jun 26, 2026",
    agentTrustHub: "Pass · Safe",
    socket: "Pass",
    snyk: "Pass · Low",
  },
];

export const metadata: Metadata = {
  title: "Writing without the AI sheen | Agent Skills Resource Library",
  description:
    "An authenticity-first workflow for using AI as an editor, with static SkillSpector evidence and current published registry audits for community writing skills.",
};

export default function WritingWithoutTheAiSheenGuide() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

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
            Last reviewed September 15, 2026 · Four repositories statically reviewed · None installed
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
                NVIDIA SkillSpector v2.11.2 ran in static-only mode against the
                exact commits below. We also ran OWASP’s high-signal direct
                prompt-injection patterns; none of the four targets matched
                those narrow expressions. That is triage evidence, not a safety
                certificate.
              </p>
              <GuideTableViewport className="guide-table-wrap">
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
                        <td><GuideResourceLink href={review.href}>{review.name}</GuideResourceLink></td>
                        <td>{review.result}</td>
                        <td>Not installed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GuideTableViewport>
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

          <section className="guide-section" id="registry-check">
            <p className="guide-section-number">05</p>
            <div>
              <h2>skills.sh registry check: one warning, the rest pass</h2>
              <p>
                Retrieved September 15, 2026. Exact skills.sh listings exist for
                Avoid AI Writing and both Humanizer projects. Ghostwriter is
                published as four separate skills, so each listing was checked
                instead of inventing a repository-wide verdict. Every row links
                to the listing; each provider result links to its detailed audit.
              </p>
              <GuideTableViewport className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Published skill</th>
                      <th scope="col">Gen Agent Trust Hub</th>
                      <th scope="col">Socket</th>
                      <th scope="col">Snyk</th>
                      <th scope="col">Audited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registryChecks.map((check) => (
                      <tr key={check.href}>
                        <td><GuideResourceLink href={check.href}>{check.name}</GuideResourceLink></td>
                        <td>
                          <GuideResourceLink href={`${check.href}/security/agent-trust-hub`}>
                            {check.agentTrustHub}
                          </GuideResourceLink>
                        </td>
                        <td>
                          <GuideResourceLink href={`${check.href}/security/socket`}>
                            {check.socket}
                          </GuideResourceLink>
                        </td>
                        <td>
                          <GuideResourceLink href={`${check.href}/security/snyk`}>
                            {check.snyk}
                          </GuideResourceLink>
                        </td>
                        <td>{check.auditDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GuideTableViewport>

              <details className="guide-callout">
                <summary><strong>Avoid AI Writing: three passes, with declared exposure</strong></summary>
                <p>
                  Gen Agent Trust Hub records bundled local Node.js scripts and
                  indirect-prompt-injection exposure, but also notes explicit
                  instructions to treat audited prose as data. Socket reports no
                  flagged malicious, trust, obfuscation, or autonomy behavior;
                  Snyk reports Low risk with no issues detected.
                </p>
                <p>
                  <strong>Snapshot note:</strong> Socket&apos;s package identifier
                  ends in <code>64b2de64239e09d87267234edb4589ef0b5aff5d</code>,
                  which matched the exact commit in the static-review table above.
                </p>
              </details>

              <details className="guide-callout">
                <summary><strong>The two Humanizers: three passes do not erase the input boundary</strong></summary>
                <p>
                  Gen Agent Trust Hub marks both Safe while documenting the same
                  material weakness: each skill processes untrusted prose without
                  strict boundary markers or sanitization. Aboudjem&apos;s version
                  also declares Read, Write, Edit, Grep, Glob, and user-question
                  capabilities, so embedded instructions could influence a
                  higher-impact agent if the host does not enforce separation.
                </p>
                <p>
                  <strong>Snapshot note:</strong> blader&apos;s Socket identifier
                  matched the exact reviewed commit <code>9862685f575c65a8247f90369951df1b3416e3d6</code>.
                  Aboudjem&apos;s identifier is a content hash, not a verified Git
                  commit mapping; the exact snapshot correspondence remains unproven.
                </p>
              </details>

              <details className="guide-callout">
                <summary><strong>Ghostwriter: provider disagreement changes the decision</strong></summary>
                <p>
                  Gen Agent Trust Hub rates <code>voice-apply</code> Warn / Medium
                  because it suppresses AI-identity and limitation disclaimers
                  and accepts untrusted text without explicit boundaries. It also
                  notes an indirect-injection surface in <code>voice-blend</code>,
                  which loads project and user voice profiles and can run a local
                  Python helper. Socket passes all four listings, while Snyk rates
                  each Low with no issues detected.
                </p>
                <p>
                  <strong>Snapshot note:</strong> the four registry entries use
                  content hashes that could not be mapped to Git commit
                  <code>6245570aedebb0a10c6e801c6d4c9ee7fa29484e</code>.
                  Treat the June audits as useful but not exact-artifact evidence.
                </p>
              </details>

              <div className="guide-callout">
                <strong>Conservative result: manual review is still required.</strong>
                <p>
                  The Medium warning blocks a blanket approval of Ghostwriter,
                  and the Humanizer passes still expose indirect prompt-injection
                  surfaces. These results support the local findings above; they
                  do not replace them or turn any project into a verified-safe install.
                </p>
              </div>
              <p>
                This skills.sh registry check reflects third-party audits of
                mutable registry snapshots. It does not verify publisher identity,
                the exact local artifact, dependencies resolved at install time,
                or runtime behavior. A missing or unmapped snapshot remains unknown.
              </p>
            </div>
          </section>

          <section className="guide-section" id="safe-trial">
            <p className="guide-section-number">06</p>
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
                  The static, registry, and local semantic reviews all identify
                  areas that need caution. Any later approval should pin the exact commit, define
                  allowed tools and files, preserve a rollback copy, and require
                  a fresh review for updates.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="editor-prompt">
            <p className="guide-section-number">07</p>
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
              <li><GuideResourceLink href="https://github.com/conorbronsdon/avoid-ai-writing">Avoid AI Writing</GuideResourceLink></li>
              <li><GuideResourceLink href="https://github.com/blader/humanizer">Humanizer by blader</GuideResourceLink></li>
              <li><GuideResourceLink href="https://github.com/Aboudjem/humanizer-skill">Humanizer Skill by Aboudjem</GuideResourceLink></li>
              <li><GuideResourceLink href="https://github.com/angelarose210/ghostwriter">Ghostwriter</GuideResourceLink></li>
              <li><GuideResourceLink href="https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing">Wikipedia: Signs of AI writing</GuideResourceLink></li>
              <li><GuideResourceLink href="https://docs.nvidia.com/skills/scanning-agent-skills">NVIDIA: Scan Agent Skills Before Installation</GuideResourceLink></li>
              <li><GuideResourceLink href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html">OWASP LLM Prompt Injection Prevention Cheat Sheet</GuideResourceLink></li>
              <li><GuideResourceLink href="https://skills.sh/audits">skills.sh security audits</GuideResourceLink></li>
              <li><GuideResourceLink href="https://skills.sh/docs/api">skills.sh API reference</GuideResourceLink></li>
            </ul>
          </section>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
