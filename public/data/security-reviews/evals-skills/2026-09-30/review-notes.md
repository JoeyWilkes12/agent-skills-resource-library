# AI evals skills: review evidence

Reviewed September 30, 2026, America/Denver; scan and registry timestamps fall on October 1 UTC. This supports the [short guide](https://joeywilkes12.github.io/agent-skills-resource-library/guides/ai-evals-short-guide).

The target is [ai-evals-course/evals-skills at commit `80d5f7b0127c7572ed9e9339937adbfd7240ffeb`](https://github.com/ai-evals-course/evals-skills/tree/80d5f7b0127c7572ed9e9339937adbfd7240ffeb), committed September 24, 2026 at 18:21:08 UTC. [Artifact hashes](artifact-manifest.json) identify all 26 files. All nine bundled skills were reviewed, including `write-code-eval`, which the linked article’s table omits. The README’s separate link to Matt Pocock’s `writing-for-agents` is an external reference, not a bundled skill; that external repository was not audited here.

## SkillSpector pre-check

SkillSpector v2.12.0, scanner revision `2226747e4ca97198bb82faf5085b8a75f2e1dc02`, installed from NVIDIA’s upstream Git origin. `uv tool upgrade skillspector` completed before scanning; the scanner version stayed at 2.12.0 and several scanner dependencies updated. No target skill was installed, loaded as an active skill, or executed.

The URL precaution preceded downloading the pinned artifact. Initial sandbox networking failed; the same static scan succeeded with network access. The exact source archive was then downloaded at the pinned commit and extracted as inert files, without repository hooks or scripts.

Commands used:

```bash
skillspector scan https://github.com/ai-evals-course/evals-skills --no-llm --format json --output repository-precheck.json
skillspector scan PINNED_SOURCE/skills --recursive --no-llm --format json --output per-skill.json
skillspector scan PINNED_SOURCE --no-llm --format json --output pinned-repository.json
```

`PINNED_SOURCE` denotes the extracted commit named above. Reports are preserved as [URL precheck](skillspector-url-precheck.json), [pinned repository scan](skillspector-repository.json), [full per-skill scan](skillspector-per-skill.json), and [compact per-skill evidence](skillspector-summary.json).

| Skill | Score / severity | Findings | Scanner completeness |
|---|---|---|---|
| build-review-interface | 0 / LOW | None | Complete static scope |
| error-discovery | 0 / LOW | None | Partial reference resolution |
| eval-audit | 0 / LOW | None | Complete static scope |
| evals-start | 0 / LOW | None | Complete static scope |
| evaluate-rag | 7 / LOW | EA2, MEDIUM, confidence 0.75 | Complete static scope |
| generate-synthetic-data | 0 / LOW | None | Complete static scope |
| validate-evaluator | 0 / LOW | None | Complete static scope |
| write-code-eval | 0 / LOW | None | Complete static scope |
| write-judge-prompt | 0 / LOW | None | Complete static scope |

All three scans used `--no-llm`: `llm_requested=false`, `llm_available=false`, and `meta_analysis_applied=false`. Scanner semantic analysis was disabled intentionally, not attempted and degraded. Local Codex review is a separate assessment and does not alter raw scanner results. No suppressions were supplied. The collection recommendation is CAUTION because one scan is partial, despite the maximum per-skill score of 7. Its 88.89% collection coverage describes eight complete skill results out of nine; every bundled text file in those skills was accounted for. This is not a measure of semantic understanding.

### Finding triage

- **EA2, evaluate-rag/SKILL.md:177, MEDIUM, confidence 0.75:** the match is in an anti-pattern warning about evaluating generation without checking its grounding. It tells the agent to check grounding; it does not authorize unverified high-impact actions. Manual verdict: false positive.
- **error-discovery/SKILL.md:119 and :131:** the per-skill scanner flags unresolved references to `http.server` and generated JSON outputs. These are a standard-library module and planned runtime files, not missing bundled implementation files. The raw partial status is retained; generated behavior remains untested.
- **Repository RA1, README.md:83, HIGH, confidence 0.85:** wording encouraging readers to write domain-specific skills was interpreted as self-modification. It does not instruct the running skill to rewrite its own safeguards. Manual verdict: false positive.
- **Repository AS3, README.md:13–14 and :41–49, MEDIUM, confidence 0.80:** local Markdown navigation links were interpreted as installed-skill snooping. They identify bundled skills in a README. Manual verdict: false positives.
- **Repository RP1, README.md:18, :21, :27, :33, :34, MEDIUM, confidence 0.70:** unversioned `npx skills` commands create a real supply-chain consideration if later executed. The scanner classifies this as MCP rug pull, although these are skill installer commands rather than MCP servers. Review and pin the installer version and skill source before installation; no compromise was demonstrated and no installer was run.

The repository scans score **55/HIGH / DO_NOT_INSTALL**, with 18 finding records, including duplicate matches. That aggregate is preserved separately from the exact per-skill scores. It reflects documentation/link matches and the installer advisory; it does not establish that the skill instructions contain a malicious payload. No installation was performed.

Static checks do not prove publisher identity, dependency resolution, runtime behavior, or absence of vulnerabilities. Remote references, CDN libraries, `judgy`, and libraries named in examples were not transitively audited. The package contains instructions to generate code; that future code is outside this static source scan.

## OWASP and local semantic assessment

The [OWASP Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) informed the review. Seven high-signal direct-injection and output-leakage regex patterns were applied across all 25 text files: **zero matches**. Invisible/bidirectional control-character triage also returned zero. Broad keyword triage produced 18 leads; all describe ordinary trace roles, UI editing, eval systems, or evaluation advice. That is 18/18 noise for this keyword pass, not a global scanner false-positive rate. [Exact patterns, leads, and URLs](owasp-triage.json) are preserved.

The local semantic review inspected raw skill instructions and supporting files after static scanning. It found no malicious instructions for prompt override, credential theft, exfiltration, persistence, or concealed installation. A practical instruction-level gap remains in `error-discovery`: it recommends Markdown rendering but lacks the explicit sanitization guidance present in `build-review-interface`. Trace content and judge inputs should be treated as data, and generated review interfaces should escape/sanitize content and bind local services appropriately. These are source-level hardening observations; runtime exploitability was not tested.

The [local semantic report](local-semantic-report.md) and [coverage manifest](semantic-coverage.json) document reviewed files, exact locations, and exclusions. This was local Codex assessment within the task, without an OpenRouter or other separately configured external review provider. It is separate from SkillSpector’s disabled LLM layer. External linked repositories, dependencies, generated programs, deployment behavior, and live user traces were excluded.

## skills.sh registry check

All nine canonical `ai-evals-course/evals-skills/SLUG` listings were verified. The three individual audit pages for each were retrieved: **27/27 PASS**, with Gen Agent Trust Hub displaying SAFE and Snyk displaying LOW. No provider was pending or missing. See the [provider table and published observations](skills-sh-report.md) and [normalized detailed evidence](skills-sh-evidence.json). Normalized provider observations and timestamps are published here. Raw listing/audit HTML is retained in the local review archive; it is not hosted on this site.

Published passing observations still identify untrusted-input boundaries, local server/subagent activity, CDN libraries, and the separate `judgy` dependency. Preserve those caveats rather than treating PASS as permission for arbitrary tool access.

Displayed audit dates are September 1 or September 24–25, 2026. None appears earlier than the corresponding skill directory’s latest recorded change; [directory history](directory-freshness.json) includes supporting files. Audit timestamps omit timezones and no public Git-commit mapping was established. Socket snapshot hashes are recorded, but their correspondence to the downloaded commit remains unverified. Some listings note a previous `hamelsmu/evals-skills` origin; the checked canonical owner/repository matches the user’s supplied repository.

Registry verdicts describe third-party skills.sh snapshots, not the exact local artifact, publisher identity, dependencies at install time, or runtime safety. All checks are preliminary security evidence; the short guide is original wording with source attribution, not copied article text.

Public evidence copies generalize local host paths as `PINNED_SOURCE`, `LOCAL_REVIEW`, or `URL_PRECHECK_SOURCE`. Finding text, reported scores, coverage, hashes, and timestamps are unchanged. Original reports and raw HTML remain in the local review archive.
