"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { guideCatalog } from "./guide-catalog";
import { searchGuides } from "./guide-search";

const SEARCH_PARAM = "q";

function guideHref(basePath: string, href: string) {
  return `${basePath}${href}`;
}

function readUrlQuery() {
  if (typeof window === "undefined") return "";
  return new URL(window.location.href).searchParams.get(SEARCH_PARAM) ?? "";
}

function writeUrlQuery(query: string) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (query.trim()) {
    url.searchParams.set(SEARCH_PARAM, query);
  } else {
    url.searchParams.delete(SEARCH_PARAM);
  }
  window.history.replaceState({}, "", url);
}

function SearchResultReason({
  foundInside,
}: {
  foundInside: readonly string[];
}) {
  if (foundInside.length === 0) return null;

  return (
    <p className="guides-found-inside">
      <span>Found inside:</span> {foundInside.join(" · ")}
    </p>
  );
}

function GuideLink({
  basePath,
  result,
}: {
  basePath: string;
  result: ReturnType<typeof searchGuides>[number];
}) {
  const { guide } = result;

  return (
    <li>
      <a href={guideHref(basePath, guide.href)}>
        <div>
          <h3>{guide.title}</h3>
          <p>{guide.summary}</p>
          <SearchResultReason foundInside={result.foundInside} />
        </div>
        <span aria-hidden="true">→</span>
      </a>
    </li>
  );
}

export function GuidesSearch({ basePath }: { basePath: string }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;
  const results = searchGuides(guideCatalog, query);
  const featuredResult = results.find((result) => result.guide.featured);
  const listResults = results.filter((result) => !result.guide.featured);

  const updateQuery = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    writeUrlQuery(nextQuery);
  }, []);

  useEffect(() => {
    const initialQuery = readUrlQuery();
    let initialQueryTask: number | undefined;
    if (initialQuery) {
      initialQueryTask = window.setTimeout(() => setQuery(initialQuery), 0);
    }

    const handlePopState = () => setQuery(readUrlQuery());
    window.addEventListener("popstate", handlePopState);
    return () => {
      if (initialQueryTask) window.clearTimeout(initialQueryTask);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const clearSearch = useCallback(() => {
    updateQuery("");
    inputRef.current?.focus();
  }, [updateQuery]);

  const applySuggestion = useCallback(
    (suggestion: string) => {
      updateQuery(suggestion);
      inputRef.current?.focus();
    },
    [updateQuery],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && query) {
      event.preventDefault();
      clearSearch();
    }
  };

  return (
    <>
      <form className="guides-search" onSubmit={handleSubmit} role="search">
        <label className="guides-search-label" htmlFor="guide-search">
          Search the guides
        </label>
        <div className="guides-search-controls">
          <div className="guides-search-field">
            <span aria-hidden="true">
              <svg className="guides-search-icon" viewBox="0 0 20 20">
                <circle cx="8.5" cy="8.5" r="5.25" />
                <path d="m12.5 12.5 4 4" />
              </svg>
            </span>
            <input
              aria-describedby="guide-search-hint"
              id="guide-search"
              onChange={(event) => updateQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Try “prompt injection” or “testing”"
              ref={inputRef}
              type="search"
              value={query}
            />
          </div>
          <button
            aria-label="Clear guide search"
            className="guides-search-clear"
            disabled={!hasQuery}
            onClick={clearSearch}
            type="button"
          >
            Clear
          </button>
        </div>
        <p className="guides-search-hint" id="guide-search-hint">
          Search titles, summaries, and selected headings and topics from every
          guide. Article body text is not indexed. Multiple words narrow the
          results.
        </p>
        <p
          aria-atomic="true"
          aria-live="polite"
          className="guides-search-status"
        >
          {hasQuery
            ? `${results.length} ${results.length === 1 ? "guide" : "guides"} matching`
            : `${guideCatalog.length} guides`}
        </p>
      </form>

      {hasQuery && results.length === 0 ? (
        <section className="guides-empty">
          <p className="guides-empty-label">No guides found</p>
          <h2>No guide matches “{query.trim()}”.</h2>
          <p>
            Try a broader topic such as{" "}
            <button onClick={() => applySuggestion("security")} type="button">
              security
            </button>
            ,{" "}
            <button onClick={() => applySuggestion("testing")} type="button">
              testing
            </button>
            , or{" "}
            <button
              onClick={() => applySuggestion("skillspector")}
              type="button"
            >
              SkillSpector
            </button>
            .
          </p>
          <button
            className="guides-empty-clear"
            onClick={clearSearch}
            type="button"
          >
            Clear search
          </button>
        </section>
      ) : (
        <>
          {featuredResult ? (
            <section aria-label="Featured guide">
              <a
                className="guides-feature"
                href={guideHref(basePath, featuredResult.guide.href)}
              >
                {featuredResult.guide.image ? (
                  // Static guide art is served without an image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={featuredResult.guide.image.alt}
                    className="guides-feature-image"
                    src={`${basePath}${featuredResult.guide.image.src}`}
                  />
                ) : null}
                <div className="guides-feature-copy">
                  <h2>{featuredResult.guide.title}</h2>
                  <p>{featuredResult.guide.summary}</p>
                  {hasQuery ? (
                    <SearchResultReason
                      foundInside={featuredResult.foundInside}
                    />
                  ) : null}
                  <span className="guides-feature-link">
                    Read the guide <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            </section>
          ) : null}

          <section className="guides-list" aria-labelledby="more-guides-heading">
            <div className="guides-list-header">
              <h2 id="more-guides-heading">
                {hasQuery
                  ? `Guides matching “${query.trim()}”`
                  : "More guides from the library"}
              </h2>
              <p>
                {hasQuery
                  ? "Matches can come from a title, summary, or a section and topic phrase inside the guide."
                  : "Practical reading for deciding whether to use, install, review, or improve an agent skill."}
              </p>
            </div>
            {listResults.length > 0 ? (
              <ul>
                {listResults.map((result) => (
                  <GuideLink
                    basePath={basePath}
                    key={result.guide.href}
                    result={result}
                  />
                ))}
              </ul>
            ) : hasQuery ? (
              <p className="guides-list-only-featured">
                The featured guide above is the only match.
              </p>
            ) : null}
          </section>
        </>
      )}
    </>
  );
}
