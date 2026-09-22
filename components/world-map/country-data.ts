/**
 * Business content for interactive map markets.
 * Values are illustrative portfolio summaries — replace via CMS when ready.
 */
export const INTERACTIVE_COUNTRY_KEYS = [
  "Iran",
  "Iraq",
  "Turkey",
  "Greece",
  "Morocco",
  "Liberia",
  "Ghana",
  "Somalia",
  "Afghanistan",
  "Peru",
  "Colombia",
] as const;

export type InteractiveCountryKey =
  (typeof INTERACTIVE_COUNTRY_KEYS)[number];

/** Origin of the route arcs, and the one market badged as headquarters. */
export const HOME_COUNTRY: InteractiveCountryKey = "Iran";

export type CountryDetails = {
  readonly name: InteractiveCountryKey;
  readonly projects: number;
  readonly products: readonly string[];
  readonly firstCooperation: number;
};

export const COUNTRY_DATA = {
  Iran: {
    name: "Iran",
    projects: 400,
    products: [
      "Long rod composites",
      "Post insulators",
      "Transformer bushings",
    ],
    firstCooperation: 1998,
  },
  Iraq: {
    name: "Iraq",
    projects: 14,
    products: ["Suspension insulators", "Line post", "Creepage extenders"],
    firstCooperation: 2011,
  },
  Turkey: {
    name: "Turkey",
    projects: 11,
    products: ["Hybrid posts", "HV long rods", "Cable accessories"],
    firstCooperation: 2009,
  },
  Greece: {
    name: "Greece",
    projects: 6,
    products: ["Station posts", "Hybrid insulators", "Fittings"],
    firstCooperation: 2015,
  },
  Morocco: {
    name: "Morocco",
    projects: 9,
    products: ["Pollution-zone long rods", "Hybrid posts", "Covers"],
    firstCooperation: 2012,
  },
  Liberia: {
    name: "Liberia",
    projects: 4,
    products: ["MV composites", "Distribution posts", "Accessories"],
    firstCooperation: 2017,
  },
  Ghana: {
    name: "Ghana",
    projects: 7,
    products: ["Transmission long rods", "Line posts", "Bushings"],
    firstCooperation: 2014,
  },
  Somalia: {
    name: "Somalia",
    projects: 3,
    products: ["MV suspension", "Post insulators", "Field fittings"],
    firstCooperation: 2018,
  },
  Afghanistan: {
    name: "Afghanistan",
    projects: 12,
    products: ["HV long rods", "Hybrid posts", "Creepage covers"],
    firstCooperation: 2010,
  },
  Peru: {
    name: "Peru",
    projects: 12,
    products: ["High-altitude long rods", "Station posts", "Hybrid"],
    firstCooperation: 2008,
  },
  Colombia: {
    name: "Colombia",
    projects: 10,
    products: ["Transmission composites", "Hybrid posts", "Accessories"],
    firstCooperation: 2007,
  },
} as const satisfies Record<InteractiveCountryKey, CountryDetails>;

/**
 * Section-level figures, derived rather than written down.
 *
 * The stat rail under the map and the per-country cards have to agree; a
 * hand-typed total silently goes stale the first time a market is added
 * or a project count moves.
 */
export const PORTFOLIO_TOTALS = (() => {
  const entries = Object.values(COUNTRY_DATA);
  return {
    markets: entries.length,
    projects: entries.reduce((total, entry) => total + entry.projects, 0),
    since: Math.min(...entries.map((entry) => entry.firstCooperation)),
  };
})();

/** Natural Earth/world-atlas names are not guaranteed to match product copy. */
const WORLD_ATLAS_ALIASES: Readonly<Record<string, InteractiveCountryKey>> = {
  Iran: "Iran",
  Iraq: "Iraq",
  Turkey: "Turkey",
  Türkiye: "Turkey",
  Greece: "Greece",
  Morocco: "Morocco",
  Liberia: "Liberia",
  Ghana: "Ghana",
  Somalia: "Somalia",
  Afghanistan: "Afghanistan",
  Peru: "Peru",
  Colombia: "Colombia",
};

export function getInteractiveCountryKey(
  atlasName: string,
): InteractiveCountryKey | undefined {
  return WORLD_ATLAS_ALIASES[atlasName];
}
