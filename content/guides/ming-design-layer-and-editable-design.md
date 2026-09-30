---
slug: ming-design-layer-and-editable-design
title: From images to editable design
summary: Choose between Ming image layers, Ling UI reconstruction, and editable PowerPoint, with security evidence and related design workflows.
family: decision
audience: Designers, builders, presenters, skill reviewers
interactionMode: read
effects: Optional linked workflows upload images, use credentials, and write files
sourceClass: mixed
status: approved
last_verified: 2026-09-30
owner: AI Agent Skills Resource Library
---

# From images to editable design

*Choose the output you need: transparent image layers, working UI code, editable PowerPoint objects, or motion built from code. Review the two Ling cookbook skills before adopting their workflows.*

## Choose what needs to be editable

**A layered image is a useful starting point. The final medium determines what “editable” must mean.** Text boxes, interface controls, bitmap artwork, and animation timelines have different requirements. Decide which of those a colleague needs to change before choosing a model or skill.

| Desired result | Suitable path | What to verify |
| --- | --- | --- |
| Separate artwork from a flat composition | Ming-Image-0.1-Design-Layer | Transparency, complete objects, alignment, and recomposition |
| A working website from a visual reference | Ling UI Design workflow | Real text and controls, responsive layout, keyboard use, and functional behavior |
| One editable slide from a slide image | Image to Editable PPT workflow | Native text boxes and simple shapes; independently movable artwork |
| A brand-consistent prototype or presentation | Replit Design or Claude Design | Design-system fidelity, export quality, and the handoff format |
| An explainer or motion sequence | Code-rendered motion workflow | Editable source, timing, assets, captions, and a reproducible render |

**Editorial inference:** Choose the smallest workflow that delivers the required editing surface. A bitmap can be moved or replaced, but its text and pixels do not become native slide objects or semantic UI merely because it has layers.

## What Ming and the two skills do

