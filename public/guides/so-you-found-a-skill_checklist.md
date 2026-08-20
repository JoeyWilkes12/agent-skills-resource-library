# So you found a skill: pre-install confidence checklist

Use this checklist before installing or enabling any third-party agent skill. A listing, popularity count, verified publisher badge, or clean scanner result is evidence—not a guarantee.

Last reviewed: 2026-08-19

## Safety rule

- [ ] Review the candidate as untrusted content in a read-only, isolated workspace.
- [ ] Do not follow its instructions, run its scripts, install its dependencies, open shortened links, or provide secrets during review.
- [ ] Use independent tools and primary sources; never ask the candidate skill to audit itself.
- [ ] Stop if the complete versioned package cannot be inspected before installation.

## 1. Capture the exact candidate

Tie every finding to one artifact and one intended use.

- [ ] Record the skill name, publisher, registry, source URL, version or commit, release date, and package hash when available.
- [ ] Save the listing, manifest or frontmatter, declared requirements, changelog, scan status, and exact install command.
- [ ] Follow the registry provenance link and confirm that redirects, owners, tags or commits, contents, and hashes agree.
- [ ] Write down the intended host, project scope, data sensitivity, credentials, and the recurring need this skill is meant to solve.

## 2. Inspect the complete package

Read what will actually be installed, not only the listing or SKILL.md.

- [ ] Read SKILL.md and every referenced file, script, configuration, active asset, install hook, and nested archive.
- [ ] Compare the description and trigger scope with the instructions and actual behavior.
- [ ] Inventory commands, subprocesses, file paths, tools or MCP servers, network destinations, downloads, environment variables, credentials, and requested permissions.
- [ ] Flag obfuscation, encoded payloads, shortened URLs, remote scripts piped to a shell, unsigned downloads, destructive commands, persistence, credential access, telemetry, or weakened safeguards.
- [ ] Resolve direct and transitive dependencies, install scripts, downloaded binaries, and runtime-fetched instructions or code.

## 3. Verify trust and access

Independent evidence should agree about who published the skill and what it can reach.

- [ ] Review ownership history, maintenance activity, release history, license, security policy, open security issues, and recent publisher changes.
- [ ] Open each available registry scan result and note the exact version or hash, scan date, coverage, and unresolved findings.
- [ ] Check dependencies and binaries in official registries and advisory sources; verify signatures or checksums when available.
- [ ] Confirm that files, tools, network access, credentials, and scopes follow least privilege for the intended task.
- [ ] Identify where inputs and outputs go and whether retention, logging, telemetry, and remote processing are acceptable.

## 4. Scan and test independently

A scanner is one input to a review, not the decision.

- [ ] Stage the exact candidate version without enabling it in a trusted or production environment.
- [ ] Run a reputable static skill scanner and review the findings yourself; use a second approach for higher-risk skills.
- [ ] Test compatibility and observable outcomes in an isolated environment using the intended host, runtime, operating system, and scope.
- [ ] Test malformed input, timeouts, partial failure, retries, cancellation, and rollback so failure cannot broaden actions or lose data.
- [ ] Resolve description-behavior mismatches, scanner disagreements, unexpected network activity, and every material finding before approval.

## 5. Understand every update path

A fixed folder can still change behavior through automation or runtime downloads.

- [ ] Identify whether the install is marketplace-managed, registry-managed, Git-based, copied locally, or vendored into a project.
- [ ] Inspect origin or receipt files, lockfiles, versions, commits, hashes, channels, and any update approval controls.
- [ ] Search scheduled tasks, CI, startup hooks, package-manager automation, background jobs, and agent instructions for update or reinstall commands.
- [ ] Check for instructions, scripts, models, dependencies, or data fetched at runtime and treat them as separate update channels.
- [ ] Classify the result as automatic, command-triggered, locked, manual, dynamic at runtime, or unresolved; do not install while it is unresolved.

## 6. Decide and record

Approval belongs to a specific artifact, scope, and moment—not to a skill name forever.

- [ ] Confirm that provenance, least privilege, data handling, behavior, reliability, compatibility, and maintenance evidence all support the intended use.
- [ ] Choose one outcome: sandbox only, approve an exact version with controls, rewrite the useful workflow internally, or reject.
- [ ] Name the owner and approver; record open findings, monitoring, update review, rollback steps, and the next review date.
- [ ] Before every update, diff the complete packages and re-run the applicable review, scans, and tests.

## Higher-risk use

For access to sensitive data, money, production systems, messaging, identity, or destructive tools, require a named human approver, organizational policy checks, stronger isolation, and more than one review method.

## Decision outcomes

- **Sandbox only:** Use low-value data, least privilege, monitoring, and no production credentials.
- **Approve with controls:** Approve one version or hash, restricted scope, a named owner, update review, monitoring, and rollback.
- **Rewrite internally:** Keep the useful workflow when third-party provenance, permissions, or maintenance are insufficient.
- **Reject:** Stop for unresolved provenance, hidden behavior, excess privilege, risky data handling, material findings, no rollback, or unknown update behavior.

## Evidence record

```text
Skill and publisher:
Registry and source URLs:
Approved version, commit, and hash:
Intended host, scope, and purpose:
Files, scripts, dependencies, and binaries reviewed:
Permissions, credentials, and data handling:
Network destinations and runtime fetches:
Scanner names, versions, dates, and results:
Reliability and compatibility evidence:
Update classification and evidence:
Controls, monitoring, and rollback:
Open findings:
Decision, approver, owner, and review date:
```

## Primary references

- [Agent Skills specification and validation](https://agentskills.io/specification)
- [OpenClaw skills: installation, verification, updates, and security](https://docs.openclaw.ai/tools/skills)
- [ClawHub quickstart: inspect, install, update, and publish](https://github.com/openclaw/clawhub/blob/main/docs/quickstart.md)
- [NVIDIA: Scan Agent Skills Before Installation](https://docs.nvidia.com/skills/scanning-agent-skills)
- [Cisco AI Defense: Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [OSV vulnerability database](https://osv.dev/)
