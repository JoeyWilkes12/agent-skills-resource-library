"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

function stripCloneSemantics(root: HTMLElement) {
  root.removeAttribute("id");
  root.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  root.querySelectorAll<HTMLElement>("a, button, input, select, textarea, [tabindex]").forEach(
    (element) => element.setAttribute("tabindex", "-1"),
  );
}

export function GuideTableViewport({
  ariaLabel = "Scrollable data table",
  children,
  className,
}: {
  ariaLabel?: string;
  children: ReactNode;
  className: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const tableElement = viewportElement.querySelector<HTMLTableElement>("table");
    const sourceHeadElement = tableElement?.tHead;
    if (!tableElement || !sourceHeadElement) return;
    const activeViewport = viewportElement as HTMLDivElement;
    const activeTable = tableElement as HTMLTableElement;
    const activeHead = sourceHeadElement as HTMLTableSectionElement;

    const overlay = document.createElement("div");
    const overlayTable = activeTable.cloneNode(false) as HTMLTableElement;
    const overlayHead = activeHead.cloneNode(true) as HTMLTableSectionElement;

    overlay.className = "guide-table-sticky-overlay";
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    stripCloneSemantics(overlayHead);
    overlayTable.removeAttribute("id");
    overlayTable.appendChild(overlayHead);
    overlay.appendChild(overlayTable);
    document.body.appendChild(overlay);

    let frame = 0;

    function syncColumnWidths() {
      const sourceCells = Array.from(activeHead.rows[0]?.cells ?? []);
      const existingColumns = overlayTable.querySelector("colgroup");
      const columnGroup = document.createElement("colgroup");

      existingColumns?.remove();
      sourceCells.forEach((cell) => {
        const column = document.createElement("col");
        column.style.width = `${cell.getBoundingClientRect().width}px`;
        columnGroup.appendChild(column);
      });
      overlayTable.insertBefore(columnGroup, overlayHead);

      const tableWidth = activeTable.getBoundingClientRect().width;
      overlayTable.style.width = `${tableWidth}px`;
      overlayTable.style.minWidth = `${tableWidth}px`;
    }

    function update() {
      frame = 0;
      const viewportRect = activeViewport.getBoundingClientRect();
      const headHeight = activeHead.getBoundingClientRect().height;
      const configuredOffset = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--guide-sticky-table-offset",
        ),
      );
      const stickyOffset = Number.isFinite(configuredOffset) ? configuredOffset : 0;
      const shouldPin =
        viewportRect.top < stickyOffset && viewportRect.bottom > stickyOffset;

      activeViewport.dataset.scrollable = String(
        activeViewport.scrollWidth > activeViewport.clientWidth + 1,
      );
      overlay.hidden = !shouldPin;
      if (!shouldPin) return;

      const pinnedTop = Math.min(stickyOffset, viewportRect.bottom - headHeight);
      overlay.style.top = `${pinnedTop}px`;
      overlay.style.left = `${viewportRect.left + activeViewport.clientLeft}px`;
      overlay.style.width = `${activeViewport.clientWidth}px`;
      overlay.style.height = `${headHeight}px`;
      overlayTable.style.transform = `translateX(${-activeViewport.scrollLeft}px)`;
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    function handleResize() {
      syncColumnWidths();
      scheduleUpdate();
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(activeViewport);
    resizeObserver.observe(activeTable);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    activeViewport.addEventListener("scroll", scheduleUpdate, { passive: true });

    syncColumnWidths();
    update();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
      activeViewport.removeEventListener("scroll", scheduleUpdate);
      overlay.remove();
    };
  }, []);

  return (
    <div
      aria-label={ariaLabel}
      className={className}
      data-guide-table-viewport
      ref={viewportRef}
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
