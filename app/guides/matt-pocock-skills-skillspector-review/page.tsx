import type { Metadata } from "next";
import { GuideReadingLayout } from "../guide-reading-layout";
import { GuideResourceLink } from "../guide-resource-link";
import { GuideTableViewport } from "../guide-table-viewport";
import { SiteHeader } from "../../site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const path = basePath + "/guides/matt-pocock-skills-skillspector-review";
const commit = "6654f6b60cd9d5be8b54c6fafe44346dabeb3b76";
const repositoryUrl = "https://github.com/mattpocock/skills";

type Posture = "Start here" | "Use with controls" | "Harden first" | "Beta: evaluate only";

type SkillReview = {
  category: "engineering" | "productivity" | "misc" | "in-progress";
  name: string;
  score: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
  posture: Posture;
  purpose: string;
  strength: string;
  weakness: string;
};

const contents = [
  { id: "bottom-line", label: "Bottom line" },
  { id: "library-map", label: "The 37-skill map" },
  { id: "security-review", label: "Security review" },
  { id: "engineering-skills", label: "18 engineering skills" },
  { id: "other-skills", label: "Productivity, misc, and beta" },
  { id: "community-feedback", label: "What reviewers report" },
  { id: "superpowers-comparison", label: "Compared with Superpowers" },
  { id: "adoption-guide", label: "How to adopt selectively" },
  { id: "sources", label: "Sources" },
];

