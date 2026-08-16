import { memo, type CSSProperties, type KeyboardEvent } from "react";
import { m, useReducedMotion } from "motion/react";

import type { InteractiveCountryKey } from "./country-data";
import type { CountryShape as CountryShapeModel } from "./map-geometry";
import { MAP_MOTION } from "./map-config";
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
  const isInteractive = Boolean(shape.interactiveKey);

  const selectCountry = () => {
    if (shape.interactiveKey) onSelect(shape.interactiveKey);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCountry();
    }
  };

  return (
    <m.g
      className={styles.countryTransform}
      initial={false}
      animate={{
        scale: isActive
          ? MAP_MOTION.activeCountryScale
          : isHome
            ? 1.015
            : 1,
      }}
      transition={reduceMotion ? { duration: 0 } : MAP_MOTION.spring}
      style={transformStyle}
    >
      <path
        d={shape.d}
        className={`${styles.countryBase} ${
          isHome
            ? styles.countryHomeBase
            : isInteractive
              ? styles.countryInteractiveBase
              : ""
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
                ? { opacity: 0.85 }
                : { opacity: [0.55, 0.95, 0.55] }
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

      {isInteractive ? (
        <m.g
          initial={false}
          animate={isActive ? "selected" : "rest"}
          whileHover="hover"
        >
          <m.path
            d={shape.d}
            className={styles.hoverLayer}
            variants={{
              rest: { opacity: 0 },
              selected: { opacity: 0.18 },
              hover: { opacity: isActive ? 0.34 : isHome ? 0.45 : 1 },
            }}
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
                    : {
                        opacity: [0, 0.72, 0],
                        scale: [0.94, 1.025, 1.11],
                      }
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

          <path
            d={shape.d}
            className={styles.hitTarget}
            onClick={selectCountry}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Show ${shape.interactiveKey} project details`}
            aria-pressed={isActive}
          />
        </m.g>
      ) : null}
    </m.g>
  );
}

/** Only the previous and next active countries re-render on selection. */
export const CountryShape = memo(CountryShapeComponent);
