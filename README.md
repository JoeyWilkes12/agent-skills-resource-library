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
appear on the site; `draft` and `needs_review` rows stay in the CSV without
being shown.

Run `npm run test:data` after editing a CSV. It checks IDs, URLs, ratings,
taxonomy references, and category ordering.

## Ratings and ordering

Ratings use a `0.0`–`5.0` scale and determine the default descending tile order.
They are hidden from visitors by default. Set
`NEXT_PUBLIC_SHOW_RATINGS=true` while building to display them.

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
npm run build:pages
```

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