const engineeringReviews: SkillReview[] = [
  {
    category: "engineering",
    name: "ask-matt",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Routes a situation into the collection’s idea-to-ship, bug, triage, research, or long-horizon flow.",
    strength: "The phase-boundary guidance is unusually useful: it distinguishes continuation, fresh context, handoff, subagents, and compaction instead of treating every task alike.",
    weakness: "It assumes companion skills are installed and current, and it routes credentials work to wizard and conflicts to a resolver whose never-abort rule is too aggressive. Treat its route as advice, not authority.",
  },
  {
    category: "engineering",
    name: "code-review",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Reviews a fixed-point diff on two independent axes: repository standards and faithfulness to the originating specification.",
    strength: "Validating the comparison point first and separating Standards from Spec prevents a clean-looking diff from masking the wrong implementation.",
    weakness: "Issue text, commit messages, PR material, and diffs are passed to subagents without an explicit instruction/data boundary. Add secret redaction, tool-disabled reviewers, and output screening; add a separate security review when needed.",
  },
  {
    category: "engineering",
    name: "codebase-design",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Supplies a shared vocabulary and heuristics for deep modules, seams, interfaces, leverage, and locality.",
    strength: "The deletion test, interface-as-test-surface rule, dependency categories, and Design It Twice exercise are compact, memorable engineering tools.",
    weakness: "Its vocabulary and one-adapter/two-adapter heuristic can become dogma. Keep the concepts, but let established team language and real isolation requirements win.",
  },
  {
    category: "engineering",
    name: "diagnosing-bugs",
    score: 27,
    severity: "MEDIUM",
    posture: "Start here",
    purpose: "Builds a deterministic red feedback loop, minimizes the failure, tests falsifiable hypotheses, instruments one variable, fixes, and regression-tests.",
    strength: "This is the collection’s best operational discipline: reproduce before theorizing, preserve a regression at the right seam, then remove throwaway instrumentation.",
    weakness: "Curl, trace replay, bisection, fuzzing, stress, and temporary production instrumentation need environment, rate, and authorization controls. Its scanner finding about “show instruction” is a contextual false positive, but captured logs still need redaction.",
  },
  {
    category: "engineering",
    name: "domain-modeling",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Sharpens a repository glossary and records only durable, consequential decisions as ADRs.",
    strength: "It turns project language into a persistent asset and tests that language against edge cases and the actual code rather than accepting a glossary at face value.",
    weakness: "CONTEXT.md and ADRs become trusted future-agent memory. Require a human diff review, avoid concurrent writes, and do not let repository text silently become instructions.",
  },
  {
    category: "engineering",
    name: "grill-with-docs",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Combines the reusable grilling interview with domain-modeling so clarified terms and decisions survive the chat.",
    strength: "The combination attacks two real failure modes at once: underspecified work and vocabulary that evaporates between sessions.",
    weakness: "The wrapper itself is only a few lines and leaves ordering, failure behavior, and child-skill tool boundaries implicit. Its quality and safety are almost entirely transitive.",
  },
  {
    category: "engineering",
    name: "implement",
    score: 0,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Implements a spec or ticket, uses TDD at pre-agreed seams, runs checks, reviews, and commits.",
    strength: "It is admirably small and keeps implementation tied to tests and a final two-axis review.",
    weakness: "The prose authorizes arbitrary repository commands and a commit without a clean-tree check, branch isolation, scope review, or final approval. Use an isolated worktree and review the exact staged diff before committing.",
  },
  {
    category: "engineering",
    name: "improve-codebase-architecture",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Surveys a codebase for deepening opportunities, presents candidates visually, and interviews the user about the selected change.",
    strength: "It explores before prescribing, requires file-level evidence, and delays interface design until the user chooses a candidate.",
    weakness: "The generated HTML imports unpinned Tailwind and Mermaid assets, uses loose Mermaid security, opens a local file, and may persist CONTEXT.md changes. Escape repository data and use local or pinned assets.",
  },
  {
    category: "engineering",
    name: "prototype",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Builds a deliberately throwaway logic or UI prototype to answer one design question.",
    strength: "It distinguishes logic from UI exploration, insists on genuinely different variants, and clearly separates prototype code from production promotion.",
    weakness: "Existing-route UI prototypes may retain real authentication and data access while intentionally omitting tests and error handling. Use sanitized fixtures and rewrite promoted code.",
  },
  {
    category: "engineering",
    name: "research",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Delegates a question to a background researcher and saves a claim-cited Markdown artifact in the repository.",
    strength: "It favors primary sources and durable, claim-level citations instead of letting research disappear into a chat transcript.",
    weakness: "Remote pages and source code are indirect-prompt-injection surfaces, and a background agent writes persistent content. Bound the domains and tools, separate source text from instructions, and review the artifact.",
  },
  {
    category: "engineering",
    name: "resolving-merge-conflicts",
    score: 0,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Resolves merge or rebase conflicts by reconstructing each side’s intent from code history and source artifacts.",
    strength: "Intent-first conflict resolution is much better than blindly choosing ours or theirs.",
    weakness: "Always resolve; never abort removes a valuable recovery path, and the skill stages and commits without a hard approval gate. Capture a backup ref, isolate the work, retain abort, and review staging.",
  },
  {
    category: "engineering",
    name: "setup-matt-pocock-skills",
    score: 32,
    severity: "MEDIUM",
    posture: "Use with controls",
    purpose: "Configures issue-tracker conventions, triage labels, and domain-document layout for the rest of the engineering collection.",
    strength: "It explores first, supports GitHub, GitLab, local Markdown, and custom trackers, and tries to preview persistent files before writing.",
    weakness: "It modifies AGENTS.md or CLAUDE.md and durable tracker instructions. A single-context default may be written without asking despite the later preview step. Treat the generated files as security-sensitive configuration.",
  },
  {
    category: "engineering",
    name: "tdd",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Runs behavior-first red-green-refactor through a public seam, with boundary-only mocking and independently derived expected values.",
    strength: "It is clear, portable, and opinionated in productive ways about observable behavior and meaningful tests.",
    weakness: "One seam and one test can be too rigid for properties, security tests, or mature suites. Repository test commands are executable code, so use normal sandbox and trust controls.",
  },
  {
    category: "engineering",
    name: "to-spec",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Synthesizes an existing conversation into a problem statement, stories, scope, domain terms, and test seams, then publishes it to the configured tracker.",
    strength: "It preserves the reasoning already completed instead of restarting discovery, and its template is stronger than a generic PRD shell.",
    weakness: "No interview conflicts with its seam-confirmation requirement, and publication lacks a separate final confirmation. Preview, redact, and approve before tracker writes.",
  },
  {
    category: "engineering",
    name: "to-tickets",
    score: 17,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Slices a spec into tracer-bullet tickets with explicit blocking edges and an approval loop.",
    strength: "Vertical slices plus a dependency graph make the resulting work much more executable than a flat checklist; its expand-contract exception is thoughtful.",
    weakness: "External issues and comments are ingested as if trusted. The scanner’s tool-chaining hit is a false positive about refactor sequencing, but ticket text still needs sanitization and a final publish gate.",
  },
  {
    category: "engineering",
    name: "triage",
    score: 0,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Moves issues through a documented state machine and separates agent-ready work from human-only decisions.",
    strength: "The role labels, AI-comment disclaimer, redundancy checks, and maintainer recommendation gate are well designed.",
    weakness: "The external-PR path checks out contributor code and runs its commands without first requiring isolation and a trust decision. Limit it to read-only issue triage unless the PR is sandboxed and explicitly approved.",
  },
  {
    category: "engineering",
    name: "wayfinder",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Maps a body of work too large for one context window as decision tickets and resolves the ready frontier over time.",
    strength: "Destination-first scope, fog-of-war tickets, native dependency edges, and claim-before-work rules make it a credible long-horizon planning system.",
    weakness: "Research results and tracker content are untrusted, remote writes need confirmation, and tickets should never contain credentials or secret locations. It is useful, but not lightweight.",
  },
  {
    category: "engineering",
    name: "wizard",
    score: 19,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Generates an interactive Bash wizard for human-only setup, credential, dashboard, migration, and cutover steps.",
    strength: "The intended experience is excellent: visible stages, hidden secret input, confirmation before irreversible actions, static tracing, and no unattended end-to-end run.",
    weakness: "The template opens unvalidated URLs, reads and writes arbitrary ENV_FILE paths, interpolates keys into regexes, accepts newline-containing values, inherits ambient file permissions, and can continue on EOF. Harden secret handling before use.",
  },
];

