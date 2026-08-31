export const siteConfig = {
  showRatings: process.env.NEXT_PUBLIC_SHOW_RATINGS === "true",
  showMediaFolder: process.env.NEXT_PUBLIC_SHOW_MEDIA_FOLDER !== "false",
  initialResultCount: 12,
  resultIncrement: 12,
} as const;
