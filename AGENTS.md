# Resource-library maintenance

- Before adding a row to `public/data/resources.csv`, check existing rows for similar URL domains. If it is unclear whether the proposed resource duplicates an existing one, add the row rather than omitting it; then run `npm run data:duplicates` so exact URL duplicates are marked correctly.
