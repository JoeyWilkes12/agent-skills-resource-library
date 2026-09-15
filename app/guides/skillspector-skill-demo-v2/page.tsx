import type { Metadata } from "next";
import { SiteHeader } from "../../site-header";
import { GuideResourceLink } from "../guide-resource-link";
import { GuideReadingLayout } from "../guide-reading-layout";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const artifactRoot = `${basePath}/examples/skillspector-review-v2`;
const downloadPath = `${basePath}/downloads/skillspector-review-v2.zip`;
const contents = [
  { id: "what-changed", label: "See what changed in v2" },
  { id: "review-stack", label: "Build a layered review stack" },
  { id: "static-first", label: "Run deterministic checks first" },
  { id: "owasp-triage", label: "Add OWASP prompt-injection triage" },
  { id: "semantic-review", label: "Choose the semantic-review boundary" },
  { id: "coverage-language", label: "Report what the reviewer actually saw" },
  { id: "decision-boundary", label: "Keep the decision human-governed" },
  { id: "use-the-skill", label: "Inspect or download the v2 skill" },
];

export const metadata: Metadata = {
  title: "SkillSpector Review v2: a layered pre-install gate | Agent Skills Resource Library",
  description:
    "An annotated walkthrough of the current global SkillSpector Review skill, including skills.sh evidence, OWASP triage, and authorization-aware semantic review.",
};

export default function SkillSpectorSkillDemoV2() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero skill-demo-hero">
          <h1>SkillSpector Review v2: a layered pre-install gate</h1>
          <p className="guide-deck">
            The current global skill expands a scanner run into a defensible
            review procedure: collect registry evidence in parallel, scan the
            exact artifact, test prompt-injection leads, and state precisely
            what any semantic reviewer was allowed to see.
          </p>
          <div className="guide-hero-actions">
            <a href={`${artifactRoot}/SKILL.md`}>View the v2 SKILL.md</a>
            <a
              className="guide-hero-download"
              download="skillspector-review-v2.zip"
              href={downloadPath}
            >
              Download v2 ZIP ↓
            </a>
          </div>
          <p className="guide-meta">
            Current global-skill snapshot · Read and download · Verified September 15, 2026
          </p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/skillspector-skill-demo-v2`}
        >
          <section className="guide-section guide-principle" id="what-changed">
            <p className="guide-section-number">V2</p>
            <div>
              <h2>The skill now records a chain of evidence</h2>
              <p>
                The original demonstration explained discovery metadata,
                implicit activation, an ordered static scan, and explicit
                authority boundaries. This version keeps those foundations and
                adds three controls that materially change how a review should
                be interpreted.
              </p>
              <div className="scan-evidence" aria-label="SkillSpector Review v2 evidence layers">
                <div>
                  <span>Review stack</span>
                  <strong>4</strong>
                  <b>Evidence layers</b>
                </div>
                <p>
                  Registry audit evidence, SkillSpector static analysis, OWASP
                  prompt-injection triage, and an authorization-aware semantic
                  assessment contribute different signals. None is presented as
                  a security certificate or a substitute for artifact identity.
                </p>
              </div>
              <p>
                Start with the <a href={`${basePath}/guides/skillspector-skill-demo`}>v1 anatomy guide</a>{" "}
                if you want the shorter explanation of how a Codex skill is
                structured and discovered.
              </p>
            </div>
          </section>

          <section className="guide-section" id="review-stack">
            <div>
              <h2>Build the review stack around the exact artifact</h2>
              <ol className="skill-workflow">
                <li>
                  <strong>Registry evidence</strong>
                  <span>Run the skills.sh security check in parallel and retain Gen Agent Trust Hub, Socket, and Snyk findings with their dates and gaps.</span>
                </li>
                <li>
                  <strong>Local static scan</strong>
                  <span>Refresh SkillSpector from NVIDIA&apos;s upstream origin and scan before installing or executing untrusted content.</span>
                </li>
                <li>
                  <strong>OWASP triage</strong>
                  <span>Use direct patterns as leads, then inspect the attack classes that regular expressions cannot clear.</span>
                </li>
                <li>
                  <strong>Semantic assessment</strong>
                  <span>Use local Codex by default or an explicitly approved external reviewer, then label the actual review coverage.</span>
                </li>
              </ol>
              <div className="guide-callout">
                <strong>Identity is the spine</strong>
                <p>
                  A mutable repository URL is useful for preliminary screening.
                  A final decision needs the intended commit and the relevant
                  checked-out skill directory. Registry results and URL scans
                  may describe a different snapshot or a broader monorepo.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="static-first">
            <div>
              <h2>Run deterministic checks before semantic review</h2>
              <p>
                The first local artifact review is intentionally static-only.
                It is fast, repeatable, and does not require sending the target
                to an LLM provider.
              </p>
              <pre className="skill-code">
                <code>{`skillspector scan TARGET \\
  --no-llm \\
  --format json \\
  --output REPORT.json`}</code>
              </pre>
              <div className="training-comparison">
                <div>
                  <h3>Continue the requested review</h3>
                  <ul>
                    <li>Exit 0 means the score is 50 or lower, not that the artifact is proven safe.</li>
                    <li>Read findings, confidence, completeness, degradation, and suppressed evidence.</li>
                    <li>Keep the JSON report outside the target repository unless durable evidence was requested.</li>
                  </ul>
                </div>
                <div>
                  <h3>Stop before use</h3>
                  <ul>
                    <li>Exit 1 means the score is above 50 and blocks installation or execution.</li>
                    <li>Exit 2 means the scan failed and its coverage is incomplete.</li>
                    <li>High or critical evidence remains a blocker until reviewed or remediated.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="guide-section" id="owasp-triage">
            <div>
              <h2>OWASP triage widens the prompt-injection lens</h2>
              <p>
                The v2 skill adds OWASP&apos;s high-signal direct patterns and
                output-leakage examples as case-insensitive triage. A match is a
                lead, not a finding: examples, defensive documentation, tests,
                licenses, and ordinary interface language create legitimate
                noise.
              </p>
              <pre className="skill-code">
                <code>{`ignore\\s+(all\\s+)?previous\\s+instructions?
