export type ResourceSort =
  | "curated"
  | "rating-asc"
  | "rating-desc"
  | "added-asc"
  | "added-desc";

type SortableResource = {
  id: string;
  title: string;
  rating: number | null;
  featured: boolean;
  addedOn: string;
};

export const RESOURCE_SORTS: readonly ResourceSort[];

export function parseResourceSort(value: string | null | undefined): ResourceSort;

export function sortResources<T extends SortableResource>(
  resources: readonly T[],
  sort: ResourceSort,
  curatedRank?: (resource: T) => number,
): T[];
