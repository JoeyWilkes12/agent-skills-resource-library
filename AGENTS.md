# Resource-library maintenance

- Before adding a row to `public/data/resources.csv`, check existing rows for similar URL domains. If it is unclear whether the proposed resource duplicates an existing one, add the row rather than omitting it; then run `npm run data:duplicates` so exact URL duplicates are marked correctly.

# Changelog maintenance

- Every user-visible website change must be reflected in the About-page changelog. The changelog is generated from Git history, so use a clear, visitor-facing commit subject and run `npm run changelog:generate` before previewing or building. Do not hand-edit `app/about/generated/changelog.json`.
- Preserve row-level history for `public/data/resources.csv`: every newly committed resource ID must produce its own `Added` entry, even when that CSV row is the commit's only change.

# Delivery and publication status

- “Website” refers to the GitHub Pages deployment, not OpenAI Sites.
- Every handoff must state separately whether changes were committed, pushed to `origin`, and published to GitHub Pages.
- If a commit was created, include its full commit ID. If no commit was created, explicitly say that no commit ID exists; never imply that uncommitted work was pushed or published.
- Treat GitHub Pages as unchanged unless a successful deployment was explicitly performed and verified.
