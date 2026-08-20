import type { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "NVIDIA SkillSpector enterprise training guide | Agent Skills Resource Library",
  description:
    "A presentation-ready guide to using NVIDIA SkillSpector as a preliminary agent-skill security screen and interpreting its static and LLM-assisted results.",
};

export default function SkillSpectorEnterpriseTrainingGuide() {
  return (
    <main className="guide-page">
      <header className="guide-header">
        <a className="wordmark" href={`${basePath}/`} aria-label="Back to the library">
          <span className="wordmark-mark" aria-hidden="true">AS</span>
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
        <div className="guide-hero training-hero">
          <h1>NVIDIA SkillSpector for enterprise teams</h1>
          <p className="guide-deck">
            A training guide for screening an agent skill before installation,
            understanding what a second-pass LLM can add, and turning scanner
            output into a defensible human decision.
          </p>
          <div className="guide-hero-actions">
            <a href="#runbook">Use the review runbook</a>
            <a href={`${basePath}/guides/skillspector-skill-demo`}>
              Inspect the demo skill
            </a>
          </div>
          <p className="guide-meta">
            Last reviewed August 11, 2026 · SkillSpector 2.9.2
          </p>
        </div>

        <section className="guide-section guide-principle">
          <p className="guide-section-number">01</p>
          <div>
            <h2>The role: an early gate, not a safety certificate</h2>
            <p>
              Agent skills combine natural-language instructions with optional
              scripts, dependencies, references, assets, and tool access. That
              makes them both a software supply-chain artifact and a semantic
              control surface for an AI agent.
            </p>
            <p>
              SkillSpector moves review ahead of installation and execution. It
              accepts repositories, URLs, archives, directories, and individual
              files, then produces terminal, JSON, Markdown, or SARIF findings.
              A passing scan narrows the review; it does not prove publisher
              identity, artifact integrity, runtime safety, or the absence of
              vulnerabilities.
            </p>
            <div className="training-evidence" aria-label="Research evidence">
              <div>
                <strong>26.1%</strong>
                <span>of 31,132 studied skills had a pattern warranting review</span>
              </div>
              <div>
                <strong>5.2%</strong>
                <span>showed high-severity patterns suggesting malicious intent</span>
              </div>
              <div>
                <strong>2.12×</strong>
                <span>higher odds of findings when a skill included scripts</span>
              </div>
            </div>
            <p className="guide-source-note">
              These are research screening results, not a claim that every
              flagged skill was malware. The study reports an aggregate 86.7%
              precision and 82.5% recall for its detection framework.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">02</p>
          <div>
            <h2>Use a three-stage decision path</h2>
            <ol className="training-pipeline">
              <li>
                <span>Deterministic screen</span>
                <strong>Static analysis</strong>
                <p>
                  Find recognizable strings, dangerous APIs, data flows,
                  dependency risks, YARA signatures, and MCP permission issues.
                </p>
              </li>
              <li>
                <span>Contextual review</span>
                <strong>LLM semantic analysis</strong>
                <p>
                  Compare the claimed purpose with instructions and code; look
                  for paraphrased attacks, vague triggers, and subtle policy gaps.
                </p>
              </li>
              <li>
                <span>Accountable gate</span>
                <strong>Human and policy decision</strong>
                <p>
                  Verify provenance, permissions, destinations, source lines,
                  accepted exceptions, integrity, and runtime controls.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">03</p>
          <div>
            <h2>What the preliminary pass does well</h2>
            <p>
              Static analysis is fast, deterministic, and suitable for an early
              repository review because it can run without sending the skill to
              an external model. NVIDIA documents 68 patterns across 17
              categories in the current scanner.
            </p>
            <ul className="guide-checklist">
              <li><strong>Instruction risks:</strong> prompt injection, hidden instructions, trigger abuse, excessive agency, and unsafe output handling.</li>
              <li><strong>Code risks:</strong> dangerous calls, tainted flows from sensitive sources to risky sinks, and malware-oriented YARA signatures.</li>
              <li><strong>Supply-chain risks:</strong> vulnerable or unpinned dependencies, remote code retrieval, and suspicious packaging.</li>
              <li><strong>Tool risks:</strong> MCP least-privilege gaps, tool poisoning, and declared-permission mismatch.</li>
            </ul>
            <div className="guide-callout">
              <strong>Why it is preliminary</strong>
              <p>
                Literal rules can mistake a quoted attack example for an active
                instruction, and a novel paraphrase may avoid known signatures.
                Static output should prioritize the next inspection, not end it.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">04</p>
          <div>
            <h2>What an additional LLM can assess</h2>
            <p>
              The semantic stage reasons about meaning across files. It can ask
              whether the description agrees with the behavior, whether access
              fits the purpose, whether warnings are adequate, and whether
              apparently harmless language gradually steers the agent toward an
              unsafe outcome.
            </p>
            <div className="training-comparison">
              <div>
                <h3>Semantic strengths</h3>
                <ul>
                  <li>Paraphrased or indirect prompt injection</li>
                  <li>Description–behavior mismatch</li>
                  <li>Underdeclared capability or broad permissions</li>
                  <li>Vague triggers and missing warnings</li>
                  <li>Contextual explanations and remediation</li>
                </ul>
              </div>
              <div>
                <h3>Semantic limits</h3>
                <ul>
                  <li>Model output can vary across runs and providers</li>
                  <li>The model can misunderstand legitimate security content</li>
                  <li>Repository text may be adversarial model input</li>
                  <li>The analysis does not execute every runtime path</li>
                  <li>External model use creates data-governance questions</li>
                </ul>
              </div>
            </div>
            <p>
              Use an enterprise-approved provider and data-handling boundary.
              Treat the model&apos;s intent assessment as supporting evidence—not a
              factual claim about the author.
            </p>
          </div>
        </section>

        <section className="guide-section" id="runbook">
          <p className="guide-section-number">05</p>
          <div>
            <h2>Run the exact artifact in two passes</h2>
            <p>
              A mutable default branch can change after review. For a final
              decision, record the intended commit, check it out locally, and
              scan the precise skill directory or release artifact.
            </p>
            <div className="guide-command" aria-label="Static scan command">
              <span>Pass 1 · static-only JSON report</span>
              <code>
                skillspector scan ./checked-out-skill --no-llm --format json
                --output preliminary-static.json
              </code>
            </div>
            <div className="guide-command" aria-label="Semantic scan command">
              <span>Pass 2 · approved LLM provider configured</span>
              <code>
                skillspector scan ./checked-out-skill --format json --output
                semantic-review.json
              </code>
            </div>
            <p>
              Current NVIDIA installation guidance also supports a global,
              CLI-only install with <code>uv tool install</code>. Check the
              release page before training or production use; scanner rules and
              semantic resilience change over time.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">06</p>
          <div>
            <h2>Read completeness before the score</h2>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr><th>Output field</th><th>Question for the reviewer</th></tr>
                </thead>
                <tbody>
                  <tr><td>Scanner version</td><td>Which code and rule set produced this evidence?</td></tr>
                  <tr><td>LLM requested / available</td><td>Was semantic analysis intended, and could it run?</td></tr>
                  <tr><td>Meta-analysis / degraded status</td><td>Did contextual review apply or fail closed?</td></tr>
                  <tr><td>Coverage and limitations</td><td>Were all discovered components actually analyzed?</td></tr>
                  <tr><td>Suppressions</td><td>What was removed from scoring, by whom, and why?</td></tr>
                  <tr><td>Finding location and confidence</td><td>What source line supports the finding, and how certain is the detector?</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Finding confidence affects prioritization; it is not the
              confidence of the whole scan. A tag such as <code>llm-unconfirmed</code>{" "}
              means a severe static finding was retained even though the model
              did not validate it.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">07</p>
          <div>
            <h2>Interpret the score as triage</h2>
            <div className="risk-bands" aria-label="SkillSpector risk bands">
              <div className="risk-low"><strong>0–20</strong><span>Low · Safe</span><p>Continue provenance, permission, and code review.</p></div>
              <div className="risk-medium"><strong>21–50</strong><span>Medium · Caution</span><p>Require a named reviewer before installation.</p></div>
              <div className="risk-high"><strong>51–80</strong><span>High · Do not install</span><p>Block until fixed or formally accepted.</p></div>
              <div className="risk-critical"><strong>81–100</strong><span>Critical · Do not install</span><p>Block and escalate to security.</p></div>
            </div>
            <p>
              The score is not a probability that the skill is malicious and it
              is not a percentage-safe value. Parse the report: a process exit
              code of zero can still contain a medium/caution result.
            </p>
          </div>
        </section>

        <section className="guide-section guide-conclusion">
          <p className="guide-section-number">08</p>
          <div>
            <h2>Make the enterprise decision explicit</h2>
            <ul className="guide-checklist">
              <li>Block any critical or high finding unless it is remediated or formally risk-accepted.</li>
              <li>Require human disposition for medium, degraded, incomplete, or suppressed results.</li>
              <li>Review scripts, network use, credential access, subprocesses, and destructive actions even when the aggregate score is low.</li>
              <li>Pair scanning with provenance, signing, least privilege, sandboxing, egress control, secret isolation, and monitoring.</li>
              <li>Re-scan when the skill, dependency set, scanner, model, or policy changes.</li>
            </ul>
            <p className="guide-final">
              Scan to decide what deserves attention. Use people and policy to
              decide what earns trust.
            </p>
          </div>
        </section>

        <section className="guide-sources" aria-labelledby="guide-sources-heading">
          <h2 id="guide-sources-heading">Presentation and training sources</h2>
          <ul>
            <li><a href="https://docs.nvidia.com/skills/scanning-agent-skills">NVIDIA: Scan Agent Skills Before Installation</a></li>
            <li><a href="https://github.com/NVIDIA/SkillSpector">NVIDIA SkillSpector source repository</a></li>
            <li><a href="https://github.com/NVIDIA/SkillSpector/releases">NVIDIA SkillSpector releases</a></li>
            <li><a href="https://docs.nvidia.com/skills/agent-skill-trust-pipeline">NVIDIA: A Trust Pipeline for Agent Skills</a></li>
            <li><a href="https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/">NVIDIA: capability governance for AI-agent skills</a></li>
            <li><a href="https://arxiv.org/abs/2601.10338">Agent Skills in the Wild: empirical security study</a></li>
            <li><a href="https://owasp.org/www-community/attacks/PromptInjection">OWASP: Prompt Injection</a></li>
            <li><a href="https://www.nist.gov/itl/ai-risk-management-framework">NIST AI Risk Management Framework</a></li>
          </ul>
        </section>

        <a className="guide-back" href={`${basePath}/#library`}>
          ← Back to the resource library
        </a>
      </article>
    </main>
  );
}
