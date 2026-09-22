export const MAP_VIEWBOX = {
  width: 1200,
  height: 600,
  padding: 26,
} as const;

/**
 * The geographic window the map is framed on, in degrees.
 *
 * Fitting the projection to the whole world spent roughly 40% of a
 * 100svh section on the Pacific and East Asia, where there are no
 * markets: the eleven that exist covered 1.3% of the frame and rendered
 * at 14–68 units across. This window is the footprint — Peru at 81°W
 * through Afghanistan at 75°E, Somalia at 2°S through Turkey at 42°N —
 * plus enough margin to keep continents reading as continents rather
 * than as cut-outs. Land outside it is still drawn and simply clipped by
 * the viewBox, so the frame keeps its global context at the edges.
 *
 * `centerLon` is the window's midpoint; the projection rotates by its
 * negation to put it on the vertical centre line.
 *
 * Measured against the atlas: this window puts 3.54% of the frame on
 * markets where fitting the world put 1.32%, and takes Liberia — the
 * smallest — from 17 units across to 28.
 */
export const MAP_FRAME = {
  west: -100,
  east: 92,
  south: -30,
  north: 52,
  centerLon: -4,
  /** Degrees between densified points along the window's edges. */
  step: 4,
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
  /** Clears the active ring (10.5) plus the label's own descender space. */
  labelOffset: 21,
} as const;

/**
 * Label metrics and candidate placements, in viewBox units.
 *
 * `charAdvance` and `capHeight` approximate the rendered text box so the
 * placement solver can test for overlap without a DOM. They are measured
 * against `.markerLabel` — 15px, weight 600, 0.1em tracking, uppercase —
 * and rounded up, because a slightly wide estimate costs a label its
 * first-choice slot while a narrow one lets two names collide.
 *
 * Candidates are tried in order. `anchor` is the SVG text-anchor, and dx
 * is measured from the marker centre.
 */
export const MAP_LABEL = {
  charAdvance: 11.4,
  capHeight: 11,
  boxPadding: 5,
  candidates: [
    { dx: 0, dy: -21, anchor: "middle" },
    { dx: 0, dy: 27, anchor: "middle" },
    { dx: 15, dy: 4, anchor: "start" },
    { dx: -15, dy: 4, anchor: "end" },
    { dx: 0, dy: -33, anchor: "middle" },
    { dx: 0, dy: 39, anchor: "middle" },
  ],
} as const;

export type LabelAnchor = (typeof MAP_LABEL.candidates)[number]["anchor"];

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
