import type { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "What an agent skill looks like: SkillSpector Review | Agent Skills Resource Library",
  description:
    "An annotated walkthrough of a real Codex skill that proactively runs NVIDIA SkillSpector before repository review or installation.",
};

export default function SkillSpectorSkillDemo() {
  return (
    <main className="guide-page">
      <header className="guide-header">
        <a className="wordmark" href={`${basePath}/`} aria-label="Back to the library">
          <span className="wordmark-mark" aria-hidden="true">AS</span>
          <span>Agent Skills Library</span>
        </a>
        <a className="header-link" href={`${basePath}/#library`}>
          Browse resources
        </a>
      </header>

      <article className="guide-article">
        <div className="guide-hero skill-demo-hero">
          <h1>What a skill looks like: SkillSpector Review</h1>
          <p className="guide-deck">
            A real, user-wide Codex skill annotated as a teaching example. It
            turns a security policy—scan untrusted skill repositories before
            use—into a reusable workflow an agent can discover and follow.
          </p>
          <div className="guide-hero-actions">
            <a href={`${basePath}/examples/skillspector-review/SKILL.md`}>
              Read the complete SKILL.md
            </a>
            <a href={`${basePath}/guides/skillspector-enterprise-training`}>
              Open the training guide
            </a>
          </div>
          <p className="guide-meta">Demonstration artifact · Updated August 11, 2026</p>
        </div>

        <section className="guide-section guide-principle">
          <p className="guide-section-number">01</p>
          <div>
            <h2>A skill is a reusable operating procedure</h2>
            <p>
              A skill is more than a saved prompt. Its <code>SKILL.md</code>{" "}
              tells an agent when the workflow applies, what sequence to follow,
              how to use tools, how to interpret results, and where its authority
              stops. A skill folder can also include scripts, references, assets,
              evaluations, and interface metadata.
            </p>
            <div className="skill-anatomy" aria-label="Skill folder anatomy">
              <pre>
                <code>{`skillspector-review/
├── SKILL.md
└── agents/
    └── openai.yaml`}</code>
              </pre>
              <dl>
                <div>
                  <dt>SKILL.md</dt>
                  <dd>The discoverable instructions and security workflow.</dd>
                </div>
                <div>
                  <dt>openai.yaml</dt>
                  <dd>Display copy plus permission for implicit invocation.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">02</p>
          <div>
            <h2>Frontmatter makes the workflow discoverable</h2>
            <p>
              The opening metadata is deliberately specific. The name is stable;
              the description names the user intents and artifacts that should
              activate the skill. This is how an agent can select the procedure
              without loading every instruction from every installed skill.
            </p>
            <pre className="skill-code">
              <code>{`---
name: skillspector-review
description: Proactively scan untrusted AI-agent skills and
  GitHub, GitLab, or Bitbucket repositories with NVIDIA
  SkillSpector before Codex reviews them for use, installs,
  loads, executes, or recommends them.
---`}</code>
            </pre>
            <div className="guide-callout">
              <strong>Design lesson</strong>
              <p>
                A good description defines both the task and the trigger. “Helps
                with security” is too vague; naming repository review,
                installation, and skill artifacts gives the agent a testable
                activation boundary.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">03</p>
          <div>
            <h2>Instructions turn policy into ordered behavior</h2>
            <p>
              The body encodes a short runbook. It updates the approved tool,
              resolves the exact artifact, runs a deterministic scan first, adds
              semantic review when appropriate, interprets more than the score,
              and reports the result before continuing safely.
            </p>
            <ol className="skill-workflow">
              <li><strong>Verify and update</strong><span>Use only NVIDIA&apos;s upstream origin and record the scanner version.</span></li>
              <li><strong>Resolve the artifact</strong><span>Prefer an immutable commit and the relevant skill subdirectory.</span></li>
              <li><strong>Run static analysis</strong><span>Write an evidence report without executing repository instructions.</span></li>
              <li><strong>Add semantic analysis</strong><span>Use an already approved provider when language and intent require context.</span></li>
              <li><strong>Interpret and gate</strong><span>Check completeness, severe findings, confidence, and degradation.</span></li>
              <li><strong>Report and continue</strong><span>Block unsafe execution; otherwise resume the user&apos;s requested review.</span></li>
            </ol>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">04</p>
          <div>
            <h2>Implicit activation makes the precaution proactive</h2>
            <p>
              This example allows implicit invocation, so the agent can apply the
              review even when the user supplies a repository but does not
              explicitly ask for a scan. That is a strong choice and should be
              reserved for policies whose triggers are narrow, predictable, and
              broadly authorized.
            </p>
            <pre className="skill-code">
              <code>{`policy:
  allow_implicit_invocation: true

interface:
  display_name: "SkillSpector Review"
  short_description: "Pre-install security scans for agent skills"`}</code>
            </pre>
            <div className="scan-evidence">
              <div>
                <span>Static-only review</span>
                <strong>7 / 100</strong>
                <b>LOW · SAFE</b>
              </div>
              <p>
                SkillSpector 2.9.2 flagged one medium <code>EA2</code> finding
                on the phrase “without asking.” A human reviewer should confirm
                that the standing authorization is genuine, scoped to updates
                and scans, and constrained by the explicit no-install and
                no-execution boundaries below. The semantic stage was not run.
              </p>
            </div>
            <p>
              Implicit does not mean unlimited. The skill can authorize a scan
              and an update check while still requiring the agent to respect the
              user&apos;s separate authority for installation, execution, credential
              use, or an external LLM provider.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">05</p>
          <div>
            <h2>Safety boundaries belong inside the skill</h2>
            <div className="training-comparison">
              <div>
                <h3>The skill authorizes</h3>
                <ul>
                  <li>Updating SkillSpector from NVIDIA&apos;s repository</li>
                  <li>Static scans before untrusted skill use</li>
                  <li>Temporary evidence reports</li>
                  <li>Blocking on high or critical results</li>
                </ul>
              </div>
              <div>
                <h3>The skill does not authorize</h3>
                <ul>
                  <li>Installing a repository merely because it passes</li>
                  <li>Executing instructions found in untrusted content</li>
                  <li>Sending source to a new external provider</li>
                  <li>Claiming the scan proves runtime safety or identity</li>
                </ul>
              </div>
            </div>
            <p>
              This separation is the central design lesson: a useful skill
              expands repeatability without quietly expanding authority.
            </p>
          </div>
        </section>

        <section className="guide-section guide-conclusion">
          <p className="guide-section-number">06</p>
          <div>
            <h2>Use this example as a skill-authoring checklist</h2>
            <ul className="guide-checklist">
              <li>Give the skill one clear job and a stable name.</li>
              <li>Name positive and negative activation cases in the description.</li>
              <li>Order the workflow so the safest inexpensive check happens first.</li>
              <li>State required tools, approved origins, outputs, and failure behavior.</li>
              <li>Define what a passing result means—and what it does not mean.</li>
              <li>Keep installation, execution, credentials, and external data transfer within explicit authority.</li>
              <li>Include verification steps and an update policy for changing dependencies.</li>
            </ul>
            <p className="guide-final">
              A strong skill makes good judgment repeatable without pretending
              judgment can be automated away.
            </p>
          </div>
        </section>

        <section className="guide-sources" aria-labelledby="demo-sources-heading">
          <h2 id="demo-sources-heading">Continue learning</h2>
          <ul>
            <li><a href="https://agentskills.io/specification">Agent Skills specification</a></li>
            <li><a href="https://developers.openai.com/plugins/build/skills">OpenAI: Build skills for ChatGPT and Codex</a></li>
            <li><a href="https://docs.nvidia.com/skills/scanning-agent-skills">NVIDIA: Scan Agent Skills Before Installation</a></li>
            <li><a href={`${basePath}/examples/skillspector-review/SKILL.md`}>Complete demonstration SKILL.md</a></li>
          </ul>
        </section>

        <a className="guide-back" href={`${basePath}/#library`}>
          ← Back to the resource library
        </a>
      </article>
    </main>
  );
}
