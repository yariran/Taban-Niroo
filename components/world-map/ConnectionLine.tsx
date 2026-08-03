import type { RefObject } from "react";
import { m, useReducedMotion } from "motion/react";

import { useConnectionLine } from "./use-connection-line";
import styles from "./industrial-world-map.module.css";

type ConnectionLineProps = {
  rootRef: RefObject<HTMLElement | null>;
  anchorRef: RefObject<SVGCircleElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
};

export function ConnectionLine({
  rootRef,
  anchorRef,
  panelRef,
  enabled,
}: ConnectionLineProps) {
  const reduceMotion = useReducedMotion();
  const geometry = useConnectionLine({
    rootRef,
    anchorRef,
    panelRef,
    enabled,
  });

  if (!geometry) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      style={{
        left: geometry.startX,
        top: geometry.startY,
        width: geometry.length,
        transform: `translateY(-50%) rotate(${geometry.angle}deg)`,
        transformOrigin: "left center",
      }}
    >
      <m.div
        className={styles.connectionSegment}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <m.span
        className={styles.connectionParticle}
        initial={{ opacity: 0, x: 0, scale: 0.7 }}
        animate={
          reduceMotion
            ? { opacity: 0.9, x: geometry.length - 5, scale: 1 }
            : {
                opacity: [0, 1, 1, 0],
                x: [0, geometry.length * 0.35, geometry.length * 0.96],
                scale: [0.7, 1.15, 0.75],
              }
        }
        transition={{
          duration: reduceMotion ? 0 : 2.1,
          repeat: reduceMotion ? 0 : Infinity,
          repeatDelay: 0.55,
          ease: "linear",
        }}
        style={{ marginTop: -2.5 }}
      />
    </div>
  );
}
