export const siteConfig = {
  showRatings: process.env.NEXT_PUBLIC_SHOW_RATINGS === "true",
  initialResultCount: 12,
  resultIncrement: 12,
} as const;
