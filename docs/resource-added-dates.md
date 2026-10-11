# Resource added dates

`public/data/resources.csv` has an `added_on` column in `YYYY-MM-DD` format. It records the date that a resource's stable `id` first appears in this repository's committed resource CSV history. It includes drafts and excluded rows because those rows were still added to the library dataset.

This is a history-derived library date. It does not describe the resource's publication date, its latest edit, its `verified_on` review date, or the date a GitHub Pages deployment went live. Changes to a title, URL, rating, status, visibility, or row position retain the original date. Removing and later restoring the same stable ID also retains its first date. A genuinely new resource should receive a new ID.

## Date and identity rules

The backfill reads the full parent graph reachable from the selected Git revision (normally `HEAD`). It records the first commit introducing each ID on its ancestry, including introductions on branches that were later merged. A merge does not replace the branch's introduction date with its merge date. If independent branches first introduce the same ID, the earlier recorded committer timestamp wins; equal timestamps are resolved by commit hash, and both introduction hashes remain in the ledger.

The date comes from the introducing commit's **committer timestamp in its recorded timezone offset**, using Git's strict ISO 8601 `%cI` value. For example, `2026-07-02T23:45:00-06:00` becomes `2026-07-02`, even though the UTC date is July 3. This preserves the date recorded with the change and does not depend on the timezone of the machine running the script. Author dates are not used because an older authored patch can be committed later. Git timestamps are historical metadata, not independently verified wall-clock evidence.

Identity uses the stable `id`, not a URL, title, row number, or most recently edited line. Separate rows can intentionally share a URL. The current history preserves all 71 current IDs without any inferred rename or URL fallback. The canonical path `public/data/resources.csv` was introduced with the initial dataset in commit `98114be89804fab359cfd999c7c910ed98e3a8d3` on July 28, 2026; the reachable history contains no earlier alternate resource CSV path.

If a future file move requires an older CSV path, add that verified path with `--history-path`. If a resource ID must be renamed, record the explicit identity mapping and its evidence before changing the script; it intentionally does not guess from matching URLs. This avoids backdating a different resource that reuses a link.

## Inspecting and regenerating

`public/data/resource-added-on.json` is the audit ledger. Each current ID has its `added_on` date, full introducing commit hash, complete committer timestamp and offset, CSV path, and matched ID. `generated_from` identifies the Git revision used for the backfill; it may remain an earlier revision when later commits do not change introduction evidence. A shallow checkout is rejected because it cannot prove the first addition.

Run from the repository root with full Git history:

```sh
# Verify CSV dates and ledger against history without writing files.
node scripts/backfill-resource-dates.mjs --check

# Fill or correct dates and regenerate the ledger.
node scripts/backfill-resource-dates.mjs --write

# Preview both outputs in scratch files without changing the canonical CSV.
node scripts/backfill-resource-dates.mjs --write \
  --output work/resources-with-dates.csv \
  --ledger-output work/resource-added-on.json

# Include a verified older path after a future CSV move.
node scripts/backfill-resource-dates.mjs --write \
  --history-path data/resources.csv
```

The script changes only `added_on` cells, preserving other CSV fields and their quoting. Existing date values are checked against introduction evidence and corrected by `--write`. It fails if any current ID has no committed introduction rather than inventing a date from today's clock. For a newly added row, commit its introduction first, run the backfill, and include the date and provenance in a follow-up commit before opening the PR. A normal merge preserves those commits; if a squash or rebase changes their hashes, rerun the backfill against the resulting history and commit the refreshed provenance.

The regression tests use temporary Git repositories to verify first addition, local date offsets, different author and committer dates, edits, merges, removal and restoration, independent branch additions, file moves, shallow history rejection, and CSV preservation:

```sh
node --test tests/resource-added-on.test.mjs
```
