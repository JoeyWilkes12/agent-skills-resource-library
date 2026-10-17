import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import {
  applyAddedOn,
  backfillResourceDates,
  buildDateProvenance,
  PROVENANCE_PATH,
  RESOURCE_PATH,
} from "../scripts/backfill-resource-dates.mjs";
import { recordsFromCsv } from "../scripts/generate-changelog.mjs";

function git(cwd, args, date) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "Resource date test",
      GIT_AUTHOR_EMAIL: "test@example.invalid",
      GIT_COMMITTER_NAME: "Resource date test",
      GIT_COMMITTER_EMAIL: "test@example.invalid",
      ...(date ? { GIT_AUTHOR_DATE: "2000-01-01T12:00:00+00:00", GIT_COMMITTER_DATE: date } : {}),
    },
  }).trim();
}

async function repository(t) {
  const cwd = await mkdtemp(join(tmpdir(), "resource-added-on-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  git(cwd, ["init", "-b", "main"]);
  return cwd;
}

async function snapshot(cwd, csv, date, path = RESOURCE_PATH) {
  await mkdir(dirname(join(cwd, path)), { recursive: true });
  await writeFile(join(cwd, path), csv);
  git(cwd, ["add", "."]);
  git(cwd, ["commit", "-m", "Update resources"], date);
  return git(cwd, ["rev-parse", "HEAD"]);
}

test("uses the first committed ID, retaining its recorded offset across edits, merges, and reintroduction", async (t) => {
  const cwd = await repository(t);
  await snapshot(cwd, "id,title,url\n", "2026-07-01T12:00:00-06:00");
  git(cwd, ["checkout", "-b", "feature"]);
  const introduction = await snapshot(
    cwd, "id,title,url\nalpha,Alpha,https://example.com/a\n", "2026-07-02T23:45:00-06:00",
  );
  await snapshot(
    cwd, "id,title,url\nalpha,Renamed,https://example.com/new\n", "2026-07-04T12:00:00-06:00",
  );
  git(cwd, ["checkout", "main"]);
  await snapshot(cwd, "id,title,url\n", "2026-07-03T12:00:00-06:00", "data/unused.csv");
  git(cwd, ["merge", "--no-ff", "feature", "-m", "Merge resources"], "2026-07-05T12:00:00-06:00");
  await snapshot(cwd, "id,title,url\n", "2026-07-06T12:00:00-06:00");
  await snapshot(cwd, "id,title,url\nalpha,Reintroduced,https://example.com/new\n", "2026-07-07T12:00:00-06:00");

  const { resources } = buildDateProvenance({ cwd });
  assert.deepEqual(resources.alpha, {
    added_on: "2026-07-02",
    commit: introduction,
    committed_at: "2026-07-02T23:45:00-06:00",
    path: RESOURCE_PATH,
    matched_id: "alpha",
  });
});

test("supports documented older CSV paths without treating a move as an addition", async (t) => {
  const cwd = await repository(t);
  const legacyPath = "data/resources.csv";
  const introduction = await snapshot(
    cwd, "id,title,url\nalpha,Alpha,https://example.com\n", "2026-07-02T12:00:00+09:00", legacyPath,
  );
  await mkdir(dirname(join(cwd, RESOURCE_PATH)), { recursive: true });
  git(cwd, ["mv", legacyPath, RESOURCE_PATH]);
  git(cwd, ["commit", "-m", "Move resource CSV"], "2026-07-04T12:00:00-06:00");
  const { resources } = buildDateProvenance({ cwd, historyPaths: [RESOURCE_PATH, legacyPath] });
  assert.equal(resources.alpha.added_on, "2026-07-02");
  assert.equal(resources.alpha.commit, introduction);
  assert.equal(resources.alpha.path, legacyPath);
});

test("resolves independent branch introductions by recorded commit time", async (t) => {
  const cwd = await repository(t);
  await snapshot(cwd, "id,title,url\n", "2026-07-01T12:00:00-06:00");
  git(cwd, ["checkout", "-b", "feature"]);
  const earliest = await snapshot(
    cwd, "id,title,url\nalpha,Alpha,https://example.com\n", "2026-07-02T12:00:00-06:00",
  );
  git(cwd, ["checkout", "main"]);
  const later = await snapshot(
    cwd, "id,title,url\nalpha,Alpha,https://example.com\n", "2026-07-03T12:00:00-06:00",
  );
  git(cwd, ["merge", "--no-ff", "feature", "-m", "Merge independently added resource"], "2026-07-04T12:00:00-06:00");
  const { resources } = buildDateProvenance({ cwd });
  assert.equal(resources.alpha.commit, earliest);
  assert.deepEqual(resources.alpha.independent_introduction_commits, [earliest, later]);
});

test("does not infer identity from a reused URL or invent dates for uncommitted rows", async (t) => {
  const cwd = await repository(t);
  await snapshot(cwd, "id,title,url\nold,Alpha,https://example.com\n", "2026-07-02T12:00:00-06:00");
  const newIntroduction = await snapshot(
    cwd, "id,title,url\nnew,Alpha,https://example.com\n", "2026-07-05T12:00:00-06:00",
  );
  assert.equal(buildDateProvenance({ cwd }).resources.new.commit, newIntroduction);
  assert.throws(() => buildDateProvenance({
    cwd,
    currentRecords: [{ id: "uncommitted", url: "https://example.com" }],
  }), /No committed introduction found for uncommitted/);
});

test("rejects shallow history rather than assigning the oldest available snapshot date", async (t) => {
  const cwd = await repository(t);
  await snapshot(cwd, "id,title,url\nalpha,Alpha,https://example.com\n", "2026-07-02T12:00:00-06:00");
  await writeFile(join(cwd, ".git", "shallow"), `${git(cwd, ["rev-parse", "HEAD"])}\n`);
  assert.throws(() => buildDateProvenance({ cwd }), /require full Git history/);
});

test("appends and replaces only added_on while retaining quoted fields and embedded newlines", () => {
  const input = 'id,title,url,summary,rating\nalpha,"Alpha, guide",https://example.com,"Line one\nLine two; ""quoted""",4.3\n';
  const provenance = { resources: { alpha: { added_on: "2026-07-02" } } };
  const expected = 'id,title,url,summary,rating,added_on\nalpha,"Alpha, guide",https://example.com,"Line one\nLine two; ""quoted""",4.3,2026-07-02\n';
  assert.equal(applyAddedOn(input, provenance), expected);
  const withoutDates = recordsFromCsv(expected);
  for (const record of withoutDates) delete record.added_on;
  assert.deepEqual(withoutDates, recordsFromCsv(input));
  assert.equal(applyAddedOn(expected, provenance), expected);
  assert.equal(
    applyAddedOn(expected.replace("4.3,2026-07-02", "4.3,2026-07-03"), provenance),
    expected,
  );
});

test("check mode verifies history and provenance without modifying the CSV or ledger", async (t) => {
  const cwd = await repository(t);
  await snapshot(cwd, "id,title,url\nalpha,Alpha,https://example.com\n", "2026-07-02T12:00:00-06:00");
  await assert.rejects(backfillResourceDates({ cwd }), /added_on values are missing/);
  await backfillResourceDates({ cwd, write: true });
  const csv = await readFile(join(cwd, RESOURCE_PATH), "utf8");
  const ledger = await readFile(join(cwd, PROVENANCE_PATH), "utf8");
  await backfillResourceDates({ cwd });
  assert.equal(await readFile(join(cwd, RESOURCE_PATH), "utf8"), csv);
  assert.equal(await readFile(join(cwd, PROVENANCE_PATH), "utf8"), ledger);

  // A later commit can retain the earlier ledger generation reference.
  git(cwd, ["add", "."]);
  git(cwd, ["commit", "-m", "Record added dates"], "2026-07-03T12:00:00-06:00");
  await backfillResourceDates({ cwd });
  await writeFile(join(cwd, RESOURCE_PATH), csv.replace("2026-07-02", "2026-07-03"));
  await assert.rejects(backfillResourceDates({ cwd }), /differ from Git history/);
  await writeFile(join(cwd, RESOURCE_PATH), csv);

  const alteredLedger = JSON.parse(ledger);
  alteredLedger.resources.alpha.commit = "0".repeat(40);
  await writeFile(join(cwd, PROVENANCE_PATH), JSON.stringify(alteredLedger));
  await assert.rejects(backfillResourceDates({ cwd }), /provenance differs from Git history/);
  alteredLedger.resources.alpha.commit = JSON.parse(ledger).resources.alpha.commit;
  alteredLedger.generated_from = "0".repeat(40);
  await writeFile(join(cwd, PROVENANCE_PATH), JSON.stringify(alteredLedger));
  await assert.rejects(backfillResourceDates({ cwd }), /reachable generation commit/);
});
