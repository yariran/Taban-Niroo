import { memo } from "react";
import { m, useReducedMotion } from "motion/react";

import type { InteractiveCountryKey } from "./country-data";
import { MARKET_ROUTES } from "./map-geometry";
import styles from "./industrial-world-map.module.css";

type MarketRoutesProps = {
  activeCountryKey: InteractiveCountryKey | null;
  engagedCountryKey: InteractiveCountryKey | null;
};

/**
 * Supply routes from the home country to every market.
 *
 * They are drawn at rest, faintly, because the section is a locked
 * viewport that otherwise says nothing until someone clicks: eleven
 * unconnected dots are a chart, and the arcs are what make it a claim
 * about where the product goes. Emphasis follows hover and selection, so
 * picking a market also traces its line back to the origin.
 *
 * The reveal runs once on mount — `pathLength` from 0 to 1 draws each
 * arc outward from the origin — rather than looping. A permanent
 * animation here would compete with the markers for attention and never
 * stop costing compositor work.
 */
function MarketRoutesComponent({
  activeCountryKey,
  engagedCountryKey,
}: MarketRoutesProps) {
  const reduceMotion = useReducedMotion();

  return (
    <g pointerEvents="none" aria-hidden="true">
      {MARKET_ROUTES.map((route, index) => {
        const isLit =
          route.key === activeCountryKey || route.key === engagedCountryKey;

        return (
          <m.path
            key={`route-${route.key}`}
            d={route.d}
            className={`${styles.routeArc} ${isLit ? styles.routeArcLit : ""}`}
            initial={
              reduceMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: reduceMotion ? 0 : 1.1,
                delay: reduceMotion ? 0 : 0.25 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : 0.25 + index * 0.08,
              },
            }}
          />
        );
      })}
    </g>
  );
}

export const MarketRoutes = memo(MarketRoutesComponent);
