import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const contents = [
  { id: "bottom-line", label: "Pilot-capable, not ready for unattended self-evolution" },
  { id: "how-it-works", label: "A skill definition becomes trainable text" },
  { id: "developer-experience", label: "The package is easy; the evaluator is the project" },
  { id: "maturity", label: "Strong research velocity, limited operational history" },
  { id: "total-cost", label: "The license is free. The search loop is not." },
  { id: "fit-for-agentic-self-service", label: "The local foundation is useful, but the evaluation layer is missing" },
  { id: "security-boundary", label: "Freeze the authority boundary; optimize only the procedure" },
  { id: "adoption-decision", label: "Promote only measured value beyond cheaper edits" },
  { id: "primary-sources-and-review-notes", label: "Primary sources and review notes" },
];

const title =
  "Microsoft SkillOpt: third-party developer snapshot | Agent Skills Resource Library";
const description =
  "An independent developer review of Microsoft SkillOpt covering usability, maturity, total cost, security boundaries, and fit for agentic self-service skills.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default function MicrosoftSkillOptThirdPartySnapshot() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero training-hero">
          <p className="eyebrow">Independent review · Microsoft SkillOpt</p>
          <h1>SkillOpt: a developer snapshot</h1>
          <p className="guide-deck">
            A source-backed look at the framework&apos;s optimization loop,
            developer experience, maturity, total cost, and fit for a governed
            agentic self-service skill.
          </p>
          <div className="guide-hero-actions">
            <a href="https://microsoft.github.io/SkillOpt/">
              Open the official project ↗
            </a>
            <a href="https://github.com/microsoft/SkillOpt">
              Inspect the source ↗
            </a>
          </div>
          <p className="guide-meta">
            Third-party snapshot · Reviewed August 14, 2026 · Release 0.2.0
          </p>
        </div>

        <GuideReadingLayout
          contents={contents}
          path={`${basePath}/guides/microsoft-skillopt-third-party-snapshot`}
        >

        <section className="guide-section guide-principle" id="bottom-line">
          <p className="guide-section-number">01</p>
          <div>
            <p className="guide-label">Bottom line</p>
            <h2>Pilot-capable, not ready for unattended self-evolution</h2>
            <p>
              SkillOpt is substantially more developed than a paper-only
              prototype. Microsoft has released a working research engine, a
              Python package, documentation, multiple backend integrations, a
              monitoring interface, checked-in tests, and a separate preview
              workflow called SkillOpt-Sleep.
            </p>
            <p>
              It is still young. The published package is version <code>0.2.0</code>,
              PyPI labels it Alpha, Sleep is explicitly a preview, and the
              current source branch has moved materially beyond the release.
              Open issues include skipped execution rollouts, swallowed errors,
              proxy-metric Goodharting, and incomplete reproduction artifacts.
            </p>
            <div className="guide-callout">
              <strong>Recommendation</strong>
              <p>
                Use SkillOpt only for a bounded, offline experiment with a
                pinned version, explicit evaluation splits, external spend
                controls, and human approval of the final diff. Do not connect
                it to an automatic production adoption loop.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" id="how-it-works">
          <p className="guide-section-number">02</p>
          <div>
            <p className="guide-label">How it works</p>
            <h2>A skill definition becomes trainable text</h2>
            <p>
              SkillOpt keeps the target model and agent harness fixed while it
              treats one Markdown skill document as the trainable state. The
              target agent runs representative tasks, an evaluator scores the
              trajectories, and an optimizer reflects on failures and
              successes. It proposes bounded add, delete, or replace edits and
              tests candidates against held-out selection tasks before
              exporting <code>best_skill.md</code>.
            </p>
            <div className="guide-command" aria-label="SkillOpt optimization loop">
              <span>Optimization loop</span>
              <code>
                tasks → target rollouts → scored trajectories → reflection →
                bounded edits → selection → accepted skill
              </code>
            </div>
            <p>
              That is more disciplined than asking an LLM to rewrite a prompt
              once. SkillOpt can retain rejected edits as negative feedback,
              apply edit budgets, separate train/selection/test data, save run
              history, and resume experiments.
            </p>
            <p>
              The validation story needs one important qualification. On
              current <code>main</code>, ordinary candidate gating is
              configurable. Slow update is enabled by default while its
              selection gate defaults off, and optional appendix notes bypass
              the gate by design. A regression-sensitive pilot should enable{" "}
              <code>optimizer.slow_update_gate_with_selection</code> or disable
              slow update, and should leave optional skill-aware reflection off
              until the basic loop is trustworthy.
            </p>
          </div>
        </section>

        <section className="guide-section" id="developer-experience">
          <p className="guide-section-number">03</p>
          <div>
            <p className="guide-label">Developer experience</p>
            <h2>The package is easy; the evaluator is the project</h2>
            <p>
              Installing the released CLI and inspecting a built-in experiment
              is straightforward. A useful domain integration is not. A custom
              workflow needs a dataset loader, target rollout helper, scored
              environment adapter, and configuration. The difficult work sits
              behind those files: representative cases, ground truth, safe tool
              isolation, grader calibration, leakage prevention, and review of
              unsafe generalization.
            </p>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Developer value</th>
                    <th>Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Patch and rewrite modes</td>
                    <td>Bounded changes are easier to audit than free-form rewrites.</td>
                    <td>The edit boundary still depends on configuration.</td>
                  </tr>
                  <tr>
                    <td>Selection evaluation</td>
                    <td>Can reject plausible edits that fail held-out tasks.</td>
                    <td>A noisy or gameable score can optimize the wrong behavior.</td>
                  </tr>
                  <tr>
                    <td>Persisted artifacts</td>
                    <td>Candidate skills, histories, scores, and configuration aid review.</td>
                    <td>They are reproducibility aids, not proof that a result reproduces.</td>
                  </tr>
                  <tr>
                    <td>Backend breadth</td>
                    <td>Supports several chat providers and coding-agent execution paths.</td>
                    <td>Roles differ by backend and current docs contain inconsistencies.</td>
                  </tr>
                  <tr>
                    <td>Monitoring UI</td>
                    <td>Makes an experiment easier to observe.</td>
                    <td>It is not a visual skill authoring or evaluator builder.</td>
                  </tr>
                  <tr>
                    <td>Portable output</td>
                    <td>The optimizer is absent when the selected skill is deployed.</td>
                    <td>The skill text still adds context, latency, and input-token cost.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The native search state is one Markdown document. SkillOpt does
              not optimize a complete Agent Skills package containing
              metadata, scripts, references, assets, permissions, and multiple
              live skills. Freeze those assets and expose only a bounded
              procedure body through an isolated overlay.
            </p>
          </div>
        </section>

        <section className="guide-section" id="maturity">
          <p className="guide-section-number">04</p>
          <div>
            <p className="guide-label">Maturity</p>
            <h2>Strong research velocity, limited operational history</h2>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th>Snapshot</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Release status</td>
                    <td>Version 0.2.0; PyPI Alpha classifier</td>
                    <td>Interfaces and behavior should be expected to move.</td>
                  </tr>
                  <tr>
                    <td>Documentation</td>
                    <td>Install, loop, configuration, backend, extension, UI, and Sleep guides</td>
                    <td>Unusually complete for a new research project.</td>
                  </tr>
                  <tr>
                    <td>Published results</td>
                    <td>Author-reported best or tied-best in 52 of 52 evaluated cells</td>
                    <td>Promising evidence, not independent production validation.</td>
                  </tr>
                  <tr>
                    <td>Checked-in tests</td>
                    <td>Large test surface in the repository</td>
                    <td>Useful signal; this review did not establish pass status, coverage, or release gating.</td>
                  </tr>
                  <tr>
                    <td>Release drift</td>
                    <td>Current source contains capabilities absent from the wheel</td>
                    <td>Pinning and exact-path smoke tests are mandatory.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The framework is suitable for an isolated and metered pilot, but
              it should not yet be treated as an unattended production
              improvement service. Verify trace completeness and fail closed on
              zero calls, missing trajectories, malformed scores, or timeouts.
            </p>
          </div>
        </section>

        <section className="guide-section" id="total-cost">
          <p className="guide-section-number">05</p>
          <div>
            <p className="guide-label">Total cost</p>
            <h2>The license is free. The search loop is not.</h2>
            <p>
              SkillOpt uses the MIT license, so framework license cost is zero.
              Total cost is dominated by target rollouts, optimizer calls,
              selection reruns, final tests, tools, retries, storage, evaluation
              engineering, privacy review, and human adoption review.
            </p>
            <div className="guide-command" aria-label="SkillOpt total cost formula">
              <span>Planning formula</span>
              <code>
                TCO = model and tool usage + evaluation engineering + security
                and domain review + experiment infrastructure + deployment
                prompt overhead + ongoing maintenance
              </code>
            </div>
            <p>
              The paper reports the following aggregate training-token totals
              when GPT-5.5 served as both target and optimizer. It does not
              publish the actual input, output, and cached-token split.
            </p>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Benchmark</th>
                    <th>Reported training tokens</th>
                    <th>Illustrative token cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>SearchQA</td><td>213.8M</td><td>$2,138</td></tr>
                  <tr><td>SpreadsheetBench</td><td>21.4M</td><td>$214</td></tr>
                  <tr><td>OfficeQA</td><td>20.8M</td><td>$208</td></tr>
                  <tr><td>DocVQA</td><td>188.2M</td><td>$1,882</td></tr>
                  <tr><td>LiveMath</td><td>23.2M</td><td>$232</td></tr>
                  <tr><td>ALFWorld</td><td>59.3M</td><td>$593</td></tr>
                  <tr><td>Total</td><td>526.7M</td><td>$5,267</td></tr>
                </tbody>
              </table>
            </div>
            <p className="guide-source-note">
              Illustration only: 80% uncached input and 20% output at the
              GPT-5.5 direct API rates observed on August 14, 2026. It excludes
              caching, long-context or regional premiums, tools, retries,
              infrastructure, and labor. It is not a reconstructed invoice.
            </p>
            <p>
              Deployment also has a prompt cost. The paper&apos;s selected skills
              were roughly 379 to 1,995 tokens. Those tokens are billed whenever
              the agent loads or invokes the skill, even though no optimizer is
              called in production. Compare the full experiment against a human
              edit and a one-shot rewrite before paying for repeated search.
            </p>
          </div>
        </section>

        <section className="guide-section" id="fit-for-agentic-self-service">
          <p className="guide-section-number">06</p>
          <div>
            <p className="guide-label">Fit with this library</p>
            <h2>The local foundation is useful, but the evaluation layer is missing</h2>
            <p>
              This resource-library project already demonstrates good skill
              architecture: clear package layering, a deterministic import skill
              with preview and verification, security-review tooling, and a
              curated body of skill research. Those pieces are complementary to
              SkillOpt.
            </p>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Needed capability</th>
                    <th>Current state</th>
                    <th>What SkillOpt contributes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Skill package patterns</td>
                    <td>Strong guidance and a deterministic example</td>
                    <td>No direct contribution</td>
                  </tr>
                  <tr>
                    <td>Self-service target skill</td>
                    <td>Not present</td>
                    <td>Can optimize a bounded Markdown body after it exists</td>
                  </tr>
                  <tr>
                    <td>Representative task corpus</td>
                    <td>Not present</td>
                    <td>Consumes tasks but does not invent reliable ground truth</td>
                  </tr>
                  <tr>
                    <td>Outcome and safety grader</td>
                    <td>Not present</td>
                    <td>Uses the score; cannot rescue a noisy objective</td>
                  </tr>
                  <tr>
                    <td>Agent-performance baseline</td>
                    <td>Existing tests cover site data, builds, and links</td>
                    <td>Runs the baseline once the real harness is integrated</td>
                  </tr>
                  <tr>
                    <td>Security review</td>
                    <td>Strong preliminary static-review capability</td>
                    <td>Not a security product</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              SkillOpt fills only the behavioral optimization layer. Before it
              is useful here, define one narrow self-service workflow, author
              the seed skill, build non-leaking train/selection/test cases,
              implement deterministic safety checks, and record the unoptimized
              baseline.
            </p>
          </div>
        </section>

        <section className="guide-section" id="security-boundary">
          <p className="guide-section-number">07</p>
          <div>
            <p className="guide-label">Pilot design</p>
            <h2>Freeze the authority boundary; optimize only the procedure</h2>
            <p>
              Assemble each candidate from an immutable header and an
              optimizable body. Keep activation rules, permissions, destructive
              action approvals, provider and data policies, scripts, references,
              and metadata outside the search space.
            </p>
            <div className="guide-command" aria-label="Recommended SkillOpt candidate structure">
              <span>Candidate overlay</span>
              <code>
                immutable authority header + optimized procedure body + fixed
                scripts and references = candidate SKILL.md
              </code>
            </div>
            <ul className="guide-checklist">
              <li>
                <strong>Baseline first:</strong> compare no skill, the seed,
                one manual edit, and a one-shot rewrite under identical tasks.
              </li>
              <li>
                <strong>Real harness:</strong> evaluate the actual agent, tools,
                permissions, and sandbox through an isolated overlay.
              </li>
              <li>
                <strong>Multiple gates:</strong> measure task quality, safety,
                authority, usability, cost, and trace integrity separately.
              </li>
              <li>
                <strong>External budgets:</strong> enforce provider-side spend
                alerts plus runner-level request, token, turn, and time limits.
              </li>
              <li>
                <strong>Human adoption:</strong> stage the winning candidate,
                review the diff, retain provenance, and preserve one-step rollback.
              </li>
            </ul>
          </div>
        </section>

        <section className="guide-section guide-conclusion" id="adoption-decision">
          <p className="guide-section-number">08</p>
          <div>
            <p className="guide-label">Decision rule</p>
            <h2>Promote only measured value beyond cheaper edits</h2>
            <p>
              A successful benchmark is not enough. Require a repeatable held-out
              improvement beyond run-to-run noise, no regression on critical
              tasks, zero unauthorized side effects, complete trajectories,
              acceptable cost, and successful revalidation on the deployment
              model and real harness.
            </p>
            <p className="guide-final">
              SkillOpt earns a place only when controlled search adds regression
              protection that a simpler edit cannot.
            </p>
          </div>
        </section>

        <section
          className="guide-sources"
          id="primary-sources-and-review-notes"
          aria-labelledby="skillopt-sources-heading"
        >
          <h2 id="skillopt-sources-heading">Primary sources and review notes</h2>
          <ul>
            <li>
              <a href="https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/">
                Microsoft Research: SkillOpt overview
              </a>
            </li>
            <li>
              <a href="https://arxiv.org/html/2605.23904">
                SkillOpt research paper, version 2
              </a>
            </li>
            <li>
              <a href="https://github.com/microsoft/SkillOpt">
                Microsoft SkillOpt source repository
              </a>
            </li>
            <li>
              <a href="https://pypi.org/project/skillopt/">
                SkillOpt package metadata and Alpha classifier
              </a>
            </li>
            <li>
              <a href="https://developers.openai.com/api/docs/models/gpt-5.5">
                GPT-5.5 API pricing used for the dated illustration
              </a>
            </li>
          </ul>
          <p className="guide-source-note">
            This is an independent Resource Library assessment, not Microsoft
            documentation or an endorsement. The review inspected source and
            documentation and ran a preliminary local static security check; it
            did not install SkillOpt or reproduce a benchmark.
          </p>
        </section>

        <a className="guide-back" href={`${basePath}/#library`}>
          ← Back to the resource library
        </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
