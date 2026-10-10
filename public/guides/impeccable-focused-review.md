# Impeccable: focused review receipt

Research and static scan: October 9, 2026, America/Denver. Focused review completed October 10, 2026. Public registry times have unspecified timezone. This records a bounded review, not a safety certification or approval to install.

## Artifact and method

- Origin: [pbakaus/impeccable](https://github.com/pbakaus/impeccable).
- Exact commit: `d631a8827f99414d2b6daba4ef08b7f8701751d7`, release `skill-v4.5.2`.
- Exact variant: `.agents/skills/impeccable` (Codex), 62 files, 2,216,993 bytes. Git blob identity and SHA-256 were checked for every downloaded file. Files remained outside automatically discovered skill locations and nonexecutable.
- [Machine-readable evidence receipt](impeccable-review-receipt.json) includes all file hashes and review scope.
- Static scan preceded Local Codex examination of raw files. No target skill, MCP, launcher, binary, hook, or browser workflow was installed, activated, or executed. No OpenRouter or other external review service was used. Public retrieval is separate from target-code execution.

## Registry and static evidence

The inspected registry detail pages reported [Gen PASS/SAFE](https://www.skills.sh/pbakaus/impeccable/impeccable/security/agent-trust-hub), [Socket WARN/one LOW anomaly](https://www.skills.sh/pbakaus/impeccable/impeccable/security/socket), and [Snyk PASS/LOW](https://www.skills.sh/pbakaus/impeccable/impeccable/security/snyk). Socket's snapshot identifier has not been mapped to this Git commit or Codex variant. These verdicts cannot be silently applied to the quarantined bytes.

NVIDIA SkillSpector 2.12.0, upstream commit `5edc347c320bd516f8ff38df200a63831bf92e80`, returned 100 / CRITICAL / DO_NOT_INSTALL: 49 entries, including 11 HIGH and 38 MEDIUM, with 25 distinct match fingerprints. Maximum individual severity was HIGH. Coverage was partial: 54 fully inspected files and eight partly inspected files (87.1%). The aggregate score is static triage; it does not establish malware. Some alerts describe parser limits or ordinary design terminology. Their context was reviewed without changing the original result.

The scanner ran in static mode, without an LLM, with sockets and subprocesses denied and credential/tracing configuration removed. Live OSV lookups were unavailable. Seven OWASP example regex patterns returned zero matches across the files; this is not clearance. No current comprehensive dependency-vulnerability assessment is claimed.

## Focused observations

### Execution identity can drift despite the skill pin

The [POSIX launcher](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/scripts/impeccable#L41) and Windows counterpart prefer several local executable sources. An unversioned home binary can precede the versioned cache; a compatibility probe checks output, rather than the expected version or authenticity. Existing trusted candidates are not freshly hashed by the launcher. A probe itself executes a candidate.

Fresh downloads fail closed when their checksum is unavailable or mismatched. Both executable and checksum come from the release origin, so this protects consistency with that publisher rather than independently authenticating a safe binary. The named engine is v0.1.14, whose binary and implementation were excluded here. Any adoption decision must identify the executable actually selected and its verified digest.

### Instructions and approval need a trusted boundary

The [live workflow](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/reference/live.md#L9) requests broad execution escalation and elevates helper-provided next steps into workflow authority. The main setup also consumes project context as directives. A compromised helper or unsafe reflection of page/source content could influence tool use. No working injection was established.

The [new-work playbook](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/reference/new-work.md#L53) encourages a less restricted command path when a development port cannot bind. Critique's URL branch calls for browser script injection without an explicit development-only authorization gate in that block. Host restrictions and actual human approval must remain authoritative; changing tools or encountering a failed question cannot grant permission.

### Markup and screenshots have distinct data boundaries

The [browser renderer](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/scripts/live-browser.js#L13168) assigns sidecar component HTML to innerHTML in a shadow root, with no sanitizer in the observed browser path. Shadow DOM scopes styles; it does not isolate active markup. Reachable attacker input and engine-side validation remain unverified, so this is a conditional boundary concern, not a confirmed exploit.

Selected screenshot-library code fetches DOM/CSS resources and supports optional caller-specified Workers. The inspected integration does not pass a Worker URL. Font capture also fetches stylesheet/font URLs under browser restrictions. The observed event and annotated-image posts go to localhost; these static network matches do not prove remote exfiltration or server-side SSRF. The engine's later use of the data remains outside scope.

Optional image generation can disclose project screenshots and prompt contents to an image service. Confirm the authorized provider and inputs, minimize private data, and keep prompt provenance out of served production content.

### Persistence and updates need their own record

The [hook documentation](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/reference/hooks.md) describes project/provider settings and includes mutable package-command examples. A project-level off toggle does not disable other projects globally. Browser storage, helper journals, injected scripts, saved design guidance and configuration can outlive the current run. Retiring a skill folder alone is insufficient rollback.

Use isolated fixtures for tests that submit repeatedly, remove data or force failures. Confirm ownership and remaining references before deleting abandoned assets. These are ordinary development capabilities whose effect depends on the environment and authorization.

## Safeguards and contextual matches

The read documents preserve incumbent design scope, prohibit production injection, require an explicit diff and consent for development CSP changes, document hook approval and cleanup, and constrain the manual-edit agent to literal text and one event. Fresh executable downloads fail closed on checksum failure. These are useful intended controls; documentation does not prove runtime enforcement.

Several HIGH phrase matches were benign in context: brand identity, clear interface states, an execution-turn ceiling, visual-evidence quality, and a count-based question rule. Other matches actually prohibit unapproved additions, overwrites, sound or unverified findings. The static coverage gaps and unreviewed code remain open even after these matches are contextualized.

## Coverage and exclusions

Full reads covered 21 files: the main SKILL.md; new-work, critique, harden and document references; all four agent TOMLs and their YAML metadata; live, live-setup, hooks and doctor references; both launchers and VERSION; colorize, mode-operate and visualize references; and the small browser-session helper.

Selected excerpts covered audit, audit.native, delight and init references; the browser-ignore helper; the large live-browser file; and the minified screenshot bundle. The JSON receipt records exact excerpt ranges. Remaining references, data and JavaScript were not fully semantically reviewed. Static file coverage is a different measure from these full/excerpted semantic reads.

Excluded from the artifact and runtime review: other client variants, engine source outside the directory, released binaries, runtime dependencies, fetched resources, actual server authentication/origin/CORS/path enforcement, historical-version comparisons, and behavioral testing. No complete repository audit, confirmed exploit, or general safety clearance is claimed.

## Decision

Keep this candidate quarantined pending engine provenance, helper enforcement review and an isolated runtime test. A later approval should bind exact skill and engine hashes to one project, tool scope and permitted network destinations. Re-review updates, changed ownership/advisories, new hooks/destinations and broader host permissions. Preserve the earlier approved bytes, inspect persistent state, start a fresh agent session after suspected poisoning, and assess credential revocation separately from file rollback.
