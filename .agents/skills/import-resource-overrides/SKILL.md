---
name: import-resource-overrides
description: Preview, validate, and apply the newest timestamped resources CSV from the adjacent manual override folder. Use when updating resource tiles, ratings, featured flags, exclusions, or other canonical resource fields while preserving the static site's schema and build integrity.
---

# Import Resource Overrides

Use the bundled importer from the repository root. Keep preview and apply as separate phases so the user can see the meaningful changes before the site data is modified.

## Workflow

1. Run a read-only preview:

   `npm run resources:override`

2. Report:
   - the selected source filename and timestamp;
   - record count and file size;
   - added or removed resource IDs;
   - each meaningful field change, grouped by `featured`, `rating`, `exclude`, and other fields;
   - ignored helper columns and any newer timestamped files skipped for schema mismatch.

3. Stop if validation reports an invalid filename timestamp, missing or unknown columns, malformed type, duplicate ID, changed ID set, excessive row count, or excessive file size. Do not silently fall back from an invalid compatible resource export.

4. After the user has authorized the update, apply the exact previewed projection:

   `npm run resources:override -- --apply`

5. Verify the result:

   `npm run lint`

   `npm test`

   `npm run build:pages`

6. If a linked worktree uses a dependency symlink and Next.js rejects the Pages build locally, report that specific limitation and require the clean GitHub Actions branch validation to pass before handoff.

## Import Rules

- Search `../manual data overrides for resource library` by default.
- Select the newest schema-compatible CSV using the terminal timestamp suffix `YYYY-MM-DD_HH-MM-SS.csv`.
- Require the source resource IDs to match the target IDs exactly; this workflow is for overrides, not additions or deletions.
- Use the canonical `featured` column as the only source of featured-tile state.
- Ignore and omit `JW Notes` and `featured_JW` from the published CSV.
- Normalize booleans to lowercase and ratings to one decimal place.
- Recompute `duplicate_url` from normalized hyperlinks rather than trusting the uploaded flag.
- Keep the canonical column order from `public/data/resources.csv`.
- Use `--source-dir` or `--target` only when the repository layout is intentionally different.

The deterministic implementation lives in `scripts/import-resource-overrides.mjs`.
