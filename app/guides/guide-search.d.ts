import type { GuideCatalogEntry } from "./guide-catalog";

export type GuideSearchResult = {
  contentOnly: boolean;
  foundInside: readonly string[];
  guide: GuideCatalogEntry;
};

export function normalizeSearchText(value: string): string;

export function searchTokens(query: string): string[];

export function searchGuides(
  guides: readonly GuideCatalogEntry[],
  query: string,
): GuideSearchResult[];
