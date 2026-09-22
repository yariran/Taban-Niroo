import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

import {
  COUNTRY_DATA,
  getInteractiveCountryKey,
  HOME_COUNTRY,
  type InteractiveCountryKey,
} from "./country-data";
import {
  MAP_FRAME,
  MAP_LABEL,
  MAP_MARKER,
  MAP_VIEWBOX,
  type LabelAnchor,
} from "./map-config";

type AtlasProperties = {
  name?: string;
};

type AtlasTopology = Topology<{
  countries: GeometryCollection<AtlasProperties>;
}>;

export type CountryShape = {
  id: string;
  atlasName: string;
  d: string;
  centroid: readonly [number, number];
  interactiveKey?: InteractiveCountryKey;
};

/**
 * The framing window as a polygon d3 can fit against.
 *
 * Its edges are densified rather than drawn corner to corner: Natural
 * Earth is not cylindrical, so a parallel projects to a curve. A
 * four-point rectangle would be measured by its projected corners alone
 * and the fit would clip the bulge at the top and bottom of the window.
 *
 * Winding matters, and silently. d3 reads a spherical polygon's interior
 * from its direction of travel, so the ring has to run clockwise in
 * lon/lat — north edge west to east, down the east edge, and back. Wound
 * the other way it describes the whole sphere minus the window, and
 * `fitExtent` then returns the same scale for every window you give it,
 * with no error to say so.
 */
function buildFrameFeature(): Feature<Polygon> {
  const { west, east, south, north, step } = MAP_FRAME;
  const ring: [number, number][] = [];

  for (let lon = west; lon < east; lon += step) ring.push([lon, north]);
  for (let lat = north; lat > south; lat -= step) ring.push([east, lat]);
  for (let lon = east; lon > west; lon -= step) ring.push([lon, south]);
  for (let lat = south; lat < north; lat += step) ring.push([west, lat]);
  ring.push([west, north]);

  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [ring] },
  };
}

function buildCountryShapes(): readonly CountryShape[] {
  const topology = worldAtlas as unknown as AtlasTopology;
  const collection = feature(
    topology,
    topology.objects.countries,
  ) as FeatureCollection<Geometry, AtlasProperties>;

  // Antarctica is intentionally omitted. It is not a sovereign country,
  // and the framing window now crops it away regardless.
  const visibleFeatures = collection.features.filter(
    (country) => country.properties?.name !== "Antarctica",
  );

  // Fit the footprint window, not the whole world. Do not translate after
  // fitExtent — that pushes landmasses outside the viewBox.
  const projection = geoNaturalEarth1()
    .rotate([-MAP_FRAME.centerLon, 0])
    .fitExtent(
      [
        [MAP_VIEWBOX.padding, MAP_VIEWBOX.padding],
        [
          MAP_VIEWBOX.width - MAP_VIEWBOX.padding,
          MAP_VIEWBOX.height - MAP_VIEWBOX.padding,
        ],
      ],
      buildFrameFeature(),
    );

  const path = geoPath(projection);

  return Object.freeze(
    visibleFeatures.flatMap((country, index) => {
      const d = path(country);
      if (!d) return [];

      const atlasName = country.properties?.name ?? `Country ${index + 1}`;
      const rawCentroid = path.centroid(country);
      const centroid: readonly [number, number] = [
        Number.isFinite(rawCentroid[0]) ? rawCentroid[0] : MAP_VIEWBOX.width / 2,
        Number.isFinite(rawCentroid[1]) ? rawCentroid[1] : MAP_VIEWBOX.height / 2,
      ];

      return [
        Object.freeze({
          id: String(country.id ?? `${atlasName}-${index}`),
          atlasName,
          d,
          centroid,
          interactiveKey: getInteractiveCountryKey(atlasName),
        }),
      ];
    }),
  );
}

/** Built once at module load, so projection/path work is never repeated. */
export const COUNTRY_SHAPES = buildCountryShapes();

export const INTERACTIVE_SHAPES = new Map(
  COUNTRY_SHAPES.flatMap((shape) =>
    shape.interactiveKey ? [[shape.interactiveKey, shape] as const] : [],
  ),
);

export type MarketRoute = {
  key: InteractiveCountryKey;
  d: string;
};

/**
 * Supply routes drawn from the home country to every other market.
 *
 * Quadratic curves in projected space, not great circles: the point is
 * to read as "shipped from here to there", and a geodesic on Natural
 * Earth at this scale is close enough to straight that it reads as a
 * ruler line instead. The control point is offset perpendicular to the
 * chord and always toward the top of the frame, so the whole set bows
 * the same way rather than fanning at random.
 *
 * Curvature tapers with distance — a fixed ratio makes the Iran→Peru
 * arc, which is over twice as long as Iran→Iraq, balloon over Europe.
 */
