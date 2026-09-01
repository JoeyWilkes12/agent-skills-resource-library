---
publisher: JetBrains
source: https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/
last_verified: 2026-09-01
---

# Does “rtk” Really Cut Agent Tokens by 60–90%?

*A concise reading guide to JetBrains' paired trial of rtk, a command-output compression hook, and why a tool's own savings counter is not an invoice.*

## Read the source and the rest of the series

This page summarizes and interprets [JetBrains' original rtk benchmark](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/). Read the source for the complete transcript forensics, accounting correction, and methodology.

The series begins with [the Caveman style trial](/guides/jetbrains-caveman-token-benchmark) and continues with [the Ponytail minimal-code trial](/guides/jetbrains-ponytail-code-benchmark).

## The short answer

rtk's compression is real: a hook can turn verbose `git status` or test output into a shorter representation. The problem is the counterfactual. Claude Code's built-in file and search tools bypass the hook, many shell commands are unsupported, tool results may already be truncated, and cached context reads dominate part of the bill.

On JetBrains' full run, rtk produced **7.6% higher median cost at low reasoning effort**. At high effort, the penalty disappeared but savings still did not appear. Task quality remained statistically indistinguishable in both settings.

## What JetBrains tested

JetBrains ran stock Claude Code against Claude Code with rtk v0.43.0, using the same `claude-sonnet-5` model and SkillsBench tasks at low and high reasoning effort. The hook was installed exactly as documented and its audit log was retained, so the treatment was known to have fired.

Before the paid runs, they replayed baseline transcripts to estimate the ceiling. Only about a third of Bash calls were eligible for rewriting, and those calls carried just under a fifth of tool-result characters. That is only a slice of the context that the model is billed for.

## Results and the counterfactual problem

| Signal | JetBrains result | Enterprise interpretation |
| --- | --- | --- |
| README promise | 60–90% less token use | A claim about an idealized command-output counterfactual |
| Low-effort cost | 7.6% higher median cost | Compression can trigger extra turns, retries, or alternate paths |
| High-effort cost | Approximately flat | No measured saving even when the penalty disappeared |
| Quality | No detectable difference | Functional pass rates survived, but compatibility still matters |
| Tool's own counter | 96.2M tokens reported saved while cost rose | Internal counters can count bytes the model never would have received |

The most important lesson is methodological: rtk counted raw output against a hypothetical full response, while Claude Code would already have truncated some of those responses. It also treated characters divided by four as tokens and did not price cached re-reads like fresh input. A scoreboard can therefore look excellent while measuring the wrong baseline.

## Enterprise takeaway: optimize completed work, not compressed bytes

Before approving a context-compression hook, map the actual execution path. Which tools and commands does the agent use? Which outputs reach the model? Which outputs are truncated or cached? Does compression make the agent re-read files, retry commands, or take more turns?

Treat compatibility as a release gate. JetBrains found a real `find` rewrite failure and a glibc incompatibility in one task image. A tool can preserve quality on the tasks that complete while still being unsuitable for a heterogeneous developer fleet.

## A small, defensible pilot

1. Capture baseline traces and classify tool calls by whether the proposed hook can reach them.
2. Compare provider bills on the same tasks; retain the tool's counter only as diagnostic metadata.
3. Run both low- and high-effort configurations if developers will use both.
4. Monitor extra turns, retries, command failures, re-reads, and task completion—not just token deltas.
5. Test representative operating-system and container images before enabling a global hook.

The adoption question is not “how many characters did rtk remove?” It is “did the organization complete the same work more cheaply and reliably?”

## Sources and further reading

- [JetBrains: Does “rtk” skill really cut agent tokens by 60–90%?](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/)
- [JetBrains: Does Speaking to AI Agents Like Cavemen Really Save 65% of Tokens?](/guides/jetbrains-caveman-token-benchmark)
- [JetBrains: Ponytail Skill for Claude Code](/guides/jetbrains-ponytail-code-benchmark)
