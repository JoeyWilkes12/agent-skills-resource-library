# Agent Skills Resource Library design system

Status: proposed foundation, Guides-first

Version: 0.2

Last reviewed: September 1, 2026

This document turns the library's existing interface into a reusable visual, content, and interaction system. The first implementation surface is `/guides`: the index, reading layout, editorial blocks, trust signals, and authoring model.

It is intentionally an extraction, not a rebrand. The existing navy, paper, mint, coral, editorial serif, compact utility type, and field-guide tone remain the visual authority. The system adds semantic names, clearer rules, and an agent-readable content contract.

## Product and reader

The library helps practitioners find, understand, evaluate, and apply agent skills without treating third-party instructions as automatically trustworthy.

Primary readers:

- Practitioners deciding whether a skill fits a task.
- Builders creating or adapting skills and agent workflows.
- Reviewers checking provenance, permissions, safety, and evidence.
- Enterprise presenters and program owners translating technical material for others.

The single job of a Guide page is to move a reader from a question to a defensible next action. A page may teach, help decide, document evidence, or guide execution; it should never leave the reader unsure what was learned, what was changed, or what remains unverified.

## Design thesis

**An audited field guide for agent work.**

The interface should feel like a well-used technical field manual: editorial enough to invite deep reading, structured enough for scanning, and explicit enough that an agent can assemble or audit it without guessing.

The signature element is the **trust receipt**: a compact strip that overlaps the guide hero and reading surface. It reports the guide's source class, last verification date, interaction mode, possible effects, and intended outcome. It is not a decorative badge row; it answers the reader's first trust questions before the body begins.

Use visual expressiveness once, in the navy hero plus trust receipt. Keep the reading surface quiet.

## System principles

1. **Progressively disclose detail.** Index results carry only enough information to choose. The guide carries the working explanation. Deep evidence and edge cases remain linked or collapsible.
2. **Name the outcome before the method.** Titles, summaries, and openings state what the reader can decide, make, or verify.
3. **Expose agency.** Before a prompt or procedure, show whether it is read-only, writes locally, uses the network, contacts a third party, or publishes externally.
4. **Plan before consequential action.** Executable guides separate scope and intended changes from steps. Readers can review the plan before acting.
5. **Use approved blocks, not invented page structures.** Agents may populate and arrange Guide blocks, but the blocks and their semantics remain controlled by the system.
6. **Evidence is a first-class block.** Distinguish publisher claims, independent findings, observations, and editorial inference.
7. **End with verification and recovery.** "Done" means observable success criteria passed. Failure paths point to the safest next check.
8. **Human judgment owns meaning and publication.** Agents can draft, transform, lint, and propose; a named editor approves claims, risk labels, and publishing.
9. **Structure must be truthful.** Number only real sequences. Conceptual sections use labels or unnumbered headings.
10. **Make the smallest useful system.** Promote a pattern only after it repeats with the same intent across at least three guides.

## Guide families

Every guide declares one primary family. This shapes the index label, hero metadata, default blocks, and success criteria.

| Family | Reader question | Default shape |
| --- | --- | --- |
| `concept` | What is this and how should I think about it? | Thesis, model, examples, implications, sources |
| `decision` | Should I use, install, or approve this? | Context, criteria, alternatives, decision test, outcome |
| `workflow` | How do I complete this task? | Outcome, prerequisites, scope, ordered steps, verification, recovery |
| `checklist` | What must I confirm? | Safety note, grouped checks, evidence record, decision outcomes |
| `evidence-review` | What does the evidence support? | Target, method, findings, limits, recommendation, evidence files |
| `reference` | Where is the canonical information? | Orientation, organized sources, reading paths, citation notes |
| `verbatim` | How can I read the publisher's original here? | Attribution, edition note, embedded or linked original, source |

A guide can include blocks associated with another family, but should not present multiple competing primary jobs.

## Content contract

New and migrated guides should conform to [`design-system/guide-content.schema.json`](design-system/guide-content.schema.json). The schema is a target contract; it does not require an immediate rewrite of existing TSX and Markdown pages.

