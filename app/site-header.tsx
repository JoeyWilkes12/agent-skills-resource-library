"use client";

import { useState } from "react";

type CurrentSection = "guides" | "about";

type SiteHeaderProps = {
  currentSection?: CurrentSection;
  homeHref?: string;
  homeLabel?: string;
  linksHref?: string;
  variant?: "site" | "guide";
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteHeader({
  currentSection,
  homeHref = `${basePath}/`,
  homeLabel = "Back to the library",
  linksHref = `${basePath}/#library`,
  variant = "guide",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className={variant === "site" ? "site-header" : "guide-header"}>
      <a className="wordmark" href={homeHref} aria-label={homeLabel}>
        <span className="wordmark-mark" aria-hidden="true">
          AS
        </span>
        <span>Agent Skills Library</span>
      </a>

      <div
        className={`header-menu${isMenuOpen ? " is-open" : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeMenu();
        }}
      >
        <button
          className="header-menu-trigger"
          type="button"
          aria-controls="primary-navigation-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close primary navigation" : "Open primary navigation"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="header-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Menu</span>
        </button>
        <nav
          className="header-menu-popover"
          id="primary-navigation-menu"
          aria-label="Primary navigation"
          hidden={!isMenuOpen}
        >
          <a className="header-menu-link" href={linksHref} onClick={closeMenu}>
            Links
          </a>
          <a
            className="header-menu-link"
            href={`${basePath}/guides`}
            aria-current={currentSection === "guides" ? "page" : undefined}
            onClick={closeMenu}
          >
            Guides
          </a>
          <a
            className="header-menu-link"
            href={`${basePath}/about`}
            aria-current={currentSection === "about" ? "page" : undefined}
            onClick={closeMenu}
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
