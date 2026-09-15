import type { Metadata } from "next";
import { SiteHeader } from "../../site-header";
import { GuideReadingLayout } from "../guide-reading-layout";
import { GuideResourceLink } from "../guide-resource-link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const artifactRoot = `${basePath}/examples/vercel-skills-sh-security-check`;
const downloadPath = `${basePath}/downloads/vercel-skills-sh-security-check.zip`;
const contents = [
  { id: "three-audit-trails", label: "Collect three audit trails" },
  { id: "resolve-the-input", label: "Start with any useful identifier" },
  { id: "read-the-result", label: "Keep uncertainty visible" },
  { id: "download-and-run", label: "Download, inspect, and run" },
  { id: "limits", label: "Know what this check cannot prove" },
];

export const metadata: Metadata = {
  title: "skills.sh Security Check | Agent Skills Resource Library",
  description:
    "Download a Codex skill that collects current Gen Agent Trust Hub, Socket, and Snyk audit evidence from skills.sh before third-party skill use.",
};

export default function VercelSkillsShSecurityCheckGuide() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero skill-demo-hero">
          <h1>Check a skill&apos;s published security audits</h1>
          <p className="guide-deck">
            A small Codex skill that finds a third-party skill on Vercel&apos;s
            skills.sh, opens the three primary audit reports, and preserves
            missing, stale, or conflicting evidence instead of flattening it
            into a false “safe” result.
          </p>
          <div className="guide-hero-actions">
            <a href={`${artifactRoot}/SKILL.md`}>View SKILL.md</a>
            <a
              className="guide-hero-download"
              download="vercel-skills-sh-security-check.zip"
              href={downloadPath}
            >
              Download ZIP ↓
            </a>
          </div>
          <p className="guide-meta">
            Downloadable Codex skill · Network read · Verified September 15, 2026
          </p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/vercel-skills-sh-security-check`}
        >
          <section className="guide-section guide-principle" id="three-audit-trails">
            <p className="guide-section-number">CHECK</p>
            <div>
              <h2>One lookup, three audit trails</h2>
              <p>
                The skill reads the canonical listing and the detailed child
                pages for Gen Agent Trust Hub, Socket, and Snyk. It captures the
                verdict, risk level, findings, affected paths, and audit time
                from each provider—not only the badges on the listing page.
              </p>
              <div className="scan-evidence" aria-label="skills.sh audit sources">
                <div>
                  <span>Registry evidence</span>
                  <strong>3</strong>
                  <b>Independent views</b>
                </div>
                <p>
                  Gen Agent Trust Hub reviews agent behavior and instruction
                  risks. Socket focuses on supply-chain signals. Snyk reports
                  security issues and risk categories. Disagreement is useful
                  evidence and remains visible in the final report.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="resolve-the-input">
            <p className="guide-section-number">INPUT</p>
            <div>
              <h2>Start with any useful identifier</h2>
              <div className="training-comparison">
                <div>
                  <h3>Direct skills.sh URL</h3>
                  <ul>
                    <li>Accepts a listing or nested security-audit URL.</li>
                    <li>Normalizes it to owner, repository, and skill slug.</li>
                    <li>Fetches the listing plus all three detail pages concurrently.</li>
                  </ul>
                </div>
                <div>
                  <h3>New or unlisted skill</h3>
                  <ul>
                    <li>Uses a GitHub URL, local Git remote, or exact skill name.</li>
                    <li>Searches for an exact publisher, repository, and slug match.</li>
                    <li>Returns not found, pending, partial, or ambiguous—not “pass.”</li>
                  </ul>
                </div>
              </div>
              <div className="guide-callout">
                <strong>No install-to-test shortcut</strong>
                <p>
                  The workflow never installs an untrusted skill merely to
                  trigger a registry audit. Installation remains a separate,
                  explicitly authorized decision.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="read-the-result">
            <p className="guide-section-number">READ</p>
            <div>
              <h2>Keep uncertainty visible</h2>
              <ol className="skill-workflow">
                <li>
                  <strong>Resolve identity</strong>
                  <span>Record the canonical skills.sh ID and the exact artifact or commit under review.</span>
                </li>
                <li>
                  <strong>Collect details</strong>
                  <span>Read every provider page and retain findings, timestamps, and missing coverage.</span>
                </li>
                <li>
                  <strong>Check freshness</strong>
                  <span>Flag audit dates that predate the target change or cannot be tied to its snapshot.</span>
                </li>
                <li>
                  <strong>Reconcile locally</strong>
                  <span>Compare registry evidence with SkillSpector and manual review of the exact artifact.</span>
                </li>
              </ol>
              <p>
                A fail, high, or critical result blocks use pending review. A
                warning requires manual inspection. Missing or stale evidence is
                incomplete coverage. Even three passes do not prove runtime
                safety.
              </p>
            </div>
          </section>

          <section className="guide-section" id="download-and-run">
            <p className="guide-section-number">USE</p>
            <div>
              <h2>Download, inspect, and run</h2>
              <div className="skill-anatomy" aria-label="Downloadable skill folder anatomy">
                <pre>
                  <code>{`vercel-skills-sh-security-check/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── scripts/
    └── check_skills_sh_security.py`}</code>
                </pre>
                <dl>
                  <div>
                    <dt>Guide</dt>
                    <dd>Identity resolution, collection rules, interpretation, and safety boundaries.</dd>
                  </div>
                  <div>
                    <dt>Helper</dt>
                    <dd>Standard-library Python that fetches the listing and three audit pages concurrently.</dd>
                  </div>
                </dl>
              </div>
              <div className="guide-command">
                <span>Direct URL or owner/repo/skill</span>
                <code>
                  python3 scripts/check_skills_sh_security.py
                  {" "}https://skills.sh/graphify-labs/graphify/graphify
                </code>
              </div>
              <div className="guide-command">
                <span>GitHub repository</span>
                <code>
                  python3 scripts/check_skills_sh_security.py
                  {" "}https://github.com/graphify-labs/graphify --skill graphify
                </code>
              </div>
              <div className="guide-checklist-download">
                <div>
                  <h3>Take the complete skill</h3>
                  <p>
                    Download the ZIP for installation, or inspect each source
                    file in the browser before adding it to an agent.
                  </p>
                </div>
                <a download="vercel-skills-sh-security-check.zip" href={downloadPath}>
                  Download skill ZIP ↓
                </a>
              </div>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="limits">
            <p className="guide-section-number">LIMITS</p>
            <div>
              <h2>Registry evidence is a lead, not a certificate</h2>
              <p>
                The result reflects third-party audits of a skills.sh snapshot.
                It does not verify publisher identity, prove that the downloaded
                files match that snapshot, resolve future dependencies, or test
                runtime behavior. Use it in parallel with an exact-artifact scan
                and human review.
              </p>
              <ul className="guide-checklist">
                <li><GuideResourceLink href={`${artifactRoot}/SKILL.md`}>View SKILL.md</GuideResourceLink></li>
                <li><GuideResourceLink href={`${artifactRoot}/scripts/check_skills_sh_security.py`}>View the Python helper</GuideResourceLink></li>
                <li><GuideResourceLink href={`${artifactRoot}/agents/openai.yaml`}>View Codex interface metadata</GuideResourceLink></li>
              </ul>
            </div>
          </section>

          <section className="guide-sources" aria-labelledby="security-check-sources">
            <h2 id="security-check-sources">Primary references</h2>
            <ul>
              <li><GuideResourceLink href="https://skills.sh/docs/api">skills.sh API reference</GuideResourceLink></li>
              <li><GuideResourceLink href="https://skills.sh/audits">skills.sh security audits</GuideResourceLink></li>
              <li><GuideResourceLink href="https://www.skills.sh/graphify-labs/graphify/graphify">Example skill listing</GuideResourceLink></li>
              <li><GuideResourceLink href={`${artifactRoot}/SKILL.md`}>Complete distributable SKILL.md</GuideResourceLink></li>
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
