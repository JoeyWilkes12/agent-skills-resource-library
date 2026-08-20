---
title: Agentic performance source library
type: Annotated research notes
status: Curated working bibliography
last_verified: 2026-08-20
related: ../drafts/skills-in-the-agentic-performance-system.md
---

# Agentic performance source library

*A curated reading map for understanding how models, guidance, data, tools, software, runtimes, architecture, evaluation, and governance combine to shape professional agentic outcomes.*

## How to use this library

This is not a list of “best agent platforms.” It is a source map for the seven performance levers in [Skills in the agentic performance system](../drafts/skills-in-the-agentic-performance-system.md):

1. **Purpose** — what good looks like;
2. **Intelligence** — which model configuration can do the work;
3. **Guidance** — what method it should follow;
4. **Grounding** — what it should know now;
5. **Action** — what it can see, use, or change;
6. **Execution** — how the work runs;
7. **Assurance** — how people know, diagnose, and improve.

Security, privacy, identity, governance, accessibility, and human authority form a **trust boundary** around all seven.

The sources are deliberately labeled by evidence type:

| Source type | Best use | Important limitation |
| --- | --- | --- |
| Open standard, specification, or foundation resource | Definitions, interoperability, governance, ecosystem structure | A standard does not prove that an implementation performs well |
| Official architecture or product documentation | Current capabilities, implementation patterns, operational details | Describes the publisher's stack and may change quickly |
| Vendor engineering or research article | Lessons learned from real systems and experiments | Results may not generalize to other models, harnesses, or environments |
| Peer-reviewed paper | Methods and findings that have passed scholarly review | Benchmarks can still be narrow or age quickly |
| arXiv preprint | Early evidence and emerging questions | arXiv is a repository, not peer review; findings remain provisional |
| O'Reilly Radar article | Practitioner synthesis, vocabulary, and provocative framing | Commentary is not a standard or independent validation of product claims |

For presentation citations, prefer the first four categories for factual claims. Use O'Reilly to make the ideas approachable and to surface tensions worth discussing.

## A twelve-resource starting shelf

For an audience that should not have to absorb the full bibliography, begin here:

