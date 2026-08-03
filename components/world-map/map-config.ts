export const MAP_VIEWBOX = {
  width: 1200,
  height: 600,
  padding: 26,
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
