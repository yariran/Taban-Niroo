"use client";

import { useEffect } from "react";

/** Document scroll-snap for home only — swap between sections, no “card chrome”. */
export function HomeSnapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-home-snap", "true");
    return () => {
      html.removeAttribute("data-home-snap");
    };
  }, []);

  /**
   * `overflow-x-clip` belt-and-suspenders: body + html already clip but
   * some browser releases defer propagating root-level `overflow-x`
   * during the very first paint, which can leave the hero showing a
   * black right-hand gutter while section pre-states briefly extend
   * past the viewport. Clipping here guarantees containment even on
   * that first paint.
   */
  return <div className="bg-background overflow-x-clip">{children}</div>;
}
