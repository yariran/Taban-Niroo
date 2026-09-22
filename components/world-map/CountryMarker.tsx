import { memo } from "react";
import { m, useReducedMotion } from "motion/react";

import type { CountryShape as CountryShapeModel } from "./map-geometry";
import { MAP_MARKER } from "./map-config";
import styles from "./industrial-world-map.module.css";

/*
 * Markers and labels live in their own stacking layers, above every
 * landmass, rather than inside each country's group.
 *
 * SVG has no z-index: paint order is document order. With the label
 * nested in its own country's group, every country drawn later covered
 * it — so selecting Iran put its name under Turkey and the Caspian, and
 * the label simply disappeared. Hoisting both layers out is the only fix
 * that holds for all eleven markets regardless of atlas order.
 */

type MarkerProps = {
  shape: CountryShapeModel;
  isActive: boolean;
  isHome: boolean;
  isEngaged: boolean;
};

function CountryMarkerComponent({
  shape,
  isActive,
  isHome,
  isEngaged,
}: MarkerProps) {
  const reduceMotion = useReducedMotion();
  const [cx, cy] = shape.centroid;

  const ringRadius = isActive
    ? MAP_MARKER.ringActive
    : isEngaged
      ? MAP_MARKER.ringHover
      : MAP_MARKER.ringRest;
  const coreRadius = isActive
    ? MAP_MARKER.coreActive
    : isEngaged
      ? MAP_MARKER.coreHover
      : MAP_MARKER.coreRest;

  const transition = { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" as const };

  return (
    <g transform={`translate(${cx} ${cy})`} pointerEvents="none">
      <m.circle
        className={`${styles.markerRing} ${isHome ? styles.markerRingHome : ""}`}
        initial={false}
        animate={{
          r: ringRadius,
          opacity: isActive || isEngaged ? 1 : isHome ? 0.95 : 0.7,
        }}
        transition={transition}
      />
      <m.circle
        className={`${styles.markerCore} ${isHome ? styles.markerCoreHome : ""}`}
        initial={false}
        animate={{ r: coreRadius }}
        transition={transition}
      />
    </g>
  );
}

type LabelProps = {
  /** Solved standing position, or the marker centroid for hover-only labels. */
  placement: { x: number; y: number; anchor: "middle" | "start" | "end" };
  name: string;
  /** Always on screen, rather than appearing on hover. */
  isStanding: boolean;
  isEmphasised: boolean;
};

function CountryLabelComponent({
  placement,
  name,
  isStanding,
  isEmphasised,
}: LabelProps) {
  const reduceMotion = useReducedMotion();

  /*
    Standing labels sit back at 0.62 so eleven of them read as a quiet
    index rather than eleven competing headlines; the one under the
    cursor or under selection comes forward to full strength. Markets the
    solver could not place stay at zero until engaged.
  */
  const opacity = isEmphasised ? 1 : isStanding ? 0.62 : 0;

  return (
    <m.text
      className={styles.markerLabel}
      x={placement.x}
      y={placement.y}
      textAnchor={placement.anchor}
      initial={false}
      animate={{ opacity, y: opacity === 0 ? 4 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      pointerEvents="none"
      aria-hidden="true"
    >
      {name}
    </m.text>
  );
}

export const CountryMarker = memo(CountryMarkerComponent);
export const CountryLabel = memo(CountryLabelComponent);
