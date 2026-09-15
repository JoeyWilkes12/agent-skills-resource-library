export type GuideCatalogEntry = {
  contentTopics: readonly string[];
  featured?: boolean;
  href: string;
  image?: {
    alt: string;
    src: string;
  };
  summary: string;
  title: string;
};

/**
 * The index's editorial catalog lives here so its display and search metadata
 * stay in one place. contentTopics are short, content-derived phrases rather
 * than a dump of each article; they make the index searchable while keeping
 * the static client bundle focused.
 */
export const guideCatalog: readonly GuideCatalogEntry[] = [
  {
    contentTopics: [
      "A quick win is a beginning",
      "Professional use creates more handoffs",
      "Where variability enters",
      "Computer science makes conditions repeatable",
      "Data science turns use into evidence",
      "Agentic execution adds useful moving parts",
      "Rigor should match the promise",
      "Trustworthy scale",
      "Prompt variability",
      "Nondeterministic output",
      "Model and provider differences",
      "Memory and runtime complexity",
      "Production-grade reliability",
    ],
    featured: true,
    href: "/guides/spectrum-of-skill-sophistication",
    image: {
      alt: "Illustration of agentic AI skill development as a tightrope",
      src: "/guides/spectrum-of-skill-sophistication.jpeg",
    },
    summary: "A spectrum of speed, variability, rigor, and operational maturity.",
    title: "Spectrum of skill sophistication",
  },
  {
    contentTopics: [
      "Executive summary",
      "Skill, tool, and plugin",
      "Personalized Skills",
      "Task-matched guidance",
      "Retrieval and context",
      "Plugins and tools",
      "Capability gain is not packaging gain",
      "Evaluation design",
      "Product architecture",
      "Security and cost",
    ],
    href: "/guides/skills-plugins-impact",
    title: "Literature review of Skills Efficacy",
    summary:
      "A research synthesis on personalized Skills, task-matched guidance, retrieval, plugin packaging, cost, and security—with the full supporting notes.",
  },
  {
    contentTopics: [
      "Purpose of this guide",
      "What exactly is a skill",
      "Skills, tools, plugins, MCP, RAG, and memory",
      "Business value and fit",
      "Design, reliability, and evaluation",
      "Nondeterministic model outputs",
      "Testing a skill",
      "Security, privacy, and governance",
      "Third-party skill approval",
      "Role-based pressure test",
      "Twenty-minute presentation readiness check",
    ],
    href: "/guides/enterprise-agent-skills-presenter-readiness",
    title: "Enterprise training on skills for AI agents: presenter readiness questions",
    summary:
      "A presenter-facing question bank for preparing a clear, credible 20-minute enterprise introduction to agent skills.",
  },
  {
    contentTopics: [
      "The central idea",
      "The seven levers of agentic performance",
      "Purpose, intelligence, and guidance",
      "Grounding, action, and execution",
      "Assurance and observability",
      "The trust boundary",
      "Eval-driven optimization loop",
      "Measuring the contribution of a Skill",
      "Harness, runtime, and environment",
    ],
    href: "/guides/skills-in-the-agentic-performance-system",
    title: "Skills in the agentic performance system",
    summary:
      "A seven-lever framework for seeing Skills alongside models, data, tools, harnesses, software, evaluation, and trust.",
  },
  {
    contentTopics: [
      "Generative flexibility",
      "Nondeterminism as a system property",
      "Four levels of reproducibility",
      "Repeated-run reliability",
      "Variability budgets",
      "Skills and deterministic scripts",
      "Guardrails and evals",
      "Vendor-risk review example",
      "Constraint violation rates",
      "Accountable human judgment",
    ],
    href: "/guides/controlled-variation-agent-nondeterminism",
    title: "Controlled variation: the capability and control problem of AI agents",
    summary:
      "Why agent flexibility creates both novel problem-solving value and reliability risk—and how Skills, scripts, guardrails, and evals control the tradeoff.",
  },
  {
    contentTopics: [
      "How to use this library",
      "A twelve-resource starting shelf",
      "Agentic AI Foundation and the Linux Foundation",
      "Anthropic, OpenAI, Google, and Microsoft",
      "Research papers and benchmarks",
      "O'Reilly Radar",
      "Independent trust and lifecycle baselines",
      "Reading paths for different audiences",
      "Citation hygiene",
    ],
    href: "/guides/agentic-performance-source-library",
    title: "Agentic performance source library",
    summary:
      "An annotated, source-labeled reading map spanning AAIF, major providers, research papers, and O'Reilly Radar.",
  },
  {
    contentTopics: [
      "Use AI as an editor",
      "A practical editing loop",
      "Authenticity and voice",
      "Patterns worth watching",
      "Four skills, reviewed",
      "Humanizer by blader",
      "Humanizer Skill by Aboudjem",
      "NVIDIA SkillSpector",
      "Static SkillSpector evidence",
      "Prompt injection and profile loading",
      "Test safely before installation",
      "A reusable editor brief",
    ],
    href: "/guides/writing-without-the-ai-sheen",
    title: "Writing without the AI sheen",
    summary:
      "A practical authenticity-first editing workflow, with static safety evidence for four community writing skills.",
  },
  {
    contentTopics: [
      "Start with the trust boundary",
      "Data movement and cloud API access",
      "Primary documentation",
      "Least privilege and approved endpoints",
      "A quick decision test",
      "Scan, then still make a judgment",
      "Internal governed workflows",
    ],
    href: "/guides/when-not-to-use-a-skill",
    title: "When not to use a skill",
    summary:
      "A decision guide for choosing primary documentation or a governed internal workflow instead of a third-party agent skill.",
  },
  {
    contentTopics: [
      "Treat the candidate as untrusted",
      "Check sources in order",
      "Provenance and complete contents",
      "Permissions and dependencies",
      "Security and reliability gates",
      "Will it update automatically",
      "Evidence-backed decision",
      "Confidence gates",
    ],
    href: "/guides/so-you-found-a-skill-checklist",
    title: "So you found a skill: pre-install confidence checklist",
    summary:
      "A source-backed checklist for reviewing a skill's provenance, behavior, dependencies, permissions, reliability, and update path before installation.",
  },
  {
    contentTopics: [
      "An early gate, not a safety certificate",
      "Three-stage decision path",
      "Preliminary static scan",
      "Additional LLM semantic assessment",
      "Exact artifact in two passes",
      "Completeness before the score",
      "Score as triage",
      "Enterprise decision",
      "Presentation and training sources",
    ],
    href: "/guides/skillspector-enterprise-training",
    title: "NVIDIA SkillSpector enterprise training guide",
    summary:
      "A practical guide to screening an agent skill before installation and turning scanner output into a defensible human decision.",
  },
  {
    contentTopics: [
      "Review the complete target",
      "Screen every bundled skill",
      "OWASP prompt-injection patterns",
      "Scoped semantic review",
      "Interpret findings, not scores",
      "Constrained installation decision",
      "Static analysis",
    ],
    href: "/guides/reviewing-ui-ux-pro-max-with-skillspector",
    title: "Reviewing UI/UX Pro Max with NVIDIA SkillSpector",
    summary:
      "A case study in reviewing a skill bundle with static analysis, OWASP prompt-injection triage, and a scoped semantic second opinion before installation.",
  },
  {
    contentTopics: [
      "The fourteen-skill map",
      "What each category does",
      "Static scan at a glance",
      "Per-skill results and JSON evidence",
      "How to read the findings",
      "Archived ChatGPT thread",
      "Commit-pinned review",
      "NVIDIA SkillSpector",
      "Sources and audit files",
    ],
    href: "/guides/obra-superpowers-skillspector-review",
    title: "Obra Superpowers: 14 skills and a SkillSpector review",
    summary:
      "A commit-pinned map of Obra's 14-skill workflow, with per-skill static findings, JSON evidence, and the archived research thread that started the review.",
  },
  {
    contentTopics: [
      "The 37-skill map",
      "Security review",
      "Engineering skills",
      "Productivity, misc, and beta",
      "Community feedback",
      "Compared with Superpowers",
      "NVIDIA SkillSpector",
      "Adopt selectively",
      "Skill-by-skill static evidence",
    ],
    href: "/guides/matt-pocock-skills-skillspector-review",
    title: "Matt Pocock’s Skills for Real Engineers: all 37 reviewed",
    summary:
      "A commit-pinned, skill-by-skill review of Matt Pocock’s modular engineering collection, with SkillSpector evidence, community feedback, and a direct comparison to Obra Superpowers.",
  },
  {
    contentTopics: [
      "A reusable operating procedure",
      "Frontmatter makes the workflow discoverable",
      "Ordered behavior",
      "Implicit activation",
      "NVIDIA SkillSpector",
      "Safety boundaries",
      "Codex skill anatomy",
      "Skill-authoring checklist",
    ],
    href: "/guides/skillspector-skill-demo",
    title: "What an agent skill looks like: SkillSpector Review",
    summary:
      "An annotated walkthrough of a real Codex skill that turns a security policy into a discoverable, reusable workflow.",
  },
  {
    contentTopics: [
      "skills.sh security audits",
      "Gen Agent Trust Hub",
      "Socket",
      "Snyk",
      "Direct skills.sh URL",
      "Unlisted third-party skill",
      "Audit freshness",
      "Registry evidence",
      "Downloadable Codex skill",
    ],
    href: "/guides/vercel-skills-sh-security-check",
    title: "skills.sh Security Check: collect three audit reports",
    summary:
      "Download a Codex skill that finds the current Gen Agent Trust Hub, Socket, and Snyk evidence for a third-party skill without installing it first.",
  },
  {
    contentTopics: [
      "Optimization loop",
      "Skill definition becomes trainable text",
      "Developer experience",
      "Evaluator and evaluation layer",
      "Research maturity",
      "Total cost",
      "Authority boundary",
      "Agentic self-service",
      "Measured adoption decision",
    ],
    href: "/guides/microsoft-skillopt-third-party-snapshot",
    title: "Microsoft SkillOpt: third-party developer snapshot",
    summary:
      "An independent developer review of SkillOpt's maturity, operating costs, security boundaries, and fit for governed self-service skills.",
  },
  {
    contentTopics: [
      "JetBrains benchmark",
      "Terse agent narration",
      "Advertised 65% token saving",
      "Measured 8.5% saving",
      "Results that generalize",
      "Enterprise FinOps takeaway",
      "Defensible pilot",
    ],
    href: "/guides/jetbrains-caveman-token-benchmark",
    title: "JetBrains tests Caveman: real token savings",
    summary:
      "A reading guide to JetBrains' paired benchmark of terse agent narration, where the advertised 65% saving became 8.5% on real coding-agent work.",
  },
  {
    contentTopics: [
      "rtk command-output compression",
      "60–90% token claim",
      "Token counter and agent bill",
      "The counterfactual problem",
      "Completed work",
      "Compression versus cost",
      "Defensible pilot",
    ],
    href: "/guides/jetbrains-rtk-token-benchmark",
    title: "JetBrains tests rtk: compression versus the bill",
    summary:
      "A reading guide to JetBrains' rtk trial and its warning that a tool's token counter can rise while the measured agent bill does too.",
  },
  {
    contentTopics: [
      "Ponytail minimal-code guidance",
      "54% code reduction claim",
      "What JetBrains tested",
      "Results and limits",
      "Over-building",
      "Preserve the guardrails",
      "Defensible pilot",
    ],
    href: "/guides/jetbrains-ponytail-code-benchmark",
    title: "JetBrains tests Ponytail: measured minimal code",
    summary:
      "A reading guide to JetBrains' Ponytail benchmark, where minimal-code guidance cut emitted code and cost most on over-built tasks.",
  },
  {
    contentTopics: [
      "About this verbatim edition",
      "Publisher-hosted original PDF",
      "Planning and design",
      "Testing and iteration",
      "Distribution and sharing",
      "Patterns and troubleshooting",
      "Source attribution",
    ],
    href: "/guides/anthropics-complete-guide-for-building-skills-for-claude",
    title: "Anthropic’s Complete Guide For Building Skills For Claude [VERBATIM]",
    summary:
      "Anthropic’s original 33-page guide, presented through the publisher-hosted PDF with clear source attribution and no editorial rewriting.",
  },
];

export const featuredGuide = guideCatalog.find((guide) => guide.featured);
