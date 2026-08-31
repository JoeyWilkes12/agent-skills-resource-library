# Skills can help agents, but personalization and plugin packaging need separate proof

*What the August 2026 personalized-Skills study actually found—and what the wider evidence says about Skills, tools, retrieval, and plugin packaging.*

**Research synthesis — 31 August 2026**
**Primary paper:** Shuyan Huang, Kai Du, and Andrew Lan, [“Do Personalized Skills Help Coding Agents? An Empirical Study of Developer Interaction Histories”](https://arxiv.org/abs/2608.10319), arXiv:2608.10319v2 (15 August 2026).

## Executive summary

The focal paper does **not** find convincing evidence that automatically inferred, developer-specific Skills improve coding-agent performance. It starts from 206 real-world source sessions from 13 developers; five train/test splits yield 210 held-out replay instances per condition. A personalized Skill improved the mean task score by only 0.97 points over no Skill and was not statistically significant (p=.399). A Skill borrowed from another developer performed almost identically (+0.92, p=.451). A generic Skill pooled across developers had the largest descriptive gain (+3.78), but that result also missed the conventional .05 significance threshold (p=.063).

The paper’s defensible claim is therefore narrow: **with sparse individual histories, broadly reusable procedural guidance appears more robust than automatically inferred personal preferences.** It does not show that personalization never works. Its exploratory subgroup suggests that personalization may help when a developer has at least six prior sessions relevant to the new task, but that result comes from one split, 12 held-out tasks, LLM-assigned relevance, and no reported significance test.

The wider literature points to five conclusions:

1. **Curated, task-matched Skills can help substantially.** SkillsBench v4 (14 June 2026) reports a pass-rate increase from 33.9% to 50.5% across 87 tasks and 18 model–harness configurations.
2. **In SWE-Skills-Bench, coding gains were much smaller.** It reports an average +1.2 percentage-point gain across roughly 565 repository-grounded tasks; 39 of 49 Skills produced no improvement, while mismatched guidance sometimes reduced performance.
3. **Selection is part of the treatment.** When agents must retrieve from 34,000 real-world Skills, gains erode toward no-Skill baselines; query-specific refinement can recover some performance.
4. **Personalization needs repeated relevant evidence and probably a hybrid design.** A shared procedural base plus a small, explicit, editable personal layer is better supported than replacing shared practice with a wholly personal Skill.
5. **A plugin is packaging, not an efficacy mechanism.** Agent Plugins 1.0 packages Skills and MCP servers. No reviewed study isolates plugin packaging itself as the cause of better outcomes. Benefits and risks come from the bundled instructions, tools, data access, routing, permissions, and host behavior.

## What “Skill,” “tool,” and “plugin” mean

The terms are easy to blur, but the evidence does not transfer cleanly between them.

| Mechanism | Operational meaning | What an evaluation must establish |
| --- | --- | --- |
| **Skill** | Reusable procedural guidance loaded at inference time, commonly a SKILL.md document and optionally scripts, references, or assets. The focal paper tests compact natural-language instructions. | Whether the content is correct, relevant, selected, followed, and worth its context and execution cost. |
| **Tool / MCP server** | An executable capability or data interface that the model can discover and invoke through a schema or protocol. | Whether the agent selects the right tool, supplies valid arguments, follows policy, interprets results, and safely handles authority. |
| **Plugin** | Under [Agent Plugins 1.0](https://agent-plugins.org/specification), a portable package that may contain Skills, MCP server configuration, or both. | Which bundled component changed the result. Installation and portability alone are not a causal performance intervention. |
| **Personal memory/profile** | Persistent facts, preferences, corrections, or interaction history associated with a user. | Whether remembered information is stable, relevant, consented, correctly retrieved, and actually improves that user’s outcome. |

This distinction is central: the focal paper studies one prompt-injected Skill format. It does not evaluate executable Skills, MCP tools, connector authentication, marketplace discovery, or plugin administration.

## Close reading of the focal paper

### Research question

The authors ask whether a task-independent Skill distilled from one developer’s prior agent interactions can improve that developer’s future coding tasks and reduce pushback. They define a Skill as a human-readable SKILL.md containing reusable natural-language guidance, supplied without changing model weights ([paper §2.1](https://arxiv.org/html/2608.10319v2#S2.SS1)).

### Data and method

The study starts from [SWE-chat](https://arxiv.org/abs/2604.20779), a living dataset of public coding-agent sessions. It excludes unrecoverable repositories, private dependencies, incomplete or non-editing sessions, review-only work, and developers with fewer than three valid tasks. The resulting sample contains:

- 206 sessions from 13 developers;
- 164 evolution sessions used to construct Skills and 42 held-out sessions per split;
- five random 80/20 splits, yielding 210 held-out replay instances per condition; and
- mostly public GitHub CLI work, led by code review/targeted fixes (28.6%), feature implementation (20.9%), and testing/build/DevOps (15.0%).

Skill construction has two stages. A deterministic bootstrap extracts communication, workflow, correction, validation, and commit patterns. GPT-5.5 then refines the draft, retaining a rule only when at least two developer turns from different sessions support it ([paper §2.2](https://arxiv.org/html/2608.10319v2#S2.SS2)).

Each held-out task is replayed under four conditions:

| Condition | Guidance supplied |
| --- | --- |
| A | No Skill |
| B | The target developer’s personalized Skill |
| C | A random other developer’s Skill |
| D | A generic Skill distilled from the pooled evolution sessions of all developers |

GPT-5.5 powers the Skill generator, coding agent, developer simulator, and LLM judge. The agent sees the original first request. A trajectory-conditioned simulator sees a summary of all original developer requirements and issues follow-ups as the new trajectory unfolds. Replays are limited to six developer–agent turns and scored on a 100-point SWE-chat rubric ([paper §3.2](https://arxiv.org/html/2608.10319v2#S3.SS2)).

As a replay-validity check, 171 of 210 replay instances had substantive follow-ups from both the original developer and the simulator. An LLM judge classified 59.65% as exact semantic matches, 29.82% as partial matches, and 10.53% as mismatches—89.47% at least partially consistent. This is useful validation, but it is not a human rating of the simulator.

### Main results

| Condition | Mean score | Difference vs. no Skill | Follow-up rate | Win / tie / loss vs. no Skill |
| --- | ---: | ---: | ---: | ---: |
| No Skill | 65.02 | — | 24.76% | — |
| Personalized Skill | 65.99 | +0.97; p=.399 | 30.95% | 41.43 / 14.76 / 43.81% |
| Random developer Skill | 65.94 | +0.92; p=.451 | 27.62% | 43.33 / 17.62 / 39.05% |
| Generic pooled Skill | **68.80** | **+3.78; p=.063** | 30.00% | **50.95 / 14.76 / 34.29%** |

Source: [paper Table 1 and §3.3](https://arxiv.org/html/2608.10319v2#S3.SS3). The paper reports “±” values beside scores but does not identify them in the caption or nearby prose as a standard deviation, standard error, or confidence interval, so they are not relabeled here.

Three details matter:

- Personalized and other-developer Skills are effectively tied, providing little evidence for an added personalization effect in this setup. The paper does not report a direct significance test between those two conditions.
- The generic Skill is descriptively best, but p=.063 is suggestive rather than conventionally significant.
- All Skill conditions produce **more**, not fewer, follow-ups than no Skill. The paper does not demonstrate reduced pushback.

### What changed in the agent’s behavior

Skills encouraged more implementation and validation rather than greater efficiency. Relative to no Skill, the personalized condition increased:

- command/tool calls from 8.47 to 9.46;
- reported agent tokens from 442,096 to 597,120;
- execution time from 91.76 to 106.16 seconds;
- files changed from 1.65 to 2.22;
- test-command groups from 0.56 to 0.97; and
- runs reporting successful validation from 43.1% to 58.9%.

The generic Skill achieved the best score but also used the most tokens and caused the most patch churn ([paper Table 3 and §4.3](https://arxiv.org/html/2608.10319v2#S4.SS3)). The study therefore shows more extensive execution and validation, without evidence of labor-, latency-, or token-efficiency savings.

### When personalization looked promising

For one split, the authors used an LLM to count prior sessions semantically related to each of 42 held-out tasks. Personalized guidance showed little or no advantage in the 1–2 and 3–5 related-session groups; in the 0-session group it trailed no Skill by 6.33 points (n=3). For the 12 tasks with at least six related sessions, it beat no Skill by 10.17 points, random-developer guidance by 8.92 points, and generic guidance by 5.67 ([paper Table 2 and §4.1](https://arxiv.org/html/2608.10319v2#S4.SS1)).

This is best read as a hypothesis: **personalization may need repeated task-relevant evidence.** It is not evidence that six sessions is a general threshold. The subgroup was small, selected after LLM relevance labeling, evaluated on one seed, and reported without uncertainty or a significance test.

### What the paper does and does not establish

The paper supports:

- a small, inconsistent, non-significant effect for automatically inferred personalized Skills in this sample;
- a larger but still non-significant descriptive effect for pooled generic procedure;
- increased validation effort and cost under Skill conditioning; and
- an exploratory relationship between relevant history volume and personalization benefit.

The paper’s own refinement ablation is also weak. LLM refinement improved the rule-based bootstrap by only 0.28 points (65.71 to 65.99), with p=.792 and the same 30.95% follow-up rate ([Appendix A](https://arxiv.org/html/2608.10319v2#A1)).

It does **not** establish:

- that personalized Skills never help;
- that generic Skills universally improve coding agents;
- productivity, satisfaction, trust, or reduced correction burden for real developers;
- effects for other models, harnesses, private repositories, GUI work, longer tasks, or executable Skills; or
- a fair equal-information comparison between personal and generic Skills.

The last point is important. The generic Skill pools all developers—including the target developer’s evolution data—and contains 25 rules and 383 rule-words, versus 14.15 rules and 236.38 rule-words for the average personalized Skill. Its advantage may reflect broader coverage and greater length as well as “genericness.” The same model family also generates the Skills, simulates the user, executes the task, and judges success, creating correlated model-specific measurement risk. These are methodological implications of the design, not accusations of invalidity.

## What the broader research adds

Most direct Skill evidence is from 2026 preprints. It is promising, fast-moving, and not yet a mature replicated literature.

| Evidence | Reported result | What it means for this initiative | Main limitation |
| --- | --- | --- | --- |
| [SkillsBench v4 (14 June 2026)](https://arxiv.org/abs/2602.12670) | Curated Skills increased average pass rate from 33.9% to 50.5% (+16.6 percentage points) on 87 tasks across 8 domains and 18 model–harness configurations. Focused bundles of at most three modules beat larger bundles. | High-quality, task-matched procedural knowledge can be valuable and can let smaller models approach larger no-Skill models. | Tasks receive curated matching Skills; this is closer to oracle delivery than realistic discovery or personalization. |
| [SWE-Skills-Bench](https://arxiv.org/abs/2603.15401) | Across about 565 repository tasks, average pass-rate gain was +1.2 percentage points; 39/49 Skills had zero gain, 7 helped by up to 30 points, and 3 hurt by up to 10 points. Some no-gain Skills increased tokens by up to 451%. | In coding, specialized and version-compatible procedure matters; blanket Skill injection is not justified. | Preliminary preprint, one Claude Code/Haiku configuration, high baseline pass rates, and curated task construction. |
| [How Well Do Agentic Skills Work in the Wild](https://arxiv.org/abs/2604.04323) | Gains degrade as agents retrieve from 34,000 real Skills and matches become imperfect. Retrieval plus query-specific refinement improved Terminal-Bench 2.0 from 57.7% to 65.5% for Claude Opus 4.6. | Library quality, routing, and task-specific adaptation are first-class product features, not plumbing. | “Realistic” remains benchmark-defined; no longitudinal developer study. |
| [SkillRet](https://arxiv.org/abs/2605.05726) | A benchmark of 17,810 public Skills finds off-the-shelf retrieval far from solved; task-specific training improved NDCG@10 by 13.1 points over the strongest prior retriever. | A large catalog is useful only if the system can reliably retrieve the right small subset. | Retrieval relevance is not end-to-end task success. |
| [Rethinking Self-Evolving Agent Skills](https://arxiv.org/abs/2608.02636) | Only 55 of 388 candidate revisions established distinct validation bests. Validation selected an evolved Skill in 11/14 model–benchmark settings; 9 improved released-test performance. Every selected revision came from feedback that included failures. | Skill evolution is sparse, validation-gated search—not automatic continuous improvement. Preserve parents, validate revisions, and make rollback cheap. | Preprint; results vary by model, benchmark, and feedback condition. Validation-based selection may make downstream gains optimistic if selection and final evaluation are not fully independent. |
| [TRACE](https://arxiv.org/abs/2606.13174) | On simulated ClawArena tasks, compiled checks reduced held-out preference violations from 100% to 37.6% in-distribution and to 2.0% out-of-distribution. On MemoryArena-derived tasks, violations fell from 100% to 60.5%; the paper also reports that Mem0 still violated 57.5% of applicable checks in its tested setting. | Hard, testable preferences may need enforcement, not another prompt paragraph. | Constructed tasks, different benchmark conditions, and simulated users; the method is broader than a passive SKILL.md and does not prove workplace productivity. |
| [ToM-SWE](https://arxiv.org/abs/2510.21903) | The dual-agent system reported higher task success than the OpenHands baseline on a constructed stateful SWE benchmark (59.7% vs. 18.1%); participants in a three-week professional-developer study rated it useful 86% of the time. | Active user modeling is a plausible alternative to merely injecting a static Skill. | This is not a clean user-modeling ablation: architecture differs from the baseline, and “useful” is not a matched causal productivity measure. |
| [Toolformer](https://arxiv.org/abs/2302.04761), [ToolLLM](https://arxiv.org/abs/2307.16789), and [τ-bench](https://arxiv.org/abs/2406.12045) | Models can learn API invocation and composition, yet τ-bench found leading function-calling agents completed under half of realistic tool–user tasks and had retail pass^8 below 25%. | Tools unlock capabilities unavailable to prompt text, but access does not guarantee selection, sequencing, policy compliance, or reliability. | Tool training/benchmarks do not isolate plugin packaging or developer personalization. |

### Why reported Skill effects differ so much

The studies suggest several plausible explanations for their apparently conflicting results. Most are not isolated causal findings:

1. **Content quality:** Curated domain procedure may carry more useful task information than automatically inferred or self-generated prose.
2. **Task match:** An oracle-matched Skill has an easier job than retrieval from a noisy library or a task-independent personal profile.
3. **Scope:** Broad domains with specialized knowledge may leave more headroom than repository tasks that a capable model already solves.
4. **Compatibility:** Version-specific or environment-specific guidance can conflict with the current project and cause negative transfer.
5. **Delivery:** Passive prompt injection, dynamic retrieval, executable functions, and runtime enforcement are materially different mechanisms.
6. **Measurement:** Deterministic verifiers, LLM judges, simulated users, and human outcomes answer different questions.

The useful question is not “Do Skills work?” but: **Which procedure, selected how, for which task and model, delivered through which mechanism, at what cost and risk?**

## Plugins and tools: capability gain is not packaging gain

[Agent Plugins 1.0](https://agent-plugins.org/specification) defines exactly two portable component types: Skills and MCP servers. The specification governs discovery and configuration; it explicitly leaves client exposure, distribution, installation, permissions, and user experience to implementations. [MCP](https://modelcontextprotocol.io/specification/2025-11-25) standardizes how applications expose resources, prompts, and executable tools. It states security principles such as consent and access control, but the protocol does not itself enforce end-to-end security guarantees.

This architecture can improve agent usefulness in two concrete ways:

- a Skill supplies procedural knowledge the model may not reliably reconstruct; and
- an MCP tool supplies live data or the ability to act on an external system.

But neither standard claims to improve model reasoning. A plugin can also add distractor tools, context overhead, stale instructions, prompt-injection paths, credentialed access, and side-effect authority. Agent Plugins 1.0 forbids embedding secrets in portable environment or header configuration; authorization and credential storage remain client-managed. Tool-integrated benchmarks reinforce the analogous risk: [AgentDojo](https://arxiv.org/abs/2406.13352) measures a security–utility trade-off across 97 tasks and 629 security test cases, while [InjecAgent](https://arxiv.org/abs/2403.02691) found a 24% attack success rate against its ReAct-prompted GPT-4 condition across 1,054 indirect-injection cases. These are pre-MCP tool-agent benchmarks, not measured Agent Plugins or MCP rates, and their results are benchmark-specific rather than universal product estimates. They nevertheless show why task success alone is an incomplete plugin metric.

The evidence therefore supports **component-level evaluation**:

- Skill-only versus no Skill;
- tool-enabled versus tool-unavailable, when both conditions can complete the task;
- oracle-selected versus retrieved Skill/tool;
- the same components packaged and unpackaged, if packaging itself is claimed to matter; and
- normal utility alongside unauthorized-action, injection, privacy, and approval-bypass rates.

## Recommended architecture and research program

### Product architecture

1. **Start with a small shared base.** Encode broadly reusable procedures such as inspect-before-edit, preserve scope, test relevant paths, and report evidence. Keep each module focused and versioned.
2. **Retrieve task-specific expertise on demand.** Do not inject the full library. Record retrieval candidates, final selection, invocation, and whether the Skill was actually followed.
3. **Add a thin personal layer.** Prefer explicit, user-approved preferences. Infer a rule only after repeated independent evidence, retain its provenance, let the developer edit or delete it, and decay or revalidate stale rules.
4. **Use enforcement for hard constraints.** If “never commit secrets” or “run this verifier before completion” is objectively checkable, implement a permission boundary or runtime check rather than trusting prompt compliance.
5. **Treat plugins like dependencies.** Pin versions, inspect Skills and scripts, minimize scopes, sandbox side effects, show approvals, log actions, and make rollback straightforward.

### Evaluation design

A credible longitudinal study should compare at least:

- no Skill;
- shared generic Skill;
- the target developer’s Skill;
- another developer’s Skill;
- shared plus personal guidance;
- oracle-selected task Skill; and
- realistic retrieval, with and without refinement.

Hold model snapshot, harness, repository state, permissions, budget, and verifier constant. Add length-matched irrelevant guidance to distinguish procedural value from extra context. Use chronological and cross-project holdouts so a Skill cannot simply restate the solution.

Measure:

- deterministic task completion and accepted changes;
- developer edits, reversions, corrections, and unresolved follow-ups;
- time-to-acceptance and subjective burden for real developers;
- tokens, latency, tool calls, patch size, and test activity;
- Skill retrieval, invocation, adherence, and negative-transfer rates; and
- unsafe actions, excessive permissions, injection success, and data egress.

The focal paper’s replay method is a useful low-cost pretest. It should precede, not replace, a prospective developer study.

## Bottom line

The current evidence favors **curated, focused, relevant, validated Skills**. It does not support indiscriminately installing more Skills, inferring rich personal profiles from sparse histories, or using “plugin” as a proxy for improved performance.

For coding agents, the most evidence-aligned strategy is a shared procedural core, task-specific retrieval, a small user-controlled preference layer, deterministic checks for hard constraints, and paired evaluation that prices in cost and security. Personalized Skills remain a plausible direction—but the August 2026 paper shows that, with the data and method tested so far, generic shared practice is the safer default.

## References

1. Huang, Du, and Lan. [Do Personalized Skills Help Coding Agents?](https://arxiv.org/abs/2608.10319) arXiv:2608.10319v2, 2026.
2. Baumann et al. [SWE-chat: Coding Agent Interactions From Real Users in the Wild](https://arxiv.org/abs/2604.20779), 2026.
3. Li et al. [SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks](https://arxiv.org/abs/2602.12670), v4, 2026.
4. Han et al. [SWE-Skills-Bench: Do Agent Skills Actually Help in Real-World Software Engineering?](https://arxiv.org/abs/2603.15401), 2026.
5. Liu et al. [How Well Do Agentic Skills Work in the Wild](https://arxiv.org/abs/2604.04323), 2026.
6. Cho, Kang, and Kim. [SkillRet: A Large-Scale Benchmark for Skill Retrieval in LLM Agents](https://arxiv.org/abs/2605.05726), 2026.
7. Liu et al. [Rethinking Self-Evolving Agent Skills: Feedback Dynamics over Multiple Rounds](https://arxiv.org/abs/2608.02636), 2026.
8. Zhou et al. [Getting Better at Working With You: Compiling User Corrections into Runtime Enforcement for Coding Agents](https://arxiv.org/abs/2606.13174), 2026.
9. Zhou et al. [ToM-SWE: User Mental Modeling for Software Engineering Agents](https://arxiv.org/abs/2510.21903), 2025.
10. Schick et al. [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761), NeurIPS 2023.
11. Qin et al. [ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs](https://arxiv.org/abs/2307.16789), ICLR 2024.
12. Yao et al. [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045), 2024.
13. Debenedetti et al. [AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents](https://arxiv.org/abs/2406.13352), NeurIPS 2024.
14. Zhan et al. [InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents](https://arxiv.org/abs/2403.02691), Findings of ACL 2024.
15. [Agent Plugins Specification 1.0.0](https://agent-plugins.org/specification), 2026.
16. [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25).

## Supporting research materials

- [Detailed focal-paper extraction](/guides/skills-plugins-impact/personalized-skills-paper)
- [Adjacent academic literature review](/guides/skills-plugins-impact/adjacent-literature)
- [Ecosystem, tool, plugin, and security evidence](/guides/skills-plugins-impact/ecosystem-evidence)
