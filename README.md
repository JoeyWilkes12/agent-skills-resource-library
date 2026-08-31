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
being shown. The final `duplicate_url` column records whether the same
hyperlink appears more than once; it is editorial metadata and does not affect
the interface. Run `npm run data:duplicates` after adding or changing links to
refresh those flags.

Resources can point to either an external `https://` URL or a local site path
such as `/guides/when-not-to-use-a-skill`. Local guides open in the same tab.

Run `npm run test:data` after editing a CSV. It checks IDs, URLs, duplicate-link
flags, ratings, taxonomy references, and category ordering.

## Ratings and ordering

Ratings use a `0.0`–`5.0` scale and determine the default descending tile order.
They are hidden from visitors by default. Set
`NEXT_PUBLIC_SHOW_RATINGS=true` while building to display them.

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

## Editorial policy

Primary documentation is preferred. Community directories, repositories, and
shared conversations are labeled by source type and should not be treated as
independent proof of quality. Review third-party instructions, scripts,
dependencies, permissions, and data handling before adoption.

The first troubleshooting research pass is documented in
`content/research/troubleshooting-verification.md`.
