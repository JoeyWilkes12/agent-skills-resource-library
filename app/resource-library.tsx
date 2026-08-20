"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { featuredIntro } from "./featured-copy";
import { siteConfig } from "./site-config";
import { SiteHeader } from "./site-header";

type Dimension =
  | "intent"
  | "topic"
  | "resource_type"
  | "publisher"
  | "level";

type Resource = {
  id: string;
  title: string;
  url: string;
  summary: string;
  publisher: string;
  resourceType: string;
  level: string;
  rating: number | null;
  featured: boolean;
  status: string;
  exclude: boolean;
  intents: string[];
  topics: string[];
  tags: string[];
  verifiedOn: string;
};

type TaxonomyItem = {
  dimension: Dimension;
  value: string;
  label: string;
  description: string;
  displayOrder: number;
  enabled: boolean;
};

type CategoryOrder = {
  resourceId: string;
  dimension: Dimension | "all";
  categoryValue: string;
  displayOrder: number;
};

type Selections = Record<Dimension, string[]>;

const DIMENSIONS: Dimension[] = [
  "intent",
  "topic",
  "resource_type",
  "publisher",
  "level",
];

const EMPTY_SELECTIONS: Selections = {
  intent: [],
  topic: [],
  resource_type: [],
  publisher: [],
  level: [],
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const CARD_COVER_IMAGES: Record<string, string> = {
  "oreilly-skills-context-window": "/images/skills-for-ai-agents-cover.jpg",
};

const DIMENSION_TITLES: Record<Dimension, string> = {
  intent: "I want to…",
  topic: "Topic",
  resource_type: "Resource type",
  publisher: "Publisher",
  level: "Level",
};

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function recordsFromCsv(input: string): Record<string, string>[] {
  const [headers = [], ...rows] = parseCsv(input);
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
}

function pipeList(value: string): string[] {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function resourceValues(resource: Resource, dimension: Dimension): string[] {
  switch (dimension) {
    case "intent":
      return resource.intents;
    case "topic":
      return resource.topics;
    case "resource_type":
      return [resource.resourceType];
    case "publisher":
      return [resource.publisher];
    case "level":
      return [resource.level];
  }
}

function matchesSearch(resource: Resource, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = [
    resource.title,
    resource.summary,
    resource.publisher,
    resource.resourceType,
    resource.level,
    ...resource.intents,
    ...resource.topics,
    ...resource.tags,
  ]
    .join(" ")
    .toLocaleLowerCase();

  return query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

function resourceMatchesSelections(
  resource: Resource,
  selections: Selections,
  ignoredDimension?: Dimension,
): boolean {
  return DIMENSIONS.every((dimension) => {
    if (dimension === ignoredDimension) return true;
    const selected = selections[dimension];
    if (selected.length === 0) return true;
    const values = resourceValues(resource, dimension);
    return selected.some((value) => values.includes(value));
  });
}

function parseInitialSelections(): { query: string; selections: Selections } {
  if (typeof window === "undefined") {
    return { query: "", selections: EMPTY_SELECTIONS };
  }

  const parameters = new URLSearchParams(window.location.search);
  const selections = { ...EMPTY_SELECTIONS };
  for (const dimension of DIMENSIONS) {
    selections[dimension] = pipeList(parameters.get(dimension) ?? "");
  }
  return { query: parameters.get("q") ?? "", selections };
}

function sourceMark(resource: Resource): string {
  const marks: Record<string, string> = {
    Documentation: "DOC",
    Guide: "HOW",
    Course: "101",
    Article: "READ",
    Video: "PLAY",
    Tool: "TRY",
    GitHub: "CODE",
    Directory: "FIND",
    Conversation: "CHAT",
  };
  return marks[resource.resourceType] ?? "LINK";
}

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [taxonomy, setTaxonomy] = useState<TaxonomyItem[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<CategoryOrder[]>([]);
  const [query, setQuery] = useState("");
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [visibleCount, setVisibleCount] = useState<number>(
    siteConfig.initialResultCount,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterShellRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initial = parseInitialSelections();
    const urlStateFrame = window.requestAnimationFrame(() => {
      setQuery(initial.query);
      setSelections(initial.selections);
      setUrlStateReady(true);
    });

    Promise.all([
      fetch(`${basePath}/data/resources.csv`).then((response) => {
        if (!response.ok) throw new Error("Resources could not be loaded.");
        return response.text();
      }),
      fetch(`${basePath}/data/taxonomy.csv`).then((response) => {
        if (!response.ok) throw new Error("Filters could not be loaded.");
        return response.text();
      }),
      fetch(`${basePath}/data/resource_category_order.csv`).then((response) => {
        if (!response.ok) throw new Error("Resource ordering could not be loaded.");
        return response.text();
      }),
    ])
      .then(([resourceCsv, taxonomyCsv, orderCsv]) => {
        setResources(
          recordsFromCsv(resourceCsv).map((record) => ({
            id: record.id,
            title: record.title,
            url: record.url,
            summary: record.summary,
            publisher: record.publisher,
            resourceType: record.resource_type,
            level: record.level,
            rating: record.rating ? Number(record.rating) : null,
            featured: record.featured.toLowerCase() === "true",
            status: record.status,
            exclude: record.exclude.toLowerCase() === "true",
            intents: pipeList(record.intents),
            topics: pipeList(record.topics),
            tags: pipeList(record.tags),
            verifiedOn: record.verified_on,
          })),
        );
        setTaxonomy(
          recordsFromCsv(taxonomyCsv).map((record) => ({
            dimension: record.dimension as Dimension,
            value: record.value,
            label: record.label,
            description: record.description,
            displayOrder: Number(record.display_order),
            enabled: record.enabled.toLowerCase() === "true",
          })),
        );
        setCategoryOrder(
          recordsFromCsv(orderCsv).map((record) => ({
            resourceId: record.resource_id,
            dimension: record.dimension as Dimension | "all",
            categoryValue: record.category_value,
            displayOrder: Number(record.display_order),
          })),
        );
        setLoading(false);
      })
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "The resource library could not be loaded.",
        );
        setLoading(false);
      });

    return () => window.cancelAnimationFrame(urlStateFrame);
  }, []);

  useEffect(() => {
    if (!urlStateReady || typeof window === "undefined") return;
    const parameters = new URLSearchParams();
    if (query.trim()) parameters.set("q", query.trim());
    for (const dimension of DIMENSIONS) {
      if (selections[dimension].length > 0) {
        parameters.set(dimension, selections[dimension].join("|"));
      }
    }
    const nextUrl = `${window.location.pathname}${
      parameters.size > 0 ? `?${parameters.toString()}` : ""
    }`;
    window.history.replaceState(null, "", nextUrl);
  }, [query, selections, urlStateReady]);

  useEffect(() => {
    if (!filterOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setFilterOpen(false);
      filterTriggerRef.current?.focus();
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !filterShellRef.current?.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [filterOpen]);

  const published = useMemo(
    () =>
      resources.filter(
        (resource) => resource.status === "published" && !resource.exclude,
      ),
    [resources],
  );

  const featured = useMemo(
    () =>
      published
        .filter((resource) => resource.featured)
        .sort(
          (left, right) =>
            (right.rating ?? -1) - (left.rating ?? -1) ||
            left.title.localeCompare(right.title),
        ),
    [published],
  );

  const filtered = useMemo(() => {
    const activeCategories = DIMENSIONS.flatMap((dimension) =>
      selections[dimension].map((value) => ({ dimension, value })),
    );

    const rankFor = (resource: Resource) => {
      const matchingRanks = categoryOrder
        .filter(
          (entry) =>
            entry.resourceId === resource.id &&
            (entry.dimension === "all" ||
              activeCategories.some(
                (active) =>
                  active.dimension === entry.dimension &&
                  active.value === entry.categoryValue,
              )),
        )
        .map((entry) => entry.displayOrder);
      return matchingRanks.length > 0 ? Math.min(...matchingRanks) : Infinity;
    };

    return published
      .filter(
        (resource) =>
          matchesSearch(resource, query) &&
          resourceMatchesSelections(resource, selections),
      )
      .sort((left, right) => {
        if (activeCategories.length > 0) {
          const leftRank = rankFor(left);
          const rightRank = rankFor(right);
          if (leftRank !== rightRank) return leftRank - rightRank;
        }
        return (
          (right.rating ?? -1) - (left.rating ?? -1) ||
          Number(right.featured) - Number(left.featured) ||
          left.title.localeCompare(right.title)
        );
      });
  }, [published, query, selections, categoryOrder]);

  const optionsByDimension = useMemo(() => {
    return Object.fromEntries(
      DIMENSIONS.map((dimension) => [
        dimension,
        taxonomy
          .filter((item) => item.dimension === dimension && item.enabled)
          .sort(
            (left, right) =>
              left.displayOrder - right.displayOrder ||
              left.label.localeCompare(right.label),
          ),
      ]),
    ) as Record<Dimension, TaxonomyItem[]>;
  }, [taxonomy]);

  const activeChips = DIMENSIONS.flatMap((dimension) =>
    selections[dimension].map((value) => ({
      dimension,
      value,
      label:
        taxonomy.find(
          (item) => item.dimension === dimension && item.value === value,
        )?.label ?? value,
    })),
  );

  function optionCount(dimension: Dimension, value: string): number {
    return published.filter(
      (resource) =>
        matchesSearch(resource, query) &&
        resourceMatchesSelections(resource, selections, dimension) &&
        resourceValues(resource, dimension).includes(value),
    ).length;
  }

  function toggleSelection(dimension: Dimension, value: string) {
    setVisibleCount(siteConfig.initialResultCount);
    setSelections((current) => {
      const selected = current[dimension];
      return {
        ...current,
        [dimension]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  }

  function clearFilters() {
    setVisibleCount(siteConfig.initialResultCount);
    setQuery("");
    setSelections(EMPTY_SELECTIONS);
  }

  function removeChip(dimension: Dimension, value: string) {
    setVisibleCount(siteConfig.initialResultCount);
    setSelections((current) => ({
      ...current,
      [dimension]: current[dimension].filter((item) => item !== value),
    }));
  }

  function updateQuery(value: string) {
    setVisibleCount(siteConfig.initialResultCount);
    setQuery(value);
  }

  return (
    <main>
      <SiteHeader
        variant="site"
        homeHref="#top"
        homeLabel="Agent Skills Resource Library"
        linksHref="#library"
      />

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <h1>
            Find the right guidance for <span className="hero-title-accent">AI agent skills</span>.
          </h1>
          <p className="hero-intro">
            Learn what skills are, build reliable workflows, troubleshoot what
            breaks, and evaluate whether they actually improve results.
          </p>
          <a
            className="hero-download-link"
            href={`${basePath}/data/resources.csv`}
            download="agent-skills-resource-library.csv"
          >
            Download all resources (CSV) <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-artifact" aria-hidden="true">
          <span>SKILL</span>
          <strong>.md</strong>
        </div>
      </section>

      <section className="guides-promo" aria-labelledby="guides-promo-heading">
        <div>
          <h2 id="guides-promo-heading">Go deeper with original guides.</h2>
          <p>
            The library collects useful resources. Guides are where we unpack
            the judgment, trade-offs, and engineering work behind them.
          </p>
        </div>
        <a className="guides-promo-link" href={`${basePath}/guides`}>
          Explore guides <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div>
            <h2 id="featured-heading">Start here</h2>
          </div>
          <p>{featuredIntro(featured.length)}</p>
        </div>
        <div className="featured-grid">
          {featured.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              featured
              sequence={index + 1}
            />
          ))}
        </div>
      </section>

      <section className="library-section" id="library" aria-labelledby="library-heading">
        <div className="library-heading-row">
          <div>
            <h2 id="library-heading">Skills library</h2>
          </div>
          <p>
            Curated for novices, with primary sources prioritized and
            platform-specific advice labeled.
          </p>
        </div>

        <div className="search-panel">
          <label htmlFor="resource-search">Search the library</label>
          <div className="search-controls">
            <div className="search-field-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                id="resource-search"
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search skills, tools, use cases, or questions…"
              />
              {query && (
                <button
                  className="search-clear"
                  type="button"
                  onClick={() => updateQuery("")}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="filter-shell" ref={filterShellRef}>
              <button
                ref={filterTriggerRef}
                className="filter-trigger"
                type="button"
                onClick={() => setFilterOpen((current) => !current)}
                aria-expanded={filterOpen}
                aria-controls="resource-filter-panel"
                aria-label={`Filter resources${
                  activeChips.length > 0
                    ? `, ${activeChips.length} active`
                    : ""
                }`}
              >
                <span className="filter-icon" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {activeChips.length > 0 && (
                  <span className="filter-count" aria-hidden="true">
                    {activeChips.length}
                  </span>
                )}
              </button>
              {filterOpen && (
                <aside
                  className="filter-panel"
                  id="resource-filter-panel"
                  aria-label="Resource filters"
                >
                  <div className="filters-title-row">
                    <div>
                      <h3>Filter resources</h3>
                      <p>Narrow the catalog by what you need.</p>
                    </div>
                    <button
                      className="filter-close"
                      type="button"
                      onClick={() => {
                        setFilterOpen(false);
                        filterTriggerRef.current?.focus();
                      }}
                      aria-label="Close filters"
                    >
                      ×
                    </button>
                  </div>
                  <div className="filter-groups">
                    {DIMENSIONS.map((dimension) => (
                      <details
                        className="filter-group"
                        key={dimension}
                        open={dimension === "intent" || dimension === "topic"}
                      >
                        <summary>{DIMENSION_TITLES[dimension]}</summary>
                        <div className="filter-options">
                          {optionsByDimension[dimension]?.map((option) => {
                            const count = optionCount(dimension, option.value);
                            return (
                              <label
                                className={
                                  count === 0
                                    ? "filter-option is-empty"
                                    : "filter-option"
                                }
                                key={option.value}
                                title={option.description}
                              >
                                <input
                                  type="checkbox"
                                  checked={selections[dimension].includes(
                                    option.value,
                                  )}
                                  disabled={
                                    count === 0 &&
                                    !selections[dimension].includes(option.value)
                                  }
                                  onChange={() =>
                                    toggleSelection(dimension, option.value)
                                  }
                                />
                                <span>{option.label}</span>
                                <small>{count}</small>
                              </label>
                            );
                          })}
                        </div>
                      </details>
                    ))}
                  </div>
                  <div className="filter-panel-footer">
                    <button type="button" onClick={clearFilters}>
                      Reset filters
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterOpen(false);
                        filterTriggerRef.current?.focus();
                      }}
                    >
                      Show {filtered.length}{" "}
                      {filtered.length === 1 ? "resource" : "resources"}
                    </button>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            <span>Filtering by</span>
            {activeChips.map((chip) => (
              <button
                type="button"
                key={`${chip.dimension}-${chip.value}`}
                onClick={() => removeChip(chip.dimension, chip.value)}
                aria-label={`Remove ${chip.label} filter`}
              >
                {chip.label} <span aria-hidden="true">×</span>
              </button>
            ))}
            <button className="clear-all" type="button" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        )}

        <div className="results">
          <div className="results-meta" aria-live="polite">
            <p>
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "resource" : "resources"}
            </p>
            <span>Curated order · rating highest first</span>
          </div>

          {loading && (
            <div className="library-message" role="status">
              Loading the resource library…
            </div>
          )}
          {error && (
            <div className="library-message is-error" role="alert">
              <strong>Something went wrong.</strong>
              <span>{error} Refresh the page to try again.</span>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="library-message">
              <strong>No resources match that combination yet.</strong>
              <span>Try a broader search or clear one of your filters.</span>
              <button type="button" onClick={clearFilters}>
                Reset the library
              </button>
            </div>
          )}

          <div className="resource-grid">
            {filtered.slice(0, visibleCount).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <button
              className="show-more"
              type="button"
              onClick={() =>
                setVisibleCount((count) => count + siteConfig.resultIncrement)
              }
            >
              Show more resources
              <span>
                {Math.min(
                  siteConfig.resultIncrement,
                  filtered.length - visibleCount,
                )}{" "}
                more
              </span>
            </button>
          )}
        </div>
      </section>

      <footer>
        <p>Agent Skills Resource Library</p>
        <p>
          Resource links lead to their original publishers. Verify third-party
          skills before installing or running them.
        </p>
      </footer>
    </main>
  );
}

