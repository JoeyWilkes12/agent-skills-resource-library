import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = `${basePath}/guides/obra-superpowers-skillspector-review`;
const commit = "b36e0829c6d0140e93cfef2ca599b1b07d4a7797";
const auditRoot = `${basePath}/data/security-reviews/obra-superpowers/${commit}`;
const threadUrl = "https://chatgpt.com/share/6a4eb190-86ac-83e8-a559-42ded97f6828";

const contents = [
  { id: "overview-map", label: "The fourteen-skill map" },
  { id: "categories", label: "What each category does" },
  { id: "scan-at-a-glance", label: "Static scan at a glance" },
  { id: "per-skill-results", label: "Per-skill results and JSON" },
  { id: "read-the-findings", label: "How to read the findings" },
  { id: "archived-thread", label: "Archived ChatGPT thread" },
  { id: "sources", label: "Sources and audit files" },
];

const categories = [
  {
    name: "Testing",
    description: "Build a red-green-refactor loop into process documentation.",
    skills: ["test-driven-development"],
  },
  {
    name: "Debugging",
    description: "Find root causes, then verify that the fix is real.",
    skills: ["systematic-debugging", "verification-before-completion"],
  },
  {
    name: "Collaboration",
    description: "Move from idea to plan, parallel execution, review, and branch finish.",
    skills: [
      "brainstorming",
      "writing-plans",
      "executing-plans",
      "dispatching-parallel-agents",
      "requesting-code-review",
      "receiving-code-review",
      "using-git-worktrees",
      "finishing-a-development-branch",
      "subagent-driven-development",
    ],
  },
  {
    name: "Meta",
    description: "Explain the skill system and teach people how to author it.",
    skills: ["writing-skills", "using-superpowers"],
  },
];

const results = [
  ["brainstorming", "Collaboration", 80, "HIGH", "DO_NOT_INSTALL", 10],
  ["dispatching-parallel-agents", "Collaboration", 0, "LOW", "CAUTION", 0],
  ["executing-plans", "Collaboration", 8, "LOW", "CAUTION", 1],
  ["finishing-a-development-branch", "Collaboration", 17, "LOW", "CAUTION", 1],
  ["receiving-code-review", "Collaboration", 0, "LOW", "CAUTION", 0],
  ["requesting-code-review", "Collaboration", 7, "LOW", "CAUTION", 1],
  ["subagent-driven-development", "Collaboration", 23, "MEDIUM", "CAUTION", 2],
  ["systematic-debugging", "Debugging", 52, "HIGH", "DO_NOT_INSTALL", 4],
  ["test-driven-development", "Testing", 0, "LOW", "CAUTION", 0],
  ["using-git-worktrees", "Collaboration", 11, "LOW", "CAUTION", 2],
  ["using-superpowers", "Meta", 49, "MEDIUM", "CAUTION", 4],
  ["verification-before-completion", "Debugging", 7, "LOW", "CAUTION", 1],
  ["writing-plans", "Collaboration", 0, "LOW", "CAUTION", 0],
  ["writing-skills", "Meta", 89, "CRITICAL", "DO_NOT_INSTALL", 20],
] as const;

const threadRatings = [
  ["brainstorming", "High", "High", "Use for vague feature ideas before coding."],
  ["systematic-debugging", "High", "High", "Use for bugs where the cause is unknown."],
  ["verification-before-completion", "High", "High", "Use almost always; low ceremony and high value."],
  ["using-git-worktrees", "High", "High, especially Codex app", "Use for risky changes or parallel tasks."],
  ["test-driven-development", "High", "Medium-high", "Use when tests are cheap and meaningful."],
  ["writing-plans", "Medium-high", "Medium", "Use for multi-file work; avoid for small edits."],
  ["subagent-driven-development", "High but expensive", "Medium-high but more explicit", "Use for complex work; expect token/runtime overhead."],
  ["requesting-code-review", "High", "High", "Use before merging or after broad changes."],
  ["writing-skills", "High for skill authors", "High for skill authors", "Useful for building reusable workflows."],
];