const productivityReviews: SkillReview[] = [
  {
    category: "productivity",
    name: "grill-me",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Provides a memorable manual entry point into the reusable grilling interview.",
    strength: "Its simplicity is the point: discovery stays explicit and the interviewing logic remains centralized.",
    weakness: "It defines almost no contract of its own and assumes grilling is present. The value is discoverability, not independent capability.",
  },
  {
    category: "productivity",
    name: "grilling",
    score: 8,
    severity: "LOW",
    posture: "Start here",
    purpose: "Maps a plan or decision as a dependency-aware design tree and asks the currently answerable frontier in rounds.",
    strength: "Separating discoverable facts from user-owned decisions, while attaching a recommendation to each question, is the collection’s signature idea.",
    weakness: "Relentless can become endless. There is no round budget or stopping rule beyond an empty frontier, and fact-finding subagents need read-only scope. The scanner’s autonomy hit is a contextual false positive.",
  },
  {
    category: "productivity",
    name: "handoff",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Writes a compact, purpose-specific conversation handoff into the operating system’s temporary directory.",
    strength: "It avoids copying durable specs, issues, ADRs, commits, and diffs, and explicitly requires secret and PII redaction.",
    weakness: "The temporary filename, permissions, collision behavior, retention, and cleanup are unspecified. Add deterministic naming and restrictive permissions.",
  },
  {
    category: "productivity",
    name: "teach",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Creates a stateful teaching workspace with missions, lessons, retrieval practice, sources, learning records, and reusable HTML assets.",
    strength: "It has a serious learning model: spacing, retrieval, interleaving, durable records, and a zone-of-proximal-development lens.",
    weakness: "HTML lessons create an active-content surface, learning records can be private, and opening files or joining communities crosses boundaries. Sanitize content and ask before external actions.",
  },
  {
    category: "productivity",
    name: "to-questionnaire",
    score: 17,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Turns a knowledge gap into a one-pass questionnaire for the specific person who can answer it.",
    strength: "Grill the send, not the subject is an excellent constraint: it keeps the user’s burden low and targets the missing decisions directly.",
    weakness: "It writes to the current directory without destination, collision, or privacy checks. The scanner’s “always answer” hit is an ordinary-language false positive.",
  },
  {
    category: "productivity",
    name: "wait-what",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Re-pitches a confusing message with the missing context, plain language, and repository vocabulary.",
    strength: "It is a tiny, high-leverage recovery command that asks the agent to restore context rather than merely repeat itself.",
    weakness: "It assumes valid CONTEXT files and gives no fallback when they are missing or contradictory. Ask the rewrite to state what changed.",
  },
  {
    category: "productivity",
    name: "writing-for-agents",
    score: 0,
    severity: "LOW",
    posture: "Start here",
    purpose: "Offers a theory for writing skills, AGENTS.md or CLAUDE.md, and other documents that agents consume.",
    strength: "Context load versus cognitive load, progressive disclosure, context pointers, completion criteria, and the no-op test form a coherent authoring framework.",
    weakness: "Claims about model priors, negation, and leading words are useful hypotheses, not established laws. Pair the advice with behavioral tests and explicit tool-security guidance.",
  },
];