1. [Building effective agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) for the difference between fixed workflows and agents, and for the “augmented LLM” mental model.
2. [A practical guide to building agents — OpenAI](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) for a beginner-friendly progression through models, tools, instructions, orchestration, and guardrails.
3. [Agentic AI patterns and workflows — AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/agent-patterns.html) for reusable architecture patterns and the perception–reason–action loop.
4. [Agentic AI architecture guides — Google Cloud](https://docs.cloud.google.com/architecture/agentic-ai-overview?hl=en) for a browsable map from single-agent systems to multi-agent, enterprise data, and security scenarios.
5. [AI agent orchestration patterns — Microsoft](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) for explicit tradeoffs among sequential, concurrent, group-chat, handoff, and manager-led patterns.
6. [Agentic AI Foundation — current projects and working groups](https://github.com/aaif) for the vendor-neutral open infrastructure landscape.
7. [Agent Skills specification](https://agentskills.io/specification) for the portable structure of procedural guidance.
8. [Model Context Protocol architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture) for the distinction between hosts, clients, servers, tools, resources, prompts, consent, and security boundaries.
9. [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) for treating context as a finite system resource rather than an ever-growing prompt.
10. [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) for tasks, trials, graders, traces, outcome state, and the model–harness pairing.
11. [Evaluate agent workflows — OpenAI](https://developers.openai.com/api/docs/guides/agent-evals) for trace-based evaluation and regression workflows.
12. [What We Learned from a Year of Building with LLMs, Part I — O'Reilly Radar](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/) for an accessible practitioner bridge from prompting to retrieval, workflows, evaluation, and monitoring.

## Agentic AI Foundation and the Linux Foundation

The Agentic AI Foundation (AAIF) is useful here for a specific reason: it provides a neutral home for open projects and working groups at the **interfaces between agentic systems**. It should not be presented as a complete reference architecture, certification authority, or guarantee of quality.

The [Linux Foundation launch announcement](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) identifies MCP, goose, and AGENTS.md as the three founding project contributions in December 2025. The [current AAIF organization page](https://github.com/aaif) now also lists agentgateway and Agent2Agent (A2A). That distinction matters: “founding projects” and “current hosted projects” are not the same claim.

### Projects and open infrastructure

| Resource | What it contributes | Performance levers |
| --- | --- | --- |
| [AAIF home and current project map](https://aaif.io/) | A high-level entry point to AAIF projects, participation, and events | Action, Execution, Trust boundary |
| [AAIF GitHub organization](https://github.com/aaif) | The most useful current index of hosted projects, working groups, governance, proposals, and the taxonomy workstream | All levers; especially Execution and Assurance |
| [Model Context Protocol](https://modelcontextprotocol.io/) and its [architecture specification](https://modelcontextprotocol.io/specification/2025-06-18/architecture) | A standard interface for connecting agent hosts to tools, resources, and prompts while keeping host responsibilities visible | Grounding, Action, Execution, Trust boundary |
| [AGENTS.md](https://agents.md/) | A predictable repository location for instructions that coding agents should follow | Guidance |
| [goose](https://goose-docs.ai/) | A local-first, model-flexible agent harness and practical proving ground for MCP-enabled workflows | Guidance, Action, Execution |
| [agentgateway](https://github.com/agentgateway) | A gateway layer for service, model, and MCP traffic; relevant to policy enforcement and observability at the action boundary | Action, Execution, Assurance, Trust boundary |
| [Agent2Agent project](https://github.com/a2aproject) | An open protocol for discovery and communication between independently implemented agents | Action, Execution, Trust boundary |

MCP, A2A, and Skills solve different problems. MCP standardizes access to context and capabilities. A2A standardizes inter-agent communication. Skills package procedural guidance. None of them, by itself, supplies clean data, correct permissions, a good professional method, or evidence that the workflow succeeds.

### Working groups worth watching

AAIF's working groups are especially relevant because their scopes closely match the outer trust and assurance layers of the proposed visual:

| AAIF group | Why it matters to this framework |
| --- | --- |
| [Accuracy and Reliability](https://github.com/aaif/wg-accuracy-and-reliability) | System-level quality, repeatability, failure characterization, and reliability practices |
| [Observability and Traceability](https://github.com/aaif/wg-observability-and-traceability) | Shared vocabulary and instrumentation for understanding agent behavior |
| [Identity and Trust](https://github.com/aaif/wg-identity-and-trust) | Agent identity, delegated authority, trust relationships, and accountable autonomy |
| [Security and Privacy](https://github.com/aaif/wg-security-and-privacy) | Threats introduced by tools, protocols, external data, memory, and side effects |
| [Governance, Risk, and Regulatory](https://github.com/aaif/wg-governance-risk-and-regulatory) | Lifecycle governance and alignment with organizational and regulatory obligations |
| [Workflows and Process Integration](https://github.com/aaif/wg-workflows-and-process-integration) | How agents participate in real business processes rather than isolated demonstrations |
| [Taxonomy and Landscape workstream](https://github.com/aaif/ws-taxonomy-landscape) | Shared language for a fragmented ecosystem and stewardship of the landscape |

These repositories are active community work, not finished standards. Cite them as places where the relevant problems are being defined and coordinated.

### Ecosystem research and discovery

| Resource | Useful takeaway | Caveat |
| --- | --- | --- |
| [AAIF Landscape](https://landscape.aaif.io/) | A broad catalog for discovering projects across the agentic stack | Inclusion is not an endorsement or performance certification |
| [Agentic AI Momentum](https://insights.linuxfoundation.org/report/agentic-ai-momentum) and its [AAIF report narrative](https://aaif.io/blog/agentic-ai-momentum-report) | An ecosystem view of activity, contributor health, project concentration, and security debt across five layers | Repository activity and estimated software value are not measures of workflow quality |
| [Open Source and the Future of AI — Linux Foundation Research](https://www.linuxfoundation.org/research/AI-exec-forum-2026?hsLang=en) | Leadership questions around identity, privacy, regulated use, accountability, vocabulary, and security scaffolding | A forum summary and analysis, not a technical standard |
| [AAIF Technical Committee](https://github.com/aaif/technical-committee) and [project proposals](https://github.com/aaif/project-proposals) | Visible governance and a way to inspect how projects enter the foundation | Governance health still needs to be judged project by project |

## Amazon Web Services

AWS has unusually broad material spanning design patterns, security architecture, runtime services, evaluation, and production operations. The general architecture guidance is portable; the AgentCore implementation details are AWS-specific.

| Resource | Why it is useful | Performance levers |
| --- | --- | --- |
| [Agentic AI patterns and workflows on AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/agent-patterns.html) | A reusable pattern language grounded in perception, reasoning, and action; useful for comparing deterministic and agentic structures | Purpose, Action, Execution |
| [System design and security recommendations for agentic AI](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-system-design.html) | Explicitly recommends deterministic logic where AI is unnecessary, careful agent scoping, shared-memory management, and session isolation | Purpose, Grounding, Execution, Trust boundary |
| [Secure access, usage, and implementation of generative AI agents](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture-generative-ai/gen-auto-agents.html) | Connects autonomous tool use to identity, access, and security architecture | Action, Execution, Trust boundary |
| [Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html) | Concrete runtime responsibilities: identity, sessions, tool access, tracing, scaling, and deployment | Action, Execution, Assurance |
| [AgentCore harness](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html) | A current example of a declarative harness in which model, tools, Skills, and instructions are configured while the runtime supplies compute, memory, identity, networking, and observability | Intelligence, Guidance, Grounding, Action, Execution |
| [AgentOps: Operationalize agentic AI at scale](https://aws.amazon.com/blogs/machine-learning/agentops-operationalize-agentic-ai-at-scale-with-amazon-bedrock-agentcore/) | A lifecycle view organized around governance and security, build and operations, evaluation, and observability; also separates release-time evaluation from continuous monitoring | Execution, Assurance, Trust boundary |
| [Evaluating AI agents: real-world lessons from Amazon](https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/) | Makes the case for measuring the whole system: tool choice, multi-step reasoning, memory retrieval, task completion, responsibility, and cost | Assurance across every lever |
| [Debugging production agents with AgentCore Observability](https://aws.amazon.com/blogs/machine-learning/debugging-production-agents-with-amazon-bedrock-agentcore-observability/) | Shows why standard service health is insufficient when an agent can loop, choose the wrong tool, or produce plausible failure | Execution, Assurance |

## Anthropic

Anthropic's engineering writing is strongest when used as a set of design and evaluation lessons, not as universal laws. Several articles make the model–harness–environment coupling unusually explicit.

| Resource | Why it is useful | Performance levers |
| --- | --- | --- |
| [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | A clear introduction to augmented LLMs, fixed workflows, autonomous agents, routing, parallelization, orchestrator–worker patterns, and evaluator–optimizer loops | Purpose, Guidance, Action, Execution |
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Treats system instructions, tools, MCP, external data, history, retrieval, and compaction as one finite context-design problem | Guidance, Grounding, Execution |
| [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Shows that tool names, descriptions, parameters, return shapes, and evaluation directly affect agent performance | Action, Assurance |
| [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Explores incremental progress, structured handoffs, artifacts, and context resets across long tasks | Guidance, Grounding, Execution |
| [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | A newer multi-agent planner–generator–evaluator architecture and a concrete discussion of when naive long-running loops lose coherence | Purpose, Guidance, Execution, Assurance |
| [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Defines task, trial, grader, transcript, outcome, eval harness, agent harness, capability suite, and regression suite; recommends repeated trials and transcript review | Assurance |
| [Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise) | Evidence that CPU, memory, disk, networking, and evaluation setup can change benchmark results enough to distort model comparisons | Intelligence, Execution, Assurance |
| [Trustworthy agents in practice](https://www.anthropic.com/research/trustworthy-agents) | Frames trust across model, harness, tools, and environment, including permissions and human control | All levers; especially Trust boundary |

## OpenAI

OpenAI's current developer documentation is most useful when read as a connected set: model selection, orchestration, Skills, context management, traces, datasets, and graders are parts of one optimization loop.

| Resource | Why it is useful | Performance levers |
| --- | --- | --- |
| [A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) | The most accessible OpenAI overview of models, tools, instructions, single- versus multi-agent orchestration, layered guardrails, and human intervention | Purpose, Intelligence, Guidance, Action, Execution, Trust boundary |
| [Model guidance](https://developers.openai.com/api/docs/guides/latest-model) | Current model-family guidance and an important optimization rule: lower resource use is an improvement only when the result continues to pass the workflow's evals | Intelligence, Assurance |
| [Skills](https://developers.openai.com/api/docs/guides/tools-skills) | Defines a Skill as a versioned bundle with a `SKILL.md` manifest, files, and compatibility with the open Agent Skills standard | Guidance |
| [Orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration) | Current implementation guidance for agents as tools, handoffs, manager patterns, and orchestration tradeoffs | Execution |
| [Compaction](https://developers.openai.com/api/docs/guides/compaction) | Current context-management guidance for long-running Responses workflows | Grounding, Execution |
| [Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals) | Connects full traces, graders, datasets, and eval runs to workflow debugging and regression detection | Assurance |
| [Evals](https://developers.openai.com/api/docs/guides/evals) | A general path from test data and criteria to repeatable evaluation runs | Purpose, Assurance |
| [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Guidance on task-relevant datasets, graders, human calibration, and avoiding misleading evaluation designs | Purpose, Assurance |

## Google

Google's sources are valuable at three levels: open framework and protocol documentation, managed runtime architecture, and controlled research on multi-agent scaling and memory.

| Resource | Why it is useful | Performance levers |
| --- | --- | --- |
| [Agentic AI architecture guides](https://docs.cloud.google.com/architecture/agentic-ai-overview?hl=en) | A current index of design guides and reference architectures across single-agent, multi-agent, multi-tenant, data, analytics, and security use cases | Purpose, Grounding, Action, Execution, Trust boundary |
| [Agent Development Kit documentation](https://adk.dev/) | Open framework documentation for agents, tools, orchestration, sessions, memory, evaluation, deployment, and observability | Guidance, Grounding, Action, Execution, Assurance |
| [Gemini Enterprise Agent Platform: Scale your agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) | A concrete production stack joining runtime, sessions, memory, example retrieval, evaluation, optimization, IAM, and observability | Grounding, Action, Execution, Assurance |
| [Agents CLI evaluation guide](https://google.github.io/agents-cli/guide/evaluation/) | A practical eval–fix loop with datasets, trace generation, grading, comparison, failure analysis, and prompt optimization | Assurance |
| [Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) | The originating design rationale for A2A and its focus on communication across different frameworks and vendors | Action, Execution |
| [Towards a science of scaling agent systems](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/) | Controlled evidence that multi-agent coordination helps parallelizable tasks but can materially hurt sequential work and amplify errors | Purpose, Execution, Assurance |
| [ReasoningBank: enabling agents to learn from experience](https://www.research.google/blog/reasoningbank-enabling-agents-to-learn-from-experience/) | A recent memory architecture that distills experience and retrieves task-relevant reasoning memories; useful as an emerging pattern, not a settled default | Grounding, Execution, Assurance |
| [Monitor an agent](https://cloud.google.com/agent-builder/agent-engine/manage/monitoring) | Concrete runtime metrics, custom metrics, and alerting for deployed agents | Execution, Assurance |

## Microsoft

Microsoft's architecture material is helpful because it repeatedly distinguishes model behavior from workload design and treats nondeterminism as an operational concern.

| Resource | Why it is useful | Performance levers |
| --- | --- | --- |
| [Agents hub](https://learn.microsoft.com/en-us/agents/) | A current map of Microsoft's agent concepts, adoption guidance, architecture, products, and developer paths | Orientation across all levers |
| [Agent archetype framework](https://learn.microsoft.com/en-us/agents/agent-archetypes/) | A beginner-friendly shared language of categories, capabilities, and components for discussing agent scenarios without immediately choosing products | Purpose, Guidance, Execution |
| [AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) | Technology-agnostic comparison of sequential, concurrent, group-chat, handoff, and manager-led patterns, including failure and state concerns | Purpose, Execution, Assurance |
| [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/) | A current implementation model spanning agents, an opinionated harness, graph workflows, sessions, memory providers, middleware, MCP, telemetry, and human checkpoints | Guidance, Grounding, Action, Execution, Assurance |
| [Search and tool-use architectures](https://learn.microsoft.com/en-us/agents/architecture/search-tool-use-architectures) | Separates agents, tools, and Skills and explains model-agnostic patterns for search and action | Guidance, Grounding, Action |
| [RAG solution design and evaluation guide](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide) | Connects business requirements, representative queries and documents, parsing, chunking, enrichment, embeddings, retrieval, and evaluation | Purpose, Grounding, Assurance |
| [AI workload documentation](https://learn.microsoft.com/en-us/azure/well-architected/ai/) | Places application design, training and grounding data, platform, operations, evaluation, and responsible AI inside one workload architecture | All levers |
| [Test and evaluate AI workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/test) | Explicitly distinguishes model evaluation from whole-system testing and includes agentic workflow and grounding-data validation | Assurance |
| [Responsible AI in Azure workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/responsible-ai) | Applies auditability, role-based access, circuit breakers, data ingress and egress control, integrity, and human checkpoints to agentic systems | Trust boundary, Action, Assurance |
| [Run agent evaluations with the Azure Developer CLI](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/azure-developer-cli-evaluation) | A practical measured-quality loop with versioned agents, datasets, evaluators, thresholds, reruns, and trace evaluation for long-running or A2A agents | Assurance |

## Research papers and benchmarks

### A note about arXiv

[arXiv](https://arxiv.org/) is an indispensable public repository, but appearance on arXiv does **not** mean a paper has been peer reviewed. The table therefore identifies publication status only where the paper's own record makes it clear. Even peer-reviewed benchmarks should be treated as diagnostic instruments rather than universal rankings: agent performance depends on the task distribution, tools, harness, runtime, budgets, and graders.

| Paper | Status | What it contributes | Performance levers |
| --- | --- | --- | --- |
| [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | NeurIPS 2020 | The foundational formulation combining parametric generation with retrieved non-parametric memory | Grounding |
| [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | ICLR 2023 | Interleaves reasoning traces with actions and observations from an external environment | Action, Execution |
| [Lost in the Middle](https://arxiv.org/abs/2307.03172) | TACL 2023 | Shows that long context is not uniformly usable and that the position of relevant information can materially affect performance | Grounding, Assurance |
| [AgentBench: Evaluating LLMs as Agents](https://arxiv.org/abs/2308.03688) | ICLR 2024 | Evaluates agents across multiple interactive environments and analyzes long-horizon reasoning, decisions, and instruction-following failures | Intelligence, Execution, Assurance |
| [SWE-bench](https://arxiv.org/abs/2310.06770) | ICLR 2024 | Uses real repositories, issues, execution environments, and end-state tests to evaluate software-engineering agents | Action, Execution, Assurance |
| [OSWorld](https://arxiv.org/abs/2404.07972) | arXiv record | A reproducible real-computer environment with execution-based grading across web and desktop applications | Action, Execution, Assurance |
| [$\tau$-bench](https://arxiv.org/abs/2406.12045) | arXiv preprint | Evaluates user interaction, domain policies, API tools, database end state, and reliability across repeated trials with pass^k | Purpose, Guidance, Action, Assurance |
| [MemGPT](https://arxiv.org/abs/2310.08560) | arXiv preprint | An operating-system-inspired approach to hierarchical memory and context management across long interactions | Grounding, Execution |
| [Toolformer](https://arxiv.org/abs/2302.04761) | arXiv record | Investigates when and how a language model can learn to call external APIs | Intelligence, Action |
| [Harness-Bench](https://arxiv.org/abs/2605.27922) | 2026 arXiv preprint | Directly studies model–harness configurations under shared tasks and reports completion, process quality, efficiency, and failure behavior | Intelligence, Execution, Assurance |
| [The Scaffold Effect in Coding Agents](https://arxiv.org/abs/2607.22585) | Preliminary 2026 work; under review when verified | Treats harness choice as a hidden variable and reports different failure fingerprints and resource use across model–harness pairs | Intelligence, Execution, Assurance |

The last two papers are unusually relevant to this framework because they test its central claim: the useful comparison unit is often the configured agent system, not the model name alone. They are also recent preprints, so they should inspire evaluation design rather than settle the question.

## O'Reilly Radar

O'Reilly Radar is most valuable here as a bridge between technical evidence and an audience learning how to think about agentic systems. Use these articles for narrative, questions, and practitioner heuristics; use the primary sources above for specifications and strong factual claims.

### Durable foundations

| Article | Why reference it | Performance levers |
| --- | --- | --- |
| [What We Learned from a Year of Building with LLMs, Part I](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/) | A dense but practical guide to prompting, structured outputs, retrieval, multi-step flows, evaluation, monitoring, and guardrails | Guidance, Grounding, Execution, Assurance |
| [Part II: Operations](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-ii/) | Treats operational practices, data, feedback, experimentation, and team design as part of product performance | Purpose, Execution, Assurance |
| [Part III: Strategy](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-iii-strategy/) | Argues that the model is not the product, recommends starting simple, and connects evals and data collection to a compounding improvement loop | Purpose, Intelligence, Assurance |
| [Software Architecture in an AI World](https://www.oreilly.com/radar/software-architecture-in-an-ai-world/) | An approachable discussion of retrieval, judges, tool use, planning, reflection, and multi-agent collaboration as architectural patterns | Grounding, Action, Execution |
| [Beyond Prompt-and-Pray](https://www.oreilly.com/radar/beyond-prompt-and-pray/) | A useful counterweight to autonomy hype: put deterministic, testable business logic around probabilistic language understanding when reliability requires it | Purpose, Guidance, Execution, Trust boundary |
| [Escaping POC Purgatory](https://www.oreilly.com/radar/escaping-poc-purgatory-evaluation-driven-development-for-ai-systems/) | Frames evaluation and error analysis as the development loop rather than a final gate | Assurance across all levers |

### Newer agent-specific perspectives

| Article | Why reference it | How to frame it |
| --- | --- | --- |
| [Stop Overengineering Your Agent Harness](https://www.oreilly.com/radar/stop-overengineering-your-agent-harness/) | Defines the harness through loop, tool execution, context, state, and safety, then relates needed complexity to action and context complexity | A practitioner heuristic, useful for explaining why more architecture is not automatically more performance |
| [The AI Agents Stack: 2026 Edition](https://www.oreilly.com/radar/the-ai-agents-stack-2026-edition/) | A current market-oriented stack view that includes evals, observability, guardrails, memory, and runtime | A landscape snapshot, not a neutral product benchmark |
| [The New Software Lifecycle](https://www.oreilly.com/radar/the-new-software-lifecycle/) | Directly connects static versus dynamic context, rule files, Skills, RAG, permissions, trajectory evaluation, and deployment | A timely narrative companion to the rotating performance visual |
| [Agent Memory](https://www.oreilly.com/radar/agent-memory/) | An accessible taxonomy of semantic, episodic, procedural, entity, working, and summary memory, plus the problems of scope, correction, retrieval, and drift | An explanatory taxonomy; implementation examples are vendor-shaped |
| [Long-Running Agents](https://www.oreilly.com/radar/long-running-agents/) | Explores pause and resume, execution state, memory layers, artifacts, identities, gateways, and audit over extended work | A broad practitioner vision; pair it with harness and evaluation research |
| [The Missing Layer in Agentic AI](https://www.oreilly.com/radar/the-missing-layer-in-agentic-ai/) | Proposes a deterministic execution boundary between probabilistic reasoning and privileged side effects | A design argument for high-consequence workflows, not a universal architecture |
| [The Agent Stack Bet](https://www.oreilly.com/radar/the-agent-stack-bet/) | Connects identity, universal context, persistent state, observability, and governance to the production gap | A provocative systems perspective and discussion starter |

## Independent trust and lifecycle baselines

Vendor documentation explains how to build on a platform; independent frameworks help keep the conversation anchored in organizational responsibility.

| Resource | Why it belongs | Performance levers |
| --- | --- | --- |
| [NIST AI Risk Management Framework Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) | Organizes continuous work around Govern, Map, Measure, and Manage across the lifecycle | Purpose, Assurance, Trust boundary |
| [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | Extends the AI RMF to generative-AI-specific risks, contexts, measurement, and management | All levers; especially Trust boundary |
| [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/) | A vendor-neutral foundation for consistent traces, metrics, logs, events, and resource attributes | Execution, Assurance |

## What the sources collectively support

Across foundations, cloud providers, model providers, research papers, and practitioner writing, several themes recur strongly enough to anchor the presentation:

1. **The model is a component, not the outcome.** The harness, instructions, context, tools, environment, and graders change what the model can accomplish.
2. **Start with the work, not the architecture.** Define the user, end state, acceptable variation, authority, and review path before selecting an agent pattern.
3. **Prefer the least complicated structure that passes the evals.** A deterministic function, fixed workflow, or single agent is often better than a multi-agent system when the task does not benefit from added autonomy or parallelism.
4. **Context is selected, not merely accumulated.** Better performance depends on relevance, authority, freshness, placement, compaction, and memory policy—not just context-window size.
5. **Tools and software interfaces are part of intelligence in practice.** A model cannot reliably overcome ambiguous schemas, overlapping tool descriptions, weak errors, unsafe permissions, or an unstable interface.
6. **Protocols improve interoperability, not correctness.** MCP, A2A, and similar standards reduce bespoke integration, while data quality, method quality, authorization, and evaluation remain separate responsibilities.
7. **Evaluate outcomes and trajectories.** End-state checks answer whether the job was completed; traces reveal where selection, retrieval, reasoning, tool use, state, or recovery failed.
8. **Variation is a system property.** Multiple trials, representative environments, pinned configurations, and runtime controls are necessary for meaningful comparisons.
9. **Trust belongs around the system.** Identity, least privilege, confirmation, audit, reversibility, privacy, and human authority shape every lever rather than appearing as a final gate.
10. **Cost should be optimized against a passing quality bar.** Tokens, latency, retries, infrastructure, and human review are valuable metrics only in relation to a correct and useful outcome.

## Reading paths for different audiences

### New to agentic workflows — approximately 60 minutes

1. [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
2. [A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
3. [AAIF current projects](https://github.com/aaif)
4. [AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
5. The first half of [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

The inspirational message is: **you do not need the entire stack to begin; you need one valuable outcome and enough structure to learn whether it worked.**

### Designing Skills and reusable guidance

1. [Agent Skills specification](https://agentskills.io/specification)
2. [OpenAI Skills documentation](https://developers.openai.com/api/docs/guides/tools-skills)
3. [AGENTS.md](https://agents.md/)
4. [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
5. [Writing effective tools](https://www.anthropic.com/engineering/writing-tools-for-agents)

### Architecture and production operations

1. [AWS agentic patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/agent-patterns.html)
2. [Google agentic architecture guides](https://docs.cloud.google.com/architecture/agentic-ai-overview?hl=en)
3. [Microsoft AI workload documentation](https://learn.microsoft.com/en-us/azure/well-architected/ai/)
4. [Anthropic long-running harness guidance](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
5. [OpenAI orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration)

### Evaluation and consistency

1. [Anthropic agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
2. [OpenAI agent evals](https://developers.openai.com/api/docs/guides/agent-evals)
3. [Amazon's evaluation lessons](https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/)
4. [Google Agents CLI evaluation guide](https://google.github.io/agents-cli/guide/evaluation/)
5. [$\tau$-bench](https://arxiv.org/abs/2406.12045), [SWE-bench](https://arxiv.org/abs/2310.06770), and [Harness-Bench](https://arxiv.org/abs/2605.27922)

## Citation hygiene for the final guide and presentation

- Link to the exact page that supports the claim, not a search result or company home page.
- Add the publisher and, for time-sensitive product documentation, the access or verification date.
- Distinguish a founding project from a project currently hosted by the same foundation.
- Do not call an arXiv preprint “peer reviewed” unless a venue is explicitly confirmed.
- Describe a landscape as a discovery tool, not an endorsement list.
- Treat vendor benchmark findings as evidence about the tested configuration, not every model or workflow.
- Prefer measured statements such as “in this evaluation” over universal statements such as “multi-agent systems are better.”
- Recheck current product, protocol, and working-group pages before publication; this ecosystem changes quickly.