export const metadata: Metadata = {
  title: "Obra Superpowers: 14 skills and a SkillSpector review | Agent Skills Resource Library",
  description:
    "A commit-pinned visual map and per-skill static SkillSpector review of Obra's 14-skill Superpowers library, with an archived ChatGPT research thread.",
  openGraph: {
    title: "Obra Superpowers: 14 skills and a SkillSpector review",
    description:
      "The four-category map, per-skill JSON findings, and archived research behind the review.",
    images: [`${basePath}/images/obra-superpowers-skills-overview-dark.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Obra Superpowers: 14 skills and a SkillSpector review",
    description:
      "The four-category map, per-skill JSON findings, and archived research behind the review.",
    images: [`${basePath}/images/obra-superpowers-skills-overview-dark.jpg`],
  },
};

function reportUrl(skill: string) {
  return `${auditRoot}/static/${skill}.json`;
}

export default function ObraSuperpowersSkillSpectorReview() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero training-hero">
          <p className="eyebrow">Case study · Open-source skill library</p>
          <h1>Obra Superpowers: fourteen skills, one disciplined workflow.</h1>
          <p className="guide-deck">
            A visual map of the library, a commit-pinned SkillSpector pass for
            every skill, downloadable JSON evidence, and the archived research
            thread that started the review.
          </p>
          <div className="guide-hero-actions">
            <a href="https://github.com/obra/superpowers" rel="noreferrer" target="_blank">
              Open the source repository <span aria-hidden="true">↗</span>
            </a>
            <a href={`${auditRoot}/index.json`}>Download audit index</a>
            <a className="guide-hero-download" href={threadUrl} rel="noreferrer" target="_blank">
              Open the shared thread <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="guide-meta">
            Reviewed August 28, 2026 · SkillSpector 2.10.0 · static-only · commit {commit.slice(0, 12)}
          </p>
        </div>

        <GuideReadingLayout contents={contents} path={path}>
          <section className="guide-section guide-principle" id="overview-map">
            <p className="guide-section-number">01</p>
            <div>
              <p className="guide-label">At a glance</p>
              <h2>14 skills as a framework for software development</h2>
              <p>
                The repository’s <code>skills/</code> directory contains 14
                subdirectories with a <code>SKILL.md</code>. The README’s
                “What&apos;s Inside” section names the same set. The map below
                shows how those skills divide across four jobs: testing,
                debugging, collaboration, and meta-work.
              </p>
              <figure className="spectrum-visual">
                <div className="superpowers-theme-image superpowers-theme-image-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="A four-panel map of the 14 Obra Superpowers skills grouped into Testing, Debugging, Collaboration, and Meta"
                    className="spectrum-image"
                    src={`${basePath}/images/obra-superpowers-skills-overview-light.jpg`}
                  />
                </div>
                <div className="superpowers-theme-image superpowers-theme-image-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="A four-panel map of the 14 Obra Superpowers skills grouped into Testing, Debugging, Collaboration, and Meta"
                    className="spectrum-image"
                    src={`${basePath}/images/obra-superpowers-skills-overview-dark.jpg`}
                  />
                </div>
                <figcaption>
                  The 14-skill map. Collaboration is the largest category, with
                  nine skills spanning the development workflow.
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="guide-section" id="categories">
            <p className="guide-section-number">02</p>
            <div>
              <h2>Four categories, four kinds of leverage</h2>
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">What it contributes</th>
                      <th scope="col">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.name}>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>
                          {category.skills.map((skill) => (
                            <div key={skill}><code>{skill}</code></div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="guide-source-note">
                These categories follow the repository README’s organization;
                they are descriptive groupings, not scanner risk categories.
              </p>
            </div>
          </section>

          <section className="guide-section" id="scan-at-a-glance">
            <p className="guide-section-number">03</p>
            <div>
              <p className="guide-label">Pre-install screen</p>
              <h2>Static analysis surfaced leads, not a verdict.</h2>
              <p>
                Each skill directory was scanned separately with NVIDIA
                SkillSpector 2.10.0 in static-only mode. The reports contain 46
                findings across the 14 skills. Three skills reached the
                scanner&apos;s high or critical bands; all 14 reports are retained
                below as JSON.
              </p>
              <div className="scan-evidence" aria-label="SkillSpector scan summary">
                <div><strong>14</strong><span>skill directories scanned</span><p>One report per <code>SKILL.md</code> directory.</p></div>
                <div><strong>46</strong><span>static findings</span><p>Across prompt, tool, privilege, agent, and data-flow categories.</p></div>
                <div><strong>3</strong><span>high or critical scores</span><p><code>brainstorming</code>, <code>systematic-debugging</code>, and <code>writing-skills</code>.</p></div>
              </div>
              <div className="guide-callout">
                <strong>Read the boundary</strong>
                <p>
                  This was a preliminary static screen. Semantic LLM analysis
                  was not run, and the reports are marked partial because some
                  local path-like references could not be resolved
                  unambiguously. A passing or low score does not prove identity,
                  runtime safety, dependency safety, or absence of vulnerabilities.
                </p>
              </div>
              <p>
                The companion OWASP high-signal regex triage found no matches for
                direct “ignore previous instructions,” developer-mode, system
                override, prompt-leakage, API-key, or numbered-instruction
                patterns. OWASP treats those expressions as leads, not clearance;
                indirect, encoded, persistent, and tool-mediated attacks still
                need human review.
              </p>
            </div>
          </section>

          <section className="guide-section" id="per-skill-results">
            <p className="guide-section-number">04</p>
            <div>
              <h2>Per-skill results, with the JSON beside them</h2>
              <p>
                Scores below reproduce the machine-readable results from the
                exact commit. Use the JSON link for finding IDs, locations,
                explanations, confidence values, analyzer status, and
                completeness details.
              </p>
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Skill</th>
                      <th scope="col">Category</th>
                      <th scope="col">Score</th>
                      <th scope="col">Severity</th>
                      <th scope="col">Issues</th>
                      <th scope="col">JSON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(([skill, category, score, severity, recommendation, issues]) => (
                      <tr key={skill}>
                        <td><code>{skill}</code></td>
                        <td>{category}</td>
                        <td>{score}</td>
                        <td>{severity}<br /><small>{recommendation}</small></td>
                        <td>{issues}</td>
                        <td><a href={reportUrl(skill)}>View report ↗</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="guide-source-note">
                The scanner’s low-score output still recommends CAUTION for this
                static-only run. That conservative label is preserved exactly;
                it is not rewritten as “safe.”
              </p>
            </div>
          </section>

          <section className="guide-section" id="read-the-findings">
            <p className="guide-section-number">05</p>
            <div>
              <p className="guide-label">Human context</p>
              <h2>What the high scores appeared to be seeing</h2>
              <p>
                The scanner correctly points a reviewer toward sensitive
                surfaces, but its patterns do not understand intent on their
                own. A first context pass found these useful distinctions:
              </p>
              <ul className="guide-checklist">
                <li><strong><code>brainstorming</code>:</strong> local companion-server lifecycle code uses background process management, state files, and a <code>sudo lsof</code> check; an HTML comment was ordinary branding. Those are legitimate development-server behaviors that still deserve explicit permission and persistence review.</li>
                <li><strong><code>systematic-debugging</code>:</strong> credential and keychain commands appear in debugging examples, while instrumentation examples show logging. They are documentation leads, not confirmed credential theft or exfiltration, but real credentials should never be copied into the workflow.</li>
                <li><strong><code>writing-skills</code>:</strong> the skill teaches authoring, editing, testing, and enumerating other skills and agent configuration directories. That explains much of its high score, but it also makes least privilege and trust boundaries important for any skill-authoring workflow.</li>
                <li><strong>The remaining findings:</strong> most are process instructions about autonomous execution, branch operations, human checkpoints, or review verdicts. Those can be useful capabilities while still requiring a human gate for destructive commands, pushes, credentials, and broad file access.</li>
              </ul>
              <div className="guide-callout">
                <strong>Adoption posture</strong>
                <p>
                  Do not install or execute the three high/critical-scoring
                  skills solely because this page includes their reports. Pair
                  the static evidence with provenance, source review, least
                  privilege, sandboxing, egress control, secret isolation,
                  semantic assessment, and a deliberate human decision.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="archived-thread">
            <p className="guide-section-number">06</p>
            <div>
              <p className="guide-label">Origin story</p>
              <h2>The research thread that started this review</h2>
              <p>
                This guide also preserves the visible contents of the
                user-originated shared ChatGPT thread that asked whether
                Superpowers had been evaluated, how effective it was, and
                whether it worked equally well in Codex and Claude.
              </p>
              <blockquote>
                As an AI engineer, review the Obra superpowers skills (see
                GitHub). Has anyone online does evaluation or reviews of these
                skills? How effective are they? Are they equally useful for
                Codex as well as Claude?
              </blockquote>
              <p>
                The archived response’s central conclusion was selective use:
                Superpowers is best understood as an agentic software-development
                operating procedure, with its strongest value in process
                discipline rather than proven model intelligence. It described
                Claude Code as the more native target, while treating Codex as a
                viable but more explicit environment for subagent-heavy workflows.
              </p>
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Workflow</th>
                      <th scope="col">Claude Code</th>
                      <th scope="col">Codex</th>
                      <th scope="col">Thread recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threadRatings.map(([skill, claude, codex, recommendation]) => (
                      <tr key={skill}>
                        <td><code>{skill}</code></td>
                        <td>{claude}</td>
                        <td>{codex}</td>
                        <td>{recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="guide-callout">
                <strong>Read the complete archived contents</strong>
                <p>
                  The full visible prompt and response—including its evidence
                  table, caveats, recommendations, and linked sources—is
                  preserved as a readable Markdown transcript. <a href={`${auditRoot}/shared-thread.md`}>Read the archived transcript</a> or <a href={threadUrl} rel="noreferrer" target="_blank">open the original share page ↗</a>.
                </p>
              </div>
              <p className="guide-source-note">
                The transcript is historical source material, not an independent
                benchmark or a replacement for the commit-pinned static review
                above. Product documentation and research claims can change.
              </p>
            </div>
          </section>

          <section className="guide-sources" id="sources" aria-labelledby="guide-sources-heading">
            <h2 id="guide-sources-heading">Sources and audit files</h2>
            <ul>
              <li><a href="https://github.com/obra/superpowers" rel="noreferrer" target="_blank">Obra Superpowers repository ↗</a></li>
              <li><a href={`https://github.com/obra/superpowers/commit/${commit}`} rel="noreferrer" target="_blank">Exact reviewed commit: {commit} ↗</a></li>
              <li><a href={`${auditRoot}/index.json`}>Machine-readable audit index</a></li>
              <li><a href={`${auditRoot}/owasp-regex-triage.json`}>OWASP regex triage record</a></li>
              <li><a href={`${auditRoot}/shared-thread.md`}>Archived shared-thread transcript</a></li>
              <li><a href="https://github.com/NVIDIA/SkillSpector" rel="noreferrer" target="_blank">NVIDIA SkillSpector ↗</a></li>
              <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html" rel="noreferrer" target="_blank">OWASP LLM Prompt Injection Prevention Cheat Sheet ↗</a></li>
              <li><a href="https://github.com/prime-radiant-inc/superpowers-evals/" rel="noreferrer" target="_blank">Superpowers behavioral eval harness ↗</a></li>
              <li><a href="https://arxiv.org/abs/2603.15401" rel="noreferrer" target="_blank">SWE-Skills-Bench ↗</a></li>
            </ul>
            <p className="guide-source-note">
              The raw reports are preliminary static evidence. SkillSpector does
              not prove publisher identity, artifact integrity, runtime safety,
              dependency resolution, or the absence of vulnerabilities.
            </p>
          </section>

          <a className="guide-back" href={`${basePath}/guides`}>
            ← Back to guides
          </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