you\\s+are\\s+now\\s+(in\\s+)?developer\\s+mode
system\\s+override
reveal\\s+prompt`}</code>
              </pre>
              <p>
                Manual review then covers what regex cannot: indirect or remote
                instructions, encoding and invisible text, memory poisoning,
                forged observations, tool-parameter manipulation, and untrusted
                model output reaching shell, file, package, or network actions.
              </p>
              <div className="guide-callout">
                <strong>Layer defenses</strong>
                <p>
                  The recommended response is not a bigger blocklist. Separate
                  instructions from data, normalize inputs, sanitize retrieved
                  content, validate tool parameters, restrict privileges, screen
                  outputs and actions, and require human approval at consequential boundaries.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="semantic-review">
            <div>
              <h2>Semantic review begins with an authorization choice</h2>
              <p>
                After static analysis and manual triage, the skill offers two
                routes. The route controls where artifact content travels and
                therefore cannot be chosen as a hidden implementation detail.
              </p>
              <div className="training-comparison">
                <div>
                  <h3>Local Codex</h3>
                  <ul>
                    <li>Default when external transmission has not been approved.</li>
                    <li>Review the raw, relevant artifact locally.</li>
                    <li>Keep secrets, credentials, private material, and unrelated files out of any external path.</li>
                  </ul>
                </div>
                <div>
                  <h3>Approved OpenRouter review</h3>
                  <ul>
                    <li>Requires approval to send the reviewed public or non-sensitive material.</li>
                    <li>Discover the requested exact model and endpoint before use.</li>
                    <li>Do not silently substitute a model, provider, or fallback policy.</li>
                  </ul>
                </div>
              </div>
              <p>
                If a broker blocks raw evidence as prompt injection, the skill
                does not bypass that safeguard. It uses local review for the raw
                artifact and may send a sanitized findings summary only with the
                correct, narrower coverage label.
              </p>
            </div>
          </section>

          <section className="guide-section" id="coverage-language">
            <div>
              <h2>Report what the semantic reviewer actually saw</h2>
              <div className="guide-decision-outcomes">
                <dl>
                  <div>
                    <dt>Independent semantic audit</dt>
                    <dd>All relevant raw instructions, executable source, manifests, and security references from the exact artifact were reviewed.</dd>
                  </div>
                  <div>
                    <dt>Semantic adjudication</dt>
                    <dd>The reviewer received complete findings and analyst synthesis, but not the raw artifact.</dd>
                  </div>
                  <div>
                    <dt>Targeted second opinion</dt>
                    <dd>The reviewer received selected findings or excerpts only.</dd>
                  </div>
                </dl>
              </div>
              <p>
                The evidence record should also name the model, reasoning effort,
                provider and fallback policy, represented files and bytes,
                material exclusions, broker filtering, and tokens and cost when available.
              </p>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="decision-boundary">
            <div>
              <h2>A passing stack still does not authorize installation</h2>
              <ul className="guide-checklist">
                <li>Reconcile registry findings with the exact local artifact and target commit.</li>
                <li>Treat incomplete or degraded analysis as caution, even when the score is low.</li>
                <li>Inspect severe findings and their locations instead of gating on one aggregate score.</li>
                <li>Pair results with provenance, code review, least privilege, sandboxing, egress control, and runtime monitoring.</li>
                <li>Re-scan after source, dependency, scanner, model, or policy changes.</li>
                <li>Keep installation, execution, credentials, and external data transfer within the user&apos;s actual authority.</li>
              </ul>
              <p className="guide-final">
                V2 makes the evidence richer and the language more precise. It
                does not automate away the final security and authorization decision.
              </p>
            </div>
          </section>

          <section className="guide-section" id="use-the-skill">
            <div>
              <h2>Inspect or download the current v2 snapshot</h2>
              <div className="skill-anatomy" aria-label="SkillSpector Review v2 folder anatomy">
                <pre>
                  <code>{`skillspector-review-v2/
