function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" className="guide-resource-link-icon" viewBox="0 0 16 16">
      <path
        d="M5 11 11 5M6 5h5v5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function GuideResourceLink({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  const label = children.trim();
  if (!label) throw new Error("GuideResourceLink requires descriptive link text.");

  return (
    <a className="guide-resource-link" href={href} rel="noreferrer" target="_blank">
      {label}
      <ExternalLinkIcon />
    </a>
  );
}