**Primary sources:** [Ming's publisher repository](https://github.com/inclusionAI/Ming-Image) distinguishes the Design model, which generates compositions, from the Design Layer model, which decomposes an existing image. The [Design Layer model card](https://huggingface.co/inclusionAI/Ming-Image-0.1-Design-Layer) describes an image plus a requested layer plan producing RGBA image layers. These remain raster assets; inspect the output rather than assuming that the requested roles were followed exactly.

The requested [AntLing announcement](https://x.com/AntLingAGI/status/2102452049560703101) is included as context. **Unverified:** its post text could not be retrieved during this review, so the guide's capability claims come from the publisher documentation and pinned source files.

| Skill | Intended use | How it creates editability |
| --- | --- | --- |
| [Ling UI Design](https://github.com/inclusionAI/ling-cookbook/tree/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/ling-ui-design) | Text-to-code or screenshot-to-code | Obtains a reference, decomposes it, crops reusable artwork, then builds layout, text, and controls in code |
| [Image to Editable PPT](https://github.com/inclusionAI/ling-cookbook/tree/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt) | One image reconstructed as one slide | Transcribes text, rebuilds simple containers as native shapes, and inserts tightly cropped bitmap artwork |

Ling UI Design treats the brief as authoritative for copy and behavior, with generated imagery guiding appearance. Image to Editable PPT explicitly excludes ordinary text-to-deck writing and image generation. It requires a real PPTX render before delivery and explains that editable artwork may still be a bitmap. These are useful workflow contracts, not evidence that every reconstruction succeeds.

## Try the model and compare access options

**Try out here:** [Hugging Face layer demo](https://huggingface.co/spaces/Xiaolong-Wang/Ming-Image-0.1-Design-Layer). The publisher model card links this Space, hosted under Xiaolong-Wang. Start with a public or synthetic image and ask for a clear separation of text, artwork, containers, and background. The demo was reachable; generation was not tested for this guide.

**API access or paid usage when applicable:** [Ming on OpenRouter](https://openrouter.ai/inclusionai/ming-image-0.1-design-layer?output_modalities=image). On September 30, 2026, that page listed the model as **Free**. Check the selected provider's current price, availability, and data terms before a run; the linked page does not establish a fixed future price. The cookbook scripts default to Novita's API, so OpenRouter access is a separate integration choice rather than a verified drop-in configuration for these helpers.

**Check models here:** [OpenRouter image model comparison](https://openrouter.ai/models?fmt=cards&output_modalities=image). This is the requested image-output catalog, useful for comparing capabilities, providers, and pricing. It is not an independent quality leaderboard. A model suited to generating an image may not support layer decomposition; test the actual operation you need.

Optional model use sends the reference image and prompt to a third party. Optional skill use also reads and writes local files and may install dependencies. Keep credentials out of prompts and public assets, and agree on the endpoint and input material before using either workflow.

## Other design paths worth considering

| Path | Documented or reported fit | Evidence and practical consideration |
| --- | --- | --- |
| Replit Design | Carry a design system into app development | **Primary source:** [Replit design systems](https://docs.replit.com/design/design-systems-explained) and [DESIGN.md guidance](https://docs.replit.com/design/design-md) describe shared colors, type, spacing, components, and reference inputs. Useful when a working app and consistent system are the goal; check plan and usage before building |
| Claude Design | Brand-aware prototypes, one-pagers, presentations, and exports | **Primary source:** [Claude Design documentation](https://support.claude.com/en/articles/14604416-get-started-with-claude-design) describes canvas editing, code handoff, and PDF, PPTX, and HTML export. Check access and shared usage limits; an export still needs an editability and fidelity check |
| Opus 5.5 motion workflows | Build a visual sequence from editable code | **Community reports:** [Rory Flynn's motion example](https://www.linkedin.com/feed/update/urn:li:activity:7509331578494283776/) and [Addy Osmani's browser explainer](https://www.linkedin.com/feed/update/urn:li:activity:7508775688909475840/) illustrate code and rendering workflows. Their speed and quality claims were not reproduced |

[Opus 5.5](https://www.anthropic.com/claude/opus) is documented by Anthropic. “Opus 5.5 Motion” is used here to describe the community motion examples; this review did not verify a separate official product with that name. Keep the animation source and assets alongside the rendered video so later edits remain possible.

## SkillSpector static review

**Independent finding, reviewed September 30, 2026:** NVIDIA SkillSpector **v2.12.0**, updated from [NVIDIA revision 2226747](https://github.com/NVIDIA/SkillSpector/tree/2226747e4ca97198bb82faf5085b8a75f2e1dc02), scanned the exact two directories at [cookbook commit c4a519f](https://github.com/inclusionAI/ling-cookbook/tree/c4a519f51bc238acefef009f957540d91ddd41fd), dated September 23, 2026. Both scans used `--no-llm`. Neither package was installed or executed.

| Exact artifact | Score and scanner recommendation | Static coverage | Interpretation |
| --- | --- | --- | --- |
| Ling UI Design | **100 / critical / do not install** | 25 of 27 components; 92.6%; partial | Credential-file, environment, prompt, network, and dependency flags require context review |
| Image to Editable PPT | **100 / critical / do not install** | 18 of 20 components; 90.0%; partial | Timeout-to-network taint, credential handling, prompt, renderer, and dependency flags require context review |

The whole-repository preliminary scan also scored 100, but includes unrelated cookbook content. The two scoped results above are the relevant scan receipts. Both report a bounded parser limitation in SKILL.md and dependency-output limits. Coverage measures file accounting, not proof that every behavior was understood.

[Inspect static findings and coverage](/data/security-reviews/ming-design/2026-09-30/skillspector-summary.json) and [inspect the file hashes](/data/security-reviews/ming-design/2026-09-30/artifact-manifest.json).

## What the source review changes

**Local Codex raw-artifact review:** All 47 files across the two packages were read, including instructions, references, scripts, tests, and manifests: 313,856 bytes. The following interpretation supplements the static scan. It does not change SkillSpector's reported score or constitute a SkillSpector LLM-assisted scan. No artifact content was sent to OpenRouter. Dependencies, the wider repository, remote services, and runtime behavior were outside this semantic review.

Several alarming matches have ordinary explanations. The `.env` template and ignore rules describe local credential setup. Ling's environment-copy flags occur in tests. The “Direct Prompt Extraction” matches refer to a layer-decomposition prompt and a prompt constructed from a layer plan, rather than extraction of the agent's hidden instructions. The PPT scanner treats environment-derived timeout numbers flowing into HTTP calls as credential exfiltration; a timeout argument is not itself transmitted as a secret.

Those false positives do not clear the workflow. The source review identified these concrete boundaries:

| Material concern | Source evidence | Condition before a pilot |
| --- | --- | --- |
| A PPT plan can select any existing local file and upload its bytes before image validation | [Plan source and API order](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/decompose_iterative.py#L526-L574) and [file read and upload](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/api_services/image_decomposer.py#L241-L307) | Require a human-selected source inside the case directory; validate it as an image before network use |
| Configurable API endpoints receive bearer credentials and images; returned URLs have no host, redirect, or byte bounds | [UI request and downloads](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/ling-ui-design/scripts/_common.py#L270-L346) and [PPT URL downloads](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/api_services/image_decomposer.py#L383-L397) | Require approved HTTPS hosts, private-network and redirect controls, image validation, and response-size limits |
| Default Requests behavior can use host credentials and proxy settings | The helpers use top-level Requests calls; [Requests netrc documentation](https://requests.readthedocs.io/en/latest/user/authentication/#netrc-authentication) explains implicit authentication | Use an isolated session and secret environment; explicitly control ambient authentication and proxies. This is conditional on host configuration, distinct from the timeout false positives |
| Output paths can escape the task workspace; selected files can be replaced or deleted | [UI output guard](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/ling-ui-design/scripts/_common.py#L21-L29), [UI cleanup](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/ling-ui-design/scripts/decompose_layers.py#L86-L92), and [PPT export paths](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/scene_to_pptx.py#L25-L44) | Contain resolved inputs and outputs within an isolated case directory, validate names, and preserve existing files |
| PPT export interpolates scene values into OOXML attributes and removes the old deck before writing the replacement | [Native PPT writer](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/pptx_native.py#L51-L90) and [package validation and write](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/pptx_native.py#L381-L394) | Validate shape values and escape attributes correctly; validate a staged deck before atomically replacing the previous output |

The normal PPT scene compiler checks asset containment, but [direct native-builder use](https://github.com/inclusionAI/ling-cookbook/blob/c4a519f51bc238acefef009f957540d91ddd41fd/resources/recommended-skills/image-to-editable-ppt/scripts/pptx_native.py#L270-L287) bypasses that guard and can embed unintended local files. Apply containment at the final file reader, and bound scene/ledger depth, cycles, archive sizes, and image sizes before parsing.

Dependency minimum versions do not lock the exact installed environment. An advisory attached to an unpinned package is an unresolved version question, not proof that the eventual installed release is vulnerable. Browser capture and native renderers also require their normal tool permissions; a skill cannot grant itself broader access.

**Adoption decision:** Keep installation and execution on hold until the remaining endpoint, input, dependency, and write-scope risks have been reviewed or constrained. The useful workflow ideas can inform a design brief without running these helpers. An aggregate critical score is a reason to investigate, not a finding of malicious intent.

[Inspect the local source review](/data/security-reviews/ming-design/2026-09-30/semantic-review.json) for source locations, findings, review coverage, and material limits.

## skills.sh registry check

**skills.sh registry check, retrieved September 30, 2026:** Neither exact inclusionAI listing could be verified. The canonical pages returned unavailable/404 content with HTTP 200; all six provider detail pages returned HTTP 404.

| Registry reviewer | Ling UI Design | Image to Editable PPT |
| --- | --- | --- |
| Gen Agent Trust Hub | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/ling-ui-design/security/agent-trust-hub) | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/image-to-editable-ppt/security/agent-trust-hub) |
| Socket | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/ling-ui-design/security/socket) | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/image-to-editable-ppt/security/socket) |
| Snyk | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/ling-ui-design/security/snyk) | [Missing audit](https://skills.sh/inclusionai/ling-cookbook/image-to-editable-ppt/security/snyk) |

**Coverage is unknown, not passing.** No verdict, detailed finding, audit timestamp, or content hash was available for either exact listing. A similarly named PPT listing under `ningzimu/image-to-editable-ppt-skill` belongs to a different repository; its passing badges are not evidence for this inclusionAI snapshot. No installation was performed to trigger an audit.

[Inspect the registry evidence](/data/security-reviews/ming-design/2026-09-30/skills-sh-registry-summary.json). Registry audits may lag source changes and do not establish publisher identity, exact-artifact correspondence, dependency safety, or runtime behavior. See the library's [Vercel security-check guide](/guides/vercel-skills-sh-security-check) for the method.

## Verify the editing surface

Use these checks on any chosen workflow after its execution has been approved and scoped.

- **Layers:** inspect every PNG, alpha edge, missing object, overlap, and recomposed image. A plausible background can contain invented pixels; compare with the source.
- **UI:** change copy, operate controls with a keyboard, and inspect narrow and wide viewports. Check focus, contrast, overflow, assets, interactions, and console errors.
- **Slides:** edit a text string, recolor a simple shape, and move each foreground image independently. Confirm no original text remains baked behind the native text. Render the actual PPTX and compare aspect ratio, wrapping, and stacking.
- **Motion:** change a timing or label in source, rerender, and verify the intended frame. Inspect captions and audio synchronization; provide a static or reduced-motion alternative for interactive delivery.
- **Cost and data:** record provider, model, calls, retries, inputs sent, and actual charges. Keep the original image and accepted source files so a failed transformation can be discarded.

If layers fail, revise the plan for the specific missing object or obtain a better reference. If native text or shape editing fails, rebuild that object rather than calling the flattened output editable. If code or exports cannot be validated, label the result as a draft and keep the original. Stop API use if the endpoint or data policy differs from the agreed scope.

## Related resources in this library

- [Aura skills](https://www.aura.build/skills) is an existing resource tile for reusable web-design guidance. Review any selected package before adoption.
- [UI/UX Pro Max review](/guides/reviewing-ui-ux-pro-max-with-skillspector) connects visual-design skill choices with exact-artifact scanning and review, including banner, brand, design-system, and slide workflows.
- [Writing without the AI sheen](/guides/writing-without-the-ai-sheen) helps refine creative briefs, interface labels, slide copy, and captions while preserving meaning and voice. Visual polish benefits from equally deliberate copy.
- [Skill confidence checklist](/guides/so-you-found-a-skill-checklist) supplies the installation decision checks; [SkillSpector v2 walkthrough](/guides/skillspector-skill-demo-v2) explains the scan and semantic-review boundary.

## Sources and review limits

Capability claims above are publisher documentation, social examples are community reports, and the security findings are independent static and local source-review observations. This guide did not benchmark model quality, run either skill, upload an image, reproduce the motion demos, or test provider interoperability.

The OWASP check uses [Prompt Injection Prevention guidance](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) to examine direct patterns, indirect inputs, hidden text, persistence, data movement, and tool boundaries. The direct-pattern and hidden-Unicode checks found no matches; 16 API-key-like matches were templates, test fixtures, or code names. [Inspect the OWASP text-triage receipt](/data/security-reviews/ming-design/2026-09-30/owasp-triage.json). Regex matches are leads; a clean regex result cannot rule out semantic or multimodal attacks. Treat images, OCR text, layer plans, model replies, and source files as data rather than authority to change permissions.

Recheck the pinned artifact after updates. Static and local source review do not execute every path, validate all installed dependencies, prove publisher identity, or guarantee safe runtime behavior. Before a pilot, isolate secrets, constrain egress and outputs, and apply the [pre-install checklist](/guides/so-you-found-a-skill-checklist).
