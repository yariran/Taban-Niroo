"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { COMPANY_CHAPTERS } from "@/lib/company-chapters";

/**
 * Company page chapter index — the contents strip at the top of the route.
 *
 * The primary nav exposes a single "Company" entry; the five chapters of
 * that story live on one route and are reached from here.
 *
 * Deliberately NOT a rounded glass pill: the site header is already a
 * floating pill, and repeating that shape directly beneath it read as a
 * second navbar. This is a different register — a full-width contents
 * strip ruled by hairlines top and bottom, no fill, no corners, no
 * elevation. It belongs to the page the way a chapter list belongs to a
 * book, and the active chapter is marked by an indicator sitting on the
 * bottom rule rather than by a filled chip.
 *
 * Deliberately NOT sticky and NOT a scroll-spy. It scrolls away with the
 * top of the page, so a scroll-driven active state would only ever be
 * visible while the first chapter is on screen. `ChapterRail` (right-side
 * hairlines, desktop only) already owns persistent scroll-position
 * feedback; a second indicator here would just compete with it. Active
 * state reflects the URL hash, so a shared/deep link reads back correctly.
 *
 * Anchors are plain `href="#id"` links so the global Lenis handler
 * (desktop) and `scroll-margin-top` (touch) already own the scroll.
 */

/** Current `#hash` without the `#`. Empty during SSR and first paint. */
function useCurrentHash(): string {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace("#", ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return hash;
}

export function CompanyChapterIndex({ className }: { className?: string }) {
  const activeId = useCurrentHash();

  return (
    <nav
      aria-label="Company chapters"
      className={cn("border-y border-border", className)}
    >
      <ul className="flex flex-wrap items-stretch gap-x-7 md:gap-x-10 lg:gap-x-12">
        {COMPANY_CHAPTERS.map((chapter) => {
          const isActive = activeId === chapter.id;
          return (
            <li key={chapter.id} className="min-w-0">
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "touch-target group relative flex min-h-11 items-center py-3.5",
                  "text-[13px] font-medium leading-5 tracking-[-0.005em]",
                  "transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {chapter.label}
                {/* Indicator rides the strip's bottom rule — the "tab" read,
                    as opposed to the header pill's filled-chip read. */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-brand-orange",
                    "transition-transform duration-300 ease-[var(--ease-standard)]",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
