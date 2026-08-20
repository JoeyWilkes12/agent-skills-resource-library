"use client";

import { useEffect, useId, useRef, useState } from "react";

export type GuideContentsItem = {
  id: string;
  label: string;
};

export function GuideTableOfContents({
  items,
  className = "",
  path,
}: {
  items: GuideContentsItem[];
  className?: string;
  path: string;
}) {
  const contentsId = useId();
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isCompact, setIsCompact] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const activeIndex = Math.max(
    items.findIndex((item) => item.id === activeId),
    0,
  );
  const activeItem = items[activeIndex];
  const isCollapsed = isCompact && !isExpanded;

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const selectHashTarget = () => {
      const hashTarget = window.location.hash.slice(1);
      if (items.some((item) => item.id === hashTarget)) {
        setActiveId(hashTarget);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    selectHashTarget();
    window.addEventListener("hashchange", selectHashTarget);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", selectHashTarget);
    };
  }, [items]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1180px)");
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const updateForViewport = () => {
      if (!desktopQuery.matches) {
        setIsCompact(false);
        setIsExpanded(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!desktopQuery.matches || navRef.current?.contains(document.activeElement)) return;

        const compact = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsCompact(compact);
        setIsExpanded(!compact);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    desktopQuery.addEventListener("change", updateForViewport);
    updateForViewport();

    return () => {
      observer.disconnect();
      desktopQuery.removeEventListener("change", updateForViewport);
    };
  }, []);

  return (
    <>
      <div className="guide-contents-sentinel" ref={sentinelRef} aria-hidden="true" />
      <nav
        aria-label="Guide sections"
        className={`guide-contents ${isCompact ? "is-compact" : ""} ${
          isExpanded ? "is-expanded" : ""
        } ${className}`.trim()}
        ref={navRef}
      >
        <p className="guide-contents-heading">On this page</p>
        <button
          aria-controls={contentsId}
          aria-expanded={!isCollapsed}
          aria-label={`${isCollapsed ? "Show" : "Hide"} table of contents. Current section: ${
            activeItem?.label ?? "Guide sections"
          }`}
          className="guide-contents-toggle"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          type="button"
        >
          <span className="guide-contents-toggle-current">
            {activeItem?.label ?? "On this page"}
          </span>
          <span aria-hidden="true" className="guide-contents-toggle-status">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <span aria-hidden="true">{isCollapsed ? "Show" : "Hide"}</span>
        </button>
        <ol className="guide-contents-list" hidden={isCollapsed} id={contentsId}>
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                aria-current={item.id === activeId ? "location" : undefined}
                href={`${path}#${item.id}`}
              >
                <span aria-hidden="true" className="guide-contents-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
