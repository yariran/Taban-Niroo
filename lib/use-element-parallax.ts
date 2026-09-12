"use client";

import { useEffect } from "react";

/**
 * Global per-element parallax engine.
 *
 * Mounts a single `scroll`/`resize` listener on the document and walks
 * every element with a `data-parallax` attribute, translating it
 * vertically by a fraction of its distance from the viewport centre.
 * Speeds < 1 read as "behind glass" (image plates), speeds > 1 read as
 * "leaning forward" (foreground text and numbers).
 *
 * Convention:
 *   data-parallax="0.92"  → 8% slower than scroll (depth)
 *   data-parallax="0.96"  → 4% slower
 *   data-parallax="1.04"  → 4% faster (foreground)
 *   data-parallax="1.10"  → 10% faster (numbers, eyebrows)
 *
 * The engine intentionally limits itself to a small ±60px envelope so
 * layout never shifts noticeably; the goal is depth, not motion.
 *
 * Honours `prefers-reduced-motion` (no-ops) and uses a single rAF tick
 * so adding parallax to dozens of elements does not multiply listeners.
 */
const MAX_DRIFT_PX = 60;

export function useElementParallax() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    if (nodes.length === 0) return;

    if (process.env.NODE_ENV !== "production") {
      /**
       * Two mistakes this engine makes silently, both of which shipped
       * before and were invisible until someone looked at the DOM:
       *
       * 1. A `data-parallax` node containing a `position: sticky`
       *    descendant — the per-frame transform drags the sticky subtree.
       * 2. A `data-parallax` node that is also a reveal primitive, which
       *    writes its own inline `transform`. Last writer wins, so one of
       *    the two effects vanishes with no error. Always wrap instead.
       */
      nodes.forEach((el) => {
        if (el.querySelector('[class*="sticky"]')) {
          console.warn(
            "[parallax] node contains a sticky descendant; the drift will drag it:",
            el,
          );
        }
        if (el.dataset.imageReveal !== undefined) {
          console.warn(
            "[parallax] node is also an ImageReveal; transforms will clobber. Wrap it instead:",
            el,
          );
        }
      });
      if (nodes.length > 8) {
        console.warn(
          `[parallax] ${nodes.length} elements opted in; budget is 8. Each costs a forced layout per scroll frame.`,
        );
      }
    }

    /**
     * Only measure what is on screen. The engine used to read a
     * `getBoundingClientRect` for every opted-in node on every scroll
     * frame — a forced synchronous layout per node — which is fine at six
     * and a jank source at forty.
     */
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(el);
          else visible.delete(el);
        });
        schedule();
      },
      { rootMargin: "10% 0px" },
    );
    nodes.forEach((el) => io.observe(el));

    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const vh = window.innerHeight || 1;
      const vc = vh / 2;
      visible.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "1");
        if (!Number.isFinite(speed) || speed === 1) {
          el.style.transform = "translate3d(0, 0, 0)";
          return;
        }
        // Per-element clamp for media inside an `overflow-hidden` frame,
        // where the default envelope would expose an edge band.
        const maxDrift = Number.parseFloat(
          el.dataset.parallaxMax ?? String(MAX_DRIFT_PX),
        );
        const limit = Number.isFinite(maxDrift) ? maxDrift : MAX_DRIFT_PX;

        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = (center - vc) * (speed - 1) * 0.18;
        const clamped = Math.max(-limit, Math.min(limit, offset));
        el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
      });
    };

    function schedule() {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      io.disconnect();
      if (raf != null) cancelAnimationFrame(raf);
      // Clean up inline transforms so React keeps ownership of layout.
      nodes.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);
}