├── SKILL.md
└── agents/
    └── openai.yaml`}</code>
                </pre>
                <dl>
                  <div>
                    <dt>SKILL.md</dt>
                    <dd>The complete trigger, four-layer review workflow, interpretation rules, and authority boundaries.</dd>
                  </div>
                  <div>
                    <dt>openai.yaml</dt>
                    <dd>Codex display copy, default prompt, and implicit-invocation policy.</dd>
                  </div>
                </dl>
              </div>
              <div className="guide-checklist-download">
                <div>
                  <h3>Read before installing</h3>
                  <p>
                    The ZIP is a dated distribution snapshot of the global
                    skill used for this guide. Inspect its authority assumptions
                    and adapt them to your environment before installation.
                  </p>
                </div>
                <a download="skillspector-review-v2.zip" href={downloadPath}>
                  Download v2 skill ZIP ↓
                </a>
              </div>
              <ul className="guide-checklist">
                <li><a href={`${artifactRoot}/SKILL.md`}>View the complete v2 SKILL.md</a></li>
                <li><a href={`${artifactRoot}/agents/openai.yaml`}>View Codex interface metadata</a></li>
                <li><a href={`${basePath}/guides/vercel-skills-sh-security-check`}>Open the parallel skills.sh registry check</a></li>
              </ul>
            </div>
          </section>

          <section className="guide-sources" aria-labelledby="skillspector-v2-sources">
            <h2 id="skillspector-v2-sources">Primary references</h2>
            <ul>
              <li><GuideResourceLink href="https://docs.nvidia.com/skills/scanning-agent-skills">NVIDIA scanning guide</GuideResourceLink></li>
              <li><GuideResourceLink href="https://github.com/NVIDIA/SkillSpector">NVIDIA SkillSpector source</GuideResourceLink></li>
              <li><GuideResourceLink href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html">OWASP prompt-injection guidance</GuideResourceLink></li>
              <li><a href={`${basePath}/guides/skillspector-skill-demo`}>SkillSpector Review v1 anatomy guide</a></li>
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