function buildMarketRoutes(): readonly MarketRoute[] {
  const home = INTERACTIVE_SHAPES.get(HOME_COUNTRY);
  if (!home) return Object.freeze([]);

  const [x1, y1] = home.centroid;

  return Object.freeze(
    [...INTERACTIVE_SHAPES.entries()].flatMap(([key, shape]) => {
      if (key === HOME_COUNTRY) return [];

      const [x2, y2] = shape.centroid;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const span = Math.hypot(dx, dy);
      if (span === 0) return [];

      const curvature = span > 260 ? 0.12 : 0.2;
      /*
        Perpendicular to the chord is (dy, -dx)/span; its y component,
        -dx/span, points up only while dx is positive. Flipping the sign
        for westward routes keeps every arc bowing toward the top.
      */
      const offset = span * curvature;
      const sign = dx >= 0 ? 1 : -1;
      const cx = (x1 + x2) / 2 + (dy / span) * offset * sign;
      const cy = (y1 + y2) / 2 + (-dx / span) * offset * sign;

      return [
        Object.freeze({
          key,
          d: `M${x1.toFixed(2)},${y1.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`,
        }),
      ];
    }),
  );
}

export const MARKET_ROUTES = buildMarketRoutes();

export type MarketLabel = {
  key: InteractiveCountryKey;
  x: number;
  y: number;
  anchor: LabelAnchor;
};

type Box = { x0: number; y0: number; x1: number; y1: number };

function overlaps(a: Box, b: Box): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

/**
 * Standing label placement, solved once against the projected geometry.
 *
 * Showing names only on hover left the map anonymous at rest — eleven
 * unexplained dots — but eleven fixed labels collide: Greece, Turkey,
 * Iraq, Iran and Afghanistan sit inside 41 units of each other. So each
 * market takes the first candidate slot whose box clears every label
 * already placed, every marker, and the frame's padding.
 *
 * Markets are solved largest-portfolio first, so the ones carrying the
 * most weight get the slot directly above their marker and the crowded
 * neighbours take what is left. Anything that cannot be placed is left
 * out of the standing set and still gets its label on hover and
 * selection — better an incomplete map than an illegible one.
 *
 * Deterministic and computed at module load: the same eleven positions
 * render on the server and the client.
 */
function buildMarketLabels(): readonly MarketLabel[] {
  const placed: Box[] = [];
  const results: MarketLabel[] = [];

  // Every marker is an obstacle, including those whose label is placed
  // elsewhere — a name must not sit on top of another market's dot.
  const markerBoxes: Box[] = [...INTERACTIVE_SHAPES.values()].map((shape) => ({
    x0: shape.centroid[0] - MAP_MARKER.ringActive,
    y0: shape.centroid[1] - MAP_MARKER.ringActive,
    x1: shape.centroid[0] + MAP_MARKER.ringActive,
    y1: shape.centroid[1] + MAP_MARKER.ringActive,
  }));

  const order = [...INTERACTIVE_SHAPES.entries()].sort(
    ([a], [b]) => COUNTRY_DATA[b].projects - COUNTRY_DATA[a].projects,
  );

  for (const [key, shape] of order) {
    const width = key.length * MAP_LABEL.charAdvance;
    const [cx, cy] = shape.centroid;

    for (const candidate of MAP_LABEL.candidates) {
      const x = cx + candidate.dx;
      const y = cy + candidate.dy;

      const left =
        candidate.anchor === "middle"
          ? x - width / 2
          : candidate.anchor === "start"
            ? x
            : x - width;

      const box: Box = {
        x0: left - MAP_LABEL.boxPadding,
        y0: y - MAP_LABEL.capHeight - MAP_LABEL.boxPadding,
        x1: left + width + MAP_LABEL.boxPadding,
        y1: y + MAP_LABEL.boxPadding,
      };

      const insideFrame =
        box.x0 >= MAP_VIEWBOX.padding &&
        box.x1 <= MAP_VIEWBOX.width - MAP_VIEWBOX.padding &&
        box.y0 >= MAP_VIEWBOX.padding &&
        box.y1 <= MAP_VIEWBOX.height - MAP_VIEWBOX.padding;

      if (!insideFrame) continue;
      if (placed.some((other) => overlaps(box, other))) continue;
      if (markerBoxes.some((marker) => overlaps(box, marker))) continue;

      placed.push(box);
      results.push({ key, x, y, anchor: candidate.anchor });
      break;
    }
  }

  return Object.freeze(results);
}

export const MARKET_LABELS = buildMarketLabels();

/** Markets whose name is always on screen, so hover need not repeat it. */
export const STANDING_LABEL_KEYS = new Set(
  MARKET_LABELS.map((label) => label.key),
);