const miscReviews: SkillReview[] = [
  {
    category: "misc",
    name: "git-guardrails-claude-code",
    score: 62,
    severity: "HIGH",
    posture: "Harden first",
    purpose: "Installs a Claude Code PreToolUse hook intended to block destructive Git commands.",
    strength: "The defensive goal and project-versus-global scope question are right.",
    weakness: "The scanner’s dangerous-command hits mostly quote a deny-list, but the real script is fail-open lexical matching: it misses aliases, indirection, alternate destructive commands, and malformed JSON. Do not deploy it unchanged; use structured parsing, allowlisting, and bypass tests.",
  },
  {
    category: "misc",
    name: "migrate-to-shoehorn",
    score: 0,
    severity: "LOW",
    posture: "Use with controls",
    purpose: "Replaces unsafe TypeScript test casts with ShoeHorn’s partial-object helpers.",
    strength: "It is narrow, legible, and distinguishes intentionally unsafe negative-test construction from ordinary fixtures.",
    weakness: "The package install is unpinned, grep discovery is fragile, and fromAny deliberately bypasses type safety. Review every cast and run the full test suite.",
  },
  {
    category: "misc",
    name: "scaffold-exercises",
    score: 0,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Creates or reorganizes exercise folders under a project-specific course convention.",
    strength: "Naming, required files, linter integration, and move-versus-rename rules are concrete.",
    weakness: "Plan-derived paths feed filesystem operations and the skill commits unconditionally. Validate paths, preview the tree, inspect project commands, and ask before staging or committing.",
  },
  {
    category: "misc",
    name: "setup-pre-commit",
    score: 12,
    severity: "LOW",
    posture: "Harden first",
    purpose: "Installs Husky, lint-staged, and Prettier, then wires repository checks into a pre-commit hook.",
    strength: "The sequence is practical and adapts to an existing formatter and package manager.",
    weakness: "Unpinned npx commands are a real supply-chain lead, repository scripts and lifecycle hooks execute code, and “stage all” can capture unrelated work. Pin tools and review the exact diff and staged set.",
  },
];

const inProgressReviews: SkillReview[] = [
  {
    category: "in-progress",
    name: "claude-handoff",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Summarizes the current work and launches a fresh Claude background agent to continue immediately.",
    strength: "It emphasizes redaction and references durable artifacts instead of stuffing the entire project into a new prompt.",
    weakness: "The handoff is placed in a command-line argument, risking process-list exposure and quoting injection. Use a protected file or stdin and require approval before background execution.",
  },
  {
    category: "in-progress",
    name: "implement-spec",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Implements a ticket graph in parallel worktrees, merges the branches, reviews the whole change, opens a draft PR, and cleans up.",
    strength: "The ready-frontier model, sparse context pointers, isolated worktrees, and final merge review form a serious execution design.",
    weakness: "It is the pack’s highest-autonomy workflow: branches, subagents, commands, merges, PR and issue effects, and cleanup need a human-approved plan, bounded concurrency, sandboxing, and final diff review.",
  },
  {
    category: "in-progress",
    name: "loop-me",
    score: 7,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Turns recurring personal or work loops into stateful workflow specifications under workflows/.",
    strength: "Trigger, checkpoint, push right, and decision-ready brief are useful vocabulary, and the skill avoids forcing AI or schedules where they do not belong.",
    weakness: "The workflow schema is underspecified, while create, edit, and delete operations lack recovery or confirmation rules. Confirm before deleting or materially rewriting existing specs.",
  },
  {
    category: "in-progress",
    name: "retro",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Reviews a completed coding session for improvements to navigation, checks, standards, instructions, tools, and information access.",
    strength: "It correctly asks which information should be a pointer, automated check, standard, or no-op instead of expanding always-loaded instructions by default.",
    weakness: "It searches session logs without a defined consent, scope, or redaction boundary and does not clearly forbid direct environment changes. Keep it recommendation-only.",
  },
  {
    category: "in-progress",
    name: "setup-ts-deep-modules",
    score: 37,
    severity: "MEDIUM",
    posture: "Beta: evaluate only",
    purpose: "Installs dependency-cruiser and enforces flat TypeScript packages whose subfolders are private behind root entry points.",
    strength: "The pass-fail-pass proof is excellent, the supplied rules are readable, and existing configuration is meant to be merged rather than replaced.",
    weakness: "The layout heuristics are opinionated, the dependency is unpinned, verification temporarily breaks a test file, and many project files change. The failed 33.3% static scan was a parser/reference limit; manual review found a declarative config, not executable misbehavior.",
  },
  {
    category: "in-progress",
    name: "writing-beats",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Shapes an article as a user-directed journey, writing one reachable beat at a time from fixed raw material.",
    strength: "Prerequisites, grounded concepts, reachable next beats, and one-beat writes give the author unusually tight control.",
    weakness: "It is turn-intensive, grounding state is not persisted, and raw material has no citation or prompt-injection boundary. Keep provenance with the source pile.",
  },
  {
    category: "in-progress",
    name: "writing-fragments",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Mines a conversation for heterogeneous fragments without prematurely forcing an outline.",
    strength: "The explore-versus-exploit distinction and append-oriented file discipline preserve raw material and user edits.",
    weakness: "Silent appends reduce transparency, the file can grow without provenance or an exit condition, and sensitive conversation material may be retained. Show writes and label sources.",
  },
  {
    category: "in-progress",
    name: "writing-shape",
    score: 0,
    severity: "LOW",
    posture: "Beta: evaluate only",
    purpose: "Turns a read-only pile of raw material into a separate article one paragraph or block at a time.",
    strength: "It protects the source, exposes format trade-offs, names missing evidence, and re-reads before each incremental write.",
    weakness: "The interaction is expensive, grounding is chat-local, and quoting or paraphrasing lacks attribution checks. Add provenance and treat the pile as untrusted data.",
  },
];

