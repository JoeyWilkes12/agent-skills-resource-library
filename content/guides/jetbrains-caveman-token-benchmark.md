---
publisher: JetBrains
source: https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/
last_verified: 2026-09-01
---

# Does Speaking to AI Agents Like Cavemen Really Save 65% of Tokens?

*A concise reading guide to JetBrains' paired benchmark of the Caveman style skill—and the enterprise lesson that agent invoices are not chat transcripts.*

## Read the source and the rest of the series

This page summarizes and interprets [JetBrains' original benchmark](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/). It is not a replacement for the article's methodology notes or artifacts.

The series continues with [the rtk compression trial](/guides/jetbrains-rtk-token-benchmark) and [the Ponytail minimal-code trial](/guides/jetbrains-ponytail-code-benchmark).

## The short answer

The Caveman skill did what it promised stylistically: it made the agent's narration terse while leaving code, diffs, commands, and exact error messages intact. On real coding-agent work, that translated to **8.5% fewer output tokens**, not the advertised 65%. JetBrains found no detectable task-quality degradation across the full paired run, but the cost benefit was fragile and could be erased by a single long-context outlier.

The important distinction is what the skill can actually change. Agent sessions spend much of their budget on tool calls and code artifacts. Compressing the prose between those calls has a limited ceiling.

## What JetBrains tested

The experiment used headless Claude Code with `claude-sonnet-5` at low reasoning effort and the SkillsBench task set. The same task was run in a stock arm and a Caveman arm, with activation forced so that the result represented the skill's best case. JetBrains used a small smoke run, repeated trials, and a larger paired run rather than treating one attempt as evidence.

That activation detail matters for adoption. In ordinary use, a model may not select a user-activated style skill at all. A forced-activation result is therefore an upper bound, not a forecast of every developer's daily savings.

## Results that generalize—and those that do not

| Measure | JetBrains result | How to use it |
| --- | --- | --- |
| Advertised output-token saving | 65% | Treat as a chat-style claim, not an agent-work claim |
| Measured output-token saving | 8.5% | A realistic ceiling when the skill is activated on comparable work |
| Task quality | No statistically detectable difference | A null result, not proof of equivalence or safety |
| Cost | Roughly 10% cheaper in expectation, but outlier-sensitive | Measure per-task bills, not arm totals alone |
| What stayed untouched | Code, tool calls, diffs, and exact strings | The largest parts of agent output remain unchanged |

The first ten-task run looked much more dramatic; the effect shrank as repeated and full runs added variance. That is a useful warning for every internal AI benchmark: a persuasive smoke test can be a sample-size artifact.

## Enterprise takeaway: make terseness a preference, not a FinOps control

Teams can use a concise response style when it improves readability or reduces distracting narration. They should not promise a 65% reduction in production spend. If cost is the goal, instrument the actual provider bill and include cached reads, retries, context length, reasoning effort, and long-context pricing tiers.

Keep style guidance separate from safety and accountability. The skill changed presentation; it did not establish that the agent's code was secure, accessible, maintainable, or compliant. Those properties need their own checks.

## A small, defensible pilot

1. Pin the model, agent version, skill commit, reasoning effort, and activation path.
2. Select representative internal tasks, including routine work and long-context outliers.
3. Compare the same tasks with and without the style skill, using multiple trials per task.
4. Record billed cost, output and input tokens, turns, latency, task score, and retry reasons.
5. Keep the skill only if the observed benefit survives the quality, security, and developer-experience gates.

The decision should be phrased as “this configuration reduced cost on this workload by approximately X,” never “this skill saves X everywhere.”

## Sources and further reading

- [JetBrains: Does Speaking to AI Agents Like Cavemen Really Save 65% of Tokens?](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)
- [JetBrains: Does “rtk” skill really cut agent tokens by 60–90%?](/guides/jetbrains-rtk-token-benchmark)
- [JetBrains: Ponytail Skill for Claude Code](/guides/jetbrains-ponytail-code-benchmark)
