"use client";

import { useElementParallax } from "@/lib/use-element-parallax";

/**
 * Mount the global per-element parallax engine. Renders nothing — just
 * an effect host. Sits inside `<HomeSnapProvider>` on the home page so
 * the engine activates only when the cinematic home composition is on
 * screen, not on form-heavy inner pages where parallax would distract.
 */
export function ParallaxRuntime() {
  useElementParallax();
  return null;
}
