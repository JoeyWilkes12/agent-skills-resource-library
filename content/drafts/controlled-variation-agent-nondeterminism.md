---
title: "Controlled variation: the capability and control problem of AI agents"
type: Guide concept
family: concept
status: Published
last_verified: 2026-09-08
source_class: mixed
interaction_mode: read
audience: Enterprise consultants and program leaders learning agentic AI
---

# Controlled variation: the capability and control problem of AI agents

*Why the flexibility that lets an agent tackle unfamiliar work also makes its behavior harder to reproduce—and how skills, scripts, guardrails, and evals make that tradeoff governable.*

## Technical summary

AI agents are valuable for the same reason they are difficult to control: they do not merely execute one prewritten path. A capable model can interpret an unfamiliar request, assemble a plan from general knowledge and current context, select tools, observe results, and revise its approach. That generative flexibility lets the system address new instances and changing conditions without task-specific retraining or a script that anticipated every step.

It also means that the same request may produce a different plan, tool sequence, explanation, or result on another run. Variation can enter through model inference, retrieved context, memory, tool responses, external state, orchestration, and infrastructure. “Set the temperature to zero” is therefore not an enterprise reproducibility strategy.

The practical objective is not to make every part of an agent deterministic. It is to **control where variation is acceptable**:

- Let the agent vary its hypotheses, research path, decomposition, and language when that flexibility creates value.
- Make calculations, transformations, permissions, state changes, required fields, and stop conditions deterministic where feasible.
- Use a Skill to document the method, assumptions, evidence rules, decision points, and recovery path.
- Use scripts and schemas for mechanics that should produce the same answer from the same validated inputs.
- Use guardrails to block or interrupt prohibited behavior at runtime.
- Use repeated-trial evals, traces, and production monitoring to estimate how often the whole system succeeds, violates a constraint, or drifts.
- Keep accountable human judgment at consequential boundaries.

The design target is **controlled variation**: diverse paths and expressions inside a stable envelope of acceptable outcomes.

## The feature and the failure mode are the same thing

Traditional automation begins with a path. A developer specifies the states, branches, calculations, and actions. The program may process millions of cases, but it remains bounded by rules someone encoded in advance.

An agent begins with a goal and a set of capabilities. Its path can be formed at runtime. It may search for evidence, decide that a spreadsheet must be inspected, write a small transformation, discover that a source is incomplete, and change the plan. Anthropic draws the same architectural line between workflows, whose code paths are predefined, and agents, whose models dynamically direct their processes and tool use. It recommends agents for open-ended problems where the necessary steps cannot be hardcoded in advance ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

That ability is often described as creativity. For enterprise work, a narrower phrase is more useful: **generative flexibility**. It is the capacity to produce a task-specific response or action plan that was not stored as an exact template.

