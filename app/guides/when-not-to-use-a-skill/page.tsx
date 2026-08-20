import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const contents = [
  { id: "trust-boundary", label: "Start with the trust boundary" },
  { id: "data-movement-and-cloud-api-access", label: "Data movement and cloud API access" },
  { id: "primary-documentation", label: "Primary documentation is often the safer shortcut" },
  { id: "quick-decision-test", label: "A quick decision test" },
  { id: "scan-then-judge", label: "Scan, then still make a judgment" },
  { id: "sources-and-further-reading", label: "Sources and further reading" },
];

export const metadata: Metadata = {
  title: "When not to use a skill | Agent Skills Resource Library",
  description:
    "A decision guide for choosing primary documentation or a governed internal workflow instead of a third-party agent skill.",
};

export default function WhenNotToUseASkill() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero">
          <p className="eyebrow">Security · Decision guide</p>
          <h1>When not to use a skill</h1>
          <p className="guide-deck">
            A skill is useful when it packages a repeatable, trusted workflow.
            It is not automatically safer or better than giving an agent the
            right primary documentation and a well-scoped request.
          </p>
          <p className="guide-meta">Last reviewed July 28, 2026</p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/when-not-to-use-a-skill`}
        >

        <section className="guide-section guide-principle" id="trust-boundary">
          <p className="guide-section-number">01</p>
          <div>
            <h2>Start with the trust boundary</h2>
            <p>
              Installing a third-party skill means trusting more than its prose.
              The instructions can direct an agent to run scripts, install
              dependencies, call services, read files, or move data. A polished
              description does not prove that those behaviors are necessary,
              current, or safe.
            </p>
            <p>
              Use a skill when the extra layer adds reviewed, repeatable value.
              Skip it when it mainly adds another party, another dependency, or
              broader access than the task requires.
            </p>
          </div>
        </section>

        <section className="guide-section" id="data-movement-and-cloud-api-access">
          <p className="guide-section-number">02</p>
          <div>
            <p className="guide-label">Case one</p>
            <h2>Data movement and cloud API access</h2>
            <p>
              A third-party skill that uploads, downloads, exports, or otherwise
              transfers data expands the trust boundary. Even when the behavior
              is described as a convenience, it may expose internal data,
              credentials, prompts, or outputs to an endpoint your organization
              has not approved.
            </p>
            <div className="guide-callout">
              <strong>Default decision</strong>
              <p>
                Do not adopt the skill until the destination, data fields,
                credentials, retention, logging, and failure behavior are
                understood and approved.
              </p>
            </div>
            <p>
              The same workflow can be appropriate as an internal skill built
              and maintained inside the enterprise. For example, an internal
              skill can standardize <strong>Agent-assisted requests</strong> to
              approved cloud APIs: it can constrain endpoints and parameters,
              use enterprise-managed authentication, apply least privilege,
              record activity, and require confirmation for consequential
              changes.
            </p>
            <p>
              “Internal” is not a free pass. It is valuable because ownership,
              review, credentials, access policy, monitoring, and incident
              response can all be placed under the same enterprise controls as
              the systems being accessed.
            </p>
          </div>
        </section>

        <section className="guide-section" id="primary-documentation">
          <p className="guide-section-number">03</p>
          <div>
            <p className="guide-label">Case two</p>
            <h2>Primary documentation is often the safer shortcut</h2>
            <p>
              For a product-specific question or a one-time implementation,
              point the agent to the provider&apos;s current documentation
              before installing a third-party skill. This reduces the chance
              that stale instructions or someone else&apos;s preferred
              architecture will be mistaken for a product requirement.
            </p>
            <p>
              While evaluating Replit, I found third-party skills that suggested
              CI integration. Replit&apos;s own documentation describes its
              native project, workflow, and publishing paths. Starting with that
              primary source makes it easier to distinguish a required Replit
              workflow from optional infrastructure a third party happens to
              prefer.
            </p>
            <div className="guide-callout">
              <strong>Default decision</strong>
              <p>
                If current provider documentation is enough for the agent to
                complete and verify the task, use the documentation. Create or
                install a skill only when a recurring workflow needs additional
                tested instructions, controls, or organization-specific context.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" id="quick-decision-test">
          <p className="guide-section-number">04</p>
          <div>
            <h2>A quick decision test</h2>
            <ul className="guide-checklist">
              <li>
                <strong>Repetition:</strong> Will this workflow recur often
                enough to justify maintaining a skill?
              </li>
              <li>
                <strong>Authority:</strong>{" "}
                Is the skill more authoritative than
                the provider&apos;s current documentation for this task?
              </li>
              <li>
                <strong>Access:</strong> Does it request files, credentials,
                network access, or permissions the task does not clearly need?
              </li>
              <li>
                <strong>Data:</strong> Can you name every destination and the
                exact data that may leave the environment?
              </li>
              <li>
                <strong>Verification:</strong> Are there observable checks that
                prove the workflow did the intended thing and nothing broader?
              </li>
              <li>
                <strong>Ownership:</strong> Who reviews updates, responds to
                findings, and removes the skill when it is no longer safe or
                useful?
              </li>
            </ul>
          </div>
        </section>

        <section className="guide-section guide-conclusion" id="scan-then-judge">
          <p className="guide-section-number">05</p>
          <div>
            <h2>Scan, then still make a judgment</h2>
            <p>
              Security scanners can surface prompt injection, exfiltration,
              dangerous code, permission mismatches, vulnerable dependencies,
              and description-behavior gaps. They are useful gates, not
              certificates. A clean scan does not establish that a skill is
              necessary, well designed, or suitable for your organization.
            </p>
            <p className="guide-final">
              The safest skill is sometimes the one you do not install.
            </p>
          </div>
        </section>

        <section
          className="guide-sources"
          id="sources-and-further-reading"
          aria-labelledby="guide-sources-heading"
        >
          <h2 id="guide-sources-heading">Sources and further reading</h2>
          <ul>
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
              <a href="https://docs.replit.com/features/agent/skills">
                Replit: Agent Skills
              </a>
            </li>
            <li>
              <a href="https://docs.replit.com/learn/projects-and-artifacts/replit-deployments">
                Replit: Publishing
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