### Required guide metadata

- `slug`: stable lowercase route segment.
- `title`: specific, outcome-aware page title.
- `summary`: 110–180 character selection copy for the Guides index.
- `family`: one Guide family.
- `audience`: one or more named reader groups.
- `outcomes`: observable things the reader will understand, decide, make, or verify.
- `interactionMode`: the highest-impact mode used by the guide.
- `effects`: concrete capabilities or side effects readers should know about.
- `sourceClass`: the provenance of the guide's main evidence.
- `status`: editorial lifecycle state.
- `lastVerified`: date on which claims, links, commands, or product behavior were last checked.
- `owner`: person or team responsible for semantic review.
- `sections`: ordered content blocks.

### Optional metadata

- `deck`, `estimatedMinutes`, `difficulty`, `prerequisites`, `tools`, `featured`, `image`, `relatedGuides`, and `sources`.
- Time is useful for workflows and checklists, but should not be fabricated for reference or long-form evidence pages.
- Difficulty describes assumed knowledge, not importance.

### Interaction modes

Order these by impact. A guide uses the highest mode it can reach.

| Mode | Meaning | Required treatment |
| --- | --- | --- |
| `read` | Reading, comparing, or planning only | No action warning |
| `plan` | Produces a proposal without changing a system | State that the output is a plan |
| `local-write` | Creates or edits local files or project state | Name affected scope and recovery path |
| `network` | Sends requests or data to an external service | Name destination, data class, and credentials |
| `third-party-action` | Changes an external account or contacts another party | Explicit confirmation immediately before action |
| `publish` | Makes content or software publicly reachable | Preview, approval, live verification, and rollback guidance |

### Evidence language

Use a visible evidence label when a claim could influence installation, security, spending, architecture, or publication.

- `Primary source`: direct publisher or project documentation.
- `Independent finding`: result produced by the library's own documented review.
- `Community report`: third-party experience that has not been independently reproduced.
- `Editorial inference`: a conclusion drawn from cited evidence; state the reasoning.
- `Unverified`: useful lead that still needs confirmation.

Do not let a visual rating imply a security certificate or general quality guarantee.

## Page anatomy

### Guides index

```text
┌────────────────────────────────────────────────────────────┐
│ Site header                                                │
├────────────────────────────────────────────────────────────┤
│ Guides thesis                                              │
│ What this collection helps you decide and do               │
├────────────────────────────────────────────────────────────┤
│ Search + task filters                                      │
│ Learn · Decide · Build · Review · Troubleshoot             │
├────────────────────────────────────────────────────────────┤
│ Featured guide: visual + outcome + family + time            │
├────────────────────────────────────────────────────────────┤
│ Guide rows                                                 │
│ Family · Title · Summary · trust metadata · arrow           │
└────────────────────────────────────────────────────────────┘
```

Index rules:

- Organize discovery around reader jobs, not the source file layout.
- A card or row shows title, summary, family, and at most three high-signal metadata items.
- Search may use hidden content topics, but result explanations should say why a guide matched.
- Featured status is an editorial choice, not an implied ranking.
- Use one featured guide. The rest remain a calm, sortable reading list.

### Guide page

```text
┌────────────────────────────────────────────────────────────┐
│ Site header                                                │
├────────────────────────────────────────────────────────────┤
│ Family / evidence class                                    │
│ Guide title                                                │
│ Outcome-led deck                                           │
│ Primary action, when one exists                            │
├──────────── trust receipt overlaps hero and paper ─────────┤
│ Source · verified · mode · effects · outcome                │
├──────────────┬─────────────────────────────────────────────┤
│ On this page │ Reading column, 68–72ch                     │
│ active state │ approved Guide blocks                       │
│ sticky       │                                             │
├──────────────┴─────────────────────────────────────────────┤
│ Verification · recovery · next actions · sources            │
└────────────────────────────────────────────────────────────┘
```

Guide rules:

