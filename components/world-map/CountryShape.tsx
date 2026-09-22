import { memo, type CSSProperties, type KeyboardEvent } from "react";
import { m, useReducedMotion } from "motion/react";

import type { InteractiveCountryKey } from "./country-data";
import type { CountryShape as CountryShapeModel } from "./map-geometry";
import { MAP_MARKER, MAP_MOTION } from "./map-config";
import styles from "./industrial-world-map.module.css";

type CountryShapeProps = {
  shape: CountryShapeModel;
  isActive: boolean;
  isHome: boolean;
  /** Pointer is over this market, or its hit target holds keyboard focus. */
  isEngaged: boolean;
  activeHeatGradientId: string;
  homeHeatGradientId: string;
  onSelect: (country: InteractiveCountryKey) => void;
  onEngage: (country: InteractiveCountryKey | null) => void;
};

const transformStyle: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
};

function CountryShapeComponent({
  shape,
  isActive,
  isHome,
  isEngaged,
  activeHeatGradientId,
  homeHeatGradientId,
  onSelect,
  onEngage,
}: CountryShapeProps) {
  const reduceMotion = useReducedMotion();

  // ~170 of the ~180 atlas countries are backdrop. They were previously
  // wrapped in a motion group animating `scale: 1`, which is a live
  // animation subscription per landmass for no visual result.
  if (!shape.interactiveKey) {
    return <path d={shape.d} className={styles.countryBase} aria-hidden="true" />;
  }

  const countryKey = shape.interactiveKey;
  const [cx, cy] = shape.centroid;

  const selectCountry = () => onSelect(countryKey);

  const handleKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCountry();
    }
  };

  const washOpacity = isActive ? (isEngaged ? 0.28 : 0.16) : isEngaged ? 0.4 : 0;

  return (
    <g
      onPointerEnter={() => onEngage(countryKey)}
      onPointerLeave={() => onEngage(null)}
    >
      <m.g
        className={styles.countryTransform}
        initial={false}
        animate={{ scale: isActive ? MAP_MOTION.activeCountryScale : 1 }}
        transition={reduceMotion ? { duration: 0 } : MAP_MOTION.spring}
        style={transformStyle}
      >
        <path
          d={shape.d}
          className={`${styles.countryBase} ${
            isHome ? styles.countryHomeBase : styles.countryInteractiveBase
          }`}
          aria-hidden="true"
        />

        {isHome && !isActive ? (
          <>
            <m.path
              d={shape.d}
              fill={`url(#${homeHeatGradientId})`}
              className={styles.homeHeat}
              animate={
                reduceMotion
                  ? { opacity: 0.8 }
                  : { opacity: [0.58, 0.88, 0.58] }
              }
              transition={{
                duration: reduceMotion ? 0 : 3.2,
                repeat: reduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              pointerEvents="none"
            />
            <m.path
              d={shape.d}
              className={`${styles.homeBorder} ${styles.pulseLayer}`}
              animate={
                reduceMotion
                  ? { opacity: 0.7, scale: 1.02 }
                  : { opacity: [0.85, 0.3, 0], scale: [1, 1.04, 1.09] }
              }
              transition={{
                duration: reduceMotion ? 0 : 2.6,
                ease: "easeOut",
                repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
                repeatDelay: 0.35,
              }}
              style={transformStyle}
              pointerEvents="none"
            />
          </>
        ) : null}

        <m.path
          d={shape.d}
          className={styles.hoverLayer}
          initial={false}
          animate={{ opacity: washOpacity }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
          pointerEvents="none"
        />

        {isActive ? (
          <>
            <m.path
              d={shape.d}
              fill="#e3b34e"
              className={`${styles.activeHeat} ${styles.pulseLayer}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={
                reduceMotion
                  ? { opacity: 0.32, scale: 1.02 }
                  : { opacity: [0, 0.72, 0], scale: [0.94, 1.025, 1.11] }
              }
              transition={{ duration: reduceMotion ? 0 : 1.05, ease: "easeOut" }}
              style={transformStyle}
            />

            <m.path
              d={shape.d}
              fill={`url(#${activeHeatGradientId})`}
              className={styles.activeHeat}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: "easeOut" }}
              style={transformStyle}
            />

            <m.path
              d={shape.d}
              className={`${styles.activeBorder} ${styles.pulseLayer}`}
              initial={{ opacity: 0.9, scale: 1 }}
              animate={
                reduceMotion
                  ? { opacity: 0.72, scale: 1.025 }
                  : { opacity: [0.88, 0.35, 0], scale: [1, 1.05, 1.105] }
              }
              transition={{
                duration: reduceMotion ? 0 : 2.2,
                ease: "easeOut",
                repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
                repeatDelay: 0.2,
              }}
              style={transformStyle}
            />
          </>
        ) : null}
      </m.g>

      {/* Mouse target for the landmass itself — deliberately not focusable,
          so each market contributes exactly one tab stop. */}
      <path
        d={shape.d}
        className={styles.hitSurface}
        data-market={countryKey}
        onClick={selectCountry}
        aria-hidden="true"
      />

      <circle
        cx={cx}
        cy={cy}
        r={MAP_MARKER.hitRadius}
        className={styles.hitTarget}
        data-market={countryKey}
        onClick={selectCountry}
        onKeyDown={handleKeyDown}
        onFocus={() => onEngage(countryKey)}
        onBlur={() => onEngage(null)}
        role="button"
        tabIndex={0}
        aria-label={`Show ${countryKey} project details`}
        aria-pressed={isActive}
      />
    </g>
  );
}

/** Only the previous and next active countries re-render on selection. */
export const CountryShape = memo(CountryShapeComponent);
