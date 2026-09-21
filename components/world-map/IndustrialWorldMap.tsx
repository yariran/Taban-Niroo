"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { LazyMotion, m, useReducedMotion } from "motion/react";

import {
  COUNTRY_DATA,
  type InteractiveCountryKey,
} from "./country-data";
import { CountryInfoCard } from "./CountryInfoCard";
import { CountryShape } from "./CountryShape";
import { COUNTRY_SHAPES, INTERACTIVE_SHAPES } from "./map-geometry";
import { MAP_MOTION, MAP_VIEWBOX } from "./map-config";
import styles from "./industrial-world-map.module.css";

const HOME_COUNTRY: InteractiveCountryKey = "Iran";

const loadMotionFeatures = () =>
  import("./motion-features").then((module) => module.default);

type IndustrialWorldMapProps = {
  /** Hide internal title block when the parent section already provides one. */
  embedded?: boolean;
  /**
   * Namespace for this instance's SVG gradient ids. Only needs passing if
   * a second map is ever mounted on the same document.
   */
  idPrefix?: string;
};

export function IndustrialWorldMap({
  embedded = false,
  idPrefix = "tn-world-map",
}: IndustrialWorldMapProps) {
  const [activeCountryKey, setActiveCountryKey] =
    useState<InteractiveCountryKey | null>(null);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  /*
    Fixed ids, not `useId()`.

    These four ids are referenced by `fill="url(#…)"` on paths rendered in
    the same pass, so server and client have to agree on them. `useId`
    encodes the component's position in the React tree, and this component
    sits behind a `next/dynamic` boundary — so the server and the client
    resolve it from different tree shapes and disagree. React reports the
    mismatch as an attribute it "won't patch up", which leaves the SSR
    markup pointing `fill` at a gradient id that no longer exists.

    The note in `collection-section.tsx` records the same failure being
    traced to a `<Beat>` wrapper and worked around by not adding one. That
    left the constraint in place: any edit that shifts this subtree brings
    the bug back, which is exactly what happened while reworking the
    markers. A constant cannot drift, and `idPrefix` keeps the escape
    hatch if a second instance is ever mounted.
  */
  const heatGradientId = `${idPrefix}-country-heat`;
  const ambientGradientId = `${idPrefix}-ambient-bloom`;
  const homeHeatGradientId = `${idPrefix}-home-heat`;
  const homeAmbientGradientId = `${idPrefix}-home-ambient`;

  const activeShape = activeCountryKey
    ? INTERACTIVE_SHAPES.get(activeCountryKey) ?? null
    : null;
  const homeShape = INTERACTIVE_SHAPES.get(HOME_COUNTRY) ?? null;
  const activeCountry = activeCountryKey
    ? COUNTRY_DATA[activeCountryKey]
    : null;

  const zoomOrigin = useMemo(() => {
    if (!activeShape) return "50% 50%";
    return `${(activeShape.centroid[0] / MAP_VIEWBOX.width) * 100}% ${(activeShape.centroid[1] / MAP_VIEWBOX.height) * 100}%`;
  }, [activeShape]);

  const selectCountry = useCallback((country: InteractiveCountryKey) => {
    setActiveCountryKey((current) => (current === country ? null : country));
  }, []);

  const clearCountry = useCallback(() => {
    setActiveCountryKey(null);
  }, []);

  /*
    Click-away lives on the map, not on an overlay. The info card used to
    ship a full-bleed scrim above the countries, so with a card open the
    markets behind it were unreachable and switching markets cost two
    clicks. Anything carrying `data-market` is a hit target and handles
    its own selection; everything else — ocean, unmarked land — clears.
  */
  const onMapClick = useCallback(
    (event: ReactMouseEvent<SVGSVGElement>) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-market]")) return;
      clearCountry();
    },
    [clearCountry],
  );

  useEffect(() => {
    if (!activeCountryKey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearCountry();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCountryKey, clearCountry]);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <section
        ref={rootRef}
        className={`${styles.shell} ${styles.shellFull} relative flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-2.5 md:p-3 ring-1 ring-brand-orange/10`}
        aria-label={
          embedded
            ? "Interactive project and partner map"
            : undefined
        }
      >
        <m.div
          aria-hidden="true"
          className={styles.gridTexture}
          animate={
            reduceMotion
              ? { opacity: 0.62, x: 0, y: 0 }
              : {
                  opacity: [0.42, 0.65, 0.42],
                  x: [0, 21, 0],
                  y: [0, 21, 0],
                }
          }
          transition={{ duration: 18, repeat: reduceMotion ? 0 : Infinity, ease: "linear" }}
        />

        {!embedded ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-8 md:px-12 lg:px-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-orange/80">
              Global delivery footprint
            </p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Power infrastructure cooperation network
            </h2>
          </div>
        ) : null}

        <div
          className={`${styles.mapViewport} ${styles.mapViewportFull} relative z-10 min-h-0 flex-1`}
        >
          <m.div
            className={`${styles.mapTransform} h-full w-full`}
            initial={false}
            animate={{ scale: activeShape ? MAP_MOTION.mapZoom : 1 }}
            transition={reduceMotion ? { duration: 0 } : MAP_MOTION.spring}
            style={{ transformOrigin: zoomOrigin }}
          >
            {/*
              `role="group"`, not `role="img"`.

              `img` declares the whole subtree to be a single flat
              graphic, which makes every focusable control inside it an
              error — axe reported `nested-interactive`,
              `no-focusable-content` and `aria-prohibited-attr` (serious)
              because the country shapes and the info card are real
              buttons. This map is an interactive control surface, so it
              is labelled as a group and its children stay reachable.
            */}
            <svg
              className="block h-full w-full"
              viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
              preserveAspectRatio="xMidYMid meet"
              role="group"
              aria-label="Interactive world map showing selected project markets"
              onClick={onMapClick}
            >
              <defs>
                <radialGradient
                  id={heatGradientId}
                  gradientUnits="userSpaceOnUse"
                  cx={activeShape?.centroid[0] ?? MAP_VIEWBOX.width / 2}
                  cy={activeShape?.centroid[1] ?? MAP_VIEWBOX.height / 2}
                  r="92"
                >
                  <stop offset="0%" stopColor="#f0c673" />
                  <stop offset="24%" stopColor="#e3b34e" />
                  <stop offset="64%" stopColor="#c99a34" />
                  <stop offset="100%" stopColor="#4a3610" />
                </radialGradient>
                <radialGradient id={ambientGradientId}>
                  <stop offset="0%" stopColor="#e3b34e" stopOpacity="0.34" />
                  <stop offset="42%" stopColor="#c99a34" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#e3b34e" stopOpacity="0" />
                </radialGradient>
                {/*
                  No white core. Starting this ramp at #f4f5f6 blew the
                  centre of the country out to paper-white, which reads as
                  an overexposed photograph rather than a marked market.
                  The ramp now stays inside the gold.
                */}
                <radialGradient
                  id={homeHeatGradientId}
                  gradientUnits="userSpaceOnUse"
                  cx={homeShape?.centroid[0] ?? MAP_VIEWBOX.width / 2}
                  cy={homeShape?.centroid[1] ?? MAP_VIEWBOX.height / 2}
                  r="70"
                >
                  <stop offset="0%" stopColor="#f0c673" />
                  <stop offset="30%" stopColor="#e3b34e" />
                  <stop offset="68%" stopColor="#c99a34" />
                  <stop offset="100%" stopColor="#4a3610" />
                </radialGradient>
                <radialGradient id={homeAmbientGradientId}>
                  <stop offset="0%" stopColor="#e3b34e" stopOpacity="0.26" />
                  <stop offset="45%" stopColor="#c99a34" stopOpacity="0.13" />
                  <stop offset="100%" stopColor="#e3b34e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/*
                r=110 enclosed ~38,000 unit² around a country measuring
                2,128 — an eighteen-fold halo, which is what turned into
                the unanchored smear over the Arabian Sea. 44 keeps the
                bloom inside Iran's own 68×60 footprint plus a margin.
              */}
              {homeShape ? (
                <m.circle
                  className={styles.homeBloom}
                  cx={homeShape.centroid[0]}
                  cy={homeShape.centroid[1]}
                  r="44"
                  fill={`url(#${homeAmbientGradientId})`}
                  animate={
                    reduceMotion
                      ? { opacity: 0.7, scale: 1 }
                      : {
                          opacity: [0.35, 0.62, 0.4],
                          scale: [0.94, 1.08, 1],
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 4.2,
                    repeat: reduceMotion ? 0 : Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
              ) : null}

              {activeShape && activeCountryKey !== HOME_COUNTRY ? (
                <m.circle
                  key={`ambient-${activeCountryKey}`}
                  className={styles.ambientBloom}
                  cx={activeShape.centroid[0]}
                  cy={activeShape.centroid[1]}
                  r="40"
                  fill={`url(#${ambientGradientId})`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.7, scale: 1 }
                      : {
                          opacity: [0.32, 0.66, 0.44],
                          scale: [0.86, 1.1, 1],
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 3.8,
                    repeat: reduceMotion ? 0 : Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
              ) : null}

              <g>
                {COUNTRY_SHAPES.map((shape) => (
                  <CountryShape
                    key={shape.id}
                    shape={shape}
                    isHome={shape.interactiveKey === HOME_COUNTRY}
                    isActive={shape.interactiveKey === activeCountryKey}
                    activeHeatGradientId={heatGradientId}
                    homeHeatGradientId={homeHeatGradientId}
                    onSelect={selectCountry}
                  />
                ))}
              </g>
            </svg>
          </m.div>

          {/*
            Was `text-slate-400/70` at 10px — ~4.2:1 on this ground,
            under the 4.5:1 floor for text this size — and it stayed up
            while a panel was open, instructing the reader to do the thing
            they had just done. Now it retires on selection.
          */}
          {!activeCountryKey ? (
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300 sm:flex">
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Select a highlighted market
            </p>
          ) : null}

          <CountryInfoCard country={activeCountry} onClose={clearCountry} />
        </div>
      </section>
    </LazyMotion>
  );
}
