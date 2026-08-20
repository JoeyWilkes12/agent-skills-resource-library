---
title: Skills in the agentic performance system
type: Guide concept
status: First draft for discussion
---

# Skills in the agentic performance system

*A framework for understanding what shapes the performance, consistency, and eventual cost of a professional agentic workflow.*

## The central idea

A model does not perform professional work by itself. Neither does a Skill.

The outcome comes from a configured system: a task given to a particular model, operating under instructions, with selected context, data, tools, permissions, software, runtime behavior, and human oversight. Change any one of those conditions and the result can change.

This suggests a useful expansion of the [Spectrum of skill sophistication](https://agent-skills-resource-library.yoshirex12.chatgpt.site/guides/spectrum-of-skill-sophistication):

> **A professional outcome is a property of the whole agentic system, not a property of the model or Skill alone.**

Skills matter because they make a team's method reusable. They can package instructions, examples, references, templates, scripts, and verification steps. They can improve the way an agent approaches a recurring task. Their impact still depends on whether the Skill is discovered, selected, loaded, understood, executed, and supported by the rest of the system.

The first design question is therefore not “Which model is best?” or “How sophisticated is this Skill?” It is:

> **What combination of conditions helps this workflow produce a good professional outcome, repeatedly, in the environment where it will actually run?**

This draft focuses on performance. Cost deserves a second lens because the cheapest run is not economical if it creates rework, misses the task, or causes a consequential error. Cost telemetry should be collected from the beginning, but optimization should follow a credible performance baseline.

## What the current spectrum already explains well

The existing guide and tightrope image make four important ideas visible:

1. A useful first draft and a production-grade workflow are different promises.
2. Variability enters through more than the prompt: skill selection, tools, models, providers, runtime state, memory, and user language all matter.
3. More dynamic and autonomous systems require proportionately stronger engineering and evaluation.
4. Operational maturity is the ability to observe, test, maintain, and responsibly scale the workflow—not the number of features it contains.

The expansion changes the camera angle. The current spectrum follows a Skill from easy experimentation toward reliability. The new framework looks down on the whole system and asks where performance comes from, where it fails, and which lever should be changed next.

## What “performance” means

Performance is broader than whether the agent produced an answer. For professional work, it is useful to consider six dimensions.

| Dimension | The practical question |
| --- | --- |
| Task success | Did the workflow complete the intended job and produce the required end state? |
| Quality and correctness | Is the result accurate, complete, grounded, and professionally fit for use? |
| Consistency and robustness | Does it remain acceptable across realistic users, inputs, models, tools, and repeated trials? |
| Safety and trust | Did it respect permissions, privacy, policy, human authority, and the limits of its evidence? |
| Timeliness and reliability | Did it complete within the time available, recover from ordinary failures, and avoid unnecessary loops? |
| Usability and reviewability | Can a person understand, verify, correct, and confidently use the result? |

These dimensions will sometimes conflict. A very cautious workflow may be safe but unhelpfully slow. A highly autonomous workflow may complete more tasks but make its mistakes harder to catch. The appropriate balance depends on the promise, user, and consequence of the work.

## The seven levers of agentic performance

The system can be made understandable through seven plain-language questions.

| Lever | Beginner-friendly question | What it includes |
| --- | --- | --- |
| **1. Purpose** | What does good look like? | User, job, scope, success criteria, output contract, risk, autonomy, and human role |
| **2. Intelligence** | Which model can do this work? | Provider, model, version, modality, reasoning settings, context limits, and model-specific behavior |
| **3. Guidance** | What method should it follow? | System and developer instructions, prompts, Skills, examples, policies, schemas, and checklists |
| **4. Grounding** | What should it know right now? | Source data, RAG, retrieval, metadata, data models, freshness, lineage, context construction, and memory |
| **5. Action** | What can it see, use, or change? | Tools, APIs, connectors, plugins, MCP servers, permissions, and the software or interfaces being operated |
| **6. Execution** | How does the work run? | Agentic harness, runtime, planning loop, routing, orchestration, state, retries, checkpoints, infrastructure, and recovery |
| **7. Assurance** | How do we know and improve? | Evals, graders, traces, observability, feedback, guardrails, monitoring, change control, and ownership |

Security, privacy, identity, governance, accessibility, and human oversight form a **trust boundary around all seven levers**. They should not appear as a final compliance gate. They shape the purpose, data, permissions, actions, evaluation criteria, and deployment from the beginning.

The seven levers are not a literal formula, but they behave more like a chain than a leaderboard. A stronger model may not compensate for stale data. Better retrieval may not help if the agent selects the wrong tool. A meticulous Skill may not matter if the harness never loads it. Performance emerges from the fit between the parts.

## 1. Purpose: define the professional promise

The largest performance gains often come before model selection. A workflow needs a precise job.

Define:

- who the user is and what decision or action the output supports;
- the expected inputs, required output, and true end state;
- which cases are in scope, out of scope, ambiguous, or high risk;
- which facts must be sourced or verified;
- where professional judgment remains human;
- when the agent may act, must ask, or must stop;
- what an acceptable result looks like and how it will be reviewed.

“Summarize meeting notes” is a capability request. “Prepare a client follow-up that captures decisions, named owners, dates, unresolved questions, and no unsupported commitments, for an account manager to approve” is a testable professional promise.

This lever includes workflow and user-experience design. An agent can technically succeed and still fail the user if it appears in the wrong software, asks for information the system already has, hides uncertainty, or produces an output that is difficult to review.

## 2. Intelligence: select a model configuration, not a brand

Provider and model selection influence reasoning, instruction following, tool use, modalities, context handling, language coverage, safety behavior, latency, availability, and output style. Version and inference settings can matter as much as the model family.

Relevant choices include:

- provider and deployment region;
- model and pinned version or alias;
- supported modalities and tool-calling behavior;
- reasoning mode or effort;
- sampling and structured-output settings;
- context-window and output limits;
- rate limits, service reliability, and data-use terms;
- fallback or failover policy.

The right unit of evaluation is usually the **model plus its harness, instructions, tools, context, and environment**. Model leaderboards are useful for discovery, but they are not a substitute for running representative tasks in the intended system. Anthropic's evaluation guidance makes this coupling explicit, and its infrastructure study shows that runtime configuration alone can shift agentic benchmark outcomes by several percentage points ([agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [infrastructure noise](https://www.anthropic.com/engineering/infrastructure-noise)).

A practical comparison holds the rest of the configuration constant, runs multiple trials, and measures the dimensions that matter for the workflow—not only final-answer quality.

## 3. Guidance: encode the method

Guidance tells the model how to approach the work. It includes instruction hierarchy, task prompts, policies, examples, output schemas, and Skills.

### What a Skill contributes

An Agent Skill is a reusable package of procedural context. The open Agent Skills format uses a required `SKILL.md` and can include scripts, references, and assets. Compatible agents use progressive disclosure: they first see the Skill's name and description, then load its instructions and supporting material when the task calls for them ([Agent Skills overview](https://agentskills.io/home), [specification](https://agentskills.io/specification)). OpenAI's current API documentation similarly describes a Skill as a versioned bundle of files plus a `SKILL.md` manifest that codifies processes and conventions ([OpenAI Skills](https://developers.openai.com/api/docs/guides/tools-skills)).

A well-designed Skill can improve performance by:

- making domain expertise available at the moment it is relevant;
- turning an implicit professional method into explicit steps and decision points;
- standardizing inputs, outputs, checks, and handoffs;
- teaching the agent when to use tools, references, or scripts;
- bundling templates and deterministic helpers;
- requiring verification before completion;
- making a workflow portable, inspectable, and version-controlled.

A Skill can also reduce performance when its description triggers too broadly or too narrowly, its instructions conflict with higher-priority rules, its examples anchor the model to the wrong pattern, its references are stale, or its procedure adds context and steps that the task does not need.

The Skill impact chain is:

> **Discover → select → load → execute → verify**

Each link needs its own test. “The output looked better once” does not tell us whether the Skill is selected reliably, followed faithfully, or robust to new inputs.

### What a Skill does not replace

A Skill is not:

- the base model or a model fine-tune;
- the agentic harness that decides how turns, tools, and state are managed;
- the source database or a guarantee that retrieved data is correct;
- the authentication and authorization layer for an external system;
- the tool protocol or software interface itself;
- an evaluation suite, production monitor, or governance program.

It can coordinate with these layers and improve how the agent uses them. It cannot make their limitations disappear.

## 4. Grounding: supply the right evidence and state

Grounding is the information made available for the current decision. It includes data sources, retrieval, context assembly, and memory.

Professional performance depends on familiar data fundamentals:

- source authority and ownership;
- accuracy, completeness, and consistency;
- structure, schema, and semantic definitions;
- metadata and entity relationships;
- freshness, version, and update cadence;
- lineage and provenance;
- access controls and security trimming;
- document parsing, chunking, and embedding choices;
- retrieval relevance, coverage, and ranking;
- deletion, retention, and correction processes.

RAG is not a synonym for “the agent knows our data.” It is a pipeline that retrieves external evidence and places selected material into context. Its performance depends on ingestion, chunking, metadata, indexing, retrieval, and evaluation. Microsoft's RAG design guide is helpful because it treats representative test queries, document structure, chunking, enrichment, embedding choice, retrieval, and evaluation as connected design decisions ([RAG design and evaluation guide](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)). The original RAG paper establishes the basic combination of parametric generation with non-parametric retrieval ([Lewis et al., 2020](https://papers.neurips.cc/paper/2020/file/6b493230205f780e1bc26945df7481e5-Paper.pdf)).

Memory and RAG solve different problems:

- **RAG** retrieves evidence from an external corpus for the present task.
- **Working state** carries intermediate facts, plans, and tool results within a run.
- **Longer-term memory** stores selected information across runs or sessions.
- **Context construction** decides which instructions, history, evidence, tool definitions, and state the model sees on the next turn.

More context is not automatically better. Irrelevant, duplicated, stale, or conflicting information can compete for attention. Anthropic's context-engineering guidance frames the problem as selecting the smallest high-signal context that supports the desired behavior, then managing that context over time ([effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

## 5. Action: design the agent-computer interface

Tools turn a model from a respondent into an actor. Their quality strongly shapes agent performance.

The action layer includes:

- read and write APIs;
- search, file, database, and code-execution tools;
- SaaS connectors and product-specific plugins;
- MCP clients and servers;
- browser or computer-use interfaces for software without suitable APIs;
- authentication, authorization, and delegated identity;
- the target application's data model, UI, rate limits, errors, and transaction behavior.

The software being operated is part of the agent's environment. Stable APIs with precise schemas, useful validation, typed errors, idempotent writes, and reversible actions are easier for an agent to use reliably than ambiguous APIs or shifting visual interfaces. Tool descriptions also matter: the model needs to know what a tool does, when to use it, what each argument means, what can fail, and how to verify success. Anthropic's tool-design guidance treats tool specifications and evaluation as direct performance levers ([writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)).

For consequential actions, design for least privilege, preview, confirmation, auditability, idempotency, and recovery. “The tool call returned success” is not always the professional end state. Verify the downstream record, file, message, reservation, or transaction.

### A vocabulary that prevents category confusion

| Mechanism | Primary job | It is not automatically... |
| --- | --- | --- |
| Skill | Package a reusable method, instructions, and optional resources/scripts | a live data connection, permission, or runtime |
| Tool | Expose one callable capability to read, compute, or act | a complete workflow or evidence that its result is correct |
| Connector or plugin | Package product-specific integrations and capabilities; meaning varies by platform | a universal interoperability standard |
| MCP | Standardize host-client-server exchange of resources, tools, and prompts | the source data, business process, or authorization policy itself |
| RAG | Retrieve relevant external evidence into model context | memory, a clean knowledge base, or guaranteed factuality |
| Memory | Persist selected state across steps or sessions | automatically current, relevant, or safe context |

The [MCP architecture specification](https://modelcontextprotocol.io/specification/2025-06-18/architecture) describes a host that coordinates isolated client connections to servers exposing capabilities such as resources, tools, and prompts. That makes MCP an important interface layer, while the host still owns consent, permissions, security policy, and context aggregation.

## 6. Execution: engineer the harness, runtime, and environment

The harness is the system around the model that turns responses into a running workflow. It manages the loop between reasoning, action, observation, and completion.

It can include:

- planning, routing, and decomposition;
- single-agent or multi-agent orchestration;
- tool selection and tool-result handling;
- stop conditions and output contracts;
- context-window management and compaction;
- working state, checkpoints, and resumability;
- retries, backoff, timeouts, and circuit breakers;
- concurrency and coordination;
- sandboxing and execution permissions;
- network access, compute, storage, and dependency versions;
- model fallback, failure handling, and human handoff.

Architecture should match the task. A fixed workflow is often preferable when the path is known and auditable. A single agent with a small tool set is often easier to evaluate and maintain than a multi-agent network. Greater autonomy and coordination can help when the task genuinely requires adaptive search, parallel work, or specialization, but each new handoff adds state, context, failure modes, latency, and evaluation work. Anthropic's production guidance recommends beginning with the simplest pattern that works and distinguishes fixed workflows from model-directed agents ([building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

The runtime is not a neutral box. CPU, memory, time limits, network conditions, dependency availability, service incidents, and shared state can change whether an agent succeeds. Reproducible environments, pinned dependencies, isolated trials, clean state, and realistic deployment conditions are performance controls as well as software-engineering hygiene.

## 7. Assurance: make performance observable and improvable

Evals do more than score a finished answer. A useful assurance system helps a team locate failure and decide which lever to change.

It combines:

- representative tasks and edge cases;
- explicit outcome criteria and rubrics;
- deterministic graders, model graders, and human judgment;
- repeated trials for nondeterministic behavior;
- traces of prompts, tool calls, retrieval, state changes, and errors;
- pre-release capability and regression evals;
- production monitoring, incident review, and user feedback;
- change logs, versioned configurations, and rollback;
- periodic review of permissions, data, models, Skills, tools, and policies;
- a named owner who can maintain or retire the workflow.

For an agentic workflow, grade both the **outcome** and the **trajectory**. A final response might claim that a record was updated even when the external system was unchanged. Conversely, an agent may reach the correct end state through an unsafe or wasteful path. OpenAI's agent-evaluation guidance recommends traces for debugging tool, handoff, instruction, routing, and guardrail behavior, followed by repeatable datasets and eval runs ([evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)). Anthropic's eval guidance adds the agent-specific pieces: tasks, trials, graders, transcripts, outcome state, a stable evaluation harness, and production monitoring ([demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

### A diagnostic map

| Observed failure | First levers to inspect |
| --- | --- |
| The result solves the wrong problem | Purpose, Guidance |
| The Skill does not trigger, or triggers on irrelevant work | Guidance, harness selection logic, test prompts |
| Required steps or output fields are skipped | Guidance, model configuration, structured output, verification |
| Claims are stale, unsupported, or access-inappropriate | Grounding, data pipeline, retrieval, permissions |
| The agent selects the wrong tool or supplies bad arguments | Action interface, tool descriptions, model/tool compatibility |
| A tool call succeeds but the real-world outcome is wrong | Action verification, downstream software, Assurance grader |
| The run loops, forgets, or stops early | Execution, state, context management, stop conditions |
| Results vary widely across repeats | Model settings, input distribution, environment, repeated-trial evals |
| A benchmark improvement disappears in production | Eval realism, harness parity, runtime and data distribution |
| Reviewers repeatedly correct the same issue | Purpose criteria, Skill procedure, regression suite, ownership |

## The trust boundary

Safety and governance are performance requirements whenever the intended professional outcome includes confidentiality, compliance, fairness, accountability, or human control.

Cross-cutting design questions include:

- What identity does the agent use, and whose authority does it exercise?
- Which data and actions are permitted for this user and this task?
- Which actions are reversible, consequential, or externally visible?
- Where is approval required, and does the reviewer receive enough evidence?
- How are prompt injection, untrusted tool output, and data exfiltration handled?
- What is logged, retained, redacted, or disclosed?
- How are incidents, appeals, corrections, and decommissioning handled?
- Who is accountable for the system and its ongoing evaluation?

The [NIST AI Risk Management Framework](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) is useful here because it treats governance as continuous and connects mapping, measurement, and management across the lifecycle. Its Generative AI Profile adapts that system-level framing to generative AI risks ([NIST AI 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)).

## An eval-driven optimization loop

Optimization becomes manageable when the team changes one meaningful variable at a time.

1. **Write the task contract.** Define the user, inputs, outcome, acceptance criteria, review, risk, and stop conditions.
2. **Record the baseline configuration.** Capture provider, model and version, settings, system instructions, Skill version, available tools, data snapshot, harness version, permissions, and runtime limits.
3. **Build a small representative suite.** Start with real examples, realistic variation, important edge cases, and known failures. Twenty to fifty well-chosen tasks can be enough to begin; maturity and smaller effect sizes will require more ([Anthropic eval roadmap](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).
4. **Run repeated trials where variation matters.** A single success can hide an unstable workflow.
5. **Capture outcome and trajectory evidence.** Measure end state, quality, safety, latency, tool use, retries, and human correction—not only the final text.
6. **Classify failures by lever.** Diagnose whether the main issue is purpose, intelligence, guidance, grounding, action, execution, or assurance.
7. **Change one lever.** Preserve the rest of the configuration so the result is interpretable.
8. **Run capability and regression evals.** Improve hard cases without losing behavior that already works.
9. **Release gradually and monitor.** Compare production conditions with the eval environment, review unexpected failures, and make rollback routine.
10. **Turn failures into assets.** Add the case to the suite, improve the relevant Skill, tool, data process, or harness, and record why the change was made.

This loop supports consistency without pretending that nondeterminism can be removed entirely. The goal is controlled variation: flexible where wording and approach may differ, strict where facts, policy, state changes, or required fields must not.

## Measuring the contribution of a Skill

To claim that a Skill improves a workflow, compare the same workflow with and without the Skill while holding other major conditions constant.

Measure at least:

1. **Selection precision:** When the Skill loads, was it relevant?
2. **Selection recall:** When the Skill was relevant, did it load?
3. **Procedure adherence:** Were required steps, branches, and checks followed?
4. **Outcome quality:** Did domain experts or objective graders prefer the result for the right reasons?
5. **Robustness:** Does the improvement hold across realistic wording, inputs, users, and repeated trials?
6. **Tool and data behavior:** Did the Skill improve source selection, tool use, permissions, and verification?
7. **Side effects:** Did it create new errors, unnecessary context, extra loops, or conflicts?
8. **Operational maintainability:** Can another person understand, test, update, and roll back it?

This creates a defensible chain from “we wrote a Skill” to “this Skill improves this workflow under these conditions.”

## Preparing for the cost lens without optimizing yet

Performance and cost should eventually be evaluated together, but cost has more dimensions than token price. Capture the following now:

- input, cached, reasoning, and output tokens;
- number and duration of model calls;
- tool, search, storage, and infrastructure usage;
- retries, loops, timeouts, and failed runs;
- wall-clock latency and queue time;
- human review and correction time;
- downstream rework, incident, and opportunity cost;
- cost per successful, accepted outcome—not merely cost per run.

A Skill may lower cost through progressive disclosure, reusable deterministic scripts, fewer corrections, and better tool selection. It may increase cost by adding context, tool calls, verification, or longer trajectories. Only an outcome-aware evaluation can tell whether the trade is worthwhile. OpenAI's current model guidance similarly recommends treating lower resource use as an improvement only when the configuration continues to pass the relevant evals ([model guidance](https://developers.openai.com/api/docs/guides/latest-model)).

## Visual direction: the Agentic Performance Orrery

The tightrope image explains a journey from fast experimentation to operational rigor. The companion visual should explain a system of interacting conditions without presenting a wall of architecture.

### Core composition

Use a **rotating orrery**: a central outcome with seven orbiting circles.

- **Center:** `Professional outcome`
- **Orbiting circles:** `Purpose`, `Intelligence`, `Guidance`, `Grounding`, `Action`, `Execution`, `Assurance`
- **Outer halo:** `Trust boundary — security, privacy, identity, governance, accessibility, human oversight`
- **Active focus position:** twelve o'clock

When a circle is selected, the orbit rotates until that circle reaches the top. The circle grows slightly, the other circles become quieter, and a fixed focus panel reveals its beginner question, examples, failure signals, and improvement levers. Labels counter-rotate so they remain upright. The movement should be brief and purposeful rather than continuous decoration.

Skills belong visibly inside **Guidance**, with two thin connections:

- a connection to **Grounding** for references and assets;
- a connection to **Action** for scripts and tool procedures.

That placement communicates both truths: Skills can influence several parts of a workflow, and Skills are not the entire workflow.

### The seven labels and their questions

| Circle | Fixed focus question |
| --- | --- |
| Purpose | What does good look like? |
| Intelligence | Which model can do this work? |
| Guidance | What method should it follow? |
| Grounding | What should it know right now? |
| Action | What can it see, use, or change? |
| Execution | How does the work run and recover? |
| Assurance | How do we know and improve? |

### Progressive reveal for a beginner audience

Do not introduce all seven circles with all their subcomponents at once. Mirror the progressive disclosure that makes Skills useful.

1. **Begin with the center.** “We are designing a professional outcome, not choosing an AI feature.”
2. **Add three intuitive circles.** `Think` (Intelligence), `Know` (Grounding), and `Act` (Action).
3. **Add the method.** Introduce `Guidance` and place Skills there: “A Skill gives the agent a reusable way of working.”
4. **Reveal the system.** Add `Purpose` and `Execution`: “The job definition and the way work runs shape the result too.”
5. **Close the learning loop.** Add `Assurance` and the trust halo: “Real examples tell us what to improve and how much trust the workflow has earned.”
6. **Rotate one shared example through the system.** Use the meeting-notes-to-client-follow-up workflow from the original guide so every new circle answers a concrete question.

The audience sees one active idea at a time while gradually building a complete mental model.

### Presentation choreography

For each selected circle:

1. rotate it to twelve o'clock;
2. show one plain-language question;
3. show no more than three examples;
4. show one recognizable failure;
5. end with one action the audience can take.

Example for `Guidance`:

- **Question:** What method should it follow?
- **Examples:** Skill, instructions, output template
- **Failure:** The Skill is not selected or a required check is skipped
- **Action:** Test discovery, adherence, and the final outcome separately

The visual should use one accent color for the active circle and neutral tones for the rest. Avoid provider logos and product taxonomies in the main view. Those details belong in the focus panel or appendix.

### An inspirational ending

The final state places `Assurance` at the top and changes the center label from `Professional outcome` to `A workflow we can improve`.

Suggested closing line:

> **You do not need to perfect every circle before you begin. Start with one valuable outcome, make the method explicit, connect only what the work needs, and learn from real examples.**

That preserves the accessibility of Skills while giving the audience a path toward professional reliability.

## Suggested presentation storyline

1. **Skills are a fast way to capture how good work gets done.**
2. **Their impact depends on the system in which they operate.**
3. **Seven levers shape agentic performance.**
4. **A Skill sits in Guidance and reaches into knowledge and action.**
5. **Evals turn inconsistent outcomes into diagnosable failure patterns.**
6. **Begin with one outcome and add complexity only when the evidence calls for it.**

## Online sources that help describe the framework

For a deeper, annotated bibliography organized by AAIF/Linux Foundation, Amazon, Anthropic, OpenAI, Google, Microsoft, research papers, and O'Reilly Radar, see the [Agentic performance source library](../research/agentic-performance-source-library.md). It identifies the evidence type, maps each source to the seven performance levers, and separates peer-reviewed work from arXiv preprints and practitioner commentary.

The Agentic AI Foundation is especially useful as a map of the open interfaces around agentic systems. Its three founding project contributions were MCP, goose, and AGENTS.md; its [current project index](https://github.com/aaif) also lists agentgateway and Agent2Agent. Its working groups on accuracy and reliability, observability and traceability, identity and trust, security and privacy, governance, and workflow integration show where the surrounding ecosystem is trying to turn interoperability into production discipline.

### Skills and interoperability

- [Agent Skills overview](https://agentskills.io/home) — explains portable procedural knowledge, reusable workflows, and progressive disclosure.
- [Agent Skills specification](https://agentskills.io/specification) — defines `SKILL.md`, optional scripts, references, assets, and the format's structural constraints.
- [Skills — OpenAI API](https://developers.openai.com/api/docs/guides/tools-skills) — describes versioned Skill bundles, manifests, and hosted or local execution support.
- [Model Context Protocol architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture) — distinguishes hosts, clients, servers, capabilities, resources, tools, prompts, consent, and security boundaries.

### Agent architecture, harness, and tools

- [Building effective agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) — introduces the augmented LLM, workflows versus agents, retrieval, tools, memory, and the value of matching architecture to task complexity.
- [Trustworthy agents in practice — Anthropic](https://www.anthropic.com/research/trustworthy-agents) — offers a particularly clear four-part system view: model, harness, tools, and environment, with human control and permissions.
- [Writing effective tools for agents — Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents) — connects tool interface and description quality to measurable agent performance.
- [AI agent orchestration patterns — Microsoft](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) — covers orchestration choices, checkpoints, security, state, reliability, and the operational consequences of multi-agent patterns.

### Context, retrieval, memory, and data

- [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — treats prompts, tools, MCP, external data, history, retrieval, and compaction as parts of one finite context-management problem.
- [RAG solution design and evaluation guide — Microsoft](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide) — connects business requirements, representative media and queries, parsing, chunking, metadata, embeddings, retrieval, and evaluation.
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al.](https://papers.neurips.cc/paper/2020/file/6b493230205f780e1bc26945df7481e5-Paper.pdf) — the foundational RAG paper.

### Evaluation, observability, and operational reliability

- [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — defines tasks, trials, graders, traces, outcome state, agent and evaluation harnesses, capability and regression suites, and production feedback.
- [Evaluate agent workflows — OpenAI](https://developers.openai.com/api/docs/guides/agent-evals) — connects traces, graders, datasets, and eval runs to workflow-level debugging and regression detection.
- [Quantifying infrastructure noise in agentic coding evals — Anthropic](https://www.anthropic.com/engineering/infrastructure-noise) — demonstrates that runtime resources and evaluation infrastructure are first-class experimental variables.
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/) — provides a general foundation for consistent traces, metrics, events, and resource attributes across a system.

### Trust, governance, and lifecycle

- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) — organizes continuous risk work around Govern, Map, Measure, and Manage, including human roles and lifecycle monitoring.
- [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) — extends the AI RMF to generative AI risks and use contexts.
- [Architecting agent solutions — Microsoft](https://learn.microsoft.com/en-us/agents/architecture/) — groups agent architecture concerns into fit for purpose, operability, and trust/traceability/transparency.

## A concise takeaway

Skills are one of the most accessible ways to improve an agentic workflow because they let the people who understand the work encode a reusable method. Their professional value becomes clearer when they are placed inside a larger performance system.

The system asks seven questions:

> **What does good look like? Which model can do it? What method should it follow? What should it know? What can it use or change? How does the work run? How do we know and improve?**

Answering those questions turns Skills from an isolated customization feature into a practical lever for building agentic workflows that people can understand, evaluate, and trust.
