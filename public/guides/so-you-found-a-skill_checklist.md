# So you found a skill: pre-install confidence checklist

Use this checklist before installing or enabling any third-party agent skill. A listing, popularity count, verified publisher badge, or clean scanner result is evidence—not a guarantee.

Last reviewed: 2026-07-29

## Safety rule

- [ ] Review the candidate as untrusted content in a read-only, isolated workspace.
- [ ] Do not follow its instructions, run its scripts, install its dependencies, open its shortened links, or give it secrets during review.
- [ ] Do not ask the candidate skill to audit itself. Use independent tools and primary sources.
- [ ] Stop if the full package cannot be inspected before installation.

## 1. Record the exact candidate

- [ ] Record the skill name, publisher/owner, registry, source URL, version or commit, release date, and package hash if available.
- [ ] Save the listing, manifest/frontmatter, declared requirements, changelog, scan status, and install command.
- [ ] Confirm that similarly named skills are not being confused and that redirects resolve to the expected owner.

## 2. Check these sources

Process the sources below in order. Missing evidence should lower confidence; contradictory evidence should stop the install until resolved.

### A. Host and installer documentation

- [ ] Read the current documentation for the agent host and the exact installer being used.
- [ ] Confirm where the skill will be installed, which agents can see it, its precedence, sandbox behavior, permission model, secret injection, and uninstall/rollback procedure.
- [ ] Determine whether the installer stages content for review or executes hooks and dependencies during installation.

### B. Registry listing and security details

- [ ] Check the publisher identity, ownership changes, official/verified status, first-published date, latest release, version history, changelogs, download pattern, moderation state, and user reports.
- [ ] Open every available scan result and note what was scanned, which version/hash it covers, the scan date, and any medium or unresolved findings.
- [ ] Treat registry approval and popularity as weak signals. Public registries can contain unsafe or compromised releases.

### C. Original source repository

- [ ] Follow the registry’s source/provenance link; do not rely on a repository found only by name search.
- [ ] Compare repository owner, release tag/commit, package contents, and hashes with the registry artifact.
- [ ] Review maintainer history, recent commits, signed releases or attestations when available, open security issues, unresolved bug reports, license, and security policy.
- [ ] Look for recent ownership transfers, dormant projects that suddenly published, rewritten history, generated/binary-only files, or releases that are not reproducible from source.

### D. Complete skill package

- [ ] Read `SKILL.md`, all referenced files, scripts, configuration, assets with active content, install hooks, and nested archives.
- [ ] Verify that the description matches the actual behavior and trigger scope.
- [ ] Inventory commands, subprocesses, file paths, network destinations, downloads, dynamic content, tools/MCP servers, environment variables, credentials, and requested permissions.
- [ ] Flag obfuscation, encoded payloads, shortened URLs, remote scripts piped to a shell, unsigned downloads, destructive commands, persistence, credential access, telemetry, or instructions that weaken safeguards.

### E. Dependencies and downloaded artifacts

