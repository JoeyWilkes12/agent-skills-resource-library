export type GuideContentsItem = {
  id: string;
  label: string;
};

export function GuideTableOfContents({
  items,
  className = "",
}: {
  items: GuideContentsItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Guide sections"
      className={`guide-contents ${className}`.trim()}
    >
      <p className="guide-contents-heading">On this page</p>
      <ol className="guide-contents-list">
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>
              <span aria-hidden="true" className="guide-contents-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
