import { memo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { m, useReducedMotion } from "motion/react";

import type { InteractiveCountryKey } from "./country-data";
import type { CountryShape as CountryShapeModel } from "./map-geometry";
import { MAP_MARKER, MAP_MOTION } from "./map-config";
import styles from "./industrial-world-map.module.css";

type CountryShapeProps = {
  shape: CountryShapeModel;
  isActive: boolean;
  isHome: boolean;
  activeHeatGradientId: string;
  homeHeatGradientId: string;
  onSelect: (country: InteractiveCountryKey) => void;
};

const transformStyle: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
};

function CountryShapeComponent({
  shape,
  isActive,
  isHome,
  activeHeatGradientId,
  homeHeatGradientId,
  onSelect,
}: CountryShapeProps) {
  const reduceMotion = useReducedMotion();

  /*
    Hover is explicit state rather than motion's `whileHover` variants.
    The landmass layers animate `scale` through their own `animate` prop,
    and a child that declares `animate` stops variant propagation — so a
    variant set on the outer group would never reach the wash path behind
    it. Keyboard focus drives the same state, which is what surfaces the
    label for tab users.
  */
  const [isEngaged, setIsEngaged] = useState(false);

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

  const showLabel = isEngaged || isActive;
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
  const washOpacity = isActive ? (isEngaged ? 0.28 : 0.16) : isEngaged ? 0.4 : 0;
  const markerTransition = { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" as const };

  return (
    <g
      onPointerEnter={() => setIsEngaged(true)}
      onPointerLeave={() => setIsEngaged(false)}
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

      {/*
        The marker, not the fill, is what says "clickable". Liberia is
        14×17 viewBox units and Greece 21×28 — at section width those are
        a handful of pixels, so no fill treatment survives there.
      */}
      <g transform={`translate(${cx} ${cy})`} pointerEvents="none">
        <m.circle
          className={`${styles.markerRing} ${isHome ? styles.markerRingHome : ""}`}
          initial={false}
          animate={{ r: ringRadius, opacity: showLabel ? 1 : isHome ? 0.95 : 0.7 }}
          transition={markerTransition}
        />
        <m.circle
          className={`${styles.markerCore} ${isHome ? styles.markerCoreHome : ""}`}
          initial={false}
          animate={{ r: coreRadius }}
          transition={markerTransition}
        />
      </g>

      {/*
        Names stay hidden at rest: Greece, Turkey, Iraq, Iran and
        Afghanistan sit within 41 units of each other, so eleven permanent
        labels collide into noise at this scale.
      */}
      <m.text
        className={styles.markerLabel}
        x={cx}
        y={cy - MAP_MARKER.labelOffset}
        textAnchor="middle"
        initial={false}
        animate={{ opacity: showLabel ? 1 : 0, y: showLabel ? 0 : 4 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
        pointerEvents="none"
        aria-hidden="true"
      >
        {countryKey}
      </m.text>

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
        onFocus={() => setIsEngaged(true)}
        onBlur={() => setIsEngaged(false)}
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
