import assert from "node:assert/strict";
import test from "node:test";

import { synchronizeDuplicateUrls } from "../scripts/sync-duplicate-urls.mjs";

test("updates duplicate_url before appended added_on without changing other fields", () => {
  const input = "id,url,summary,duplicate_url,added_on\r\n"
    + 'a,https://example.com,"An article, with ""quotes""\r\nand a second line",false,2026-07-01\r\n'
    + 'b,https://example.com/,"Same URL",false,2026-10-10\r\n'
    + 'c,/guides/review,"A unique guide",true,2026-08-02\r\n';
  const expected = input
    .replace(',false,2026-07-01', ',true,2026-07-01')
    .replace(',false,2026-10-10', ',true,2026-10-10')
    .replace(',true,2026-08-02', ',false,2026-08-02');
  const result = synchronizeDuplicateUrls(input);

  assert.equal(result.output, expected);
  assert.equal(result.resourceCount, 3);
  assert.equal(result.duplicateCount, 1);
  assert.equal(synchronizeDuplicateUrls(result.output).output, result.output);
});

test("finds duplicate_url in the first or final column", () => {
  assert.equal(
    synchronizeDuplicateUrls('duplicate_url,url,added_on\nfalse,/guide,2026-01-01\nfalse,/guide,2026-02-01').output,
    'duplicate_url,url,added_on\ntrue,/guide,2026-01-01\ntrue,/guide,2026-02-01',
  );
  assert.equal(
    synchronizeDuplicateUrls('url,added_on,duplicate_url\nhttps://one.example,2026-01-01,true\nhttps://two.example,2026-02-01,false\n').output,
    'url,added_on,duplicate_url\nhttps://one.example,2026-01-01,false\nhttps://two.example,2026-02-01,false\n',
  );
});

test("appends a missing duplicate_url column while preserving multiline fields and no final newline", () => {
  const input = 'url,added_on,summary\n/guide,2026-01-01,"A, B\nand C"\n/other,2026-02-01,Other';
  const result = synchronizeDuplicateUrls(input);

  assert.equal(result.output, 'url,added_on,summary,duplicate_url\n/guide,2026-01-01,"A, B\nand C",false\n/other,2026-02-01,Other,false');
  assert.equal(result.duplicateCount, 0);
});

test("retains BOM, blank lines, and quoted flags when already correct", () => {
  const input = '\uFEFFurl,duplicate_url,added_on\r\n\r\n/one,"false",2026-01-01\r\n/one?version=2,false,2026-02-01\r\n';
  assert.equal(synchronizeDuplicateUrls(input).output, input);
});

test("treats blank URLs as unique and normalizes exact hyperlink equivalents", () => {
  const result = synchronizeDuplicateUrls('url,duplicate_url\n,false\n,false\nhttps://example.com:443,false\nhttps://example.com/,false\n');
  assert.equal(result.output, 'url,duplicate_url\n,false\n,false\nhttps://example.com:443,true\nhttps://example.com/,true\n');
  assert.equal(result.duplicateCount, 1);
});

test("rejects broken CSV shapes before any data could be written", () => {
  assert.throws(() => synchronizeDuplicateUrls('id,duplicate_url\na,false\n'), /url column/);
  assert.throws(() => synchronizeDuplicateUrls('url,duplicate_url,added_on\n/guide,false\n'), /expected 3/);
  assert.throws(() => synchronizeDuplicateUrls('url,duplicate_url,duplicate_url\n/guide,false,false\n'), /at most one/);
  assert.throws(() => synchronizeDuplicateUrls('url,summary\n/guide,"Unfinished'), /unterminated/);
});