const allReviews = [
  ...engineeringReviews,
  ...productivityReviews,
  ...miscReviews,
  ...inProgressReviews,
];

const comparisonRows = [
  ["Operating model", "Selective toolbox; most orchestration skills are manually invoked.", "Integrated development methodology; using-superpowers makes skill checking part of the default operating procedure."],
  ["Reviewed surface", "37 directories: 25 plugin skills, four misc utilities, eight explicitly in-progress skills.", "14 tightly connected skills in the Resource Library’s pinned review."],
  ["Best discovery work", "Grilling, domain language, ADR capture, architecture vocabulary, and long-horizon decision mapping.", "Brainstorming that feeds directly into plans and the execution lifecycle."],
  ["Best execution work", "TDD and diagnosis are strong; parallel implementation exists but is still in progress.", "Worktrees, subagent-driven development, plan execution, review, branch finishing, and verification are more mature as a system."],
  ["Control and ceremony", "Easier to adopt one skill, edit it, and stop. More assembly and local configuration are left to the engineer.", "More consistent guardrails and handoffs, but more process, context, subagents, and opportunities for token overhead."],
  ["Best fit", "Experienced engineers who want sharp thinking tools and retain control of their existing workflow.", "Teams or individuals who want a repeatable end-to-end coding operating procedure."],
] as const;

export const metadata: Metadata = {
  title: "Matt Pocock’s Skills for Real Engineers: all 37 reviewed | Agent Skills Resource Library",
  description:
    "A commit-pinned review of all 37 skills in mattpocock/skills, with SkillSpector evidence, individual strengths and weaknesses, community feedback, and an Obra Superpowers comparison.",
  openGraph: {
    title: "Matt Pocock’s Skills for Real Engineers: all 37 reviewed",
    description:
      "What each skill contributes, where the action surfaces need controls, and how the collection compares with Obra Superpowers.",
  },
};

function sourceUrl(review: SkillReview) {
  return repositoryUrl + "/tree/" + commit + "/skills/" + review.category + "/" + review.name;
}

function SkillReviewList({ reviews }: { reviews: SkillReview[] }) {
  return (
    <div className="skill-review-list">
      {reviews.map((review) => (
        <details
          className="guide-callout skill-review-detail"
          key={review.category + "/" + review.name}
          open={review.posture === "Start here"}
        >
          <summary>
            <code>{review.name}</code>
            <span>{review.posture}</span>
          </summary>
          <p>{review.purpose}</p>
          <p><strong>Strength:</strong> {review.strength}</p>
          <p><strong>Weakness / risk:</strong> {review.weakness}</p>
          <p className="guide-source-note">
            SkillSpector: {review.score} / {review.severity}. <a href={sourceUrl(review)} rel="noreferrer" target="_blank">Open the pinned skill ↗</a>
          </p>
        </details>
      ))}
    </div>
  );
}

