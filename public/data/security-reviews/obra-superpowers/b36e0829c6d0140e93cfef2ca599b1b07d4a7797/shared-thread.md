# Archived shared thread: Obra Superpowers review

Source: [shared ChatGPT conversation](https://chatgpt.com/share/6a4eb190-86ac-83e8-a559-42ded97f6828)

Retrieved from the public share page on 2026-08-28. This is preserved as an
archived research source. It is not a new independent benchmark, and claims in
the response should be checked against the linked primary sources before being
used as current product or security guidance.

## User prompt

As an AI engineer, review the Obra superpowers skills (see GitHub). Has anyone
online does evaluation or reviews of these skills? How effective are they? Are
they equally useful for Codex as well as Claude?

## ChatGPT response

I’ll ground this in the actual Obra repository first, then look for independent
discussion or reviews rather than assuming popularity from GitHub metadata
alone. I’ll also evaluate portability across Claude-style “skills” and
Codex-style agent instructions separately.

The strongest early signal is mixed: Superpowers has real adoption and a
purpose-built eval harness, but the best public evidence is still mostly
workflow-compliance testing and anecdotal review, not a clean independent
benchmark proving higher defect-removal or shipping velocity.

### Bottom line

Obra/Superpowers looks useful as an agentic software-development operating
procedure, not as a universally proven “skill pack that makes models smarter.”
Its best value is discipline: forcing brainstorming, specs, plans, TDD,
verification, code review, worktrees, and branch cleanup. That is valuable for
nontrivial features, debugging, and multi-step implementation; it can be
overhead for small changes.

It is not equally useful in Claude and Codex, but it is usable in both. Claude
Code appears to be the more native/original target; Codex now has enough
official plugin, skill, subagent, and worktree support that Superpowers can
work well there too, but I would invoke it more explicitly in Codex.

### What Superpowers actually is

The main repo describes Superpowers as a software-development methodology built
from composable skills and startup instructions. The core workflow is:
brainstorm → use a git worktree → write a detailed implementation plan →
execute via subagents or checkpoints → enforce TDD → request code review →
finish the branch.

The repo explicitly lists support for Claude Code, Antigravity, Codex App,
Codex CLI, Cursor, Factory Droid, GitHub Copilot CLI, Kimi Code, OpenCode, and
Pi. See the [Superpowers repository](https://github.com/obra/superpowers).

The skills library is mostly process-oriented:

- `test-driven-development`
- `systematic-debugging`
- `verification-before-completion`
- `brainstorming`
- `writing-plans`
- `executing-plans`
- `dispatching-parallel-agents`
- `requesting-code-review`
- `receiving-code-review`
- `using-git-worktrees`
- `finishing-a-development-branch`
- `subagent-driven-development`
- `writing-skills`
- `using-superpowers`

### Are there online evaluations or reviews?

Yes, but the evidence quality varies.

| Source type | What it says | How much weight I’d give it |
| --- | --- | --- |
| Superpowers’ own eval harness | Prime Radiant has [`superpowers-evals`](https://github.com/prime-radiant-inc/superpowers-evals/), a behavioral eval lab that drives real coding-agent CLIs including Claude, Codex, Antigravity, Gemini, Kimi, OpenCode, Pi, and Copilot. It measures workflow compliance: skill triggering, worktree behavior, subagent coordination, verification reflexes, review quality, and cost-shaping. | Useful, but not independent and not a general SWE benchmark. |
| Hacker News discussion | Mixed reviews. One commenter found brainstorming and adversarial spec/plan review valuable, but felt the separate implementation plan can be less useful. Another said Superpowers sometimes made Claude worse, while recommending people try it without treating it as a silver bullet. | Useful practitioner signal; anecdotal. |
| Reddit / r/ClaudeCode | Some users report that it helps Claude work longer on tasks and improves end results; others discuss cost/usage limits and plan-tier constraints rather than controlled quality metrics. | Useful adoption signal; anecdotal and biased toward enthusiasts. |
| Third-party comparison article | A [DEV Community comparison](https://dev.to/truongpx396/spec-kit-vs-superpowers-a-comprehensive-comparison-practical-guide-to-combining-both-52jj) frames Superpowers as process-centric, auto-triggered, and compatible with Claude, Codex, Gemini, Cursor, Copilot CLI, and others. | Useful taxonomy; not rigorous evaluation. |
| Skill grading issue | One [GitHub issue](https://github.com/obra/superpowers/issues/202) grades `using-superpowers` as 68/100, criticizing broad triggers, emotional/marketing language, repetitive red flags, and missing concrete examples. | Useful critique of skill-writing quality, not proof of runtime effectiveness. |
| Academic skills benchmarks | General research is cautious: [SWE-Skills-Bench](https://arxiv.org/abs/2603.15401) found 39 of 49 public SWE skills produced zero pass-rate improvement, average gain was only +1.2%, and only seven specialized skills had meaningful gains. | High relevance to “skills” generally, but not specifically an Obra/Superpowers benchmark. |

### How effective are they?

My read: effective when the bottleneck is process discipline, less effective
when the bottleneck is model capability or project context.

Superpowers should help most when you are doing a medium-to-large feature,
brownfield refactor, tricky bug hunt, or anything where “write code
immediately” is likely to overbuild or drift. The strongest skills are likely
`brainstorming`, `systematic-debugging`, `verification-before-completion`,
`using-git-worktrees`, `test-driven-development`, and
`requesting-code-review`, because they encode durable engineering practices
rather than model-specific tricks.

It is less compelling for tiny edits, exploratory prototypes, UI polish,
one-off scripts, or repos with weak/no test harness. In those cases, the
workflow can impose too much ceremony: design doc, plan doc, subagent review,
TDD, and branch finishing can burn context and time without a proportional
quality gain.

The broader evidence supports this selective-use view. SWE-Skills-Bench
suggests generic skill injection often has little marginal effect and can add
large token overhead, while domain-specific skill packs can help substantially
when they encode tool-specific expertise and match the execution harness.

### Claude vs Codex usefulness

**Claude Code is probably the best fit.** Superpowers originated around Claude
Code workflows, and Claude’s current docs describe skills as first-class
`SKILL.md` capabilities that Claude can invoke automatically or directly.
Claude Code also extends the open skill standard with invocation control,
subagent execution, and dynamic context injection, which maps closely to
Superpowers’ orchestration style. See the [Claude Code skills documentation](https://docs.anthropic.com/en/docs/claude-code/skills).

**Codex support is real, not theoretical.** OpenAI’s Codex docs describe
plugins as bundles of skills, apps, and MCP servers; Codex skills are available
in the CLI, IDE extension, and Codex app; and Codex uses progressive disclosure
so only skill metadata is loaded up front and full instructions load when
selected. See the [Codex plugins documentation](https://developers.openai.com/codex/plugins).

The main practical difference: **Codex is more explicit about subagent
spawning.** OpenAI docs say Codex can run subagent workflows, but Codex only
spawns subagents when explicitly asked, and subagent workflows consume more
tokens than comparable single-agent runs. That means Superpowers’
subagent-heavy workflows may need clearer prompts in Codex, such as “Use the
Superpowers workflow and spawn subagents for plan review, implementation, and
code review.” See the [Codex subagents documentation](https://developers.openai.com/codex/subagents).

### Recommended usage pattern

For Claude Code, I would install Superpowers and let it guide larger work, but
still interrupt it when the plan gets too verbose. For Codex, I would use it
more intentionally: invoke the relevant skill or say explicitly that you want
the Superpowers workflow.

| Skill / workflow | Claude Code | Codex | Recommendation |
| --- | --- | --- | --- |
| `brainstorming` | High | High | Use for vague feature ideas before coding. |
| `systematic-debugging` | High | High | Use for bugs where the cause is unknown. |
| `verification-before-completion` | High | High | Use almost always; this is low ceremony and high value. |
| `using-git-worktrees` | High | High, especially Codex app | Use for risky changes or parallel tasks. |
| `test-driven-development` | High | Medium-high | Use when tests are cheap and meaningful; skip for throwaway prototypes. |
| `writing-plans` | Medium-high | Medium | Use for multi-file work; avoid for small edits. |
| `subagent-driven-development` | High but expensive | Medium-high but more explicit | Use for complex work; expect token/runtime overhead. |
| `requesting-code-review` | High | High | Use before merging or when the agent made broad changes. |
| `writing-skills` | High for skill authors | High for skill authors | Useful if you are building your own reusable workflows. |

### Caveats

Treat Superpowers as agent scaffolding, not verification. You still need tests,
diffs, code review, and a clear rollback path. The skill ecosystem also has
security concerns: a [2026 survey](https://arxiv.org/abs/2602.12430) reported
that 26.1% of community-contributed skills contained vulnerabilities, so
installed skills, scripts, hooks, and plugin manifests deserve review before
broad use.

My recommendation: use Superpowers for Claude Code by default on serious
coding tasks; use it in Codex selectively and explicitly. It is most valuable
when you want the agent to behave less like autocomplete and more like a junior
engineer operating under a disciplined SDLC.
