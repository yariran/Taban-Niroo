"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll provider — Lenis-driven inertial scroll.
 *
 * Wires `lenis` into the document scroll so wheel and trackpad input
 * decelerates with a soft easing curve instead of snapping to the OS
 * default. The library sets `html.lenis` while running so we can
 * coordinate any scroll-driven CSS that depends on whether smoothing
 * is active.
 *
 * Notes:
 *  - Native CSS smooth-scroll (`scroll-behavior: smooth`) and Lenis
 *    fight each other. While Lenis is mounted we explicitly set
 *    `html.scroll-behavior: auto` (Lenis owns the easing).
 *  - Honour `prefers-reduced-motion`: skip Lenis entirely. Native
 *    scroll is then used and feels instantaneous.
 *  - The `scroll`, `scrollend`, and `IntersectionObserver` listeners
 *    elsewhere in the app keep working — Lenis dispatches a real
 *    native `scroll` event after every internal frame, so nothing
 *    downstream needs to know it exists.
 */
export function LenisProvider() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Allow same-page anchor links (e.g. "#gallery") to use Lenis to
    // animate, so jump-links still feel cinematic.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const node = document.querySelector(href);
      if (!node) return;
      e.preventDefault();
      lenis.scrollTo(node as HTMLElement, { offset: -32, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return null;
}
