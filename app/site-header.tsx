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
type ThemePreference = Theme | "system";

function getStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(nextTheme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme(nextPreference: ThemePreference) {
      const nextTheme =
        nextPreference === "system"
          ? systemPreference.matches
            ? "dark"
            : "light"
          : nextPreference;
      applyTheme(nextTheme);
      setTheme(nextTheme);
      setPreference(nextPreference);
    }

    function syncFromStorage() {
      syncTheme(getStoredTheme() ?? "system");
    }

    function handleSystemThemeChange() {
      if (getStoredTheme() === null) syncTheme("system");
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== themeStorageKey) return;
      syncFromStorage();
    }

    syncFromStorage();
    window.addEventListener("storage", handleStorage);
    systemPreference.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      systemPreference.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    setTheme(nextTheme);
    setPreference(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }

  function useSystemTheme() {
    const nextTheme = getSystemTheme();

    applyTheme(nextTheme);
    setTheme(nextTheme);
    setPreference("system");

    try {
      window.localStorage.removeItem(themeStorageKey);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  const themeName = theme === "dark" ? "Dark" : "Light";
  const nextThemeName = nextTheme === "dark" ? "dark" : "light";
  const themeAction =
    preference === "system"
      ? `Switch to ${nextThemeName} theme and override system preference`
      : `Switch to ${nextThemeName} theme`;

  return (
    <div className="theme-controls">
      <button
        className="theme-toggle"
        type="button"
        aria-label={`${themeName} theme. ${themeAction}.`}
        aria-pressed={theme === "dark"}
        title={`${themeAction}. Current: ${themeName} (${preference === "system" ? "system" : "manual override"}).`}
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
      {preference !== "system" && (
        <button
          className="theme-system-reset"
          type="button"
          aria-label="Use system theme instead of manual override"
          title="Use system theme"
          onClick={useSystemTheme}
        >
          System
        </button>
      )}
    </div>
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
