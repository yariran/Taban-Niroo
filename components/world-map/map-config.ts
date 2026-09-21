export const MAP_VIEWBOX = {
  width: 1200,
  height: 600,
  padding: 26,
} as const;

/**
 * Marker geometry, in viewBox units.
 *
 * Country fill alone cannot carry the "this is clickable" signal here:
 * Liberia renders 14×17 units and Greece 21×28, so at any realistic
 * section width they are a few pixels of slightly-lighter grey. The
 * markers are the affordance; the tinted fill only groups them.
 *
 * `hitRadius` is sized off the same measurements — 16 units is ~28 CSS px
 * at the section's widest render, which clears the 24×24 minimum for the
 * smallest markets. The closest pair of interactive centroids (Iraq/Iran)
 * is 35 units apart, so discs of this radius never overlap.
 */
export const MAP_MARKER = {
  hitRadius: 16,
  ringRest: 6.5,
  ringHover: 9,
  ringActive: 10.5,
  coreRest: 2.4,
  coreHover: 3,
  coreActive: 3.4,
  labelOffset: 17,
} as const;

export const MAP_MOTION = {
  // Keep at 1 so selection never crops southern landmasses inside overflow:hidden.
  mapZoom: 1,
  activeCountryScale: 1.04,
  spring: {
    type: "spring",
    stiffness: 170,
    damping: 24,
    mass: 0.9,
  },
} as const;
