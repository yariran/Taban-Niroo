"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll provider — Lenis on fine pointers (desktop/trackpad) only.
 *
 * On phones/tablets (`pointer: coarse` / `hover: none`) we keep native
 * touch scrolling. That avoids fighting iOS Safari rubber-band, Android
 * Chrome, Samsung Internet, and nested horizontal pans (gallery, tables).
 */
export function LenisProvider() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");

    if (reduceMotion.matches || coarsePointer.matches || noHover.matches) {
      return;
    }

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      // Snappier, even feel — avoid “glue then rush” vs sticky runways.
      duration: 0.92,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      // Touch sync off even if a hybrid device later matches — native wins.
      syncTouch: false,
    });

    // E2E + in-page nav helpers; cleared on teardown.
    (
      window as Window & { __tnLenis?: typeof lenis }
    ).__tnLenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const node = document.querySelector(href);
      if (!node) return;
      e.preventDefault();
      const headerOffset = window.innerWidth >= 768 ? 96 : 80;
      lenis.scrollTo(node as HTMLElement, {
        offset: -headerOffset,
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      /**
       * `preventDefault` above stops the browser from writing the hash, so
       * anchors were unshareable and in-page nav could never mark itself
       * active. `replaceState` (not `pushState`) keeps Back leaving the page
       * instead of walking backwards through every anchor visited.
       */
      window.history.replaceState(null, "", href);
      /** `replaceState` is silent — in-page navs listen for this to re-read. */
      window.dispatchEvent(new Event("hashchange"));
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      const w = window as Window & { __tnLenis?: typeof lenis };
      if (w.__tnLenis === lenis) delete w.__tnLenis;
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return null;
}
