# Troubleshooting research notes

Reviewed 2026-07-28. These notes document how the draft guidance derived from
`troubleshooting_skills_per_skillljar-01.md` was checked before publication.

## Techniques included

| Technique | Verification and adaptation | Primary source |
| --- | --- | --- |
| Validate structure first | The open specification documents `skills-ref validate ./my-skill` and the structural constraints it checks. | [Agent Skills specification](https://agentskills.io/specification#validation) |
| Improve a skill that does not trigger | Description metadata is the primary activation signal. Test both prompts that should trigger and prompts that should not. | [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions) |
| Diagnose a skill that does not load | Check product enablement and code execution first, followed by packaging, names, the required skill file, and valid metadata. Product-specific load paths are not interchangeable. | [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude#troubleshooting) |
| Resolve the wrong skill or a duplicate name | Claude Code documents managed/enterprise → personal → project precedence. Plugin skills are namespaced. The tile explicitly labels this behavior as Claude Code-specific. | [Claude Code skills](https://code.claude.com/docs/en/skills#where-skills-live) |
| Diagnose runtime failures | Check the actual host environment, packaged dependencies, referenced files, tools, network access, and execution permissions. Compatibility requirements should be explicit. | [Agent Skills authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#runtime-environment) |

## Raw claims intentionally narrowed or omitted

- `claude --debug` was not presented as the default command because the current
  public CLI reference documents `--verbose` for diagnostic logging. The site
  links to current product documentation instead of freezing a possibly
  version-specific flag.
- “Use forward slashes everywhere, even on Windows” was not treated as a
  universal rule. Path behavior depends on the script, interpreter, host, and
  client. The published guidance asks authors to declare and test compatibility.
- “Clear the plugin cache, restart, and reinstall” was not published as a
  general first-line fix because the available primary documentation does not
  establish it as a universal workflow. Product enablement, discovery,
  packaging, and current product logs should be checked first.
- Priority behavior is not generalized across products. Claude Code’s
  precedence is documented on its tile; other clients may load, merge, or
  namespace skills differently.
