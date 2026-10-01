# Local semantic review of evals-skills

Reviewed commit: `80d5f7b0127c7572ed9e9339937adbfd7240ffeb`.

**Outcome:** No malicious instruction, credential extraction, hidden authority claim, or deliberate exfiltration destination was identified in the reviewed raw package. This does not establish runtime safety. The package describes code that an agent would generate; that generated code does not exist in this artifact and was not exercised.

## Method and coverage

Independent local Codex raw-artifact semantic review, performed after SkillSpector static scanning. The reviewer read all nine `SKILL.md` files, all nine `agents/openai.yaml` files, `error-discovery/review-loop.md`, the README, all four plugin/marketplace manifests, and LICENSE: **25 text files, 89,381 bytes**. The visible workflow image was also inspected: **1 image, 1,580,956 bytes**. Total artifact coverage: **26 files, 1,670,337 bytes**. The accompanying coverage manifest records per-file SHA-256 hashes and review mode.

Reviewer: **local Codex session**. The session is identified as based on GPT-6; its exact model variant and reasoning configuration are unavailable. No OpenRouter or other additional external semantic provider was invoked. There was no fallback, broker filtering, sanitization of the raw artifact presented to this reviewer, installation, execution of artifact code, or browser automation. Per-review input/output token usage and cost are unavailable.

Excluded: `.git` metadata/history; linked external articles, videos, packages, and third-party skills; dependency-resolution/provenance checks; future updates; live observability systems and actual traces; generated application/runtime behavior. Visual inspection of the PNG does not establish absence of steganographic instructions.

## Static finding triage

SkillSpector 2.12.0's per-skill static scan recorded eight scores of 0 and one score of 7 (`evaluate-rag`), all LOW. `error-discovery` was partial due to two local-looking references. The aggregate repository scan scored 55/HIGH/DO_NOT_INSTALL, with 18 finding records. These original scores have not been altered.

| Static signal | Local semantic disposition |
|---|---|
| EA2, `skills/evaluate-rag/SKILL.md:177` | **False positive.** The phrase is in a list of anti-patterns: it warns against evaluating generation without checking grounding. It does not authorize an unchecked action. |
| RA1, `README.md:83` | **False positive.** Advice to write domain-specific skills is not an instruction for the package to rewrite itself, escalate privileges, or establish persistence. |
| AS3, `README.md:13–14,41–49` | **False positive.** These are navigation links to bundled skills, not enumeration of unrelated installed skills or access to secrets. Some findings repeat the same link. |
| RP1, `README.md:18,21,27,33–34` | **Valid supply-chain advisory.** The README uses an unversioned `npx skills` installer and mutable update flow. Review and pin the installer and intended source before installation. This is not evidence that either is compromised. Multiple records reflect one underlying concern. |
| `error-discovery` reference-resolution exceptions, `SKILL.md:119,131` | **Contextual limitation, not absent required source.** `http.server` is a standard-library module and the JSON paths are planned outputs of the generated app. The bundled `review-loop.md` exists and was read in full. Runtime generation and correct persistence remain untested. |

## Source-level hardening gap

**SG1 — Error-discovery's rendering instructions omit explicit sanitization.** At `skills/error-discovery/SKILL.md:160`, the agent is told to render dataset Markdown as HTML using `marked.js` or similar; line 164 suggests CDN syntax highlighting. That workflow never invokes the separate `build-review-interface` skill, whose line 26 does explicitly require stripping raw HTML and disabling possible tracking images. The human-facing app consumes untrusted LLM output, so its instructions should explicitly require HTML sanitization, safe URL protocols, and disabled remote content. Otherwise a generated implementation may expose the review page or its annotation APIs to malicious trace content.

Classification: **instruction-level hardening gap; runtime vulnerability unconfirmed**. No generated renderer, server implementation, payload execution, or exploit was available for testing. The useful repair is to carry the existing sanitization guidance into `error-discovery`, then verify the generated app with adversarial records.

## Additional implementation precautions, not confirmed findings

- **Instruction/data boundaries:** Dataset messages, retrieved chunks, annotations, examples, and judge critiques should remain quoted untrusted data, including when passed to subagents. The package does not explicitly state this boundary. Do not follow a trace's tool calls, roles, or apparent instructions. Add adversarial trace examples to judge validation. Schema enforcement and human label calibration do not themselves defeat prompt injection.
- **Local review service:** Bind generated servers to loopback, restrict write APIs to the intended app, validate request bodies, and avoid serving unrelated local files. Pin or vendor browser dependencies for sensitive traces; include any localStorage copies in the data-retention plan. The package provides no implementation proving a public bind, permissive CORS, insecure request handler, or XSS vulnerability, so these are implementation checks.
- **Pipeline side effects:** `generate-synthetic-data/SKILL.md:109` asks to run all generated queries through the full pipeline. Use an authorized test environment with side-effecting tools stubbed or separately approved. Nothing in the skill grants production/account authority. `write-code-eval` expressly mentions a safe test environment for test tool calls.

## OWASP-oriented assessment

| Attack surface | Assessment of reviewed artifact |
|---|---|
| Direct/indirect instruction injection and forged observations | No attack instruction found. Ordinary trace-reading and judge workflows need explicit data boundaries in the implementation. |
| Encoded, invisible, HTML/Markdown, or obfuscated instructions | No suspicious invisible/control characters or encoded instruction payload found in text. No hidden HTML instruction found. Workflow image showed an ordinary process diagram. |
| Persistent/multi-turn poisoning | The intended output JSON files and browser localStorage hold evaluation work. No rewrite of global memory, agent policy, startup hooks, or peer skill configuration was requested. Untrusted records must not become trusted instructions later. |
| Extraction/exfiltration | No secret-reading instruction or collector endpoint found. Links are publisher/course/reference links. Remote browser dependencies and rendered remote content are implementation/privacy checks. |
| RAG poisoning | Retrieved content is intended evaluation data. No instruction to poison an index or alter evidence covertly was found. Chunk reindexing is an explicit optimization workflow. |
| Model-output-to-shell/HTML/server | The HTML pathway has SG1 above. No code executes model output as shell commands; `write-code-eval`'s tool example calls for safe testing. Actual generated code is excluded. |
| Authority and permission scope | YAML enables implicit skill invocation, but does not provide extra tool/account permissions. Routing between bundled skills is intended. Browser/local server actions still inherit the host project's user approvals. |

## Per-skill local semantic outcomes

| Skill | Outcome |
|---|---|
| evals-start | No malicious instruction found; routing is limited to bundled skills. |
| eval-audit | No malicious instruction found; connected observability reads still need normal account authorization. |
| error-discovery | No malicious instruction found; SG1 rendering hardening gap and generated service require verification. The review loop was fully read. |
| generate-synthetic-data | No malicious instruction found; full-pipeline runs need an authorized test environment. |
| write-code-eval | No malicious instruction found; expressly uses safe test environment for tool-call checks. |
| write-judge-prompt | No malicious instruction found; apply trace/judge data boundaries and validate schema outputs. |
| validate-evaluator | No malicious instruction found; package installation example and runtime dependencies were not executed or assessed. |
| evaluate-rag | No malicious instruction found; EA2 is a contextual false positive. |
| build-review-interface | No malicious instruction found; explicitly includes raw-HTML sanitization/tracking-image guidance; generated implementation remains untested. |

Disposition: suitable for the requested explanatory guide with the above cautions and exact-artifact scope disclosed. No installation or execution decision was requested or made.