function ResourceCard({
  resource,
  featured = false,
  sequence,
}: {
  resource: Resource;
  featured?: boolean;
  sequence?: number;
}) {
  const isInternal = resource.url.startsWith("/");
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const resourceUrl = isInternal ? `${basePath}${resource.url}` : resource.url;
  const coverImage = CARD_COVER_IMAGES[resource.id];

  return (
    <details
      className={`resource-card publisher-${resource.publisher
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")}${featured ? " is-featured" : ""}`}
    >
      <summary
        className="card-summary"
        aria-label={`Toggle details for ${resource.title}, ${resource.resourceType} from ${resource.publisher}`}
      >
        <div className={`card-visual${coverImage ? " has-cover" : ""}`}>
          {sequence && <span className="card-sequence">0{sequence}</span>}
          {coverImage ? (
            <img
              className="card-cover"
              src={`${basePath}${coverImage}`}
              alt=""
              decoding="async"
            />
          ) : (
            <span className="source-mark">{sourceMark(resource)}</span>
          )}
          <span className="card-expand-icon" aria-hidden="true" />
        </div>
        <div className="card-content">
          <div className="card-kicker">
            <span>{resource.resourceType}</span>
            <span>{resource.publisher}</span>
          </div>
          <h3>{resource.title}</h3>
          <p className="card-description">{resource.summary}</p>
          <div className="card-footer">
            <div className="card-tags" aria-label="Resource tags">
              {resource.tags.slice(0, 2).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="card-end">
              {siteConfig.showRatings && resource.rating !== null && (
                <span
                  className="rating"
                  aria-label={`Rating ${resource.rating.toFixed(1)} out of 5`}
                >
                  ★ {resource.rating.toFixed(1)}
                </span>
              )}
              <span className="card-expand-copy" aria-hidden="true">
                <span className="when-closed">Explore details</span>
                <span className="when-open">Close details</span>
              </span>
            </div>
          </div>
        </div>
      </summary>
      <div className="card-action">
        <a
          className="resource-link"
          href={resourceUrl}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noreferrer"}
          aria-label={
            isInternal
              ? `Read ${resource.title}`
              : `See ${resource.title} (opens in a new tab)`
          }
        >
          <span>{isInternal ? "Read Guide" : "See Resource"}</span>
          <span aria-hidden="true">{isInternal ? "→" : "↗"}</span>
        </a>
      </div>
    </details>
  );
}