- The title and deck remain inside the high-contrast hero.
- The trust receipt is the bridge from promise to proof.
- On wide screens the table of contents is a 13–15rem sticky rail. On smaller screens it becomes an in-flow disclosure.
- Body measure stays between 68ch and 72ch; tables and evidence figures may break out to the full reading column.
- The first body block is family-dependent: thesis for `concept`, decision frame for `decision`, or outcome/scope for `workflow`.
- Sources appear near the claims they support and in a consolidated source block when useful.

## Foundations

### Color

The current palette remains. New work consumes semantic tokens rather than raw values.

#### Primitive palette

| Token | Value | Use |
| --- | --- | --- |
| `--navy-950` | `#071b33` | Deep ink, inverse surface |
| `--navy-800` | `#16324f` | Secondary dark surface |
| `--paper-100` | `#f6f1e8` | Page background |
| `--paper-0` | `#fffdf8` | Raised reading surface |
| `--mint-300` | `#aee7ce` | Safe/ready emphasis |
| `--mint-700` | `#1c795e` | Links, labels, verified state |
| `--coral-500` | `#ff6954` | Focus, caution, consequential emphasis |
| `--gold-400` | `#e8b44f` | Conditional or needs-review state |
| `--lavender-400` | `#8e9cff` | Reserved editorial accent for the sophistication spectrum |

#### Semantic roles

| Token | Light mapping | Intent |
| --- | --- | --- |
| `--surface-page` | `--paper-100` | Site canvas |
| `--surface-raised` | `--paper-0` | Cards, callouts, evidence panels |
| `--surface-inverse` | `--navy-950` | Hero, code, critical state |
| `--text-primary` | `--navy-950` | Headings and primary copy |
| `--text-secondary` | `#3f4e5c` | Reading copy and supporting text |
| `--text-inverse` | `--paper-0` | Copy on inverse surfaces |
| `--text-accent` | `--mint-700` | Labels, verified status, links |
| `--border-subtle` | `rgba(7, 27, 51, 0.16)` | Dividers and contained regions |
| `--status-ready` | `--mint-300` | Verified, safe to proceed within scope |
| `--status-review` | `--gold-400` | Conditional or incomplete review |
| `--status-critical` | `--coral-500` | High-impact warning or stop condition |
| `--focus-ring` | `--coral-500` | Keyboard focus only; never encode status solely with it |

Dark mode remaps semantic roles. Components must not introduce page-specific dark-mode hex values when a semantic role already exists.

Color does not carry meaning alone. Pair status color with a label and, when useful, an icon.

### Typography

The existing pairing stays because it supports the field-guide thesis without another font dependency.

- **Display:** Georgia, `Times New Roman`, serif. Use for page titles, major section headings, decisive findings, and large numeric evidence.
- **Body:** Inter, system sans. Use for reading copy, controls, summaries, and tables.
- **Utility:** Inter, system sans at 700–850 weight with restrained tracking. Use for eyebrows, evidence labels, statuses, and metadata.
- **Code:** `ui-monospace`, SFMono-Regular, Consolas, monospace.

Type roles:

| Role | Size | Line height | Notes |
| --- | --- | --- | --- |
| Guide display | `clamp(3rem, 5.8vw, 5.4rem)` | `0.94` | Balance text; max 920px |
| Index display | `clamp(3.2rem, 7vw, 6rem)` | `0.92` | One thesis, not a marketing slogan |
| Section heading | `clamp(2rem, 3.6vw, 3.2rem)` | `1.04` | Unnumbered unless sequence is real |
| Reading body | `1.04rem` | `1.8` | 68–72ch measure |
| Intro body | `1.15rem` | `1.7` | One short orientation passage |
| Metadata | `0.72–0.78rem` | `1.35` | Uppercase only for short labels |
| Code | `0.84rem` | `1.65` | Horizontal scroll; never shrink to fit |

Avoid all-caps sentences and long centered paragraphs.

### Spacing, shape, and elevation

