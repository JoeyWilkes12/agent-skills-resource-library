import type { ReactNode } from "react";
import { GuideTableOfContents, type GuideContentsItem } from "./table-of-contents";

export function GuideReadingLayout({
  children,
  className = "",
  contents,
  path,
  numbered = true,
}: {
  children: ReactNode;
  className?: string;
  contents: GuideContentsItem[];
  path: string;
  numbered?: boolean;
}) {
  return (
    <div className={`guide-reading-layout ${className}`.trim()}>
      <aside className="guide-toc-rail">
        <GuideTableOfContents items={contents} path={path} numbered={numbered} />
      </aside>
      <div className="guide-reading-content">{children}</div>
    </div>
  );
}
