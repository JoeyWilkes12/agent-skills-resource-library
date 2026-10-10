# Skill security over time

*Evaluate the exact skill, its dependencies, and the tools it can reach. Keep a dated evidence record and review changes before updating.*

![A magnifying glass inspects a pinned dossier; a branching thread connects later versions and returns to an earlier reviewed copy.](/guides/skill-security-over-time.png)

A useful skill can become riskier without changing its name. A maintainer might add a script, a dependency might change, or a new connector might give its instructions access to sensitive actions. A directory listing and a passing audit help you investigate. Continued use needs a record of what you reviewed and what has changed.

This guide separates published facts from an editorial operating policy you can adapt. Registry research checked October 9, 2026, using the America/Denver date; focused Local Codex review completed October 10. It does not approve installation of any skill or MCP server.

## Start with discovery, then establish trust

Skillselion is an independent directory covering agent skills, MCP servers, and marketplaces. Its skill rankings use skills.sh install figures; MCP and marketplace rankings use repository stars. Skillselion says it passes through available third-party security verdicts rather than scanning listings itself, and that those signals do not guarantee safety. That makes it useful for discovery while leaving the adoption decision with you. [Skillselion FAQ](https://skillselion.com/)

Its research methodology adds useful limits: registry installs are cumulative events, bundles can count several skills per installation, and its first-party Verified-Safe and trust-score fields are unpopulated. Popularity can indicate interest and help prioritize investigation. It cannot establish that a particular commit was widely used or reviewed. [Skillselion methodology](https://skillselion.com/research/methodology)

Check the canonical owner, repository, skill directory, and complete files before deciding what to trust. Similar names, copied descriptions, and badges should not substitute for origin verification.

## What an unverified skill MCP could expose

The Skillselion MCP README documents a loader that puts skill instructions in the agent's context and bundled scripts or references on disk. It also describes synthesis across several matching skills and optional setup that registers the server globally and adds a session-start hook. The README claims it sends a scrubbed query and matched skill for telemetry, with an opt-out. These are published product claims; this guide has not verified the implementation or its privacy behavior. [Skillselion MCP documentation](https://github.com/skillselion/skillselion-mcp)

The security question is what happens when retrieved content starts influencing an agent with other tools. A malicious instruction might ask it to read credentials, run a bundled script, publish private code, or send project details through a legitimate search or messaging tool. A server does not need its own email or deployment permission to try to steer an agent that already has those capabilities.

OWASP describes tool poisoning, cross-server escalation, data exfiltration through ordinary calls, supply-chain compromise, and behavior changing after approval. It recommends treating returned content as untrusted and enforcing authorization outside the model. These are conditional risks of this architecture, not findings that Skillselion or any listed skill is malicious. [OWASP MCP security guidance](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)

Even a read-only annotation is a hint. MCP says annotations from untrusted servers must be treated as untrusted; its maintainers explain that isolation and network controls provide enforcement that metadata cannot. [MCP Tools specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [MCP annotations explained](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)

## A review is a snapshot

A scanner result answers a bounded question: what did that scanner find in the material it examined, on that date? To use it as evidence for your copy, check the corresponding repository, directory, commit, included files, scan time, and scanner scope.

When an audit page does not identify an immutable revision, record that limitation. Do not silently attach its verdict to an older commit, a newer release, a similarly named skill, or a whole repository. A clean static scan also leaves questions about meaning: instructions can request inappropriate actions without containing a conventional vulnerable program.

Our editorial recommendation is to combine static inspection with a semantic review of the raw instructions, scripts, and supporting references. Record whether a reviewer saw the complete artifact, selected excerpts, or a summary. These are different levels of evidence. A review of a summary cannot establish what omitted material contains.

## Choose a reviewed version, then pin it

There may be a sensible release or commit to investigate, but a public install total does not identify the most-used commit. Without version-specific telemetry, that question remains unanswered. An old revision may contain known defects; a new one may contain a necessary fix. Age alone settles neither stability nor security.

Choose an immutable revision with a reviewable change history, suitable behavior, and evidence that matches its exact files. Record the full commit identifier and content hashes. Include scripts, references, manifests, and lockfiles rather than pinning only SKILL.md. Keep a copy so the approved material remains available for comparison and rollback.

Pinning limits one source of drift. A pinned skill can still fetch changing references, install unresolved dependency versions, call a remote service, or behave differently under a new agent runtime. Giving that agent an additional tool can change its effective reach without touching the skill. Your evidence record should therefore cover the execution environment as well as the repository.

A pinned revision with a known vulnerability needs a new decision: patch, replace, or retire it. Pinning makes a version reproducible; it does not grant permanent approval.

## Keep a small evidence receipt

Use one receipt per approved version. Leave unknown fields explicit rather than filling them with a reassuring label. This example is an editorial template, not a certification standard:

```text
Skill / canonical origin:
Repository / skill directory:
Full commit / artifact hashes:
Included files / dependencies / remote references:
Audit provider / URL / displayed date and timezone:
Audit revision and scope match: yes / no / unknown
Static scan / raw-artifact semantic review:
Reviewer / review date / material exclusions:
Allowed project, tools, credentials, and network destinations:
Isolated test and observed actions:
Decision: quarantine / approve for stated scope / reject
Prior approved version / rollback location:
Next review date / update triggers:
```

Keep sensitive contents out of the receipt. Record which credential scope was available, for example, rather than copying its value. For a practical first pass, use the [skill checklist](/guides/so-you-found-a-skill-checklist) and the [skills.sh security-check guide](/guides/vercel-skills-sh-security-check).

## Review on change, with a scheduled backstop

The following is a suggested operating policy, not an industry-mandated schedule. Review every proposed update before promoting it into normal use. Compare instructions, scripts, dependencies, fetched URLs, hooks, and requested permissions against the approved receipt. Run the relevant checks again on the new complete artifact.

Reopen the decision immediately when ownership changes, an advisory appears, an audit verdict changes, a new network destination is introduced, permissions expand, or observed behavior differs from expectations. Reassess after substantial host-tool or agent-runtime changes too.

For actively used skills, a monthly evidence check is a reasonable starting point; for isolated, occasional use, quarterly may be sufficient. Adjust this to the consequences of misuse. The scheduled check catches changes outside the repository, including remote references and dependency advisories. It does not replace the update gate.

## Quarantine, observe, and retain a rollback path

Before approval, keep downloaded material in a quarantine directory outside automatically discovered skill locations. Inspect it as untrusted data. Test only in a disposable project with narrow file access, restricted network access, and no valuable credentials. Disable automatic hooks while evaluating the skill.

Keep an action history of the reviewed version, tools used, destinations contacted, approvals, and unexpected behavior. Exclude secrets and unnecessary private content. Successful output is useful evidence of task performance; also inspect the actions that produced it.

If behavior changes unexpectedly, stop automatic loading and remove the skill from sensitive workflows. Preserve the artifact and relevant records for investigation. Return to the previous reviewed version only after checking whether the incident affected that version, shared dependencies, or credentials. Rollback restores files; it does not reverse data already disclosed.

Start a fresh agent session and inspect saved memory, hooks, settings, and generated scripts for unauthorized persistent instructions. If credential exposure is suspected, assess revocation and rotation separately from restoring skill files.

## Impeccable: a dated example

**skills.sh registry check — October 9, 2026 (America/Denver).** The canonical ID is `pbakaus/impeccable/impeccable`. Its [listing](https://www.skills.sh/pbakaus/impeccable/impeccable) displayed 322.5K aggregate installs at retrieval. The [official API documentation](https://www.skills.sh/docs/api) describes aggregate installation data; the inspected listing and public schema did not supply adoption or runtime reliability by commit. No most-used or most-stable commit was established.

Fresh public HTTP retrieval produced these results. Times below reproduce the audit pages; their timezone is unspecified. They display October 10 while the research date here is October 9 in Denver. Cached search and page-retrieval copies disagreed, including an older September 15 Snyk result; the fresh detail pages are the basis for this table.

| Provider | Published result | Displayed analyzed time | Material detail |
| --- | --- | --- | --- |
| [Gen Agent Trust Hub](https://www.skills.sh/pbakaus/impeccable/impeccable/security/agent-trust-hub) | PASS / SAFE | Oct 10, 2026, 01:34 AM | Describes binary downloads and execution, indirect prompt-injection exposure, and persistent detector hooks. |
| [Socket](https://www.skills.sh/pbakaus/impeccable/impeccable/security/socket) | WARN / one LOW anomaly | Oct 10, 2026, 01:35 AM | Flags `scripts/modern-screenshot.umd.js`; remote DOM/CSS resource loading and caller-provided Web Workers need review. |
| [Snyk](https://www.skills.sh/pbakaus/impeccable/impeccable/security/snyk) | PASS / LOW | Oct 10, 2026, 01:33 AM | Reports no issues detected. |

Gen's analysis describes downloading an engine and its SHA-256 checksum from the author's GitHub, making the engine executable, and optionally adding detector hooks in agent settings. A checksum obtained from the same origin can check consistency with that origin; it is not independent evidence that the publisher or binary is trustworthy. These are the provider's observations, not an independent code audit by this library. [Gen audit detail](https://www.skills.sh/pbakaus/impeccable/impeccable/security/agent-trust-hub)

Socket exposes one low anomaly, confidence 62% and severity 50%, and says no definitive malware indicators were visible. Its concern is unexpected network requests and a broader injection surface when DOM/CSS/options are untrusted. It exposes no separate finding ID or explicit remediation. The warning deserves manual inspection; it is not proof of malware. [Socket audit detail](https://www.skills.sh/pbakaus/impeccable/impeccable/security/socket)

The latest named release observed was [skill-v4.5.2](https://github.com/pbakaus/impeccable/releases/tag/skill-v4.5.2), published October 9 at 09:30 MDT, at the [release commit](https://github.com/pbakaus/impeccable/commit/d631a8827f99414d2b6daba4ef08b7f8701751d7) (`d631a8827f99414d2b6daba4ef08b7f8701751d7`). It names engine v0.1.14. This is an identifiable review candidate, not a recommendation that it is safest or most stable. An engine version also needs its own provenance and digest checks.

Socket's package snapshot is `6bfbdc7f53f3a0817f9ac74401a9e3c7b27ef02527081555b5fa954b9da42a06`. That identifier is not a Git commit SHA, and its correspondence to the release above was not proven. Audit freshness alone cannot establish that two artifacts contain the same bytes. Preserve the Socket warning and the unresolved snapshot match rather than combining the three providers into a reassuring consensus. [Snapshot evidence](https://www.skills.sh/pbakaus/impeccable/impeccable/security/socket)

For source pinning, the official skills CLI v1.7.2 parser recognizes a quoted GitHub source ending in `#FULL_40_CHARACTER_SHA`. Its `@skill` form selects a skill rather than a version. Verify the installed CLI's behavior before relying on syntax, and separately pin any fetched executable or dependency. No installation command is needed to make this assessment. [Official parser](https://github.com/vercel-labs/skills/blob/v1.7.2/src/source-parser.ts), [Git resolution](https://github.com/vercel-labs/skills/blob/v1.7.2/src/git.ts)

## Impeccable: focused local review

We downloaded the exact Codex variant, `.agents/skills/impeccable`, from the release commit above into quarantine: 62 files, checked against Git blob identifiers and recorded with SHA-256 hashes. It was not installed, loaded as a skill, or executed. The provider snapshot's correspondence to this variant remains unproven.

An isolated **SkillSpector 2.12.0** static scan, from NVIDIA upstream commit `5edc347c320bd516f8ff38df200a63831bf92e80`, returned **100 / CRITICAL / DO_NOT_INSTALL**, with 49 entries (11 HIGH, 38 MEDIUM; 25 distinct match fingerprints). Its reported coverage was partial: 54 files fully inspected, eight partly inspected, or 87.1%. This is a triage result. Several high alerts concern scanner coverage limits or design language; the score does not establish malicious intent. Seven OWASP example regex patterns matched nothing, which also does not establish safety. The scan used no LLM and had network access and subprocesses blocked; current online dependency-vulnerability checks were unavailable. [Scanner origin](https://github.com/NVIDIA/skillspector)

Local Codex then examined raw instructions, both launchers, selected references, and excerpts of larger browser code. Material observations include:

- **The skill pin does not freeze the selected engine.** The launcher may choose an environment override, sibling binary, or preinstalled home binary before the versioned cache. Its compatibility probe does not authenticate the executable or enforce the named version. Fresh downloads do require a matching checksum, but executable and checksum come from the same origin. [Pinned launcher](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/scripts/impeccable)
- **Dynamic helper output needs an instruction boundary.** The live workflow promotes helper-provided instructions into workflow authority and requests broad execution escalation. Compromised output or unsafe reflection of page content could widen the impact; this review did not establish an exploit or verify the engine's enforcement. Host policy and the user's actual approvals must govern every action. [Pinned live workflow](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/reference/live.md)
- **Persistence extends beyond the skill folder.** Hooks, project configuration, injected development scripts, and session state affect future runs. Some maintenance examples also name an unversioned package executable. A review and rollback receipt should cover these artifacts and the engine, along with the Markdown. [Pinned hook workflow](https://github.com/pbakaus/impeccable/blob/d631a8827f99414d2b6daba4ef08b7f8701751d7/.agents/skills/impeccable/reference/hooks.md)

The browser excerpts also show sidecar component markup inserted into a shadow root and screenshot capture fetching stylesheet/font resources. These are conditional trust and privacy boundaries; server validation and reachable attacker inputs were not established. Observed helper traffic goes to localhost, which does not prove remote exfiltration. The linked review preserves these distinctions.

The raw references also contain useful boundaries: production injection is prohibited, development CSP changes require an explicit diff and consent, and hook approval and cleanup are documented. These intentions need implementation and runtime verification.

**Review limits and decision:** this was a focused review of raw material, with selected excerpts of large browser files; it was not a complete semantic audit. Engine source outside the skill directory, released binaries, runtime dependencies, other client variants, and runtime behavior were excluded. Keep this candidate quarantined pending engine provenance, enforcement review, and an isolated behavioral test. No installation approval or finding of malware is claimed. Preserve the [focused review](/guides/impeccable-focused-review.md) and [version-specific evidence receipt](/guides/impeccable-review-receipt.json) alongside any later decision.

## Decide what to use next

**Editorial decision rule:** keep a candidate quarantined when its identity, full contents, critical behavior, or review coverage is unresolved. Approve a reviewed version only for the project and capabilities written in its receipt. Require another decision when those conditions change.

You have a defensible starting point when the receipt identifies the complete artifact, preserves each provider's result and limitations, records your own review and isolated test, and names the next review trigger and rollback copy. For Impeccable, the registry warning, incomplete coverage, engine trust, and unproven revision correspondence remain open. For Skillselion, browsing the directory can support discovery without enabling its MCP loader.
