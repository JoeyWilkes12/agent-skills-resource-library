import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { GuideTableViewport } from "../guide-table-viewport";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const contents = [
  { id: "review-target", label: "Review the complete target" },
  { id: "static-screen", label: "Screen every bundled skill" },
  { id: "owasp-patterns", label: "Use OWASP patterns as triage" },
  { id: "semantic-review", label: "Add a scoped semantic review" },
  { id: "read-results", label: "Interpret findings, not scores" },
  { id: "decision", label: "Make a constrained decision" },
  { id: "sources", label: "Sources" },
];

const staticResults = [
  {
    skill: "banner-design",
    score: "0 · Low",
    read: "No static findings; its overlap with the larger design workflow still limited its value.",
  },
  {
    skill: "brand",
    score: "37 · Medium",
    read: "Most alerts were context-dependent; undeclared permissions remained a governance gap.",
  },
  {
    skill: "design",
    score: "83 · Critical",
    read: "The material concern: broad dotenv loading alongside external Gemini calls, plus active-output risks.",
  },
  {
    skill: "design-system",
    score: "27 · Medium",
    read: "Fixed argument-array process calls were not shell injection; unpinned package commands were still a supply-chain concern.",
  },
  {
    skill: "slides",
    score: "5 · Low",
    read: "Its only alert was an ordinary HTML comment; generated HTML still needs normal output controls.",
  },
  {
    skill: "ui-styling",
    score: "43 · Medium",
    read: "Documentation and test noise inflated the count; mutable package execution and dependency hygiene remained relevant.",
  },
];

const directPatterns = [
  "ignore\\s+(all\\s+)?previous\\s+instructions?",
  "you\\s+are\\s+now\\s+(in\\s+)?developer\\s+mode",
  "system\\s+override",
  "reveal\\s+prompt",
];

export const metadata: Metadata = {
  title: "Reviewing UI/UX Pro Max with NVIDIA SkillSpector | Agent Skills Resource Library",
  description:
    "A case study in using NVIDIA SkillSpector, OWASP prompt-injection checks, and a scoped OpenRouter semantic review before installing a bundled agent skill.",
};