This is not creation from nothing. The model was extensively pretrained; the agent also depends on the instructions, data, tools, software, and environment available during the run. The important shift is that the organization does not need to train a new model or supply an exact executable procedure for every new instance. The GPT-3 paper established the modern few-shot pattern: a pretrained language model performed many tasks from instructions and examples in context without task-specific parameter updates ([Brown et al., NeurIPS 2020](https://proceedings.neurips.cc/paper/2020/hash/1457c0d6bfcb4967418bfb8ac142f64a-Abstract.html)). ReAct later showed how interleaving reasoning with actions can help a model update plans, use external information, and respond to exceptions ([Yao et al., ICLR 2023](https://openreview.net/pdf?id=WE_vluYUL-X)).

This makes agents attractive when work contains:

- unstructured documents or conversations;
- incomplete or ambiguous requirements;
- exceptions that overwhelm a rules engine;
- changing sources, tools, or external conditions;
- a sequence of steps that cannot be known until intermediate results arrive; or
- a need to explore several plausible approaches before choosing one.

The tradeoff is structural. If the path is generated at runtime, two valid runs need not look alike. The flexibility that creates coverage beyond a fixed script also creates a distribution of possible behaviors rather than one guaranteed trajectory.

## Nondeterminism is a system property, not a temperature setting

“The model is nondeterministic” is true but incomplete. A deployed agent combines multiple sources of variation and change.

| Layer | What can vary | What helps control or diagnose it |
| --- | --- | --- |
| Model inference | Token choices, reasoning, tool selection, argument construction | Pin the model version and settings; use structured outputs; run repeated trials |
| Context | Prompt wording, Skill selection, retrieved passages, conversation history, memory | Version instructions and Skills; snapshot inputs; record retrieved context; test paraphrases |
| Tools and data | Search rankings, API responses, database state, UI layout, timestamps, rate limits | Use stable APIs; validate inputs and outputs; mock or record dependencies for tests; verify end state |
| Orchestration | Routing, handoffs, retries, concurrency, stop decisions | Make routing deterministic where possible; set budgets and stop conditions; checkpoint state |
| Runtime | Dependency versions, resource contention, network behavior, caches, shared state | Pin environments; isolate trials; monitor infrastructure; record versions and limits |
| Evaluation | Model-judge variation, human disagreement, fragile graders, test-environment noise | Prefer deterministic graders where possible; calibrate rubrics; retain traces; report uncertainty |

Two different phenomena are easy to conflate:

- **Run-to-run variation** occurs when the configured system and input appear unchanged but the behavior differs.
- **Drift** occurs when the system or its environment changes: a model alias moves, a Skill is revised, retrieval content is updated, an API changes, or user behavior shifts.

The first calls for repeated trials. The second calls for versioning, change control, time-based monitoring, and revalidation. Both can appear to a user as “the agent suddenly behaved differently.”

## Reproducibility has four useful levels

An enterprise team should state what must be reproduced before trying to reduce variation.

| Reproducibility target | Question | Typical need |
| --- | --- | --- |
| Exact replay | Can we reconstruct the same inputs, responses, tool results, and state transitions? | Incident investigation, debugging, evidence preservation |
| Method reproducibility | Can another person or agent apply the same declared process to the same case? | Audit, knowledge transfer, controlled operations |
| Outcome reproducibility | Do repeated runs reach an acceptable end state within defined tolerances? | Customer service, analysis, document production |
| Constraint reproducibility | Do prohibited outcomes remain prohibited on every run? | Security, compliance, permissions, financial or external actions |

Exact replay is useful, but it is not the only—or usually the highest—standard. A due-diligence agent may take a different search path and phrase its memo differently while still citing the same controlling contract terms, using the approved valuation method, exposing the same unresolved assumption, and stopping before an unauthorized action.

Conversely, identical prose does not prove reliability. A cached or templated answer can be perfectly repeatable and consistently wrong.

The most important question is therefore not “Did the agent do the same thing twice?” It is “Which differences matter to the professional promise, and did every run remain inside its allowed envelope?”

## Reliability compounds across repeated use

A single successful demonstration says little about repeated service quality. If a workflow succeeds with probability `p` on one representative trial, the probability of succeeding on all `k` independent trials is `pass^k = p^k`.

| Per-trial success | Three consecutive successes | Eight consecutive successes |
| ---: | ---: | ---: |
| 75% | 42.2% | 10.0% |
| 90% | 72.9% | 43.0% |
| 95% | 85.7% | 66.3% |
| 99% | 97.0% | 92.3% |

This is the logic behind `pass^k`, introduced by the τ-bench researchers to measure consistency over repeated tool-agent-user interactions. In their original retail benchmark, contemporary function-calling agents completed fewer than half of tasks, and the reported retail `pass^8` was below 25% ([Yao et al., ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/file/1b126cc38b8638e07bef37e7b2bb72bf-Paper-Conference.pdf)). The historical model scores should not be treated as a current product ranking; the durable lesson is that one-run capability and repeated reliability are different measurements.

The table assumes independent trials with the same success probability. Production failures are often correlated: one bad policy interpretation can affect many cases, and one failing dependency can break every run. Estimate reliability empirically by task segment, retain confidence intervals, and investigate shared failure modes rather than applying the formula blindly.

For exploratory work, another metric may be appropriate. `pass@k` asks whether at least one of several attempts succeeds. It rewards useful diversity when a person or deterministic grader can select the winner. `pass^k` asks whether every attempt succeeds. It rewards consistency when every customer or transaction deserves an acceptable result. A research ideation tool and a refund agent should not be judged by the same reliability objective.

Extend the 95% example to ten independent trials and the probability that **every** trial succeeds falls to roughly 60%. That is not a forecast for a particular agent; it is a reminder that a workflow can look highly reliable one run at a time while remaining much less reliable across a sequence of uses.

## A variability budget is more useful than a demand for sameness

Before designing controls, classify what **must not vary**, what **may vary within tolerance**, and what **should vary** because diversity creates value.

| Variability class | Examples | Preferred treatment |
| --- | --- | --- |
| Must not vary | Authorization, prohibited actions, financial formulas, required evidence, legal hold, escalation thresholds | Code, permissions, schemas, transactional controls, hard validation, human approval |
| May vary within tolerance | Source ordering, tool sequence, memo structure, number of iterations, explanatory detail | Skill guidance, bounded agent choice, outcome-based evals, latency and cost budgets |
| Should vary | Hypotheses, research queries, alternative plans, exception handling, scenario exploration, phrasing | Preserve model discretion; evaluate relevance, coverage, and final quality |

This variability budget prevents two common mistakes.

The first is **under-control**: allowing the model to improvise arithmetic, authorization, or externally visible actions because it handled the narrative well. The second is **over-control**: prescribing one exact tool sequence and rejecting any other path, even when the agent finds a valid solution the designer did not anticipate.

Anthropic's evaluation guidance makes this point directly: deterministic graders are preferable where they fit, but graders that require one exact sequence can become brittle and punish valid creative solutions. For open-ended work, grade the outcome and essential constraints; inspect the trajectory for risk, waste, and debugging evidence ([Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

## Skills document the method without freezing the path

A Skill is a reusable package of procedural guidance. The open Agent Skills specification centers the package on `SKILL.md` and allows supporting scripts, references, and assets to be loaded as needed ([Agent Skills specification](https://agentskills.io/specification)). Current OpenAI documentation similarly describes Skills as versioned bundles for codifying processes and conventions ([Skills](https://developers.openai.com/api/docs/guides/tools-skills)).

In the control architecture, a Skill should answer questions such as:

- When does this method apply, and when does it not?
- What inputs and permissions are required?
- Which sources are authoritative?
- What assumptions may be made, and which must be surfaced?
- Which decisions can the agent make?
- Which mechanics must be delegated to a script or tool?
- What evidence must accompany the result?
- What conditions require a stop, retry, recovery, or human handoff?
- What observable checks define completion?

This does not make the agent deterministic. It narrows and documents the solution space. A Skill can still fail to trigger, be misunderstood, conflict with other instructions, contain stale guidance, or be followed only partially. Its value is that the professional method becomes inspectable, reviewable, versionable, and testable instead of remaining implicit in a conversation.

## Scripts, guardrails, and evals solve different parts of the problem

These controls are complementary. Treating any one of them as the full solution creates false confidence.

| Control | Primary job | What it does not prove |
| --- | --- | --- |
| Skill | Describe the reusable method, scope, evidence rules, decision criteria, and recovery behavior | That the Skill was selected, interpreted correctly, or followed on every run |
| Script or deterministic service | Perform exact calculations, transformations, validations, or transactions from defined inputs | That the inputs, assumptions, or decision to call it were correct |
| Guardrail | Detect, block, constrain, or escalate prohibited inputs, outputs, or actions during a run | That every unknown failure mode has been anticipated |
| Eval | Estimate performance against representative cases and explicit graders | That untested production cases are safe or that the future distribution will not drift |
| Trace and monitoring | Record what happened and detect operational or behavioral change | That a recorded decision was correct |
| Human checkpoint | Apply accountable judgment at ambiguous or consequential boundaries | That oversight is effective without evidence, time, authority, and clear responsibility |

OpenAI's agent guidance describes guardrails as layered defenses and pairs them with authentication, authorization, access control, standard software security, and human intervention for high-risk actions ([A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)). Its evaluation documentation uses traces to examine model calls, tool calls, guardrails, and handoffs, then graders and datasets to find regressions at scale ([Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)).

The boundary can be stated simply:

> **Keep judgment probabilistic where adaptation matters. Make mechanics deterministic where correctness can be specified. Enforce invariants outside the model.**

## An enterprise example: a changing vendor-risk review

Consider an agent that prepares a preliminary vendor-risk brief for a consultant. Every review differs. The vendor's architecture, contract language, certifications, subprocessors, data flows, and missing evidence are not known in advance. A fixed form can collect fields, but it cannot anticipate every inconsistency or decide which follow-up questions the evidence makes important.

The agent adds value by adapting:

- identifying which documents and claims appear material;
- generating queries and follow-up questions;
- connecting evidence across a contract, architecture diagram, and security report;
- proposing alternative interpretations when sources conflict; and
- revising the review plan when a critical document is missing.

The surrounding controls preserve the value of that flexibility:

1. **The Skill defines the method.** It names authoritative sources, required evidence, allowed assumptions, risk taxonomy, output structure, citation rules, and stop conditions.
2. **Scripts handle mechanics.** A parser normalizes dates and entities; a scoring function applies the approved weights; a validator checks required fields and evidence links.
3. **Guardrails bound action.** The agent receives read-only access, cannot contact the vendor or modify the system of record, and must escalate prohibited data or an unsupported high-risk conclusion.
4. **Evals test a distribution.** Cases include paraphrased requests, missing documents, contradictory evidence, stale certifications, tool errors, and changes to the risk policy. Each case runs more than once.
5. **Graders separate outcome from path.** Deterministic checks verify required fields, citations, calculations, and prohibited actions. A calibrated subject-matter rubric assesses whether the analysis is material, balanced, and decision-useful.
6. **Traces preserve the run.** The team can see which Skill version, sources, model configuration, tools, and assumptions produced the brief.
7. **A human owns the decision.** The consultant approves the risk interpretation and any external communication.

The result need not be identical from run to run. It must be consistently supportable, policy-compliant, and reviewable.

## Build the control system around claims, not components

A defensible implementation begins with the promise made to the user and works backward.

1. **Write the task contract.** Define the user, decision, inputs, acceptable outcome, constraints, assumptions, permissions, and real end state.
2. **Choose the least dynamic architecture that fits.** Use ordinary code for known paths. Add model judgment only where ambiguity, language, or changing conditions make it valuable.
3. **Set the variability budget.** Classify what must not vary, may vary within tolerance, and should vary.
4. **Write the Skill.** Capture the method, evidence rules, decision criteria, exceptions, output contract, verification, and recovery path.
5. **Extract deterministic mechanics.** Move calculations, schema checks, policy tables, data transformations, and idempotent transactions into code or controlled services.
6. **Place guardrails at boundaries.** Check input, retrieval, tool choice, tool arguments, output, and high-impact actions. Do not rely on the model to enforce its own permissions.
7. **Build representative evals.** Include ordinary cases, edge cases, paraphrases, known failures, adversarial inputs, dependency faults, and time-based changes.
8. **Run repeated trials.** Report both one-run success and repeated consistency; segment results by task type and consequence.
9. **Record configuration and traces.** Version the model, Skill, prompts, tools, schemas, data snapshot, environment, graders, and thresholds.
10. **Release gradually.** Keep human review where consequences exceed demonstrated reliability, monitor production drift, and make rollback routine.

This is consistent with the NIST AI Risk Management Framework's emphasis on documented, objective, repeatable, or scalable testing, evaluation, verification, and validation, followed by continuing measurement as systems and risks evolve ([AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)).

## Measure the distribution, the violations, and the work left for people

No single score captures an agentic workflow. A practical evaluation set includes:

| Measure | What it reveals |
| --- | --- |
| Task success rate | How often the intended end state is reached |
| Constraint violation rate | How often a non-negotiable rule is broken |
| Repeated-run consistency | Whether acceptable performance persists across trials |
| Paraphrase robustness | Whether equivalent requests receive equivalent treatment |
| Recovery and escalation rate | Whether the system recognizes and handles blockers appropriately |
| Human acceptance and rework | Whether the output is professionally usable, not merely complete |
| Tool and evidence quality | Whether the right sources and actions supported the result |
| Cost and latency per accepted outcome | Whether extra attempts and control layers remain economical |
| Drift by version and time | Whether changes in models, Skills, data, tools, or users alter behavior |

For non-negotiable constraints, “we saw zero failures” is not proof of zero risk. Under a simple independent Bernoulli model, observing no violations in `n` trials leaves an approximate 95% upper confidence bound of `3/n` on the true violation rate ([Hanley and Lippman-Hand, 1983](https://jamanetwork.com/journals/jama/article-abstract/385438)). Zero observed violations in 100 trials is therefore still compatible with a rate near 3%. Real failures may also be correlated, making the simple bound optimistic. High-consequence claims need larger and more adversarial samples, defense in depth, production monitoring, and controls that do not depend on statistical confidence alone.

## What this approach cannot guarantee

Controlled variation is a risk-management strategy, not a proof of safety.

- A Skill documents a method but cannot guarantee that the agent selects or follows it.
- A deterministic script can repeat a calculation while faithfully operationalizing a bad assumption.
- A guardrail protects against the failure modes it can detect, not every future failure.
- An eval estimates behavior on sampled cases; it does not enumerate an open world.
- A trace explains what occurred, not whether the reasoning was professionally sound.
- Repeated trials measure the configured system; a model, prompt, Skill, tool, policy, or data change creates a new system that must be revalidated.
- Human review reduces risk only when the reviewer has authority, time, evidence, and a clear decision to make.

These limits argue against both extremes. It is a mistake to treat nondeterminism as a defect that can be entirely engineered away. It is equally mistaken to call variability “creativity” and accept unpredictable professional outcomes as the price of innovation.

## Questions that should remain open

The control design should make uncertainty discussable rather than hiding it behind a single readiness score. Before broader deployment, the owner should still be able to answer:

- Which failures are genuinely random, and which indicate a systematic flaw in the method, data, tool, or grader?
- How much outcome variation will users accept for this specific service?
- Which constraint claims are supported by code or permissions, and which depend on probabilistic detection?
- How will the eval distribution change as users learn new ways to use—or misuse—the agent?
- What event should trigger revalidation: a model update, Skill change, new data source, policy revision, or production incident?
- At what demonstrated reliability and consequence level can a human checkpoint be narrowed, and who owns that decision?

## The enterprise design rule

The mature question is not whether an agent is deterministic. It is whether the organization has made a defensible choice about where the agent may improvise.

Use deterministic software when the rules and path are known. Use an agent when the work benefits from interpreting ambiguity, forming a plan, and adapting to evidence or changing conditions. When the two meet, put the model inside an engineered envelope:

> **Flexible reasoning. Explicit method. Deterministic mechanics. Enforced constraints. Measured outcomes. Accountable release.**

That is the central dichotomy of agentic AI. Nondeterminism expands the set of problems a system can attempt. Discipline determines whether that capability becomes a dependable professional workflow.

## Sources and evidence notes

- **Peer-reviewed research:** [Language Models are Few-Shot Learners](https://proceedings.neurips.cc/paper/2020/hash/1457c0d6bfcb4967418bfb8ac142f64a-Abstract.html), NeurIPS 2020; [ReAct: Synergizing Reasoning and Acting in Language Models](https://openreview.net/pdf?id=WE_vluYUL-X), ICLR 2023; [τ-bench](https://proceedings.iclr.cc/paper_files/paper/2025/file/1b126cc38b8638e07bef37e7b2bb72bf-Paper-Conference.pdf), ICLR 2025; [If Nothing Goes Wrong, Is Everything All Right?](https://jamanetwork.com/journals/jama/article-abstract/385438), JAMA 1983.
- **Open specification:** [Agent Skills specification](https://agentskills.io/specification), including `SKILL.md`, optional resources, and progressive disclosure.
- **Primary practitioner guidance:** [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) and [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents); [OpenAI, A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/), [Skills](https://developers.openai.com/api/docs/guides/tools-skills), and [Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals).
- **Independent risk-management framework:** [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) and the [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).
- **Editorial inference:** The “variability budget” and the four reproducibility targets synthesize the cited research and practice guidance. They are proposed decision tools, not a published standard.
