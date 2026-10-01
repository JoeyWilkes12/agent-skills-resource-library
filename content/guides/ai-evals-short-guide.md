# AI evals: a quick guide

*A brief path from human trace review to useful checks, with security evidence for nine skills.*

AI evals check whether your app does its job on realistic inputs. Begin with human review, then automate important checks. Reference: [Hamel Husain and Shreya Shankar’s article](https://hamel.dev/blog/posts/evals-skills/) and [repository](https://github.com/ai-evals-course/evals-skills).

## Start with real failures

1. **Start:** use `evals-start` to route toward pipeline auditing or trace review.
2. **Learn:** inspect varied traces; describe failures and acceptable answers.
3. **Measure:** use code for objective checks; validate subjective LLM judges against held-out human labels.
4. **Improve:** fix recurring failures, rerun checks, and add new real cases.

## Security snapshot

Checked **September 30, 2026** (October 1 UTC), at [commit `80d5f7b`](https://github.com/ai-evals-course/evals-skills/tree/80d5f7b0127c7572ed9e9339937adbfd7240ffeb). SkillSpector **v2.12.0**, static-only; scores are out of 100, all LOW. The [registry appendix](/data/security-reviews/evals-skills/2026-09-30/skills-sh-report.md) links all 27 provider audits.

| Skill | Use | SkillSpector | Trust Hub | Socket | Snyk |
|---|---|---:|---|---|---|
| [evals-start](https://skills.sh/ai-evals-course/evals-skills/evals-start) | Choose next step | 0 | PASS | PASS | PASS |
| [eval-audit](https://skills.sh/ai-evals-course/evals-skills/eval-audit) | Inspect existing evals | 0 | PASS | PASS | PASS |
| [error-discovery](https://skills.sh/ai-evals-course/evals-skills/error-discovery) | Find failure categories | 0 | PASS | PASS | PASS |
| [build-review-interface](https://skills.sh/ai-evals-course/evals-skills/build-review-interface) | Review and label traces | 0 | PASS | PASS | PASS |
| [generate-synthetic-data](https://skills.sh/ai-evals-course/evals-skills/generate-synthetic-data) | Broaden test inputs | 0 | PASS | PASS | PASS |
| [write-code-eval](https://skills.sh/ai-evals-course/evals-skills/write-code-eval) | Check objective requirements | 0 | PASS | PASS | PASS |
| [write-judge-prompt](https://skills.sh/ai-evals-course/evals-skills/write-judge-prompt) | Judge subjective criteria | 0 | PASS | PASS | PASS |
| [validate-evaluator](https://skills.sh/ai-evals-course/evals-skills/validate-evaluator) | Compare judges with humans | 0 | PASS | PASS | PASS |
| [evaluate-rag](https://skills.sh/ai-evals-course/evals-skills/evaluate-rag) | Check retrieval and grounding | 7 | PASS | PASS | PASS |

## Limits and evidence

`error-discovery` has partial reference resolution: Python’s server module and future output files. `evaluate-rag` has a MEDIUM match in grounding advice, manually identified as a false positive.

Repository scan: **55/HIGH**, from README false positives and an unpinned installer advisory. Local Codex found no malicious instructions; `error-discovery` needs explicit trace-rendering sanitization. Registry audits: September 1 or 24–25; commit correspondence is unverified. Dependencies/CDNs and runtime behavior remain unreviewed. PASS does not prove safety. [Triage and evidence](/data/security-reviews/evals-skills/2026-09-30/review-notes.md).

[Download this guide](/guides/ai-evals-short-guide.md).
