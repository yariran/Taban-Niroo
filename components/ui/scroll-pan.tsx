"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type ScrollPanProps = {
  children: ReactNode;
  className?: string;
  /**
   * Inner padding applied to the scroll container — kept on this wrapper
   * so consumers don't have to know about the inner div.
   */
  innerClassName?: string;
  /**
   * Background colour for the edge fade gradients. Defaults to the page
   * background. Useful when wrapping a table inside a card with a
   * different surface — pass e.g. "from-card" / "to-card".
   */
  fadeFrom?: string;
  /** Optional aria-label for the scrollable region. */
  ariaLabel?: string;
  /** When false, no edge fade overlays (e.g. full-bleed photo rails). */
  edgeFades?: boolean;
  /**
   * When true, vertical wheel / trackpad scroll passes through to the page
   * (or a parent scroll area such as a modal). Horizontal pan stays on
   * this container. Use for wide datasheet tables and photo rails.
   */
  passVerticalScroll?: boolean;
};

/**
 * User-friendly scrollable container — for wide tables and horizontal
 * spec strips.
 *
 * Why this exists:
 *   The site uses Lenis for smooth page scroll. Lenis intercepts wheel
 *   events on the document, which fights any native overflow-x-auto
 *   container — the user scrolls *over* a table and the page moves
 *   instead. `data-lenis-prevent` already tells Lenis to step aside, but
 *   the discoverability problem remains: with default Tailwind, the
 *   horizontal scrollbar is invisible until hovered, so users don't even
 *   realise the table can be panned.
 *
 * What it adds:
 *   • Visible thin scrollbar (custom WebKit + Firefox styles).
 *   • Click-and-drag to pan (mouse only — touch already works).
 *     The drag also handles vertical scrollTop if the wrapper allows it.
 *   • Soft edge fade overlays that fade in only when content actually
 *     overflows in that direction — no decoration when not needed.
 *   • `data-lenis-prevent` + `overscroll-contain` so smooth-scroll and
 *     scroll-chaining don't fight the user.
 *   • iOS momentum scroll via `-webkit-overflow-scrolling: touch`.
 *
 * What it deliberately doesn't do:
 *   • Translate vertical wheel into horizontal scroll. That pattern
 *     traps users on the table — they have to pan to the end before
 *     they can continue down the page. Visible scrollbar + drag is
 *     enough discoverability without taking control away.
 */
export function ScrollPan({
  children,
  className,
  innerClassName,
  fadeFrom = "from-background",
  ariaLabel,
  edgeFades = true,
  passVerticalScroll = false,
}: ScrollPanProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setShowLeftFade(scrollLeft > 4);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  // Sync fades on scroll, resize, and content changes.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    updateFades();
    node.addEventListener("scroll", updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(node);
    // Also observe the inner content so fades update when rows change.
    const child = node.firstElementChild;
    if (child) ro.observe(child);
    return () => {
      node.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [updateFades]);

  // Click-and-drag panning. Pointer events handle mouse + pen uniformly
  // and ignore touch (touch already pans natively on overflow-* nodes).
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let isDown = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    const DRAG_THRESHOLD = 6;

    const onPointerDown = (e: PointerEvent) => {
      // Only react to primary mouse / pen — let touch use native scroll.
      if (e.pointerType === "touch" || e.button !== 0) return;
      // Don't hijack form fields or interactive controls inside the table.
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, input, select, textarea, [data-no-drag]",
        )
      ) {
        return;
      }
      isDown = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = node.scrollLeft;
      startScrollTop = node.scrollTop;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
        try {
          node.setPointerCapture(e.pointerId);
        } catch {
          // pointerCapture can throw on detached elements — ignore.
        }
        node.style.cursor = "grabbing";
        node.style.userSelect = "none";
      }
      if (dragging) {
        node.scrollLeft = startScrollLeft - dx;
        node.scrollTop = startScrollTop - dy;
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (dragging) {
        try {
          node.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        node.style.cursor = "";
        node.style.userSelect = "";
        // Suppress the click that pointerup would synthesize so a drag
        // doesn't accidentally activate a link/button under the cursor.
        const onClickCapture = (ev: Event) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        window.addEventListener("click", onClickCapture, {
          capture: true,
          once: true,
        });
        // Belt-and-braces — remove the listener after the next tick in
        // case no click was actually fired.
        window.setTimeout(() => {
          window.removeEventListener("click", onClickCapture, {
            capture: true,
          } as EventListenerOptions);
        }, 50);
      }
      isDown = false;
      dragging = false;
    };

    node.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div className={cn("relative isolate", className)}>
      {edgeFades && (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent transition-opacity duration-200",
              fadeFrom,
              showLeftFade ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent transition-opacity duration-200",
              fadeFrom,
              showRightFade ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      )}

      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          "scroll-pan-bar cursor-grab",
          passVerticalScroll
            ? "overflow-x-auto overflow-y-visible overscroll-x-contain overscroll-y-auto"
            : "overflow-auto overscroll-contain",
          innerClassName,
        )}
        {...(!passVerticalScroll && { "data-lenis-prevent": true })}
        style={
          {
            // iOS momentum scroll — newer browsers ignore this prefix
            // gracefully so it's safe to keep for the older WebKit cases
            // that still rely on it.
            WebkitOverflowScrolling: "touch",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
