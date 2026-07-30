import type { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "So you found a skill: pre-install checklist | Agent Skills Resource Library",
  description:
    "A source-backed checklist for reviewing a skill's provenance, behavior, dependencies, permissions, reliability, and update path before installation.",
};

const sourceChecks = [
  {
    title: "Host and installer documentation",
    body: "Confirm install location, visibility, precedence, sandboxing, permissions, secret handling, install hooks, update behavior, and rollback from the current primary documentation.",
  },
  {
    title: "Registry listing and security details",
    body: "Check publisher identity, ownership changes, versions, changelogs, moderation, user reports, and the exact version and date covered by every scan result.",
  },
  {
    title: "Original source repository",
    body: "Follow the registry provenance link. Compare owners, tags or commits, contents, and hashes; then inspect maintenance, security issues, license, and release history.",
  },
  {
    title: "Complete skill package",
    body: "Read SKILL.md and every referenced file, script, configuration, active asset, hook, and nested archive. Inventory commands, files, tools, credentials, downloads, and network destinations.",
  },
  {
    title: "Dependencies and artifacts",
    body: "Resolve direct and transitive dependencies, check official registries and advisories, verify downloaded binaries, and flag unversioned or runtime-fetched code and instructions.",
  },
  {
    title: "Independent security analysis",
    body: "Scan the exact staged version with a reputable skill scanner. For higher-risk skills, use different scanner approaches and reconcile their findings rather than trusting a score.",
  },
  {
    title: "Primary product and API documentation",
    body: "Verify each claimed command, permission, and workflow with the providers the skill controls. Reject broader access or infrastructure that the actual task does not need.",
  },
  {
    title: "Organizational evidence",
    body: "Check internal policy, approved endpoints, data classification, prior reviews, and required approvals. Name an owner for updates, incidents, re-review, and removal.",
  },
];

const confidenceGates = [
  "The purpose is recurring and useful enough to justify another trust boundary.",
  "Publisher, source, artifact, version, and hashes form a consistent provenance chain.",
  "Files, tools, network access, credentials, and scopes follow least privilege.",
  "Data destinations, retention, logging, and telemetry are understood and acceptable.",
  "Actual instructions, scripts, dependencies, and network behavior match the listing.",
  "Failure, retries, cancellation, and malformed input do not create broader actions or data loss.",
  "Compatibility and observable tests cover the intended host, runtime, operating system, and scope.",
  "Independent scans and human review are resolved for the exact approved version.",
];