export default function MattPocockSkillsSkillSpectorReview() {
  return (
    <main className="guide-page">
      <SiteHeader currentSection="guides" />

      <article className="guide-article">
        <div className="guide-hero training-hero">
          <p className="eyebrow">Case study · Open-source skill library</p>
          <h1>Matt Pocock’s Skills for Real Engineers: all 37 reviewed.</h1>
          <p className="guide-deck">
            The collection’s best ideas are its smallest ones: dependency-aware
            grilling, shared domain language, feedback-loop-first diagnosis,
            seam-based TDD, and compact handoffs. Adopt those selectively. The
            higher-agency tracker, secret, shell, and parallel-agent workflows
            need stronger controls than their prose currently supplies.
          </p>
          <div className="guide-hero-actions">
            <a href={repositoryUrl} rel="noreferrer" target="_blank">
              Open Matt Pocock’s skills repository <span aria-hidden="true">↗</span>
            </a>
            <a href={repositoryUrl + "/commit/" + commit} rel="noreferrer" target="_blank">
              Open the reviewed commit <span aria-hidden="true">↗</span>
            </a>
            <a href={basePath + "/guides/obra-superpowers-skillspector-review"}>
              Compare with Obra Superpowers
            </a>
          </div>
          <p className="guide-meta">
            Reviewed September 1, 2026 · SkillSpector 2.11.0 · static scan plus local semantic review · commit {commit.slice(0, 12)}
          </p>
        </div>

        <GuideReadingLayout contents={contents} path={path}>
          <section className="guide-section guide-principle" id="bottom-line">
            <p className="guide-section-number">01</p>
            <div>
              <p className="guide-label">Independent assessment</p>
              <h2>A strong thinking layer, not a blanket install.</h2>
              <p>
                This collection is more interesting than a prompt pack and less
                complete than a development framework. Its strongest skills
                compress good engineering habits into narrow, editable
                procedures. Its weakest skills assume the host agent will
                supply permissions, isolation, input validation, secret
                handling, and final approvals that the skill itself does not
                enforce.
              </p>
              <div className="guide-callout">
                <strong>Recommendation</strong>
                <p>
                  Start with <code>grilling</code>, <code>diagnosing-bugs</code>,
                  <code>tdd</code>, <code>codebase-design</code>, <code>handoff</code>,
                  and <code>writing-for-agents</code>. Adapt the tracker and
                  implementation flows to your repository. Do not deploy
                  <code>git-guardrails-claude-code</code> or <code>wizard</code>
                  unchanged, and keep the eight in-progress skills out of a
                  default production bundle.
                </p>
              </div>
              <p>
                That selective posture also matches the repository’s stated
                design: small, composable skills that engineers can edit rather
                than a system that owns the whole process.
              </p>
            </div>
          </section>

          <section className="guide-section" id="library-map">
            <p className="guide-section-number">02</p>
            <div>
              <h2>One repository, three confidence levels</h2>
              <p>
                The pinned tree contains 37 skill directories. The Claude Code
                plugin manifest includes the 18 engineering and seven
                productivity skills. Four misc utilities sit outside that
                manifest, and eight skills are explicitly labeled in progress
                and excluded from the plugin.
              </p>
              <div className="scan-evidence" aria-label="Matt Pocock skills map">
                <div><strong>25</strong><span>plugin skills</span></div>
                <p>18 engineering workflows plus seven productivity primitives form the supported collection.</p>
                <div><strong>4</strong><span>misc utilities</span></div>
                <p>Useful but stack-specific setup and migration helpers that are not part of the plugin manifest.</p>
                <div><strong>8</strong><span>in progress</span></div>
                <p>Public experiments that the repository says can change or disappear without warning.</p>
              </div>
              <p>
                The supported flow is modular rather than mandatory:
                <code> grill-with-docs → prototype → to-spec → to-tickets → implement → code-review</code>.
                Bug diagnosis, triage, research, and wayfinding enter from the
                side when the situation calls for them.
              </p>
            </div>
          </section>

          <section className="guide-section" id="security-review">
            <p className="guide-section-number">03</p>
            <div>
              <p className="guide-label">Pre-install screen</p>
              <h2>The aggregate score was alarming. The individual evidence was more useful.</h2>
              <p>
                SkillSpector 2.11.0 scanned the mutable repository URL first,
                then the exact commit, then every skill directory separately in
                static-only mode. The repository-wide result was
                <strong> 100 / CRITICAL / DO_NOT_INSTALL</strong> with 94.5%
                coverage marked partial. Duplicate documentation, the root
                dependency lockfile, unresolved references, and context-blind
                prose matches drove that score.
              </p>
              <div className="scan-evidence" aria-label="Per-skill SkillSpector results">
                <div><strong>37</strong><span>separate scans</span></div>
                <p>One static report for every directory containing a SKILL.md at commit <code>{commit.slice(0, 12)}</code>.</p>
                <div><strong>16</strong><span>static findings</span></div>
                <p>33 skills scored LOW, three MEDIUM, one HIGH, and none CRITICAL when scoped individually.</p>
                <div><strong>14</strong><span>complete scans</span></div>
                <p>22 were partial and <code>setup-ts-deep-modules</code> failed at 33.3% because a bounded parser could not fully inspect its referenced CJS config.</p>
              </div>
              <ul className="guide-checklist">
                <li><strong>Clear false positives:</strong> “clear context” was labeled memory poisoning; “can always answer” was labeled anti-refusal; “show instruction” in a human prompt helper was labeled system-prompt leakage; a Git deny-list was read as command abuse.</li>
                <li><strong>Real action surfaces:</strong> external PR execution in <code>triage</code>, secret and ENV_FILE handling in <code>wizard</code>, fail-open lexical matching in <code>git-guardrails-claude-code</code>, and unpinned package-manager commands in setup utilities.</li>
                <li><strong>Main OWASP gap:</strong> issues, PRs, repository docs, web pages, traces, research output, specs, and handoffs are frequently consumed without explicit instruction/data separation or output screening.</li>
                <li><strong>Direct pattern triage:</strong> OWASP’s narrow ignore-previous-instructions, developer-mode, system-override, prompt-leakage, API-key, and numbered-instruction expressions returned no matches. A fuzzy six-word pass produced 29 matches across 21 files; manual review found ordinary engineering prose, not direct injection.</li>
              </ul>
              <div className="guide-callout">
                <strong>Review coverage</strong>
                <p>
                  SkillSpector’s LLM layer was not used: <code>llm_requested</code>,
                  <code>llm_available</code>, and <code>meta_analysis_applied</code>
                  were false. Three GPT-5.6 Luna agents and the primary Codex
                  agent instead read all 37 raw skills and relevant support
                  files locally. No repository script was executed and no raw
                  artifact was sent to an external semantic reviewer.
                </p>
              </div>
            </div>
          </section>

          <section className="guide-section" id="engineering-skills">
            <p className="guide-section-number">04</p>
            <div>
              <h2>All 18 engineering skills, individually reviewed</h2>
              <p>
                Open each review for purpose, strongest contribution, weakness,
                pinned source, and its individual static score. Posture is the
                human recommendation, not a relabeled scanner verdict.
              </p>
              <SkillReviewList reviews={engineeringReviews} />
            </div>
          </section>

          <section className="guide-section" id="other-skills">
            <p className="guide-section-number">05</p>
            <div>
              <h2>The other 19: productivity, misc, and public experiments</h2>
              <p className="guide-label">Seven productivity skills</p>
              <SkillReviewList reviews={productivityReviews} />
              <p className="guide-label">Four misc utilities</p>
              <SkillReviewList reviews={miscReviews} />
              <p className="guide-label">Eight in-progress skills</p>
              <p>
                These are intentionally outside the plugin. A low static score
                does not change their upstream beta status.
              </p>
              <SkillReviewList reviews={inProgressReviews} />
              <p className="guide-source-note">
                Count check: {allReviews.length} individual reviews. Scores are
                from per-directory SkillSpector 2.11.0 static scans; local
                semantic judgment determines the posture.
              </p>
            </div>
          </section>

          <section className="guide-section" id="community-feedback">
            <p className="guide-section-number">06</p>
            <div>
              <p className="guide-label">External signal, carefully weighted</p>
              <h2>Reviewers praise the primitives and complain about the same edge: too much grilling.</h2>
              <p>
                Online material is noisy and often describes earlier versions
                with renamed skills. The most useful sources are concrete
                adoption notes and upstream issues, not star counts or launch
                summaries.
              </p>
              <ul className="guide-checklist">
                <li><strong>Adopt with adaptation:</strong> <GuideResourceLink href="https://docs.rhi.zone/skills-mattpocock.html">Rhi’s running review</GuideResourceLink> kept the architecture vocabulary, exploration gate, inline context updates, and Design It Twice pattern, while dropping ADR ceremony and TypeScript-specific pieces that did not fit its environment.</li>
                <li><strong>Strongest independent praise:</strong> <GuideResourceLink href="https://kaizencode.art/notepad/matt-pocock-skills-guide/">Kaizen Craft’s critical guide</GuideResourceLink> singled out feedback-loop-first diagnosis and the no-op/context-load theory in the earlier writing skill, while warning that much of the wording is self-reported methodology rather than evaluated performance.</li>
                <li><strong>Upstream friction:</strong> GitHub issue #247 reports a <GuideResourceLink href="https://github.com/mattpocock/skills/issues/247">12-hour grilling session</GuideResourceLink>; issue #853 reports 40–50 questions, <GuideResourceLink href="https://github.com/mattpocock/skills/issues/853">context compaction and spec drift</GuideResourceLink>; issue #797 asks for hypothesis-led confirmation to reduce question count.</li>
                <li><strong>Superpowers comparison is anecdotal:</strong> <GuideResourceLink href="https://www.reddit.com/r/vibecoding/comments/1uxvmle/superpowers_or_mattpocock/">one Reddit comparison thread</GuideResourceLink> reports higher token burn with Superpowers and better edge-case discovery with <code>grill-me</code>; replies recommend taking only one or two useful skills and customizing them.</li>
              </ul>
              <p>
                My inference from the source and the reviews: the pack’s durable
                value lies in engineering vocabulary and decision structure,
                not magic prompt phrasing. Its effectiveness will vary with
                model strength, repository context, tool controls, and the
                user’s willingness to answer and curate.
              </p>
            </div>
          </section>

          <section className="guide-section" id="superpowers-comparison">
            <p className="guide-section-number">07</p>
            <div>
              <h2>Matt Pocock versus Obra Superpowers</h2>
              <p>
                The two collections overlap on discovery, planning, TDD,
                debugging, review, and multi-agent work. They make different
                bets about how much of the lifecycle should be mandatory.
              </p>
              <GuideTableViewport className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th scope="col">Dimension</th>
                      <th scope="col">Matt Pocock</th>
                      <th scope="col">Obra Superpowers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([dimension, matt, obra]) => (
                      <tr key={dimension}>
                        <td><strong>{dimension}</strong></td>
                        <td>{matt}</td>
                        <td>{obra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GuideTableViewport>
              <div className="guide-callout">
                <strong>Best hybrid</strong>
                <p>
                  Use Matt’s <code>grilling</code>, <code>domain-modeling</code>,
                  <code>diagnosing-bugs</code>, and architecture vocabulary with
                  Superpowers-style worktree isolation, explicit plan execution,
                  verification-before-completion, and branch finishing. Remove
                  duplicate brainstorming, planning, TDD, and review rules
                  instead of stacking both collections whole.
                </p>
              </div>
              <p className="guide-source-note">
                The Resource Library’s Obra review used SkillSpector 2.10.0 at a
                different commit and scope. Its 14 reports and 46 findings are
                useful context, not a numerical risk benchmark against this
                2.11.0 review.
              </p>
            </div>
          </section>

          <section className="guide-section guide-conclusion" id="adoption-guide">
            <p className="guide-section-number">08</p>
            <div>
              <h2>Adopt one behavior at a time.</h2>
              <ol className="skill-workflow">
                <li><strong>Pin</strong><span>Choose an exact commit and one skill directory, not the mutable whole-repo default.</span></li>
                <li><strong>Read</strong><span>Inspect SKILL.md and every referenced script, template, asset, tracker contract, and package command.</span></li>
                <li><strong>Bound</strong><span>Define allowed files, network domains, tracker targets, commands, secrets, and approval points.</span></li>
                <li><strong>Adapt</strong><span>Replace assumptions that do not fit your stack. Add instruction/data separation and safe failure behavior.</span></li>
                <li><strong>Trial</strong><span>Use a non-sensitive branch or worktree, record runtime and token cost, and compare with your ordinary workflow.</span></li>
                <li><strong>Keep</strong><span>Retain only behavior that measurably improves decisions, defects, speed, or handoff quality. Re-scan updates.</span></li>
              </ol>
              <p className="guide-final">
                The collection is worth reading even if you install none of it.
                Its best contribution is a vocabulary for making agent-assisted
                engineering less vague. Its weakest assumption is that good
                prose can substitute for enforced permissions and runtime
                guardrails. It cannot.
              </p>
            </div>
          </section>

          <section className="guide-sources" id="sources" aria-labelledby="guide-sources-heading">
            <h2 id="guide-sources-heading">Sources</h2>
            <ul>
              <li><a href={repositoryUrl} rel="noreferrer" target="_blank">Matt Pocock’s skills repository ↗</a></li>
              <li><a href={repositoryUrl + "/commit/" + commit} rel="noreferrer" target="_blank">Exact reviewed commit: {commit} ↗</a></li>
              <li><a href="https://github.com/NVIDIA/SkillSpector" rel="noreferrer" target="_blank">NVIDIA SkillSpector ↗</a></li>
              <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html" rel="noreferrer" target="_blank">OWASP LLM Prompt Injection Prevention Cheat Sheet ↗</a></li>
              <li><a href="https://docs.rhi.zone/skills-mattpocock.html" rel="noreferrer" target="_blank">Rhi: running skill-by-skill review ↗</a></li>
              <li><a href="https://kaizencode.art/notepad/matt-pocock-skills-guide/" rel="noreferrer" target="_blank">Kaizen Craft: critical guide ↗</a></li>
              <li><a href="https://github.com/mattpocock/skills/issues/247" rel="noreferrer" target="_blank">Issue #247: grilling severity ↗</a></li>
              <li><a href="https://github.com/mattpocock/skills/issues/853" rel="noreferrer" target="_blank">Issue #853: long interviews and context compaction ↗</a></li>
              <li><a href="https://github.com/mattpocock/skills/issues/797" rel="noreferrer" target="_blank">Issue #797: hypothesis-led confirmation request ↗</a></li>
              <li><a href="https://www.reddit.com/r/vibecoding/comments/1uxvmle/superpowers_or_mattpocock/" rel="noreferrer" target="_blank">Reddit: Superpowers or Matt Pocock discussion ↗</a></li>
              <li><a href={basePath + "/guides/obra-superpowers-skillspector-review"}>Resource Library: Obra Superpowers review</a></li>
            </ul>
            <p className="guide-source-note">
              SkillSpector is a preliminary static precaution. It does not prove
              publisher identity, artifact integrity, dependency resolution,
              runtime safety, model behavior, or the absence of false positives
              and false negatives. Online reviews are practitioner evidence, not
              controlled benchmarks.
            </p>
          </section>

          <a className="guide-back" href={basePath + "/guides"}>
            ← Back to guides
          </a>
        </GuideReadingLayout>
      </article>
    </main>
  );
}
