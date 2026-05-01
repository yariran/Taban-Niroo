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

    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const vh = window.innerHeight || 1;
      const vc = vh / 2;
      const els = document.querySelectorAll<HTMLElement>("[data-parallax]");
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "1");
        if (!Number.isFinite(speed) || speed === 1) {
          el.style.transform = "translate3d(0, 0, 0)";
          return;
        }
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = (center - vc) * (speed - 1) * 0.18;
        const clamped = Math.max(-MAX_DRIFT_PX, Math.min(MAX_DRIFT_PX, offset));
        el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
      });
    };

    const schedule = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf != null) cancelAnimationFrame(raf);
      // Clean up inline transforms so React keeps ownership of layout.
      document
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((el) => {
          el.style.transform = "";
        });
    };
  }, []);
}
