export const RESOURCE_SORTS = [
  "curated",
  "rating-asc",
  "rating-desc",
  "added-asc",
  "added-desc",
];

export function parseResourceSort(value) {
  return RESOURCE_SORTS.includes(value) ? value : "curated";
}

function ratingValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
    ? timestamp
    : null;
}

function compareKnownValues(left, right, direction) {
  // Missing or malformed values stay at the end in either direction.
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  return (left - right) * direction;
}

function compareIdentity(left, right) {
  return (
    left.title.localeCompare(right.title, "en") ||
    left.id.localeCompare(right.id, "en")
  );
}

export function sortResources(resources, sort, curatedRank) {
  const selectedSort = parseResourceSort(sort);
  return [...resources].sort((left, right) => {
    if (selectedSort.startsWith("rating-")) {
      return (
        compareKnownValues(
          ratingValue(left.rating),
          ratingValue(right.rating),
          selectedSort === "rating-asc" ? 1 : -1,
        ) || compareIdentity(left, right)
      );
    }

    if (selectedSort.startsWith("added-")) {
      return (
        compareKnownValues(
          dateValue(left.addedOn),
          dateValue(right.addedOn),
          selectedSort === "added-asc" ? 1 : -1,
        ) || compareIdentity(left, right)
      );
    }

    if (curatedRank) {
      const leftRank = curatedRank(left);
      const rightRank = curatedRank(right);
      if (leftRank !== rightRank) return leftRank - rightRank;
    }

    return (
      compareKnownValues(ratingValue(left.rating), ratingValue(right.rating), -1) ||
      Number(right.featured) - Number(left.featured) ||
      compareIdentity(left, right)
    );
  });
}
