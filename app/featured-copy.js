const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five"];

export function featuredIntro(count) {
  const countLabel = NUMBER_WORDS[count] ?? String(count);
  const pointLabel = count === 1 ? "point" : "points";
  return `${countLabel} high-value starting ${pointLabel} before you explore the full catalog.`;
}