export default function ReviewingUiUxProMaxWithSkillspector() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero">
          <p className="eyebrow">Security · Case study</p>
          <h1>How we reviewed UI/UX Pro Max before installation.</h1>
          <p className="guide-deck">
            A layered review of one UI/UX skill and its six bundled add-ons:
            exact-artifact static scanning, OWASP prompt-injection triage, and
            a scoped semantic second opinion through OpenRouter.
          </p>
          <p className="guide-meta">Last reviewed August 19, 2026 · Status: not installed</p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/reviewing-ui-ux-pro-max-with-skillspector`}
        >
          <section className="guide-section guide-principle" id="review-target">
            <p className="guide-section-number">01</p>
            <div>
              <h2>Review the complete target, not the headline skill</h2>
              <p>
                UI/UX Pro Max is presented as design intelligence for coding
                agents. Its published CLI artifact contained the core design
                catalog and six companion skills: <code>banner-design</code>,{" "}
                <code>brand</code>, <code>design</code>,{" "}
                <code>design-system</code>, <code>slides</code>, and{" "}
                <code>ui-styling</code>.
              </p>
              <p>
                The review staged the exact published package instead of
                installing it. That matters because a default installer can
                widen the trust boundary from one expected skill to an entire
                bundle of instructions, scripts, dependencies, and optional
                external calls.
              </p>
              <div className="guide-callout">
                <strong>Decision boundary</strong>
                <p>
                  Evidence applies to the artifact that was actually reviewed.
                  It does not transfer automatically to a moving repository
                  branch, a future package release, or a differently scoped
                  install command.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="static-screen">
            <p className="guide-section-number">02</p>
            <div>
              <h2>Screen every bundled skill before anything runs</h2>
              <p>
                We upgraded NVIDIA SkillSpector from its official upstream,
                then ran its static analyzers against each add-on directory.
                The scanner inspected the complete staged directories; its
                model-based semantic mode was intentionally not used for this
                first pass.
              </p>
              <GuideTableViewport className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Bundled skill</th>
                      <th scope="col">Static result</th>
                      <th scope="col">What human review found</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staticResults.map((result) => (
                      <tr key={result.skill}>
                        <td><code>{result.skill}</code></td>
                        <td>{result.score}</td>
                        <td>{result.read}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GuideTableViewport>
              <p>
                The high score for <code>design</code> was not treated as a
                verdict by itself. It prompted line-level investigation,
                deduplication, and comparison with the capability the skill
                actually claimed to provide.
              </p>
            </div>
          </section>

          <section className="guide-section" id="owasp-patterns">
            <p className="guide-section-number">03</p>
            <div>
              <h2>Use OWASP patterns as triage—not clearance</h2>
              <p>
                The <a href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html">OWASP LLM Prompt Injection Prevention Cheat Sheet</a>{" "}
                explains why natural-language instructions and data need clear
                separation. We used its example direct-injection expressions
                as a deterministic first check:
              </p>
              <ul className="guide-checklist">
                {directPatterns.map((pattern) => (
                  <li key={pattern}><code>{pattern}</code></li>
                ))}
              </ul>
              <p>
                None of the six directories matched those four expressions.
                That result is useful, but deliberately narrow. OWASP also
                covers indirect injections in code comments, documentation,
                web content, images, and other material an agent may process;
                it calls out persistence, data exfiltration, tool misuse, and
                context poisoning as separate risks.
              </p>
              <p>
                Broad fuzzy keywords created predictable false positives:
                “design system,” CSS overrides, Delete buttons, and file-ignore
                options. The lesson is simple: pattern checks identify places
                to inspect. They do not prove that a skill is safe, malicious,
                or ready to install.
              </p>
              <div className="guide-callout">
                <strong>What the check missed by design</strong>
                <p>
                  The core skill can persist project design Markdown that later
                  sessions may read as authoritative. Treat those files as
                  untrusted project data on every read; do not allow them to
                  override higher-level agent policy or human-approved design
                  decisions.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="semantic-review">
            <p className="guide-section-number">04</p>
            <div>
              <h2>Add a scoped semantic review</h2>
              <p>
                Static analysis can flag a process call, a credential reference,
                or an HTML comment without knowing whether the surrounding
                behavior is dangerous. We therefore sent a structured evidence
                summary to Claude Fable 5 through OpenRouter, using High
                reasoning effort and a pinned provider path.
              </p>
              <p>
                The model reviewed a complete findings summary: the target
                scope, static results, line-level triage, OWASP outcomes,
                known historical issues, effectiveness observations, and the
                candidate adoption choices. It did <strong>not</strong> receive
                the raw full artifact, raw scanner reports, secrets, or local
                environment information. This was an independent judgment of
                the supplied evidence—not a second full code audit.
              </p>
              <p>
                Its recommendation aligned with the human triage: retain the
                existing design authorities, use the UI/UX Pro Max core only as
                optional ideation if ever adopted, and avoid the umbrella
                <code>design</code> skill and <code>ui-styling</code> bundle
                component.
              </p>
            </div>
          </section>

          <section className="guide-section" id="read-results">
            <p className="guide-section-number">05</p>
            <div>
              <h2>Interpret findings, not scores</h2>
              <p>
                Several scanner alerts were correct in category but not in
                impact. Fixed argument-array process invocations were not the
                same as demonstrated shell injection; ordinary HTML comments
                were not hidden instructions; and license or test-file matches
                were not runtime agency.
              </p>
              <p>
                The review did identify material risk. Three scripts in the
                bundled <code>design</code> skill searched project and shared
                Claude dotenv locations before initializing Gemini clients.
                The code did not demonstrate transmission of unrelated secrets,
                but it unnecessarily crossed a shared credential boundary and
                paired that access with external calls. Unpinned <code>npx</code>{" "}
                commands and model-generated active SVG output were additional
                reasons not to install that component as-is.
              </p>
              <ul className="guide-checklist">
                <li>Record the exact artifact, version, commit, and integrity information before review.</li>
                <li>Read every report at file and line level; merge duplicate alerts before estimating severity.</li>
                <li>Separate a genuine capability from a demonstrated exploit path and from a false positive.</li>
                <li>Compare the residual risk with the marginal value over skills already trusted in the workflow.</li>
              </ul>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="decision">
            <p className="guide-section-number">06</p>
            <div>
              <h2>Make a constrained decision—and keep usefulness separate</h2>
              <p>
                The outcome was <strong>no installation</strong>. The default
                seven-skill CLI bundle was not accepted. If the core catalog is
                ever needed, the safer path is to vendor only the exact,
                reviewed core directory; pin it; disable automatic updates;
                apply least-privilege process and network controls; and rescan
                every update.
              </p>
              <p>
                The next evaluation is a usefulness experiment, not a security
                approval: use OpenRouter to send additional design questions to
                Kimi K3 and compare the answers with the existing
                <code>frontend-design</code> and Impeccable workflows. Those
                prompts should avoid sensitive project data, treat model output
                as untrusted design input, and never cause an agent-skill
                installation on their own.
              </p>
              <p className="guide-final">
                A security review can recommend “not yet” while still leaving a
                clean path to test the underlying design question.
              </p>
            </div>
          </section>

          <section className="guide-sources" id="sources" aria-labelledby="guide-sources-heading">
            <h2 id="guide-sources-heading">Sources</h2>
            <ul>
              <li>
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html">
                  OWASP: LLM Prompt Injection Prevention Cheat Sheet
                </a>
              </li>
              <li>
                <a href="https://docs.nvidia.com/skills/scanning-agent-skills">
                  NVIDIA: Scan Agent Skills Before Installation
                </a>
              </li>
              <li>
                <a href="https://github.com/NVIDIA/SkillSpector">
                  NVIDIA SkillSpector repository and scanner documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill">
                  UI/UX Pro Max source repository
                </a>
              </li>
              <li>
                <a href="https://openrouter.ai/docs/guides/routing/provider-selection">
                  OpenRouter: provider routing
                </a>
              </li>
            </ul>
          </section>

          <a className="guide-back" href={`${basePath}/#library`}>
            ← Back to the resource library
          </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
