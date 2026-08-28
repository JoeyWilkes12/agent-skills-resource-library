"use client";

import { useEffect, useRef, useState } from "react";

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

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
}> = [
  { value: "system", label: "System", description: "Match your device or browser" },
  { value: "dark", label: "Dark", description: "Use the dark theme" },
  { value: "light", label: "Light", description: "Use the light theme" },
];

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
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [isOpen, setIsOpen] = useState(false);
  const themeControlsRef = useRef<HTMLDivElement>(null);

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
    const supportsEventListener = typeof systemPreference.addEventListener === "function";
    if (supportsEventListener) {
      systemPreference.addEventListener("change", handleSystemThemeChange);
    } else {
      systemPreference.addListener(handleSystemThemeChange);
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (supportsEventListener) {
        systemPreference.removeEventListener("change", handleSystemThemeChange);
      } else {
        systemPreference.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!themeControlsRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function chooseTheme(nextPreference: ThemePreference) {
    const nextTheme = nextPreference === "system" ? getSystemTheme() : nextPreference;

    applyTheme(nextTheme);
    setPreference(nextPreference);
    setIsOpen(false);

    try {
      if (nextPreference === "system") {
        window.localStorage.removeItem(themeStorageKey);
      } else {
        window.localStorage.setItem(themeStorageKey, nextPreference);
      }
    } catch {
      // The theme still works when storage is unavailable.
    }
  }

  return (
    <div className="theme-controls" ref={themeControlsRef}>
      <button
        className="theme-toggle"
        type="button"
        aria-label={isOpen ? "Close theme choices" : "Open theme choices"}
        aria-controls="theme-preference-menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Choose system, dark, or light theme"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="theme-icon theme-icon-light" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2.25v2.1M12 19.65v2.1M4.4 4.4l1.48 1.48M18.12 18.12l1.48 1.48M2.25 12h2.1M19.65 12h2.1M4.4 19.6l1.48-1.48M18.12 5.88l1.48-1.48" />
          </svg>
        </span>
        <span className="theme-icon theme-icon-dark" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20.25 15.1A8.15 8.15 0 0 1 8.9 3.75 8.16 8.16 0 1 0 20.25 15.1Z" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div
          className="theme-menu"
          id="theme-preference-menu"
          role="menu"
          aria-label="Theme preference"
        >
          <p className="theme-menu-heading">Theme preference</p>
          {themeOptions.map((option) => (
            <button
              className="theme-menu-option"
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={preference === option.value}
              onClick={() => chooseTheme(option.value)}
            >
              <span className="theme-option-copy">
                <span className="theme-option-label">{option.label}</span>
                <span className="theme-option-description">{option.description}</span>
              </span>
              {preference === option.value && (
                <svg className="theme-option-check" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}
            </button>
          ))}
        </div>
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