export default function SkillConfidenceChecklist() {
  return (
    <main className="guide-page">
      <header className="guide-header">
        <a className="wordmark" href={`${basePath}/`} aria-label="Back to the library">
          <span className="wordmark-mark" aria-hidden="true">
            AS
          </span>
          <span>Agent Skills Library</span>
        </a>
        <a className="header-link" href={`${basePath}/#library`}>
          Browse resources
        </a>
      </header>

      <article className="guide-article">
        <div className="guide-hero">
          <p className="eyebrow">Security · Pre-install checklist</p>
          <h1>So you found a skill.</h1>
          <p className="guide-deck">
            Before you install it, build confidence from independent evidence:
            provenance, complete contents, permissions, dependencies, security
            signals, reliability, and the path future updates will take.
          </p>
          <div className="guide-hero-actions">
            <a
              href={`${basePath}/guides/so-you-found-a-skill_checklist.md`}
              download="so-you-found-a-skill_checklist.md"
            >
              Download the Markdown checklist ↓
            </a>
          </div>
          <p className="guide-meta">Last reviewed July 29, 2026</p>
        </div>

        <section className="guide-section guide-principle">
          <p className="guide-section-number">01</p>
          <div>
            <h2>Treat the candidate as untrusted</h2>
            <p>
              Review it in a read-only, isolated workspace. Do not run its
              scripts, install its dependencies, follow its own audit
              instructions, open shortened links, or provide secrets.
            </p>
            <div className="guide-callout">
              <strong>Stop condition</strong>
              <p>
                If you cannot inspect the complete versioned package before
                installation, do not install it.
              </p>
            </div>
            <p>
              Record the exact name, owner, registry, source URL, version or
              commit, release date, and hash first. Evidence only applies to the
              artifact it actually examined.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">02</p>
          <div>
            <h2>Check these sources, in order</h2>
            <ul className="guide-checklist">
              {sourceChecks.map((check) => (
                <li key={check.title}>
                  <strong>{check.title}:</strong> {check.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">03</p>
          <div>
            <h2>Pass security and reliability gates</h2>
            <p>
              A listing badge, install count, official-looking name, or clean
              scanner result is one signal—not a certificate.
            </p>
            <ul className="guide-checklist">
              {confidenceGates.map((gate) => (
                <li key={gate}>{gate}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="guide-section">
          <p className="guide-section-number">04</p>
          <div>
            <h2>Will it update automatically?</h2>
            <p>
              Verify every update layer. Read the host and installer docs;
              identify whether this is a managed marketplace install, registry
              install, Git source, or copied folder; inspect origin records,
              lockfiles, versions, hashes, channels, and pin state; then search
              scheduled tasks, CI, startup hooks, and agent instructions for
              update commands.
            </p>
            <p>
              Also check runtime fetches. A skill can remain unchanged on disk
              while downloading new instructions or code whenever it runs.
            </p>
            <div className="guide-callout">
              <strong>Classify the result</strong>
              <p>
                Automatic, command-triggered, pinned/locked, untracked/manual,
                dynamic at runtime, or unknown. Treat unknown as automatic until
                you can prove otherwise.
              </p>
            </div>
            <p>
              Current OpenClaw and ClawHub documentation describes explicit
              update commands and an origin record that lets later updates
              resolve through ClawHub. ClawHub also supports pinning. That is
              command-triggered unless a person, agent, startup hook, CI
              workflow, or scheduler runs the update command automatically.
            </p>
            <p>
              Before every update, diff the complete old and new packages,
              permissions, dependencies, and destinations; re-run review and
              scans; and preserve the approved artifact and rollback path.
            </p>
          </div>
        </section>

        <section className="guide-section guide-conclusion">
          <p className="guide-section-number">05</p>
          <div>
            <h2>Make an evidence-backed decision</h2>
            <p>
              Approve for a sandbox, approve an exact version with controls,
              rewrite the useful workflow internally, or reject it. Record the
              owner, approver, scope, evidence, open findings, update
              classification, pin or lock, rollback plan, and next review date.
            </p>
            <p className="guide-final">
              Confidence belongs to a specific artifact, scope, and moment—not
              to a skill name forever.
            </p>
          </div>
        </section>

        <section className="guide-sources" aria-labelledby="guide-sources-heading">
          <h2 id="guide-sources-heading">Primary references</h2>
          <ul>
            <li>
              <a href="https://agentskills.io/specification">
                Agent Skills specification and validation
              </a>
            </li>
            <li>
              <a href="https://docs.openclaw.ai/tools/skills">
                OpenClaw: installation, verification, updates, and security
              </a>
            </li>
            <li>
              <a href="https://github.com/openclaw/clawhub/blob/main/docs/quickstart.md">
                ClawHub quickstart
              </a>
            </li>
            <li>
              <a href="https://docs.nvidia.com/skills/scanning-agent-skills">
                NVIDIA: Scan Agent Skills Before Installation
              </a>
            </li>
            <li>
              <a href="https://github.com/cisco-ai-defense/skill-scanner">
                Cisco AI Defense: Skill Scanner
              </a>
            </li>
            <li>
              <a href="https://osv.dev/">OSV vulnerability database</a>
            </li>
          </ul>
        </section>

        <a className="guide-back" href={`${basePath}/#library`}>
          ← Back to the resource library
        </a>
      </article>
    </main>
  );
}

