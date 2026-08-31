# Source note: Do Personalized Skills Help Coding Agents?

## Source and bibliographic record

**Paper:** Shuyan Huang, Kai Du, and Andrew Lan, “Do Personalized Skills Help Coding Agents? An Empirical Study of Developer Interaction Histories.” arXiv:2608.10319 [cs.SE, cs.AI], 15 pages, 10 figures. The arXiv record says it was submitted 10 August 2026 and revised to v2 on 15 August 2026; this is an arXiv preprint, not a peer-reviewed venue publication in the record consulted on 31 August 2026.

- [Canonical arXiv record (v2)](https://arxiv.org/abs/2608.10319) (metadata, version history, abstract, access links)
- [Authoritative HTML (v2)](https://arxiv.org/html/2608.10319) (section-addressable full text)
- [Authoritative PDF (v2)](https://arxiv.org/pdf/2608.10319) (15-page version used for page pointers below)
- DOI: [10.48550/arXiv.2608.10319](https://doi.org/10.48550/arXiv.2608.10319)

The arXiv record does not expose an author-linked code or data repository. A third-party CatalyzeX entry shows “Request Code,” but that is not evidence of a released artifact; treat the experiment as paper-described unless an author release is found later.

## Bottom line (the paper’s claim)

The paper asks whether a task-independent `SKILL.md` distilled from one developer’s prior coding-agent sessions improves that same developer’s future tasks and reduces pushback. Its answer is qualified:

1. Personalized skills can be generated from interaction traces, but in this experiment they produce only a small, inconsistent, and non-significant average improvement over no skill.
2. A generic skill distilled from all developers’ evolution sessions performs best on average and most consistently, although its +3.78-point improvement also does **not** reach the paper’s conventional significance threshold.
3. Personalization looks more promising when a held-out task has at least six semantically relevant prior sessions for that developer. This is a subgroup analysis on one split, so it is evidence of a hypothesis rather than a confirmed six-session law.
4. Skills primarily cause more extensive implementation and validation; they do not reduce interaction or compute in this setup.

The paper’s own conclusion is that current gains arise “primarily from reusable guidance shared across developers rather than from developer-specific personalization” ([Conclusion, HTML §6](https://arxiv.org/html/2608.10319#S6); PDF p. 8).

## Research question and claimed contribution

The explicit research question is: “Can we distill personalized skills from developer-agent interaction histories, and do they improve coding agent performance and reduce pushback on subsequent tasks?” ([Introduction, HTML §1](https://arxiv.org/html/2608.10319#S1); PDF p. 2).

The proposed contribution is a two-stage generation/evaluation framework:

- **Skill generation:** a deterministic, rule-based bootstrap followed by evidence-grounded LLM refinement.
- **Evaluation:** replay held-out sessions with an interactive, trajectory-conditioned LLM developer simulator, under controlled skill conditions ([Method, HTML §2](https://arxiv.org/html/2608.10319#S2); PDF pp. 3–4).

The work defines a skill as a human-readable `SKILL.md` containing reusable natural-language guidance injected at inference time, without changing model parameters. A personalized skill is meant to encode recurring expectations/preferences of a developer, not task-specific solutions (PDF pp. 3–4).

## Data and sampling

The source is [SWE-chat](https://arxiv.org/abs/2604.20779), described here as 8,866 public CLI coding-agent sessions collected through Entire.io from public GitHub repositories between January and June 2026. The authors filter out incomplete interactions, inaccessible/unrecoverable repository states, private dependencies, missing files, sessions without substantive code edits, answer-only/read-only/empty-tool/review-only sessions, and developers with fewer than three valid tasks. They reconstruct each repository at the parent of the final-change commit and run it in an isolated worktree ([Dataset, HTML §3.1](https://arxiv.org/html/2608.10319#S3.SS1); PDF pp. 4–5).

After filtering:

- **206 sessions, 13 developers** remain.
- Per developer, sessions are randomly split 80/20 into **164 evolution sessions** and **42 held-out test sessions** in total.
- Five random split seeds are used. Since each split has 42 held-out tasks, the aggregate paired replay denominator is **210**.
- Task mix: code review/targeted fixes 59 (28.6%); feature implementation 43 (20.9%); testing/build/DevOps 31 (15.0%); UI/UX 27 (13.1%); documentation/research 18 (8.7%); bug fixing 15 (7.3%); refactoring/maintenance 7 (3.4%); continuation/other 6 (2.9%).

The authors explicitly note that the strict filtering establishes a rigorous replay setup but limits definitive conclusions. This is a small, selected, public-GitHub/CLI sample, not a representative population of developers or all coding-agent use.

## How skills were generated and compared

### Personalized skill

For a developer’s evolution sessions, the bootstrap generator extracts all developer turns and uses lightweight pattern matching to identify communication style, work preferences, follow-up/correction behavior, and explicitly stated validation/commit preferences. It also selects representative developer turns and assembles a structured `SKILL.md` with scope, communication, work style, follow-up handling, validation, and examples ([Bootstrap generation, HTML §2.2](https://arxiv.org/html/2608.10319#S2.SS2); PDF p. 3).

An LLM refiner then verifies, revises, removes, or adds candidate rules against the evolution traces. To limit overfitting, a retained rule must be supported by at least two independent developer turns from different evolution sessions. The refiner is instructed to focus on communication/work style/follow-up handling, avoid assumptions about languages/frameworks/task types, defer to the active request, and avoid environment-specific commands or invented requirements. The result is intended to be compact and task-independent (PDF pp. 3–4; Appendix C, PDF pp. 11–13).

### Baselines and controls

Each held-out task is replayed under four conditions:

| Condition | Skill supplied |
| --- | --- |
| A | No skill |
| B | Target developer’s personalized skill |
| C | Personalized skill from a random other developer |
| D | Generic skill distilled from pooled evolution sessions of all developers |

The generic skill includes the target developer’s **evolution** sessions (but not held-out test sessions), so it is a pooled-data baseline rather than a same-data-size test of personalization. The repository state, first request, task summary, simulator, agent configuration, and replay limits are held constant across conditions; the supplied skill is unchanged during a session ([Experimental setup, HTML §3.2](https://arxiv.org/html/2608.10319#S3.SS2); PDF pp. 4–5).

All components—skill generation, coding-agent execution, developer simulator, and task-completion scoring—use **Codex 1 with GPT-5.5**. The agent is run through Codex CLI, with at most six developer-agent turns per replay. Completion is scored with the SWE-chat 100-point rubric using an LLM-as-judge. Five random split seeds are used (PDF p. 5).

### Replay simulator

For each held-out session, an LLM summarizes only developer-authored messages into the task goal and explicit requirements. The simulator receives that summary and the live evaluated conversation; the coding agent receives the original first-turn request and must discover later requirements through interaction. After each agent response, the simulator either issues a focused follow-up about the most important unresolved requirement or returns “No further requests” ([Interactive Session Replay, HTML §2.3](https://arxiv.org/html/2608.10319#S2.SS3); PDF pp. 4–5).

As a simulator check, 171/210 replay instances had substantive follow-ups from both the real developer and simulator. Of these, 59.65% were exact semantic matches, 29.82% partial matches, and 10.53% mismatches—89.47% at least partial matches. These are LLM-as-judge classifications, not a human study (PDF p. 6).

## Quantitative results

Table 1 reports the following aggregate results over 210 seed-task replays ([Quantitative Results, HTML §3.3](https://arxiv.org/html/2608.10319#S3.SS3); PDF p. 5):

| Condition | Score (paper-reported ±) | Follow-up rate | Win/tie/loss vs. no skill |
| --- | ---: | ---: | ---: |
| A. No skill | 65.02 ± 3.24 | 24.76% (52/210) | — |
| B. Personalized | 65.99 ± 2.14 | 30.95% (65/210) | 41.43 / 14.76 / 43.81% (87/31/92) |
| C. Random developer | 65.94 ± 3.66 | 27.62% (58/210) | 43.33 / 17.62 / 39.05% (91/37/82) |
| D. Generic pooled | **68.80 ± 2.26** | 30.00% (63/210) | **50.95 / 14.76 / 34.29% (107/31/72)** |

Interpretation stated by the authors:

- Personalized vs. no skill: **+0.97 points**, paired *t*-test **p = .399**; the gain is not statistically significant.
- Random other-developer vs. no skill: **+0.92 points**, paired *t*-test **p = .451**.
- Generic pooled vs. no skill: **+3.78 points**, highest mean and win rate, but paired *t*-test **p = .063**, above the stated conventional threshold.
- Because personalized and random-other-developer skills are nearly tied, the authors say there is limited evidence that developer-specific information adds value beyond generic procedural guidance.
- Follow-up rates rise for all skill conditions relative to no skill. Thus the data do not support the hoped-for reduction in pushback; the generic skill’s higher score comes with a 30.00% follow-up rate versus 24.76% for no skill.

**Uncertainty reporting caution:** the table reports a “±” quantity but does not identify it in the caption or nearby prose as standard deviation, standard error, or confidence interval. Do not relabel these values. The paper separately describes Figure 5’s developer-level horizontal bars as descriptive 95% intervals.

## Behavior and cost results

Compared with no skill, personalized skills increase rather than reduce effort: agent turns 1.29→1.37; unresolved-requirement follow-ups 0.29→0.37; tool calls 8.47→9.46; tokens 442,096→597,120; execution time 91.76→106.16 seconds; files changed 1.65→2.22; patch churn 29.08→37.11. They also increase test command groups 0.56→0.97, validation command groups 1.77→2.23, and runs reporting successful validation 43.1%→58.9%. Generic skills use the most tokens (643,578) and patch churn (37.98) while scoring highest (Table 3, PDF pp. 6–7).

The direct claim is therefore about more systematic validation and more extensive execution, not efficiency. The paper does not measure production developer time, satisfaction, trust, or real human correction burden.

## Relevant-history analysis

For one random seed’s 42 held-out tasks, an LLM identifies semantically related evolution sessions and bins tasks by relevant-history count. Table 2 reports personalized-minus-baseline score differences:

| Relevant evolution sessions | Held-out tasks | B−A (personalized−no skill) | B−C (personalized−random developer) | B−D (personalized−generic) |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 3 | −6.33 | +15.00 | −8.00 |
| 1–2 | 16 | 0.00 | −1.38 | −3.81 |
| 3–5 | 11 | +0.10 | +0.20 | −7.20 |
| ≥6 | 12 | +10.17 | +8.92 | +5.67 |

The authors report that personalization is substantially better in the ≥6 group and better than generic there, while generic wins all groups below six ([Detailed Analysis §4.1](https://arxiv.org/html/2608.10319#S4.SS1); PDF pp. 5–6).

This is **descriptive exploratory evidence**, not a pre-registered threshold test: it uses one seed, tiny bins (especially n=3), LLM-based relevance labeling, and no reported significance/interval analysis for these subgroup differences. It supports the weaker inference that repeated, task-relevant evidence may be a condition for personalization—not the general claim that six sessions guarantee benefit.

## Skill-content analysis and refinement ablation

The generic skill is longer and contains more rules: 25 rules/383 rule-words versus 14.15 rules/236.38 rule-words averaged over personalized skills. Category shares are broadly similar, but generic has more commit rules (16.0% vs. 7.6%). Mean TF-IDF similarity to generic is 0.517 for personalized skills; mean similarity between different developers’ skills is 0.443; 64.7% of personalized rules are unique to one developer (Table 4, PDF p. 7). The authors correctly caution that lexical uniqueness does not imply usefulness, relevance, or agent compliance.

The appendix compares rule-based bootstrap with bootstrap plus LLM refinement: 65.71 ± 1.65 versus 65.99 ± 2.14, a +0.28 gain; both follow-up rates are 30.95%; paired *t*-test **p = .792**. Thus refinement is only weakly supported as an improvement in this sample (Appendix A, [HTML](https://arxiv.org/html/2608.10319#A1); PDF p. 10).

At developer level, only 6/13 developers score higher with personalized than no skill; personalized beats the random other-developer skill for 8/13, but the largest effects occur for developers with fewer held-out sessions and wider intervals. Generic beats no skill for 11/13 developers (Appendix B, PDF pp. 10–11).

## What the evidence supports—and does not support

### Supported, with scope

- In this Codex/GPT-5.5, SWE-chat-derived, replay-and-simulator setting, developer-specific skills show a small, inconsistent mean gain and no significant improvement over no skill.
- In the same setting, a larger pooled generic skill has the strongest descriptive performance, but p=.063 means the paper does not establish a conventional statistically significant generic-skill effect.
- Skills increase testing/validation activity and implementation extent, with higher token/time cost for personalized skills.
- Repeated, semantically relevant history is a plausible moderator; the ≥6 result is exploratory.

### Not established by this paper

- It does not show that personalized skills never help, or that generic skills universally beat personal skills.
- It does not test real human developers during evaluation. The “developer” is an LLM simulator; simulator agreement is itself LLM-judged.
- It does not establish effects for other models, agent harnesses, providers, prompt integration mechanisms, private repositories, non-CLI work, longer horizons, or larger/representative developer populations.
- It does not isolate personalization at equal skill length, equal number of training examples, or equal data volume: the generic condition pools all developers and has many more rules.
- It does not provide deterministic task correctness independent of an LLM judge, nor does it report inter-rater reliability or judge calibration here.
- It does not report what the “±” values represent; they should not be treated as a conventional confidence interval without further clarification.

Some limitations are explicit in the paper (strict filtering, sparse per-developer histories, simulator/replay constraints, and GitHub-oriented tasks). The additional concerns above are methodological implications of the described design, not claims made by the authors.

## Related primary research to carry into the broader synthesis

These are complementary—not direct replications of personalized cross-session skills:

- [SWE-Skills-Bench (Han et al., arXiv:2603.15401)](https://arxiv.org/abs/2603.15401) pairs 49 public SWE skills with approximately 565 fixed-commit GitHub task instances and deterministic acceptance tests. Its abstract reports zero pass-rate improvement for 39/49 skills, average gain +1.2%, meaningful gains for 7 skills, and degradation for 3. This supports the broader caution that skill utility is context/domain dependent.
- [SkillsBench (Li et al., arXiv:2602.12670v4)](https://arxiv.org/abs/2602.12670v4) (latest revision, 14 June 2026) evaluates 87 tasks across 8 domains under matched no-Skills versus curated-Skills conditions for 18 model–harness configurations. Its v4 abstract reports average pass rate rising from 33.9% to 50.5% (+16.6 percentage points; 25.5% normalized gain), with configuration-level gains of +4.1 to +25.7 points; focused Skills with at most three modules outperform larger or exhaustive bundles, and smaller models with Skills can match larger models without them. It studies task skills, not developer-identity personalization.
- [SWE-chat (Baumann et al., arXiv:2604.20779)](https://arxiv.org/abs/2604.20779) is the source dataset for the focal paper; consult it for collection/provenance and the limits of public coding-agent traces.
- The focal paper also positions itself as cross-session adaptation, distinct from within-session interactive evaluation such as [SWE-Together (Wu et al., arXiv:2606.29957)](https://arxiv.org/abs/2606.29957) and [SWE-INTERACT (Raghavendra et al., arXiv:2606.30573)](https://arxiv.org/abs/2606.30573).

These related papers should not be pooled as if they answer the same question: they vary in skill source (curated, generated, pooled, or personalized), task construction, models, verifiers, and outcome metrics.

## Citation

```bibtex
@article{huang2026personalized,
  title   = {Do Personalized Skills Help Coding Agents? An Empirical Study of Developer Interaction Histories},
  author  = {Huang, Shuyan and Du, Kai and Lan, Andrew},
  journal = {arXiv preprint arXiv:2608.10319},
  year    = {2026},
  doi     = {10.48550/arXiv.2608.10319}
}
```
