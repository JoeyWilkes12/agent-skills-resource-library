---
publisher: Resource Library
source: https://github.com/headroomlabs-ai/headroom
last_verified: 2026-09-25
---

# Headroom: effectiveness and security evidence

*What Headroom compresses, what independent coding-agent tests actually measured, and why a similarly named skills.sh skill has a separate security record.*

## Contents

- [The short answer](#the-short-answer)
- [What Headroom does](#what-headroom-does)
- [How the effectiveness evidence compares](#how-the-effectiveness-evidence-compares)
- [What JetBrains did and did not test](#what-jetbrains-did-and-did-not-test)
- [SkillSpector static review](#skillspector-static-review)
- [skills.sh registry check](#skillssh-registry-check)
- [A defensible pilot](#a-defensible-pilot)
- [Sources and scope](#sources-and-scope)

## The short answer

**Headroom can substantially shorten selected tool results, but public evidence does not establish a general reduction in the cost of completed coding tasks.** Independent experiments report both meaningful payload savings and higher cache-aware agent bills. The result depends on which content reaches the compressor, whether prompt caching survives, how many extra turns the agent takes, and whether the task still succeeds.

Headroom is a software toolkit, not the similarly named community Agent Skill on skills.sh. As of September 25, 2026, I found [JetBrains' RTK benchmark](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/) but no JetBrains evaluation of Headroom. The skills.sh audits described below apply to a [different repository](https://github.com/romangalaxys10-spec/headroom-skill), not to [Headroom's publisher repository](https://github.com/headroomlabs-ai/headroom).

## What Headroom does

[Headroom's documentation](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/README.md) describes a Python/TypeScript library, local proxy, agent wrappers, and an MCP server. A content router chooses compression for data such as JSON, logs, code, or prose before a model request. Its Compress-Cache-Retrieve (CCR) feature keeps originals locally so an agent can retrieve detail it later needs. The compression itself is local; the resulting model request still goes to the configured provider.

The publisher advertises roughly 20% fewer tokens for coding agents and 60–95% for favorable structured payloads. Those are **primary-source claims** about particular inputs and configurations. They are not a prediction of provider charges or task completion on every agent. Short, dense, or protected content may pass through with little change.

## How the effectiveness evidence compares

| Evidence | Work measured | Result | Practical limit |
| --- | --- | --- | --- |
| [Headroom's benchmarks](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/docs/content/docs/benchmarks.mdx) · publisher | Local compression scenarios and small accuracy evaluations | Large reductions for repetitive JSON/logs; different content compresses differently | Mainly measures bytes or tokens entering a model, not the cost of a completed coding task |
| [Miya-Gadget test](https://miyagadget.page/en/blog/2026/06/03/headroom-ai-context-compression-benchmark-en/) · independent community report | Synthetic tool-result payloads under Headroom 0.22.3 | JSON −59.2%, logs −31.0%, code −79.8%; a constructed debugging conversation −47.5% input | The proxy did not complete an end-to-end API test; keyword checks do not prove task quality |
| [Shreyassks benchmark](https://github.com/shreyassks/headroom-benchmarks) · independent community report | 50 fixture-based LangGraph cases, 106 model calls, MiniMax-M3 | 44.15% input compression; 37.05% lower calculated list-price cost | The author notes prompt-cache effects in paired calls; the fixture and pricing differ from a coding-agent workload |
| [Dasein Code-Compression Bench](https://github.com/daseinlabs/code-compression-bench) · competitor-operated test | One 100-task SWE-bench Verified run per arm, headless Claude Code | Headroom: 58 solved versus 57 baseline; **+44% cache-aware total cost**, +42% cost per solved task. RTK: 54 solved, +13% total cost | One reported run per arm; results are specific to this harness, model, and integration. Dasein sells a competing product |
| [Sleev performance study](https://sleev.ai/performance) · competitor-operated test | One 113-task batched coding run each for Headroom, RTK, and Context Mode | Headroom cost more than baseline; RTK cost less, with Headroom matching baseline solve rate | Competing vendor; one run for each comparison tool and a different workload from Dasein |

These rows measure different denominators. A 59% shorter JSON result is not a 59% smaller invoice. Provider caching can make a stable, long prefix cheaper than a shorter prefix that changes frequently. Extra retrieval, retries, or turns can erase a local reduction. The Dasein and Sleev results are evidence against assuming universal savings; their competitor sponsorship and limited repetitions keep them from being a universal negative verdict either.

## What JetBrains did and did not test

[JetBrains' RTK study](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/) is the closest article in its series, but it tested **RTK**, a hook that filters eligible Bash output. Headroom works nearer the model-request boundary and can reach different content. JetBrains measured RTK at **+7.6% median cost at low reasoning effort** and approximately flat cost at high effort, with no detectable task-quality difference. Its key lesson is methodological: RTK's own counter reported large token savings while the billed run became more expensive.

The other two guides address different interventions: [Caveman](/guides/jetbrains-caveman-token-benchmark) shortens agent narration, while [Ponytail](/guides/jetbrains-ponytail-code-benchmark) steers the agent toward smaller implementations. JetBrains measured roughly 8.5% fewer output tokens for forced Caveman and 10.3% lower median cost for Ponytail on their respective tasks. None of those percentages transfers directly to Headroom. The [Dasein benchmark](https://github.com/daseinlabs/code-compression-bench) supplies a same-harness Headroom-versus-RTK comparison; JetBrains does not.

## SkillSpector static review

**Local static pre-check, September 25, 2026.** NVIDIA SkillSpector **v2.12.0** scanned selected paths from [Headroom commit `66f4261`](https://github.com/headroomlabs-ai/headroom/tree/66f426171bab32692cf93d2b656a8e4be9004186) and a separate community skill at [commit `118466d`](https://github.com/romangalaxys10-spec/headroom-skill/tree/118466d7737ebc42806c331e44bd251b5222d59b). All scans used `--no-llm`. A score is a triage signal, not a finding that code is malicious or safe. These were scoped scans, not a complete repository audit; code-directory coverage was incomplete.

| Artifact scanned | Score / scanner band | Files inspected | Finding to review |
| --- | --- | --- | --- |
| Official README | 48 / medium caution | 1 of 1 | Optional model selection, keychain use, and remote setup commands appear in documentation |
| Official compression transforms | 50 / medium caution | 33 of 39 | [`torch.load` loads a model checkpoint](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/transforms/kompress_compressor.py#L811); checkpoint provenance matters |
| Official MCP registration | 95 / critical scanner band | 7 of 10 | [Codex config](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/mcp_registry/codex.py#L1-L10) and [Claude config](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/mcp_registry/claude.py#L1-L10) are changed by registration; [the `uvx` package specification is not version-pinned](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/mcp_registry/server_json.py#L65-L70) |
| Official proxy | 100 / critical scanner band | 105 of 119 | Multiple config, routing, and deletion surfaces need manual review; the score also includes false positives from defensive code |
| Community `headroom` skill | 100 / critical scanner band | 20 of 21 | Instructions [append to global Claude and Codex guidance](https://github.com/romangalaxys10-spec/headroom-skill/blob/118466d7737ebc42806c331e44bd251b5222d59b/docs/integrations.md#L39-L48) and [delete the local cache](https://github.com/romangalaxys10-spec/headroom-skill/blob/118466d7737ebc42806c331e44bd251b5222d59b/docs/reversible-ccr.md#L57-L67) |

[Inspect the normalized SkillSpector findings](/data/security-reviews/headroom/2026-09-25/skillspector-summary.json) for every reported rule, severity, source location, and the coverage ledger.

**Manual triage:** The official MCP score largely reflects the documented ability to modify agent-wide configuration. Its environment-copy match is in code that launches the Claude CLI with an isolated config directory; the match alone does not establish credential exfiltration. The unpinned `uvx` requirement is a genuine reproducibility and supply-chain question. The proxy scanner also flagged `169.254.169.254` inside [DNS-rebinding defense comments](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/proxy/upstream_guard.py#L75-L90), while a `compile(..., "exec")` match in the compressor is [syntax validation without execution](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/headroom/transforms/code_compressor.py#L2285-L2295). The community skill's global instruction edits and cache deletion are documented actions, but they warrant review before installation. Neither artifact was installed or executed for this review.

The high-signal OWASP regex check found no direct “ignore previous instructions” or “system override” instruction in the scoped files. Matches resembling API keys were variable names and examples. That check cannot detect all indirect, encoded, or multi-turn prompt injection. Treat retrieved logs, search hits, and compressed output as data; keep tool permissions narrow and validate high-impact actions. See [OWASP's Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## skills.sh registry check

**skills.sh registry check, retrieved September 25, 2026:** The exact first-party URL [`headroomlabs-ai/headroom/headroom`](https://skills.sh/headroomlabs-ai/headroom/headroom) reported that this skill is unavailable; its three audit detail URLs returned 404. The fixed official repository snapshot inspected here contained no `SKILL.md`. This means **no verified first-party skills.sh audit**, not a passing audit.

A separate [community `headroom` skill](https://skills.sh/romangalaxys10-spec/headroom-skill/headroom) is listed under `romangalaxys10-spec/headroom-skill/headroom`. Its page says it was originally from another community repository and that it can work without Headroom's binary. Its registry verdicts must not be attributed to the official Headroom package:

| Registry reviewer | Published verdict | Detail |
| --- | --- | --- |
| [Gen Agent Trust Hub](https://skills.sh/romangalaxys10-spec/headroom-skill/headroom/security/agent-trust-hub) | Pass; SAFE | Describes standard-library helpers and local caching; also identifies external tool data as a potential indirect prompt-injection surface |
| [Socket](https://skills.sh/romangalaxys10-spec/headroom-skill/headroom/security/socket) | Pass | Reports no alert on its checks; its package URL names commit `118466d` |
| [Snyk](https://skills.sh/romangalaxys10-spec/headroom-skill/headroom/security/snyk) | **Warn; MEDIUM; one issue W011** | Flags third-party text entering SmartCrusher and then the model as an indirect prompt-injection exposure |

[Inspect the skills.sh registry snapshot](/data/security-reviews/headroom/2026-09-25/skills-sh-registry-summary.json) for the recorded identities, verdicts, and detail URLs.

All three detail pages were dated August 7, 2026. The community repository's current commit was `118466d` (June 17, 2026), and Socket's package URL names that commit; exact snapshot correspondence for the other two audits was not exposed. The conservative registry signal is **manual review required** because Snyk warns. Registry results are snapshots of a separate skill and do not verify the official package, dependency resolution, publisher identity, or runtime behavior. The local SkillSpector scan of the community skill is a separate, static-only assessment.

## A defensible pilot

1. Pin Headroom's version, agent, model, provider, and integration mode. Review any changes to global agent settings and where CCR originals are stored.
2. Estimate the reachable share of context: JSON, logs, source, prose, and tool results that Headroom actually receives. Keep the uncompressed provider baseline.
3. Run the same representative coding tasks in paired, repeated trials. Record completion, provider-reported uncached input, cache writes and reads, output tokens, turns, latency, and total bill.
4. Inspect failures, retrieval calls, lost details, prompt-cache churn, and any extra agent actions. Compute **cost per successfully completed task**, not just compression ratio.
5. Treat agent-visible tool output as untrusted data. Review the exact package and configuration changes before installing or wrapping agents; do not substitute a community skills.sh badge for that review.

Adopt only a measured claim tied to the pinned workload and configuration, for example: “this setup lowered cost per solved task by X% across these repeated tasks without a detectable quality loss.” Public results currently support running that test; they do not support a universal savings promise.

## Sources and scope

- [Headroom repository and publisher claims](https://github.com/headroomlabs-ai/headroom/tree/66f426171bab32692cf93d2b656a8e4be9004186)
- [Headroom benchmark methods](https://github.com/headroomlabs-ai/headroom/blob/66f426171bab32692cf93d2b656a8e4be9004186/docs/content/docs/benchmarks.mdx)
- [Miya-Gadget's payload test](https://miyagadget.page/en/blog/2026/06/03/headroom-ai-context-compression-benchmark-en/)
- [Shreyassks' agent benchmark and caveats](https://github.com/shreyassks/headroom-benchmarks)
- [Dasein's comparative benchmark and methodology](https://github.com/daseinlabs/code-compression-bench)
- [Sleev's comparative study](https://sleev.ai/performance)
- [JetBrains' RTK study](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/)
- [skills.sh audit documentation](https://skills.sh/audits)

The third-party benchmarks were not rerun for this guide. Static scanning did not execute Headroom, prove dependency safety, or cover every source path. The differing benchmark versions, task sets, caches, and graders should remain visible when comparing results.
