import type { ReactNode } from "react";
import { GuideTableOfContents, type GuideContentsItem } from "./table-of-contents";

export function GuideReadingLayout({
  children,
  className = "",
  contents,
  path,
}: {
  children: ReactNode;
  className?: string;
  contents: GuideContentsItem[];
  path: string;
}) {
  return (
    <div className={`guide-reading-layout ${className}`.trim()}>
      <aside className="guide-toc-rail">
        <GuideTableOfContents items={contents} path={path} />
      </aside>
      <div className="guide-reading-content">{children}</div>
    </div>
  );
}
