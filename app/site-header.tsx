"use client";

import { useEffect, useState } from "react";

type CurrentSection = "guides" | "about";

type SiteHeaderProps = {
  currentSection?: CurrentSection;
  homeHref?: string;
  homeLabel?: string;
  linksHref?: string;
  variant?: "site" | "guide";
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const themeStorageKey = "agent-skills-theme";

type Theme = "light" | "dark";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;

    function syncTheme(nextTheme: Theme) {
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    }

    syncTheme(root.dataset.theme === "dark" ? "dark" : "light");

    function handleStorage(event: StorageEvent) {
      if (event.key !== themeStorageKey) return;
      syncTheme(event.newValue === "dark" ? "dark" : "light");
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.25v2.1M12 19.65v2.1M4.4 4.4l1.48 1.48M18.12 18.12l1.48 1.48M2.25 12h2.1M19.65 12h2.1M4.4 19.6l1.48-1.48M18.12 5.88l1.48-1.48" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20.25 15.1A8.15 8.15 0 0 1 8.9 3.75 8.16 8.16 0 1 0 20.25 15.1Z" />
        </svg>
      )}
    </button>
  );
}

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

      <div className="header-actions">
        <ThemeToggle />
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
      </div>
    </header>
  );
}
