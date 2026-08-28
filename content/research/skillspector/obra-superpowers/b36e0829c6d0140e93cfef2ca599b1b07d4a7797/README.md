# obra/superpowers SkillSpector review

This directory contains the preliminary security review of the exact
`obra/superpowers` checkout at commit
`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.

## Inventory

The repository contains **14 skills**, defined here as directories under
`skills/` containing `SKILL.md`. The README's “What's Inside” section lists the
same 14 names; it is not 18.

## Static scan

- Scanner: NVIDIA SkillSpector `2.10.0`, updated from the official NVIDIA
  repository before scanning.
- Mode: static-only (`--no-llm`), one report per skill directory.
- Scanned: 14/14 skill directories; each report accounts for 100% of its
  discovered components.
- Completeness: reports are marked `partial` because some local path-like
  references could not be resolved unambiguously.
- Semantic analysis: not run; no LLM API key was available. The next step is a
  user-selected local Codex review or explicitly approved OpenRouter review.
- OWASP regex triage: no high-signal direct-injection or output-leakage matches.

## Results

| Skill | Score | Severity | Recommendation | Issues |
| --- | ---: | --- | --- | ---: |
| `brainstorming` | 80 | HIGH | DO_NOT_INSTALL | 10 |
| `dispatching-parallel-agents` | 0 | LOW | CAUTION | 0 |
| `executing-plans` | 8 | LOW | CAUTION | 1 |
| `finishing-a-development-branch` | 17 | LOW | CAUTION | 1 |
| `receiving-code-review` | 0 | LOW | CAUTION | 0 |
| `requesting-code-review` | 7 | LOW | CAUTION | 1 |
| `subagent-driven-development` | 23 | MEDIUM | CAUTION | 2 |
| `systematic-debugging` | 52 | HIGH | DO_NOT_INSTALL | 4 |
| `test-driven-development` | 0 | LOW | CAUTION | 0 |
| `using-git-worktrees` | 11 | LOW | CAUTION | 2 |
| `using-superpowers` | 49 | MEDIUM | CAUTION | 4 |
| `verification-before-completion` | 7 | LOW | CAUTION | 1 |
| `writing-plans` | 0 | LOW | CAUTION | 0 |
| `writing-skills` | 89 | CRITICAL | DO_NOT_INSTALL | 20 |

The three highest scores are useful review leads, not verdicts. The flagged
content includes local development-server lifecycle code, security/debugging
examples, and documentation about authoring or enumerating skills. Those
contexts can create legitimate static matches, so line-level manual review and
semantic assessment remain necessary.

SkillSpector does not prove publisher identity, artifact integrity, runtime
safety, dependency resolution, or absence of vulnerabilities. It can produce
false positives and false negatives, and a 100% component-coverage value does
not mean every behavior was semantically understood.

The individual JSON reports are in [`static/`](./static/). The compact index is
[`index.json`](./index.json), and the deterministic OWASP triage is in
[`owasp-regex-triage.json`](./owasp-regex-triage.json).