Use a 4px base with the working scale `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

- Reading sections: 56–64px block padding desktop, 48px mobile.
- Hero padding: 52px desktop, 28–38px mobile.
- Component gaps: 8–16px inside compact controls; 24–32px inside panels.
- Corners: square by default. Use 2px only for focus outlines and inline elements, and full circles for icon-only controls.
- Elevation: reserve shadows for a promoted feature, floating menu, or figure that intentionally overlaps another surface.
- Borders, rules, and alignment should carry most hierarchy.

### Layout

- Site content maximum: 1440px.
- Guides index: 1120px.
- Guide shell: 1280px on wide screens.
- Reading rail: `clamp(13rem, 17vw, 15rem)`.
- Reading gap: `clamp(2rem, 4vw, 4rem)`.
- Reading measure: 68–72ch.
- Behavioral breakpoints: 1180px for the sticky rail, 780px for stacked layout, 540px for single-column compact treatment.

Breakpoints indicate a change in behavior, not a named device.

### Motion

- Default transition: 160–180ms for color, border, and small position changes.
- Use one spatial cue at a time: a row arrow may translate 4px; a card may lift 4px.
- Never animate reading content into view by default.
- `prefers-reduced-motion: reduce` disables smooth scrolling and transforms.
- Progress animation is appropriate only when the system is genuinely working and the state is observable.

## Guide block library

Each block has one job. A block name describes its meaning, not its appearance.

### Navigation and framing

- `GuideIndexHero`: explains the collection's job.
- `GuideSearch`: searches titles, summaries, and curated content topics; reports why a result matched.
- `GuideRow`: compact selection unit for non-featured guides.
- `GuideHero`: family, title, deck, and one primary action.
- `TrustReceipt`: source class, verification date, interaction mode, effects, and outcome.
- `GuideTableOfContents`: active-section navigation; numbers appear only for ordered procedures.

### Reading

- `GuideSection`: standard semantic section with optional label.
- `OutcomeList`: tangible end states.
- `PrerequisitePanel`: accounts, plans, tools, files, permissions, and assumed knowledge.
- `ScopePanel`: changes, preserves, and explicit non-goals.
- `StepSection`: one ordered action, rationale, expected result, and optional checkpoint.
- `PromptCard`: goal, context, constraints, non-goals, definition of done, attachments, mode, and copy action.
- `CodeBlock`: language, copy action, and optional expected output.
- `Callout`: `note`, `evidence`, `caution`, or `stop`. Do not create decorative callouts.
- `EvidenceBlock`: claim, source class, method, finding, limitation, and linked artifact.
- `ComparisonTable`: direct comparison with a visible row/column header structure.
- `GuideTableViewport`: native horizontal scrolling plus a synchronized visual header that remains fixed only while the table crosses the viewport.
- `Figure`: image, useful alt text, caption, and source when external.

### Completion

- `VerificationChecklist`: observable checks, including responsive or live checks when relevant.
- `DoneWhen`: concise completion criteria.
- `CheckpointCallout`: affected state, checkpoint timing, and recovery scope.
- `TroubleshootingMatrix`: symptom, likely cause, safest next check, escalation point.
- `NextActions`: two to four actions grounded in the completed outcome.
- `SourceList`: canonical links, access dates when appropriate, and provenance labels.

## Evidence tables

Long tables are reading tools, not miniature spreadsheets. Preserve the comparison structure and keep context visible while the reader moves through evidence.

### Required behavior

- Use a real `<table>` with one `<thead>` and one `<tbody>`.
- Column headers use `<th scope="col">`; row labels use `<th scope="row">` when the authored format supports them.
- Wrap wide tables in `GuideTableViewport`. The wrapper remains a native, keyboard-focusable horizontal scroll region.
- Once the source header crosses the viewport top, show a synchronized `aria-hidden` header copy at `--guide-sticky-table-offset`.
- Keep the header fixed only until the table bottom reaches it. As the last row leaves, the header releases upward with the table.
- Synchronize the visual header to native `scrollLeft` so headings remain aligned after touch, trackpad, wheel, or keyboard scrolling.
- Recalculate widths with `ResizeObserver`; do not assume a breakpoint means overflow exists.
- Preserve opaque header backgrounds, a clear bottom rule, and sufficient z-index in both themes.
- Do not place an invisible gesture-capture layer over table links or selectable evidence.

### Mobile treatment

- Keep a minimum table width when preserving columns is essential to comparison. Do not compress evidence into unreadable cells.
- Let the next column edge remain visible when possible so horizontal movement is discoverable.
- Keep the first column scrollable by default. A pinned key column is opt-in for tables with four or more columns when losing row identity would make values ambiguous.
- If a key column is pinned, keep its semantic header available to assistive technology and provide an opaque surface plus a separation rule.
- Reformat into stacked records only when rows are independent. Do not turn a matrix into cards when cross-column comparison is the task.
- Keep captions, caveats, and source notes in the normal document flow below the table.

### Accessibility and interaction

- The synchronized header copy is `aria-hidden`, has no duplicated IDs, cannot receive focus, and does not intercept pointer events.
- The original header remains the only semantic header.
- The scroll region has a descriptive accessible name and visible coral focus treatment.
- Horizontal scrolling remains native; arrow keys work while the region is focused.
- A `<caption>` is preferred for the table's purpose. A nearby visible heading can supply the accessible name when a caption would repeat it.
- Test at 200% zoom and at 320px width; the document itself must not overflow horizontally.

### Reference behavior

Anthropic's Fable 5.1 benchmark table uses sticky column headers that sit at the viewport top while the table is in view and release at the table boundary. At a measured 390px viewport, four 105px model columns occupy a 342px content opening; horizontal movement reveals the remaining 78px, and the featured model column stays pinned. The library adopts the bounded sticky header and geometry-based overflow detection, but keeps native scrolling because its evidence tables contain interactive links.

## PromptCard contract

Prompts are executable design material, not decorative quotations. A reusable prompt must name:

1. Goal.
2. Audience or operating context.
3. Inputs and attached sources.
4. Desired behavior or output.
5. Constraints and what to preserve.
6. Non-goals.
7. Definition of done.
8. Intended interaction mode and possible effects.

The copy control says `Copy prompt`; its confirmation says `Prompt copied`. If the prompt is intended for planning or execution, label it `Use in Plan mode` or `Use in Build mode` rather than hiding that distinction in prose.

## Agent behavior

An agent using this system follows this sequence:

1. Read guide metadata and identify the primary family.
2. Select only approved blocks that support the reader's job.
3. Draft the outcome, scope, and evidence labels before composing steps.
4. Reuse semantic tokens and components; do not invent local colors or near-duplicate patterns.
5. State uncertainty and source class. Never convert an inference into a publisher claim.
6. Run structural, link, accessibility, and stale-date checks.
7. Present substantive editorial or risk-label changes for human review.
8. Publish only after explicit approval and verify the public result independently.

Agents may reorder blocks when the family permits it. They may not remove provenance, effects, verification, or recovery information to make a page shorter.

## Editorial voice

- Write from the reader's side of the screen.
- Prefer specific verbs: `Review permissions`, `Run the scan`, `Verify the preview`.
- State the conclusion before the history when evidence supports one.
- Use sentence case for controls and headings.
- Keep labels stable across the flow: `Publish` leads to `Published`, not `Submitted`.
- Avoid hype, personified AI, false certainty, and blanket claims such as “safe,” “best,” or “production-ready.”
- Explain failures with a next action. Do not apologize or use vague error copy.
- Label publisher language and verbatim material explicitly.

## Accessibility contract

- One `h1`; headings descend without skipping levels.
- All controls are keyboard reachable and have a visible coral focus ring.
- Touch targets are at least 44×44px.
- Table-of-contents active state uses `aria-current="location"` and visible text treatment.
- Disclosure controls expose `aria-expanded` and preserve focus.
- Figures use content-aware alt text; decorative images use empty alt text.
- Tables retain semantic headers and scroll horizontally without clipping content.
- Sticky table headers release at the table boundary; their visual copies are hidden from assistive technology and never cover interactive cells.
- Code remains selectable and scrollable.
- Status never depends on color alone.
- Reduced-motion preferences are respected.
- Light and dark modes meet WCAG AA contrast for text and essential controls.
- Plain language, descriptive headings, and front-loaded outcomes are part of accessibility, not a separate editorial option.

## Responsive behavior

- At 1180px and above, use the sticky table-of-contents rail.
- Below 1180px, place the table of contents above the reading column.
- At 780px, stack feature layouts, evidence grids, comparisons, and hero actions.
- At 540px, use single-column rows and panels; preserve 44px targets and readable code overflow.
- Never hide trust, source, or effect metadata on mobile. Reduce its density through stacking or disclosure.
- Wide evidence tables keep a fixed header while their rows are in view and native horizontal scrolling for every input method.
- Test long titles, long URLs, code, tables, and 200% text zoom.

## Publishing lifecycle

| State | Meaning | Who can advance it |
| --- | --- | --- |
| `draft` | Structure or claims are incomplete | Author or agent |
| `editorial-review` | Meaning, voice, and structure are under review | Human editor |
| `evidence-review` | Sources, commands, links, and risk labels are being checked | Named reviewer |
| `approved` | Ready to merge and publish | Human owner |
| `published` | Public artifact has been verified | Publisher |
| `stale` | Verification window or dependency has expired | Automated check or reviewer |
| `archived` | Preserved for reference but no longer recommended | Human owner |

Preflight checks before `approved`:

- Required metadata present and schema-valid.
- No unresolved placeholders.
- Local links, external links, and anchors checked.
- Source class and last-verified date present.
- Commands and code samples tested when feasible.
- Images have alt text and do not overflow.
- Heading order, keyboard access, focus, and contrast checked.
- Interaction mode and effects match the most consequential action.
- Verification and recovery blocks exist for workflows that change state.
- Named human owner approves substantive claims.

## Current implementation map

The existing code already supplies much of the foundation:

| Existing implementation | System role | Direction |
| --- | --- | --- |
| `app/globals.css :root` | Primitive tokens | Split primitive and semantic roles; replace repeated hard-coded text colors incrementally |
| `app/guides/page.tsx` | Guides index | Move catalog metadata out of the page; add task/family discovery and trust metadata |
| `app/guides/guide-reading-layout.tsx` | Reading shell | Keep; add a trust-receipt slot and consistent footer slots |
| `app/guides/table-of-contents.tsx` | GuideTableOfContents | Keep active-state and compact behavior; stop numbering conceptual sections |
| `app/guides/markdown-guide.tsx` | Block parser/renderer | Evolve toward explicit semantic blocks and metadata rather than visual-only Markdown patterns |
| `app/guides/guide-table-viewport.tsx` | GuideTableViewport | Shared bounded sticky-header and horizontal-scroll behavior for Markdown and bespoke tables |
| `app/guides/markdown-guide-page.tsx` | Standard guide template | Keep as the migration target for prose-heavy guides |
| Bespoke `page.tsx` guides | Specialized blocks | Promote patterns only after three same-intent uses; otherwise keep local |
| `content/guides` | Authored content | Add schema-validated metadata without forcing one storage format immediately |

Observed debt to address during migration:

- Guide metadata is duplicated between the index and individual pages.
- Guide families, audience, outcomes, effects, and verification dates are not consistently machine-readable.
- Conceptual sections often use sequence numbers even when order carries no meaning.
- Repeated body and muted colors bypass the root token layer.
- Generated Markdown guides and bespoke TSX guides expose different block capabilities.
- Verification, recovery, and contextual next actions are inconsistent.
- Dark mode relies on long selector groups because components do not consume semantic surface and text roles.

## Additional lessons from Anthropic's Fable 5.1 page

The useful patterns are structural, not a visual skin to copy.

- **Use two content measures.** The reference page uses an approximately 640px reading column and an approximately 880px media column on desktop. Keep prose narrow and let evidence figures deliberately break wider.
- **Make the opening an index.** Its hero previews the article's narrative rather than stopping at a launch claim. Guide heroes can preview the outcome, evidence, limits, and next action without duplicating the full table of contents.
- **Pace claim, evidence, caveat.** Major claims are followed by a chart or table, an interpretation, and a nearby methodology or uncertainty note. `EvidenceFigure` should encode that order.
- **Separate reading and utility type.** Serif carries narrative copy; sans serif carries navigation, captions, controls, and data labels. The library keeps its own Georgia/Inter pairing.
- **Let media adapt, not merely shrink.** Wide benchmark tables recompose on mobile, chart tabs collapse, and galleries become horizontal sequences. Each evidence block chooses a mobile behavior based on its task.
- **Use stage-specific actions.** The reference closes with distinct product and builder actions. Guides should name the next move—`Copy the prompt`, `Open the evidence`, `Download the checklist`—instead of repeating `Learn more`.
- **Keep caveats close and sources deep.** Short uncertainty notes belong beside the evidence; detailed methodology, footnotes, corrections, and further reading remain separate end matter.
- **Offer a text path for visual evidence.** Charts, canvas, video, and interactive views require a table, transcript, or written summary that carries the same conclusion.
- **Use motion only to explain change.** Crossfades and height transitions can support view switching; reduced-motion users get a static state. Reading content does not need entrance animation.
- **Keep the library's identity.** Do not copy celestial launch art, Anthropic fonts or glyphs, testimonial carousels, competitor-winner styling, or campaign-specific color effects.

## Rollout order

### Phase 1: contract and discovery

1. Adopt the Guide schema for the catalog and all new guides.
2. Make one catalog the source for index display, search topics, and page metadata.
3. Add family, audience, outcome, interaction mode, effects, source class, and last-verified date.
4. Add index filters around reader jobs: Learn, Decide, Build, Review, Troubleshoot.

### Phase 2: shared reading system

1. Add semantic CSS tokens while preserving current rendered values.
2. Implement `GuideHero`, `TrustReceipt`, family-aware `GuideTableOfContents`, and shared completion blocks.
3. Migrate the generated Markdown template first, then the most visited bespoke guides.
4. Keep one-off evidence visualizations local until they repeat.

### Phase 3: governance and agent support

1. Validate Guide data and links in CI.
2. Add accessibility, effect-label, source-freshness, and missing-verification checks.
3. Create a guide-authoring skill that emits schema-valid drafts using approved blocks.
4. Require a named human approval before publishing agent-authored claims.

## Research basis

This system synthesizes current primary guidance; the page architecture and component names are editorial inferences for this library.

- Anthropic: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills), [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [Trustworthy agents in practice](https://www.anthropic.com/research/trustworthy-agents), and [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
- Replit: [Design systems, explained](https://docs.replit.com/design/design-systems-explained), [Design system contents and DESIGN.md](https://docs.replit.com/design/design-md), [Plan vs. Build Mode](https://docs.replit.com/learn/plan-vs-build-mode), [Build your first app](https://docs.replit.com/build/your-first-app), and [Preview](https://docs.replit.com/features/editor/preview).
- Figma: [5 shifts redefining design systems in the AI era](https://www.figma.com/blog/5-shifts-redefining-design-systems-in-the-ai-era/), [The future of design systems is semantic](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/), and [The future of design systems is accessible](https://www.figma.com/blog/the-future-of-design-systems-is-accessible/).
- Canva: [The brand infrastructure question every CMO should be asking](https://www.canva.com/newsroom/news/on-brand-ai/), [Introducing Canva Work Kits](https://www.canva.com/newsroom/news/work-kits/), and [Accessibility at Canva](https://www.canva.com/accessibility/).

## Do not

- Do not turn the site into a generic AI dashboard.
- Do not add gradients, glass panels, or rounded card grids that erase the field-guide identity.
- Do not use badges as decoration or show more than five items in the trust receipt.
- Do not put every guide into an ordered step template.
- Do not hide risk, data movement, or external effects inside a long paragraph.
- Do not equate static-analysis output, a score, or a publisher claim with approval.
- Do not let an agent publish, change risk labels, or rewrite evidence conclusions without human review.
- Do not create a new component or token for a one-off visual treatment.
