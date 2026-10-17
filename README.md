# Agent Skills Resource Library

A searchable, novice-friendly catalog for learning, building, troubleshooting,
applying, managing, and evaluating agent skills. The visual structure is a
search-first asset library: featured starting points, faceted filters, and
resource tiles rather than a document full of links.

Selecting a tile expands its full description in place. The separate
**See Resource ↗** control opens the publisher's page in a new tab.

## Edit the library

The site uses three CSV files as its content source:

- `public/data/resources.csv` contains one row per resource.
- `public/data/taxonomy.csv` controls filter labels, descriptions, and order.
- `public/data/resource_category_order.csv` supplies optional curated positions
  within a filter category.

Multi-value fields in `resources.csv` use `|` as a separator. Published rows
appear on the site unless `exclude` is `true`. Use `exclude` as a simple
visibility toggle when a resource should remain in the catalog data but not
appear as a tile. `draft` and `needs_review` rows also stay in the CSV without
being shown. The `duplicate_url` column records whether the same
hyperlink appears more than once; it is editorial metadata and does not affect
the interface. Run `npm run data:duplicates` after adding or changing links to
refresh those flags.

Resources can point to either an external `https://` URL or a local site path
such as `/guides/when-not-to-use-a-skill`. Local guides open in the same tab.

Run `npm run test:data` after editing a CSV. It checks IDs, URLs, duplicate-link
flags, ratings, taxonomy references, and category ordering.

## Ratings and ordering

Ratings use a `0.0`–`5.0` scale in half-point steps. The
[rating criteria and row-by-row assessments](public/data/resource-ratings.md)
document relevance, actionable guidance, source traceability, verification
support, and stated boundaries. They measure documented usefulness for this
library, including usefulness for evaluating risks. They do not approve
installation or certify security. Every CSV row has an assessment, including
hidden drafts. Ratings are shown by default; set
`NEXT_PUBLIC_SHOW_RATINGS=false` while building to hide the card values.

The library's **Rating criteria** link and the Guides index open the HTML guide
at `/guides/resource-ratings`. The guide is generated from the same Markdown
above and uses the shared reading layout, trust receipt, and scrollable tables.

Visitors can select rating or date-added sorting with upward/downward arrow
buttons. These sort all matching results before pagination and retain search
and category filters. The active sort is saved in the URL. **Curated** restores
the default order. Missing values stay last in either direction.

`added_on` records the first committed introduction of a stable resource ID
to this library. It is separate from the source's publication date and
`verified_on`. See [date provenance](docs/resource-added-dates.md) for the
history method and regeneration command. Manual override imports preserve
the target's Git-derived date, including when importing older exports that
lack the column.

Override ratings must follow the half-point rubric. If an import changes a
rating, update its criterion assessment and rationale in the rating ledger
before running `npm run ratings:sync`; validation rejects unexplained score
changes. Older exports with blank or finer-grained scores need reassessment
before import.

The About page's Google Drive media link is enabled by default. Set
`NEXT_PUBLIC_SHOW_MEDIA_FOLDER=false` while building to hide it.

When a visitor selects a category, entries in
`resource_category_order.csv` take precedence. Unranked resources then fall
back to rating and title.

## Local development

Requirements: Node.js 24 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run test:data
npm test
npm run test:links:external
npm run build:pages
```

The default link regression checks every authored hyperlink, local route, and
in-page anchor. The external variant also requests every published third-party
URL and is best run when network access is available.

## Publish with GitHub Pages

This repository includes `.github/workflows/deploy-pages.yml`. Create a public
GitHub repository, push the `main` branch, and choose **GitHub Actions** as the
Pages source in the repository settings. The workflow handles both project
sites and `<username>.github.io` repositories.

Merging a pull request into `main` triggers this workflow automatically. It
validates the CSV, builds the static site with the repository base path, uploads
the Pages artifact, and deploys it. A separate manual republish is normally
unnecessary. Confirm that **Deploy static site to GitHub Pages** succeeds in
Actions and verify the live site after the merge. If it fails, fix the failing
step and rerun the workflow; `workflow_dispatch` also allows a manual run.
Pushing a feature branch or opening a PR runs validation without publishing.

## Editorial policy

Primary documentation is preferred. Community directories, repositories, and
shared conversations are labeled by source type and should not be treated as
independent proof of quality. Review third-party instructions, scripts,
dependencies, permissions, and data handling before adoption.

The first troubleshooting research pass is documented in
`content/research/troubleshooting-verification.md`.
