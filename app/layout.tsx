import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Agent Skills Resource Library",
  description:
    "A searchable, novice-friendly library for learning, building, troubleshooting, and evaluating agent skills.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: `${basePath}/favicon.png`,
    shortcut: `${basePath}/favicon.png`,
  },
  openGraph: {
    title: "Agent Skills Resource Library",
    description: "Learn, build, troubleshoot, and evaluate agent skills.",
    images: [`${basePath}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Skills Resource Library",
    description: "Learn, build, troubleshoot, and evaluate agent skills.",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