- [ ] Resolve direct and transitive dependencies from lockfiles or manifests.
- [ ] Check the official package registries and an advisory database such as [OSV](https://osv.dev/) for known vulnerabilities, yanked releases, typosquatting, install scripts, and maintainer changes.
- [ ] Verify checksums/signatures for downloaded binaries and confirm that URLs are versioned and controlled by the expected publisher.
- [ ] Treat runtime-fetched instructions or code as an update channel that can change without the skill package changing.

### F. Independent security analysis

- [ ] Run at least one reputable static skill scanner against the exact staged version. For higher-risk skills, use scanners with different approaches and reconcile disagreements.
- [ ] Review the findings yourself; do not reduce the decision to a single trust score.
- [ ] Scan dependencies and binaries with appropriate software-supply-chain and malware tools.
- [ ] Re-run scans whenever the version, hash, source, dependency graph, or remote payload changes.

### G. Primary product/API documentation

- [ ] Compare every claimed command, API, permission, and workflow with the current official documentation for the products the skill controls.
- [ ] Confirm that the skill does not request broader access or add optional infrastructure that the task does not require.
- [ ] Prefer primary documentation or a governed internal skill when it can accomplish the task with a smaller trust boundary.

### H. Organizational evidence

- [ ] Check internal allow/deny lists, security standards, data classification, approved endpoints, credential policy, and prior reviews.
- [ ] Identify an owner for updates, incident response, periodic re-review, and removal.
- [ ] Obtain required human approval before any install that can access sensitive data, money, production systems, messaging, identity, or destructive tools.

## 3. Security and reliability gates

Do not install until every applicable gate has an evidence-backed answer.

- [ ] **Purpose:** The skill solves a recurring need and adds value beyond current primary documentation.
- [ ] **Provenance:** The publisher, source, artifact, version, and hashes form a consistent chain.
- [ ] **Least privilege:** Files, tools, network access, credentials, and scopes are limited to what the workflow requires.
- [ ] **Data handling:** Inputs, outputs, destinations, retention, logging, and telemetry are understood and acceptable.
- [ ] **Behavior match:** Instructions, scripts, dependencies, and network activity match the description and declared requirements.
- [ ] **Failure safety:** Timeouts, partial failures, retries, cancellation, and malformed input do not cause broader actions or data loss.
- [ ] **Compatibility:** The skill is tested for the intended host, operating system, runtime, tool versions, and project scope.
- [ ] **Verification:** Tests or observable checks demonstrate correct results, not merely successful execution.
- [ ] **Maintenance:** Recent releases, issue response, versioning, changelogs, and rollback evidence support continued use.
- [ ] **Independent review:** Scanner findings and human review are resolved for the exact version being approved.

## 4. Check whether the skill will update automatically

Do not infer update behavior from the presence of a version number. Verify each layer:

1. **Read the host and installer update documentation.** Look for auto-update settings, update commands, approval prompts, pin/lock features, update channels, and rollback behavior.
2. **Identify the installation mechanism.** A marketplace-managed plugin, a registry CLI install, a Git clone, a copied local folder, and a vendored project skill can all update differently.
3. **Inspect local tracking records.** Look for an origin/receipt file, lockfile, recorded registry, version, commit, hash, channel/tag, and pinned state.
4. **Inspect automation.** Search scheduled tasks, background jobs, CI workflows, startup hooks, package-manager automation, and agent instructions for update or reinstall commands.
5. **Check remote runtime fetches.** A skill may never update on disk yet still fetch changing instructions, scripts, models, or data at runtime.
6. **Test safely.** In an isolated copy, record file hashes and the installed version, restart the host, and observe whether anything changes without an explicit update action.

Classify the result:

- **Automatic:** A documented service or job can replace content without case-by-case approval.
- **Command-triggered:** Content changes only when a person, agent, CI job, or scheduler runs an update/reinstall command.
- **Pinned/locked:** The installer refuses ordinary updates until explicitly unpinned or the lock is changed.
- **Untracked/manual:** No origin is recorded; refresh requires replacing or reinstalling the files.
- **Dynamic at runtime:** On-disk content may stay fixed while behavior can change through remote fetches.
- **Unknown:** Treat as automatic and do not install until resolved.

For current OpenClaw/ClawHub installs, the documented workflow uses explicit `openclaw skills update ...` or `clawhub update --all` commands. OpenClaw records the registry origin for later updates, and ClawHub supports pinning an install so updates and force reinstalls cannot overwrite it. That is command-triggered unless another person, agent, startup hook, CI workflow, or scheduler runs the command automatically.

Before every update:

- [ ] Diff the old and new complete packages, requirements, dependencies, permissions, network destinations, and remote-fetch behavior.
- [ ] Re-run the pre-install review and security scans on the new version.
- [ ] Preserve the previously approved artifact, hash, configuration, and rollback instructions.
- [ ] Prefer a pinned version or immutable commit for sensitive workflows.

## 5. Decision record

Record one outcome:

- **Approve for sandbox only:** low-value data, least privilege, monitored use, no production credentials.
- **Approve with controls:** exact version/hash, named owner, restricted scope, update review, monitoring, and rollback.
- **Rewrite internally:** the workflow is useful but third-party provenance, permissions, or maintenance are insufficient.
- **Reject:** unresolved provenance, hidden behavior, excess privilege, risky data handling, critical findings, no rollback, or unknown update behavior.

Suggested evidence record:

```text
Skill:
Publisher and source:
Registry URL:
Approved version/commit/hash:
Intended host and scope:
Purpose:
Files/scripts reviewed:
Permissions and credentials:
Network destinations and data handling:
Dependencies and advisories:
Scanner names, versions, dates, and results:
Reliability/compatibility evidence:
Update classification and evidence:
Pin/lock and rollback plan:
Open findings:
Decision, approver, owner, and review date:
```

## Primary references

- [Agent Skills specification and validation](https://agentskills.io/specification)
- [OpenClaw skills: installation, verification, updates, and security](https://docs.openclaw.ai/tools/skills)
- [ClawHub quickstart: inspect, install, update, and publish](https://github.com/openclaw/clawhub/blob/main/docs/quickstart.md)
- [ClawHub registry source and CLI reference](https://github.com/openclaw/clawhub)
- [NVIDIA: Scan Agent Skills Before Installation](https://docs.nvidia.com/skills/scanning-agent-skills)
- [Cisco AI Defense: Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [OSV vulnerability database](https://osv.dev/)

