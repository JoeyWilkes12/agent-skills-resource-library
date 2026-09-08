/**
 * Search the small editorial catalog used by the Guides index.
 *
 * Keeping normalization and matching separate makes the behavior easy to
 * exercise without a browser and keeps the client component concerned only
 * with presentation and interaction.
 */
export function normalizeSearchText(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function searchTokens(query) {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean);
}

function searchableFields(guide) {
  return {
    contentTopics: guide.contentTopics ?? [],
    summary: normalizeSearchText(guide.summary),
    title: normalizeSearchText(guide.title),
  };
}

function textMatchesToken(normalizedText, token) {
  return normalizedText.split(" ").some((word) => {
    if (word === token) return true;
    return token.length > 2 && word.startsWith(token);
  });
}

function topicMatches(topics, tokens) {
  return topics.filter((topic) => {
    const normalizedTopic = normalizeSearchText(topic);
    return tokens.some((token) => textMatchesToken(normalizedTopic, token));
  });
}

/**
 * Return direct title/summary matches before content-only matches, preserving
 * editorial order within each tier. Every query token must be found somewhere
 * in the title, summary, or curated content topics (AND matching).
 */
export function searchGuides(guides, query) {
  const tokens = searchTokens(query);

  if (tokens.length === 0) {
    if (query.trim()) return [];

    return guides.map((guide) => ({
      contentOnly: false,
      foundInside: [],
      guide,
    }));
  }

  const matches = guides.flatMap((guide) => {
    const fields = searchableFields(guide);
    const normalizedTopics = fields.contentTopics.map(normalizeSearchText);
    const normalizedFields = [
      fields.title,
      fields.summary,
      ...normalizedTopics,
    ];

    if (
      !tokens.every((token) =>
        normalizedFields.some((field) => textMatchesToken(field, token)),
      )
    ) {
      return [];
    }

    const titleAndSummary = [fields.title, fields.summary];
    const matchedTitleSummaryTokens = tokens.filter((token) =>
      titleAndSummary.some((field) => textMatchesToken(field, token)),
    );
    const contentRequiredTokens = tokens.filter(
      (token) =>
        !titleAndSummary.some((field) => textMatchesToken(field, token)),
    );
    const contentOnly = matchedTitleSummaryTokens.length === 0;

    return [
      {
        contentOnly,
        foundInside: contentRequiredTokens.length > 0
          ? topicMatches(fields.contentTopics, contentRequiredTokens).slice(0, 2)
          : [],
        guide,
      },
    ];
  });

  return matches.sort(
    (first, second) => Number(first.contentOnly) - Number(second.contentOnly),
  );
}
